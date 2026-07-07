from src.models.signal import Signal

def test_signal():
 s=Signal("WAIT",0.5)
 assert s.action=="WAIT"
