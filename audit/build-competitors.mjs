#!/usr/bin/env node
/**
 * serp-evidence.jsonl(웹문서 탭 상위 결과)에서 관찰된 상위 3개 결과만 모아 audit/competitors.csv를 만든다.
 *   node audit/build-competitors.mjs
 * - 관찰한 URL만 적는다(내용 평가·추정 없음). 업무×의도별로 자주 보인 도메인 최대 2개만 상세 행으로 남긴다.
 */
import fs from "node:fs";
import path from "node:path";

const DIR = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1"));
const OURS = /xn--2j1br1na42lvxja38mk8r\.kr|다옴법무사사무소\.kr/;

const parseCsv = (text) => {
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
};

const queries = new Map(parseCsv(fs.readFileSync(path.join(DIR, "queries.csv"), "utf8")).map((q) => [q.query_id, q]));
// 같은 id가 여러 번 기록됐으면 마지막 관찰을 쓴다
const evid = new Map();
for (const line of fs.readFileSync(path.join(DIR, "serp-evidence.jsonl"), "utf8").split("\n")) {
  if (!line.trim()) continue;
  try { const e = JSON.parse(line); evid.set(e.id, e); } catch {}
}

const groups = new Map(); // service|intent -> host -> {count, best, example}
for (const e of evid.values()) {
  const qid = e.id.replace(/-(pc|m)$/, "");
  const q = queries.get(qid);
  if (!q) continue;
  const key = `${q.service}|${q.intent}`;
  if (!groups.has(key)) groups.set(key, new Map());
  const g = groups.get(key);
  e.top.slice(0, 3).forEach((url, i) => {
    const host = url.split("/")[0];
    if (OURS.test(host)) return;
    const h = g.get(host) ?? { count: 0, best: 99, example: null };
    h.count++;
    if (i + 1 < h.best) { h.best = i + 1; h.example = { url, query: e.query, device: e.id.endsWith("-m") ? "mobile(UA)" : "pc(UA)", at: e.at }; }
    g.set(host, h);
  });
}

const head = ["service", "intent", "host", "top3_observations", "best_rank", "example_query", "example_url", "device", "observed_at_kst", "note"];
const rows = [];
for (const [key, g] of [...groups].sort()) {
  const [service, intent] = key.split("|");
  const top = [...g].sort((a, b) => b[1].count - a[1].count || a[1].best - b[1].best).slice(0, 2);
  for (const [host, h] of top) {
    rows.push({
      service, intent, host, top3_observations: h.count, best_rank: h.best,
      example_query: h.example.query, example_url: h.example.url, device: h.example.device, observed_at_kst: h.example.at,
      note: /blog\.naver|cafe\.naver|post\.naver|in\.naver/.test(host) ? "네이버 UGC(블로그·카페 등)" : "",
    });
  }
}
const esc = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
fs.writeFileSync(path.join(DIR, "competitors.csv"), "﻿" + [head.join(","), ...rows.map((r) => head.map((h) => esc(r[h])).join(","))].join("\n") + "\n");
console.log(`groups ${groups.size}, rows ${rows.length}, evidence ${evid.size}`);
