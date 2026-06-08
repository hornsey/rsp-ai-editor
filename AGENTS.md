<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This project uses Next.js 16.2.7. APIs, conventions, CLI behavior, and file structure may differ from older Next.js versions in model training data.

Before any Next.js code change, read the relevant version-matched guide in `node_modules/next/dist/docs/`. Use those bundled docs as the source of truth and heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# RSP AI Editor Agent Guide

## Project Summary

RSP AI Editor is a tool-first SEO site for the US English market. The product promise is: upload an image, choose a task-oriented AI edit mode, and export quickly without requiring signup first.

Core positioning and scope come from `docs/prd.md`, `HANDOFF.md`, and `docs/stage7-frontend.md`.

- Product: lightweight AI image and copy editor.
- Primary route: `/editor`.
- Primary conversion path: `/` or `/blog/*` -> `/editor` -> export -> `/pricing` when limits or Pro features matter.
- Required MVP modes: `enhance`, `remove-bg`, `restyle`.
- Copy rewrite styles: `clean`, `persuasive`, `concise`.
- Do not introduce complex layer editing, team collaboration workflows, native mobile app scope, or multilingual UI unless explicitly requested.

## Current State

The Next.js frontend is implemented, but the real backend and launch stack are not fully complete.

- Frontend: `src/app` App Router pages, `src/components`, `src/lib/api.ts`, `src/lib/history.ts`.
- Worker API: `workers/entry.ts` with session, usage, edit, copy rewrite, admin grant, and Google auth route stubs/integration points.
- AI providers: `workers/ai.ts` supports `cf-workers-ai`, `replicate`, and `cloudinary`, but provider implementations contain placeholders or model-version TODOs.
- Data/resources: D1, KV, and R2 bindings are expected by the Worker. `workers/README.md` says KV exists, D1/R2 were blocked or pending at handoff.
- Copy rewrite endpoint currently returns placeholder variants.
- Editor result variants are currently duplicated client-side when only one output URL is returned.
- `NEXT_PUBLIC_API_URL` defaults to `https://api.image-editor.co`; set it explicitly for local or staging work.

## Important Files

- `docs/prd.md`: product scope, route contract, MVP requirements, NOT-DO list.
- `HANDOFF.md`: page IA, design requirements, component states, risks.
- `docs/stage7-frontend.md`: implemented frontend summary and known gaps.
- `docs/pricing/pricing-v1.md`: plan limits and pricing guardrails.
- `docs/copy/*`: source copy, FAQ, legal/footer copy maps.
- `docs/legal/*`: legal content; check placeholders before launch.
- `html/v2_01_homepage.html` through `html/v2_04_pricing.html`: original HTML design source.
- `src/app/globals.css`: Tailwind 4 theme tokens and global component styles.
- `workers/README.md`: Cloudflare resource setup and deployment notes.
- `migrations/0001_initial.sql`: D1 schema.

## Next.js Rules

- This is App Router under `src/app`; there is no Pages Router application.
- Read bundled docs before Next.js work. Useful starting points:
  - Project structure: `node_modules/next/dist/docs/01-app/01-getting-started/02-project-structure.md`
  - Server and Client Components: `node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md`
  - Route handlers and file conventions: `node_modules/next/dist/docs/01-app/01-getting-started/15-route-handlers.md` and `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/`
  - ESLint: `node_modules/next/dist/docs/01-app/03-api-reference/05-config/03-eslint.md`
- Keep pages Server Components by default. Add `"use client"` only where state, event handlers, lifecycle hooks, or browser APIs are needed.
- Avoid broad client boundaries. A file marked `"use client"` pulls its imports into the client bundle.
- Use `Link` for internal navigation.
- Use Next metadata APIs and file conventions for SEO assets such as `sitemap.ts`, `robots.ts`, and route metadata.
- `next lint` is removed in Next.js 16. Use `npm run lint`, which runs ESLint directly.

## Commands

- Install dependencies: `npm install`
- Local frontend dev: `npm run dev`
- Next build only: `npm run next:build`
- Cloudflare/OpenNext build: `npm run build`
- Lint: `npm run lint`
- Worker local dev: `wrangler dev --config workers/wrangler.toml --local`
- Worker deploy: `wrangler deploy --config workers/wrangler.toml`
- D1 migration: `wrangler d1 execute rsp-db --file=./migrations/0001_initial.sql --remote`

Run the smallest relevant verification command after edits. For UI or routing changes, at least run `npm run lint` and `npm run build` unless the user asks otherwise or environment constraints block it.

## Product And UX Guardrails

- Preserve the no-signup-first path.
- Keep `/editor` task-first: upload, choose mode, process, compare or inspect result, export.
- Required routes should stay accessible: `/`, `/editor`, `/features`, `/pricing`, `/blog/ai-editor-rsp-editing-guide`, `/privacy`, `/terms`, `/refund`, `/cookie`, and the not-found UI.
- Do not claim unlimited usage. Pricing docs explicitly prohibit "unlimited" claims.
- Free plan copy should align with `docs/pricing/pricing-v1.md`: 5 image edits/day and 10 copy rewrites/day unless updated by product docs.
- Pro plan copy should align with `docs/pricing/pricing-v1.md`: $12/mo or $9/mo annually, 500 image edits/month, 1,000 copy rewrites/month, HD exports, no watermark, priority processing.
- Legal pages may contain placeholders such as `[DATE]`, `[LEGAL_ENTITY_NAME]`, and `[SUPPORT_EMAIL]`; do not present them as launch-ready until replaced.
- Target audience and UI copy are English-first.

## Frontend Implementation Notes

- Reuse existing components before adding new ones: `Header`, `Footer`, `UploadZone`, `BeforeAfterSlider`, `TaskCard`, `CopyRewritePanel`, `HistoryPanel`, `GoogleLoginButton`.
- Prefer stable, task-oriented UI text over generic AI marketing claims.
- Keep file upload validation aligned across UI and Worker: JPG/PNG/WebP and 10MB max.
- History is localStorage-only via `src/lib/history.ts`; do not imply account-backed history unless implemented.
- API calls are centralized in `src/lib/api.ts`; update that client and its types when Worker contracts change.
- Keep responsive layouts usable on mobile. The editor should prioritize input first, then result.
- The design system currently uses Tailwind 4 with CSS variables in `src/app/globals.css`; update tokens there instead of scattering one-off colors.

## Worker And Backend Notes

- Worker API base paths are under `/api/v1`.
- Session auth uses the `rsp_session` cookie or `X-Session-ID` header.
- Editing endpoints consume credits before async AI completion; review product implications before changing billing behavior.
- R2 URLs in `workers/entry.ts` are placeholder `https://placeholder.r2.dev/...` strings. Replace with real public, signed, or proxy URLs before production.
- `runAIEdit` is the provider abstraction. Implement concrete model/version choices there, then update Worker README and environment docs.
- Keep secrets out of the repo. Use Wrangler secrets for `SESSION_SECRET_KEY`, `ADMIN_KEY`, provider credentials, and Google OAuth credentials.
- D1 schema changes require a new migration file in `migrations/`.
- Cross-origin/frontend integration should be tested against the actual `NEXT_PUBLIC_API_URL` target.

## Code Quality

- TypeScript is strict enough to catch many integration mismatches; update exported types with API changes.
- Keep edits scoped. Do not refactor unrelated pages or docs while fixing one feature.
- Do not remove existing user or generated changes unless explicitly requested.
- Prefer structured parsing and existing helpers over ad hoc string handling.
- Comments should explain non-obvious decisions, not restate code.
- Do not add new dependencies without checking whether the existing stack already solves the problem.

## Documentation Updates

When changing product behavior, pricing limits, route contracts, API contracts, or deployment requirements, update the relevant docs in the same change:

- Product behavior: `docs/prd.md` or a stage handoff doc.
- Pricing or quotas: `docs/pricing/pricing-v1.md`.
- Copy: `docs/copy/*`.
- Worker setup: `workers/README.md`.
- Agent instructions: this file and `CLAUDE.md` if agent workflow changes.
