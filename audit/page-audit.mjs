#!/usr/bin/env node
/**
 * out/ 공개 HTML 전수 감사 → audit/page-audit.csv (문제 있는 행 + 지역·업무 경로 전체).
 *   node audit/page-audit.mjs
 * 검사: title/canonical/robots/H1/본문 길이/링크 수, 제목-본문 불일치(키워드 규칙), 개발 문구 노출,
 * 로딩 문구만 있는 초기 HTML, '필요 서류' 제목 아래 상담 기초정보.
 */
import fs from "node:fs";
import path from "node:path";
import { parsePage } from "../scripts/lib/seo-recovery/scan-out.mjs";

const ROOT = path.join(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1")), "..");
const OUT = path.join(ROOT, "out");
const clean = (s) => s.replace(/<[^>]+>/g, " ").replace(/&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, "&").replace(/\s+/g, " ").trim();

// 제목 키워드 → 바로 아래 본문에 하나라도 있어야 하는 단어
const RULES = [
  [/협의분할|법정지분/, /협의|지분|분할/],
  [/취득세|국민주택채권|수수료|보수|공과금|비용/, /비용|보수|세|공과금|수수료|채권|금액|견적/],
  [/원본/, /원본|인감|서명|우편|방문/],
  [/방문/, /방문|사무소|이동|오시/],
  [/사진|비대면|우편/, /사진|비대면|우편|파일|화상|원격|전화|카카오톡|보내/],
  [/관할/, /관할|등기소|법원|특례/],
  [/해외/, /해외|외국|재외|공관|아포스티유/],
  [/지점|사무소 위치/, /지점|사무소|해운대/],
];
const DEV = /doorway|흡수합니다|URL[은을] (만들지|늘리지|새로)|전용 URL|분기용|신규 페이지 대신|검색·안내용|\(기존 안내\)/;
const CONSULT_INFO = /소재 지역|거주 지역|인원 수|관련 인원/;

const files = [];
const walk = (d) => {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const f = path.join(d, e.name);
    if (e.isDirectory()) { if (!e.name.startsWith("_")) walk(f); }
    else if (e.name.endsWith(".html")) files.push(f);
  }
};
walk(OUT);

const rows = [];
const counts = {};
for (const f of files) {
  let route = "/" + path.relative(OUT, f).split(path.sep).join("/").replace(/\.html$/, "").replace(/(^|\/)index$/, "");
  if (route === "/") route = "/";
  const html = fs.readFileSync(f, "utf8");
  const meta = parsePage(html);
  const main = (html.match(/<main[\s\S]*<\/main>/) || [""])[0].replace(/<script[\s\S]*?<\/script>/g, "");
  const issues = [];
  for (const m of main.matchAll(/<h([23])\b[^>]*>([\s\S]*?)<\/h\1>([\s\S]{0,2500}?)(?=<h[23]\b|$)/g)) {
    const title = clean(m[2]);
    const body = clean(m[3]).slice(0, 400);
    if (!body || title.length > 40 || /요소$/.test(title)) continue;
    for (const [tr, br] of RULES) {
      if (tr.test(title) && !br.test(body)) { issues.push(`heading-body:${title}`); break; }
    }
    if (/^필요 서류$/.test(title) && CONSULT_INFO.test(body)) issues.push("docs-has-consult-info");
  }
  const text = clean(main);
  if (DEV.test(text)) issues.push("dev-text");
  if (/목록 준비 중|불러오는 중/.test(text)) issues.push("loading-placeholder");
  if (text.length < 300 && !/404/.test(route)) issues.push("thin-main");
  for (const i of issues) counts[i.split(":")[0]] = (counts[i.split(":")[0]] || 0) + 1;
  const isRegional = route.startsWith("/업무사례/") || /^\/(전국|여러지역|해외)/.test(route);
  if (issues.length || isRegional) {
    rows.push({ route, title: meta.title, h1: (meta.h1s || []).join(" / "), canonical_self: meta.canonical ? decodeURI(meta.canonical).endsWith(route) || route === "/" : "", robots: meta.robots, main_len: text.length, issues: issues.join(" | ") });
  }
}
const head = ["route", "title", "h1", "canonical_self", "robots", "main_len", "issues"];
fs.writeFileSync(path.join(ROOT, "audit", "page-audit.csv"), "﻿" + [head.join(","), ...rows.map((r) => head.map((h) => `"${String(r[h] ?? "").replace(/"/g, '""')}"`).join(","))].join("\n") + "\n");
console.log(`pages ${files.length}, rows ${rows.length}`, JSON.stringify(counts));
const examples = rows.filter((r) => r.issues).slice(0, 2);
for (const e of examples) console.log("예:", e.route, e.issues.slice(0, 120));
