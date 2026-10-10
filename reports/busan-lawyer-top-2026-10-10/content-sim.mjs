#!/usr/bin/env node
/**
 * 공통 블록(색인 페이지 30% 이상에 나오는 문장)을 뺀 '본문 고유 부분' 기준 유사도.
 * 대상: restored-regions.json 페이지와 그 형제(같은 업무 접미). 결과: content-sim-<label>.json
 */
import fs from "node:fs";
import path from "node:path";
import { listRoutes, parsePage } from "../../scripts/lib/seo-recovery/scan-out.mjs";

const DIR = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1"));
const label = process.argv[2] || "now";
const targets = JSON.parse(fs.readFileSync(path.join(DIR, "restored-regions.json"), "utf8")).filter((r) => !r.startsWith("/업무사례/"));
const SERVICES = ["상속포기", "한정승인", "상속등기", "법인설립등기", "법인등기", "임원변경등기", "부동산등기"];
const split = (t) => t.split(/(?<=[.?!다요])\s+|\s{2,}|✓/).map((x) => x.trim()).filter((x) => x.length >= 12);
const pages = new Map();
for (const { route, file } of listRoutes()) {
  const h = fs.readFileSync(file, "utf8");
  if (/name="robots" content="noindex/.test(h)) continue;
  pages.set(route, split(parsePage(h).mainText));
}
const df = new Map();
for (const sents of pages.values()) for (const s of new Set(sents)) df.set(s, (df.get(s) || 0) + 1);
const common = new Set([...df].filter(([, n]) => n >= pages.size * 0.3).map(([s]) => s));
const body = (r) => (pages.get(r) || []).filter((s) => !common.has(s)).join(" ");
const vec = (t) => { const m = new Map(); const s = t.replace(/\s+/g, ""); for (let i = 0; i + 4 <= s.length; i++) { const g = s.slice(i, i + 4); m.set(g, (m.get(g) || 0) + 1); } return m; };
const cos = (a, b) => { let d = 0, na = 0, nb = 0; for (const [k, v] of a) { na += v * v; const w = b.get(k); if (w) d += v * w; } for (const v of b.values()) nb += v * v; return d / Math.sqrt(na * nb || 1); };
const out = [];
for (const r of targets) {
  const svc = SERVICES.find((s) => r.endsWith(s));
  const sibs = [...pages.keys()].filter((x) => x !== r && svc && x.endsWith(svc) && !x.slice(1).includes("/") && x !== `/부산${svc}`);
  const vr = vec(body(r));
  let best = { r: null, sim: 0 };
  for (const s of sibs) { const v = cos(vr, vec(body(s))); if (v > best.sim) best = { r: s, sim: v }; }
  out.push({ r, nearest: best.r, sim: +best.sim.toFixed(3), uniqueChars: body(r).length });
}
fs.writeFileSync(path.join(DIR, `content-sim-${label}.json`), JSON.stringify({ commonSentences: common.size, rows: out }, null, 1));
const avg = (out.reduce((s, x) => s + x.sim, 0) / out.length).toFixed(3);
console.log(`[${label}] commonSentences=${common.size} pages=${out.length} avg=${avg} ≥0.90=${out.filter((x) => x.sim >= 0.9).length} 0.80-0.90=${out.filter((x) => x.sim >= 0.8 && x.sim < 0.9).length} <0.80=${out.filter((x) => x.sim < 0.8).length} avgUniqueChars=${Math.round(out.reduce((s, x) => s + x.uniqueChars, 0) / out.length)}`);
