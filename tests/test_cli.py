import json
from pathlib import Path

from revenue_machine.cli import main


def test_cli_reports_dry_run_and_never_counts_claims(tmp_path: Path, capsys):
    feed = tmp_path / "opportunities.json"
    feed.write_text(json.dumps([
        {"name": "allowed", "channel": "organic", "risk": "low", "revenue_claim": 999, "evidence_url": "https://provider.example/terms", "evidence_checked_at": "2026-10-28T12:00:00+00:00", "terms_confirmed": True, "monetization_confirmed": True, "estimated_revenue_usd": 1.0, "estimated_success_probability": 1.0},
        {"name": "blocked", "channel": "ads", "requires_capital": True},
    ]), encoding="utf-8")
    assert main([str(feed)]) == 0
    report = json.loads(capsys.readouterr().out)
    assert report["mode"] == "dry-run"
    assert report["candidates_seen"] == 2
    assert report["approved"] == 1
    assert report["executed"] == 0
    assert report["verified_revenue"] == 0
    assert report["opportunities"]["collected"] == 2
    assert report["opportunities"]["removed_invalid"] == 0
    assert report["opportunities"]["accepted_by_filter"] == 1
    assert report["opportunities"]["rejected_by_filter"] == 1
    assert report["opportunities"]["awaiting_execution_approval"] == 1
    assert report["opportunities"]["unreviewed_or_not_low_risk"] == 1


def test_cli_can_run_rss_feed_in_dry_run(monkeypatch, capsys):
    from revenue_machine import cli
    from revenue_machine.models import Opportunity, RiskLevel

    monkeypatch.setattr(cli.rss, "fetch_feed", lambda url: [
        Opportunity(name="discovered", channel="rss:example.org", risk=RiskLevel.MEDIUM,
                    requires_capital=True, requires_manual_work=True)
    ])
    assert main(["--rss", "https://example.org/feed.xml"]) == 0
    report = json.loads(capsys.readouterr().out)
    assert report["mode"] == "dry-run"
    assert report["candidates_seen"] == 1
    assert report["approved"] == 0
    assert report["executed"] == 0
    assert report["verified_revenue"] == 0


def test_cli_defaults_missing_risk_to_medium_and_blocks_it(tmp_path: Path, capsys):
    feed = tmp_path / "unreviewed.json"
    feed.write_text(json.dumps([{"name": "unknown", "channel": "unknown-source"}]), encoding="utf-8")
    assert main([str(feed)]) == 0
    report = json.loads(capsys.readouterr().out)
    assert report["candidates_seen"] == 1
    assert report["approved"] == 0
    assert report["executed"] == 0
    assert report["verified_revenue"] == 0



def test_cli_counts_removed_invalid_opportunities(tmp_path: Path, capsys):
    feed = tmp_path / "mixed.json"
    feed.write_text(json.dumps([
        {"name": "valid", "channel": "organic", "risk": "low", "evidence_url": "https://provider.example/terms", "evidence_checked_at": "2026-10-28T12:00:00+00:00", "terms_confirmed": True, "monetization_confirmed": True, "estimated_revenue_usd": 1.0, "estimated_success_probability": 1.0},
        {"name": "  ", "channel": "organic", "risk": "low"},
    ]), encoding="utf-8")
    assert main([str(feed)]) == 0
    report = json.loads(capsys.readouterr().out)
    assert report["opportunities"]["collected"] == 2
    assert report["opportunities"]["removed_invalid"] == 1
    assert report["opportunities"]["accepted_by_filter"] == 1
    assert report["opportunities"]["rejected_by_filter"] == 0


def test_cli_writes_traceable_report_file(tmp_path: Path, capsys):
    feed = tmp_path / "opportunities.json"
    output = tmp_path / "reports" / "latest.json"
    feed.write_text(json.dumps([
        {"name": "candidate", "channel": "organic", "risk": "low"}
    ]), encoding="utf-8")

    assert main([str(feed), "--report-out", str(output)]) == 0
    stdout_report = json.loads(capsys.readouterr().out)
    saved_report = json.loads(output.read_text(encoding="utf-8"))

    assert saved_report == stdout_report
    assert saved_report["status"] == "report_recorded"
    assert saved_report["input_source"] == str(feed)
    assert saved_report["generated_at"].endswith("+00:00")
    assert saved_report["opportunities"]["collected"] == 1


def test_cli_appends_run_to_audit_ledger(tmp_path: Path, capsys):
    feed = tmp_path / "opportunities.json"
    ledger = tmp_path / "runs.jsonl"
    feed.write_text(json.dumps([
        {"name": "candidate", "channel": "organic", "risk": "low"}
    ]), encoding="utf-8")

    assert main([str(feed), "--ledger-out", str(ledger)]) == 0
    capsys.readouterr()
    assert main([str(feed), "--ledger-out", str(ledger)]) == 0
    capsys.readouterr()
    records = [json.loads(line) for line in ledger.read_text(encoding="utf-8").splitlines()]
    assert len(records) == 2
    assert all(record["mode"] == "dry-run" for record in records)
    assert all(record["verified_revenue"] == 0 for record in records)
