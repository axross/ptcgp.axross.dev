# Input Validation

Apply these rules to verify every untrusted input is validated and coerced before reaching an outbound `fetch` or any rendering pipeline. Treat the static types at a request boundary as unverified: the runtime value may not match its declared type (e.g., a single query param may arrive as a string, an array, or `undefined`).

## Route Inputs (params, query params)

Route and query params are the cheapest input an attacker controls — anyone crafts them in a URL — and the declared types at the boundary promise shapes the runtime never enforces.

**Guidelines:**

- MUST flag a Critical when a route param or query param value reaches a `fetch` URL, a filesystem path, or a redirect target without an explicit type assertion or validation-library parse. The static type at the boundary lies — at runtime a query value can be `string | string[] | undefined`.
- MUST flag a Major when a boolean query param is coerced via a truthy check (`if (query.flag)`) instead of value comparison (`query.flag === "true"`). Explicit value comparison avoids treating a `?flag=false` value as truthy.
- MUST flag a Critical when a dynamic segment (e.g., a slug path param) is used in an equality comparison or lookup without ensuring it is a string. An array value can bypass an equals check.

## Server Actions and Request Handlers

Request bodies and form data arrive from arbitrary clients, so the handler's parameter types describe intent, not what actually shows up at runtime.

**Guidelines:**

- MUST flag a Critical when a new request handler reads a JSON body, form data, or the request URL without a zod schema (or equivalent runtime check) validating the parsed shape before use.
- MUST flag a Critical when a new server-side callable invoked from the client accepts arguments without runtime validation, regardless of static types.

## External Responses

Responses from third-party APIs drift from the code's expectations — versions change, fields disappear, and error payloads replace success shapes.

**Guidelines:**

- MUST flag a Critical when a new function fetching external data does not run a zod `parse(…)` or `safeParse(…)` on the response before returning it to consumers.
- MUST flag a Major when a safe-parse failure is **silently** dropped in production code (no report or fallback signal). Report unexpected shapes with enough context (URL or identifier and flattened error) to debug.

## Rendering Pipeline Inputs

The MDX pipeline's safety argument rests on its input being repository-committed content, so a new feed path invalidates that argument even when the pipeline code is untouched.

**Guidelines:**

- MUST flag a Critical when a new code path compiles or renders MDX/markdown sourced from anywhere other than files committed to this repository (user input, query params, external HTTP). The pipeline assumes trusted, committed input.
- MUST flag a Major when a new custom render node or transform reads attribute values without validating them — validate parseable inputs (e.g., `URL.canParse(href)`) before constructing the node.
