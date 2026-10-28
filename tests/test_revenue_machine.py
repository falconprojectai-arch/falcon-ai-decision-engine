from revenue_machine import RevenueMachine
from revenue_machine.models import Opportunity, RiskLevel, VerifiedRevenue


def test_low_risk_no_capital_opportunity_is_approved_but_not_revenue():
    result = RevenueMachine().evaluate(Opportunity(name="demo", channel="organic", risk=RiskLevel.LOW))
    assert result.approved is True
    assert result.counted_revenue == 0


def test_capital_or_manual_work_is_rejected():
    machine = RevenueMachine()
    assert not machine.evaluate(Opportunity(name="capital", channel="x", requires_capital=True, risk=RiskLevel.LOW)).approved
    assert not machine.evaluate(Opportunity(name="manual", channel="x", requires_manual_work=True, risk=RiskLevel.LOW)).approved


def test_medium_and_high_risk_are_rejected():
    machine = RevenueMachine()
    assert not machine.evaluate(Opportunity(name="medium", channel="x", risk=RiskLevel.MEDIUM)).approved
    assert not machine.evaluate(Opportunity(name="high", channel="x", risk=RiskLevel.HIGH)).approved


def test_only_verified_positive_matching_payment_counts():
    machine = RevenueMachine()
    opportunity = Opportunity(name="demo", channel="organic", risk=RiskLevel.LOW)
    assert machine.evaluate(opportunity, VerifiedRevenue("demo", 12.5, "USD", True)).counted_revenue == 12.5
    assert machine.evaluate(opportunity, VerifiedRevenue("demo", 12.5, "USD", False)).counted_revenue == 0
    assert machine.evaluate(opportunity, VerifiedRevenue("demo", -2, "USD", True)).counted_revenue == 0
    mismatch = machine.evaluate(opportunity, VerifiedRevenue("other", 99, "USD", True))
    assert mismatch.counted_revenue == 0


def test_unreviewed_opportunity_defaults_to_medium_risk_and_is_rejected():
    opportunity = Opportunity(name="unreviewed", channel="unknown-source")
    assert opportunity.risk is RiskLevel.MEDIUM
    assert RevenueMachine().evaluate(opportunity).approved is False
