#!/usr/bin/env node
/** query-map.csv(12) · protected-urls.csv · image-map.csv 생성. 스냅샷 12kw-before → 12kw-final 비교. */
import fs from "node:fs";
import path from "node:path";

const DIR = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1"));
const ROOT = path.resolve(DIR, "../..");
const snap = (n) => JSON.parse(fs.readFileSync(path.join(ROOT, `reports/google-index-2026-10-11/protect/${n}.json`), "utf8")).pages;
const before = snap("12kw-before");
const after = snap("12kw-final");
const q = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;

function parseCsv(file) {
  const text = fs.readFileSync(file, "utf8").replace(/^﻿/, "");
  const rows = [];
  let row = [], cur = "", inQ = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQ) {
      if (c === '"' && text[i + 1] === '"') { cur += '"'; i++; } else if (c === '"') inQ = false; else cur += c;
    } else if (c === '"') inQ = true;
    else if (c === ",") { row.push(cur); cur = ""; }
    else if (c === "\n" || c === "\r") { if (c === "\r" && text[i + 1] === "\n") i++; row.push(cur); cur = ""; if (row.some(Boolean)) rows.push(row); row = []; }
    else cur += c;
  }
  if (cur || row.length) { row.push(cur); rows.push(row); }
  const [h, ...rest] = rows;
  return rest.map((r) => Object.fromEntries(h.map((k, i) => [k, r[i] ?? ""])));
}
const obs = parseCsv(path.join(DIR, "serp-observations.csv"));
const wrong = Object.fromEntries(parseCsv(path.join(DIR, "wrong-result-cases.csv")).map((r) => [r.keyword, r]));

function diffFields(url) {
  const b = before[url], a = after[url];
  if (!b || !a) return "스냅샷 없음";
  const fields = ["title", "description", "h1", "canonical", "robots", "ogImage", "jsonld", "linksHash"].filter(
    (k) => JSON.stringify(b[k]) !== JSON.stringify(a[k]),
  );
  return fields.length ? fields.join(",") : "변화 없음";
}

const MAP = [
  ["부산 법무사 추천", "법무사 선택 기준(담당·비용 구분·업무 범위)", "/부산법무사추천", "텍스트 카드 1(본문, 공유용)"],
  ["부산 법무사 상담", "연락·상담 준비·의뢰 시작", "/부산법무사상담", "텍스트 카드 1(본문)"],
  ["부산 법무사 사무소", "실제 사무소·대표·위치", "/", "텍스트 카드 1(오시는 길), ItemList @id·name"],
  ["부산 상속", "상속 업무 분기(법무사 범위)", "/부산상속법무사", "텍스트 카드 1(본문)"],
  ["부산 상속 법무사", "상속 업무 분기·수임 시작", "/부산상속법무사", "텍스트 카드 1(본문)"],
  ["부산 법무사 상속", "상속 업무 분기(어순)", "/부산상속법무사", "텍스트 카드 1(본문)"],
  ["부산 상속전문 법무사", "업무 범위·검토 경험", "/부산상속전문법무사", "텍스트 카드 1(본문)"],
  ["부산 등기 법무사", "등기 유형·실행", "/부산등기법무사", "텍스트 카드 1, 임원 FAQ 기한 기산점 정정"],
  ["부산 등기전문 법무사", "등기 유형·업무 범위", "/부산등기법무사", "(/부산등기전문법무사 noindex 정책 유지)"],
  ["부산 법인전문 법무사", "법인 담당 선택·실무", "/부산법인법무사", "(/부산법인전문법무사 noindex→/부산법인등기 유지)"],
  ["부산 법인등기 법무사", "설립·임원·본점·목적 실행 분기", "/부산법인등기", "대표 사진 분리, 임원 FAQ 기한·오타 정정, 텍스트 카드 1"],
  ["부산 법인 법무사", "회사 업무·담당 선택", "/부산법인법무사", "title 어순(홈과 첫머리 분리), 법무사 의견 법인 전용, 범위표 표기, 내부 메모 제거, 하단 중복 캐러셀·ItemList 제거, 텍스트 카드 1"],
];

const lines = [["query", "의도", "expectedURL", "actualURL(10-13 22:11 PC 비로그인)", "검색 영역·순위", "분류", "날짜·근거", "허용 변경", "검사(12kw-before→final 변경 필드)"].map(q).join(",")];
for (const [query, intent, url, allowed] of MAP) {
  const mine = obs.filter((r) => r.keyword === query);
  // 웹문서 블록 중 우리 도메인 행만(경쟁 행 제외)
  const web = mine.find((r) => /웹문서/.test(r.block) && /다옴/.test(r.block));
  const place = mine.find((r) => /플레이스/.test(r.block));
  const ownPath = web ? decodeURI("/" + web.url.split("/").slice(1).join("/")).replace(/\/$/, "") || "/" : "";
  const actual = wrong[query]?.actual || (web ? ownPath : "확인 범위 내 미발견");
  const area = [web ? `웹 ${web.position_in_block}` : "웹 미발견", place ? `플레이스 ${place.position_in_block}` : ""].filter(Boolean).join(" / ");
  const cls = wrong[query]?.class || (web && ownPath === url ? "정상(기대 URL)" : "-");
  lines.push([query, intent, url, actual, area, cls, `${mine[0]?.kst || "미확인"} · serp-observations.csv`, allowed, diffFields(url)].map(q).join(","));
}
fs.writeFileSync(path.join(DIR, "query-map.csv"), "﻿" + lines.join("\n") + "\n");

const PROTECT = [
  ["부산 법무사", "/"], ["부산법무사", "/"], ["부산 상속포기 법무사", "/부산상속포기"], ["부산 한정승인 법무사", "/부산한정승인"],
  ["부산 상속등기", "/부산상속등기"], ["부산 법인설립 법무사", "/부산법인설립등기"], ["부산 공탁 법무사", "/부산공탁"],
  ["부산 개인회생 법무사", "/부산개인회생법무사"], ["부산 개인파산", "/부산개인파산"], ["부산 지급명령", "/부산지방법원지급명령"],
  ["부산 임차권등기명령", "/부산임차권등기명령"], ["부산 전세보증금 반환 법무사", "/부산전세보증금반환법무사"],
  ["상속포기 비대면 법무사", "/전국상속등기"], ["상속 종합", "/상속"], ["부산 법무사(업무 허브)", "/부산법무사"],
];
const p2 = [["검색어", "URL", "title(after)", "robots(after)", "canonical 동일", "변경 필드"].map(q).join(",")];
for (const [query, url] of PROTECT) {
  const a = after[url], b = before[url];
  p2.push([query, url, a?.title, a?.robots, b && a ? b.canonical === a.canonical : "?", diffFields(url)].map(q).join(","));
}
fs.writeFileSync(path.join(DIR, "protected-urls.csv"), "﻿" + p2.join("\n") + "\n");

const cards = JSON.parse(fs.readFileSync(path.join(DIR, "cards/src/cards.json"), "utf8"));
const usage = {
  "office-visit": ["/"], "consult-prep": ["/부산법무사상담"], "select-criteria": ["/부산법무사추천"],
  "inheritance-start": ["/부산상속법무사", "/부산상속전문법무사"], "registry-check": ["/부산등기법무사"],
  "corporate-change": ["/부산법인등기", "/법인등기"], "officer-deadline": ["/부산법인법무사"],
};
const p3 = [["image", "type", "source_photo", "title_in_image", "size", "bytes", "used_on", "role", "edit_source"].map(q).join(",")];
for (const r of cards.results) {
  const c = cards.cards.find((x) => x.id === r.id);
  p3.push([`/${r.file.replace(/^public\//, "")}`, "텍스트 카드(본문·공유)", `public/image/${r.photo}`, c.title.join(" "), cards.size, r.bytes, usage[r.id].join(" "), "본문 figure + figcaption(HTML 동일 문구). OG·primaryImageOfPage 아님", `reports/naver-12kw-2026-10-13/cards/src/${r.id}.svg`].map(q).join(","));
}
p3.push(["/generated/serp/corporate/busan-corporate-registration.jpg", "검색 대표(무텍스트)", "public/image/썸네일-사무실_겨울 (4).jpg (portrait-corporate-02)", "", "1200x630", fs.statSync(path.join(ROOT, "public/generated/serp/corporate/busan-corporate-registration.jpg")).size, "/부산법인등기", "og:image·primaryImageOfPage(법인 3페이지 같은 원본 → 분리)", "scripts/generate-representative-images.ts"].map(q).join(","));
p3.push(["/image/썸네일-등기운영과.jpg (og 파생 /_img/...og.jpg)", "검색 대표(무텍스트)", "public/image/썸네일-등기운영과.jpg", "", "3000x2250 원본", "", "/법인등기", "field-photo-visuals: 본문 대표 그림·og:image·primaryImageOfPage", "src/data/seo/field-photo-visuals.ts"].map(q).join(","));
fs.writeFileSync(path.join(DIR, "image-map.csv"), "﻿" + p3.join("\n") + "\n");
console.log("query-map", MAP.length, "protected", PROTECT.length, "images", cards.results.length + 2);
