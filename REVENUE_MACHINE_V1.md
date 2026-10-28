# Revenue Machine V1

## Pipeline

Scanner -> Opportunity Filter -> Worker -> Revenue Verifier -> Scale Controller.

## Implemented in this repository

- Typed opportunity and payment models.
- Candidate scanner input layer that skips invalid records; no live source integration yet.
- Deterministic filter: no upfront capital, no manual work, low risk only.
- Dry-run worker that creates a plan but performs no external action.
- Revenue gate: only positive, verified payments matching the opportunity count.
- Automated tests for filtering, dry-run safety, and payment-verification edge cases.
- GitHub Actions test workflow and static GitHub Pages dashboard deployment.

## Not implemented yet

- Live opportunity-source integrations.
- External worker adapters and real execution.
- Payment-provider verification integration.
- Automatic scaling/reinvestment.
- Live telemetry from the engine into the dashboard.

## Acceptance criteria

1. Every candidate is filtered before execution.
2. Rejected candidates never reach a worker.
3. Worker remains dry-run until an adapter is explicitly configured and tested.
4. Revenue is zero unless a positive payment matches the opportunity and includes provider, provider payment ID, verification timestamp, and verification source metadata. Those fields must be populated only by a tested provider adapter after an independent provider check.
5. Unit tests pass on every push and pull request.
6. External actions remain disabled by default until an adapter is configured and tested.

**Core rule:** only independently verified payments count as revenue. No revenue is claimed until actual payment evidence is integrated and verified.
