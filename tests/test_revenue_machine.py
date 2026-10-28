from revenue_machine import RevenueMachine
from revenue_machine.models import Opportunity, RiskLevel, VerifiedRevenue


def candidate(name="demo", **overrides):
    fields = {
        "channel": "organic",
        "risk": RiskLevel.LOW,
        "evidence_url": "https://provider.example/terms",
        "evidence_checked_at": "2026-10-28T12:00:00+00:00",
        "terms_confirmed": True,
        "monetization_confirmed": True,
        "estimated_cost_usd": 0.0,
        "estimated_revenue_usd": 1.0,
        "estimated_minutes": 0,
    }
    fields.update(overrides)
    return Opportunity(name=name, **fields)


def payment(opportunity="demo", amount=12.5, verified=True, **overrides):
    fields = {
        "provider": "example-provider",
        "provider_payment_id": "txn_123",
        "verified_at": "2026-10-28T12:00:00+00:00",
        "verification_source": "provider_api",
    }
    fields.update(overrides)
    return VerifiedRevenue(opportunity, amount, "USD", verified, **fields)


def test_evidence_backed_low_risk_opportunity_is_approved_but_not_revenue():
    result = RevenueMachine().evaluate(candidate())
    assert result.approved is True
    assert result.counted_revenue == 0


def test_capital_or_manual_work_is_rejected():
    machine = RevenueMachine()
    assert not machine.evaluate(candidate("capital", requires_capital=True)).approved
    assert not machine.evaluate(candidate("manual", requires_manual_work=True)).approved


def test_medium_and_high_risk_are_rejected():
    machine = RevenueMachine()
    assert not machine.evaluate(candidate("medium", risk=RiskLevel.MEDIUM)).approved
    assert not machine.evaluate(candidate("high", risk=RiskLevel.HIGH)).approved


def test_only_positive_matching_payments_with_evidence_metadata_count():
    machine = RevenueMachine()
    opportunity = candidate()
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
    self_reported = VerifiedRevenue("demo", 12.5, "USD", True)
    assert machine.evaluate(candidate(), self_reported).counted_revenue == 0


def test_unreviewed_opportunity_defaults_to_medium_risk_and_is_rejected():
    opportunity = Opportunity(name="unreviewed", channel="unknown-source")
    assert opportunity.risk is RiskLevel.MEDIUM
    result = RevenueMachine().evaluate(opportunity)
    assert result.approved is False
    assert "risk is not explicitly classified as low" in result.reason


def test_missing_evidence_terms_or_monetization_blocks_candidate():
    result = RevenueMachine().evaluate(candidate(evidence_url="", terms_confirmed=False, monetization_confirmed=False))
    assert not result.approved
    assert "missing HTTPS evidence URL" in result.reason
    assert "terms/eligibility not confirmed" in result.reason
    assert "monetization path not confirmed" in result.reason


def test_non_positive_unit_economics_blocks_candidate():
    assert not RevenueMachine().evaluate(candidate(estimated_revenue_usd=0)).approved
    assert not RevenueMachine().evaluate(candidate(estimated_cost_usd=2, estimated_revenue_usd=1)).approved


def test_fake_or_invalid_economics_block_candidate():
    assert not RevenueMachine().evaluate(candidate(estimated_cost_usd=float("nan"))).approved
    assert not RevenueMachine().evaluate(candidate(estimated_minutes=-1)).approved
