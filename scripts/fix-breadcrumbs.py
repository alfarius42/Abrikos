import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PAGES = {
    "index.html": "home",
    "404.html": "404",
    "rooms/index.html": "rooms",
    "territory/index.html": "territory",
    "price/index.html": "price",
    "privacy/index.html": "privacy",
    "rooms/1/index.html": "room-1",
    "rooms/2/index.html": "room-2",
    "rooms/3/index.html": "room-3",
    "rooms/4/index.html": "room-4",
    "rooms/5/index.html": "room-5",
    "rooms/6/index.html": "room-6",
    "rooms/apartments/index.html": "room-apartments",
    "rooms/kuban-house/index.html": "room-kuban-house",
}

AREA_PATCH = {
    "rooms/1/index.html": "Номер 1",
    "rooms/2/index.html": "Номер 2",
    "rooms/4/index.html": "Номер 4",
    "rooms/5/index.html": "Номер 5",
    "rooms/6/index.html": "Номер 6",
}

OLD_STATS = '<dl class="room-detail__stats"><div><dt>Вместимость</dt>'
NEW_STATS = '<dl class="room-detail__stats"><div><dt>Площадь</dt><dd>18 м²</dd></div><div><dt>Вместимость</dt>'


def fix_breadcrumbs(html: str, page_id: str) -> str:
    html = re.sub(r'\s*<div id="breadcrumbs-root"[^>]*></div>\s*', "\n", html)
    if page_id in ("home", "404"):
        return html
    slot = '<div id="breadcrumbs-root" class="container"></div>\n        '
    return re.sub(
        r'(<header class="page-header">[\s\S]*?</header>)\s*',
        r"\1\n        " + slot,
        html,
        count=1,
    )


def add_area_to_room(html: str) -> str:
    if OLD_STATS in html and "Площадь" not in html.split("room-detail__stats")[1][:200]:
        html = html.replace(OLD_STATS, NEW_STATS, 1)
    return html


for rel, pid in PAGES.items():
    path = ROOT / rel
    content = path.read_text(encoding="utf-8")
    content = fix_breadcrumbs(content, pid)
    if rel in AREA_PATCH:
        content = add_area_to_room(content)
    path.write_text(content, encoding="utf-8")
    print("ok", rel)
