#!/usr/bin/env python3
"""Create 80×80 header logo from full-size logo.webp."""
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "img" / "logo.webp"
DEST = ROOT / "img" / "logo-header.webp"


def main() -> None:
    img = Image.open(SRC).convert("RGBA")
    resized = img.resize((80, 80), Image.Resampling.LANCZOS)
    resized.save(DEST, "WEBP", quality=85, method=6)
    print(f"written {DEST} ({DEST.stat().st_size} bytes)")


if __name__ == "__main__":
    main()
