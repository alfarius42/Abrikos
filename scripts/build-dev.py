#!/usr/bin/env python3
"""
Dev/staging build: production-файлы + минификация CSS/JS → dist/

Содержимое dist/ — полный набор для заливки на хостинг:
index.html, 404.html, .htaccess, robots.txt, sitemap.xml, rooms/, territory/,
price/, privacy/, css/, js/, img/, fonts/
"""
from __future__ import annotations

import argparse
import platform
import shutil
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DIST = ROOT / "dist"

COPY_PATHS = (
    "index.html",
    "404.html",
    ".htaccess",
    "robots.txt",
    "sitemap.xml",
    "rooms",
    "price",
    "privacy",
    "territory",
    "css",
    "js",
    "img",
    "fonts",
)


def run(cmd: list[str]) -> None:
    print("+", " ".join(cmd))
    if platform.system() == "Windows" and cmd and cmd[0] == "npx":
        cmd = ["npx.cmd", *cmd[1:]]
    subprocess.run(cmd, cwd=ROOT, check=True)


def copy_production_files() -> None:
    if DIST.exists():
        shutil.rmtree(DIST)
    DIST.mkdir()

    for rel in COPY_PATHS:
        src = ROOT / rel
        dst = DIST / rel
        if not src.exists():
            print(f"WARNING: missing {rel}", file=sys.stderr)
            continue
        if src.is_dir():
            shutil.copytree(src, dst)
        else:
            dst.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(src, dst)


def minify_assets() -> None:
    for folder, ext in (("css", ".css"), ("js", ".js")):
        target_dir = DIST / folder
        if not target_dir.is_dir():
            continue
        for path in sorted(target_dir.glob(f"*{ext}")):
            run(
                [
                    "npx",
                    "--yes",
                    "esbuild",
                    str(path),
                    "--minify",
                    f"--outfile={path}",
                    "--allow-overwrite",
                ]
            )


def write_manifest(*, production: bool) -> None:
    manifest = DIST / "BUILD.txt"
    if production:
        lines = [
            "Abrikos — production build",
            f"Built: {datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M:%S UTC')}",
            "Target: https://abrikos-yeisk.ru",
            "Source: scripts/build-prod.py",
            "",
            "Upload entire dist/ contents to hosting document root (www/).",
            "FTP: BINARY mode only. Or upload abrikos-dist.zip and extract on server.",
            "Verify after deploy: python scripts/verify-remote.py",
        ]
    else:
        lines = [
            "Abrikos — dev/staging build",
            f"Built: {datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M:%S UTC')}",
            "Source: develop (scripts/build-dev.py)",
            "",
            "Upload entire dist/ contents to hosting document root.",
        ]
    manifest.write_text("\n".join(lines) + "\n", encoding="utf-8")


def write_zip_archive() -> None:
    archive_base = ROOT / "abrikos-dist"
    if archive_base.with_suffix(".zip").exists():
        archive_base.with_suffix(".zip").unlink()
    shutil.make_archive(str(archive_base), "zip", DIST)
    print(f"Archive: {archive_base.with_suffix('.zip')}")


def verify_seo_files() -> None:
    required = ("robots.txt", "sitemap.xml", ".htaccess")
    missing = [name for name in required if not (ROOT / name).is_file()]
    if missing:
        print(f"ERROR: missing SEO/deploy files: {', '.join(missing)}", file=sys.stderr)
        raise SystemExit(1)


def main() -> int:
    parser = argparse.ArgumentParser(description="Build static site into dist/")
    parser.add_argument(
        "--prod",
        action="store_true",
        help="production build (same output, production manifest)",
    )
    args = parser.parse_args()

    if args.prod:
        verify_seo_files()

    copy_production_files()
    minify_assets()
    write_manifest(production=args.prod)
    if args.prod:
        write_zip_archive()
    print(f"\nDone: {DIST}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
