#!/usr/bin/env python3
"""DEPRECATED — Metrika is loaded via js/analytics.js after cookie consent only."""
import sys

print("patch-metrika.py is deprecated: use js/analytics.js (consent-gated).", file=sys.stderr)
raise SystemExit(1)
