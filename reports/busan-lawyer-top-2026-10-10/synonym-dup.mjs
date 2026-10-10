#!/usr/bin/env node
/**
 * 색인 페이지 중 '동의어만 다른 쌍'(기간/기한, 필요서류/준비서류 등)의 본문 유사도(문자 4-gram 코사인)를 잰다.
 * 공통 header/footer/CTA는 <main> 밖이거나 양쪽에 같으므로 값이 높게 나온다 → 같은 사이트 일반 쌍의 기준값도 함께 잰다.
 * 결과: synonym-dup.json, 콘솔에는 요약만.
 */
import fs from "node:fs";
import path from "node:path";
import { listRoutes, parsePage } from "../../scripts/lib/seo-recovery/scan-out.mjs";

const DIR = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1"));
const FAMILIES = [["기간", "기한"], ["필요서류", "준비서류"], ["비용", "보수표"], ["법무사", "전문법무사"], ["법무사", "법무사추천"], ["법무사", "상담"]];
const pages = new Map();
for (const { route, file } of listRoutes()) {
  const h = fs.readFileSync(file, "utf8");
  if (/name="robots" content="noindex/.test(h)) continue;
  pages.set(route, h);
}
const vec = (t) => { const m = new Map(); const s = t.replace(/\s+/g, ""); for (let i = 0; i + 4 <= s.length; i++) { const g = s.slice(i, i + 4); m.set(g, (m.get(g) || 0) + 1); } return m; };
const cos = (a, b) => { let d = 0, na = 0, nb = 0; for (const [k, v] of a) { na += v * v; const w = b.get(k); if (w) d += v * w; } for (const v of b.values()) nb += v * v; return d / Math.sqrt(na * nb || 1); };
const cache = new Map();
const V = (r) => { if (!cache.has(r)) cache.set(r, vec(parsePage(pages.get(r)).mainText)); return cache.get(r); };
const pairs = [];
for (const [a, b] of FAMILIES) {
  for (const r of pages.keys()) {
    if (!r.endsWith(a) || r.includes("/blog/")) continue;
    const other = r.slice(0, -a.length) + b;
    if (other !== r && pages.has(other)) pairs.push({ family: `${a}/${b}`, a: r, b: other, sim: +cos(V(r), V(other)).toFixed(3) });
  }
}
// 기준값: 같은 템플릿이지만 서로 다른 업무 쌍(예: /개인회생기간 vs /상속등기기간)
const base = [];
const kigan = [...pages.keys()].filter((r) => /^\/[^/]+기간$/.test(r)).slice(0, 12);
for (let i = 0; i + 1 < kigan.length; i++) base.push(+cos(V(kigan[i]), V(kigan[i + 1])).toFixed(3));
const avg = (xs) => +(xs.reduce((s, x) => s + x, 0) / (xs.length || 1)).toFixed(3);
const byFam = {};
for (const p of pairs) (byFam[p.family] ??= []).push(p.sim);
fs.writeFileSync(path.join(DIR, "synonym-dup.json"), JSON.stringify({ indexable: pages.size, pairs: pairs.sort((x, y) => y.sim - x.sim), baselineDifferentServiceSameTemplate: base }, null, 1));
console.log(`indexable=${pages.size} synonymPairs=${pairs.length} baseline(다른 업무·같은 템플릿) avg=${avg(base)}`);
for (const [f, xs] of Object.entries(byFam)) console.log(`  ${f}: ${xs.length}쌍 평균 ${avg(xs)} 최대 ${Math.max(...xs)} ≥0.9: ${xs.filter((x) => x >= 0.9).length}`);
console.log("top:", pairs.slice(0, 8).map((p) => `${p.a}~${p.b}=${p.sim}`).join(" | "));
