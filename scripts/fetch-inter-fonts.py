#!/usr/bin/env python3
"""Download Inter woff2 (latin + cyrillic) for self-hosting."""
from __future__ import annotations

import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "fonts" / "inter"
BASE = "https://cdn.jsdelivr.net/npm/@fontsource/inter@5.2.5/files"
WEIGHTS = (400, 600, 700, 800)
SUBSETS = ("latin", "cyrillic")


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    for subset in SUBSETS:
        for weight in WEIGHTS:
            name = f"inter-{subset}-{weight}-normal.woff2"
            url = f"{BASE}/{name}"
            dest = OUT / name
            print(f"fetch {name}")
            urllib.request.urlretrieve(url, dest)
    print(f"done: {len(list(OUT.glob('*.woff2')))} files in {OUT}")


if __name__ == "__main__":
    main()
