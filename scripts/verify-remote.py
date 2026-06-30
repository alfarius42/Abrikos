#!/usr/bin/env python3
"""Сверка dist/ с production-сайтом по размерам файлов."""
from __future__ import annotations

import argparse
import sys
import urllib.error
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DIST = ROOT / "dist"
DEFAULT_BASE = "https://abrikos-yeisk.ru"


def fetch_size(url: str) -> int | str:
    try:
        with urllib.request.urlopen(url, timeout=20) as response:
            return len(response.read())
    except urllib.error.HTTPError as exc:
        return f"HTTP {exc.code}"
    except Exception as exc:  # noqa: BLE001
        return f"ERR: {exc}"


def main() -> int:
    parser = argparse.ArgumentParser(description="Verify production files against dist/")
    parser.add_argument("--base", default=DEFAULT_BASE, help="site origin")
    args = parser.parse_args()
    base = args.base.rstrip("/")

    if not DIST.is_dir():
        print("dist/ not found. Run scripts/build-prod.py first.", file=sys.stderr)
        return 1

    mismatches: list[str] = []
    checked = 0

    for path in sorted(p for p in DIST.rglob("*") if p.is_file()):
        rel = "/" + path.relative_to(DIST).as_posix()
        local_size = path.stat().st_size
        remote_size = fetch_size(base + rel)
        checked += 1

        if isinstance(remote_size, str):
            mismatches.append(f"{rel}: local={local_size}, remote={remote_size}")
            continue

        if remote_size != local_size:
            mismatches.append(f"{rel}: local={local_size}, remote={remote_size}")

    if mismatches:
        print(f"Found {len(mismatches)} mismatch(es) out of {checked} files:\n")
        for line in mismatches:
            print(" -", line)
        print(
            "\nTypical causes on Masterhost: FTP not in BINARY mode, "
            "partial upload, or stale files. Re-upload entire dist/ contents to www/."
        )
        return 1

    print(f"OK: {checked} files match dist/ on {base}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
