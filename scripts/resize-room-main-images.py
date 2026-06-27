#!/usr/bin/env python3
"""Resize *-main.webp room card images to max display width (1000px, 4:3)."""
from __future__ import annotations

from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
ROOMS = ROOT / "img" / "rooms"
MAX_WIDTH = 1000


def resize(path: Path) -> None:
    img = Image.open(path)
    w, h = img.size
    if w <= MAX_WIDTH:
        print(f"skip {path.name}: {w}x{h}")
        return
    new_h = round(h * MAX_WIDTH / w)
    resized = img.resize((MAX_WIDTH, new_h), Image.Resampling.LANCZOS)
    if path.suffix.lower() == ".webp":
        resized.save(path, "WEBP", quality=82, method=6)
    else:
        resized.save(path, quality=85)
    print(f"resized {path.name}: {w}x{h} -> {MAX_WIDTH}x{new_h} ({path.stat().st_size} bytes)")


def main() -> None:
    for path in sorted(ROOMS.glob("*-main.webp")):
        resize(path)


if __name__ == "__main__":
    main()
