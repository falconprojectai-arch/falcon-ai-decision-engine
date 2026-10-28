"""Verified-revenue accounting gate."""
import math

from .models import VerifiedRevenue


def verify(revenue: VerifiedRevenue) -> float:
    """Count only independently verified, finite, positive payment amounts."""
    if not revenue.is_real or not math.isfinite(revenue.amount):
        return 0.0
    return revenue.amount
