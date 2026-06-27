#!/usr/bin/env python3
"""Add gallery-slider markup to room detail pages."""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ROOM_DIRS = [
    ROOT / "rooms" / "1",
    ROOT / "rooms" / "2",
    ROOT / "rooms" / "3",
    ROOT / "rooms" / "4",
    ROOT / "rooms" / "5",
    ROOT / "rooms" / "6",
    ROOT / "rooms" / "apartments",
    ROOT / "rooms" / "kuban-house",
]

GALLERY_RE = re.compile(
    r'<div class="room-detail__gallery" data-gallery-root>'
    r'(<div class="room-detail__main-image-wrap">'
    r'<img class="room-detail__main-image" data-gallery-main '
    r'([^>]+)/>)'
    r'</div>'
    r'(<div class="room-detail__thumbs">.*?</div>)'
    r'</div>',
    re.DOTALL,
)

THUMB_RE = re.compile(r'data-gallery-thumb', re.DOTALL)


def patch_gallery(match: re.Match[str]) -> str:
    img_attrs = match.group(2)
    thumbs_html = match.group(3)
    thumb_count = len(THUMB_RE.findall(thumbs_html))

    img_attrs = re.sub(r'\bwidth="1200"\s*height="800"', 'width="800" height="600"', img_attrs)
    if 'gallery-slider__image' not in img_attrs:
        img_attrs = img_attrs.replace(
            'class="room-detail__main-image"',
            'class="room-detail__main-image gallery-slider__image"',
        )

    return (
        '<div class="room-detail__gallery" data-gallery-root data-gallery-slider '
        'aria-label="Фотогалерея номера">'
        '<div class="gallery-slider">'
        '<div class="gallery-slider__stage">'
        '<button type="button" class="gallery-slider__nav gallery-slider__nav--prev" '
        'data-gallery-prev aria-label="Предыдущее фото">‹</button>'
        '<div class="gallery-slider__image-wrap room-detail__main-image-wrap">'
        f'<img class="room-detail__main-image gallery-slider__image" data-gallery-main {img_attrs}/>'
        '</div>'
        '<button type="button" class="gallery-slider__nav gallery-slider__nav--next" '
        'data-gallery-next aria-label="Следующее фото">›</button>'
        '</div>'
        '<div class="gallery-slider__meta">'
        f'<p class="gallery-slider__counter" data-gallery-counter aria-live="polite">1 / {thumb_count}</p>'
        '</div>'
        f'{thumbs_html.replace("room-detail__thumbs", "room-detail__thumbs gallery-slider__thumbs", 1)}'
        '</div>'
        '</div>'
    )


def patch_file(path: Path) -> bool:
    text = path.read_text(encoding="utf-8")
    if 'data-gallery-slider' in text:
        print(f"skip {path.relative_to(ROOT)}")
        return False
    updated, count = GALLERY_RE.subn(patch_gallery, text)
    if count != 1:
        raise RuntimeError(f"Expected 1 gallery block in {path}, got {count}")
    path.write_text(updated, encoding="utf-8")
    print(f"patched {path.relative_to(ROOT)}")
    return True


def main() -> None:
    for room_dir in ROOM_DIRS:
        patch_file(room_dir / "index.html")


if __name__ == "__main__":
    main()
