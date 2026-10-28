"""Command-line runner for local opportunity-feed dry runs."""
import argparse
import json
from pathlib import Path

from .engine import RevenueMachine
from .models import Opportunity, RiskLevel
from . import rss


def load_candidates(path: Path) -> list[Opportunity]:
    payload = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(payload, list):
        raise ValueError("Input must be a JSON array of opportunity objects.")
    candidates = []
    for index, item in enumerate(payload):
        if not isinstance(item, dict):
            raise ValueError(f"Item {index} must be an object.")
        candidates.append(Opportunity(
            name=str(item.get("name", "")),
            channel=str(item.get("channel", "")),
            requires_capital=bool(item.get("requires_capital", False)),
            requires_manual_work=bool(item.get("requires_manual_work", False)),
            risk=RiskLevel(str(item.get("risk", "low")).lower()),
            revenue_claim=float(item.get("revenue_claim", 0.0)),
        ))
    return candidates


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Run Revenue Machine V1 in dry-run mode.")
    parser.add_argument("feed", nargs="?", type=Path, help="Path to a JSON array of opportunity candidates")
    parser.add_argument("--rss", dest="rss_url", help="Fetch a public HTTPS RSS/Atom feed in dry-run mode")
    args = parser.parse_args(argv)
    if bool(args.feed) == bool(args.rss_url):
        parser.error("Provide exactly one JSON feed path or --rss HTTPS_URL.")
    try:
        candidates = rss.fetch_feed(args.rss_url) if args.rss_url else load_candidates(args.feed)
    except (OSError, json.JSONDecodeError, TypeError, ValueError) as exc:
        parser.error(str(exc))

    plans = RevenueMachine().plan_candidates(candidates)
    report = {
        "mode": "dry-run",
        "candidates_seen": len(candidates),
        "plans_created": len(plans),
        "approved": sum(plan.approved for plan in plans),
        "executed": sum(plan.executed for plan in plans),
        "verified_revenue": 0,
        "plans": [
            {"opportunity": plan.opportunity, "approved": plan.approved,
             "mode": plan.mode, "executed": plan.executed, "reason": plan.reason}
            for plan in plans
        ],
        "note": "No external work was executed. Revenue remains zero until verified payment evidence is integrated.",
    }
    print(json.dumps(report, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
