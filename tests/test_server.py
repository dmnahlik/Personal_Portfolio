"""Tests for the portfolio static server (standard library only).

They run against a small fixture site written to a temp folder, so they don't
need `npm run build` first. The fixture mimics the Next.js export layout.
"""

import base64
import hashlib
import tempfile
import threading
import unittest
import urllib.error
import urllib.request
from pathlib import Path

from portfolio_server.server import create_server, inline_script_hashes

INLINE_A = 'self.__next_f=self.__next_f||[];self.__next_f.push([0])'
INLINE_B = 'self.__next_f.push([1,"hello"])'

INDEX_HTML = f"""<!doctype html>
<html lang="en"><head>
<script src="/theme_init.js"></script>
<script src="/_next/static/chunks/app.js" async></script>
</head><body>
<section id="projects">Projects</section>
<script>{INLINE_A}</script>
<script>{INLINE_B}</script>
</body></html>
"""


def sha256_source(script: str) -> str:
    return "'sha256-" + base64.b64encode(hashlib.sha256(script.encode()).digest()).decode() + "'"


class InlineScriptHashTests(unittest.TestCase):
    def test_hashes_only_inline_scripts(self):
        self.assertEqual(inline_script_hashes(INDEX_HTML), sorted([sha256_source(INLINE_A), sha256_source(INLINE_B)]))

    def test_no_inline_scripts(self):
        self.assertEqual(inline_script_hashes('<script src="/a.js"></script>'), [])


class ServerTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.tmp = tempfile.TemporaryDirectory()
        site = Path(cls.tmp.name)
        (site / "index.html").write_text(INDEX_HTML, encoding="utf-8")
        (site / "theme_init.js").write_text("// theme", encoding="utf-8")
        (site / "_next/static/chunks").mkdir(parents=True)
        (site / "_next/static/chunks/app.js").write_text("// app", encoding="utf-8")
        (site / "assets/img").mkdir(parents=True)
        (site / "assets/img/photo.jpg").write_bytes(b"\xff\xd8\xff")

        cls.httpd = create_server("127.0.0.1", 0, site)
        cls.base = f"http://127.0.0.1:{cls.httpd.server_address[1]}"
        cls.thread = threading.Thread(target=cls.httpd.serve_forever, daemon=True)
        cls.thread.start()

    @classmethod
    def tearDownClass(cls):
        cls.httpd.shutdown()
        cls.httpd.server_close()
        cls.tmp.cleanup()

    def get(self, path):
        return urllib.request.urlopen(self.base + path, timeout=5)

    def test_index_served_with_security_headers(self):
        with self.get("/") as r:
            self.assertEqual(r.status, 200)
            self.assertIn(b'id="projects"', r.read())
            csp = r.headers["Content-Security-Policy"]
            self.assertIn("default-src 'self'", csp)
            self.assertNotIn("unsafe-inline", csp)
            self.assertEqual(r.headers["X-Content-Type-Options"], "nosniff")
            self.assertEqual(r.headers["Cache-Control"], "no-cache")

    def test_csp_allows_exact_inline_script_hashes(self):
        with self.get("/") as r:
            csp = r.headers["Content-Security-Policy"]
        script_src = next(d for d in csp.split("; ") if d.startswith("script-src"))
        self.assertIn(sha256_source(INLINE_A), script_src)
        self.assertIn(sha256_source(INLINE_B), script_src)

    def test_hashed_next_assets_cached_immutably(self):
        with self.get("/_next/static/chunks/app.js") as r:
            self.assertEqual(r.headers["Cache-Control"], "public, max-age=31536000, immutable")

    def test_other_assets_revalidated(self):
        with self.get("/assets/img/photo.jpg") as r:
            self.assertEqual(r.status, 200)
            self.assertEqual(r.headers["Cache-Control"], "no-cache")
            last_modified = r.headers["Last-Modified"]
        req = urllib.request.Request(
            self.base + "/assets/img/photo.jpg", headers={"If-Modified-Since": last_modified}
        )
        with self.assertRaises(urllib.error.HTTPError) as ctx:
            urllib.request.urlopen(req, timeout=5)
        self.assertEqual(ctx.exception.code, 304)
        ctx.exception.close()

    def test_health(self):
        with self.get("/health") as r:
            self.assertEqual(r.read(), b"ok")

    def test_spa_fallback_for_extensionless_path(self):
        with self.get("/projects") as r:
            self.assertEqual(r.status, 200)
            self.assertIn(b"<!doctype html>", r.read())

    def test_missing_asset_returns_404(self):
        with self.assertRaises(urllib.error.HTTPError) as ctx:
            self.get("/assets/img/does_not_exist.png")
        self.assertEqual(ctx.exception.code, 404)
        ctx.exception.close()

    def test_directory_listing_disabled(self):
        with self.assertRaises(urllib.error.HTTPError) as ctx:
            self.get("/assets/")
        self.assertEqual(ctx.exception.code, 404)
        ctx.exception.close()


class StartupTests(unittest.TestCase):
    def test_missing_build_gives_helpful_error(self):
        with tempfile.TemporaryDirectory() as empty:
            with self.assertRaises(FileNotFoundError) as ctx:
                create_server("127.0.0.1", 0, empty)
            self.assertIn("npm run build", str(ctx.exception))


if __name__ == "__main__":
    unittest.main()
