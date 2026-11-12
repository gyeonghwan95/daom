"""
Noto Sans KR(가변) 사이트 전용 부분 글꼴 생성기.

왜: Google Fonts 한글 가변 글꼴은 글자 빈도 순 120여 조각으로 나뉘어, 한 페이지가 17~19개(약 320KB)를 받았다.
    이 사이트가 실제로 쓰는 글자(약 900자)로 다시 나누면 한 페이지에 3~5개(약 130KB)로 줄고, 서체는 같다.
굵기: 이 사이트가 쓰는 400·500·700만 담도록 wght 축을 400~700으로 제한한다.
조각: core(거의 모든 글에 쓰는 글자+영문·기호) / mid(3~30% 글) / t1(1~3%) / t2(1% 미만) / ks(KS X 1001 상용 한글 중 미사용분).
      unicode-range라 브라우저는 화면에 있는 글자가 속한 조각만 받는다. 범위 밖 글자는 맑은 고딕 폴백으로 그려진다.

사용:
  1) npm run build 로 out/ 을 만든다(본문 글자 빈도 계산에 필요)
  2) node scripts/fonts/font-chars.cjs out scripts/fonts/chars.json
  3) python scripts/fonts/build-font-subsets.py <NotoSansKR[wght].ttf> scripts/fonts/chars.json
     원본: https://github.com/google/fonts/raw/main/ofl/notosanskr/NotoSansKR%5Bwght%5D.ttf (SIL OFL 1.1)
  4) 생성된 public/fonts/*.woff2 와 src/app/noto-sans-kr-subset.css 를 커밋한다.
새 글에 아직 없던 글자가 많이 생기면 위 과정을 다시 돌린다(scripts/fonts/check-font-coverage.mjs 가 미포함 글자를 알려 준다).
"""
import hashlib, json, os, sys
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer
from fontTools import subset

SRC, CHARS = sys.argv[1], sys.argv[2]
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
OUT = os.path.join(ROOT, "public", "fonts")
CSS = os.path.join(ROOT, "src", "app", "noto-sans-kr-subset.css")
META = os.path.join(ROOT, "scripts", "fonts", "font-subset-meta.json")

d = json.load(open(CHARS, encoding="utf-8")); pages = d["pages"]; rows = d["rows"]
is_h = lambda c: 0xAC00 <= ord(c) <= 0xD7A3
used = {c: n / pages for c, n in rows}
ks = set()
for hi in range(0xB0, 0xC9):
    for lo in range(0xA1, 0xFF):
        try: ks.add(bytes([hi, lo]).decode("euc-kr"))
        except Exception: pass
ks = {c for c in ks if is_h(c)}
latin = [chr(x) for x in range(0x20, 0x7F)]
base = [c for c in used if not is_h(c) and c not in " "]
hang = lambda lo, hi: [c for c, f in used.items() if is_h(c) and lo <= f < hi]
core, mid, t1, t2 = hang(.30, 9), hang(.03, .30), hang(.01, .03), hang(0, .01)
slices = {
    "core": sorted(set(core) | set(latin) | set(base)),
    "mid": sorted(mid), "t1": sorted(t1), "t2": sorted(t2),
    "ks": sorted(ks - set(core) - set(mid) - set(t1) - set(t2)),
}

def ranges(codes):
    codes = sorted(codes); out = []; s = p = None
    for c in codes:
        if s is None: s = p = c
        elif c == p + 1: p = c
        else: out.append((s, p)); s = p = c
    if s is not None: out.append((s, p))
    return ", ".join(f"U+{a:X}" if a == b else f"U+{a:X}-{b:X}" for a, b in out)

os.makedirs(OUT, exist_ok=True)
for old in os.listdir(OUT):
    if old.startswith("noto-sans-kr-") and old.endswith(".woff2"): os.remove(os.path.join(OUT, old))
faces, meta = [], {}
for name, chars in slices.items():
    o = subset.Options(); o.flavor = "woff2"; o.layout_features = ["kern", "ccmp", "locl", "liga"]
    o.name_IDs = [1, 2]; o.notdef_outline = True; o.hinting = False; o.desubroutinize = True
    s = subset.Subsetter(o); s.populate(unicodes=[ord(c) for c in chars])
    f = TTFont(SRC); s.subset(f)
    f = instancer.instantiateVariableFont(f, {"wght": (400, 700)}, inplace=False)
    f.flavor = "woff2"; tmp = os.path.join(OUT, f"_{name}.woff2"); f.save(tmp)
    h = hashlib.sha1(open(tmp, "rb").read()).hexdigest()[:8]
    final = f"noto-sans-kr-{name}.{h}.woff2"; os.replace(tmp, os.path.join(OUT, final))
    size = os.path.getsize(os.path.join(OUT, final))
    meta[name] = {"file": final, "count": len(chars), "bytes": size, "codepoints": sorted(ord(c) for c in chars)}
    faces.append(f'@font-face {{\n  font-family: "Noto Sans KR Subset";\n  font-style: normal;\n  font-weight: 400 700;\n  font-display: swap;\n  src: url("/fonts/{final}") format("woff2");\n  unicode-range: {ranges(ord(c) for c in chars)};\n}}')
    print(f"{name:5s} {len(chars):5d}자 {size//1024:4d}KB  {final}")
header = "/* 자동 생성: scripts/fonts/build-font-subsets.py — 직접 고치지 말고 스크립트를 다시 실행한다. */\n"
open(CSS, "w", encoding="utf-8", newline="\n").write(header + "\n\n".join(faces) + "\n")
json.dump(meta, open(META, "w", encoding="utf-8"), ensure_ascii=False)
