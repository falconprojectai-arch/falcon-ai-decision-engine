from .models import VerifiedRevenue


def verify(revenue: VerifiedRevenue) -> float:
    """Return counted revenue only when payment is independently verified."""
    return revenue.amount if revenue.is_real else 0.0
