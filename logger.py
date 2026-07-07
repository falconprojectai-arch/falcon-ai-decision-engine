from datetime import datetime
def log(message):
    print(f"[{datetime.now():%Y-%m-%d %H:%M:%S}] {message}")
