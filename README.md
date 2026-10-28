# Revenue Machine

A small, testable foundation for low-cost automation with a strict revenue gate.

**Primary KPI:** independently verified revenue per day. Claims, clicks, leads, and unverified payment messages do not count as revenue.

## Current V1 core

- **Opportunity filter:** rejects opportunities that require upfront capital, manual work, or medium/high risk.
- **Revenue gate:** counts only positive, verified payments that match the opportunity being evaluated.
- **Automated tests:** validates rejection rules and payment verification on every push and pull request.
- **Dashboard:** static Persian RTL project status page, published through GitHub Pages.

## Run locally

Requires Python 3.12+.

```bash
python -m pip install pytest
python -m pytest -q
```

## Important limits

The current engine is a deterministic core, not a fully autonomous income system. It does not yet scan live markets, perform external work, process payments, or reinvest funds. Those steps require separately configured adapters, observable logs, and tests before they can be considered operational.

See [Architecture](ARCHITECTURE.md) and [V1 plan](REVENUE_MACHINE_V1.md).
