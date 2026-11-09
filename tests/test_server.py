"""Tests for the portfolio static server (standard library only)."""

import threading
import unittest
import urllib.error
import urllib.request

from portfolio_server.server import create_server


class ServerTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.httpd = create_server("127.0.0.1", 0)
        cls.base = f"http://127.0.0.1:{cls.httpd.server_address[1]}"
        cls.thread = threading.Thread(target=cls.httpd.serve_forever, daemon=True)
        cls.thread.start()

    @classmethod
    def tearDownClass(cls):
        cls.httpd.shutdown()
        cls.httpd.server_close()

    def get(self, path):
        return urllib.request.urlopen(self.base + path, timeout=5)

    def test_index_served_with_security_headers(self):
        with self.get("/") as r:
            self.assertEqual(r.status, 200)
            self.assertIn(b'id="projects"', r.read())
            self.assertIn("default-src 'self'", r.headers["Content-Security-Policy"])
            self.assertEqual(r.headers["X-Content-Type-Options"], "nosniff")
            self.assertEqual(r.headers["Cache-Control"], "no-cache")

    def test_static_asset_cached(self):
        with self.get("/css/base.css") as r:
            self.assertEqual(r.status, 200)
            self.assertIn("max-age", r.headers["Cache-Control"])

    def test_healthz(self):
        with self.get("/healthz") as r:
            self.assertEqual(r.read(), b"ok")

    def test_spa_fallback_for_extensionless_path(self):
        with self.get("/projects") as r:
            self.assertEqual(r.status, 200)
            self.assertIn(b"<!doctype html>", r.read())

    def test_missing_asset_returns_404(self):
        with self.assertRaises(urllib.error.HTTPError) as ctx:
            self.get("/assets/img/does_not_exist.png")
        self.assertEqual(ctx.exception.code, 404)

    def test_directory_listing_disabled(self):
        with self.assertRaises(urllib.error.HTTPError) as ctx:
            self.get("/assets/")
        self.assertEqual(ctx.exception.code, 404)


if __name__ == "__main__":
    unittest.main()
