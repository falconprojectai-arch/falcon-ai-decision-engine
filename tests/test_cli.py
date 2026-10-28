import json
from pathlib import Path

from revenue_machine.cli import main


def test_cli_reports_dry_run_and_never_counts_claims(tmp_path: Path, capsys):
    feed = tmp_path / "opportunities.json"
    feed.write_text(json.dumps([
        {"name": "allowed", "channel": "organic", "risk": "low", "revenue_claim": 999},
        {"name": "blocked", "channel": "ads", "requires_capital": True},
    ]), encoding="utf-8")
    assert main([str(feed)]) == 0
    report = json.loads(capsys.readouterr().out)
    assert report["mode"] == "dry-run"
    assert report["candidates_seen"] == 2
    assert report["approved"] == 1
    assert report["executed"] == 0
    assert report["verified_revenue"] == 0


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
