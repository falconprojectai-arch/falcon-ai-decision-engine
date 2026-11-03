# JSON Contract Tester API (x402 prototype)

A separate stateless API for AI agents to validate a batch of JSON outputs against the documented JSON Schema subset used by the browser tester. It is not deployed and does not replace the free local browser tool.

## Route
POST /v1/validate-batch

Example request:
```json
{
  "schema": { "type": "object", "required": ["ok", "result"], "properties": { "ok": { "type": "boolean" }, "result": { "type": "string" } } },
  "outputs": [
    { "id": "sample-1", "json": { "ok": true, "result": "done" } },
    { "id": "sample-2", "json": { "ok": "yes", "result": "done" } }
  ]
}
```

A successful paid response contains valid, a batch summary, per-sample results, and structured errors with instancePath, schemaPath, keyword, expected, and actual.

## Payment
The route uses x402 exact USDC on Base (eip155:8453) at an experimental price of $0.005 per batch. Set the public receiving address as a Cloudflare Worker secret:
```sh
npx wrangler secret put PAY_TO
```
Deploy only after a self-custody wallet has been created and its recovery material safely backed up. No private key belongs in this repository or Worker code. The facilitator is the public Coinbase x402 facilitator.

## Hosting and privacy
Designed for Cloudflare Workers Free, within bounded limits: 64 KiB request body, 10 samples, 32 levels of nesting, 2,000 total JSON nodes, 100 diagnostics per sample. No database, file storage, or request-body logging is implemented. However, callers transmit the schema and JSON payloads to Cloudflare and the facilitator/payment infrastructure; this is separate from the browser tool, whose inputs stay local. Do not send secrets, personal data, or confidential production payloads.

## Validation scope
This is a documented subset only: type, required, properties, additionalProperties: false, items, enum, const, numeric bounds, string length/pattern, and array length. It is not full JSON Schema.

## Test
Run npm test. Tests cover the mixed batch (1 PASS / 3 FAIL), nested JSON Pointer diagnostics, batch limits, depth limits, node-budget limits, and pointer escaping. Payment middleware integration still requires dependency installation, Cloudflare deployment and a Base wallet to verify end-to-end.
