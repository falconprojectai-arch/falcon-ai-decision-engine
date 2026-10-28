"""Small typed signal model retained for compatibility with existing tests."""
from dataclasses import dataclass


@dataclass(frozen=True)
class Signal:
    action: str
    confidence: float
