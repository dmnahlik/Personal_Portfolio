"""Static file server for the portfolio, built only on the Python standard library.

Serves the ``site/`` folder with security and cache headers, a ``/health``
endpoint, and a single-page-app fallback to ``index.html``. Cloud Run sets the
``PORT`` environment variable; it defaults to 8080 locally.
"""

from __future__ import annotations

import os
from functools import partial
from http import HTTPStatus
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlsplit

DEFAULT_SITE_DIR = Path(__file__).resolve().parent.parent / "site"

CONTENT_SECURITY_POLICY = "; ".join(
    [
        "default-src 'self'",
        "script-src 'self'",
        "style-src 'self' https://fonts.googleapis.com",
        "font-src 'self' https://fonts.gstatic.com",
        "img-src 'self' data:",
        "connect-src 'self'",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
        "frame-ancestors 'none'",
    ]
)

SECURITY_HEADERS = {
    "Content-Security-Policy": CONTENT_SECURITY_POLICY,
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
}


class PortfolioHandler(SimpleHTTPRequestHandler):
    """Serves the static site with portfolio-specific headers and routing."""

    server_version = "PortfolioServer"
    sys_version = ""

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
        for name, value in SECURITY_HEADERS.items():
            self.send_header(name, value)
        path = urlsplit(self.path).path
        if getattr(self, "_status", None) != HTTPStatus.OK or path == "/health":
            pass  # errors and health checks are never cached (health sets its own)
        elif path.endswith((".html", "/")):
            self.send_header("Cache-Control", "no-cache")
        else:
            self.send_header("Cache-Control", "public, max-age=3600")
        super().end_headers()


def create_server(
    host: str = "0.0.0.0", port: int = 8080, site_dir: Path | str = DEFAULT_SITE_DIR
) -> ThreadingHTTPServer:
    """Build (but do not start) a server for ``site_dir``."""
    site_dir = Path(site_dir).resolve()
    if not (site_dir / "index.html").is_file():
        raise FileNotFoundError(f"No index.html found in {site_dir}")
    handler = partial(PortfolioHandler, directory=str(site_dir))
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
