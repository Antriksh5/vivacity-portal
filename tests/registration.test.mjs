import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import vm from 'node:vm'
import test from 'node:test'
import { normalizeTeamMembers, parseTeamMembers, isValidTeamSize, cleanText } from '../registration/src/utils/registrationData.js'

const source = readFileSync(new URL('../google-apps-script/Code.gs', import.meta.url), 'utf8')
const legacy = ['timestamp', 'name', 'email', 'phone', 'college', 'referral', 'isParticipant', 'eventCat', 'eventName', 'teamSize', 'isCaptain', 'teamName', 'membersName']

function sheetHarness(initialRows = [], initialCaRows = []) {
    const rows = structuredClone(initialRows)
    const styles = []
    const caRows = structuredClone(initialCaRows)
    function makeSheet(rows) { return {
        getLastRow: () => rows.length,
        getMaxRows: () => 1000,
        getBandings: () => [],
        getFilter: () => null,
        getRange(row, col, height, width) {
            let range
            range = new Proxy({}, { get(_, method) {
                if (method === 'getValues') return () => Array.from({ length: height }, (_, offset) =>
                    Array.from({ length: width }, (_, index) => rows[row - 1 + offset]?.[col - 1 + index] ?? ''))
                if (method === 'setValues') return values => {
                    values.forEach((valuesRow, offset) => { rows[row - 1 + offset] = [...valuesRow] })
                    return range
                }
                return (...args) => { styles.push([method, ...args]); return range }
            } })
            return range
        },
        setFrozenRows: value => styles.push(['frozenRows', value]),
        setRowHeight: () => {},
        setColumnWidth: () => {},
    } }
    const sheets = { Registrations: makeSheet(rows) }
    if (caRows.length) sheets['Campus Ambassadors'] = makeSheet(caRows)
    const context = vm.createContext({
        SpreadsheetApp: { openById: () => ({
            getSheetByName: name => sheets[name],
            insertSheet: name => { assert.equal(name, 'Campus Ambassadors'); return sheets[name] = makeSheet(caRows) },
        }), flush: () => {} },
        LockService: { getScriptLock: () => ({ waitLock() {}, releaseLock() {} }) },
        Utilities: { formatDate: (_, timezone) => { assert.equal(timezone, 'Asia/Kolkata'); return '25 Oct 2026, 12:00:00' } },
        ContentService: { MimeType: { JSON: 'json' }, createTextOutput: text => ({ setMimeType: () => JSON.parse(text) }) },
    })
    vm.runInContext(source, context)
    return { context, rows, caRows, styles }
}

const payload = {
    name: '  Aarav   Sharma ', email: ' TEST@EXAMPLE.COM ', phone: '0123456789', college: ' My   College ',
    referral: '', isParticipant: 'yes', eventCat: 'Fashion Events', eventName: 'Vogue',
    teamSize: '3', isCaptain: 'no', teamName: ' My   Team ', membersName: ' Aarav,  Diya ;\n Kabir,, '
}
const request = data => ({ postData: { contents: JSON.stringify(data) } })

test('Apps Script helpers tolerate missing arguments without bypassing required fields', () => {
    const { context, rows, caRows } = sheetHarness()
    assert.equal(context.cleanText(), '')
    assert.equal(context.cleanText(null), '')
    assert.equal(context.cleanText('  My   College '), 'My College')
    assert.equal(context.parseTeamMembers().length, 0)
    assert.equal(context.parseTeamMembers(null).length, 0)
    const missingName = { ...payload }
    delete missingName.name
    assert.throws(() => context.doPost(request(missingName)), /Required: name/)
    assert.equal(rows.length, 0)
    assert.equal(caRows.length, 0)
})

test('member names tolerate mixed separators, extra spaces, and empty entries', () => {
    assert.equal(normalizeTeamMembers(payload.membersName), 'Aarav, Diya, Kabir')
    assert.equal(normalizeTeamMembers(' ,;\n  '), '')
    assert.deepEqual(parseTeamMembers("  Anne-Marie   D’Souza, Jo Li "), ['Anne-Marie D’Souza', 'Jo Li'])
    assert.equal(cleanText(' My   College '), 'My College')
})

test('team size must be a positive safe whole number', () => {
    for (const value of ['', '0', '-2', '1.5', '3 people', '9007199254740992']) assert.equal(isValidTeamSize(value), false)
    for (const value of ['1', ' 3 ', '25']) assert.equal(isValidTeamSize(value), true)
})

test('setup migrates legacy headers, styles them, and preserves existing data', () => {
    const existing = ['2026-10-25T12:00:00Z', ...Array(12).fill('sample')]
    const { context, rows, styles } = sheetHarness([legacy, existing])
    context.setup()
    assert.equal(rows[0][1], 'Full Name')
    assert.equal(rows[0][12], 'Team Members')
    assert.deepEqual(rows[1], existing)
    assert.ok(styles.some(call => call[0] === 'setBackground' && call[1] === '#17365d'))
    context.setup()
    assert.equal(rows.length, 2)
})

test('unrecognized headers are rejected without overwriting data', () => {
    const initial = [['custom heading']]
    const { context, rows } = sheetHarness(initial)
    assert.throws(() => context.setup(), /Unrecognized headers/)
    assert.deepEqual(rows, initial)
})

test('server saves normalized names, readable flags and phone as text', () => {
    const { context, rows } = sheetHarness()
    assert.equal(context.doPost(request(payload)).ok, true)
    assert.equal(rows[1][1], 'Aarav Sharma')
    assert.equal(rows[1][2], 'test@example.com')
    assert.equal(rows[1][3], '0123456789')
    assert.equal(rows[1][6], 'Yes')
    assert.equal(rows[1][10], 'No')
    assert.equal(rows[1][11], 'My Team')
    assert.equal(rows[1][12], 'Aarav, Diya, Kabir')
})

test('server rejects invalid sizes and too many names before writing rows', () => {
    for (const teamSize of ['0', '2', '2.5', '-1']) {
        const { context, rows } = sheetHarness()
        assert.throws(() => context.doPost(request({ ...payload, teamSize })))
        assert.equal(rows.length, 0)
    }
})

test('optional members and nonparticipants remain supported; formulas stay text', () => {
    const { context, rows } = sheetHarness()
    context.doPost(request({ ...payload, membersName: '', name: '=1+1' }))
    assert.equal(rows[1][1], "'=1+1")
    context.doPost(request({ ...payload, isParticipant: 'no', teamSize: '', isCaptain: '', membersName: '' }))
    assert.equal(rows[2][6], 'No')
})

const caPayload = {
    recordType: 'campusAmbassador', registeredAt: '2026-10-30T10:00:00.000Z',
    name: '  Campus   Ambassador ', email: ' CA@EXAMPLE.COM ', phone: '0123456789',
    gender: 'FEMALE', college: ' My   College ', degree: 'BTech',
    state: 'Rajasthan', district: 'Jaipur', isSociety: 'yes', society: '=1+1', referral: 'abc123',
}

test('setup creates a separate CA tab and preserves existing registration rows', () => {
    const { context, rows, caRows } = sheetHarness()
    context.setup()
    assert.equal(rows[0][12], 'Team Members')
    assert.equal(caRows[0][11], 'Referral Code')
    assert.equal(caRows[0][4], 'Gender')
    context.setup()
    assert.equal(rows.length, 1)
    assert.equal(caRows.length, 1)
})

test('CA rows stay separate, normalize values, and deduplicate repeated exports', () => {
    const { context, rows, caRows } = sheetHarness()
    context.doPost(request(payload))
    const registrations = structuredClone(rows)
    assert.equal(context.doPost(request(caPayload)).sheet, 'Campus Ambassadors')
    assert.deepEqual(rows, registrations)
    assert.equal(caRows.length, 2)
    assert.equal(caRows[1][1], 'Campus Ambassador')
    assert.equal(caRows[1][2], 'ca@example.com')
    assert.equal(caRows[1][3], '0123456789')
    assert.equal(caRows[1][5], 'My College')
    assert.equal(caRows[1][9], 'Yes')
    assert.equal(caRows[1][10], "'=1+1")
    assert.equal(caRows[1][11], 'ABC123')
    assert.equal(context.doPost(request(caPayload)).duplicate, true)
    assert.equal(context.doPost(request({ ...caPayload, email: 'other@example.com' })).duplicate, true)
    assert.equal(caRows.length, 2)
})

test('invalid CA payloads and unknown types never reach either tab', () => {
    for (const changes of [{ phone: '123' }, { referral: 'invalid' }, { gender: 'invalid' },
        { isSociety: '' }, { college: '' }, { registeredAt: 'invalid' }, { recordType: 'unknown' }]) {
        const { context, rows, caRows } = sheetHarness()
        assert.throws(() => context.doPost(request({ ...caPayload, ...changes })))
        assert.equal(rows.length, 0)
        assert.equal(caRows.length, 0)
    }
})

test('unknown existing CA headers are preserved', () => {
    const initial = [['Custom CA heading'], ['Existing CA data']]
    const { context, caRows } = sheetHarness([], initial)
    assert.throws(() => context.doPost(request(caPayload)), /Unrecognized Campus Ambassadors headers/)
    assert.deepEqual(caRows, initial)
})
