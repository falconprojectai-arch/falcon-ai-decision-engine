# JSON Contract Tester

A free, browser-only utility for checking multiple JSON outputs against one JSON Schema contract.

## Use it when

- An API endpoint returns several sample payloads and you want a fast contract check.
- An AI agent produces structured JSON and you want to compare multiple outputs against the same expected shape.
- You need a private scratchpad: inputs stay in the browser and are not uploaded.

## 60-second workflow

1. Open the [live tool](https://falconprojectai-arch.github.io/falcon-ai-decision-engine/products/json-contract-tester/).
2. Paste a JSON Schema into **JSON Schema**.
3. Put one JSON value per non-empty line in **Test outputs**.
4. Click **Run contract tests**.
5. Download the JSON report for structured diagnostics or the JUnit XML report for CI test-result ingestion.

## Example contract

```json
{
  "type": "object",
  "required": ["ok", "result"],
  "properties": {
    "ok": { "type": "boolean" },
    "result": { "type": "string", "minLength": 1 }
  },
  "additionalProperties": false
}
```

The JUnit XML export is generated locally from the current browser report; it does not upload inputs or change the hosted API response format. The page now loads scripts and styles from same-origin files and applies a restrictive same-origin Content Security Policy meta policy. GitHub Pages does not expose a per-site response-header configuration for adding `X-Content-Type-Options: nosniff`.

## Important scope

This MVP implements a documented subset of JSON Schema: `type`, `required`, `properties`, `additionalProperties: false`, `items`, `enum`, `const`, numeric bounds, string length/pattern, and array length.

It does **not** implement the full specification. Unsupported features include `$ref`/`$defs`, `allOf`/`anyOf`/`oneOf`/`not`, `format` assertions, boolean schemas, and schema-valued `additionalProperties`. Unknown keywords are ignored.

A PASS means only that the value matches the rules supported by this tool. Use a full, well-tested validator for production or security-critical contracts.

## Distribution

- [JSON Contract Tester API on TechTools Launchpad](https://techtools.cz/tools/launchpad/?tool=7727)
- [API OpenAPI document](https://json-contract-tester-api.falcon-project-ai.workers.dev/openapi.json)

## Feedback

If this is useful in a real workflow, please describe the concrete case and the missing rule or error detail in [issue #13](https://github.com/falconprojectai-arch/falcon-ai-decision-engine/issues/13).


**CI boundary:** The JUnit XML button downloads a file generated locally from the current browser report. It can be imported by a CI test-results viewer after you move the file through your own workflow; this tool does not run tests in CI, upload the report, or publish artifacts automatically. Inputs remain in the browser.


## JUnit export regression tests

The browser's JUnit XML exporter has a dependency-free Node test suite. Run it from the repository root:

```bash
node --test products/json-contract-tester/tests/junit-export.test.js
```

The test workflow runs on pushes to `main` and pull requests that change the browser tester or its workflow. It checks mixed-batch counts, per-sample diagnostics, XML escaping, empty reports, and missing-diagnostic fallbacks. It does not upload browser inputs or execute CI tests on user data.
