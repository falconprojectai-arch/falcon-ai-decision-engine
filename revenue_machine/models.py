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
    risk: RiskLevel = RiskLevel.MEDIUM
    revenue_claim: float = 0.0
    # Qualification evidence must be supplied by a reviewer or future source adapter.
    # These fields are not proof of live provider verification on their own.
    evidence_url: str = ""
    evidence_checked_at: str = ""
    terms_confirmed: bool = False
    monetization_confirmed: bool = False
    estimated_cost_usd: float = 0.0
    estimated_revenue_usd: float = 0.0
    estimated_success_probability: float = 0.0
    estimated_minutes: int = 0


@dataclass(frozen=True)
class VerifiedRevenue:
    """Payment record; verification metadata is required before accounting.

    These fields describe evidence from a provider adapter. They are not, by
    themselves, proof that a provider API was queried; live adapters must
    populate them only after independently checking provider records.
    """
    opportunity: str
    amount: float
    currency: str
    verified: bool
    provider: str = ""
    provider_payment_id: str = ""
    verified_at: str = ""
    verification_source: str = ""

    @property
    def is_real(self) -> bool:
        evidence_fields = (
            self.provider,
            self.provider_payment_id,
            self.verified_at,
            self.verification_source,
        )
        return (
            self.verified
            and self.amount > 0
            and bool(self.currency.strip())
            and all(value.strip() for value in evidence_fields)
        )
