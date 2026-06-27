#!/usr/bin/env python3
"""Insert Yandex.Metrika counter snippet into production HTML pages."""
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PAGES = [
    "index.html",
    "404.html",
    "price/index.html",
    "privacy/index.html",
    "rooms/index.html",
    "rooms/1/index.html",
    "rooms/2/index.html",
    "rooms/3/index.html",
    "rooms/4/index.html",
    "rooms/5/index.html",
    "rooms/6/index.html",
    "rooms/apartments/index.html",
    "rooms/kuban-house/index.html",
    "territory/index.html",
]

METRIKA = """
    <!-- Yandex.Metrika counter -->
    <script type="text/javascript">
      (function(m,e,t,r,i,k,a){
        m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
        m[i].l=1*new Date();
        for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
        k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
      })(window, document,'script','https://mc.yandex.ru/metrika/tag.js', 'ym');

      ym(88914059, 'init', {webvisor:true, clickmap:true, referrer: document.referrer, url: location.href, accurateTrackBounce:true, trackLinks:true});
    </script>
    <noscript><div><img src="https://mc.yandex.ru/watch/88914059" style="position:absolute; left:-9999px;" alt="" /></div></noscript>
    <!-- /Yandex.Metrika counter -->
"""

VIEWPORT = '<meta name="viewport" content="width=device-width, initial-scale=1.0" />'
OLD_CSP = "script-src 'self' https://cdn.jsdelivr.net"
NEW_CSP = "script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://mc.yandex.ru"


def main() -> None:
    for rel in PAGES:
        path = ROOT / rel
        text = path.read_text(encoding="utf-8")
        if "Yandex.Metrika counter" in text:
            print(f"skip (already): {rel}")
            continue
        if OLD_CSP not in text:
            raise SystemExit(f"CSP pattern missing in {rel}")
        if VIEWPORT not in text:
            raise SystemExit(f"viewport missing in {rel}")
        text = text.replace(OLD_CSP, NEW_CSP)
        text = text.replace(VIEWPORT, VIEWPORT + METRIKA, 1)
        path.write_text(text, encoding="utf-8")
        print(f"patched: {rel}")


if __name__ == "__main__":
    main()
