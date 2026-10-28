from revenue_machine.models import Opportunity
from revenue_machine.scanner import scan
from revenue_machine.worker import DryRunWorker


def test_scanner_keeps_only_valid_opportunities():
    valid = Opportunity(name="valid", channel="organic")
    blank = Opportunity(name="  ", channel="organic")
    assert list(scan([valid, blank, "not-an-opportunity"])) == [valid]


def test_worker_is_dry_run_and_never_executes_external_work():
    worker = DryRunWorker()
    plan = worker.plan(Opportunity(name="demo", channel="organic"))
    assert plan.approved is True
    assert plan.mode == "dry-run"
    assert plan.executed is False


def test_worker_blocks_rejected_opportunities():
    plan = DryRunWorker().plan(
        Opportunity(name="manual", channel="organic", requires_manual_work=True)
    )
    assert plan.approved is False
    assert plan.executed is False
