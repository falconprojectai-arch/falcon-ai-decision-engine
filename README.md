# Revenue Machine

A small, testable foundation for low-cost automation with a strict revenue gate.

**Primary KPI:** independently verified revenue per day. Claims, clicks, leads, and unverified payment messages do not count as revenue.

## Current V1 core

- **Scanner input layer:** validates a supplied JSON feed and can fetch bounded public HTTPS RSS/Atom feeds in dry-run mode.
- **RSS/Atom safety:** enforces HTTPS, rejects local/private-address destinations, limits downloads to 1 MB and 8 seconds, caps results at 50 items, and marks discoveries as medium-risk plus capital/manual-work-required until reviewed.
- **Opportunity qualification:** blocks candidates without an HTTPS evidence URL, review timestamp, confirmed terms/eligibility, confirmed monetization path, and finite non-negative estimates and a success-probability estimate from 0 to 1, where probability-weighted expected revenue exceeds estimated cost. Candidates requiring capital or recurring manual work, or not explicitly classified as low-risk, are blocked.
- **Evidence limitation:** these qualification fields are review metadata, not proof that a source was independently queried. A live source adapter must fetch and validate provider records before setting them. Estimated revenue is not counted as actual revenue.
- **Dry-run worker:** produces an auditable plan without external side effects.
- **Revenue gate:** requires a positive matching payment plus provider name, provider payment ID, verification timestamp, and verification-source metadata. A self-reported `verified=True` flag alone does not count. These metadata fields are not proof of a live check; a tested provider adapter must populate them only after independently querying provider records.
- **Automated tests:** validates the policy and payment rules on every push and pull request.
- **Dashboard:** static Persian RTL project status page, published through GitHub Pages.

## Live experiment

- [JSON Contract Tester (browser-only MVP)](https://falconprojectai-arch.github.io/falcon-ai-decision-engine/products/json-contract-tester/)
- [Product hypothesis and validation gates](OPPORTUNITY_JSON_CONTRACT_TESTER.md)

The hosted URL has not yet been independently confirmed reachable from this session. The source is committed in the repository; treat public deployment as pending until the page is verified in a normal browser.

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
