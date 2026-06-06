# AGENTS.md — gruas

Guidance for AI coding agents (Antigravity Gemini, Claude Code, etc.) working in this repo.

## Project
- **Name:** `gruas-app` (US Towing Services)
- **Type:** PWA — roadside assistance / towing dispatch platform.
- **Stack:** React 18 + Vite 5 frontend, Express 4 + better-sqlite3 backend, native WebSocket for realtime, Stripe for payments, Twilio for SMS, Nodemailer for email, Google OAuth + JWT for auth, Leaflet for maps.
- **Deploy:** Render (`render.yaml`). Production calls `npm start` which runs `server/init_prod.js` then `server/index.js`.

## Layout
```
src/                 # React frontend
  App.jsx, main.jsx
  apps/, components/, context/, data/, pages/, services/, utils/

server/              # Express backend
  index.js           # entry — mounts middleware + routes + WS
  db.js              # better-sqlite3 connection
  websocket.js       # ws server
  init_prod.js       # ensures admin user on prod boot — DO NOT make destructive
  seed.js            # dev seed
  wipe.js            # DESTRUCTIVE — wipes DB. Never call from prod paths.
  middleware/        # auth.js (JWT), roles.js (RBAC)
  routes/            # admin, auth, drivers, jobs, notifications, payments, pricing, stripe
  services/          # geo, mailer, notifications, sms (Twilio)
  uploads/           # multer-uploaded avatars + job photos (gitignored)

public/              # static assets (PWA icons logo-192/512.png)
dist/                # vite build output
```

## Scripts
- `npm run dev` — Vite dev server on **5173**, proxies `/api`, `/uploads`, `/ws` to `http://localhost:3001`
- `npm run server` — backend on **3001** with `.env` auto-loaded via `node --env-file=.env`
- `npm run dev:all` — both via `concurrently` (preferred while coding)
- `npm run build` / `npm run preview` — production build / preview
- `npm run seed` — seed the dev SQLite DB
- `npm start` — production boot (used by Render)

## Conventions
- **Module type:** ESM (`"type": "module"` in package.json). Use `import`/`export`, not `require`. CommonJS allowed only in `*.cjs` (e.g. `create_admin.cjs`).
- **Indentation:** 2 spaces. Single quotes for JS. Trailing newlines on save (Prettier handles it).
- **React:** function components + hooks only. No class components. Lucide-react for icons. Tailwind for styling — keep classes inline, do not extract to CSS unless reused 3+ times.
- **Backend errors:** routes return `{ error: '...' }` with appropriate status; never leak stack traces in production. `helmet`, `hpp`, `xss-clean`, `express-rate-limit` are already applied — leave them.
- **Auth:** JWT via `server/middleware/auth.js`; role checks via `server/middleware/roles.js`. Two roles: `admin`, `driver`. Don't bypass middleware to "make it work."
- **DB:** better-sqlite3, synchronous API. Use prepared statements. Two DB files coexist (`database.sqlite`, `server/gruas.db` with WAL) — confirm which is active by reading `server/db.js` before changes.
- **Realtime:** `server/websocket.js` broadcasts job/admin events. Frontend connects via `/ws` proxy.

## Hard rules — DON'T
- ❌ Don't run `server/wipe.js` or `database.sqlite` deletion — it wipes everything.
- ❌ Don't modify `server/init_prod.js` to drop tables. It only ensures the admin user exists.
- ❌ Don't commit `.env`, `server/uploads/`, `*.db`, `*.db-wal`, `*.db-shm`.
- ❌ Don't add a phone-verification gate to the registration flow — it was removed intentionally (see commit `ffcd3e58`).
- ❌ Don't disable PWA service worker registration — recently added (`93fab661`).
- ❌ Don't replace `better-sqlite3` with `sqlite3` (async) — synchronous API is intentional.

## Required env vars (`.env`)
JWT_SECRET, GOOGLE_CLIENT_ID, STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER, SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, PORT (defaults 3001), NODE_ENV.

## Verifying changes
1. Start dev: `npm run dev:all`
2. Frontend: http://localhost:5173 — login flow goes straight to dashboard (no phone verify).
3. Backend health: `curl http://localhost:3001/api/health` (or whatever route exists).
4. Browser console + server stdout should be clean of new errors before claiming "done."

## Commit style
Match the existing log:
- `Fix: ...` for bug fixes
- `Add: ...` for new features
- `Convert / Remove / Update: ...` for refactors
Short imperative title (under 70 chars). No `Co-Authored-By` lines unless explicitly asked.
