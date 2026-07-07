"""
Falcon Logger
Version: 0.0.1
"""

from datetime import datetime


def log(message):
    now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    print(f"[{now}] {message}")
