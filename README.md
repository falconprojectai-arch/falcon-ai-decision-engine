# Revenue Machine

A small, testable foundation for low-cost automation with a strict revenue gate.

**Primary KPI:** independently verified revenue per day. Claims, clicks, leads, and unverified payment messages do not count as revenue.

## Paid API/Agent Contract Review

A small manual service is available for a first validation: one JSON Schema or documented contract, up to 10 redacted sample payloads, a PASS/FAIL summary, and practical recommendations. Launch price: **$4 USD equivalent in USDT**, with delivery within 2 business days after payment and materials are confirmed.

- Payment page: https://falconprojectai-arch.github.io/falcon-ai-decision-engine/products/dev-agent-toolbox/payment.html
- Internal delivery template: [JSON/API Contract Review Report](products/dev-agent-toolbox/REVIEW_REPORT_TEMPLATE.md)
- Free JSON contract tester: https://falconprojectai-arch.github.io/falcon-ai-decision-engine/products/json-contract-tester/
- Free API/AI-agent contract checklist and limited preflight request: https://falconprojectai-arch.github.io/falcon-ai-decision-engine/products/dev-agent-toolbox/contract-review-checklist.html
- Current payment rails: USDT on TRC20 or BEP20, manually verified.
- Card checkout is **not enabled**. Do not imply that every buyer can pay; buyers who cannot use crypto should not send payment.
- Never submit production secrets or personal/confidential payloads.
- A transfer is not counted as revenue until it is independently verified and recorded.

## Paid machine API — x402

The JSON Contract Tester also has a live machine-to-machine API for AI agents and automation clients:

- API root: https://json-contract-tester-api.falcon-project-ai.workers.dev/
- Paid route: `POST /v1/validate-batch`
- Price: **0.005 USDC per batch** on Base Mainnet (`eip155:8453`) using x402 v2 exact.
- Health: https://json-contract-tester-api.falcon-project-ai.workers.dev/health
- Discovery manifest: https://json-contract-tester-api.falcon-project-ai.workers.dev/.well-known/x402
- OpenAPI: https://json-contract-tester-api.falcon-project-ai.workers.dev/openapi.json
- No-payment diagnostics: https://falconprojectai-arch.github.io/falcon-ai-decision-engine/products/json-contract-tester-api/payment-preflight.html

The live unpaid request returns HTTP 402 with a payment challenge; this proves the paywall is active, not that a payment has settled. The API passed its unit/route tests and production health, discovery, OpenAPI, and challenge smoke tests. A PayAPI Market listing was accepted into review on 2026-11-03; it is **not live yet** and its paid canary/settlement receipt is pending. No x402 sales or revenue are currently recorded. The public Agent402 seller index also discovers the API as routable on Base; its execute-via lane is callable, while Smart Order Router dispatch remains gated on settlement proof. [Agent402 seller record](https://agent402.tools/api/index?seller=https%3A%2F%2Fjson-contract-tester-api.falcon-project-ai.workers.dev).

## Current V1 core

- **Scanner input layer:** validates a supplied JSON feed and can fetch bounded public HTTPS RSS/Atom feeds in dry-run mode.
- **RSS/Atom safety:** enforces HTTPS, rejects local/private-address destinations, limits downloads to 1 MB and 8 seconds, caps results at 50 items, and marks discoveries as medium-risk plus capital/manual-work-required until reviewed.
- **Opportunity qualification:** blocks candidates without an HTTPS evidence URL, review timestamp, confirmed terms/eligibility, confirmed monetization path, and finite non-negative estimates and a success-probability estimate from 0 to 1, where probability-weighted expected revenue exceeds estimated cost. Candidates requiring capital or recurring manual work, or not explicitly classified as low-risk, are blocked.
- **Evidence limitation:** these qualification fields are review metadata, not proof that a source was independently queried. A live source adapter must fetch and validate provider records before setting them. Estimated revenue is not counted as actual revenue.
- **Dry-run worker:** produces an auditable plan without external side effects.
- **Revenue gate:** requires a positive matching payment plus provider name, provider payment ID, verification timestamp, and verification-source metadata. A self-reported `verified=True` flag alone does not count. These metadata fields are not proof of a live check; a tested provider adapter must populate them only after independently querying provider records.
- **Automated tests:** validates the policy and payment rules on every push and pull request.
- **Dashboard:** static Persian RTL project status page, published through GitHub Pages.

## Developer infrastructure notes

- [Blockchain infrastructure checklist for AI agents](https://falconprojectai-arch.github.io/falcon-ai-decision-engine/products/dev-agent-toolbox/blockchain-infrastructure.html) — a practical RPC and domain evaluation guide. It includes clearly disclosed affiliate links to SwiftNodes and StableDomains; neither provider is presented as independently benchmarked.
- [AI agent integration patterns](https://falconprojectai-arch.github.io/falcon-ai-decision-engine/products/dev-agent-toolbox/agent-integration-patterns.html) — example REST/MCP workflows for domain orders and blockchain RPC, with user-approval and credential-safety notes.

## Live experiment

- [JSON Contract Tester (browser-only MVP)](https://falconprojectai-arch.github.io/falcon-ai-decision-engine/products/json-contract-tester/)
- [Product hypothesis and validation gates](OPPORTUNITY_JSON_CONTRACT_TESTER.md)
- [Demand validation sprint plan](VALIDATION_JSON_CONTRACT_TESTER.md)

The deployed product now passes a Chromium smoke test in GitHub Actions (HTTP 200, expected sample results, structural `const` comparison, stale-report clearing, and no uncaught browser errors). This is a focused desktop smoke test, not exhaustive browser/device coverage. Demand is not yet validated; see [the validation sprint plan](VALIDATION_JSON_CONTRACT_TESTER.md).

## Run locally

Requires Python 3.12+.

```bash
python -m pip install pytest
python -m pytest -q
python -m revenue_machine examples/opportunities.json
python -m revenue_machine --rss https://example.org/feed.xml
python -m revenue_machine examples/opportunities.json --report-out reports/latest_opportunities.json --ledger-out reports/run_history.jsonl
```

Use `--report-out PATH` to save the exact JSON report from a run, including an ISO-8601 timestamp and input source. Use `--ledger-out PATH` to append every run as a JSON Lines record without overwriting earlier runs. The append-only ledger validates required metrics and rejects non-finite values; it is a local audit trail, not a live dashboard feed or payment-provider verification. The dashboard can display the latest report only after that report file is committed to the public repository; saving locally does not publish it automatically. Reports contain dry-run metrics only.

The sample JSON feed is intentionally synthetic. The RSS option contacts the specified public HTTPS feed, but only parses candidate titles and prints a dry-run report; it does not execute work or claim revenue. Feed items remain blocked until reviewed and deliberately reclassified with evidence unit-economics metadata, and a success-probability estimate. The probability is an estimate for ranking/qualification only, never actual revenue.

## Important limits

This is not yet a fully autonomous income system. Live opportunity discovery, live source/provider verification, real worker adapters, payment-provider verification, reinvestment, and live dashboard telemetry are not implemented. Those steps require separately configured adapters, observable logs, and tests before they can be considered operational.

See [Architecture](ARCHITECTURE.md) and [V1 plan](REVENUE_MACHINE_V1.md).
