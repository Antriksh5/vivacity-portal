import test from 'node:test'
import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createServer } from 'node:http'

const cwd = fileURLToPath(new URL('../server/', import.meta.url))
test('CA referrals: signup, ownership, invalid codes, duplicates, events and sheet rows', async t => {
    const dir = await mkdtemp(join(tmpdir(), 'vivacity-ca-test-'))
    const rows = []
    const caRows = []
    const sheet = createServer(async (req, res) => {
        let body = ''
        for await (const chunk of req) body += chunk
        const payload = JSON.parse(body)
        if (payload.recordType === 'campusAmbassador') caRows.push(payload)
        else rows.push(payload)
        res.setHeader('Content-Type', 'application/json')
        res.end('{"ok":true}')
    })
    await new Promise(resolve => sheet.listen(0, '127.0.0.1', resolve))
    const port = 19000 + Math.floor(Math.random() * 10000)
    const apiEnv = {
        ...process.env, DB_DIALECT: 'sqlite', SQLITE_STORAGE: join(dir, 'test.sqlite'),
        PORT: String(port), HOST: '127.0.0.1', SECRET_TOKEN: 'local-integration-test-secret-only',
        CORS_ORIGINS: ' https://main.example.test , https://registration.example.test ',
        REGISTRATION_SHEET_URL: `http://127.0.0.1:${sheet.address().port}`,
        CA_SHEET_URL: '', SHEET_API1: '', SHEET_API_GDG_1: '', SHEET_API2: '', SHEET_API_GDG_2: '',
    }
    const child = spawn(process.execPath, ['dist/index.js'], {
        cwd, env: apiEnv, stdio: ['ignore', 'pipe', 'pipe'],
    })
    let output = ''
    child.stdout.on('data', data => { output += data })
    child.stderr.on('data', data => { output += data })
    t.after(async () => {
        child.kill()
        if (child.exitCode === null) await new Promise(resolve => child.once('exit', resolve))
        await new Promise(resolve => sheet.close(resolve))
        await rm(dir, { recursive: true, force: true })
    })
    const base = `http://127.0.0.1:${port}`
    let ready = false
    for (let attempt = 0; attempt < 60; attempt++) {
        try { ready = (await fetch(base + '/health')).ok } catch {}
        if (ready) break
        await new Promise(resolve => setTimeout(resolve, 100))
    }
    assert.ok(ready, output)
    for (const origin of ['https://main.example.test', 'https://registration.example.test']) {
        const response = await fetch(base + '/health', { headers: { Origin: origin } })
        assert.equal(response.headers.get('access-control-allow-origin'), origin)
    }
    const unknown = await fetch(base + '/health', { headers: { Origin: 'https://unlisted.example.test' } })
    assert.equal(unknown.headers.get('access-control-allow-origin'), null)
    async function post(path, data, token) {
        const response = await fetch(base + path, {
            method: 'POST', headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
            body: JSON.stringify(data),
        })
        return { status: response.status, body: await response.json() }
    }
    const password = 'PreviewTest1!'
    const signup = (email, phone) => ({
        personaldetails: { Name: 'Test Ambassador', Email: email, Phone: phone, Gender: 'MALE', CreatePass: password, ConfirmPass: password },
        collegedetails: { state: 'Rajasthan', district: 'Jaipur', collegename: 'Test College', degree: 'BTech', isSociety: 'No', society: '' },
    })
    assert.equal((await post('/auth/signup', {})).status, 400)
    const ca = await post('/auth/signup', signup('ca@example.test', '9000000001'))
    assert.equal(ca.status, 201)
    assert.match(ca.body.referral_code, /^[A-Z]{3}\d{3}$/)
    assert.equal(ca.body.candidate, undefined)
    const other = await post('/auth/signup', signup('other@example.test', '9000000002'))
    assert.equal(other.status, 201)
    assert.notEqual(other.body.referral_code, ca.body.referral_code)
    assert.equal(caRows.length, 2)
    assert.equal(caRows[0].recordType, 'campusAmbassador')
    assert.equal(caRows[0].referral, ca.body.referral_code)
    assert.equal(caRows[0].college, 'Test College')
    assert.equal(caRows[0].email, 'ca@example.test')
    assert.ok(Number.isFinite(Date.parse(caRows[0].registeredAt)))
    assert.equal(caRows[0].password, undefined)
    assert.equal(caRows[0].ConfirmPass, undefined)
    assert.equal((await post('/auth/login', { email: 'ca@example.test', password: 'wrong' })).status, 401)
    const login = await post('/auth/login', { email: 'CA@EXAMPLE.TEST', password })
    assert.equal(login.status, 201)
    assert.equal((await post('/user/getuser', {})).status, 401)
    const profile = () => post('/user/getuser', { encryp_key_sha256: '2' }, login.body.token)
    assert.equal((await profile()).body.email, 'ca@example.test', 'body ID cannot access another CA')
    const personaldetails = { name: 'Test Student', email: 'student@example.test', mobile: '9000000011', university: 'Test College', participant: false, referralCode: 'BAD000' }
    assert.equal((await post('/register/registerUser', { personaldetails, eventdetails: [] })).status, 404)
    personaldetails.referralCode = ' ' + ca.body.referral_code.toLowerCase() + ' '
    assert.equal((await post('/register/registerUser', { personaldetails, eventdetails: [] })).status, 201)
    assert.deepEqual((await profile()).body.referred_candidates, ['Test Student'])
    assert.equal((await post('/register/registerUser', { personaldetails, eventdetails: [] })).status, 409)
    assert.deepEqual((await profile()).body.referred_candidates, ['Test Student'])
    const event = { category: 'Music Events', eventName: 'Bandish', teamSize: '2', captain: true, teamName: 'Test Team', teamMembers: ['One', 'Two'] }
    const participant = { ...personaldetails, email: 'participant@example.test', mobile: '9000000012', name: 'Participant Student', participant: true }
    assert.equal((await post('/register/registerUser', { personaldetails: participant, eventdetails: [{ ...event, teamSize: '1' }] })).status, 400)
    assert.equal((await post('/register/registerUser', { personaldetails: participant, eventdetails: [event, { ...event, eventName: 'Aaroh' }] })).status, 201)
    assert.deepEqual((await profile()).body.referred_candidates, ['Test Student', 'Participant Student'])
    const noReferral = { ...personaldetails, email: 'visitor@example.test', mobile: '9000000013', referralCode: '' }
    assert.equal((await post('/register/registerUser', { personaldetails: noReferral, eventdetails: [] })).status, 201)
    assert.equal((await profile()).body.referred_candidates.length, 2)
    assert.equal(rows.length, 4)
    assert.equal(rows[0].referral, ca.body.referral_code)
    assert.equal(rows[0].isParticipant, 'no')
    assert.equal(rows[1].membersName, 'One, Two')
    assert.equal(rows[2].eventName, 'Aaroh')
    const sync = spawn(process.execPath, ['dist/sync-ca-sheet.js'], {
        cwd, env: apiEnv, stdio: ['ignore', 'pipe', 'pipe'],
    })
    let syncOutput = ''
    sync.stdout.on('data', chunk => { syncOutput += chunk })
    sync.stderr.on('data', chunk => { syncOutput += chunk })
    const exitCode = await new Promise((resolve, reject) => {
        sync.on('error', reject)
        sync.on('exit', resolve)
    })
    assert.equal(exitCode, 0, syncOutput)
    assert.equal(caRows.length, 4)
    assert.deepEqual(caRows.slice(2), caRows.slice(0, 2), 'backfill exports original CA details and signup times')
    assert.equal(rows.length, 4, 'CA backfill does not export participant rows')
})
