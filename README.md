# Dibba Sports & Cultural Club (Dibba SCC) — 2026 Luxury Digital Platform

Official next-generation digital platform for **Dibba Sports & Cultural Club (نادي دبا الرياضي الثقافي)**, founded in 1967 in Dibba Al Fujairah, United Arab Emirates.

## Live Showcase

* **Live Showcase (Netlify):** [https://dibba-ui-demo.netlify.app](https://dibba-ui-demo.netlify.app)
* **GitHub Repository:** [https://github.com/Allrounder687/Dibba-UI-Demo](https://github.com/Allrounder687/Dibba-UI-Demo)
* **1-Click Deploy:**
  [![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/Allrounder687/Dibba-UI-Demo)
  [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FAllrounder687%2FDibba-UI-Demo)

---

## What Was Built (Full Feature Showcase)

### 1. Luxury Playable Fan Experience (`/en` & `/ar` Native RTL)
* **Cinematic Floodlight Hero & Live Matchday Countdown:** Real-time ticking `Days : Hrs : Min : Sec` kickoff clock (`LuxuryHeroSection.tsx`) with stadium floodlight aura and quick links to the Tactical XI Builder and Kit Studio.
* **Playable Tactical Starting XI Builder (`/teams` & Homepage):** Interactive Dibba Stadium turf pitch (`TacticalPitchBuilder.tsx`) supporting `4-3-3`, `4-2-3-1`, and `3-5-2` formations, click-to-swap squad slots, animated Team Chemistry / Attack / Defense indices, and direct Player Dossier inspection.
* **3D Holographic Squad Cards & Dossier Cycling:** Mouse-tracked 3D perspective tilt cards (`LuxuryPlayerCard.tsx`) with gold/electric-blue specular foil reflection, giant watermark jersey numbers, transparent player cutouts, and Prev/Next player dossier modal navigation (`SquadExplorer.tsx`).
* **2026 Custom Kit Studio (`/shop`):** Interactive 3D-tilt jersey pedestal (`KitCustomizerStudio.tsx`) allowing fans to toggle Home/Away 2026 Uhlsport kits, preview custom back-print names and squad numbers live, pick sizes (`S`–`XXL`), and lock custom specs straight into the reservation form.
* **Interactive Dibba Stadium Bowl (`/tickets`):** Clickable stadium stand selector (`StadiumSeatSelector.tsx`) highlighting VIP Royal Box, Main East Stand, and North Ultras Curve tiers with one-click reservation pre-fill.
* **Matchday Fan Predictor & Season Telemetry (`/matches`):** Interactive Home/Draw/Away fan poll inside upcoming fixture modals, live season rank/points/GD/form telemetry bar, and dynamic UAE First Division standings (`MatchCenterInteractive.tsx`).

### 2. Effortless Self-Service CMS Studio (`/admin`)
Built so non-technical club staff can manage schedules, photos, squad stats, and news without touching code:
* **Drag-and-Drop Media Uploader & Club Library:** `POST /api/upload` with MIME + binary magic-byte validation (`PNG`/`JPG`/`WebP`, max 5 MB), Supabase Storage support (`SUPABASE_URL`), optional automated background removal (`REMOVE_BG_API_KEY`), local `public/uploads/` + serverless fallback, and curated media picker (`MediaDropzonePicker.tsx`).
* **Full Fixture & Score Editor:** Create/Edit Fixture modal in `AdminDashboardClient.tsx` with UAE First Division club presets (auto-filling EN/AR names, crests, and stadiums), kickoff `datetime-local` picker, score recording, *"Pin as Official Next Match"*, and deletion (`PATCH`/`DELETE /api/matches/[id]`).
* **Full Player & Stats Editor:** Edit player cutouts, jersey numbers, positions, squad tiers (`First Team`, `U23`, `Academy`), season stats (`appearances`, `goals`, `assists`), and bilingual bios (`PATCH /api/players/[id]`).
* **Bilingual Newsroom Editor:** Cover image dropzone, publish/draft toggles, and full article editing (`PATCH /api/news/[id]`).
* **Automated Fixture & Standings Sync:** `/api/cron/sync-matches` supports `API-Football` ingestion (`API_FOOTBALL_KEY` + `CRON_SECRET`) and deterministic league table recalculation (`computeStandingsFromMatches`).

### 3. Engineering & Security Architecture

| Layer | Technology | Details |
| :--- | :--- | :--- |
| **Framework** | Next.js `16.4.6` (App Router) | React `19.3.0`, TypeScript Strict, RSC + ISR |
| **Styling & Motion** | Tailwind CSS `4.3.3` + `motion` | Radix UI Primitives, `Geist` + `IBM Plex Sans Arabic` |
| **Data & Validation** | Drizzle ORM + PostgreSQL 16 + Zod | Automatic serverless-safe JSON/memory fallback when `DATABASE_URL` is unset |
| **Security** | `jose` HS256 JWT + `bcryptjs` | HttpOnly cookies, RBAC, sliding-window rate limiter, CSP + HSTS headers |
| **Verification** | Vitest + Playwright | 11/11 unit tests, 14/14 desktop & mobile E2E tests, zero hydration/console errors |

---

## Quick Start (Local Development)

```bash
npm install
cp .env.example .env.local
# Set AUTH_SECRET and ADMIN_INITIAL_PASSWORD in .env.local
npm run dev
```

Open:
* **English Site:** `http://localhost:3000/en`
* **Arabic RTL Site:** `http://localhost:3000/ar`
* **Admin Studio:** `http://localhost:3000/admin`

## Verification Commands

```bash
npm run typecheck     # Strict TypeScript check
npm run lint          # ESLint verification
npm run test:unit     # Vitest unit & security tests
npm run build         # Production Next.js build
npm run test:e2e      # Playwright E2E tests (Desktop Chrome + Mobile Pixel 5)
```
