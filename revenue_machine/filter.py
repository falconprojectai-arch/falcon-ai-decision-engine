import math
from urllib.parse import urlparse

from .models import Opportunity, RiskLevel


def qualification_reasons(opportunity: Opportunity) -> list[str]:
    """Return blockers for a candidate; metadata is not independent verification."""
    reasons: list[str] = []
    if opportunity.requires_capital:
        reasons.append("requires upfront capital")
    if opportunity.requires_manual_work:
        reasons.append("requires recurring manual work")
    if opportunity.risk is not RiskLevel.LOW:
        reasons.append("risk is not explicitly classified as low")

    parsed = urlparse(opportunity.evidence_url)
    if parsed.scheme != "https" or not parsed.netloc:
        reasons.append("missing HTTPS evidence URL")
    if not opportunity.evidence_checked_at.strip():
        reasons.append("missing evidence review timestamp")
    if not opportunity.terms_confirmed:
        reasons.append("terms/eligibility not confirmed")
    if not opportunity.monetization_confirmed:
        reasons.append("monetization path not confirmed")

    cost = opportunity.estimated_cost_usd
    revenue = opportunity.estimated_revenue_usd
    if not math.isfinite(cost) or cost < 0:
        reasons.append("estimated cost must be finite and non-negative")
    if not math.isfinite(revenue) or revenue < 0:
        reasons.append("estimated revenue must be finite and non-negative")
    probability = opportunity.estimated_success_probability
    if (
        not isinstance(probability, (int, float))
        or isinstance(probability, bool)
        or not math.isfinite(probability)
        or probability < 0
        or probability > 1
    ):
        reasons.append("estimated success probability must be between 0 and 1")
    elif (
        math.isfinite(cost)
        and cost >= 0
        and math.isfinite(revenue)
        and revenue >= 0
        and probability * revenue <= cost
    ):
        reasons.append("probability-weighted expected revenue does not exceed estimated cost")
    if (
        isinstance(opportunity.estimated_minutes, bool)
        or not isinstance(opportunity.estimated_minutes, int)
        or opportunity.estimated_minutes < 0
    ):
        reasons.append("estimated minutes must be a non-negative integer")
    return reasons


def approve(opportunity: Opportunity) -> bool:
    """Approve only low-risk candidates with documented evidence and positive economics."""
    return not qualification_reasons(opportunity)
