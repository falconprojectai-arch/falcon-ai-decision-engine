from dataclasses import dataclass
from enum import Enum


class RiskLevel(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"


@dataclass(frozen=True)
class Opportunity:
    name: str
    channel: str
    requires_capital: bool = False
    requires_manual_work: bool = False
    risk: RiskLevel = RiskLevel.LOW
    revenue_claim: float = 0.0


@dataclass(frozen=True)
class VerifiedRevenue:
    opportunity: str
    amount: float
    currency: str
    verified: bool

    @property
    def is_real(self) -> bool:
        return self.verified and self.amount > 0
