from pathlib import Path
import sys
import xml.etree.ElementTree as ET

report = Path(sys.argv[1])
root = ET.parse(report).getroot()
failures = 0
for case in root.iter("testcase"):
    for tag in ("failure", "error"):
        node = case.find(tag)
        if node is None:
            continue
        failures += 1
        detail = node.get("message") or (node.text or "").strip() or "No failure detail"
        detail = " ".join(detail.split())[:900]
        name = ".".join(part for part in (case.get("classname"), case.get("name")) if part)
        print(f"::error title=Pytest failure::{name}: {detail}")
if failures == 0:
    print("No pytest failure annotations found in JUnit XML.")
