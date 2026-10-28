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
5. Download the report if you want a small artifact to attach to a bug or review.

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

## Important scope

This MVP implements a documented subset of JSON Schema: `type`, `required`, `properties`, `additionalProperties: false`, `items`, `enum`, `const`, numeric bounds, string length/pattern, and array length.

It does **not** implement the full specification. Unsupported features include `$ref`/`$defs`, `allOf`/`anyOf`/`oneOf`/`not`, `format` assertions, boolean schemas, and schema-valued `additionalProperties`. Unknown keywords are ignored.

A PASS means only that the value matches the rules supported by this tool. Use a full, well-tested validator for production or security-critical contracts.

## Feedback

If this is useful in a real workflow, please describe the concrete case and the missing rule or error detail in [issue #13](https://github.com/falconprojectai-arch/falcon-ai-decision-engine/issues/13).
