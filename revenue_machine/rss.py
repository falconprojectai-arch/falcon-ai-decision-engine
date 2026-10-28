"""Conservative RSS/Atom adapter. Parsed feed items are untrusted and never auto-approved."""
from __future__ import annotations

import ipaddress
import socket
import urllib.error
import urllib.request
import xml.etree.ElementTree as ET
from urllib.parse import urlparse

from .models import Opportunity, RiskLevel

MAX_FEED_BYTES = 1_000_000
MAX_ITEMS = 50
TIMEOUT_SECONDS = 8


def _validate_url(url: str) -> None:
    parsed = urlparse(url)
    if parsed.scheme != "https" or not parsed.hostname or parsed.username or parsed.password:
        raise ValueError("Feed URL must be HTTPS and must not contain credentials.")
    host = parsed.hostname.lower().rstrip(".")
    if host in {"localhost", "localhost.localdomain"} or host.endswith(".localhost") or host.endswith(".local"):
        raise ValueError("Local hostnames are not allowed.")
    try:
        addresses = {ipaddress.ip_address(host)}
    except ValueError:
        try:
            addresses = {ipaddress.ip_address(info[4][0]) for info in socket.getaddrinfo(host, None)}
        except OSError as exc:
            raise ValueError("Feed hostname could not be resolved.") from exc
    if not addresses or any(
        address.is_private or address.is_loopback or address.is_link_local
        or address.is_multicast or address.is_reserved or address.is_unspecified
        for address in addresses
    ):
        raise ValueError("Feed URL must resolve only to public IP addresses.")


class _SafeRedirectHandler(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        _validate_url(newurl)
        return super().redirect_request(req, fp, code, msg, headers, newurl)


def _text(element: ET.Element, *names: str) -> str:
    for name in names:
        found = element.find(name)
        if found is not None:
            value = " ".join("".join(found.itertext()).split())
            if value:
                return value
    return ""


def parse_feed(xml_text: str, source_url: str) -> list[Opportunity]:
    """Parse RSS 2.0 or Atom XML; mark every discovery medium-risk pending review."""
    _validate_url(source_url)
    try:
        root = ET.fromstring(xml_text)
    except ET.ParseError as exc:
        raise ValueError("Feed content is not valid XML.") from exc

    items: list[ET.Element]
    if root.tag.rsplit("}", 1)[-1].lower() == "feed":
        items = [node for node in root if node.tag.rsplit("}", 1)[-1].lower() == "entry"]
    else:
        items = [node for node in root.iter() if node.tag.rsplit("}", 1)[-1].lower() == "item"]

    host = urlparse(source_url).hostname or "unknown"
    candidates: list[Opportunity] = []
    for item in items[:MAX_ITEMS]:
        title = _text(item, "title", "{http://www.w3.org/2005/Atom}title")
        if not title:
            continue
        candidates.append(Opportunity(
            name=title[:240],
            channel=f"rss:{host}",
            requires_capital=True,
            requires_manual_work=True,
            risk=RiskLevel.MEDIUM,
        ))
    return candidates


def fetch_feed(url: str) -> list[Opportunity]:
    """Fetch a bounded public HTTPS feed and return conservative dry-run candidates."""
    _validate_url(url)
    request = urllib.request.Request(
        url,
        headers={"User-Agent": "RevenueMachine-FeedReader/0.1", "Accept": "application/rss+xml, application/atom+xml, application/xml, text/xml"},
    )
    opener = urllib.request.build_opener(_SafeRedirectHandler)
    try:
        with opener.open(request, timeout=TIMEOUT_SECONDS) as response:
            final_url = response.geturl()
            _validate_url(final_url)
            content_type = response.headers.get_content_type()
            if content_type not in {"application/rss+xml", "application/atom+xml", "application/xml", "text/xml"}:
                raise ValueError(f"Unsupported feed content type: {content_type}")
            data = response.read(MAX_FEED_BYTES + 1)
    except (urllib.error.URLError, TimeoutError, OSError) as exc:
        raise ValueError(f"Could not fetch feed: {exc}") from exc
    if len(data) > MAX_FEED_BYTES:
        raise ValueError("Feed exceeds the 1 MB size limit.")
    return parse_feed(data.decode("utf-8-sig"), final_url)
