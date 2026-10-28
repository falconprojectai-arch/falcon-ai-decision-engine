# Revenue Machine V1

## Pipeline

Scanner -> Opportunity Filter -> Worker -> Revenue Verifier -> Scale Controller.

## Implemented in this repository

- Typed opportunity and payment models.
- Deterministic filter: no upfront capital, no manual work, low risk only.
- Revenue gate: only positive, verified payments matching the opportunity count.
- Automated tests for policy and payment edge cases.
- GitHub Actions test workflow and static GitHub Pages dashboard deployment.

## Not implemented yet

- Live opportunity-source integrations.
- External worker adapters.
- Payment-provider verification integration.
- Automatic scaling/reinvestment.
- Live telemetry from the engine into the dashboard.

## Acceptance criteria

1. Every candidate is filtered before execution.
2. Rejected candidates never reach a worker.
3. Revenue is zero unless payment verification is explicit and tied to the same opportunity.
4. Unit tests pass on every push and pull request.
5. External actions remain disabled by default until an adapter is configured and tested.

**Core rule:** only independently verified payments count as revenue. No revenue is claimed until actual payment evidence is integrated and verified.
