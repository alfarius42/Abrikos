#!/usr/bin/env python3
"""Create compact hero-header.webp for page-header backgrounds."""
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "img" / "hero.webp"
DEST = ROOT / "img" / "hero-header.webp"
MAX_WIDTH = 960


def main() -> None:
    img = Image.open(SRC).convert("RGB")
    w, h = img.size
    new_h = round(h * MAX_WIDTH / w)
    resized = img.resize((MAX_WIDTH, new_h), Image.Resampling.LANCZOS)
    resized.save(DEST, "WEBP", quality=78, method=6)
    print(f"written {DEST} {MAX_WIDTH}x{new_h} ({DEST.stat().st_size} bytes)")


if __name__ == "__main__":
    main()
