#!/usr/bin/env node
/**
 * inheritance-query-map.csv(상속 7개) + protection-map.csv(보호 검색어) 생성.
 * 관측: serp-observations.csv(① 10-12 23:0x) 우선, 없으면 ../naver-recovery-2026-10-12/serp-observations.csv(10-12 22:0x).
 * 메타 비교: protect 스냅샷 inh-before → inh-after (title·H1·canonical·robots).
 */
import fs from "node:fs";
import path from "node:path";

const DIR = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1"));
const ROOT = path.resolve(DIR, "../..");
const snap = (n) => JSON.parse(fs.readFileSync(path.join(ROOT, `reports/google-index-2026-10-11/protect/${n}.json`), "utf8")).pages;
const before = snap("inh-before");
const after = snap("inh-after");

function csvRows(file) {
  if (!fs.existsSync(file)) return [];
  const text = fs.readFileSync(file, "utf8").replace(/^﻿/, "");
  const rows = [];
  let row = [], cur = "", q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"' && text[i + 1] === '"') { cur += '"'; i++; }
      else if (c === '"') q = false;
      else cur += c;
    } else if (c === '"') q = true;
    else if (c === ",") { row.push(cur); cur = ""; }
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(cur); cur = "";
      if (row.some((v) => v !== "")) rows.push(row);
      row = [];
    } else cur += c;
  }
  if (cur || row.length) { row.push(cur); rows.push(row); }
  return rows;
}
function obsTable(file) {
  const rows = csvRows(file);
  if (!rows.length) return [];
  const h = rows[0];
  return rows.slice(1).map((r) => Object.fromEntries(h.map((k, i) => [k, r[i] ?? ""])));
}
const obsInh = obsTable(path.join(DIR, "serp-observations.csv"));
const obsPrev = obsTable(path.join(ROOT, "reports/naver-recovery-2026-10-12/serp-observations.csv"));

function observe(query) {
  for (const [rows, src] of [[obsInh, "serp-observations.csv(① 10-12 23:0x)"], [obsPrev, "naver-recovery serp-observations.csv(10-12 22:0x)"]]) {
    const mine = rows.filter((r) => r.query === query);
    if (!mine.length) continue;
    const web = mine.find((r) => /웹/.test(r.block));
    const place = mine.find((r) => /플레이스/.test(r.block));
    const url = web ? (web.url || web.our_url || "").split(" ")[0] : "";
    const webText = web ? (url ? `웹 ${web.order_in_block} ${url}` : `웹 ${web.order_in_block}`) : "웹 미관측";
    const placeText = place ? `플레이스 ${place.order_in_block}` : "플레이스 미관측";
    return { text: `${webText} / ${placeText}`, date: `${mine[0].kst_datetime} KST PC 비로그인`, src, url };
  }
  return { text: "미관측", date: "미확인", src: "-", url: "" };
}

function check(url) {
  const b = before[url], a = after[url];
  if (!b || !a) return { meta: "스냅샷 없음", ok: false };
  const same = (k) => JSON.stringify(b[k]) === JSON.stringify(a[k]);
  const fields = ["title", "h1", "canonical", "robots", "description"].filter((k) => !same(k));
  return { meta: `title ${a.title} | H1 ${(a.h1 || []).join(" / ")} | robots ${a.robots}`, changed: fields, ok: true };
}
const q = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;

const INH = [
  ["부산 상속", "상속 절차 탐색(분쟁·세무 혼재 가능, 법무사 범위=등기·신청서류·채무 상속 상담)", "/부산상속법무사"],
  ["부산 상속전문 법무사", "법무사 선택 기준·업무 범위", "/부산상속전문법무사"],
  ["부산 상속포기 법무사", "3개월 기한·후순위·가정법원 신고", "/부산상속포기"],
  ["부산 상속 법무사", "등기·포기·한정승인 절차 선택", "/부산상속법무사"],
  ["부산 상속법무사", "등기·포기·한정승인 절차 선택(붙여쓰기)", "/부산상속법무사"],
  ["부산 법무사 상속", "등기·포기·한정승인 절차 선택(어순)", "/부산상속법무사"],
  ["부산 상속법무사 추천", "상담·견적·수임 범위 비교", "/부산상속법무사추천"],
];
const CHANGED_URLS = {
  "/부산상속법무사추천": "본문(FAQ·절차·실수·준비서류·도입·하단 안내) 상속 분기",
  "/부산상속법무사": "선택 카드 2개 추가(/부산재상속등기, /부산상속법무사추천)",
  "/부산상속포기": "본문 첫 상담 안내 문구·상담 분야 기본값",
  "/부산상속전문법무사": "본문 첫 상담 안내 문구·상담 분야 기본값",
  "/상속": "소개 1문장(SEO 내부 표현 제거)",
};

const head1 = ["query", "의도", "기존 대표 후보", "기존 유입 URL(관측)", "관측 영역·순위", "자료 날짜", "수정 URL", "허용 변경", "검사 결과"];
const lines1 = [head1.map(q).join(",")];
for (const [query, intent, rep] of INH) {
  const o = observe(query);
  const c = check(rep);
  const fieldChange = c.changed?.length ? `메타 변경: ${c.changed.join(",")}` : "title·H1·canonical·robots·description 변경 0";
  lines1.push([query, intent, rep, o.url || "확인 범위 내 미발견", o.text, `${o.date} · ${o.src}`,
    CHANGED_URLS[rep] ? rep : "없음(대표 URL 본문 유지)", CHANGED_URLS[rep] ?? "없음", `${fieldChange} | ${c.meta}`].map(q).join(","));
}
fs.writeFileSync(path.join(DIR, "inheritance-query-map.csv"), "﻿" + lines1.join("\n") + "\n");

const PROTECT = [
  ["부산 법무사", "/"], ["부산법무사", "/"], ["부산 법무사 추천", "/부산법무사추천"], ["부산 법무사 상담", "/부산법무사상담"],
  ["부산 법인전문 법무사", "/부산법인법무사"], ["부산 법인 법무사", "/부산법인법무사"], ["부산 법인설립 법무사", "/부산법인설립등기"], ["부산 법인등기 법무사", "/부산법인등기"],
  ["부산 상속등기", "/부산상속등기"], ["부산 상속등기 법무사", "/부산상속등기"], ["부산 한정승인", "/부산한정승인"], ["부산 한정승인 법무사", "/부산한정승인"],
  ["부산 등기 법무사", "/부산등기법무사"], ["부산 등기전문 법무사", "/부산등기법무사"], ["부산 공탁 법무사", "/부산공탁"],
  ["부산 개인회생 법무사", "/부산개인회생법무사"], ["부산 개인파산", "/부산개인파산"], ["부산 지급명령", "/부산지방법원지급명령"],
  ["부산 임차권등기명령", "/부산임차권등기명령"], ["부산 전세보증금 반환 법무사", "/부산전세보증금반환법무사"], ["상속포기 비대면 법무사", "/전국상속등기"],
];
const head2 = ["검색어", "대표 URL", "관측", "자료 날짜", "title·H1·robots(수정 후)", "inh-before→inh-after 메타 변화"];
const lines2 = [head2.map(q).join(",")];
for (const [query, url] of PROTECT) {
  const o = observe(query);
  const c = check(url);
  lines2.push([query, url, o.text, `${o.date} · ${o.src}`, c.meta, c.changed?.length ? c.changed.join(",") : "0"].map(q).join(","));
}
fs.writeFileSync(path.join(DIR, "protection-map.csv"), "﻿" + lines2.join("\n") + "\n");
console.log(`inheritance rows ${INH.length}, protection rows ${PROTECT.length}`);
