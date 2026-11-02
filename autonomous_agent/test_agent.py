import tempfile
import unittest
from pathlib import Path
from agent import resolve, check

class AgentSafetyTests(unittest.TestCase):
    def test_relative_path(self):
        with tempfile.TemporaryDirectory() as d:
            self.assertEqual(resolve(Path(d), "src/a.py"), Path(d) / "src/a.py")
    def test_traversal_blocked(self):
        with tempfile.TemporaryDirectory() as d:
            with self.assertRaises(ValueError):
                resolve(Path(d), "../outside")
    def test_absolute_blocked(self):
        with tempfile.TemporaryDirectory() as d:
            with self.assertRaises(ValueError):
                resolve(Path(d), str(Path(d).parent / "outside"))
    def test_arbitrary_command_blocked(self):
        with tempfile.TemporaryDirectory() as d:
            with self.assertRaises(ValueError):
                check(Path(d), "rm -rf .")

if __name__ == "__main__":
    unittest.main()
