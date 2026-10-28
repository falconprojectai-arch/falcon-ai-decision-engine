"""Deterministic revenue-gated core."""
from collections.abc import Iterable
from dataclasses import dataclass
from .filter import approve
from .models import Opportunity, VerifiedRevenue
from .scanner import scan
from .verifier import verify
from .worker import DryRunWorker, WorkPlan

@dataclass(frozen=True)
class Evaluation:
    opportunity: str
    approved: bool
    counted_revenue: float = 0.0
    currency: str = "USD"
    reason: str = ""

class RevenueMachine:
    """Plan supplied candidates safely; no network or money movement."""
    def __init__(self) -> None:
        self.worker = DryRunWorker()

    def plan_candidates(self, candidates: Iterable[Opportunity]) -> list[WorkPlan]:
        return [self.worker.plan(candidate) for candidate in scan(candidates)]

    def evaluate(self, opportunity: Opportunity, payment: VerifiedRevenue | None = None) -> Evaluation:
        if not approve(opportunity):
            return Evaluation(opportunity.name, False, reason="Rejected by low-risk, no-capital, no-manual-work policy.")
        if payment is None:
            return Evaluation(opportunity.name, True, reason="Approved for evaluation; no verified payment supplied.")
        if payment.opportunity != opportunity.name:
            return Evaluation(opportunity.name, True, reason="Payment opportunity mismatch; revenue not counted.")
        counted = verify(payment)
        return Evaluation(opportunity.name, True, counted, payment.currency, "Verified payment counted." if counted > 0 else "Unverified or non-positive payment; revenue not counted.")
