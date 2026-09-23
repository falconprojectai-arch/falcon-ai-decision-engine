from .models import Opportunity, RiskLevel


def approve(opportunity: Opportunity) -> bool:
    """Approve only opportunities compatible with zero-click, low-risk V1."""
    if opportunity.requires_capital:
        return False
    if opportunity.requires_manual_work:
        return False
    if opportunity.risk is not RiskLevel.LOW:
        return False
    return True
