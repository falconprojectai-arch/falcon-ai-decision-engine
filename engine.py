from .config import APP_NAME,VERSION
from .logger import log

def start():
 log(f"{APP_NAME} {VERSION} started")
