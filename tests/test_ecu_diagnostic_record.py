from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PAGE = ROOT / "products" / "ecu-diagnostic-record" / "diagnostic-record-fa.html"


class FormParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.sections = 0
        self.inputs = 0
        self.textareas = 0
        self.external_assets = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "section" and "sheet" in attrs.get("class", "").split():
            self.sections += 1
        if tag == "input":
            self.inputs += 1
        if tag == "textarea":
            self.textareas += 1
        if tag in {"script", "link", "img", "iframe"}:
            self.external_assets.append((tag, attrs))


def test_persian_ecu_record_is_two_page_rtl_printable_and_local_only():
    source = PAGE.read_text(encoding="utf-8")
    parser = FormParser()
    parser.feed(source)

    assert '<html lang="fa" dir="rtl">' in source
    assert parser.sections == 2
    assert parser.inputs >= 20
    assert parser.textareas >= 4
    assert "window.print()" in source
    assert "@page{size:A4" in source
    assert "DTC / Freeze Frame" in source
    assert "HW ID" in source and "SW ID" in source
    assert "مقادیر آزمون و روش‌های تشخیص باید بر اساس مستندات معتبر سازنده" in source


def test_persian_ecu_record_has_no_external_assets_or_data_transmission():
    source = PAGE.read_text(encoding="utf-8").lower()
    parser = FormParser()
    parser.feed(source)

    assert parser.external_assets == []
    for forbidden in ("fetch(", "xmlhttprequest", "sendbeacon", "localstorage", "indexeddb", "action="):
        assert forbidden not in source
    assert "http://" not in source and "https://" not in source
