# Dibba SCC Platform — Security, Operations & API Guide

## 1. Database Schema (PostgreSQL / Drizzle ORM)

Defined in `src/db/schema.ts` with parameterized queries and query-pattern indexes:
- `users`: UUID primary key, unique `email`, bcrypt `passwordHash`, RBAC `role` (`super_admin` | `editor` | `academy_manager`).
- `news_articles`: Bilingual titles/excerpts/bodies (`_en`, `_ar`), unique `slug`, `category` enum, `published` toggle, composite index `(published, published_at)`.
- `matches`: Bilingual competition/team/venue fields, home/away crest paths, `status` (`scheduled` | `finished`), `kickoff_at`, `is_next_match`, `is_demonstration` flag.
- `players`: Bilingual names/nationalities/bios, squad (`first_team` | `u23` | `academy`), position (`GK` | `DEF` | `MID` | `FWD` | `STAFF`), season stats.
- `enquiries`: Type (`academy` | `contact` | `sponsorship` | `ticket_interest` | `merch_order`), contact details, `status` (`new` | `in_review` | `resolved`).
- `sponsors`: Tier (`principal` | `official` | `partner`), logo & external URL.
- `audit_logs`: Immutable trail of administrative logins, mutations, and status transitions.

## 2. REST API Documentation

| Endpoint | Method | Auth / RBAC | Validation | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| `/api/health` | `GET` | Public | None | System & DB health check (`200` / `503`) |
| `/api/auth/login` | `POST` | Public (Rate-limited 10/min) | `loginSchema` | Issues `HttpOnly` HS256 JWT cookie |
| `/api/auth/logout` | `POST` | Authenticated | None | Clears session cookie + audit log |
| `/api/news` | `GET` | Public (`includeDrafts` Admin) | Query | Returns bilingual articles |
| `/api/news` | `POST` | `super_admin`, `editor` | `newsArticleSchema` | Publishes article + invalidates ISR |
| `/api/news/[id]` | `PATCH`, `DELETE` | `super_admin`, `editor` | Numeric ID | Toggles visibility or deletes article |
| `/api/matches` | `GET` | Public | None | Lists fixtures & results |
| `/api/matches` | `POST` | `super_admin`, `editor` | `matchSchema` | Creates fixture + invalidates ISR |
| `/api/matches/[id]` | `PATCH` | `super_admin`, `editor` | Zod score payload | Records FT score + updates schedule |
| `/api/players` | `GET`, `POST` | `POST`: Admin/Editor | `playerSchema` | Lists or registers squad players |
| `/api/players/[id]` | `DELETE` | `super_admin`, `editor` | Numeric ID | Removes player from roster |
| `/api/enquiries` | `POST` | Public (Rate-limited 15/min) | `enquirySchema` | Stores Academy/Contact/Ticket request |
| `/api/enquiries` | `GET` | Admin/Editor/Academy | Session RBAC | Lists submitted enquiries |
| `/api/enquiries/[id]` | `PATCH` | Admin/Editor/Academy | Status enum | Updates enquiry workflow status |
| `/api/audit` | `GET` | `super_admin` | Session RBAC | Returns latest 50 audit entries |

## 3. OWASP ASVS 5.0 Security Controls

1. **Authentication & Session Management (V2 / V3):**
   - Passwords hashed with `bcryptjs` (cost factor 12).
   - Sessions signed with `jose` (`HS256`, 8-hour expiration) stored exclusively in `HttpOnly`, `SameSite=Lax`, `Secure` (production) cookies.
   - Zero secrets in client-side JavaScript bundles; `AUTH_SECRET` and `ADMIN_INITIAL_PASSWORD` supplied solely via server environment variables.
2. **Access Control (V4):**
   - Server-side `getServerSession()` + `hasRole()` verification on every `/admin` page and protected API route.
   - Unauthenticated access to `/admin` redirects to `/admin/login`; API calls return `401 Unauthorized` or `403 Forbidden`.
3. **Input Validation & Injection Defense (V5):**
   - All API request bodies parsed strictly through Zod schemas (`src/lib/validations.ts`).
   - Parameterized queries via Drizzle ORM prevent SQL injection.
4. **Security Headers & Transport (V9 / V14):**
   - `Strict-Transport-Security`, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy`, and `Content-Security-Policy` configured in `next.config.ts` and `Caddyfile`.
5. **Rate Limiting & Audit Logging (V7 / V11):**
   - Sliding-window rate limiting on `/api/auth/login` and `/api/enquiries`.
   - Structured JSON application logs (`src/lib/logger.ts`) and persistent `audit_logs` table.

## 4. Production Deployment Guide (Docker + Caddy)

1. Provision a Linux VPS (Ubuntu 24.04 LTS, 2 vCPU / 4 GB RAM minimum) with Docker Engine & Compose plugin.
2. Point DNS `A` / `AAAA` records for `dibbaclub.ae` and `www.dibbaclub.ae` to the server IP.
3. Configure firewall (`ufw allow 80,443,22/tcp`).
4. Clone repository and create `.env` from `.env.example` with strong `AUTH_SECRET` (`openssl rand -base64 32`) and `POSTGRES_PASSWORD`.
5. Launch production stack:
   ```bash
   docker compose up -d --build
   ```
6. Push Drizzle database schema:
   ```bash
   npx drizzle-kit push
   ```
7. Verify health:
   ```bash
   curl -f https://dibbaclub.ae/api/health
   ```

## 5. Database Backup, Recovery & Rollback

### Automated Daily PostgreSQL Backup
Run via cron (`0 2 * * *`):
```bash
docker compose exec -T postgres pg_dump -U dibba_scc dibba_scc_db | gzip > /backups/dibba_scc_$(date +%F).sql.gz
```

### Restore Procedure
```bash
gunzip -c /backups/dibba_scc_YYYY-MM-DD.sql.gz | docker compose exec -T postgres psql -U dibba_scc -d dibba_scc_db
```

### Rollback Procedure
Tag stable Docker images per release SHA and re-deploy previous tag:
```bash
docker compose pull && docker compose up -d --no-deps web
```

## 6. Known Limitations & Outstanding Production Requirements

1. **Live Sports Data Feed:** Match fixtures, results, and league standings are currently clearly marked demonstration records (`isDemonstration: true`). Integrating an official UAE Pro League / Opta / Sportradar webhook requires provisioning live API keys.
2. **Payment Gateway:** Shop merchandise and stadium ticketing implement a full reservation enquiry pipeline. Live credit-card / Apple Pay processing requires provisioning UAE merchant keys (e.g., Stripe UAE / Network International / Telr).
3. **External Postgres Provisioning:** When `DATABASE_URL` is omitted locally, the repository layer persists seamlessly to `data/club-db.json`. Production deployments must set `DATABASE_URL` to PostgreSQL 16 (configured in `docker-compose.yml`).
