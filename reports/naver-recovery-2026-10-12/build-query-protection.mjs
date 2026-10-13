#!/usr/bin/env node
/**
 * query-protection.csv 생성: 검색어 → 대표 URL, 10-12 관측, 빌드 메타(현재 out/)와 수정 전 스냅샷(naver-before) 비교.
 * 같은 URL은 한 번만 파싱한다. 관측 값은 serp-observations.csv(담당 4, 1회 PC 비로그인)에서 읽는다.
 */
import fs from "node:fs";
import path from "node:path";
import { parsePage } from "../../scripts/lib/seo-recovery/scan-out.mjs";

const DIR = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1"));
const ROOT = path.resolve(DIR, "../..");

// 검색어 | 검색 의도 | 기존 대표 URL (출처: page-relations.ts, keyword-map-14.csv, naver-7kw REPORT)
const MAP = [
  ["부산 법무사", "사무소·담당자 선택(브랜드·위치)", "/"],
  ["부산법무사", "사무소·담당자 선택(붙여쓰기)", "/"],
  ["부산 법무사 추천", "선택 기준", "/부산법무사추천"],
  ["부산 법무사 상담", "연락 방법·상담 준비", "/부산법무사상담"],
  ["부산 법인전문 법무사", "법인 업무 범위 확인", "/부산법인법무사"],
  ["부산 법인 법무사", "법인 업무 종합(설립·변경·해산)", "/부산법인법무사"],
  ["부산 법인설립 법무사", "설립 준비(정관·자본금·임원)", "/부산법인설립등기"],
  ["부산 법인등기 법무사", "운영 중 변경등기", "/부산법인등기"],
  ["부산 상속 법무사", "상속 절차 선택(등기·포기·한정승인)", "/부산상속법무사"],
  ["부산 상속전문 법무사", "법무사 선택 기준(상속)", "/부산상속전문법무사"],
  ["부산 상속포기 법무사", "3개월 기한·가정법원 신고", "/부산상속포기"],
  ["부산 한정승인 법무사", "상속재산 한도 변제", "/부산한정승인"],
  ["부산 법무사 상속", "상속 절차 선택(어순 변형)", "/부산상속법무사"],
  ["부산 등기 법무사", "등기 종류 선택", "/부산등기법무사"],
  ["부산 등기전문 법무사", "등기 종류 선택+업무 범위", "/부산등기법무사"],
  ["부산 공탁 법무사", "변제·형사·집행 공탁", "/부산공탁"],
  ["부산 기관 법무사", "기관 등기 업무(의도 미확정)", "/공공기관등기업무"],
  ["부산 법률상담", "공공 무료상담 vs 법무사 상담 구분", "/부산법률상담"],
  ["부산 상속", "상속 정보 탐색", "/부산상속법무사"],
  ["부산 상속포기", "상속포기 절차·기한", "/부산상속포기"],
  ["부산 한정승인", "한정승인 절차", "/부산한정승인"],
  ["부산 법인설립", "법인설립 절차", "/부산법인설립등기"],
  ["부산 법인등기", "법인 변경등기", "/부산법인등기"],
  ["부산 등기", "등기 정보 탐색", "/부산등기법무사"],
  ["부산 개인회생 법무사", "개인회생 신청", "/부산개인회생법무사"],
  ["부산 개인파산", "개인파산 신청", "/부산개인파산"],
  ["부산 지급명령", "지급명령 신청(부산지방법원)", "/부산지방법원지급명령"],
  ["부산 임차권등기명령", "임차권등기명령", "/부산임차권등기명령"],
  ["부산 전세보증금 반환 법무사", "보증금 반환", "/부산전세보증금반환법무사"],
  ["부산 공탁", "공탁 절차", "/부산공탁"],
  ["상속포기 비대면 법무사", "전국 비대면 상속포기", "/전국상속등기"],
];

function csvRows(text) {
  return text.replace(/^﻿/, "").split(/\r?\n/).filter(Boolean).map((l) => [...l.matchAll(/"((?:[^"]|"")*)"/g)].map((m) => m[1].replace(/""/g, '"')));
}
const obs = csvRows(fs.readFileSync(path.join(DIR, "serp-observations.csv"), "utf8")).slice(1);
const before = JSON.parse(fs.readFileSync(path.join(ROOT, "reports/google-index-2026-10-11/protect/naver-before.json"), "utf8"));
const beforePages = before.pages ?? before;
const after = JSON.parse(fs.readFileSync(path.join(ROOT, "reports/google-index-2026-10-11/protect/naver-after.json"), "utf8"));
const afterPages = after.pages;

const cache = new Map();
function meta(route) {
  if (cache.has(route)) return cache.get(route);
  const f = route === "/" ? "index.html" : `${route.slice(1)}.html`;
  const file = path.join(ROOT, "out", f);
  const m = fs.existsSync(file) ? parsePage(fs.readFileSync(file, "utf8")) : null;
  cache.set(route, m);
  return m;
}
const q = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
const header = ["검색어", "검색 의도", "기존 대표 URL", "웹문서 관측(블록 내 순서·노출 URL)", "플레이스 관측(비광고)", "데이터 날짜·출처", "title", "H1", "canonical", "index 정책", "변경 여부", "회귀 검사"];
const lines = [header.map(q).join(",")];
for (const [query, intent, url] of MAP) {
  const rows = obs.filter((r) => r[1] === query);
  const web = rows.find((r) => r[6].startsWith("웹문서"));
  const place = rows.find((r) => r[6].startsWith("플레이스"));
  const webText = web ? (web[8] ? `#${web[7]} ${web[8].split(" ")[0]}` : web[7]) : "미관측(관측 목록 밖)";
  const placeText = place ? place[7] : "미관측";
  const m = meta(url);
  const b = beforePages[url];
  const a = afterPages[url];
  const titleSame = b && a ? b.title === a.title : null;
  const h1Same = b && a ? JSON.stringify(b.h1) === JSON.stringify(a.h1) : null;
  const canonSame = b && a ? b.canonical === a.canonical : null;
  const robotsSame = b && a ? b.robots === a.robots : null;
  const changed = b ? (titleSame && h1Same && canonSame && robotsSame ? "메타 변경 없음" : "메타 변경 있음 — 확인 필요") : "스냅샷 없음";
  lines.push([
    query, intent, url, webText, placeText,
    web ? `${web[0]} KST PC 비로그인 1회(serp-observations.csv)` : "미확인",
    m?.title, (m?.h1s || []).join(" / "), m?.canonical, m?.robots,
    changed,
    `protect-snapshot diff naver-before→naver-after: title ${titleSame} · H1 ${h1Same} · canonical ${canonSame} · robots ${robotsSame}`,
  ].map(q).join(","));
}
fs.writeFileSync(path.join(DIR, "query-protection.csv"), "﻿" + lines.join("\n") + "\n");
console.log(`rows ${MAP.length}`);
