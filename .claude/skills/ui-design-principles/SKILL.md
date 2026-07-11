---
name: ui-design-principles
description: Use this skill when deciding how a surface of this site should look — color roles and the CSS-variable palette, light/dark theming, typography and the prose column, control selection, spacing, responsive behavior, copy tone in the chrome, and accessibility intent. Design vocabulary only; implementation mechanics live in the component skill.
---

# UI Design Principles

This skill owns **how surfaces look**, in design vocabulary. Construction mechanics belong to Component Guidelines; file placement belongs to Project Structure (both resolved via the `AGENTS.md` skill index). The visual manner follows poker.kohei.dev: a quiet, readable, single-column documentation site where content is the interface.

## Color Roles

All colors come from the CSS variables in `src/app/globals.css`; both light and dark values are defined there and switch via `prefers-color-scheme`.

| Role | Variable | Used for |
| ---- | -------- | -------- |
| Background | `--color-background` | Page background |
| Surface | `--color-surface` | Code blocks, table headers, tooltip/popup fills |
| Border | `--color-border` | Hairline separators, table borders, popup outlines |
| Foreground | `--color-foreground` | Body text, headings, active nav |
| Muted foreground | `--color-foreground-muted` | Secondary text, inactive nav, footer |
| Accent | `--color-accent` | Links, focus outlines — interaction only |
| Accent foreground | `--color-accent-foreground` | Text/icon on accent-filled elements |

**Guidelines:**

- MUST use these roles via their variables; no literal color values in component styles.
- MUST define both light and dark values when adding a variable, and check the surface in both schemes.
- MUST reserve accent for interactive elements (links, focus); prose emphasis uses weight, not color.
- MUST pair any color that carries meaning with a non-color cue (wording, weight, icon, or underline).

## Typography and Layout

- One centered content column, `--content-max-width` (46rem) wide; nothing but the header and footer sits outside it.
- System font stacks (`--font-sans`, `--font-mono`); no webfonts.
- MDX prose typography is owned by the `prose` class (`src/components/prose.module.css`) — headings, lists, tables, code, and blockquotes are styled there once, not per page.

**Guidelines:**

- MUST keep body text at the base size (1rem/1.75); size changes express hierarchy only through the heading scale in the prose styles.
- MUST keep wide content (tables, code blocks) scrollable within the column rather than widening the page.
- SHOULD express hierarchy with spacing and weight before adding new visual elements (rules, boxes, backgrounds).

## Controls and Interaction

| Decision shape | Control |
| -------------- | ------- |
| Go somewhere | Link (accent color, underline on hover) |
| Site-level navigation | Header nav link with `aria-current` state |
| Supplementary hint on an icon | Base UI Tooltip |
| Anything requiring focus trapping / overlay | The matching Base UI primitive |

**Guidelines:**

- MUST have at most one accent-emphasized action per surface; everything else stays muted-foreground until hover.
- MUST show the interactive state trio (hover, focus-visible, current) on nav elements; focus uses the global accent outline.

## Copy

**Guidelines:**

- MUST write chrome and UI copy in sentence case, short and factual ("Page not found", not "Oops! We couldn't find that page!").
- MUST keep the unofficial-fan-content disclaimer in the footer on every page (wording owned by Content Authoring Guidelines).

## Responsive Behavior

**Guidelines:**

- MUST design mobile-first: the single column works from 320px up, with side padding from the layout, no horizontal page scroll.
- SHOULD verify new surfaces at a narrow (~375px) and a desktop (~1280px) width before calling them done.
