# Registration and campus ambassador spreadsheets

The writer uses two separate worksheet tabs in the same spreadsheet:

- **Registrations**: student/event registrations, one row per event.
- **Campus Ambassadors**: one row per CA signup, including the generated referral
  code, name, email, mobile, gender, institution, degree, state, district, and
  society details. Passwords are never included.

## Activate the update on the existing spreadsheet

1. Open the spreadsheet’s **Extensions > Apps Script**. Replace `Code.gs` with
   [Code.gs](Code.gs) from this folder, keeping the correct `SPREADSHEET_ID`.
2. Save and run `setup` from the editor. It creates the Campus Ambassadors tab and
   formats both tabs, preserving existing registration rows. Unknown headers are
   rejected instead of overwritten. Do not run `doPost` manually in the editor.
3. Update the existing web app through **Deploy > Manage deployments > Edit >
   New version > Deploy**. Keep its `/exec` URL. New deployments must execute as
   the spreadsheet owner and allow anonymous submissions.
4. The CA server’s existing `REGISTRATION_SHEET_URL` handles both record types.
   Set `CA_SHEET_URL` only to override the CA destination with another deployment.
   If creating a new endpoint, use the production URL ending in `/exec`, not the
   spreadsheet URL or the editor-only `/dev` URL. Restart the backend if its
   environment configuration changes.
5. Once deployed, run `npm run sync:ca-sheet` from `CA_V2/server` to export
   existing CA accounts and recover any missed exports. Duplicate email addresses
   or referral codes are skipped in the CA tab, so this command is safe to rerun.
   Original signup timestamps are retained. The synthetic preview account is
   excluded from backfill.
6. Check a new CA signup in Campus Ambassadors and a participant registration in
   Registrations. The public readiness response only checks access; verify the
   actual sheet rows to confirm the deployed writer is working.

## Submission formats

The CA API sends `recordType: "campusAmbassador"` with an explicit allowlist of CA
fields. Apps Script routes it to Campus Ambassadors. Untyped registration rows
continue to use the existing flat registration format. Unknown record types are
rejected, so CA data cannot silently become participant rows.

The current registration portal uses `VITE_CA_API_URL` to save in the CA backend
and earn referral credits. The server also exports to Sheets. Its database is
saved before export; a failed sheet export does not delete the account. CA
exports can be recovered with `sync:ca-sheet`; there is no automatic retry queue.

For the standalone registration fallback, `VITE_GOOGLE_SHEET_API_URL` sends
requests directly to Apps Script with `no-cors`, which cannot confirm spreadsheet
writes to the browser. The connected CA-backend flow returns a readable API
response, confirming database persistence rather than sheet export success.

Headers, IST timestamps, Yes/No values, phone numbers stored as text, formula
escaping, and team-member normalization are handled by the writer. Existing
registration data is preserved. No payment or email workflow is added here.

## Tests

From the repository root, after building `CA_V2/server`:

```bash
node --test tests/ca-referrals.test.mjs tests/registration.test.mjs
```

Tests use a temporary database and local sheet stand-in. They never post test
entries to the real spreadsheet. Apps Script tests cover separate tabs, CA
routing, deduplication, validation, header preservation, and existing registrations.
