"""Static file server for the portfolio, built only on the Python standard library.

Serves the Next.js static export (``web/out`` locally, ``/app/site`` in the
container via ``SITE_DIR``) with security and cache headers, a ``/health``
endpoint, and a single-page-app fallback to ``index.html``. Cloud Run sets the
``PORT`` environment variable; it defaults to 8080 locally.
"""

from __future__ import annotations

import base64
import hashlib
import os
from functools import partial
from html.parser import HTMLParser
from http import HTTPStatus
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlsplit

DEFAULT_SITE_DIR = Path(__file__).resolve().parent.parent / "web" / "out"

# Next.js puts content-hashed (never-changing) file names under this prefix.
IMMUTABLE_PREFIX = "/_next/static/"

BASE_HEADERS = {
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
}


class _InlineScriptCollector(HTMLParser):
    """Collects the text of every <script> without a ``src`` attribute."""

    def __init__(self) -> None:
        super().__init__(convert_charrefs=False)
        self.scripts: list[str] = []
        self._buffer: list[str] | None = None

    def handle_starttag(self, tag, attrs):
        if tag == "script" and not any(name == "src" for name, _ in attrs):
            self._buffer = []

    def handle_data(self, data):
        if self._buffer is not None:
            self._buffer.append(data)

    def handle_endtag(self, tag):
        if tag == "script" and self._buffer is not None:
            self.scripts.append("".join(self._buffer))
            self._buffer = None


def inline_script_hashes(html: str) -> list[str]:
    """CSP source expressions ('sha256-...') for each inline script in ``html``."""
    collector = _InlineScriptCollector()
    collector.feed(html)
    hashes = []
    for script in collector.scripts:
        digest = hashlib.sha256(script.encode("utf-8")).digest()
        hashes.append(f"'sha256-{base64.b64encode(digest).decode('ascii')}'")
    return sorted(set(hashes))


def build_csp(script_hashes: list[str]) -> str:
    """Strict CSP. Inline scripts are allowed only by exact hash, never 'unsafe-inline'."""
    script_src = " ".join(["'self'", *script_hashes])
    return "; ".join(
        [
            "default-src 'self'",
            f"script-src {script_src}",
            "style-src 'self'",
            "font-src 'self'",
            "img-src 'self' data:",
            "connect-src 'self'",
            "object-src 'none'",
            "base-uri 'self'",
            "form-action 'self'",
            "frame-ancestors 'none'",
        ]
    )


class PortfolioHandler(SimpleHTTPRequestHandler):
    """Serves the static site with portfolio-specific headers and routing."""

    server_version = "PortfolioServer"
    sys_version = ""

    def __init__(self, *args, csp: str, **kwargs):
        self.csp = csp  # set before super().__init__, which handles the request
        super().__init__(*args, **kwargs)

    def do_GET(self) -> None:  # noqa: N802 (stdlib naming)
        if self._handle_health():
            return
        self._apply_spa_fallback()
        super().do_GET()

    def do_HEAD(self) -> None:  # noqa: N802 (stdlib naming)
        if self._handle_health(head_only=True):
            return
        self._apply_spa_fallback()
        super().do_HEAD()

    def _handle_health(self, head_only: bool = False) -> bool:
        if urlsplit(self.path).path != "/health":
            return False
        body = b"ok"
        self.send_response(HTTPStatus.OK)
        self.send_header("Content-Type", "text/plain; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        if not head_only:
            self.wfile.write(body)
        return True

    def _apply_spa_fallback(self) -> None:
        """Route unknown extension-less paths (e.g. /projects) to index.html.

        Missing files that have an extension (e.g. /img/missing.png) still 404.
        """
        path = urlsplit(self.path).path
        if Path(self.translate_path(path)).exists():
            return
        if not Path(path).suffix:
            self.path = "/index.html"

    def list_directory(self, path):  # type: ignore[override]
        """Disable directory listings."""
        self.send_error(HTTPStatus.NOT_FOUND, "File not found")
        return None

    def send_response(self, code, message=None):  # type: ignore[override]
        self._status = code
        super().send_response(code, message)

    def end_headers(self) -> None:
        self.send_header("Content-Security-Policy", self.csp)
        for name, value in BASE_HEADERS.items():
            self.send_header(name, value)
        path = urlsplit(self.path).path
        # Errors and /health set no cache header here (health sets its own).
        if getattr(self, "_status", None) in (HTTPStatus.OK, HTTPStatus.NOT_MODIFIED) and path != "/health":
            if path.startswith(IMMUTABLE_PREFIX):
                # Content-hashed names change whenever the file changes: cache for a year.
                self.send_header("Cache-Control", "public, max-age=31536000, immutable")
            else:
                # Everything else keeps its name across deploys, so browsers must
                # revalidate (cheap 304 via Last-Modified) or edits stay hidden.
                self.send_header("Cache-Control", "no-cache")
        super().end_headers()


def create_server(
    host: str = "0.0.0.0", port: int = 8080, site_dir: Path | str = DEFAULT_SITE_DIR
) -> ThreadingHTTPServer:
    """Build (but do not start) a server for ``site_dir``."""
    site_dir = Path(site_dir).resolve()
    index = site_dir / "index.html"
    if not index.is_file():
        raise FileNotFoundError(f"No index.html found in {site_dir} (run `npm run build` in web/)")
    csp = build_csp(inline_script_hashes(index.read_text(encoding="utf-8")))
    handler = partial(PortfolioHandler, directory=str(site_dir), csp=csp)
    return ThreadingHTTPServer((host, port), handler)


def main() -> None:
    host = os.environ.get("HOST", "0.0.0.0")
    port = int(os.environ.get("PORT", "8080"))
    site_dir = os.environ.get("SITE_DIR", str(DEFAULT_SITE_DIR))

    httpd = create_server(host, port, site_dir)
    print(f"Serving {Path(site_dir).resolve()} on http://localhost:{port}", flush=True)
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        httpd.server_close()


if __name__ == "__main__":
    main()
