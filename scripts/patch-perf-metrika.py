#!/usr/bin/env python3
"""Remove inline Yandex.Metrika, swap Google Inter for self-hosted fonts.css, header logo."""
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

METRIKA_BLOCK = re.compile(
    r"\s*<!-- Yandex\.Metrika counter -->.*?<!-- /Yandex\.Metrika counter -->\s*",
    re.DOTALL,
)

INTER_PRECONNECT = re.compile(
    r'\s*<link rel="preconnect" href="https://fonts\.googleapis\.com"(?:\s*/)?>\s*'
    r'(?:<link rel="preconnect" href="https://fonts\.gstatic\.com" crossorigin(?:\s*/)?>\s*)?',
)

INTER_STYLESHEET = re.compile(
    r'\s*<link(?:\s+href="https://fonts\.googleapis\.com/css2\?family=Inter[^"]+"\s+rel="stylesheet"\s*/?>'
    r'|<link\s+href="https://fonts\.googleapis\.com/css2\?family=Inter[^"]+"\s+rel="stylesheet"\s*/?>'
    r'|<link\s+href="https://fonts\.googleapis\.com/css2\?family=Inter[^"]+"\s*\n\s*rel="stylesheet"\s*\n\s*/?>)\s*',
    re.DOTALL,
)

FONTS_CSS = '    <link rel="stylesheet" href="/css/fonts.css" />\n'

HEADER_LOGO = re.compile(
    r'(<img src=")/img/logo\.webp(" alt="[^"]*" width="36" height="36" class="site-header__logo-img")'
)


def patch_file(path: Path) -> list[str]:
    text = path.read_text(encoding="utf-8")
    changes: list[str] = []

    if METRIKA_BLOCK.search(text):
        text = METRIKA_BLOCK.sub("\n", text)
        changes.append("removed inline Metrika")

    if INTER_STYLESHEET.search(text):
        text = INTER_PRECONNECT.sub("\n", text)
        text = INTER_STYLESHEET.sub(FONTS_CSS, text)
        changes.append("self-hosted Inter")
    elif '/css/fonts.css' not in text and 'rel="stylesheet" href="/css/reset.css"' in text:
        text = text.replace(
            '    <link rel="stylesheet" href="/css/reset.css" />',
            FONTS_CSS + '    <link rel="stylesheet" href="/css/reset.css" />',
            1,
        )
        changes.append("added fonts.css")

    new_text, n = HEADER_LOGO.subn(r"\1/img/logo-header.webp\2", text)
    if n:
        text = new_text
        changes.append(f"header logo ({n})")

    if changes:
        path.write_text(text, encoding="utf-8")

    return changes


def main() -> None:
    for rel in PAGES:
        path = ROOT / rel
        changes = patch_file(path)
        if changes:
            print(f"patched {rel}: {', '.join(changes)}")
        else:
            print(f"skip {rel}")


if __name__ == "__main__":
    main()
