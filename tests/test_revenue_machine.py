from revenue_machine import RevenueMachine
from revenue_machine.models import Opportunity, RiskLevel, VerifiedRevenue


def payment(opportunity="demo", amount=12.5, verified=True, **overrides):
    fields = {
        "provider": "example-provider",
        "provider_payment_id": "txn_123",
        "verified_at": "2026-10-28T12:00:00+00:00",
        "verification_source": "provider_api",
    }
    fields.update(overrides)
    return VerifiedRevenue(opportunity, amount, "USD", verified, **fields)


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


def test_only_positive_matching_payments_with_evidence_metadata_count():
    machine = RevenueMachine()
    opportunity = Opportunity(name="demo", channel="organic", risk=RiskLevel.LOW)
    assert machine.evaluate(opportunity, payment()).counted_revenue == 12.5
    assert machine.evaluate(opportunity, payment(verified=False)).counted_revenue == 0
    assert machine.evaluate(opportunity, payment(amount=-2)).counted_revenue == 0
    assert machine.evaluate(opportunity, payment(provider_payment_id="")).counted_revenue == 0
    assert machine.evaluate(opportunity, payment(verification_source="")).counted_revenue == 0
    mismatch = machine.evaluate(opportunity, payment(opportunity="other", amount=99))
    assert mismatch.counted_revenue == 0
    assert machine.evaluate(opportunity, payment(amount=float("inf"))).counted_revenue == 0
    assert machine.evaluate(opportunity, payment(amount=float("nan"))).counted_revenue == 0


def test_self_reported_verified_boolean_is_not_enough():
    machine = RevenueMachine()
    opportunity = Opportunity(name="demo", channel="organic", risk=RiskLevel.LOW)
    self_reported = VerifiedRevenue("demo", 12.5, "USD", True)
    assert machine.evaluate(opportunity, self_reported).counted_revenue == 0


def test_unreviewed_opportunity_defaults_to_medium_risk_and_is_rejected():
    opportunity = Opportunity(name="unreviewed", channel="unknown-source")
    assert opportunity.risk is RiskLevel.MEDIUM
    assert RevenueMachine().evaluate(opportunity).approved is False
