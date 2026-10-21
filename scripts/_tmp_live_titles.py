import re
import subprocess
import sys

HOST = "https://xn--2j1br1na42lvxja38mk8r.kr"
PATHS = [
    "/",
    "/상속",
    "/전국상속등기",
    "/부산상속포기",
    "/상속포기비용",
    "/상속등기비용",
    "/부산상속법무사",
    "/부산상속등기",
    "/부산한정승인",
    "/상속상담전준비서류와비용",
    "/부산상속전문법무사",
    "/업무사례/울산동구상속등기법무사",
    "/상속포기필요서류",
]

def fetch(path: str) -> str:
    url = HOST if path == "/" else HOST + "/" + "/".join(
        __import__("urllib.parse").parse.quote(seg) for seg in path.strip("/").split("/")
    )
    r = subprocess.run(
        ["curl.exe", "-sS", "-A", "Mozilla/5.0", url],
        capture_output=True,
        check=False,
    )
    return r.stdout.decode("utf-8", errors="replace")

def first(pattern: str, html: str) -> str:
    m = re.search(pattern, html, re.I | re.S)
    if not m:
        return ""
    return re.sub(r"\s+", " ", m.group(1)).strip()[:180]

out = open("scripts/_tmp_live_titles.tsv", "w", encoding="utf-8")
out.write("path\ttitle\th1\tcanonical\trobots\titemlist\thtml_len\n")

for path in PATHS:
    html = fetch(path)
    title = first(r"<title[^>]*>(.*?)</title>", html)
    h1 = first(r"<h1[^>]*>(.*?)</h1>", html)
    h1 = re.sub(r"<[^>]+>", "", h1)
    canon = first(r'<link[^>]+rel=["\']canonical["\'][^>]+href=["\']([^"\']+)', html)
    robots = first(r'<meta[^>]+name=["\']robots["\'][^>]+content=["\']([^"\']+)', html)
    itemlist = "ItemList" if "ItemList" in html else "-"
    line = f"{path}\t{title}\t{h1}\t{canon}\t{robots}\t{itemlist}\t{len(html)}"
    out.write(line + "\n")

out.close()
print("wrote scripts/_tmp_live_titles.tsv")
