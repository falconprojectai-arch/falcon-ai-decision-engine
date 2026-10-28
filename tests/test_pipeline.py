from revenue_machine.engine import RevenueMachine
from revenue_machine.models import Opportunity, RiskLevel
from revenue_machine.scanner import scan
from revenue_machine.worker import DryRunWorker


def test_scanner_keeps_only_valid_opportunities():
    valid = Opportunity(name="valid", channel="organic", risk=RiskLevel.LOW, evidence_url="https://provider.example/terms", evidence_checked_at="2026-10-28T12:00:00+00:00", terms_confirmed=True, monetization_confirmed=True, estimated_revenue_usd=1.0, estimated_success_probability=1.0)
    blank = Opportunity(name="  ", channel="organic")
    assert list(scan([valid, blank, "not-an-opportunity"])) == [valid]


def test_worker_is_dry_run_and_never_executes_external_work():
    worker = DryRunWorker()
    plan = worker.plan(Opportunity(name="demo", channel="organic", risk=RiskLevel.LOW, evidence_url="https://provider.example/terms", evidence_checked_at="2026-10-28T12:00:00+00:00", terms_confirmed=True, monetization_confirmed=True, estimated_revenue_usd=1.0, estimated_success_probability=1.0))
    assert plan.approved is True
    assert plan.mode == "dry-run"
    assert plan.executed is False


def test_worker_blocks_rejected_opportunities():
    plan = DryRunWorker().plan(
        Opportunity(name="manual", channel="organic", requires_manual_work=True)
    )
    assert plan.approved is False
    assert plan.executed is False


def test_engine_connects_scanner_filter_and_dry_run_worker():
    plans = RevenueMachine().plan_candidates([
        Opportunity(name="allowed", channel="organic", risk=RiskLevel.LOW, evidence_url="https://provider.example/terms", evidence_checked_at="2026-10-28T12:00:00+00:00", terms_confirmed=True, monetization_confirmed=True, estimated_revenue_usd=1.0),
        Opportunity(name="blocked", channel="organic", requires_capital=True, risk=RiskLevel.LOW),
    ])
    assert [p.approved for p in plans] == [True, False]
    assert all(p.executed is False for p in plans)
