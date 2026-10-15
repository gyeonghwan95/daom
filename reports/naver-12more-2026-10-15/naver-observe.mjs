#!/usr/bin/env node
/**
 * 네이버 통합검색 PC 비로그인 1회 관측(검색어당 1요청, 4초 간격, 재시도 없음).
 * 원문 HTML은 serp/<label>-<n>.html 로 저장하고, 영역을 나눠 기록한다.
 *  - ads: 파워링크 영역 존재 여부(광고 내용은 기록하지 않음)
 *  - place: 플레이스 목록의 장소 ID 순서(요청 IP 위치 영향 — 순위로 쓰지 않음), 우리 장소(2035745096) 위치
 *  - blocks: data-block-id 통합 결과 블록 순서(web=웹문서, review=블로그·카페, qra=질문형, clip/image 등)와 블록 첫 URL
 * 블록 순서는 한 시점·한 조건 관측이며 네이버 공식 순위가 아니다.
 */
import fs from "node:fs";
import path from "node:path";

const DIR = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1"));
const OURS = /xn--2j1br1na42lvxja38mk8r\.kr|다옴법무사사무소\.kr/;
const OUR_PLACE = "2035745096";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130 Safari/537.36";
const label = process.argv[2] || "obs";
const queries = JSON.parse(fs.readFileSync(path.join(DIR, "queries.json"), "utf8"));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
fs.mkdirSync(path.join(DIR, "serp"), { recursive: true });

function hostPath(href) {
  try {
    const u = new URL(href.replace(/&amp;/g, "&"));
    if (/(^|\.)naver\.(com|net)$|pstatic|navercorp|ader\./.test(u.hostname) &&
      !/^(m\.)?(blog|cafe|kin|post|in|clip|tv)\.naver\.com$/.test(u.hostname)) return null;
    return { host: u.hostname, url: u.hostname + decodeURI(u.pathname) };
  } catch {
    return null;
  }
}

export function parseSerp(h) {
  const ads = h.includes("파워링크");
  const pi = h.indexOf('<h2 class="title">플레이스');
  let place = null;
  if (pi >= 0) {
    const next = h.indexOf("data-block-id=", pi);
    const seg = h.slice(pi, next > pi ? next : pi + 300000);
    const ids = [...seg.matchAll(/place\/(\d{6,12})/g)].map((m) => m[1]).filter((v, i, a) => a.indexOf(v) === i);
    place = { ids: ids.slice(0, 10), ourOrder: ids.indexOf(OUR_PLACE) + 1 || null, ourName: seg.includes("다옴법무사") };
  }
  const starts = [...h.matchAll(/data-block-id="([^"]+)"/g)].map((m) => ({ i: m.index, id: m[1] }));
  const blocks = [];
  starts.forEach((b, k) => {
    const end = k + 1 < starts.length ? starts[k + 1].i : b.i + 80000;
    const seg = h.slice(b.i, end);
    const type = b.id.split("/")[0];
    let first = null;
    let ours = null;
    for (const m of seg.matchAll(/href="(https?:\/\/[^"]+)"/g)) {
      const hp = hostPath(m[1]);
      if (!hp) continue;
      if (!first) first = hp.url;
      if (OURS.test(hp.host) && !ours) ours = hp.url.replace(/^[^/]+/, "");
    }
    if (first || ours) blocks.push({ type, first, ours });
  });
  const webBlocks = blocks.filter((b) => b.type === "web");
  const ourAll = blocks.findIndex((b) => b.ours);
  const ourWeb = webBlocks.findIndex((b) => b.ours);
  return {
    ads,
    place,
    blockCount: blocks.length,
    ourBlockOrder: ourAll >= 0 ? ourAll + 1 : null,
    ourBlockType: ourAll >= 0 ? blocks[ourAll].type : null,
    ourWebOrder: ourWeb >= 0 ? ourWeb + 1 : null,
    ourUrls: [...new Set(blocks.filter((b) => b.ours).map((b) => b.ours))],
    above: ourAll >= 0 ? blocks.slice(0, ourAll).map((b) => `${b.type}:${b.first}`) : blocks.slice(0, 6).map((b) => `${b.type}:${b.first}`),
  };
}

if (import.meta.url === `file:///${process.argv[1].replace(/\\/g, "/")}` || process.argv[1]?.endsWith("naver-observe.mjs")) {
  const rows = [];
  let n = 0;
  for (const q of queries.map((x) => x.query)) {
    n++;
    const at = new Date().toLocaleString("sv-SE", { timeZone: "Asia/Seoul" });
    try {
      const res = await fetch(`https://search.naver.com/search.naver?where=nexearch&query=${encodeURIComponent(q)}`, { headers: { "user-agent": UA, "accept-language": "ko-KR" } });
      const h = await res.text();
      fs.writeFileSync(path.join(DIR, "serp", `${label}-${n}.html`), h);
      rows.push({ query: q, observedAtKST: at, device: "PC(UA)", login: "no", region: "요청 IP(부산 추정, 미검증)", status: res.status, ...parseSerp(h) });
    } catch (e) {
      rows.push({ query: q, observedAtKST: at, error: String(e.message) });
    }
    await sleep(4000);
  }
  fs.writeFileSync(path.join(DIR, `naver-observe-${label}.json`), JSON.stringify(rows, null, 1));
  for (const r of rows) {
    console.log(`${r.status ?? "ERR"} ${r.query} | block ${r.ourBlockOrder ?? "-"}/${r.blockCount ?? "-"} (${r.ourBlockType ?? "-"}) web#${r.ourWebOrder ?? "-"} ${r.ourUrls?.join(",") ?? ""} | place ${r.place ? (r.place.ourOrder ?? "미관측") + "/" + r.place.ids.length : "없음"}`);
  }
}
