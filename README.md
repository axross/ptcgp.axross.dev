# ptcgp.axross.dev

A documentation website for **Pokémon TCG Pocket** (PTCGP): guides and
reference material — how the game works, how to build decks, how to grow a
collection — authored in MDX and rendered as a fast, mostly-static Next.js
site, in the manner of [poker.kohei.dev](https://github.com/axross/poker.kohei.dev).
An unofficial fan project by [@axross](https://github.com/axross).

## Tech stack

| Area | Tool |
| ---- | ---- |
| Language | TypeScript |
| App framework / runtime | Next.js (App Router) |
| Content | MDX (`@next/mdx` + `remark-gfm`), pages committed to the repo |
| UI | CSS Modules, CSS-variable light/dark theming, Base UI primitives |
| Package manager | npm |
| Linting & formatting | Biome |
| Unit tests | Vitest |
| E2E tests | Playwright (+ scenario-coverage catalog in `e2e/scenarios.md`) |
| Error reporting | Sentry (`@sentry/nextjs`) |
| Hosting | Vercel |

## Getting started

1. Use the Node version in `.nvmrc` (Node 22+).
2. Install dependencies: `npm install`
3. Copy the env example: `cp .env.example .env.local` (Sentry values may stay
   empty; error reporting is disabled outside production builds).
4. Start developing: `npm run dev`
5. Production build and start: `npm run build`, then `npm run start`

New guide pages are MDX files at `src/app/guides/<slug>/page.mdx`; see the
content-authoring skill under `.claude/skills/` for the page conventions.

## Development workflow

Development in this repository is agent-assisted via
[Claude Code](https://claude.com/claude-code). The working agreement lives in
[`AGENTS.md`](./AGENTS.md) (loaded through `CLAUDE.md`) and routes to the
detailed skills under [`.claude/skills/`](./.claude/skills). Human and agent
contributors follow the same loop: plan → implement → self-review → verify →
report.

### `/address` — deliver a unit of work end-to-end

[`/address`](./.claude/skills/address/SKILL.md) is the main delivery entry point.
It takes one unit of work — a GitHub issue, a pull request, or a free-form
prompt — from intake to a merge-ready pull request in a single continuing
session:

1. **Plan** — reads the issue and its thread, asks you the product and scope
   questions the spec leaves open, and rewrites the issue body into a
   reviewable plan with acceptance criteria. It then **always pauses for your
   approval**: it verifies nothing gets built until you review the plan and
   send `/address continue`.
2. **Code + verify** — implements the approved plan (on a separate worktree
   unless it is running in a Claude Code cloud environment, so it never blocks
   your working copy) on an agent-namespaced branch, runs the checks the
   changed surface requires, and self-reviews the diff.
3. **Independent review** — opens a draft pull request and requests the CI
   reviewer, a separate bot session, so the code's author never certifies its
   own work.
4. **Address** — fixes review findings and CI failures, tying each resolved
   thread to the resolving commit, for up to eight rounds.
5. **Ready** — flips the pull request to ready once CI is green and the review
   is clean. Merging always stays a human decision.

Practical examples:

```text
/address https://github.com/axross/ptcgp.axross.dev/issues/42   # deliver issue #42 end-to-end
/address 57                                        # resume delivery of open PR #57
/address The 404 page should link back home        # no issue yet: files a tracking
                                                   #   issue, then delivers it
/address continue                                  # approve a paused plan, or resume
                                                   #   after you answer a question,
                                                   #   leave PR comments, or start a
                                                   #   fresh session from a /handoff
                                                   #   package
```

Every run pauses after the plan for your approval, and pauses again whenever it
genuinely needs a human — an ambiguous requirement, a judgment call on
conflicting changes — and `/address continue` picks it back up where it
stopped.

### `@claude review` — get findings on any PR

Comment **`@claude review`** on a pull request to run this repository's review
policy ([`REVIEW.md`](./REVIEW.md)) — severity-tagged findings with `file:line`
evidence and concrete fixes, posted as inline comments by the CI reviewer
([`claude-review.yaml`](./.github/workflows/claude-review.yaml)). Use it for a
pre-merge check on a hand-written change or a second opinion before merging; the
same review runs automatically against `/address` pull requests.

### `/handoff` — suspend work for another session

[`/handoff`](./.claude/skills/handoff/SKILL.md) packages in-progress work — goal,
current state, remaining to-dos, uncommitted changes — into a downloadable
`handoff-<epoch>.md` (plus an optional zip of supporting files). Use it when a
session is running low on context, or to park work for later; a fresh session
(yours or a teammate's) takes the package over with `/address continue`.

Changes made without an agent follow the same bar: branch, implement, run the
checks below, open a pull request, and get it reviewed before merge.

## Testing

End-to-end tests are the primary verification: they drive the built site in a
real browser and assert the journeys cataloged in
[`e2e/scenarios.md`](./e2e/scenarios.md) (every `must`-priority journey is
hard-gated by `npm run test:e2e:coverage`). Vitest covers pure logic in
`src/lib`. CI (merge-checks) enforces lint, type-check, and unit tests on
every pull request.

| Check | Command |
| ----- | ------- |
| Format | `npm run format` |
| Lint | `npm run lint` |
| Type-check | `npm run typecheck` |
| Unit tests | `npm run test:unit` |
| E2E tests | `npm run test:e2e` |
| E2E + must-scenario gate | `npm run test:e2e:coverage` |

Run format + lint after every change, and the suites relevant to the changed
surface before opening a pull request — see the Verification section of
[`AGENTS.md`](./AGENTS.md).

## Related links

- Production site: <https://ptcgp.axross.dev>
- Issue tracker: <https://github.com/axross/ptcgp.axross.dev/issues>
- Design/UX reference: [poker.kohei.dev](https://github.com/axross/poker.kohei.dev)
