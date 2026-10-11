#!/usr/bin/env node
/**
 * 네이버 웹문서(where=web) 자연검색 순위 관찰 — PC, 비로그인, 이 PC의 접속 환경.
 *   node audit/naver-rank.mjs [--priority 1] [--limit N] [--mobile]
 * - 결과 항목(fds-web-doc-root) 단위로 1~15위, 미발견 시 16~30위까지 확인(사이트링크는 같은 항목으로 센다).
 * - 3초 간격, 재시도 없음. 차단·비정상 응답이 연속 2회면 즉시 중단하고 남은 질의는 UNCHECKED로 둔다.
 * - 결과는 audit/naver-ranks.csv에 누적(같은 query_id+device는 덮어씀), 근거는 audit/serp-evidence.jsonl.
 */
import fs from "node:fs";
import path from "node:path";

const DIR = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1"));
const OURS = /xn--2j1br1na42lvxja38mk8r\.kr|다옴법무사사무소\.kr/;
const args = process.argv.slice(2);
const arg = (k, d) => (args.includes(k) ? args[args.indexOf(k) + 1] : d);
const PRIORITY = arg("--priority", null);
const LIMIT = Number(arg("--limit", 9999));
const MOBILE = args.includes("--mobile");
const ONLY = arg("--only", null); // 쉼표로 구분한 query_id
const UA = MOBILE
  ? "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1"
  : "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130 Safari/537.36";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function parseCsv(text) {
  const rows = [];
  for (const line of text.replace(/^﻿/, "").trim().split(/\r?\n/)) {
    const cells = [];
    let cur = "", q = false;
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (q) { if (c === '"' && line[i + 1] === '"') { cur += '"'; i++; } else if (c === '"') q = false; else cur += c; }
      else if (c === '"') q = true; else if (c === ",") { cells.push(cur); cur = ""; } else cur += c;
    }
    cells.push(cur);
    rows.push(cells);
  }
  const [head, ...body] = rows;
  return body.map((r) => Object.fromEntries(head.map((h, i) => [h, r[i] ?? ""])));
}
const toCsv = (rows, head) =>
  "﻿" + [head.join(","), ...rows.map((r) => head.map((h) => (r[h] === null || r[h] === undefined ? "" : `"${String(r[h]).replace(/"/g, '""')}"`)).join(","))].join("\n") + "\n";

function items(html) {
  const parts = html.split(/fds-web-doc-root/).slice(1);
  return parts.map((seg) => {
    for (const m of seg.matchAll(/href="(https?:\/\/[^"]+)"/g)) {
      try {
        const u = new URL(m[1].replace(/&amp;/g, "&"));
        if (/(^|\.)naver\.(com|net)$|pstatic|navercorp/.test(u.hostname) && !/^(m\.)?(blog|cafe|post|in)\.naver\.com$/.test(u.hostname)) continue;
        let p = u.pathname;
        try { p = decodeURI(p); } catch {}
        return { host: u.hostname, url: u.hostname + p };
      } catch {}
    }
    return null;
  }).filter(Boolean);
}

function blocked(status, html) {
  // 정상 페이지 스크립트에도 'captchaApi' 설정이 있어 단어만으로 판정하지 않는다: 상태코드·차단 안내 문구·결과 영역 유무로 판정
  if (status !== 200 || html.length < 20000) return true;
  if (/자동입력 방지|비정상적인 (검색|접근)|보안문자/.test(html)) return true;
  return !/data-block-id=|fds-web-doc-root|검색결과가 없습니다/.test(html);
}

async function fetchPage(query, start) {
  const base = MOBILE ? "https://m.search.naver.com/search.naver?where=m_web" : "https://search.naver.com/search.naver?where=web";
  const res = await fetch(`${base}&query=${encodeURIComponent(query)}&start=${start}`, { headers: { "user-agent": UA, "accept-language": "ko-KR" } });
  return { status: res.status, html: await res.text() };
}

const queries = parseCsv(fs.readFileSync(path.join(DIR, "queries.csv"), "utf8"));
const outPath = path.join(DIR, "naver-ranks.csv");
const HEAD = ["query_id", "query", "region_id", "region_label", "service", "intent", "target_url", "observed_url", "device", "checked_at_kst", "environment", "block_type", "web_rank", "block_position", "depth", "status", "evidence_ref", "source_method", "reason", "priority"];
const existing = fs.existsSync(outPath) ? parseCsv(fs.readFileSync(outPath, "utf8")) : [];
const byKey = new Map(existing.map((r) => [`${r.query_id}|${r.device}`, r]));
const device = MOBILE ? "mobile(UA)" : "pc(UA)";

let todo = queries.filter((q) => (!PRIORITY || q.priority === PRIORITY) && (!ONLY || ONLY.split(",").includes(q.query_id)));
todo = todo.filter((q) => !byKey.has(`${q.query_id}|${device}`) || byKey.get(`${q.query_id}|${device}`).status === "UNCHECKED").slice(0, LIMIT);
const evid = fs.createWriteStream(path.join(DIR, "serp-evidence.jsonl"), { flags: "a" });
let consecutiveBlock = 0, done = 0, stopped = false;

for (const q of todo) {
  const at = new Date().toLocaleString("sv-SE", { timeZone: "Asia/Seoul" });
  const row = { ...q, observed_url: "", device, checked_at_kst: at, environment: "비로그인·이 PC 네트워크(지역 개인화 미통제)", block_type: "web(웹문서 탭)", web_rank: "", block_position: "", depth: "", status: "UNCHECKED", evidence_ref: "", source_method: MOBILE ? "m.search.naver.com where=m_web" : "search.naver.com where=web", reason: "", priority: q.priority };
  if (stopped) { byKey.set(`${q.query_id}|${device}`, row); continue; }
  try {
    let all = [];
    let rank = null;
    for (const start of [1, 16]) {
      const { status, html } = await fetchPage(q.query, start);
      if (blocked(status, html)) {
        consecutiveBlock++;
        row.status = "BLOCKED";
        row.reason = `status ${status}, len ${html.length}`;
        break;
      }
      consecutiveBlock = 0;
      const page = items(html);
      if (!page.length && start === 1) { row.status = "UNPARSEABLE"; row.reason = "결과 항목 0"; break; }
      all = all.concat(page);
      const idx = all.findIndex((i) => OURS.test(i.host));
      if (idx >= 0) { rank = idx + 1; break; }
      if (page.length < 10) break; // 결과가 더 없음
      await sleep(3000);
    }
    if (row.status === "UNCHECKED") {
      row.depth = String(all.length);
      if (rank) {
        row.web_rank = String(rank);
        row.observed_url = all[rank - 1].url.replace(/^[^/]+/, "");
        row.status = rank <= 3 ? "TOP3" : "BELOW3";
      } else {
        row.status = "NOT_FOUND_WITHIN_DEPTH";
        row.web_rank = "";
      }
      row.evidence_ref = `serp-evidence.jsonl#${q.query_id}-${MOBILE ? "m" : "pc"}`;
      evid.write(JSON.stringify({ id: `${q.query_id}-${MOBILE ? "m" : "pc"}`, query: q.query, at, top: all.slice(0, 5).map((i) => i.url), ours: all.filter((i) => OURS.test(i.host)).map((i) => i.url) }) + "\n");
    }
  } catch (e) {
    row.status = "BLOCKED";
    row.reason = String(e.message).slice(0, 80);
    consecutiveBlock++;
  }
  byKey.set(`${q.query_id}|${device}`, row);
  done++;
  if (consecutiveBlock >= 2) {
    stopped = true;
    console.log("차단 또는 비정상 응답이 연속돼 중단합니다:", row.reason);
  }
  if (done % 20 === 0) {
    fs.writeFileSync(outPath, toCsv([...byKey.values()], HEAD));
    console.log(`${done}/${todo.length}`);
  }
  await sleep(3000);
}
fs.writeFileSync(outPath, toCsv([...byKey.values()], HEAD));
evid.end();
const rows = [...byKey.values()].filter((r) => r.device === device);
const count = (s) => rows.filter((r) => r.status === s).length;
console.log(`${device} TOP3 ${count("TOP3")} BELOW3 ${count("BELOW3")} NOT_FOUND ${count("NOT_FOUND_WITHIN_DEPTH")} BLOCKED ${count("BLOCKED")} UNPARSEABLE ${count("UNPARSEABLE")} UNCHECKED ${count("UNCHECKED")}`);
