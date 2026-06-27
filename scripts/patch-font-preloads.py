#!/usr/bin/env python3
"""Insert LCP/font preload hints before fonts.css on all production pages."""
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

# Pages with .page-header (hero-header.webp background) — LCP candidate.
PAGE_HEADER_PAGES = {
    "index.html",
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
}

FONT_PRELOADS = """\
    <link rel="preload" href="/fonts/inter/inter-cyrillic-400-normal.woff2" as="font" type="font/woff2" crossorigin />
    <link rel="preload" href="/fonts/inter/inter-cyrillic-700-normal.woff2" as="font" type="font/woff2" crossorigin />
    <link rel="preload" href="/fonts/inter/inter-cyrillic-800-normal.woff2" as="font" type="font/woff2" crossorigin />
    <link rel="preload" href="/fonts/cormorant-garamond/cormorant-garamond-cyrillic-700-normal.woff2" as="font" type="font/woff2" crossorigin />
"""

HERO_PRELOAD = """\
    <link rel="preload" href="/img/hero-header.webp" as="image" type="image/webp" fetchpriority="high" />
"""

REMOVE_OLD = re.compile(
    r'\s*<link rel="preload" href="/(?:img/hero-header\.webp|fonts/inter/inter-cyrillic-(?:400|700|800)-normal\.woff2|fonts/cormorant-garamond/cormorant-garamond-cyrillic-700-normal\.woff2)"[^>]*(?:/>|></link>)\s*',
)


def build_block(rel: str) -> str:
    parts = []
    if rel in PAGE_HEADER_PAGES:
        parts.append(HERO_PRELOAD)
    parts.append(FONT_PRELOADS)
    return "".join(parts)


def patch_file(path: Path, rel: str) -> bool:
    text = path.read_text(encoding="utf-8")
    text = REMOVE_OLD.sub("\n", text)
    if 'href="/css/fonts.css"' not in text:
        return False
    marker = '<link rel="stylesheet" href="/css/fonts.css" />'
    block = build_block(rel)
    if block.strip() in text:
        path.write_text(text, encoding="utf-8")
        return False
    text = text.replace(marker, block + marker, 1)
    path.write_text(text, encoding="utf-8")
    return True


def main() -> None:
    for rel in PAGES:
        changed = patch_file(ROOT / rel, rel)
        print(f"{'patched' if changed else 'ok'} {rel}")


if __name__ == "__main__":
    main()
