#!/usr/bin/env python3
"""Resize territory gallery images + generate thumb variants for mobile containers."""
from __future__ import annotations

from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
IMG = ROOT / "img"
# Gallery max 680px; mobile display ~425px — 680 covers 2x retina in column.
MAIN_MAX = 680
# Mobile thumb column ~187–207px wide; 208 ≈ 2x for ~104px CSS cell in 6-col grid.
THUMB_MAX = 208
QUALITY_MAIN = 74
QUALITY_THUMB = 68

NAMES = (
    "territory-main.webp",
    "territory-gazebo.webp",
    "territory-bbq.webp",
    "territory-playground.webp",
    "territory-kitchen.webp",
    "territory-balcony.webp",
)


def crop_cover_4_3(img: Image.Image, out_w: int) -> Image.Image:
    """Center-crop to 4:3 then scale to out_w."""
    out_h = round(out_w * 3 / 4)
    src_w, src_h = img.size
    target_ratio = out_w / out_h
    src_ratio = src_w / src_h
    if src_ratio > target_ratio:
        crop_h = src_h
        crop_w = round(src_h * target_ratio)
    else:
        crop_w = src_w
        crop_h = round(src_w / target_ratio)
    left = (src_w - crop_w) // 2
    top = (src_h - crop_h) // 2
    cropped = img.crop((left, top, left + crop_w, top + crop_h))
    return cropped.resize((out_w, out_h), Image.Resampling.LANCZOS)


def resize_to(path: Path, max_width: int, quality: int, *, crop_43: bool = False) -> None:
    img = Image.open(path)
    w, h = img.size
    if crop_43:
        img = crop_cover_4_3(img, max_width)
        new_w, new_h = max_width, round(max_width * 3 / 4)
    elif w > max_width:
        new_h = round(h * max_width / w)
        img = img.resize((max_width, new_h), Image.Resampling.LANCZOS)
        new_w = max_width
    else:
        new_w, new_h = w, h
    img.save(path, "WEBP", quality=quality, method=6)
    print(f"{path.name}: -> {new_w}x{new_h} ({path.stat().st_size} bytes)")


def make_thumb(src: Path, dest: Path) -> None:
    img = Image.open(src)
    w, h = img.size
    if w > THUMB_MAX:
        new_h = round(h * THUMB_MAX / w)
        img = img.resize((THUMB_MAX, new_h), Image.Resampling.LANCZOS)
    img.save(dest, "WEBP", quality=QUALITY_THUMB, method=6)
    print(f"  thumb {dest.name}: {img.size[0]}x{img.size[1]} ({dest.stat().st_size} bytes)")


def main() -> None:
    for name in NAMES:
        path = IMG / name
        if not path.exists():
            print(f"missing: {name}")
            continue
        crop = name == "territory-gazebo.webp"
        resize_to(path, MAIN_MAX, QUALITY_MAIN, crop_43=crop)
        make_thumb(path, IMG / name.replace(".webp", "-thumb.webp"))


if __name__ == "__main__":
    main()
