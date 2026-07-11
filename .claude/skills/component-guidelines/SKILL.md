---
name: component-guidelines
description: Use this skill when writing, placing, reviewing, or refactoring a React component in this project — component anatomy and naming, CSS Modules pairing, Base UI headless primitives, server/client boundary decisions, test-id hooks, accessibility mechanics, and when a repeated pattern earns a shared component.
---

# Component Guidelines

This skill owns **how components are built**. Where a component file lives belongs to Project Structure; how a surface should look (colors, type, spacing) belongs to UI Design Principles (both resolved via the `AGENTS.md` skill index).

## Catalog

Compose existing components instead of re-creating their look. Current shared components:

| Component | Purpose |
| --------- | ------- |
| `SiteHeader` (`src/components/site-header.tsx`) | Sticky site chrome: wordmark, nav, GitHub link |
| `NavLink` (`src/components/nav-link.tsx`) | Client nav link that sets `aria-current="page"` via `isActiveRoute()` |
| `GitHubLink` (`src/components/github-link.tsx`) | Icon link wrapped in a Base UI Tooltip |
| `Prose` / `Table` (`src/mdx-components.tsx`) | MDX wrappers: typography scope and scrollable tables |

**Guidelines:**

- MUST keep this catalog current when adding or removing shared components.
- MUST flag (in review) a new component that re-implements an existing component's look or behavior instead of composing it.

## Anatomy

**Guidelines:**

- MUST name component files kebab-case with a PascalCase named export (`site-header.tsx` exports `SiteHeader`); no default exports outside framework-required files (`page.tsx`, `layout.tsx`, etc.).
- MUST pair a component that renders styled DOM with a same-basename `*.module.css` file and reference classes via the imported `styles` object.
- MUST give every visually distinct, test-relevant element a kebab-case `data-testid`, scoped to be unique within its container — e2e specs locate elements by chained test ids (see the e2e-testing-guidelines skill).
- SHOULD type props inline for small components and extract a named type only when it is reused or exceeds a handful of fields.

## Server / Client Boundary

Components are server components by default; `"use client"` is the exception and needs a concrete reason (state, effects, event handlers, browser APIs, or a Base UI primitive).

**Guidelines:**

- MUST keep `"use client"` on the smallest subtree that needs it — extract the interactive leaf (as with `NavLink` and `GitHubLink` under the server-rendered `SiteHeader`) rather than promoting a whole section.
- MUST NOT fetch data or derive content in client components; lift that into the server parent and pass plain data down.

## Base UI Usage

Base UI (`@base-ui/react`) provides the headless interactive primitives (tooltip, dialog, popover, menu, …). Hand-rolling focus management or portal logic that a Base UI part already implements is a review finding.

**Guidelines:**

- MUST use the matching Base UI component for any interactive primitive it covers, importing from the per-component subpath (`@base-ui/react/tooltip`).
- MUST style Base UI parts through their `className` with CSS Modules; follow the part structure (`Root` / `Trigger` / `Portal` / `Positioner` / `Popup`) rather than collapsing parts.
- MUST use the `render` prop to merge a Base UI part onto a semantic element (e.g. rendering a Trigger as an `<a>`), keeping the accessible element real.

## Promotion Criteria

**Guidelines:**

- SHOULD extract a shared component once the same markup-plus-style pattern appears in two places and a third is plausible; until then, keep the pattern local to its route.
- MUST NOT create speculative props or variants for needs no current caller has.

## Accessibility Mechanics

Design intent (contrast, copy, non-color cues) lives in UI Design Principles; this skill owns the mechanics.

**Guidelines:**

- MUST use semantic elements (`nav`, `main`, `header`, `footer`, real `<a>`/`<button>`) before reaching for ARIA attributes.
- MUST give icon-only controls an accessible name (`aria-label`) and mark decorative SVGs `aria-hidden="true"`.
- MUST keep focusability and visible focus intact — the global `:focus-visible` outline MUST NOT be suppressed for individual components.
