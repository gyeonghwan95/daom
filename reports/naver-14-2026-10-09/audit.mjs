#!/usr/bin/env node
/**
 * 14개 필수 검색어 + 추가 후보의 담당 URL을 out/ 정적 HTML에서 점검한다.
 * - 본문(<main>) 안 같은 문장(30자 이상) 반복, 같은 링크 텍스트 반복(카드 제목), 이미지 alt, 역·도보 표기
 * - 검색어 토큰의 title/H1/본문 출현(문자열 출현 상태 — 검색 노출과 별개)
 * 결과: audit-<name>.json, 콘솔에는 건수만.
 *   node reports/naver-14-2026-10-09/audit.mjs before
 */
import fs from "node:fs";
import path from "node:path";
import { parsePage, routeToFile } from "../../scripts/lib/seo-recovery/scan-out.mjs";

const DIR = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1"));
const name = process.argv[2] || "before";
const targets = JSON.parse(fs.readFileSync(path.join(DIR, "targets.json"), "utf8"));
const routes = [...new Set([...targets.map((t) => t.owner), ...targets.map((t) => t.candidate), "/상속", "/법인등기", "/services", "/부산상속전문법무사"])].filter(Boolean);

const sentences = (t) => t.split(/(?<=[.?!다요])\s+/).map((s) => s.trim()).filter((s) => s.length >= 30);
const out = {};
for (const r of routes) {
  const f = routeToFile(r);
  if (!f) { out[r] = { missing: true }; continue; }
  const html = fs.readFileSync(f, "utf8");
  const p = parsePage(html);
  const counts = {};
  for (const s of sentences(p.mainText)) counts[s] = (counts[s] || 0) + 1;
  const repeatedSentences = Object.entries(counts).filter(([, n]) => n >= 2).map(([s, n]) => ({ n, s: s.slice(0, 90) }));
  const lt = {};
  for (const l of p.links) if (l.text.length >= 6) lt[l.text] = (lt[l.text] || 0) + 1;
  const repeatedLinkText = Object.entries(lt).filter(([, n]) => n >= 3).map(([t, n]) => ({ n, t: t.slice(0, 60) }));
  const stations = [...new Set((p.mainText.match(/[가-힣A-Za-z]{1,8}역[^.,·]{0,14}(도보|인근|근처)[^.,]{0,10}/g) || []))];
  out[r] = {
    title: p.title, h1: p.h1s, description: p.description, robots: p.robots, canonical: p.canonical,
    h1Count: p.h1s.length, mainLen: p.mainText.length,
    repeatedSentences, repeatedLinkText,
    alts: [...new Set(p.imgs.map((i) => i.alt).filter(Boolean))],
    emptyAltCount: p.imgs.filter((i) => i.alt === null).length,
    stations,
    mainText: p.mainText,
  };
}
const presence = targets.map((t) => {
  const row = out[t.owner];
  if (!row || row.missing) return { query: t.query, owner: t.owner, missing: true };
  const toks = t.query.split(" ");
  const has = (s) => toks.every((k) => (s || "").includes(k));
  return { query: t.query, owner: t.owner, inTitle: has(row.title), inH1: has(row.h1.join(" ")), inMain: has(row.mainText), exactInMain: row.mainText.includes(t.query) };
});
fs.writeFileSync(path.join(DIR, `audit-${name}.json`), JSON.stringify({ routes: out, presence }, null, 1));
const sum = Object.entries(out).filter(([, v]) => !v.missing);
console.log(`routes=${routes.length} missing=${routes.length - sum.length}`);
console.log("repeatedSentences>0:", sum.filter(([, v]) => v.repeatedSentences.length).map(([r, v]) => `${r}(${v.repeatedSentences.length})`).join(" "));
console.log("h1Count!=1:", sum.filter(([, v]) => v.h1Count !== 1).map(([r, v]) => `${r}(${v.h1Count})`).join(" ") || "-");
console.log("station mentions:", [...new Set(sum.flatMap(([, v]) => v.stations))].join(" | ") || "-");
