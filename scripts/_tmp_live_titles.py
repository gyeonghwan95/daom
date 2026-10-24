# -*- coding: utf-8 -*-
import re
import urllib.request

UA = {"User-Agent": "Mozilla/5.0"}
BASE = "https://xn--2j1br1na42lvxja38mk8r.kr"
PATHS = [
    "/",
    "/부산법무사상담",
    "/부산상속법무사",
    "/부산상속포기",
    "/부산상속전문법무사",
    "/부산부동산등기전문법무사",
    "/상속",
    "/전국상속등기",
    "/상속포기비용",
    "/부산법인등기",
    "/부산법인설립전문법무사",
    "/부산법률상담",
    "/부산법무사추천",
    "/해운대법무사",
    "/부산등기법무사",
    "/부산상속등기",
    "/부산법인설립등기",
]


def text_of(html: str, pattern: str) -> str:
    m = re.search(pattern, html, re.I | re.S)
    if not m:
        return ""
    return re.sub(r"\s+", " ", re.sub("<[^>]+>", " ", m.group(1))).strip()


for path in PATHS:
    url = BASE + urllib.request.quote(path, safe="/")
    req = urllib.request.Request(url, headers=UA)
    try:
        with urllib.request.urlopen(req, timeout=25) as res:
            html = res.read().decode("utf-8", "replace")
            status = res.status
    except Exception as exc:  # noqa: BLE001
        print(f"{path}\tERR\t{exc}")
        continue
    title = text_of(html, r"<title>(.*?)</title>")[:90]
    h1 = text_of(html, r"<h1[^>]*>(.*?)</h1>")[:80]
    items = len(re.findall(r'"@type"\s*:\s*"ListItem"', html))
    print(f"{path}\t{status}\tlist={items}\t{title}\tH1={h1}")
