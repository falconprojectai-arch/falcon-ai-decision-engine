# JSON Contract Tester API (x402 prototype)

A deployed stateless API for AI agents to validate a batch of JSON outputs against the documented JSON Schema subset used by the browser tester. It is available at https://json-contract-tester-api.falcon-project-ai.workers.dev and does not replace the free local browser tool. The live health endpoint returns HTTP 200; a syntactically valid unpaid POST returns HTTP 402 with a PAYMENT-REQUIRED challenge, including generic directory probes that send `{}`. End-to-end paid settlement has not yet been verified.

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

## Buyer integration

- [Buyer quickstart](./BUYER_QUICKSTART.md): unpaid challenge inspection and Node.js x402 client example.
- [OpenAPI 3.1 specification](./openapi.yaml): machine-readable endpoint and request/response contract.
- Live discovery manifest: https://json-contract-tester-api.falcon-project-ai.workers.dev/.well-known/x402
- Live OpenAPI JSON: https://json-contract-tester-api.falcon-project-ai.workers.dev/openapi.json

## No-payment preflight

A browser-based diagnostic page is available at https://falconprojectai-arch.github.io/falcon-ai-decision-engine/products/json-contract-tester-api/payment-preflight.html. It checks health, CORS, malformed-input rejection, and the live x402 402 challenge without connecting a wallet, signing a payment, or spending USDC. A successful preflight does not verify payment signing or settlement.

## Payment

The route uses x402 exact USDC on Base (eip155:8453) at an experimental price of $0.005 per batch. Malformed JSON and bodies over 64 KiB are rejected before payment. JSON that parses but has an invalid schema or batch shape is validated after x402 payment verification and can return HTTP 400. The @x402/hono middleware settles only after a successful response; therefore, a 4xx response is not a settled sale. Count a payment only when a successful 2xx response carries PAYMENT-RESPONSE and an on-chain receipt. Callers should validate their request against the OpenAPI contract before authorizing payment. This ordering also lets generic x402 marketplace probes receive the actual 402 challenge when they send an empty JSON object.

Set the public receiving address as a Cloudflare Worker secret:
```sh
npx wrangler secret put PAY_TO
```
Deploy only after a self-custody wallet has been created and its recovery material safely backed up. No private key belongs in this repository or Worker code. The facilitator is PayAI's public x402 facilitator (`https://facilitator.payai.network`), which supports Base mainnet (`eip155:8453`) and EVM USDC payments. Verify current supported networks at its `/supported` endpoint before changing production configuration.

## Hosting and privacy

Designed for Cloudflare Workers Free, within bounded limits: 64 KiB request body, 10 samples, 32 levels of nesting, 2,000 total JSON nodes, 100 diagnostics per sample. No database, file storage, or request-body logging is implemented. However, callers transmit the schema and JSON payloads to Cloudflare and the facilitator/payment infrastructure; this is separate from the browser tool, whose inputs stay local. Do not send secrets, personal data, or confidential production payloads.

## Validation scope

This is a documented subset only: type, required, properties, additionalProperties: false, items, enum, const, numeric bounds, string length, and array length. The hosted API rejects the regex pattern keyword to avoid unbounded regex CPU use. It is not full JSON Schema.

## Test

Run npm test. Tests cover the mixed batch (1 PASS / 3 FAIL), nested JSON Pointer diagnostics, batch limits, depth limits, node-budget limits, and pointer escaping. The current production Worker and payment challenge are live; end-to-end paid settlement still requires a wallet signature and an on-chain transaction.

## Receiving-address safety note

Toobit has published support for USDC deposits on Base. However, an exchange deposit address is custodial and Toobit applies a per-asset/network minimum deposit threshold; deposits below the displayed minimum may not be credited. This API's experimental price is only $0.005 per batch, so do not configure an exchange deposit address as `PAY_TO` unless Toobit explicitly confirms that this exact address accepts Base USDC micro-deposits at or below that amount and credits each transfer. Preferred production recipient: a dedicated self-custody EVM wallet whose recovery phrase is backed up offline. Never put a private key or recovery phrase in this repository or Worker secrets.

## Browser CORS and marketplace discovery — 2026-11-03

The live Worker now applies CORS to `/health`, `/.well-known/x402`, `/openapi.json` and the API route. Independent browser-compatible HTTP checks confirm Health 200 with `Access-Control-Allow-Origin: *`, OPTIONS 204, malformed JSON 400, and a valid unpaid POST 402. The discovery manifest and OpenAPI JSON are live and have been accepted by Agent402's free directory. A generic Agent402 paywall probe initially got 400 because schema validation ran before payment; the request pipeline has since been changed so syntactically valid JSON reaches the x402 challenge before schema validation. After payment, schema-invalid requests can return a billable 400.
