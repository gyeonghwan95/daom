#!/usr/bin/env node
/**
 * 지역 상속 페이지 빠른 중복 검사 — out/ 정적 HTML 기준(빌드 후 실행).
 * 지역명을 [R]로 바꾼 뒤 본문·first700 유사도(문자 5-gram 코사인)와 40자 이상 동일 문장을 본다.
 *
 * node scripts/regional-content-check.mjs [--focus=/a,/b] [--out=reports/.../07-duplicate-check.csv]
 *   --focus 없으면 지역 대표 URL(/업무사례/*상속등기법무사) 전체를 검사한다.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "out");
const arg = (name) => process.argv.find((a) => a.startsWith(`--${name}=`))?.slice(name.length + 3);
const CSV_OUT = arg("out") ? path.join(ROOT, arg("out")) : null;

const decode = (s) =>
  String(s || "")
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'").replace(/&nbsp;/g, " ");
const strip = (html) =>
  decode(
    html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<!--[\s\S]*?-->/g, " ")
      .replace(/<[^>]+>/g, " "),
  ).replace(/\s+/g, " ").trim();
const htmlFile = (p) => {
  const flat = path.join(OUT, `${p.slice(1)}.html`);
  return fs.existsSync(flat) ? flat : path.join(OUT, ...p.slice(1).split("/"), "index.html");
};

function regionWords() {
  const set = new Set([
    "서울특별시", "부산광역시", "대구광역시", "인천광역시", "광주광역시", "대전광역시", "울산광역시", "세종특별자치시",
    "경기도", "강원특별자치도", "강원도", "충청북도", "충청남도", "전북특별자치도", "전라북도", "전라남도", "경상북도", "경상남도", "제주특별자치도",
    "서울", "부산", "대구", "인천", "광주", "대전", "울산", "세종", "경기", "강원", "충북", "충남", "전북", "전남", "경북", "경남", "제주",
    "수도권", "충청", "호남", "영남", "경상도", "전라도", "충청도",
  ]);
  for (const dir of ["src/lib/nationwide-cases", "src/lib/regional-inheritance"]) {
    const abs = path.join(ROOT, dir);
    if (!fs.existsSync(abs)) continue;
    for (const f of fs.readdirSync(abs)) {
      if (!f.endsWith(".ts")) continue;
      const t = fs.readFileSync(path.join(abs, f), "utf8");
      for (const m of t.matchAll(/(?:regionName|parentRegion|region|cityName|name):\s*"([가-힣]{2,8})"/g)) {
        if (m[1] !== "전국") set.add(m[1]);
      }
    }
  }
  return [...set].sort((a, b) => b.length - a.length);
}
const REGION_WORDS = regionWords();
function norm(text) {
  let s = text;
  for (const w of REGION_WORDS) s = s.split(w).join("[R]");
  return s.replace(/\[R\]\s?(?:특별자치시|특별자치도|특별시|광역시|시|군|구|도)?/g, "[R]");
}

/** 법령명·서류명·사무소 정보처럼 바꿀 수 없는 고정 문구는 정확 문장 비교에서 뺀다 */
const FIXED = /(가족관계증명서|기본증명서|제적등본|주민등록|인감증명|본인서명사실확인서|부동산등기법|지방세법|민법 제|가사소송법|주택도시기금법|국민주택채권|등록면허세|다옴법무사사무소|안윤정|010-4277-1279|해운대구 센텀동로)/;

function parts(p) {
  const f = htmlFile(p);
  if (!fs.existsSync(f)) return null;
  const html = fs.readFileSync(f, "utf8");
  const main = html.match(/<main[^>]*>([\s\S]*)<\/main>/i)?.[1] ?? "";
  const h1 = strip(main.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1] ?? "");
  const text = strip(main);
  const i = h1 ? text.indexOf(h1) : -1;
  const body = i >= 0 ? text.slice(i + h1.length).trim() : text;
  const h2 = [...main.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/gi)].map((m) => strip(m[1])).filter(Boolean);
  const nb = norm(body);
  return {
    title: decode(html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] ?? "").trim(),
    h1,
    body,
    nbody: nb,
    nfirst700: nb.slice(0, 700),
    nh2: norm(h2.join(" | ")),
    chars: body.replace(/\s/g, "").length,
    sentences: new Set(
      nb.split(/(?<=[.?!])\s+|(?<=다)\s+(?=[가-힣A-Z[])/).map((s) => s.trim()).filter((s) => s.length >= 40 && !FIXED.test(s)),
    ),
  };
}
function shingles(text, n = 5) {
  const s = text.replace(/\s+/g, " ");
  const m = new Map();
  for (let i = 0; i + n <= s.length; i++) {
    const g = s.slice(i, i + n);
    m.set(g, (m.get(g) || 0) + 1);
  }
  let sq = 0;
  for (const v of m.values()) sq += v * v;
  m.norm = Math.sqrt(sq) || 1;
  return m;
}
function cosine(a, b) {
  const [s, l] = a.size < b.size ? [a, b] : [b, a];
  let dot = 0;
  for (const [k, v] of s) {
    const w = l.get(k);
    if (w) dot += v * w;
  }
  return dot / (a.norm * b.norm);
}
const status = (v) => (v >= 0.8 ? "CLONE_RISK" : v >= 0.7 ? "HIGH_SIMILARITY" : v >= 0.6 ? "REWRITE" : "PASS");

const sm = JSON.parse(fs.readFileSync(path.join(ROOT, "scripts/output/sitemap-manifest.json"), "utf8"));
const allPaths = [...new Set(sm.entries.map((e) => e.path))];
const corpusPaths = allPaths.filter((p) => p.startsWith("/업무사례/") || /상속/.test(p));
const focus = arg("focus")
  ? arg("focus").split(",").map((s) => s.trim()).filter(Boolean)
  : allPaths.filter((p) => /^\/업무사례\/.+상속등기법무사$/.test(p));

const data = new Map();
for (const p of new Set([...corpusPaths, ...focus])) {
  const v = parts(p);
  if (v) data.set(p, { ...v, vb: shingles(v.nbody), vf: shingles(v.nfirst700), vh: shingles(v.nh2, 3) });
}

const rows = [];
for (const a of focus) {
  const A = data.get(a);
  if (!A) {
    rows.push({ a, b: "", first700: "", main: "", h2: "", exact: "", status: "MISSING", chars: "" });
    continue;
  }
  let best = null;
  let bestF = 0;
  let exact = 0;
  let exactWith = "";
  for (const [b, B] of data) {
    if (b === a) continue;
    const main = cosine(A.vb, B.vb);
    const f700 = cosine(A.vf, B.vf);
    if (!best || main > best.main) best = { b, main, f700, h2: cosine(A.vh, B.vh) };
    if (f700 > bestF) bestF = f700;
    let n = 0;
    for (const s of A.sentences) if (B.sentences.has(s)) n++;
    if (n > exact) {
      exact = n;
      exactWith = b;
    }
  }
  rows.push({
    a,
    b: best.b,
    first700: bestF.toFixed(3),
    main: best.main.toFixed(3),
    h2: best.h2.toFixed(3),
    exact: exact ? `${exact} (${exactWith})` : "0",
    status: status(Math.max(best.main, bestF)),
    chars: A.chars,
  });
}

const counts = rows.reduce((acc, r) => ((acc[r.status] = (acc[r.status] || 0) + 1), acc), {});
console.log(`focus=${focus.length} corpus=${data.size} ${Object.entries(counts).map(([k, v]) => `${k}=${v}`).join(" ")}`);
if (CSV_OUT) {
  const cell = (v) => {
    const s = String(v ?? "");
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const header = ["A", "B_nearest", "first700_max", "mainSimilarity", "h2Similarity", "exact40_sentences", "chars", "status"];
  fs.mkdirSync(path.dirname(CSV_OUT), { recursive: true });
  fs.writeFileSync(
    CSV_OUT,
    "\uFEFF" + [header, ...rows.map((r) => [r.a, r.b, r.first700, r.main, r.h2, r.exact, r.chars, r.status])].map((r) => r.map(cell).join(",")).join("\n") + "\n",
    "utf8",
  );
  console.log(`csv=${path.relative(ROOT, CSV_OUT)}`);
}
