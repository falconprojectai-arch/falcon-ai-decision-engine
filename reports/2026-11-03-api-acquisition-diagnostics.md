# JSON Contract Tester API — acquisition and deployment diagnostics

Date: 2026-11-03

## Current verified production behavior

Independent HTTP checks were run against the deployed Cloudflare Worker:

| Check | Expected | Result |
|---|---:|---:|
| `GET /health` | 200 | 200 |
| `OPTIONS /v1/validate-batch` | 204 | 204 |
| Malformed JSON POST | 400 | 400 |
| Valid unpaid batch POST | 402 + `PAYMENT-REQUIRED` | 402 + header |

The live payment challenge is x402 v2, scheme `exact`, Base Mainnet (`eip155:8453`), 5,000 USDC base units = 0.005 USDC per batch. The challenge's `payTo` matches the MetaMask receiving address explicitly confirmed by the owner. This confirms challenge issuance, not payment settlement.

## PayAPI Market result

The provider listing was not submitted. PayAPI's server-side route probe returned `not_402` for the Worker URL, even though independent POST checks receive the expected 402 challenge. The form therefore could not auto-verify the wallet field. No wallet address was manually forced into the form, and no submission/payment was made.

- Listing page: https://payapi.market/list
- API route: https://json-contract-tester-api.falcon-project-ai.workers.dev/v1/validate-batch

## Alternative free directory: Agent402

Agent402 offers free registration, no account, and 0% take rate. Its seller crawler reads `/.well-known/x402` and `/openapi.json`, then discovers and probes the declared routes.

A direct registration attempt using the POST-only route as the origin returned 404 because the crawler treated the supplied origin as a discovery root. To make the service discoverable correctly, the Worker source now exposes:
- `GET /.well-known/x402` — service manifest with the POST route, price, Base network, input schema, and example.
- `GET /openapi.json` — OpenAPI 3.1 document with the POST operation, example request, and x402 price/network annotations.

Agent402 seller registration: https://agent402.tools/sell

## Code and deployment changes

- Worker discovery metadata added in commit: `8d66e84f408c7f35fce98ba5754ec6e9a1b0496d`
- Guarded Cloudflare deployment workflow added and corrected.
- Wrangler production bundle dry-run passed: 1,411.68 KiB upload / 241.80 KiB gzip.
- API test workflow passed: https://github.com/falconprojectai-arch/falcon-ai-decision-engine/actions/runs/41583715860
- Wrangler dry-run workflow passed; actual deploy step was skipped: https://github.com/falconprojectai-arch/falcon-ai-decision-engine/actions/runs/41583716033

## Remaining deployment requirement

The repository currently has neither of these Actions secrets configured:
- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

The workflow is ready. Once both are added under GitHub → repository Settings → Secrets and variables → Actions, pushing the Worker source or manually running the workflow will deploy the discovery endpoints. Do not paste the API token into chat or commit it to the repository.

## Revenue status

- Confirmed paid transactions: 0
- Confirmed revenue: $0
- No wallet signature, payment transaction, or settlement has been created.
