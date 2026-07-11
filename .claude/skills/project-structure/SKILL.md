---
name: project-structure
description: The repository's structure and conventions. Covers the Next.js App Router layout, the src/ by-purpose organization, MDX content placement, colocation rules for tests and styles, and path aliases.
when_to_use: Use when navigating the repository, deciding where a new module, route, component, content page, or test belongs, or checking the project's stack, tooling, directory conventions, or routing/file conventions.
user-invocable: false
---

# Project Structure

ptcgp.axross.dev is a Next.js App Router documentation site for Pokémon TCG Pocket, authored in MDX. This skill owns **where files live**; how components are built belongs to Component Guidelines, how surfaces look belongs to UI Design Principles, and how MDX pages are written belongs to Content Authoring Guidelines (all resolved via the `AGENTS.md` skill index).

## Stack

- Runtime/framework: Next.js (App Router, Turbopack), React, TypeScript (strict; `typescript@^5`).
- Package manager: npm (`package-lock.json` is the lockfile; Node version pinned in `.nvmrc`).
- Lint/format: Biome (`biome.json`); one tool for both, run via `npm run lint` / `npm run format`.
- Content: MDX pages compiled by `@next/mdx` with `remark-gfm`; shared element mapping in `src/mdx-components.tsx`.
- Directory convention: by purpose under `src/` (`app/` routes and content, `components/`, `lib/`).
- Business logic: React Server Components plus hooks; no client state library.
- Validation: zod for any external input (there is no database or ORM).
- Styling: CSS Modules + CSS-variable theming; headless primitives from Base UI (`@base-ui/react`).
- Tests: Vitest unit tests colocated in `src/`; Playwright e2e suite under `e2e/`.
- Observability: Sentry (`@sentry/nextjs`) via `src/instrumentation.ts` / `src/instrumentation-client.ts` / `sentry.*.config.ts`.
- Hosting: Vercel.
- Path alias: `@/*` → `src/*` (defined in `tsconfig.json`).

## Top-Level Layout

| Path | Owns |
| ---- | ---- |
| `src/app/` | Routes: layouts, `page.tsx`/`page.mdx` entries, `not-found.tsx`, `global-error.tsx`, `icon.svg`, `globals.css` |
| `src/app/guides/<slug>/page.mdx` | One guide page per directory; the directory name is the URL slug |
| `src/components/` | Shared React components with their paired `*.module.css` files |
| `src/lib/` | UI-free helpers (pure logic) with colocated `*.test.ts` unit tests |
| `src/mdx-components.tsx` | The MDX element-to-component mapping (prose wrapper, table wrapper) |
| `e2e/` | Playwright suite: `tests/` (specs), `scenarios.md` (journey catalog), `scenario-coverage.mjs` (reporter/gate) |
| `.claude/` | Agent harness: skills, commands, hooks, settings |
| `.github/` | PR template and CI workflows (merge checks, review bot) |
| repo root | Tool configs: `next.config.ts`, `biome.json`, `tsconfig.json`, `vitest.config.ts`, `playwright.config.ts`, `sentry.*.config.ts` |

## Routing Conventions

- Routes are directories under `src/app`; a content page is that directory's `page.mdx`, an interactive page is `page.tsx`. `pageExtensions` includes `mdx`, so both are routable.
- URL structure mirrors the directory tree (`/guides/getting-started` ↔ `src/app/guides/getting-started/`). Slugs are kebab-case.
- Shared chrome (header, footer) lives in `src/app/layout.tsx`; per-section layouts are added as `layout.tsx` in the section directory only when a section genuinely diverges.
- The root `not-found.tsx` handles unknown URLs; route-level error UI is added only when a route needs custom handling (the root `global-error.tsx` is the last resort).

## File Placement

**Guidelines:**

- MUST place a new guide as `src/app/guides/<kebab-case-slug>/page.mdx`; sections other than guides get their own directory under `src/app` when they exist.
- MUST place a component shared by two or more routes in `src/components/`, paired with a same-basename `*.module.css` when it renders styled DOM; a component used by exactly one route MAY live next to that route instead.
- MUST place UI-free logic in `src/lib/` with a colocated `<name>.test.ts`; helpers there MUST NOT import components or other UI modules.
- MUST place e2e specs under `e2e/tests/routes/<route-path>/` mirroring the route they cover, with app-global specs (e.g. metadata) directly under `e2e/tests/`.
- MUST use kebab-case for all new file and directory names.
- MUST NOT place non-route files directly in a `src/app` route directory except the framework's own conventions (`layout.tsx`, `page.*`, `not-found.tsx`, `error.tsx`, metadata assets).
