#!/usr/bin/env node
/**
 * /업무사례/{지역}상속등기법무사 묶음 점검: 색인·사이트맵·내부 링크 수·형제 간 본문 유사도(공통 블록 제외).
 * 결과 family-sim-<label>.json, 콘솔 요약.
 */
import fs from "node:fs";
import path from "node:path";
import { listRoutes, parsePage } from "../../scripts/lib/seo-recovery/scan-out.mjs";

const DIR = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1"));
const label = process.argv[2] || "now";
const RE = /^\/업무사례\/(.+)상속등기법무사$/;
const split = (t) => t.split(/(?<=[.?!다요])\s+|\s{2,}|✓/).map((x) => x.trim()).filter((x) => x.length >= 12);
const pages = new Map();
const robots = new Map();
const links = new Map();
for (const { route, file } of listRoutes()) {
  const h = fs.readFileSync(file, "utf8");
  const p = parsePage(h);
  robots.set(route, p.robots);
  if (/noindex/.test(p.robots)) continue;
  pages.set(route, split(p.mainText));
  links.set(route, new Set(p.links.map((l) => l.href)));
}
const df = new Map();
for (const s of pages.values()) for (const x of new Set(s)) df.set(x, (df.get(x) || 0) + 1);
const common = new Set([...df].filter(([, n]) => n >= pages.size * 0.3).map(([s]) => s));
const body = (r) => (pages.get(r) || []).filter((s) => !common.has(s)).join(" ");
const vec = (t) => { const m = new Map(); const s = t.replace(/\s+/g, ""); for (let i = 0; i + 4 <= s.length; i++) { const g = s.slice(i, i + 4); m.set(g, (m.get(g) || 0) + 1); } return m; };
const cos = (a, b) => { let d = 0, na = 0, nb = 0; for (const [k, v] of a) { na += v * v; const w = b.get(k); if (w) d += v * w; } for (const v of b.values()) nb += v * v; return d / Math.sqrt(na * nb || 1); };
const fam = [...pages.keys()].filter((r) => RE.test(r));
const V = new Map(fam.map((r) => [r, vec(body(r))]));
const inbound = (r) => [...links].filter(([src, s]) => src !== r && s.has(r)).length;
const rows = fam.map((r) => {
  let best = { r: null, sim: 0 };
  for (const o of fam) if (o !== r) { const v = cos(V.get(r), V.get(o)); if (v > best.sim) best = { r: o, sim: v }; }
  return { r, nearest: best.r, sim: +best.sim.toFixed(3), inbound: inbound(r), uniqueChars: body(r).length };
});
fs.writeFileSync(path.join(DIR, `family-sim-${label}.json`), JSON.stringify(rows, null, 1));
const avg = (k) => (rows.reduce((s, x) => s + x[k], 0) / rows.length).toFixed(3);
console.log(`[${label}] family=${rows.length} avgSim=${avg("sim")} ≥0.90=${rows.filter((x) => x.sim >= 0.9).length} 0.80-0.90=${rows.filter((x) => x.sim >= 0.8 && x.sim < 0.9).length} <0.80=${rows.filter((x) => x.sim < 0.8).length} avgInbound=${avg("inbound")} inbound<=1=${rows.filter((x) => x.inbound <= 1).length}`);
for (const q of ["대구", "양산", "거제", "경주", "창원", "울산", "김해", "서울"]) { const x = rows.find((y) => y.r === `/업무사례/${q}상속등기법무사`); if (x) console.log(" ", q, "sim", x.sim, "~", x.nearest, "inbound", x.inbound); else console.log(" ", q, "no page or noindex", robots.get(`/업무사례/${q}상속등기법무사`) ?? "missing"); }
