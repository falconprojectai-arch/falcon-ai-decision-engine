from pathlib import Path
from html.parser import HTMLParser

PAGE = Path(__file__).resolve().parents[1] / "products" / "json-contract-tester" / "index.html"

class PageParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids = set()
        self.scripts = 0
        self.external_scripts = 0
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if attrs.get("id"):
            self.ids.add(attrs["id"])
        if tag == "script":
            self.scripts += 1
            if attrs.get("src"):
                self.external_scripts += 1

def test_contract_tester_static_page_and_required_controls():
    source = PAGE.read_text(encoding="utf-8")
    parser = PageParser()
    parser.feed(source)
    assert "JSON Contract Tester" in source
    assert {"schema", "cases", "run", "sample", "download", "results", "status"} <= parser.ids
    assert parser.scripts == 1
    assert parser.external_scripts == 0
    assert "navigator.sendBeacon" not in source
    assert "fetch(" not in source
    assert "XMLHttpRequest" not in source
    assert "window.lastContractReport" in source

def test_sample_has_one_expected_pass_and_two_expected_failures():
    source = PAGE.read_text(encoding="utf-8")
    assert "{ok:true,result:'done'}" in source
    assert "{ok:'yes',result:'done'}" in source
    assert "{ok:true,extra:1}" in source
    assert "additionalProperties:false" in source
    assert "passed+' of '+lines.length+' outputs passed" in source

def test_usdt_addresses_and_networks_match_operator_provided_values():
    source = PAGE.read_text(encoding="utf-8")
    assert "TYEEz4te11EYecrhNTFLY5enoMm7qPmjFd" in source
    assert "0x48bf49eca7f6ef784ff524a8f58e156232746ca6" in source
    assert "USDT · TRC20 (TRON)" in source
    assert "USDT · BEP20 (BNB Smart Chain)" in source
    assert "data-copy=\"trc-address\"" in source
    assert "data-copy=\"bep-address\"" in source
    assert "payment does not unlock features" in source
