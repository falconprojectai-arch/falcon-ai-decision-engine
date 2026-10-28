import json
from pathlib import Path

import pytest

from revenue_machine.ledger import append_report, read_reports


def sample_report(collected=2):
    return {
        "mode": "dry-run",
        "status": "report_recorded",
        "generated_at": "2026-10-28T00:00:00+00:00",
        "input_source": "test-fixture",
        "opportunities": {
            "collected": collected,
            "removed_invalid": 0,
            "accepted_by_filter": 1,
            "rejected_by_filter": 1,
            "awaiting_execution_approval": 1,
            "unreviewed_or_not_low_risk": 1,
        },
        "verified_revenue": 0,
    }


def test_ledger_appends_reports_without_overwriting(tmp_path: Path):
    path = tmp_path / "audit" / "runs.jsonl"
    append_report(path, sample_report(2))
    append_report(path, sample_report(5))

    reports = read_reports(path)
    assert len(reports) == 2
    assert [r["opportunities"]["collected"] for r in reports] == [2, 5]
    assert len(path.read_text(encoding="utf-8").splitlines()) == 2


def test_ledger_rejects_invalid_report_and_nonfinite_metrics(tmp_path: Path):
    path = tmp_path / "runs.jsonl"
    with pytest.raises(ValueError):
        append_report(path, {"mode": "live", "status": "report_recorded"})
    bad = sample_report()
    bad["opportunities"]["collected"] = float("nan")
    with pytest.raises(ValueError):
        append_report(path, bad)
    assert not path.exists()


def test_ledger_read_fails_clearly_on_malformed_line(tmp_path: Path):
    path = tmp_path / "runs.jsonl"
    path.write_text('{"mode":"dry-run"}\nnot-json\n', encoding="utf-8")
    with pytest.raises(ValueError, match="line 2"):
        read_reports(path)
