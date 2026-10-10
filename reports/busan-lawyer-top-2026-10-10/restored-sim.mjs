#!/usr/bin/env node
/**
 * 고아 페이지마다 '같은 업무·다른 지역' 형제 페이지 중 가장 비슷한 것의 본문 유사도(문자 4-gram 코사인)를 잰다.
 * 형제 = 같은 접미 업무명(예: …상속포기)을 가진 다른 색인 페이지. 결과 orphan-sim.json
 */
import fs from "node:fs";
import path from "node:path";
import { listRoutes, parsePage } from "../../scripts/lib/seo-recovery/scan-out.mjs";

const DIR = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1"));
const fam = { restored: JSON.parse(fs.readFileSync(path.join(DIR, "restored-regions.json"), "utf8")) };
const SERVICES = ["상속등기법무사", "상속포기", "한정승인", "상속등기", "법인설립등기", "법인등기", "임원변경등기", "본점이전등기", "선박등기", "소유권이전등기", "증여등기", "근저당말소등기", "근저당말소", "개인회생", "개인파산", "부동산등기", "법무사업무", "법무사", "상속포기한정승인", "건물멸실등기", "신축건물보존등기", "근저당설정등기", "전세권설정", "재개발등기", "재건축등기", "임차권등기명령", "증여등기법무사", "부동산등기법무사", "개인회생법무사"].sort((a, b) => b.length - a.length);
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
const serviceOf = (r) => SERVICES.find((s) => r.endsWith(s)) || null;
const out = [];
for (const [group, routes] of Object.entries(fam)) {
  if (group === "업무×(기간/서류/비용/자가진단)") continue; // 동의어 쌍은 synonym-dup.mjs가 따로 본다
  for (const r of routes) {
    const svc = serviceOf(r);
    const prefix = r.startsWith("/업무사례/") ? "/업무사례/" : "/";
    const sibs = svc ? [...pages.keys()].filter((x) => x !== r && x.startsWith(prefix) && x.endsWith(svc) && x.split("/").length === r.split("/").length) : [];
    let best = { r: null, sim: 0 };
    for (const s of sibs) { const v = cos(V(r), V(s)); if (v > best.sim) best = { r: s, sim: v }; }
    out.push({ group, r, svc, siblings: sibs.length, nearest: best.r, sim: +best.sim.toFixed(3), mainLen: parsePage(pages.get(r)).mainText.length });
  }
}
fs.writeFileSync(path.join(DIR, process.argv[2] || "orphan-sim-after.json"), JSON.stringify(out, null, 1));
const band = (x) => (x >= 0.95 ? "≥0.95" : x >= 0.9 ? "0.90-0.95" : x >= 0.85 ? "0.85-0.90" : x >= 0.75 ? "0.75-0.85" : "<0.75");
const tally = {};
for (const o of out) { const k = `${o.group} ${band(o.sim)}`; tally[k] = (tally[k] || 0) + 1; }
console.log(`orphans checked=${out.length}`);
for (const [k, v] of Object.entries(tally).sort()) console.log(" ", k, v);
console.log("highest:", out.sort((a, b) => b.sim - a.sim).slice(0, 6).map((o) => `${o.r}~${o.nearest}=${o.sim}`).join(" | "));
console.log("no-service-match:", out.filter((o) => !o.svc).map((o) => o.r).slice(0, 12).join(" "));
