# Agent acquisition follow-up — 2026-11-04

## Completion checklist
- [x] Recheck PayAPI status.
- [x] Verify production API health and live buyer documentation.
- [x] Research additional x402 discovery channels and buyer paths.
- [x] Identify any marketplace indexing prerequisites.
- [x] Record only verified outcomes; no paid transaction or wallet action.
- [ ] Submit the API to x402scan (one-field public form; not submitted in this run).
- [ ] Obtain an independent successful paid call.
- [ ] Verify listing propagation in Circle/CDP discovery and Agentic Market.

## Current evidence

### PayAPI Market
The latest email remains the 2026-11-03 05:28:56 UTC acceptance of the form, not a live listing. PayAPI says it will pay one canary call from its own wallet; if the server still returns 402 after payment, the listing remains pending and they will email the reason. No newer email or settlement evidence was found on 2026-11-04. No action is requested by PayAPI.

### Production health and product page
- Worker health endpoint returned HTTP 200 and status ok.
- Live browser product page and buyer quickstart are available.
- Buyer quickstart documents x402 JavaScript client use, challenge inspection, limits, and the supported JSON Schema subset.
- No customer payment or paid 2xx response is confirmed.

### New discovery research

#### x402scan
- Public add-API page: https://www.x402scan.com/resources/register
- Discovery guide: https://www.x402scan.com/discovery
- Public form exposes one API URL field and an Add button; no visible login, wallet, payment, contact, or terms field was shown. The page does not explicitly promise free submission, and removability was not verified.
- Candidate URL: https://json-contract-tester-api.falcon-project-ai.workers.dev/v1/validate-batch
- Status: not submitted. The listing should only be submitted if the user accepts a public listing; no payment or wallet action is involved in the visible form.

x402scan states that registered origins receive a merchant storefront and health/usage page through Poncho. This could give a useful public conversion/monitoring surface after registration; it is not yet verified for this service.

#### Circle Agent Marketplace / Discovery API
- Public catalog: https://agents.circle.com/services
- Keyless Discovery API: https://api.circle.com/v2/x402/discovery/resources
- Current public catalog showed 113 services and 2,786 endpoints.
- Querying the catalog for "JSON Contract Tester" returned zero items.
- Circle's seller guide says discovery metadata must be declared and at least one successful settlement through the CDP facilitator is needed for CDP Bazaar indexing.
- Current Worker source uses https://facilitator.payai.network, not the CDP facilitator. Therefore Circle/CDP discovery should not be expected to index this service from the current PayAI settlement path.
- Coinbase's seller quickstart requires a CDP API key ID and secret to authenticate the seller to the CDP Facilitator. It says the API key does not decide where funds land; the existing recipient address remains separately configured.
- Official facilitator pricing: first 1,000 on-chain transactions per month are free; after that, $0.001 per on-chain transaction. Payment verification is free. This makes a CDP trial potentially zero-upfront, but it still requires account access and credentials.
- No public seller-registration endpoint was found in Circle's Discovery API OpenAPI document; it exposes catalog/discovery endpoints. CDP's seller guide says there is no separate Bazaar registration form: validate the endpoint, then complete one successful paid call through CDP Facilitator.
- Decision: do not switch facilitators or request credentials automatically. A CDP migration requires user-controlled CDP account/API credentials, confirmation that the current PAY_TO address is controlled and correct, review of facilitator terms, and end-to-end settlement verification.

#### Agentic Market / PayAI Bazaar
- Agentic Market endpoint validator passed preflight checks but returned index=null.
- PayAI Bazaar lookup by current payTo returned no listing.
- The current PayAI facilitator path is consistent with waiting for a successful paid call that carries the Bazaar extension; no self-funded transaction was made.

#### x402 List API / API Evangelist
- Independent third-party profile directory: https://github.com/api-evangelist/x402-list-api
- The repository states that public API artifacts can be profiled and that corrections/re-scores/removal requests are free. It does not provide a direct self-service submit form in the reviewed README; its contact path is an issue or info@apievangelist.com.
- Status: research only; no issue/email submitted.

## Acquisition actions completed
- Verified the public product page and current API health.
- Verified latest PayAPI email and confirmed no newer canary/settlement email.
- Researched x402scan, Circle Discovery, Agentic Market, and API Evangelist submission/discovery paths.
- No payments, wallet connections, signatures, account creation, paid subscriptions, or third-party messages were made.

## Next steps ranked
1. Wait for PayAPI's independent canary; if they report a persistent 402, inspect the exact response and fix only the identified issue.
2. Submit the API URL to x402scan after explicit confirmation of the public listing, or have the owner click Add on the one-field form.
3. Keep PayAI as the active facilitator while testing its own route; do not change to CDP only to chase indexing without reviewing account and recipient implications.
4. If the user wants CDP marketplace coverage, separately evaluate a CDP facilitator migration and required account credentials; do not run a live paid call without explicit authorization.
5. Improve conversion with an integration example and a short technical post targeted at agent developers; track real clicks, trial usage, and paid 2xx receipts separately from directory submissions.

## Income status
Confirmed revenue: $0.00. Directory submissions, HTTP 402 challenges, and marketplace preflight checks are not sales.

## Buyer integration improvement

Added a Python `httpx` buyer example to `products/json-contract-tester-api/BUYER_QUICKSTART.md`, using the official x402 Python client pattern. It shows an agent developer how to submit a JSON batch, handle the 402 challenge automatically, and inspect settlement response headers. It explicitly requires a local environment variable and dedicated low-balance wallet; no private key is embedded. The example is documented but has not been executed against a paid request because no buyer wallet or transaction was authorized.

Source for the client API pattern: https://docs.x402.org/getting-started/quickstart-for-buyers

## LLM/agent discovery asset

Created a root `llms.txt` with concise product descriptions, the paid API route, pricing, x402 payment network, request/response semantics, supported subset and limitations, buyer quickstart links, safety notes, and technical guides. Updated the GitHub Pages workflow to publish this file at the site root and trigger a Pages deploy when it changes. The JSON Contract Tester product page now links to the LLM/agent index and labels the buyer quickstart as Node.js + Python. Published at https://falconprojectai-arch.github.io/falcon-ai-decision-engine/llms.txt and live fetch verified. The product page link is also live.

## Final verification

- GitHub Pages deployment: successful — https://github.com/falconprojectai-arch/falcon-ai-decision-engine/actions/runs/41777549037
- Chromium smoke tests: dashboard, developer toolbox, payment page, and JSON Contract Tester product all passed.
- Revenue Machine tests: passed — https://github.com/falconprojectai-arch/falcon-ai-decision-engine/actions/runs/41777549046
- Live dashboard confirms Circle, x402scan, CDP facilitator, and LLM index entries.
- Live product page confirms Node.js + Python quickstart, llms.txt, and x402scan submission link.
- Live llms.txt confirms the product, price, payment network, API limits, and Python quickstart.
- Latest PayAPI inbox check still returns only the 2026-11-03 submission acknowledgement; no canary result or settlement has arrived.
