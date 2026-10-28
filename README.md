# Revenue Machine

A small, testable foundation for low-cost automation with a strict revenue gate.

**Primary KPI:** independently verified revenue per day. Claims, clicks, leads, and unverified payment messages do not count as revenue.

## Current V1 core

- **Scanner input layer:** validates a supplied JSON feed and can fetch bounded public HTTPS RSS/Atom feeds in dry-run mode.
- **RSS/Atom safety:** enforces HTTPS, rejects local/private-address destinations, limits downloads to 1 MB and 8 seconds, caps results at 50 items, and marks discoveries as medium-risk plus capital/manual-work-required until reviewed.
- **Opportunity filter:** rejects opportunities that require upfront capital, manual work, or medium/high risk. Missing risk classifications default to medium risk, so unreviewed candidates are blocked by default.
- **Dry-run worker:** produces an auditable plan without external side effects.
- **Revenue gate:** counts only positive, verified payments that match the opportunity being evaluated.
- **Automated tests:** validates the policy and payment rules on every push and pull request.
- **Dashboard:** static Persian RTL project status page, published through GitHub Pages.

## Run locally

Requires Python 3.12+.

```bash
python -m pip install pytest
python -m pytest -q
python -m revenue_machine examples/opportunities.json
python -m revenue_machine --rss https://example.org/feed.xml
```

The sample JSON feed is intentionally synthetic. The RSS option contacts the specified public HTTPS feed, but only parses candidate titles and prints a dry-run report; it does not execute work or claim revenue. Feed items remain blocked until reviewed and deliberately reclassified.

## Important limits

This is not yet a fully autonomous income system. Live opportunity discovery, real worker adapters, payment-provider verification, reinvestment, and live dashboard telemetry are not implemented. Those steps require separately configured adapters, observable logs, and tests before they can be considered operational.

See [Architecture](ARCHITECTURE.md) and [V1 plan](REVENUE_MACHINE_V1.md).
