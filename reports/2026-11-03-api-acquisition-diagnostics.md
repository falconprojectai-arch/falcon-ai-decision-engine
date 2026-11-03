# JSON Contract Tester API — acquisition and deployment diagnostics

Date: 2026-11-03

## Current production behavior

Independent HTTP checks against the live Cloudflare Worker:

| Check | Result |
|---|---:|
| `GET /health` | 200; `Access-Control-Allow-Origin: *` |
| `OPTIONS /v1/validate-batch` | 204 |
| Malformed JSON POST | 400 before payment |
| Empty JSON POST (`{}`) | 402 + `PAYMENT-REQUIRED` |
| Valid unpaid batch POST | 402 + `PAYMENT-REQUIRED` |

Browser preflight was executed end-to-end: **5/5 passed**, with no failed checks and no wallet connection, signing, or payment. The live challenge is x402 v2, scheme `exact`, Base Mainnet (`eip155:8453`), 5,000 USDC base units = 0.005 USDC per batch. The live `payTo` is `0xFEFA6Cb78Cb79bc140Cd776e038d2093F7A170a5`, matching the MetaMask receiving address explicitly confirmed by the owner.

A key compatibility fix moved schema validation after the x402 middleware. This means generic directory probes that send an empty JSON object now receive the real 402 challenge instead of a misleading 400. Malformed JSON and oversized bodies are still rejected before payment. The x402 Hono middleware settles after a successful response; the API's paid handler returns 200 for a valid batch and 400 for schema-invalid batches. See the official package documentation: https://www.npmjs.com/package/@x402/hono

## PayAPI Market submission

Status: **Submitted — pending review**

The free provider listing was successfully submitted.

- Listing ID: `54bd4f89-23f8-47e7-b507-039362b51198`
- Provider ID: `e1b9b73c-b2fc-4c23-8869-572284569e48`
- Name: JSON Contract Tester API
- Contact: `falcon.project.ai@gmail.com`
- Route: `POST https://json-contract-tester-api.falcon-project-ai.workers.dev/v1/validate-batch`
- Price: 0.005 USDC per batch on Base
- Wallet auto-read from live 402: matches the confirmed receiving address
- Initial triage: `auto_passed`
- Current status: `pending_review`
- Confirmation email: sent and received

PayAPI's email confirms that the form accepted the listing and that the marketplace will make one canary call from its own wallet. If the route returns the same 402 after payment, the listing stays pending and the marketplace emails the reason. No USDC from the seller was spent, and no seller wallet was connected or signed.

- Form: https://payapi.market/list
- Provider dashboard: https://payapi.market/dashboard

## Agent402 free directory

The Worker origin was successfully registered at Agent402. Its public record shows:
- `listed: true`
- Display name: JSON Contract Tester API
- One paid route discovered
- Network: Base Mainnet (`eip155:8453`)
- `routable: true`, health score 1

The latest public Agent402 snapshot now shows `payToByNetwork.eip155:8453` matching the confirmed MetaMask address, a live route `lastVerifiedAt`, one paid route, and `routable: true`. The seller is still below the router's settlement-history floor; its Base verdict has `unprovenTier: true` with a $0.01 ceiling, so a $0.005 request may be considered only after proven sellers. This is directory/paywall verification, not a completed paid transaction or guaranteed dispatch.

- Registration: https://agent402.tools/sell
- Public seller record: https://agent402.tools/api/index?seller=https%3A%2F%2Fjson-contract-tester-api.falcon-project-ai.workers.dev

## Discovery and buyer documentation now live

The Worker serves:
- `GET /.well-known/x402` — service manifest with the POST route, price, Base network, schema, and example.
- `GET /openapi.json` — OpenAPI 3.1 discovery document. The live JSON still has the previous wording for the 400 response description; the repository's OpenAPI YAML, README, and buyer quickstart have been corrected. This is documentation-only; the live challenge and route behavior are verified.

Links:
- Manifest: https://json-contract-tester-api.falcon-project-ai.workers.dev/.well-known/x402
- OpenAPI JSON: https://json-contract-tester-api.falcon-project-ai.workers.dev/openapi.json
- Buyer quickstart: https://github.com/falconprojectai-arch/falcon-ai-decision-engine/blob/main/products/json-contract-tester-api/BUYER_QUICKSTART.md
- OpenAPI YAML: https://github.com/falconprojectai-arch/falcon-ai-decision-engine/blob/main/products/json-contract-tester-api/openapi.yaml
- Five-check preflight: https://falconprojectai-arch.github.io/falcon-ai-decision-engine/products/json-contract-tester-api/payment-preflight.html

## Code and CI

- Discovery endpoints and manifest: Worker source commit `8d66e84f408c7f35fce98ba5754ec6e9a1b0496d`
- Challenge-before-schema-validation compatibility fix: `ceb7c173c3057122e00912544047175809d927c8`
- README, buyer quickstart, and OpenAPI updated to explain billing/validation order.
- API tests passed: https://github.com/falconprojectai-arch/falcon-ai-decision-engine/actions/runs/41583715860
- Wrangler dry-run passed; optional deployment job was skipped because the repository did not contain `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`. The production discovery endpoints and challenge behavior above were independently verified live. The optional GitHub deploy workflow did not have Cloudflare secrets, and a read-only check of dash.cloudflare.com redirected to sign-in; no credentials were entered. The last wording-only change to the Worker-generated OpenAPI JSON is therefore not yet deployed.

## Revenue status

- Paid customer transactions confirmed: 0
- Confirmed revenue: $0
- Seller-signed transactions: 0
- PayAPI's canary payment: pending
- Agent402 settlement verification: pending
