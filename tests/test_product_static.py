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


def test_crypto_notice_is_brand_neutral_and_warns_about_network_mismatch():
    source = PAGE.read_text(encoding="utf-8")
    assert "Toobit" not in source
    assert "recipient's current receiving address" in source
    assert "supports the selected network" in source
    assert "Crypto transfers are generally irreversible" in source


def test_validator_exposes_core_rules_and_error_paths():
    source = PAGE.read_text(encoding="utf-8")
    for keyword in (
        "required", "properties", "additionalProperties", "items", "enum",
        "const", "minimum", "maximum", "minLength", "maxLength", "pattern",
        "minItems", "maxItems", "Invalid JSON:", "Schema error:",
    ):
        assert keyword in source
    assert "Download report" in source
    assert "contract-test-report.json" in source
    assert "inputs stay in this browser" in source


def test_validator_documents_subset_and_prevents_stale_report_download():
    source = PAGE.read_text(encoding="utf-8")
    for limitation in (
        "composition (allOf/anyOf/oneOf/not)",
        "no $ref/$defs",
        "boolean schemas",
        "JavaScript regular-expression engine",
        "full JSON Schema specification",
    ):
        assert limitation in source
    assert "window.lastContractReport=null" in source


def test_const_and_enum_compare_json_objects_independent_of_key_order():
    source = PAGE.read_text(encoding="utf-8")
    assert "function sameJson(a,b)" in source
    assert "sameJson(value,s.const)" in source
    assert "sameJson(v,value)" in source


def test_inline_javascript_parses_with_node(tmp_path):
    import re
    import subprocess

    source = PAGE.read_text(encoding="utf-8")
    scripts = re.findall(r"<script>(.*?)</script>", source, flags=re.DOTALL)
    assert len(scripts) == 1
    script_path = tmp_path / "product.js"
    script_path.write_text(scripts[0], encoding="utf-8")
    result = subprocess.run(
        ["node", "--check", str(script_path)],
        capture_output=True,
        text=True,
        check=False,
    )
    assert result.returncode == 0, result.stderr


def test_validator_function_has_intact_signature_and_single_definition():
    source = PAGE.read_text(encoding="utf-8")
    assert "function check(value,s,path='',schemaPath='#',errors=[])" in source
    assert source.count("function check(value,s,path=") == 1
    assert "function pointerJoin(base,part)" in source
    assert "function issue(errors,instancePath,schemaPath,keyword,message,expected,actual)" in source
    assert "reportVersion:'1.1'" in source
    assert "instancePath" in source and "schemaPath" in source and "sampleIndex" in source
