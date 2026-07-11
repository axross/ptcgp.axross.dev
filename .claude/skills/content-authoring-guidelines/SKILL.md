---
name: content-authoring-guidelines
description: Conventions for MDX content pages on this Pokémon TCG Pocket documentation site. Covers page placement and metadata exports, heading structure, tables and examples, internal/external linking, tone, game terminology, and the unofficial-fan-content boundary.
when_to_use: Use when writing, editing, or reviewing an MDX guide page — creating a new guide, page metadata, headings, tables, links, tone, or the fan-content disclaimer.
user-invocable: false
---

# Content Authoring Guidelines

This skill owns the **content**: what goes into an MDX page and how it is written. Where the file lives belongs to Project Structure; how the rendered prose looks belongs to UI Design Principles (both resolved via the `AGENTS.md` skill index).

## Page Shape

Every content page is a `page.mdx` that exports Next.js metadata and starts with a single `#` heading matching the metadata title:

```mdx
export const metadata = {
  title: "Getting started",
  description: "One-sentence summary used for search and social previews.",
};

# Getting started

Lead paragraph that says what the page covers and who it is for.
```

**Guidelines:**

- MUST export `metadata` with `title` and `description` from every content page (the home page omits `title` to use the site default).
- MUST have exactly one `h1` per page, matching the metadata title, followed by a lead paragraph before the first `h2`.
- MUST structure the body with `##` sections; nest to `###` only when a section genuinely has sub-topics.
- SHOULD keep GFM tables for rule/value comparisons and prose for explanations — a table cell is not the place for a paragraph.

## Writing Style

**Guidelines:**

- MUST write in second person ("you"), present tense, with short declarative sentences — a guide, not a wiki dump.
- MUST bold a game term on its first introduction and use the game's own naming exactly (Pokémon TCG Pocket, hourglasses, expansion names) thereafter.
- MUST state game facts (deck size, point targets, currency values) only when verifiable in the current version of the game, and prefer describing the mechanic over hardcoding values likely to change.
- SHOULD end a guide with a "What's next" pointer to related pages or the GitHub issue tracker for requests.

## Linking

**Guidelines:**

- MUST use root-relative paths for internal links (`/guides/getting-started`), never full URLs or file paths.
- MUST link external sources with descriptive link text; bare URLs and "click here" are review findings.
- SHOULD link to another guide instead of restating its content when a topic is already covered there.

## Interactive Content

MDX allows embedding components when a widget explains something better than words.

**Guidelines:**

- MUST keep embedded components presentational and content-scoped; anything interactive follows the component skill and gets e2e coverage per the e2e-testing-guidelines skill.
- SHOULD prefer plain markdown until a component demonstrably improves the explanation.

## Fan-Content Boundary

This is an unofficial fan project. The footer disclaimer ("Unofficial fan content. Not affiliated with or endorsed by Nintendo, Creatures, GAME FREAK, or The Pokémon Company.") is load-bearing.

**Guidelines:**

- MUST NOT remove or weaken the footer disclaimer, present it as official content, or reproduce copyrighted card imagery/text wholesale; describing mechanics and strategy in original words is the lane.
- MUST NOT include monetization, pack-odds gambling advice, or account-trading content.
