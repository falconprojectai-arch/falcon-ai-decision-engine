"""Minimal deterministic core for the Revenue Machine V1 pipeline."""
from dataclasses import dataclass

from .filter import approve
from .models import Opportunity, VerifiedRevenue
from .verifier import verify


@dataclass(frozen=True)
class Evaluation:
    opportunity: str
    approved: bool
    counted_revenue: float = 0.0
    currency: str = "USD"
    reason: str = ""


class RevenueMachine:
    """Evaluate opportunities and count only verified positive payments.

    This core does not perform web scanning, execute third-party work, or move money.
    Those integrations must be added behind explicit adapters and tested separately.
    """

    def evaluate(
        self,
        opportunity: Opportunity,
        payment: VerifiedRevenue | None = None,
    ) -> Evaluation:
        if not approve(opportunity):
            return Evaluation(
                opportunity=opportunity.name,
                approved=False,
                reason="Rejected by low-risk, no-capital, no-manual-work policy.",
            )

        if payment is None:
            return Evaluation(
                opportunity=opportunity.name,
                approved=True,
                reason="Approved for evaluation; no verified payment supplied.",
            )

        if payment.opportunity != opportunity.name:
            return Evaluation(
                opportunity=opportunity.name,
                approved=True,
                reason="Payment opportunity mismatch; revenue not counted.",
            )

        counted = verify(payment)
        return Evaluation(
            opportunity=opportunity.name,
            approved=True,
            counted_revenue=counted,
            currency=payment.currency,
            reason="Verified payment counted." if counted > 0 else "Unverified or non-positive payment; revenue not counted.",
        )
