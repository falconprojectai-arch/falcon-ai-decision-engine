from src.core.engine import APP_NAME, VERSION

def test_app_info():
    assert APP_NAME == "Falcon AI Decision Engine"
    assert VERSION == "0.0.1"
