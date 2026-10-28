"""Append-only local audit ledger for Revenue Machine run reports."""
import json
import math
import os
from pathlib import Path
from typing import Any

_REQUIRED_METRICS = (
    "collected",
    "removed_invalid",
    "accepted_by_filter",
    "rejected_by_filter",
    "awaiting_execution_approval",
    "unreviewed_or_not_low_risk",
)


def append_report(path: Path, report: dict[str, Any]) -> None:
    """Append one validated dry-run report as a JSON Lines record.

    This ledger stores audit metadata only; it does not authorize execution
    or treat revenue claims as verified payments.
    """
    if report.get("mode") != "dry-run" or report.get("status") != "report_recorded":
        raise ValueError("Only recorded dry-run reports can be added to the ledger.")
    if not isinstance(report.get("generated_at"), str) or not report["generated_at"]:
        raise ValueError("Report must include generated_at.")
    metrics = report.get("opportunities")
    if not isinstance(metrics, dict):
        raise ValueError("Report must include opportunity metrics.")
    for key in _REQUIRED_METRICS:
        value = metrics.get(key)
        if isinstance(value, bool) or not isinstance(value, (int, float)):
            raise ValueError(f"Metric {key} must be a finite non-negative number.")
        if not math.isfinite(value) or value < 0:
            raise ValueError(f"Metric {key} must be a finite non-negative number.")

    path.parent.mkdir(parents=True, exist_ok=True)
    record = json.dumps(report, ensure_ascii=False, separators=(",", ":"), allow_nan=False) + "\n"
    with path.open("a", encoding="utf-8") as stream:
        stream.write(record)
        stream.flush()
        os.fsync(stream.fileno())


def read_reports(path: Path) -> list[dict[str, Any]]:
    """Read the ledger, failing clearly if a line is malformed."""
    if not path.exists():
        return []
    reports: list[dict[str, Any]] = []
    with path.open("r", encoding="utf-8") as stream:
        for line_number, line in enumerate(stream, start=1):
            if not line.strip():
                continue
            try:
                item = json.loads(line)
            except json.JSONDecodeError as exc:
                raise ValueError(f"Invalid ledger JSON on line {line_number}.") from exc
            if not isinstance(item, dict):
                raise ValueError(f"Ledger line {line_number} must contain a JSON object.")
            reports.append(item)
    return reports
