#!/usr/bin/env node
/**
 * 후보 검색어 → 기존 색인 페이지 매핑(title+H1 토큰 포함률) + 네이버 PC·비로그인 1회 관측.
 * 관측 순서는 광고·네이버 내비 제외 외부 도메인 등장 순(공식 순위 아님). 결과 gap.json
 */
import fs from "node:fs";
import path from "node:path";

const DIR = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1"));
const S = JSON.parse(fs.readFileSync(path.join(DIR, "../busan-lawyer-rank-2026-10-10/after2.json"), "utf8"));
const queries = JSON.parse(fs.readFileSync(path.join(DIR, "queries.json"), "utf8"));
const OURS = /xn--2j1br1na42lvxja38mk8r\.kr/;
const norm = (s) => (s || "").replace(/\s+/g, "");
const pages = Object.entries(S).filter(([, v]) => !/noindex/.test(v.robots || "") && v.canonical);
function bestPages(q) {
  const toks = q.split(/\s+/).filter((t) => t.length >= 2);
  return pages
    .map(([r, v]) => {
      const hay = norm(v.title + " " + (v.h1 || []).join(" "));
      const hit = toks.filter((t) => hay.includes(norm(t))).length;
      return { r, score: hit / toks.length, title: v.title };
    })
    .filter((x) => x.score >= 0.99)
    .sort((a, b) => a.title.length - b.title.length)
    .slice(0, 4);
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130 Safari/537.36";
const rows = [];
for (const q of queries) {
  const at = new Date().toLocaleString("sv-SE", { timeZone: "Asia/Seoul" });
  let obs = null;
  try {
    const h = await (await fetch(`https://search.naver.com/search.naver?where=nexearch&query=${encodeURIComponent(q)}`, { headers: { "user-agent": UA, "accept-language": "ko-KR" } })).text();
    const adEnd = (() => { const i = h.indexOf("관련 광고"); if (i < 0) return 0; const j = h.indexOf("<h2", i + 10); return j > 0 ? j : i; })();
    const seq = []; let ourUrl = null;
    for (const m of h.matchAll(/href="(https?:\/\/[^"]+)"/g)) {
      if (m.index < adEnd) continue;
      let u; try { u = new URL(m[1].replace(/&amp;/g, "&")); } catch { continue; }
      const d = u.hostname;
      if (/(^|\.)naver\.(com|net)$|pstatic|navercorp|ader\./.test(d) && !/^(m\.)?(blog|cafe|kin|post|in|clip)\.naver\.com$/.test(d)) continue;
      if (!seq.includes(d)) seq.push(d);
      if (OURS.test(d) && !ourUrl) ourUrl = decodeURI(u.pathname);
    }
    const place = [...new Set([...h.matchAll(/"PlaceListBusinessesItem:\d+":\{[^}]*?"normalizedName":"([^"]+)"/g)].map((m) => m[1]))];
    const pos = seq.findIndex((d) => OURS.test(d));
    obs = { at, ourOrder: pos >= 0 ? pos + 1 : null, ourUrl, top5: seq.slice(0, 5), placeOurs: place.findIndex((n) => n.includes("다옴")) + 1 || null, placeCount: place.length };
  } catch (e) { obs = { at, error: String(e.message) }; }
  rows.push({ query: q, candidates: bestPages(q), obs });
  await sleep(3000);
}
fs.writeFileSync(path.join(DIR, "gap.json"), JSON.stringify(rows, null, 1));
for (const r of rows) console.log(`${r.query} | web:${r.obs.ourOrder ?? "-"} ${r.obs.ourUrl ?? ""} | place:${r.obs.placeOurs ?? "-"}/${r.obs.placeCount ?? 0} | page:${r.candidates[0]?.r ?? "없음"}`);
