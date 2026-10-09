#!/usr/bin/env node
/**
 * 필수 14개 관리표(keyword-map-14.csv)·추가 후보표(extra-candidates.csv)·seo-facts.json 생성.
 * 문자열 출현 / 기술적 색인 가능성 / 실제 검색 관측을 별도 열로 둔다. 관측 없는 값은 '미확인'.
 */
import fs from "node:fs";
import path from "node:path";

const DIR = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1"));
const j = (f) => JSON.parse(fs.readFileSync(path.join(DIR, f), "utf8"));
const REQUIRED = [
  "부산 법인전문 법무사", "부산 법인 법무사", "부산 법인설립 법무사", "부산 법인등기 법무사",
  "부산 상속 법무사", "부산 상속전문 법무사", "부산 상속포기 법무사", "부산 한정승인 법무사",
  "부산 법무사 상속", "부산 등기 법무사", "부산 등기전문 법무사",
  "부산 법무사", "부산 법무사 추천", "부산 법무사 상담",
];
const targets = j("targets.json");
const after = j("after.json");
const audit = j("audit-after.json");
const live = Object.fromEntries(j("live-live.json").map((r) => [r.path, r]));
const obs = Object.fromEntries([...j("../seo-recovery-2026-10-09/naver-observe-before.json"), ...j("naver-observe-extra13.json")].map((r) => [r.query, r]));
const diff = j("diff-before-after.json");
const changedNow = new Set([...diff.main.map((m) => m.r), ...diff.links.map((l) => l.r)]);
const changedPrev = new Set(["/부산상속법무사", "/부산개인파산", "/부산파산", "/민사소송", "/공탁채권회수", "/상속"]); // ca045b8, 미배포

const D = {
  "부산 법인전문 법무사": { intent: "법인 업무 범위 확인 후 설립/변경 갈림길", owner: "/부산법인등기", src: "src/lib/local-landing/config.ts; seo/index-policy.json:10,77", why: "후보 /부산법인법무사와 다름. 기존 /부산법인전문법무사가 noindex+canonical→/부산법인등기(2026-09-22 정책)이고, /부산법인등기 본문에 '법인전문 법무사를 찾는 대표자가 먼저 확인할 등기사항'과 공인 자격 비표방 문구가 있음. canonical 변경 금지에 따라 유지" },
  "부산 법인 법무사": { intent: "법인 업무 종합 선택(설립·변경·해산)", owner: "/부산법인법무사", src: "src/lib/local-landing/keyword-topics.ts; keyword-builder.ts(isCorporateLegalOps)", why: "유지. title에 '부산 법무사 법인'. 관측 노출은 홈(/)" },
  "부산 법인설립 법무사": { intent: "설립 초기 준비(정관·자본금·임원)", owner: "/부산법인설립등기", src: "src/lib/local-landing/config.ts", why: "유지. 관측 노출 URL 일치" },
  "부산 법인등기 법무사": { intent: "운영 중 변경등기(임원·본점·목적)", owner: "/부산법인등기", src: "src/lib/local-landing/config.ts; src/lib/hub/registry.ts", why: "유지. 관측 노출은 /부산기업법무사(같은 사이트 다른 URL) — 원인 미확정, 통합 금지로 보류" },
  "부산 상속 법무사": { intent: "등기·포기·한정승인 중 절차 선택", owner: "/부산상속법무사", src: "src/lib/local-landing/keyword-topics.ts; keyword-builder.ts", why: "이전 작업(ca045b8, 미배포)에서 관할·기한 보강. title·H1 유지. 관측 노출은 /부산상속포기" },
  "부산 상속전문 법무사": { intent: "법무사 선택 기준(업무범위·경험)", owner: "/부산상속전문법무사", src: "src/lib/naver-recovery/specialist.ts; src/lib/local-landing/naver-recovery-targets.ts", why: "후보 /부산상속법무사와 다름. 전용 URL이 index(2026-09-26 PROVIDER-SELECTION 전환)이고 관측 노출 URL도 이 페이지" },
  "부산 상속포기 법무사": { intent: "3개월 기한·후순위·가정법원 신고", owner: "/부산상속포기", src: "src/lib/naver-recovery/renunciation.ts; src/lib/local-landing/naver-recovery-targets.ts", why: "유지. 관측 노출 URL 일치" },
  "부산 한정승인 법무사": { intent: "채무 한도 승인 신고·청산", owner: "/부산한정승인", src: "src/lib/priority-seo/existing/qualified-acceptance.ts", why: "유지. 관측 노출 URL 일치" },
  "부산 법무사 상속": { intent: "상속 절차 선택(어순 변형)", owner: "/부산상속법무사", src: "src/lib/local-landing/keyword-topics.ts", why: "동의어로 같은 대표 공유. 관측 노출은 전국 /상속 — 전국 허브 역할 유지, 재작성 안 함" },
  "부산 등기 법무사": { intent: "등기 종류 선택(부동산·상속·법인)", owner: "/부산등기법무사", src: "src/lib/local-landing/keyword-landing-config.ts; keyword-builder.ts(isRegistryHub)", why: "유지. 관측 노출 URL 일치" },
  "부산 등기전문 법무사": { intent: "등기 종류 선택 + 업무 범위 확인", owner: "/부산등기법무사", src: "src/lib/local-landing/keyword-landing-config.ts; seo/index-policy.json:9,76", why: "유지. /부산등기전문법무사 noindex+canonical→/부산등기법무사 기존 정책. 관측 노출은 /부산부동산등기전문법무사(index)" },
  "부산 법무사": { intent: "사무소·담당자 탐색(브랜드·위치)", owner: "/", src: "src/app/page.tsx; src/data/seo/page-relations.ts:32(HOME_BROAD_CHAMPION)", why: "유지. /부산법무사는 업무 안내 보조(BUSAN_LEGAL_SCRIVENER_CHAMPION)" },
  "부산 법무사 추천": { intent: "객관적 선택 기준", owner: "/부산법무사추천", src: "src/lib/priority-seo/existing/busan-recommend.ts", why: "유지. 7가지 확인 기준·확인 가능한 사실만 기재. 관측 노출 URL 일치" },
  "부산 법무사 상담": { intent: "연락 채널·준비정보·비용 안내 방법", owner: "/부산법무사상담", src: "src/lib/priority-seo/existing/busan-consult.ts:66", why: "변경: 상황별 업무 표 아래 문장에 업무별 담당 URL 5개를 자연 앵커로 연결(표에 업무명만 있고 링크 없음). 관측 노출은 /부산법무사추천" },
};

const indexState = (r) => {
  const a = after[r];
  if (!a) return "out/ 없음";
  const l = live[r];
  return `${/noindex/.test(a.robots) ? "noindex" : "index"}·canonical=${a.canonical === r ? "self" : a.canonical}·sitemap=${a.inSitemap}·운영GET=${l ? `${l.status}${l.xRobots ? " X-Robots:" + l.xRobots : ""}` : "미확인"}`;
};
const presence = (q, r) => {
  const p = audit.presence.find((x) => x.query === q && x.owner === r);
  if (!p) {
    const row = audit.routes[r];
    if (!row) return "미측정";
    const toks = q.split(" ");
    const has = (s) => toks.every((k) => (s || "").includes(k));
    return `title=${+has(row.title)} h1=${+has(row.h1.join(" "))} main=${+has(row.mainText)} exact=${+row.mainText.includes(q)}`;
  }
  return `title=${+p.inTitle} h1=${+p.inH1} main=${+p.inMain} exact=${+p.exactInMain}`;
};
const observed = (q) => {
  const o = obs[q];
  if (!o) return "미관측";
  return `${o.observedAtKST} KST·PC·비로그인·통합검색 HTML 1회: ${o.ourDomainOrder ? `외부도메인 등장순 ${o.ourDomainOrder}, URL ${o.ourUrl}` : "본 도메인 미검출"}`;
};
const cell = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
const head = ["query", "intent", "candidate", "owner", "sourceFile", "changeOrKeep", "technicalCheck", "observedSearch", "unknowns", "stringPresence", "indexability", "searchExposure"];
const rows = REQUIRED.map((q) => {
  const t = targets.find((x) => x.query === q);
  const d = D[q];
  const changed = changedNow.has(d.owner) ? "이번 변경" : changedPrev.has(d.owner) ? "이전 작업 변경(ca045b8 미배포)" : "유지";
  const o = obs[q];
  return [q, d.intent, t.candidate, d.owner, d.src, `${changed} — ${d.why}`,
    `head 중복 0·canonical 절대URL·이중인코딩 0·깨진 내부링크 0(사이트 전체 tech-scan) / ${indexState(d.owner)}`,
    observed(q),
    "서치어드바이저 색인·유입 미제공 / 순위 아님(등장 순서) / 영역 구분 불가(HTML 제목 없음)",
    presence(q, d.owner), indexState(d.owner), o?.ourDomainOrder ? `노출 관측(${o.ourUrl})` : "미검출"];
});
const qs = rows.map((r) => r[0]);
const dup = qs.filter((q, i) => qs.indexOf(q) !== i);
const miss = REQUIRED.filter((q) => !qs.includes(q));
if (rows.length !== 14 || dup.length || miss.length || JSON.stringify(qs) !== JSON.stringify(REQUIRED)) {
  console.error("keyword map check failed", { n: rows.length, dup, miss });
  process.exit(1);
}
fs.writeFileSync(path.join(DIR, "keyword-map-14.csv"), "﻿" + [head, ...rows].map((r) => r.map(cell).join(",")).join("\n"));

const extra = targets.filter((t) => t.set === "extra").map((t) => {
  const note = {
    "부산법무사": "'부산 법무사'와 같은 의도 → 홈(/) 공유, /부산법무사는 업무 안내 보조. 신규 없음",
    "부산 법무사 비용": "/부산법무사비용 비용 요인 문장 3회 반복 제거(이번 변경). title·H1·설명 유지",
    "부산 법무사 등기": "'부산 등기 법무사' 어순 변형 → /부산등기법무사 공유",
    "부산 상속등기 법무사": "/부산상속등기 유지. 관측 노출은 /부산지방법원상속등기",
    "부산 부동산등기 법무사": "/부산부동산등기법무사 유지(관측 노출은 /부산부동산등기)",
    "부산 소유권이전등기 법무사": "/부산소유권이전등기 유지. 이전 작업에서 카드 라벨 보강",
    "부산 증여등기 법무사": "/부산증여등기 유지",
    "부산 특별한정승인 법무사": "전국 /특별한정승인 유지. 부산 전용 신규 URL 근거 없음(관측 노출은 /부산한정승인)",
    "부산 임원변경등기": "/부산임원변경등기 유지",
    "부산 본점이전등기": "/부산본점이전등기 유지. 결론·기한 목록의 2회 재진술은 요약 성격이라 보류",
    "해운대 법무사": "/해운대법무사 유지",
    "재송동 법무사": "/재송동법무사 유지. 구·동 공통 문장 2회 반복은 공유 템플릿이라 보류",
    "센텀 법무사": "/센텀법무사 오시는 길 앵커 '센텀시티역 인근 법무사'→'센텀역·재송역 도보권 사무소 위치'(office-location.ts:11과 일치)",
  }[t.query];
  return [t.query, t.owner, indexState(t.owner), presence(t.query, t.owner), observed(t.query), note];
});
fs.writeFileSync(path.join(DIR, "extra-candidates.csv"), "﻿" + [["query", "owner", "indexability", "stringPresence", "observedSearch", "decision"], ...extra].map((r) => r.map(cell).join(",")).join("\n"));

const facts = rows.map((r) => {
  const a = after[r[3]];
  return { route: r[3], query: r[0], source: r[4], title: a?.title, h1: a?.h1, canonical: a?.canonical, robots: a?.robots, response: live[r[3]] ? { status: live[r[3]].status, type: live[r[3]].type, xRobots: live[r[3]].xRobots, cache: live[r[3]].cache } : null, owner: r[3], evidence: r[5], unknowns: r[8] };
});
fs.writeFileSync(path.join(DIR, "seo-facts.json"), JSON.stringify(facts, null, 1));
console.log(`keyword-map-14 rows=${rows.length} exactMatch=true dup=0 missing=0; extra=${extra.length}`);
