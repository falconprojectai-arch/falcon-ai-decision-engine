# PayAPI Market listing draft — JSON Contract Tester API

**Status:** prepared; not submitted.  
**Reason held:** the live x402 challenge must be checked against a dedicated Base USDC wallet controlled by the project owner before any external listing is submitted.

## Listing details

- **Name:** JSON Contract Tester API
- **Description:** Validate 1–10 JSON outputs against a documented JSON Schema subset. Receive per-sample PASS/FAIL results and structured JSON Pointer diagnostics. Designed for AI-agent and API response contract checks.
- **Host:** https://json-contract-tester-api.falcon-project-ai.workers.dev
- **Paid route:** POST /v1/validate-batch
- **Price:** 0.005 USDC per batch
- **Network:** Base Mainnet (eip155:8453)
- **Asset:** USD Coin (USDC), Base contract `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`
- **Scheme:** x402 v2 exact
- **Durability:** Cloudflare Workers production hostname (not a tunnel or temporary host)
- **Product page:** https://falconprojectai-arch.github.io/falcon-ai-decision-engine/products/json-contract-tester/
- **OpenAPI:** https://json-contract-tester-api.falcon-project-ai.workers.dev/openapi.json
- **Discovery manifest:** https://json-contract-tester-api.falcon-project-ai.workers.dev/.well-known/x402
- **Health:** https://json-contract-tester-api.falcon-project-ai.workers.dev/health

## Working example request

```json
{
  "schema": {
    "type": "object",
    "required": ["ok"],
    "properties": {
      "ok": { "type": "boolean" }
    }
  },
  "outputs": [
    { "id": "sample-1", "json": { "ok": true } }
  ]
}
```

## Before submission — mandatory checks

1. Run the no-payment preflight at https://falconprojectai-arch.github.io/falcon-ai-decision-engine/products/json-contract-tester-api/payment-preflight.html.
2. Decode the live `PAYMENT-REQUIRED` header and verify:
   - network is Base Mainnet (`eip155:8453`);
   - asset is Base USDC;
   - amount is 5,000 atomic units (0.005 USDC);
   - `payTo` exactly matches a dedicated Base EVM wallet controlled by the project owner.
3. Do not use an exchange deposit address (including Toobit) unless the exchange confirms that this exact address supports and credits Base USDC micro-deposits at this amount. The existing project notes warn that exchange minimum deposit thresholds may exceed a $0.005 payment.
4. Never copy a private key or recovery phrase into GitHub, Cloudflare variables, forms, or chat. The Worker needs only the public `PAY_TO` address as a secret.
5. If the live `payTo` address does not match the wallet address entered in the form, do not submit.

## Marketplace terms checked

PayAPI Market's current FAQ says provider listing is free, providers keep 100% of settled calls, and the marketplace requires a durable URL, paid route, working example request, Base USDC wallet controlled by the provider, and a price matching the live 402 challenge. Automated checks run before human review. Its current canary verification pays one route up to $0.10; this API's $0.005 price is below that ceiling, so the published instructions do not call for a provider top-up.

Sources:
- https://payapi.market/faq
- https://payapi.market/terms
- https://payapi.market/list

## Current evidence

- Root route: HTTP 200; service summary and endpoint links verified after deployment.
- Health: HTTP 200.
- x402 discovery manifest: HTTP 200; Base USDC exact quote present at 0.005 USDC.
- OpenAPI: HTTP 200; POST route and request example present.
- GitHub Actions deploy smoke test: passed; an unpaid valid POST returned HTTP 402 with `PAYMENT-REQUIRED`.
- Unit/API tests: passed after adding dependency installation to the API test workflow.
- Paid signing, on-chain settlement, and the actual receiving-wallet identity have **not** been independently verified.
- No PayAPI Market listing has been submitted or accepted. No revenue is claimed.

## Submission state

**Pending wallet ownership verification and explicit owner submission approval.**