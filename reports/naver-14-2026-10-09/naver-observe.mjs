#!/usr/bin/env node
/**
 * 네이버 통합검색 PC 비로그인 HTML 1회 관측(검색어당 1요청, 3초 간격, 재시도 없음).
 * 광고(ad_section 이전·ader 링크)와 naver.com 내비게이션 링크를 빼고, 외부 결과 도메인 등장 순서를 기록한다.
 * 이 순서는 '통합 결과 내 외부 도메인 등장 순'이며 네이버 공식 순위·영역 순위가 아니다.
 */
import fs from "node:fs";
import path from "node:path";

const DIR = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1"));
const OURS = /xn--2j1br1na42lvxja38mk8r\.kr|다옴법무사사무소\.kr/;
const queries = JSON.parse(fs.readFileSync(path.join(DIR, "queries.json"), "utf8"));
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130 Safari/537.36";
const label = process.argv[2] || "before";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const rows = [];
for (const q of queries.map((x) => x.query)) {
  const at = new Date().toLocaleString("sv-SE", { timeZone: "Asia/Seoul" });
  try {
    const res = await fetch(`https://search.naver.com/search.naver?where=nexearch&query=${encodeURIComponent(q)}`, { headers: { "user-agent": UA, "accept-language": "ko-KR" } });
    const h = await res.text();
    const adEnd = (() => {
      const i = h.indexOf("관련 광고");
      if (i < 0) return 0;
      const j = h.indexOf("<h2", i + 10);
      return j > 0 ? j : i;
    })();
    const seq = [];
    let ourUrl = null;
    for (const m of h.matchAll(/href="(https?:\/\/[^"]+)"/g)) {
      if (m.index < adEnd) continue;
      let u;
      try { u = new URL(m[1].replace(/&amp;/g, "&")); } catch { continue; }
      const d = u.hostname;
      if (/(^|\.)naver\.(com|net)$|pstatic|navercorp|ader\./.test(d) && !/^(m\.)?(blog|cafe|kin|post|in|clip)\.naver\.com$/.test(d)) continue;
      if (seq[seq.length - 1] !== d && !seq.includes(d)) seq.push(d);
      if (OURS.test(d) && !ourUrl) ourUrl = decodeURI(u.pathname);
    }
    const pos = seq.findIndex((d) => OURS.test(d));
    rows.push({ query: q, observedAtKST: at, device: "PC(UA)", login: "no", status: res.status, htmlLen: h.length, ourDomainOrder: pos >= 0 ? pos + 1 : null, ourUrl, externalDomains: seq.slice(0, 15) });
  } catch (e) {
    rows.push({ query: q, observedAtKST: at, error: String(e.message) });
  }
  await sleep(3000);
}
fs.writeFileSync(path.join(DIR, `naver-observe-${label}.json`), JSON.stringify(rows, null, 1));
for (const r of rows) console.log(r.status ?? "ERR", r.query, "| order:", r.ourDomainOrder ?? "-", r.ourUrl ?? "");
