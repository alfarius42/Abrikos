#!/usr/bin/env python3
"""Patch production HTML: data-page, breadcrumbs slot, OG/Twitter meta, seo.js."""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SITE = "https://abrikos-yeisk.ru"
OG_IMAGE = f"{SITE}/img/hero.webp"

PAGES: dict[str, dict] = {
    "index.html": {"page": "home", "path": "/"},
    "rooms/index.html": {"page": "rooms", "path": "/rooms"},
    "rooms/1/index.html": {"page": "room-1", "path": "/rooms/1"},
    "rooms/2/index.html": {"page": "room-2", "path": "/rooms/2"},
    "rooms/3/index.html": {"page": "room-3", "path": "/rooms/3"},
    "rooms/4/index.html": {"page": "room-4", "path": "/rooms/4"},
    "rooms/5/index.html": {"page": "room-5", "path": "/rooms/5"},
    "rooms/6/index.html": {"page": "room-6", "path": "/rooms/6"},
    "rooms/apartments/index.html": {"page": "room-apartments", "path": "/rooms/apartments"},
    "rooms/kuban-house/index.html": {"page": "room-kuban-house", "path": "/rooms/kuban-house"},
    "territory/index.html": {"page": "territory", "path": "/territory"},
    "price/index.html": {"page": "price", "path": "/price"},
    "privacy/index.html": {"page": "privacy", "path": "/privacy"},
    "404.html": {"page": "404", "path": "/404", "noindex": True},
}


def extract_meta_description(html: str) -> str:
    m = re.search(r'<meta\s+name="description"\s+content="([^"]*)"', html)
    return m.group(1) if m else ""


def extract_title(html: str) -> str:
    m = re.search(r"<title>([^<]+)</title>", html)
    return m.group(1) if m else ""


def ensure_body_data_page(html: str, page_id: str) -> str:
    if re.search(r"<body\s+data-page=", html):
        return re.sub(r'<body\s+data-page="[^"]*"', f'<body data-page="{page_id}"', html, count=1)
    return html.replace("<body>", f'<body data-page="{page_id}">', 1)


def ensure_breadcrumbs_root(html: str, page_id: str) -> str:
    if page_id in ("home", "404"):
        return html
    if 'id="breadcrumbs-root"' in html:
        return html
    slot = '<div id="breadcrumbs-root" class="container"></div>'
    return html.replace("</header>", f"</header>\n        {slot}", 1)


def build_social_meta(title: str, description: str, url: str) -> str:
    desc = description.replace('"', "&quot;")
    title_esc = title.replace('"', "&quot;")
    return f"""    <meta property="og:url" content="{url}" />
    <meta property="og:description" content="{desc}" />
    <meta property="og:image" content="{OG_IMAGE}" />
    <meta property="og:locale" content="ru_RU" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="{title_esc}" />
    <meta name="twitter:description" content="{desc}" />
    <meta name="twitter:image" content="{OG_IMAGE}" />"""


def ensure_social_meta(html: str, meta: dict) -> str:
    if 'property="og:url"' in html:
        return html
    title = extract_title(html)
    description = extract_meta_description(html)
    url = SITE + meta["path"]
    block = build_social_meta(title, description, url)
    og_type = re.search(r'<meta\s+property="og:type"[^>]+>', html)
    if og_type:
        return html.replace(og_type.group(0), og_type.group(0) + "\n" + block, 1)
    canonical = re.search(r'<link\s+rel="canonical"[^>]+>', html)
    if canonical:
        return html.replace(canonical.group(0), canonical.group(0) + "\n" + block, 1)
    return html


def ensure_og_title(html: str) -> str:
    if 'property="og:title"' in html:
        return html
    title = extract_title(html).replace('"', "&quot;")
    insert = (
        f'    <meta property="og:title" content="{title}" />\n'
        f'    <meta property="og:type" content="website" />'
    )
    return re.sub(r"</title>", f"</title>\n{insert}", html, count=1)


def ensure_noindex(html: str) -> str:
    if 'name="robots"' in html:
        return html
    tag = '    <meta name="robots" content="noindex, follow" />'
    return html.replace("<meta charset", tag + "\n    <meta charset", 1)


def ensure_seo_script(html: str) -> str:
    if "/js/seo.js" in html:
        return html
    return html.replace(
        '<script src="/js/config.js"></script>',
        '<script src="/js/config.js"></script>\n    <script src="/js/seo.js"></script>',
        1,
    )


def patch_file(rel: str, meta: dict) -> None:
    path = ROOT / rel.replace("/", "\\") if "\\" not in rel else ROOT / rel
    path = ROOT / rel
    html = path.read_text(encoding="utf-8")
    html = ensure_body_data_page(html, meta["page"])
    html = ensure_og_title(html)
    html = ensure_social_meta(html, meta)
    if meta.get("noindex"):
        html = ensure_noindex(html)
    html = ensure_breadcrumbs_root(html, meta["page"])
    html = ensure_seo_script(html)
    path.write_text(html, encoding="utf-8")
    print(f"patched {rel}")


def main() -> None:
    for rel, meta in PAGES.items():
        patch_file(rel, meta)


if __name__ == "__main__":
    main()
