# PTSC M&C Sports Day 2026 🏆

A complete, production-ready full-stack website for the **PTSC M&C Sports Day 2026** event (celebrating 25 years, 2001–2026). Built as a recreation of the reference site at `ptsc.pikoclub.com`.

- **Frontend:** React 18 + Vite + React Router (responsive, SEO-optimized, VI/EN bilingual)
- **Backend:** Express (`server.js`) with a clean JSON API, one handler module per endpoint
- **Deploy target:** Render (via `render.yaml`)

---

## ✨ Features

| Page | Route | What it does |
|------|-------|--------------|
| Home | `/` | Hero banner, live countdown timer, animated stat counters, sports preview |
| Leaderboard | `/leaderboard` | Medal table ranked by computed points (Gold×3, Silver×2, Bronze×1) |
| Gallery | `/gallery` | Photo gallery with day filter |
| Sports | `/sports` | All disciplines with format, team count, and venue |
| Schedule | `/schedule` | Match schedule with day + status (live/upcoming/finished) filters |
| Login | `/login` | Admin login backed by a serverless auth function |

Plus: responsive mobile menu, language toggle (Vietnamese/English), 404 page, loading/error states everywhere, and accessibility (focus styles, reduced-motion support, ARIA roles).

---

## 📁 Project structure

```
ptsc-sports/
├── package.json              # Dependencies + scripts
├── server.js                 # Express server (serves API + built frontend) — Render entry point
├── render.yaml                # Render service config
├── vite.config.js            # Vite config + /api dev proxy + vendor splitting
├── .env.example              # Environment variable template
├── .gitignore
├── .eslintrc.cjs / .eslintignore
├── index.html                # HTML shell with SEO + OG meta + font preloads
│
├── public/                   # Static assets copied as-is
│   ├── favicon.svg
│   └── robots.txt
│
├── data/
│   └── eventData.js          # ⭐ Single source of truth for all event data
│
├── functions/                # 🔧 Backend handlers (one file per endpoint, mounted by server.js)
│   ├── _shared.js            # Shared response/CORS helpers
│   ├── stats.js              # GET /api/stats
│   ├── sports.js             # GET /api/sports
│   ├── teams.js              # GET /api/teams
│   ├── leaderboard.js        # GET /api/leaderboard
│   ├── schedule.js           # GET /api/schedule
│   ├── gallery.js            # GET /api/gallery
│   └── login.js              # POST /api/login
│
└── src/                      # ⚛️ React frontend
    ├── main.jsx              # Entry point (mounts router + providers)
    ├── App.jsx               # Layout shell + routes
    ├── context/
    │   └── LanguageContext.jsx   # VI/EN i18n
    ├── hooks/
    │   └── useFetch.js           # Generic data-loading hook
    ├── utils/
    │   └── api.js                # Central API client (all fetch calls)
    ├── components/
    │   ├── Navbar.jsx + .css     # Responsive nav + mobile menu
    │   ├── Footer.jsx + .css
    │   ├── Countdown.jsx + .css  # Live countdown timer
    │   └── States.jsx            # Loading / Error / Empty
    ├── pages/
    │   ├── Home.jsx + .css
    │   ├── Leaderboard.jsx
    │   ├── Sports.jsx
    │   ├── Schedule.jsx
    │   ├── Gallery.jsx
    │   ├── Login.jsx + .css
    │   └── NotFound.jsx
    └── styles/
        ├── global.css            # Design tokens + resets + shared UI
        └── pages.css             # Shared inner-page styles
```

---

## 🔌 API reference

All endpoints return a JSON envelope: `{ "success": true, "data": ... }` or `{ "success": false, "error": "..." }`.

| Method | Endpoint | Query params | Returns |
|--------|----------|--------------|---------|
| GET | `/api/stats` | — | Event meta + counts (sports, days, teams, athletes, matches) |
| GET | `/api/sports` | — | Array of sports disciplines |
| GET | `/api/teams` | — | Array of competing teams |
| GET | `/api/leaderboard` | — | Teams ranked by points (computed server-side) |
| GET | `/api/schedule` | `day`, `status`, `sport` | Matches, enriched with team/sport names |
| GET | `/api/gallery` | `day` | Gallery items |
| POST | `/api/login` | body: `{ username, password }` | `{ token, user }` on success |

> In production, `server.js` mounts each handler in `functions/` directly on `/api/*` (see `server.js`).

---

## 🚀 Getting started (local development)

### Prerequisites
- **Node.js 18+**

### 1. Install dependencies
```bash
npm install
```

### 2. Set up environment variables
```bash
cp .env.example .env
# then edit .env as needed
```

### 3. Run the dev server

**Option A — Full stack (recommended):** run the API server and the Vite dev server side by side (two terminals).
```bash
npm start                    # terminal 1 — API on http://localhost:3000
npm run dev                  # terminal 2 — frontend on http://localhost:5173 (proxies /api → :3000)
```

**Option B — Frontend only:** `npm run dev` alone serves the UI, but `/api` calls will fail (`ECONNREFUSED`) unless the server from Option A is also running.

### 4. Build for production
```bash
npm run build      # outputs to dist/
npm run preview    # preview the production build locally
```

### Demo login credentials
```
username: admin
password: ptsc2026
```
(Change these via `ADMIN_USERNAME` / `ADMIN_PASSWORD` env vars.)

---

## ☁️ Deploying to Render

1. Push this project to a GitHub/GitLab repository.
2. In Render: **New → Blueprint** → pick your repo. Render auto-detects `render.yaml`:
   - **Build command:** `npm run build`
   - **Start command:** `node server.js`
3. Add environment variables under **Service → Environment** (see below).
4. **Deploy.** Done. ✅

### Required environment variables (set in Render dashboard)
| Variable | Example | Notes |
|----------|---------|-------|
| `VITE_API_BASE_URL` | `/api` | Frontend API base path |
| `VITE_EVENT_DATE` | `2026-04-18T08:00:00+07:00` | Countdown target |
| `AUTH_SECRET` | *(random 32+ chars)* | `openssl rand -hex 32` |
| `ADMIN_USERNAME` | `admin` | Login user |
| `ADMIN_PASSWORD` | *(strong password)* | Login password |

> Only `VITE_`-prefixed vars are exposed to the browser. The rest stay server-side.

---

## 🛠️ Tech & best practices

- **Performance:** vendor-code splitting, gzip ~60 kB total, long-cache headers on fingerprinted assets, edge caching on API GETs.
- **SEO:** semantic HTML, meta description, Open Graph tags, `robots.txt`, `lang="vi"`.
- **Maintainability:** one function per endpoint, a single API client, a shared data module (swap `data/eventData.js` for a real database without touching the frontend).
- **Accessibility:** focus-visible outlines, ARIA roles on dynamic regions, `prefers-reduced-motion` support, keyboard-navigable menu.

### Swapping in a real database
Every serverless function imports from `data/eventData.js`. To use a database (Postgres, Mongo, Supabase, etc.), replace the exported arrays in that file — or the imports inside each function — with your queries. The API contract and frontend stay unchanged.

---

## 📜 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Vite dev server (frontend only) |
| `npm start` | Express server (API + built frontend) — same as production |
| `npm run build` | Production build → `dist/` |
| `npm run preview` | Preview the production build |
| `npm run lint` | Lint source code |

---

## 📝 License

Demo project created for the PTSC M&C Sports Day 2026 event.
