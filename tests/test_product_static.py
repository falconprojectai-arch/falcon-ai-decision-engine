from html.parser import HTMLParser
from pathlib import Path
import re
import subprocess

ROOT = Path(__file__).resolve().parents[1]
PAGE = ROOT / "products" / "json-contract-tester" / "index.html"
APP = ROOT / "products" / "json-contract-tester" / "app.js"
JUNIT = ROOT / "products" / "json-contract-tester" / "junit-export.js"
CSS = ROOT / "products" / "json-contract-tester" / "styles.css"


class PageParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids = set()
        self.script_sources = []
        self.stylesheets = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if attrs.get("id"):
            self.ids.add(attrs["id"])
        if tag == "script":
            self.script_sources.append(attrs.get("src"))
        if tag == "link" and attrs.get("rel") == "stylesheet":
            self.stylesheets.append(attrs.get("href"))


def test_contract_tester_page_uses_local_assets_and_required_controls():
    source = PAGE.read_text(encoding="utf-8")
    parser = PageParser()
    parser.feed(source)

    assert "JSON Contract Tester" in source
    assert {"schema", "cases", "run", "sample", "download", "download-junit", "results", "status"} <= parser.ids
    assert parser.script_sources == ["junit-export.js", "app.js"]
    assert parser.stylesheets == ["styles.css"]
    assert "script-src 'self'" in source
    assert "Download JSON report" in source
    assert "Download JUnit XML" in source
    assert "No data was uploaded." in source
    assert "inputs stay in this browser" in source


def test_all_runtime_assets_exist_and_remain_local():
    assert APP.is_file()
    assert JUNIT.is_file()
    assert CSS.is_file()

    app = APP.read_text(encoding="utf-8")
    assert "navigator.sendBeacon" not in app
    assert "XMLHttpRequest" not in app
    assert "fetch(" not in app
    assert "window.lastContractReport" in app


def test_sample_has_one_pass_and_three_failures_including_nested_error():
    source = APP.read_text(encoding="utf-8")
    assert "{ok:true,result:'done',meta:{request_id:'req-001',retry_count:0}}" in source
    assert "{ok:true,meta:{request_id:'req-002',retry_count:1}}" in source
    assert "{ok:'yes',result:'done',meta:{request_id:'req-003',retry_count:0}}" in source
    assert "{ok:true,result:'done',meta:{request_id:'req-004',retry_count:'2'}}" in source
    assert "required:['request_id','retry_count']" in source
    assert "additionalProperties:false" in source


def test_usdt_addresses_and_networks_match_operator_provided_values():
    source = PAGE.read_text(encoding="utf-8")
    assert "TD8c7KQc1qQrsBZVUF9F7aseZd1RPC9NPq" in source
    assert "0xd243c3278707d7bee006e8b3f3105586bbf9667a" in source
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
    source = APP.read_text(encoding="utf-8")
    for keyword in (
        "required", "properties", "additionalProperties", "items", "enum",
        "const", "minimum", "maximum", "minLength", "maxLength", "pattern",
        "minItems", "maxItems", "Invalid JSON:", "Schema error:",
    ):
        assert keyword in source
    assert "contract-test-report.json" in source
    assert "instancePath" in source and "schemaPath" in source and "sampleIndex" in source


def test_validator_documents_subset_and_prevents_stale_report_download():
    page = PAGE.read_text(encoding="utf-8")
    app = APP.read_text(encoding="utf-8")
    for limitation in (
        "composition (allOf/anyOf/oneOf/not)",
        "no $ref/$defs",
        "boolean schemas",
        "JavaScript regular-expression engine",
        "full JSON Schema specification",
    ):
        assert limitation in page
    assert "window.lastContractReport=null" in app


def test_const_and_enum_compare_json_objects_independent_of_key_order():
    source = APP.read_text(encoding="utf-8")
    assert "function sameJson(a,b)" in source
    assert "sameJson(value,s.const)" in source
    assert "sameJson(v,value)" in source


def test_external_javascript_assets_parse_with_node():
    for source_file in (APP, JUNIT):
        result = subprocess.run(
            ["node", "--check", str(source_file)],
            capture_output=True,
            text=True,
            check=False,
        )
        assert result.returncode == 0, result.stderr


def test_validator_function_has_intact_signature_and_single_definition():
    source = APP.read_text(encoding="utf-8")
    assert "function check(value,s,path='',schemaPath='#',errors=[])" in source
    assert source.count("function check(value,s,path=") == 1
    assert "function pointerJoin(base,part)" in source
    assert r"replace(/\//g,'~1')" in source
    assert "function issue(errors,instancePath,schemaPath,keyword,message,expected,actual)" in source
    assert "reportVersion:'1.1'" in source


def test_json_pointer_join_escapes_tilde_and_slash():
    source = APP.read_text(encoding="utf-8")
    pointer = re.search(r"function pointerJoin\(base,part\)\{[^}]*\}", source)
    schema = re.search(r"function schemaJoin\(base,part\)\{[^}]*\}", source)
    assert pointer and schema, "Pointer helpers must be present in the application source"
    script = (
        pointer.group(0) + "\n" + schema.group(0) + "\n"
        + "console.log(JSON.stringify(["
        + "pointerJoin('/items','a/b~c'),"
        + "schemaJoin('#/properties','a/b~c')"
        + "]));"
    )
    result = subprocess.run(
        ["node", "-e", script],
        capture_output=True,
        text=True,
        check=False,
    )
    assert result.returncode == 0, result.stderr
    assert result.stdout.strip() == '["/items/a~1b~0c","#/properties/a~1b~0c"]'


def test_junit_export_is_a_local_browser_asset_with_expected_diagnostics():
    source = JUNIT.read_text(encoding="utf-8")
    assert "root.JSONContractTesterJUnit" in source
    assert "buildJUnitXml" in source
    assert "'<testsuites" in source
    assert "sampleIndex" in source
    assert "instancePath" in source
    assert "schemaPath" in source
