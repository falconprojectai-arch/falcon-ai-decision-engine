"""Safe worker scaffold. It plans work but performs no external side effects."""
from dataclasses import dataclass

from .filter import approve
from .models import Opportunity


@dataclass(frozen=True)
class WorkPlan:
    opportunity: str
    approved: bool
    mode: str = "dry-run"
    executed: bool = False
    reason: str = ""


class DryRunWorker:
    """Create an auditable plan for approved opportunities without executing them."""

    def plan(self, opportunity: Opportunity) -> WorkPlan:
        if not approve(opportunity):
            return WorkPlan(
                opportunity=opportunity.name,
                approved=False,
                reason="Blocked by opportunity policy; no work performed.",
            )
        return WorkPlan(
            opportunity=opportunity.name,
            approved=True,
            reason="Eligible for a future configured adapter; dry-run only.",
        )
