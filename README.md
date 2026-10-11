# Mi Predict 2.0 — Frontend

React 19 + Vite 8 + Tailwind CSS 4 score-line prediction app. Production frontend: **https://mipredict.com** (Cloudflare Pages). Backend setup, environment and deployment: see [`server/README.md`](../server/README.md).

## Local development

```bash
npm install
cp .env.example .env.local        # VITE_API_URL=http://localhost:3000
npm run dev                       # http://localhost:5173
```

- The app calls the API at `VITE_API_URL` (origin only — service modules append `/api`). Requests use `credentials: "include"`.
- For local development, run the backend too (see `server/README.md`) and keep `FRONTEND_URL` on the server set to `http://localhost:5173`.

## Environment

| Variable | Local | Production (Cloudflare Pages) |
| --- | --- | --- |
| `VITE_API_URL` | `http://localhost:3000` | `https://api.mipredict.com` |

`.env`, `.env.*` and `.env.local` are gitignored. `npm run build` aborts with a clear error if `VITE_API_URL` is missing in a production build, instead of silently building with the wrong upstream URL.

## Checks, build and tests

```bash
npm run lint      # ESLint
npm run build     # Vite production build -> dist/
npm test          # (backend only — see server/README.md)
```

## Authentication & CSRF (how it works here)

- Session cookie (`HttpOnly`) is set by the API on `api.mipredict.com`.
- CSRF uses a double-submit token: the API sets an `XSRF-TOKEN` cookie and echoes the token in API responses (`GET /api/auth/me`, signup, login, logout). `client/src/services/api.js` keeps the token in memory, attaches it as `X-CSRF-Token` on state-changing requests, refreshes it on rotation, and retries once on a 403 caused by another tab rotating the token. Nothing session-related is stored in `localStorage`/`sessionStorage`.
- Cookies flow cross-origin because the API uses `SameSite=None; Secure` cookies in production, plus a single-origin CORS allow-list that includes `https://mipredict.com`.

## Cloudflare Pages configuration

- Build command: `npm run build`
- Build output directory: `dist`
- Production environment variable: `VITE_API_URL=https://api.mipredict.com`
- The repo ships a Cloudflare Pages Function at `client/functions/api/subscribe.js` used by the landing page email signup. If you keep it, bind a D1 database named `DB` with a `launch_signups` table (`email TEXT UNIQUE`).

## Deployment smoke checklist

After deploying the frontend and API:

1. Open https://mipredict.com.
2. Register a throwaway test account (delete it after testing).
3. Confirm login succeeds.
4. Refresh the page — the session must be restored.
5. Log out — a reload must show the logged-out UI.
6. While logged out, open Predictions — submission must be blocked client-side and the server must reject unauthenticated POSTs.
7. Log in and submit a prediction for a valid scheduled test match.
8. Verify the prediction appears in history and on the dashboard.
9. Load the leaderboard and your profile.
10. DevTools → Network: no CORS errors, no blocked cookies, no failed CSRF validation, no unexpected 5xx; `X-CSRF-Token` present on POSTs; API calls go to `https://api.mipredict.com`.