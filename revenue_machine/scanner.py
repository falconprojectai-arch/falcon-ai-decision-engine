"""Deterministic scanner input layer; external source adapters are not enabled yet."""
from collections.abc import Iterable, Iterator

from .models import Opportunity


def scan(candidates: Iterable[Opportunity]) -> Iterator[Opportunity]:
    """Yield structurally valid candidates from an explicitly supplied source."""
    for candidate in candidates:
        if not isinstance(candidate, Opportunity):
            continue
        if not candidate.name.strip() or not candidate.channel.strip():
            continue
        yield candidate
