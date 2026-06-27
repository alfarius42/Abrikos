#!/usr/bin/env python3
"""Add defer to external scripts, drop Google Fonts from CSP, unify analytics bootstrap."""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

PAGES = [
    "index.html",
    "404.html",
    "price/index.html",
    "privacy/index.html",
    "rooms/index.html",
    "rooms/1/index.html",
    "rooms/2/index.html",
    "rooms/3/index.html",
    "rooms/4/index.html",
    "rooms/5/index.html",
    "rooms/6/index.html",
    "rooms/apartments/index.html",
    "rooms/kuban-house/index.html",
    "territory/index.html",
]

CSP_OLD_STYLE = "style-src 'self' https://fonts.googleapis.com https://cdn.jsdelivr.net"
CSP_NEW_STYLE = "style-src 'self' https://cdn.jsdelivr.net"
CSP_OLD_FONT = "font-src 'self' https://fonts.gstatic.com"
CSP_NEW_FONT = "font-src 'self'"

INLINE_ANALYTICS = re.compile(
    r"<script>document\.addEventListener\('DOMContentLoaded',\s*function\s*\(\)\s*\{"
    r"\s*if\s*\(window\.Analytics\)\s*window\.Analytics\.initIfAllowed\(\);\s*"
    r"\}\);</script>\s*",
)


def add_defer(text: str) -> tuple[str, int]:
    count = 0

    def repl(match: re.Match[str]) -> str:
        nonlocal count
        tag = match.group(0)
        if " defer" in tag:
            return tag
        count += 1
        return tag.replace("<script", "<script defer", 1)

    return re.subn(r'<script\s+src="[^"]+"\s*></script>', repl, text)[0], count


def ensure_bootstrap(text: str) -> tuple[str, bool]:
    if "bootstrap.js" in text:
        return text, False
    if "/js/cookies.js" not in text:
        return text, False
    text = re.sub(
        r'(<script defer src="/js/cookies\.js"></script>)',
        r'\1\n    <script defer src="/js/bootstrap.js"></script>',
        text,
        count=1,
    )
    return text, "bootstrap.js" in text


def patch_file(path: Path) -> list[str]:
    text = path.read_text(encoding="utf-8")
    changes: list[str] = []

    if CSP_OLD_STYLE in text:
        text = text.replace(CSP_OLD_STYLE, CSP_NEW_STYLE)
        changes.append("csp style")
    if CSP_OLD_FONT in text:
        text = text.replace(CSP_OLD_FONT, CSP_NEW_FONT)
        changes.append("csp font")

    new_text, n = INLINE_ANALYTICS.subn("", text)
    if n:
        text = new_text
        changes.append("removed inline analytics")

    text, n = add_defer(text)
    if n:
        changes.append(f"defer ({n})")

    text, added = ensure_bootstrap(text)
    if added:
        changes.append("bootstrap.js")

    if changes:
        path.write_text(text, encoding="utf-8")

    return changes


def main() -> None:
    for rel in PAGES:
        changes = patch_file(ROOT / rel)
        print(f"{'patched' if changes else 'skip'} {rel}" + (f": {', '.join(changes)}" if changes else ""))


if __name__ == "__main__":
    main()
