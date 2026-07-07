"""
Falcon AI Decision Engine
"""
from .config import APP_NAME, VERSION
from .logger import log

def start():
    log(f"{APP_NAME} v{VERSION} starting")

if __name__=="__main__":
    start()
