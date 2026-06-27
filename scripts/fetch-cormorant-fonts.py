#!/usr/bin/env python3
"""Download Cormorant Garamond woff2 (latin + cyrillic) for self-hosting."""
from __future__ import annotations

import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "fonts" / "cormorant-garamond"
BASE = "https://cdn.jsdelivr.net/npm/@fontsource/cormorant-garamond@5.2.5/files"
SUBSETS = ("latin", "cyrillic")
# Weights used in layout.css: 600, 700, 600 italic
FILES = (
    "cormorant-garamond-{subset}-600-normal.woff2",
    "cormorant-garamond-{subset}-700-normal.woff2",
    "cormorant-garamond-{subset}-600-italic.woff2",
)


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    for subset in SUBSETS:
        for pattern in FILES:
            name = pattern.format(subset=subset)
            url = f"{BASE}/{name}"
            dest = OUT / name
            print(f"fetch {name}")
            urllib.request.urlretrieve(url, dest)
    print(f"done: {len(list(OUT.glob('*.woff2')))} files in {OUT}")


if __name__ == "__main__":
    main()
