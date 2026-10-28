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
