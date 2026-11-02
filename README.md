# Vivacity portals

The registration portal and the Campus Ambassador (CA) portal, with the server that connects them.

| Folder | What it is | Local URL |
| --- | --- | --- |
| `registration/` | Registration portal (React 19, Vite 7) | http://127.0.0.1:5173/registration |
| `ca-portal/` | Road to Vivacity landing page and CA portal (React 18, Vite 4) | http://127.0.0.1:5174 |
| `server/` | CA and registration API (Express, TypeScript) | http://127.0.0.1:8001/health |
| `google-apps-script/` | Google Sheet writer the server sends rows to | |
| `tests/` | Referral and sheet tests | |

## How they connect

- A CA signs up in `ca-portal`, which saves the account through `server`.
- The CA's referral link opens `registration` with `?ref=CODE` filled in.
- `registration` submits to `server`, which credits the CA and writes the row to the Google Sheet.
- The registration logo and CA Portal links go back to `ca-portal`.

## Run locally

Use Node 22 (`.nvmrc`). The env files are already in place. Open three terminals:

```bash
cd server && npm install && NODE_OPTIONS=--network-family-autoselection-attempt-timeout=2000 npm run dev
cd registration && npm install && npm run dev
cd ca-portal && npm install && npm run dev
```

The local server uses the real `REGISTRATION_SHEET_URL`, so a test registration writes to the real Google Sheet. Remove that line from `server/.env` while testing if you don't want that.

`NODE_OPTIONS` gives Node longer to connect to Google. Without it, about half of the connections failed on the development network, and the server logged `Spreadsheet export failed` even though the data was saved in the database. It can't go in `server/.env`, because Node reads it before that file loads. Use the same setting with `npm run sync:ca-sheet`.

To run the tests, build the server first:

```bash
(cd server && npm run build) && node --test tests/*.mjs
```

## Env files

| File | Purpose | Committed |
| --- | --- | --- |
| `registration/.env.local` | Local values | No |
| `ca-portal/.env.local` | Local values | No |
| `server/.env` | Local values, including the private `SECRET_TOKEN` | No |
| `*/.env.example` | Local reference | Yes |
| `*/.env.production.example` | Values to set on each host | Yes |

Vite bakes `VITE_` values in at build time, so rebuild a portal after changing them. They are public: never put a secret in one.

`.env.local` is also read by `vite build`. If you build on your own machine or server rather than on a host like Vercel, put the production values in it first, or the build will point at `127.0.0.1`.

## Deploy

Deploy the API first, because both portals need its URL.

1. **API:** root directory `server`. Build with `npm ci --include=dev && npm run build`, start with `npm start`, health check at `/health`. Set the values from `server/.env.production.example`, including `NODE_OPTIONS`, as host environment variables.
2. **Registration:** root directory `registration`. Build with `npm ci && npm run build`, publish `dist`. Set the values from `registration/.env.production.example`.
3. **CA portal:** root directory `ca-portal`. Build with `npm ci && npm run build`, publish `dist`. Set the values from `ca-portal/.env.production.example`.
4. Put the real portal origins in the API's `CORS_ORIGINS`, and the real URLs in both portals' env values. Then redeploy all three.

Both portals include a `vercel.json` that sends direct links to `index.html`. On any other host, set up the same fallback.

`render.yaml` is for a **disposable test only**: it keeps SQLite in `/tmp`, so accounts are lost on every restart. For the live site, keep the SQLite file in a folder that survives restarts and redeploys, and back it up. Logins and referral codes depend on it.

## Check after deploying

1. Open the CA portal and click Register Now. It should stay on your public URLs.
2. Create a test CA, log in, and open its referral link.
3. Register a test student with that code, and confirm the CA gets the credit.
4. Confirm the CA and the student appear as separate rows on the Campus Ambassadors and Registrations tabs.
5. Refresh `/registration` and `/userprofile` directly. Neither should return a 404.
6. Restart the API, and confirm the accounts and referrals are still there.
