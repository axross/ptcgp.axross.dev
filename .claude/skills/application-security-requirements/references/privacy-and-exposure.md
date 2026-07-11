# Privacy and Exposure Control

Apply these rules when reviewing whether a change exposes content, identifiers, environment values, or error context beyond the intended audience.

## Public Content Boundaries

Every MDX page committed to the default branch is published — the site has no draft/preview lifecycle. What must stay non-public are secrets, operational identifiers, and anything the deployment platform injects.

**Guidelines:**

- MUST flag a Major when a public response exposes internal storage keys, stack traces, or environment-derived values that are not required for the user-facing feature.
- MUST flag a Critical when sitemap, robots, structured data (e.g., JSON-LD), social-preview (Open Graph) image routes, or generated page metadata expose values sourced from env vars or platform internals rather than from committed content.
- SHOULD verify that any newly served static asset is intentional — everything under the public asset directory ships to every visitor.

## Client and Environment Exposure

Values sent to the browser/client are public. The framework's public/client-exposed env-var prefix (`NEXT_PUBLIC_`) is a release decision, not only a typing convenience.

**Guidelines:**

- MUST flag any newly exposed client-prefixed env value unless it is safe for every visitor to read.
- MUST flag a Critical when secrets, tokens, DSNs with auth tokens, admin emails, session values, or internal URLs can reach client bundles, HTML, metadata, logs, or analytics payloads.
- MUST verify `process.env.*` access remains limited to the env-access files allowed by [secret-handling](./secret-handling.md).
- SHOULD ask for a narrower public value when a client component only needs a derived boolean or public identifier.

## Error Reporting Exposure

Sentry is a third-party data processor. Event context should be useful for debugging without carrying raw private content.

**Guidelines:**

- MUST flag a Major when Sentry context includes secrets, raw request bodies, raw content, or access tokens.
- MUST treat a "send default PII" option in the Sentry config as a privacy-sensitive default and require explicit justification when adding identifiers to its context.
- SHOULD prefer stable non-sensitive identifiers such as route names, page slugs, feature names, and boolean state over raw content values.

## Localhost / Production Divergence

Code gated to the local environment escapes every production test and review scenario, so its divergence from the production path surfaces only after deployment.

**Guidelines:**

- MUST flag a Major when the diff causes a code path to execute only when running locally (per the project's environment flag) but no equivalent exists for production — a localhost-only gate that ships to production via a deployed branch is a recurring class of bug.
