# PayAPI Market listing — pending review and canary verification

**Status:** form accepted on 2026-11-03; listing is pending review, not live.  
**Marketplace listing ID:** `54bd4f89-23f8-47e7-b507-039362b51198`  
**Do not submit a duplicate.**

## Verified marketplace email

Gmail contains an official message from `notifications@payapi.market`, received 2026-11-03 05:28:56 UTC, subject: **We have your PayAPI Market submission: JSON Contract Tester API**.

The message states:
- The form accepted **JSON Contract Tester API**.
- Acceptance does not mean the listing is live.
- PayAPI Market will pay one call from its own wallet to the submitted route.
- If the server returns the same 402 after payment, the listing stays pending and they will email the reason.
- **No action is needed unless PayAPI emails again.**

This supersedes the earlier assumption that a new listing submission was still required. Do not create a duplicate listing or send a follow-up unless the marketplace asks.

## Submitted API details (technical record)

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

## Live technical checks

- API root: HTTP 200; service summary and endpoint links verified after deployment.
- Health: HTTP 200.
- x402 discovery manifest: HTTP 200; Base USDC exact quote present at 0.005 USDC.
- OpenAPI: HTTP 200; POST route and request example present.
- Browser product page: HTTP 200; default sample renders 1 PASS / 2 FAIL.
- GitHub Actions deploy smoke test: passed; an unpaid valid POST returned HTTP 402 with `PAYMENT-REQUIRED`.
- API and validator tests: passed after the API test workflow was updated to install dependencies before importing the Hono app.
- Paid signing, marketplace canary settlement, and a public settlement receipt have **not** yet been independently verified.

## Marketplace terms relevant to the pending canary

PayAPI Market's current FAQ says listing is free, providers keep 100%, and the marketplace tests a route using one paid canary from its own wallet, up to $0.10. The submitted API's $0.005 price is below that ceiling. No provider top-up is called for by the published instructions for this price.

Sources:
- https://payapi.market/faq
- https://payapi.market/terms
- https://payapi.market/list

## Next step

**Wait for PayAPI Market's canary result email or a public listing/receipt.** No additional wallet funding, signature, transaction, listing submission, or outreach is required at this stage. If a failure email arrives, inspect its exact reason and only then change the relevant configuration.

Verified project revenue remains **$0** until a real successful paid response and on-chain settlement receipt are independently confirmed.