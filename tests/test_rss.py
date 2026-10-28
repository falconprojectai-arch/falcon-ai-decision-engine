import pytest

from revenue_machine.models import RiskLevel
from revenue_machine.rss import MAX_ITEMS, parse_feed


RSS = """<?xml version="1.0"?>
<rss version="2.0"><channel>
  <item><title>First opportunity</title><link>https://example.org/a</link></item>
  <item><title>Second opportunity</title></item>
  <item><description>No title should be skipped</description></item>
</channel></rss>"""


def test_rss_parser_marks_discoveries_as_untrusted_and_not_approved():
    items = parse_feed(RSS, "https://example.org/feed.xml")
    assert [item.name for item in items] == ["First opportunity", "Second opportunity"]
    assert all(item.risk is RiskLevel.MEDIUM for item in items)
    assert all(item.requires_capital and item.requires_manual_work for item in items)


def test_atom_feed_is_supported():
    xml = """<feed xmlns="http://www.w3.org/2005/Atom">
      <entry><title>Atom item</title><link href="https://example.org/item"/></entry>
    </feed>"""
    items = parse_feed(xml, "https://example.org/atom.xml")
    assert len(items) == 1
    assert items[0].name == "Atom item"
    assert items[0].risk is RiskLevel.MEDIUM


@pytest.mark.parametrize("url", [
    "http://example.org/feed.xml",
    "https://localhost/feed.xml",
    "https://127.0.0.1/feed.xml",
    "https://user:pass@example.org/feed.xml",
])
def test_rejects_unsafe_feed_urls(url):
    with pytest.raises(ValueError):
        parse_feed(RSS, url)


def test_rejects_invalid_xml():
    with pytest.raises(ValueError, match="valid XML"):
        parse_feed("<rss>", "https://example.org/feed.xml")
