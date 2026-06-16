# RSP AI Editor — Technical Design Document

> **Project:** RSP AI Editor
> **Stage:** 09-qa (Technical Design — v1.0)
> **Stack:** Next.js 16 + Cloudflare Workers (OpenNext) + D1 + KV + R2
> **Last Updated:** 2026-06-10

---

## 1. Architecture Overview

```
                    ┌─────────────────────────────────────┐
                    │           Browser / Client            │
                    │  Next.js 16 App Router (Static/SSR) │
                    └──────────┬──────────────────┬─────────┘
                              │  HTTPS           │  HTTPS (API calls)
                              ▼                  ▼
         ┌──────────────────────────────────────────────────┐
         │           Cloudflare CDN / Proxy Layer          │
         │   image-editor.co/*  →  rsp-ai-editor Worker    │
         │   api.image-editor.co/* → rsp-api Worker        │
         └────────────┬────────────────────┬───────────────┘
                      │                    │
          ┌───────────▼──────┐   ┌────────▼──────────────┐
          │  Frontend Worker  │   │    API Worker         │
          │  rsp-ai-editor   │   │    rsp-api            │
          │  (OpenNext)      │   │                      │
          └──────────────────┘   │  ┌────────────────┐   │
                                │  │ /api/v1/*      │   │
                                │  │ /api/auth/*    │   │
                                │  └────────────────┘   │
                                └──────────┬────────────┘
                                           │
                    ┌──────────────────────┼──────────────────────┐
                    │                      │                      │
           ┌────────▼──────┐     ┌────────▼──────┐    ┌────────▼───────┐
           │     D1        │     │      KV       │    │       R2        │
           │   rsp-db      │     │  SESSIONS     │    │  image-editor-  │
           │               │     │  RATE_LIMITS  │    │  assets         │
           │  sessions     │     │               │    │  (UPLOADS/      │
           │  edits       │     │  OAuth state   │    │   OUTPUTS)      │
           │  subs        │     │  Rate counters │    │                 │
           │  admin_log   │     └────────────────┘    └─────────────────┘
           └───────────────┘

         ┌───────────────────────────────────────────────────────┐
         │              External Services                          │
         │  Google OAuth 2.0  │  Cloudflare Workers AI / Replicate │
         └───────────────────────────────────────────────────────┘
```

---

## 2. Frontend

### 2.1 Framework & Build

| Item | Value |
|------|-------|
| Framework | Next.js 16.2.7 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 (CSS variables design tokens) |
| Build Tool | OpenNext + Cloudflare Workers |
| Build Command | `npm run build` → `npx @opennextjs/cloudflare build` |
| Deploy | `npx wrangler deploy` from project root |
| Node.js | v22+ |
| Package Manager | npm |

### 2.2 Directory Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout: Header, Footer, fonts, SEO metadata
│   ├── page.tsx                # Homepage: Hero, TaskShortcuts, HowItWorks, CTA
│   ├── globals.css             # Design tokens (CSS variables), component styles
│   ├── editor/page.tsx         # Editor: UploadZone, ModeTabs, ResultPanel, ExportBar
│   ├── features/page.tsx       # Features page: Bento grid, CTAs
│   ├── pricing/page.tsx        # Pricing: Free/Pro/Max cards, Credit Packs, FAQ accordion
│   ├── privacy/page.tsx        # Privacy Policy
│   ├── terms/page.tsx         # Terms of Service
│   ├── refund/page.tsx         # Refund Policy
│   ├── cookie/page.tsx         # Cookie Policy
│   ├── blog/ai-editor-rsp-editing-guide/page.tsx  # Blog article
│   ├── not-found.tsx           # Custom 404
│   ├── sitemap.ts              # SEO sitemap.xml
│   └── robots.ts               # robots.txt
├── components/
│   ├── Header.tsx             # Responsive nav: mobile hamburger, auth state
│   ├── Footer.tsx             # Legal footer, nav links
│   ├── UploadZone.tsx         # Drag-and-drop file upload, validation (type/size)
│   ├── BeforeAfterSlider.tsx   # Before/after comparison slider
│   ├── TaskCard.tsx           # Task shortcut card
│   ├── GoogleLoginButton.tsx   # Google OAuth login trigger
│   ├── CopyRewritePanel.tsx    # Copy rewrite input + 3 style variants
│   └── HistoryPanel.tsx        # LocalStorage session history
└── lib/
    ├── api.ts                 # API client: all Worker API calls, typed responses
    └── history.ts             # LocalStorage history helpers
```

### 2.3 Design System

#### Color Tokens (in `globals.css`)

```css
:root {
  --background: #f7f8fa;
  --surface: #ffffff;
  --surface-muted: #f0f3f5;
  --text-primary: #111315;
  --text-secondary: #5b6470;
  --text-muted: #7a8491;
  --border: #e6eaf0;
  --border-strong: #cfd6df;
  --accent: #19c37d;         /* Primary green */
  --accent-hover: #12a66a;
  --accent-soft: #e8f8f1;
  --warning: #b7791f;
  --warning-soft: #fff7e6;
  --error: #ba1a1a;
  --error-soft: #ffdad6;
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 20px;
}
```

#### Icon Fonts

```tsx
// In layout.tsx <head>:
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
```

#### Key CSS Classes

```css
.material-symbols-outlined { font-family: "Material Symbols Outlined", "Material Icons"; font-variation-settings: "FILL" 0, "wght" 400, "GRAD" 0, "opsz" 24; }
.material-icons             { font-family: "Material Icons"; }
.app-shell    { width: min(1120px, calc(100vw - 32px)); margin-inline: auto; }
.section-y    { padding-block: 72px; }
.eyebrow      { color: var(--accent-hover); font-size: 0.78rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; }
.soft-card    { background: rgba(255,255,255,0.86); border: 1px solid var(--border); border-radius: var(--radius-md); box-shadow: var(--shadow-sm); }
.panel-card   { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg); box-shadow: var(--shadow-md); }
.primary-button  { display: inline-flex; align-items: center; background: var(--accent); border-radius: var(--radius-sm); color: #fff; font-weight: 700; gap: 8px; padding: 12px 18px; transition: background 150ms; }
.secondary-button { display: inline-flex; align-items: center; background: #fff; border: 1px solid var(--border-strong); border-radius: var(--radius-sm); color: var(--text-primary); font-weight: 700; gap: 8px; padding: 12px 18px; }
```

### 2.4 Routing Contract

| Route | Type | Description |
|-------|------|-------------|
| `/` | Static | Homepage |
| `/editor` | Static | Core tool page |
| `/features` | Static | Feature explanations |
| `/pricing` | Static | Pricing page |
| `/blog/ai-editor-rsp-editing-guide` | Static | SEO article |
| `/privacy` | Static | Privacy Policy |
| `/terms` | Static | Terms of Service |
| `/refund` | Static | Refund Policy |
| `/cookie` | Static | Cookie Policy |
| `/_not-found` | Static | 404 page |
| `/sitemap.xml` | Generated | Sitemap |
| `/robots.txt` | Generated | Robots.txt |

---

## 3. Backend (Cloudflare Workers)

### 3.1 Worker Projects

| Worker | Config | Route |
|--------|--------|-------|
| `rsp-api` (API) | `workers/wrangler.toml` | `api.image-editor.co/*` |
| `rsp-ai-editor` (Frontend) | `wrangler.jsonc` (root) | `image-editor.co/*`, `www.image-editor.co/*` |

### 3.2 API Endpoints

All under `/api/v1/`:

#### Session Management

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/session/init` | Create anonymous session, set `rsp_session` cookie |
| `GET` | `/session/usage` | Get current plan, edits_used, edits_limit, resets_at |

#### Authentication (Google OAuth)

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/auth/google` | Redirect to Google OAuth → `GET /api/auth/callback/google` |
| `GET` | `/api/auth/callback/google` | Google callback: exchange code, upsert D1 session, set cookie |
| `GET` | `/auth/me` | Return current auth state, user info, plan |
| `POST` | `/auth/logout` | Clear `rsp_session` cookie |
| `POST` | `/auth/link-google` | Link Google account to existing anonymous session |

#### Image Editing

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/edit/{mode}` | Submit edit task (`enhance` \| `remove-bg` \| `restyle`), returns `task_id` |
| `GET` | `/edit/{task_id}` | Poll edit status (`pending` \| `processing` \| `done` \| `failed`) |

#### Copy Rewrite

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/copy/rewrite` | Rewrite copy in 3 styles (`clean` \| `persuasive` \| `concise`) |

#### Admin

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| `POST` | `/admin/grant` | Grant plan upgrade to a session | `X-Admin-Key` header |

### 3.3 Auth Flow (Google OAuth)

```
Browser                        Frontend Worker       API Worker           Google
   │                               │                    │                    │
   │ GET /api/v1/auth/google ─────►│                    │                    │
   │                               │ PUT oauth_state:*  │                    │
   │                               │ ──────────────────►│                    │
   │ 302 Location: Google ──────────│                    │                    │
   │                               │                    │                    │
   │ GET /api/auth/callback/google?code=...&state=... ──────────────────────►│
   │                               │                    │ GET /oauth2/v2/auth │
   │                               │                    │ ◄──────────────────│
   │                               │                    │ POST /token        │
   │                               │                    │ ◄──────────────────│
   │                               │                    │ GET /userinfo       │
   │                               │                    │ ◄──────────────────│
   │                               │                    │ upsert D1 sessions  │
   │                               │   302 + Set-Cookie │ ◄──────────────────│
   │ 302 /editor?auth=success ─────│◄────────────────────│                    │
```

**CSRF Protection:** OAuth state stored in KV with 10-minute TTL.

### 3.4 Session Architecture

- **Token Format:** `{sessionId}.{HMAC-SHA256}` (HMAC-SHA256 signed with `SESSION_SECRET_KEY`)
- **Storage:** `sessions` table in D1
- **Cookie:** `rsp_session`, `HttpOnly`, `SameSite=Lax`, 30-day expiry
- **Fallback:** `X-Session-ID` header for API calls (no cookie)
- **Anonymous sessions:** Auto-created on first visit to `/editor` via `/session/init`

---

## 4. Data Layer

### 4.1 D1 Schema

**Database:** `rsp-db` (ID: `93658231-c023-47d1-8839-1058283a724f`)

```sql
-- Sessions (anonymous + Google-linked)
sessions (
  id           TEXT PRIMARY KEY,
  google_id    TEXT UNIQUE,
  plan         TEXT NOT NULL DEFAULT 'free',  -- 'free' | 'pro' | 'team'
  edits_used   INTEGER NOT NULL DEFAULT 0,
  edits_limit  INTEGER NOT NULL DEFAULT 5,
  resets_at    INTEGER NOT NULL,               -- Unix ms
  name         TEXT,
  picture      TEXT,
  created_at   INTEGER NOT NULL,
  updated_at   INTEGER NOT NULL
)

-- Edit tasks
edits (
  id           TEXT PRIMARY KEY,
  session_id   TEXT NOT NULL REFERENCES sessions(id),
  mode         TEXT NOT NULL,                  -- 'enhance' | 'remove-bg' | 'restyle'
  status       TEXT NOT NULL DEFAULT 'pending',
  input_url    TEXT NOT NULL,
  output_url   TEXT,
  error_msg    TEXT,
  credits_used INTEGER NOT NULL DEFAULT 1,
  created_at   INTEGER NOT NULL
)

-- Subscriptions (Pro / Max)
subscriptions (
  id                 TEXT PRIMARY KEY,
  session_id         TEXT NOT NULL UNIQUE REFERENCES sessions(id),
  provider           TEXT NOT NULL,           -- 'stripe' | 'lemonsqueezy'
  plan               TEXT NOT NULL,
  status             TEXT NOT NULL,
  provider_id        TEXT NOT NULL,
  current_period_end INTEGER NOT NULL,
  created_at         INTEGER NOT NULL
)

-- Admin audit log
admin_log (
  id         TEXT PRIMARY KEY,
  action     TEXT NOT NULL,
  target_id  TEXT,
  admin_key  TEXT NOT NULL,
  note       TEXT,
  created_at INTEGER NOT NULL
)

-- Pricing tiers (seed data)
pricing_tiers (
  plan         TEXT PRIMARY KEY,
  edits_limit  INTEGER NOT NULL,
  resets_every TEXT NOT NULL,                  -- 'day' | 'month'
  hd_export    INTEGER NOT NULL,               -- 0 | 1
  watermark    INTEGER NOT NULL,               -- 0 | 1
  batch_size   INTEGER NOT NULL,
  created_at   INTEGER NOT NULL
)

-- Indexes
idx_edits_session   ON edits(session_id)
idx_edits_status    ON edits(status)
idx_subs_session    ON subscriptions(session_id)
idx_subs_status     ON subscriptions(status)
idx_admin_created   ON admin_log(created_at DESC)
idx_sessions_google ON sessions(google_id)
```

**Seed Data:**

| plan | edits_limit | resets_every | hd_export | watermark | batch_size |
|------|-------------|--------------|-----------|-----------|------------|
| free | 5/day + 10 copy rewrites/day | day | 0 | 1 | 1 |
| pro | 1200 credits/month | month | 1 | 0 | 20 |
| max | 3500 credits/month | month | 1 | 0 | 20 |

### 4.2 KV Namespaces

| Namespace | ID | Purpose |
|-----------|----|---------|
| `SESSIONS` | `48712c55221f467aa1d25bd6b2522fac` | OAuth state storage (`oauth_state:{state}`), 10-min TTL |
| `RATE_LIMITS` | `864c39c2ce244d11866532fc8784dca9` | Rate limit counters per session |

**Rate Limit Algorithm:**
- Key: `rl:{sessionId}:{windowStart}`
- Window: 1 day (free) or 1 month (pro/max)
- Checked before edit submission; returns `429` if exceeded

### 4.3 R2 Buckets

**Bucket:** `image-editor-assets`

| Binding | Key Pattern | Description |
|---------|-------------|-------------|
| `UPLOADS` | `uploads/{sessionId}/{taskId}-input.{ext}` | User-uploaded source images |
| `OUTPUTS` | `outputs/{sessionId}/{taskId}-output.{ext}` | AI-processed output images |

**File Validation:**
- Allowed types: `image/jpeg`, `image/png`, `image/webp`
- Max size: 10MB
- Extension: `.jpg` / `.png` / `.webp`

---

## 5. AI Integration

### 5.1 Provider Abstraction

File: `workers/ai.ts`

Primary provider: **fal.ai** (`openai/gpt-image-2/edit`)

| Provider | Env Key | Status |
|----------|---------|--------|
| **fal.ai** | `AI_PROVIDER=fal` + `FAL_KEY` | **✅ Implemented** |
| Cloudflare Workers AI | `AI_PROVIDER=cf-workers-ai` | Placeholder (model TBD) |
| Replicate | `REPLICATE_API_KEY` | Placeholder (model/version TBD) |
| Cloudinary | `CLOUDINARY_CLOUD_NAME/API_KEY/API_SECRET` | Placeholder (transform TBD) |

**Default:** `AI_PROVIDER=fal` (set in `wrangler.toml`)

**fal.ai queue protocol:**
1. `POST https://queue.fal.run/openai/gpt-image-2/edit` → `{ request_id }`
2. Poll `GET .../requests/{request_id}` every 2s until `status === "COMPLETED"` (max ~2 min)
3. `GET .../data` → `{ images: [{ url, width, height, ... }] }`

**Edit mode → prompt mapping:**

| Mode | Prompt |
|------|--------|
| `enhance` | "Enhance this image: improve lighting, sharpness, color balance, and overall quality while preserving the original content and composition." |
| `remove-bg` | "Remove the background from this image, leaving only the main subject with a transparent background." |
| `restyle` | "Transform the style of this image while keeping the subject and composition intact — apply a fresh, modern aesthetic." |

**fal.ai input parameters:**
- `prompt` — edit instruction
- `image_urls` — array of publicly reachable image URLs (R2 signed URLs)
- `image_size: "auto"` — infer from input
- `quality: "high"` — best quality
- `num_images: 1` — single output
- `output_format: "png"` — lossless output

**Output:** `{ images: [{ url, width, height, file_name, content_type }] }`

**API Key:** Set via `npx wrangler secret put FAL_KEY` — never committed to code.

**Fallback placeholders:** cf-workers-ai / replicate / cloudinary remain as switch branches for future migration.

### 5.2 Async Edit Pipeline

```
Client                  API Worker                  AI Provider
   │                         │                            │
   │ POST /edit/{mode}       │                            │
   │ ────────────────────────►│                            │
   │                         │ R2: put uploads/...        │
   │                         │─────────────────────────────►│
   │                         │ D1: INSERT edits (pending)  │
   │                         │ D1: consumeCredit           │
   │ { task_id, status:     │                            │
   │   "processing" }        │ runAIEdit() (fire-and-     │
   │ ◄───────────────────────│ forget promise)             │
   │                         │─────────────────────────────►│
   │                         │                            │
   │ GET /edit/{task_id}     │                            │
   │ ────────────────────────►│                            │
   │ { status: "done",       │                            │
   │   output_url: "..." }   │ D1: UPDATE edits SET       │
   │ ◄───────────────────────│ status='done', output_url= │
   │                         │ R2: put outputs/...        │
```

---

## 6. Security

### 6.1 CORS Configuration

Allowed origins:
- `https://image-editor.co`
- `https://www.image-editor.co`
- `https://rsp-ai-editor.sempron450.workers.dev`
- `http://localhost` / `http://127.0.0.1` (development)

CORS headers on API responses:
```
Access-Control-Allow-Origin: {origin}
Access-Control-Allow-Credentials: true
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: Content-Type, X-Session-ID, X-Admin-Key
Access-Control-Max-Age: 86400
```

### 6.2 Secrets Management

All secrets stored as Wrangler secrets (never in code):

| Secret | Worker | Description |
|--------|--------|-------------|
| `SESSION_SECRET_KEY` | Both | HMAC signing key for session tokens |
| `ADMIN_KEY` | API | Admin operations authentication |
| `GOOGLE_CLIENT_ID` | API | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | API | Google OAuth client secret |
| `REPLICATE_API_KEY` | API | Replicate API key |
| `CLOUDINARY_API_SECRET` | API | Cloudinary API secret |

### 6.3 File Upload Security

- Type validation: `image/jpeg`, `image/png`, `image/webp` only
- Size limit: 10MB hard cap in both frontend and API
- R2 object metadata: stores `session_id` and `task_id` for audit
- No executable MIME types accepted

---

## 7. Frontend ↔ API Contract

### 7.1 API Client

File: `src/lib/api.ts`

Base URL: `NEXT_PUBLIC_API_URL` (default: `https://api.image-editor.co`)

Session identification (in order of priority):
1. `X-Session-ID` header (extracted from `rsp_session` cookie)
2. Falls back to new session via `/session/init`

### 7.2 Key API Flows

#### Edit Submission

```typescript
// Frontend
const result = await submitEdit(mode, file);
// result: { task_id: string; status: "processing" }

// Poll until done
const status = await getEditStatus(task_id);
// status: { task_id, status: "done" | "failed" | "processing", output_url, error }
```

#### Auth State

```typescript
// Check auth
const auth = await getAuthMe();
// auth: { authenticated: boolean, user?: { name, picture }, plan, edits_used, ... }

// Initiate Google login → redirects to Google
window.location.href = getGoogleLoginUrl();

// Logout
await logout();
```

### 7.3 Error Handling

API returns structured errors:

```typescript
// Success
{ ok: true, data: { ... } }

// Error
{ ok: false, error: "Human-readable message", code: 400 | 401 | 403 | 429 | 500 }
```

Frontend handles:
- `429` → Show "limit reached" with upgrade CTA
- `413` → Show "file too large" with size limit
- `401` → Auto-retry with new session
- `500` → Show retry option

---

## 8. Pricing & Entitlements

### 8.1 Plan Limits

| Plan | Credits / Limits | Resets | HD Export | Watermark | Batch |
|------|------------------|--------|----------|-----------|-------|
| Free | 5 image edits/day + 10 copy rewrites/day | Daily | ✗ | ✓ | 1 |
| Pro | 1,200 credits/month | Monthly | ✓ | ✗ | 20 |
| Max | 3,500 credits/month | Monthly | ✓ | ✗ | 20 |

### 8.1.1 Credit Packs

| Pack | Credits | Price | Restriction |
|------|---------|-------|-------------|
| Starter Pack | 500 | $6.9 | First purchase only |
| Standard Pack | 1,500 | $26.9 | None |
| Growth Pack | 3,000 | $48.9 | None |
| Scale Pack | 6,000 | $86.9 | None |

### 8.2 Credit System

- 1 credit consumed per paid edit submission (regardless of outcome)
- Entitlement model should support `plan`, `monthly_credits`, `purchased_credits`, `credits_used`, and `reset_at`
- Rate limit checked via KV before edit submission
- Auto-reset: free sessions reset daily; paid monthly credits reset each billing cycle; purchased credits do not auto-reset before use

---

## 9. Deployment

### 9.1 Infrastructure

| Resource | Cloudflare Resource | Config |
|----------|--------------------|--------|
| Frontend | Workers | `wrangler.jsonc` (root) |
| API | Workers | `workers/wrangler.toml` |
| Database | D1 | `rsp-db` |
| KV | Workers KV | `SESSIONS`, `RATE_LIMITS` |
| R2 | R2 | `image-editor-assets` |
| DNS | DNS | `api.image-editor.co` → CNAME `rsp-api.sempron450.workers.dev` |

### 9.2 Deploy Commands

```bash
# Frontend build + deploy
npm run build          # Next.js + OpenNext build
npx wrangler deploy    # Deploy from project root

# API Worker deploy
cd workers && npx wrangler deploy -c wrangler.toml

# D1 migration
npx wrangler d1 execute rsp-db --file=./migrations/0001_initial.sql --remote
```

### 9.3 Environment Variables (wrangler.toml / secrets)

```toml
# workers/wrangler.toml (API Worker)
# D1 binding: rsp-db (ID: 93658231-c023-47d1-8839-1058283a724f)
# KV SESSIONS: 48712c55221f467aa1d25bd6b2522fac
# KV RATE_LIMITS: 864c39c2ce244d11866532fc8784dca9
# R2 UPLOADS/OUTPUTS: image-editor-assets

# Wrangler secrets (set via: npx wrangler secret put NAME)
# SESSION_SECRET_KEY, ADMIN_KEY, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET
# REPLICATE_API_KEY, CLOUDINARY_API_SECRET
```

### 9.4 Domain Routes

| Domain | Target Worker | Type |
|--------|--------------|------|
| `image-editor.co/*` | `rsp-ai-editor` | Custom Route |
| `www.image-editor.co/*` | `rsp-ai-editor` | Custom Route |
| `api.image-editor.co/*` | `rsp-api` | Custom Route |
| `rsp-ai-editor.sempron450.workers.dev/*` | `rsp-ai-editor` | Workers.dev (default) |

---

## 10. Known Gaps & TODOs

| Priority | Item | Description |
|----------|------|-------------|
| ~~P0~~ | ~~Real AI model integration~~ | ✅ **DONE — fal.ai GPT Image 2 implemented** (`AI_PROVIDER=fal`, `FAL_KEY`) |
| P0 | R2 public URL | Output URLs are `https://placeholder.r2.dev/...` — need signed or proxied public URLs |
| P0 | fal.ai FAL_KEY secret | Must be set via `npx wrangler secret put FAL_KEY` before production traffic |
| P0 | Google OAuth redirect URI | Verify `https://api.image-editor.co/api/auth/callback/google` in Google Cloud Console |
| P0 | Payment integration | Stripe/LemonSqueezy integration for Pro/Max subscriptions and credit packs |
| P1 | GA4 / Analytics | Pageview and event tracking not yet configured |
| P1 | Legal page placeholders | `[DATE]`, `[LEGAL_ENTITY_NAME]`, `[SUPPORT_EMAIL]` not yet replaced |
| P1 | Copy rewrite LLM | Returns placeholder variants — integrate CF Workers AI chat |
| P2 | Batch export | UI and API for batch processing (20 images) |
| P2 | Team / Lifetime expansion | Defer until launch pricing, billing, and entitlement model are stable |
| P2 | Branding assets | Logo SVG, favicon replacement from Material Icons |

---

## 11. Key Files Reference

| File | Purpose |
|------|---------|
| `src/lib/api.ts` | Frontend API client — single source of truth for all API calls |
| `src/lib/history.ts` | LocalStorage session history helpers |
| `workers/entry.ts` | API Worker routing and handlers |
| `workers/auth.ts` | Google OAuth flow implementation |
| `workers/session.ts` | HMAC-SHA256 session token signing/verification |
| `workers/db.ts` | D1 helpers: entitlement checks, credit consumption |
| `workers/ai.ts` | AI provider abstraction (placeholder) |
| `workers/env.ts` | TypeScript `Env` interface for Worker bindings |
| `workers/schema.ts` | Shared types: Session, EditTask, Subscription, PricingTier |
| `workers/wrangler.toml` | API Worker config: bindings, routes, KV, D1, R2 |
| `wrangler.jsonc` | Frontend Worker config: OpenNext assets, custom routes |
| `migrations/0001_initial.sql` | D1 schema + seed data |
| `src/app/globals.css` | Design tokens, component styles, icon font CSS |
| `src/app/layout.tsx` | Root layout: fonts, metadata, Header/Footer |
