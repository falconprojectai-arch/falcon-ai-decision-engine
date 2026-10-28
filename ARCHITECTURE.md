# Architecture

## V1 pipeline

1. **Scanner (planned):** gathers candidate opportunities from explicitly configured sources.
2. **Filter (implemented):** rejects candidates requiring capital or manual work, and anything not rated low risk.
3. **Worker (planned):** executes only approved, bounded tasks through explicit adapters; default behavior should be dry-run.
4. **Revenue verifier (implemented core):** counts revenue only for a positive, verified payment associated with the same opportunity.
5. **Scale controller (planned):** increases activity only after verified results and within explicit limits.

## Current modules

- `revenue_machine/models.py`: opportunity and payment data models.
- `revenue_machine/filter.py`: deterministic eligibility policy.
- `revenue_machine/verifier.py`: payment revenue gate.
- `revenue_machine/engine.py`: combines the filter and verifier without performing external side effects.
- `tests/test_revenue_machine.py`: core policy and verification tests.
- `.github/workflows/tests.yml`: runs pytest on pushes and pull requests.
- `dashboard/index.html`: static Persian RTL dashboard; it is not yet connected to live runtime telemetry.

## Safety and accounting rules

- Never count a revenue claim as revenue.
- Never execute an opportunity rejected by the filter.
- A payment must be verified, positive, and tied to the same opportunity before it is counted.
- External network actions, credentials, spending, and reinvestment must be implemented as separate adapters with explicit limits and tests.
- A successful GitHub Pages deployment means the dashboard was published; it does not prove the revenue engine is generating income.
