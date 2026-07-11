---
name: observability-guidelines
description: Use this skill whenever writing, reviewing, or modifying code that throws, catches, or reports errors — including `try`/`catch` placement, Sentry capture calls, top-level error boundaries, and error-message quality. Use even when the user only mentions Sentry, an error tracker, capturing an exception, error boundaries, or debugging an unhandled exception in this project.
---

# Observability Guidelines

Apply these rules when writing, reviewing, or modifying any code that handles or reports errors.

## Error Handling

See [error-handling.md](./references/error-handling.md) for:

- Where to place try-catch blocks and how errors propagate
- Rethrowing errors that are caught only for side effects
- When caught errors should be reported before alternate control flow
- Top-level error boundaries and root-level error handling

## Error Tracking

See [error-tracking.md](./references/error-tracking.md) for:

- Sentry initialization and runtime-specific configuration files
- The error-reporting capture call's import source, context, and privacy boundaries
- PII settings and safe event context
- Source map and instrumentation changes

## No Structured Logger

This project has no structured logger. Unexpected failures are reported to
Sentry; transient `console` diagnostics are removed before a change is
committed.
