#!/usr/bin/env node
/** keyword-map.csv 생성 + 기본 17·보호 14 검색어 누락 검사. 관측 안 된 값은 '미확인'으로 둔다. */
import fs from "node:fs";
import path from "node:path";

const DIR = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1"));
const facts = JSON.parse(fs.readFileSync(path.join(DIR, "seo-facts.json"), "utf8"));
const diff = JSON.parse(fs.readFileSync(path.join(DIR, "diff-baseline-after.json"), "utf8"));
const changed = new Set([...diff.main.map((m) => m.r), ...diff.links.map((l) => l.r)]);

const intent = {
  "부산 상속": "정보탐색+절차선택(등기/포기/한정승인)·관할·기한·비용",
  "부산 상속등기": "절차·서류·등기소·비용",
  "부산 상속포기": "3개월 기한·가정법원 신고·후순위",
  "부산 한정승인": "채무 한도 승인·신고·청산",
  "부산 특별한정승인": "기한 경과 후 채무초과 인지",
  "부산 법인설립": "설립등기 절차·정관·자본금(사업자등록·세무 일부 혼재)",
  "부산 법인등기": "설립·변경등기 갈림길",
  "부산 임원변경등기": "중임·변경 기한·서류",
  "부산 본점이전등기": "관할 이전·기한·서류",
  "부산 부동산등기": "등기 종류 선택·등기소",
  "부산 소유권이전등기": "매매·증여·상속 원인별 명의이전",
  "부산 증여등기": "증여 명의이전·취득세·서류",
  "부산 개인회생": "자격·절차·부산회생법원",
  "부산 개인파산": "자격·서류·면책·부산회생법원",
  "부산 공탁": "공탁 종류 선택(변제·집행·담보·형사)",
  "부산 지급명령": "신청 절차·관할 법원·서류",
  "부산 선박등기": "선박 등기·등록 구분",
};
const action = {
  "부산 상속": "본문 보강: 첫 답변(신청처·기한·비용 차이), 관할·기한 표(민법 1019·가사소송법 44①6·부동산등기법 7조의3·지방세법 20①), 사망 직후·가정법원·취득세 링크. title/H1 유지",
  "부산 특별한정승인": "/상속 허브에서 /특별한정승인 링크 추가, /부산상속법무사 관할·기한 표에 특별한정승인 기산점 명시. 부산 전용 신규 URL 미생성",
  "부산 개인파산": "/부산개인파산 '구·동 진입점' 문구를 시 단위 절차 안내로 정정(title/H1/도입), '부산 개인파산' 앵커 3곳을 /부산파산→/부산개인파산으로 정정",
  "부산 공탁": "/공탁채권회수 공탁 절차 목록에 /부산공탁 링크 추가",
  "부산 지급명령": "/민사소송의 '부산지방법원 지급명령 절차 안내' 앵커 목적지를 /부산지방법원법무사→/부산지방법원지급명령으로 정정",
  "부산 상속 법무사": "유지(title·H1·'부산 상속 법무사' 표현 보존). 같은 페이지 보강만",
  "부산 법무사 상속": "유지. 관측 노출 URL은 /상속(전국 허브)이며 역할 유지",
};
const csvCell = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
const rows = [["query", "intent", "owner", "existingLawyerQuery", "source", "observedSearch", "changeOrKeep", "validation", "unknowns"]];
for (const f of facts) {
  const lawyerQ = f.set === "protect14" ? "해당(보호 검색어)" : facts.find((x) => x.set === "protect14" && x.route === f.route)?.query ?? "없음/미확인";
  const obs = f.naverObserved
    ? `${f.naverObserved.atKST} KST·PC UA·비로그인·통합검색 HTML 1회: ${f.naverObserved.ourDomainOrder ? `외부도메인 등장순 ${f.naverObserved.ourDomainOrder}번째, 노출 URL ${f.naverObserved.ourUrl}` : "본 도메인 미검출"}`
    : "미관측";
  rows.push([
    f.query,
    intent[f.query] ?? (f.set === "protect14" ? "법무사 선택·의뢰" : ""),
    f.route,
    lawyerQ,
    `${f.source}; ${f.evidence}`,
    obs,
    action[f.query] ?? (changed.has(f.route) ? "대상 페이지 링크/본문 변경 있음" : "유지(변경 없음)"),
    `out/ 정적 HTML: ${f.response?.status === 200 || f.response == null ? "" : "운영 " + f.response.status + " "}robots=${f.robots}, canonical=${f.canonical}, sitemap=${f.inSitemap}, 비색인 내부 inbound=${f.inboundIndexable}`,
    f.unknowns.join(" / "),
  ]);
}
fs.writeFileSync(path.join(DIR, "keyword-map.csv"), "﻿" + rows.map((r) => r.map(csvCell).join(",")).join("\n"));
const queries = JSON.parse(fs.readFileSync(path.join(DIR, "queries.json"), "utf8"));
const got = new Set(rows.slice(1).map((r) => r[0]));
const base = queries.filter((q) => q.set === "base17").map((q) => q.query);
const prot = queries.filter((q) => q.set === "protect14").map((q) => q.query);
const miss = [...base, ...prot].filter((q) => !got.has(q));
console.log(`keyword-map rows=${rows.length - 1} base17=${base.filter((q) => got.has(q)).length}/17 protect14=${prot.filter((q) => got.has(q)).length}/14 missing=${miss.length}`);
if (base.length !== 17 || prot.length !== 14 || miss.length) process.exit(1);
