#!/usr/bin/env python3
"""Nest header tagline inside logo text for unified font rendering."""
from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

REPLACEMENTS = [
    (
        '<span class="site-header__logo-text site-header__logo-text--full">Гостевой дом «Абрикос»</span>'
        '<span class="site-header__logo-text site-header__logo-text--short">Абрикос</span>'
        '<span class="site-header__logo-tagline">Ейск</span>',
        '<span class="site-header__logo-text site-header__logo-text--full">Гостевой дом «Абрикос»'
        '<span class="site-header__logo-tagline"> · Ейск</span></span>'
        '<span class="site-header__logo-text site-header__logo-text--short">Абрикос</span>',
    ),
    (
        '<span class="site-header__logo-text site-header__logo-text--full">Гостевой дом «Абрикос»</span>\n'
        '            <span class="site-header__logo-text site-header__logo-text--short">Абрикос</span>\n'
        '            <span class="site-header__logo-tagline">Ейск</span>',
        '<span class="site-header__logo-text site-header__logo-text--full">Гостевой дом «Абрикос»'
        '<span class="site-header__logo-tagline"> · Ейск</span></span>\n'
        '            <span class="site-header__logo-text site-header__logo-text--short">Абрикос</span>',
    ),
]


def main() -> None:
    for path in ROOT.rglob('*.html'):
        if 'prototype' in path.parts:
            continue
        text = path.read_text(encoding='utf-8')
        orig = text
        for old, new in REPLACEMENTS:
            text = text.replace(old, new)
        if text != orig:
            path.write_text(text, encoding='utf-8')
            print(f'patched {path.relative_to(ROOT)}')
        elif 'site-header__logo-tagline">Ейск</span>' in text:
            print(f'skip {path.relative_to(ROOT)}')


if __name__ == '__main__':
    main()
