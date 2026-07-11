# E2E Scenario Catalog

The journey catalog for scenario coverage (see the e2e-testing-guidelines
skill, scenario-coverage reference). One row per user journey; tests declare
which journeys they assert with `@scenario:<id>` tags, plus `@area:<area>` /
`@priority:<priority>` facet tags that must agree with the row here.

- **Id** is the stable contract between this catalog and test tags — never
  rename one without updating every tag in the same change.
- **Priority** is `must` (gated at 100% by `npm run test:e2e:coverage`),
  `should`, or `may` (report-only).

| Id | Title | Area | Priority |
| -- | ----- | ---- | -------- |
| home.view | Visitor reads the home page and sees what the site offers | home | must |
| docs.guide.view | Visitor reads a guide page's full content | docs | must |
| docs.navigate | Visitor navigates from the home page to a guide via the site nav | docs | should |
| app.not-found | Visitor hits an unknown URL, sees the not-found page, and returns home | app | should |
