from datetime import datetime

def log(msg):
 print(f"[{datetime.now():%F %T}] {msg}")
