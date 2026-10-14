#!/usr/bin/env node
/** query-map.csv(정확히 15행) · protected-urls.csv · image-map.csv. 관측 = channel-observations.csv(① 10-14 19:54 PC 비로그인). */
import fs from "node:fs";
import path from "node:path";

const DIR = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1"));
const ROOT = path.resolve(DIR, "../..");
const snap = (n) => JSON.parse(fs.readFileSync(path.join(ROOT, `reports/google-index-2026-10-11/protect/${n}.json`), "utf8")).pages;
const before = snap("15kw-before");
const after = snap("15kw-final");
const q = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;

function parseCsv(file) {
  const text = fs.readFileSync(file, "utf8").replace(/^﻿/, "");
  const rows = []; let row = [], cur = "", inQ = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQ) { if (c === '"' && text[i + 1] === '"') { cur += '"'; i++; } else if (c === '"') inQ = false; else cur += c; }
    else if (c === '"') inQ = true;
    else if (c === ",") { row.push(cur); cur = ""; }
    else if (c === "\n" || c === "\r") { if (c === "\r" && text[i + 1] === "\n") i++; row.push(cur); cur = ""; if (row.some(Boolean)) rows.push(row); row = []; }
    else cur += c;
  }
  if (cur || row.length) { row.push(cur); rows.push(row); }
  const [h, ...rest] = rows;
  return rest.map((r) => Object.fromEntries(h.map((k, i) => [k, r[i] ?? ""])));
}
const obs = parseCsv(path.join(DIR, "channel-observations.csv"));
const blogs = fs.existsSync(path.join(DIR, "blog-posts.csv")) ? parseCsv(path.join(DIR, "blog-posts.csv")) : [];

const diff = (url) => {
  const b = before[url], a = after[url];
  if (!b || !a) return "스냅샷 없음";
  const f = ["title", "description", "h1", "canonical", "robots", "ogImage", "linksHash"].filter((k) => JSON.stringify(b[k]) !== JSON.stringify(a[k]));
  return f.length ? f.join(",") : "메타·링크 변화 없음(전역 JSON-LD OfferCatalog 1곳만)";
};
const blogFor = (re) => blogs.filter((b) => re.test(b.title || "")).slice(0, 1).map((b) => b.link || b.url).join(" ") || "해당 의도 글 미확인(RSS 50건 기준)";

// raw_query 는 그대로. normalized_query 는 기록용.
const ROWS = [
  ["부산 한정승인 법무사", "부산 한정승인 법무사", "재산·채무·한정승인 신고와 청산", "/부산한정승인", /한정승인/, "C (플레이스 5/6)", "카드 추가, 업무 범위 1문장(소송 대리는 변호사)"],
  ["부산 법무사 상담", "부산 법무사 상담", "연락·상담 준비·의뢰 시작", "/부산법무사상담", /상담/, "A (/부산법무사추천)", "없음(10-13 카드 반영, 3일간 URL 교대 — 재관측)"],
  ["부산 상속", "부산 상속", "상속 업무 분기", "/부산상속법무사", /상속/, "A (/부산상속포기, 웹 첫 관측)", "없음(대표 페이지 유지)"],
  ["부산 상속 법무", "부산 상속 법무(사)", "상속 법무 업무 탐색", "/부산상속법무사", /상속/, "A (/상속등기비용, AI 브리핑 출처 /부산상속재산분할법무사)", "없음"],
  ["부산 등기 법무사", "부산 등기 법무사", "등기 유형·실행", "/부산등기법무사", /등기/, "정상 (웹#3)", "없음"],
  ["부산 상속포기 법무사", "부산 상속포기 법무사", "포기 신고·후속", "/부산상속포기", /포기/, "A (/부산상속법무사)", "카드 추가(3개월·관할 HTML 설명)"],
  ["부산 상속등기 법무사", "부산 상속등기 법무사", "명의이전 의뢰", "/부산상속등기", /상속등기/, "B (URL 정상, 스니펫=본문 첫 문단)", "카드 추가"],
  ["부산 상속전문 법무사", "부산 상속전문 법무사", "업무 범위·검토 경험", "/부산상속전문법무사", /상속/, "정상 (웹#7)", "없음"],
  ["부산 등기전문 법무사", "부산 등기전문 법무사", "등기 유형·업무 범위", "/부산등기법무사", /등기/, "A (/부산법인설립전문법무사 — 업무 불일치, 10-13엔 /부산부동산등기전문법무사)", "보류(1회 관측, 재관측)"],
  ["부산 법인전문 법무사", "부산 법인전문 법무사", "법인 담당 선택", "/부산법인법무사", /법인/, "A (/부산법인설립전문법무사)", "보류"],
  ["부산 법인설립 법무사", "부산 법인설립 법무사", "회사 형태·구성·설립 준비", "/부산법인설립등기", /법인설립/, "A (/부산법인설립전문법무사)", "/부산법인설립등기 description 잘림 정정, 백틱 경로 제거, 카드 추가"],
  ["부산 법인 법무사", "부산 법인 법무사", "회사 업무·담당 선택", "/부산법인법무사", /법인/, "A (/부산법인설립전문법무사)", "FAQ 백틱 경로 제거"],
  ["부산법인등기법무사", "부산 법인등기 법무사(붙여쓰기)", "설립·임원·본점·목적 실행", "/부산법인등기", /법인/, "A (/법인등기준비서류)", "없음"],
  ["부산 법인등기 법무사", "부산 법인등기 법무사", "설립·임원·본점·목적 실행", "/부산법인등기", /법인/, "정상 (웹#2, 10-13 /부산기업법무사에서 회복)", "없음"],
  ["부산 법률 상담", "부산 법률 상담", "공공·무료 상담 / 분쟁 / 등기·신청서류 혼재", "/부산법률상담", /상담/, "C+D (웹 1~5 법원·시청·구청)", "대표 이미지 상속 사진→상담 사진(확정 결함), title 보류"],
];

const head = ["raw_query", "normalized_query", "의도", "웹대표후보", "기존블로그URL", "expectedURL", "actualURL", "블록·순위또는미확인", "관측일·근거", "수정·보류", "보호검사"];
const lines = [head.map(q).join(",")];
for (const [raw, norm, intent, url, blogRe, cls, change] of ROWS) {
  const mine = obs.filter((r) => r.raw_query === raw);
  const own = mine.filter((r) => /^Y/i.test(r.own || ""));
  const web = own.find((r) => /웹/.test(r.block));
  const blog = own.find((r) => /블로그/.test(r.block));
  const where = [web ? `${web.block} ${web.position_in_block}` : "웹 확인 범위 내 미발견", blog ? `블로그 ${blog.position_in_block}` : ""].filter(Boolean).join(" / ");
  lines.push([raw, norm, intent, url, blogFor(blogRe), url, web ? web.landing_url : "확인 범위 내 미발견", `${where} · 분류 ${cls}`, `${mine[0]?.kst || "미확인"} PC 비로그인 · channel-observations.csv`, change, diff(url)].map(q).join(","));
}
if (lines.length !== 16) throw new Error(`query-map rows ${lines.length - 1} != 15`);
fs.writeFileSync(path.join(DIR, "query-map.csv"), "﻿" + lines.join("\n") + "\n");

const PROTECT = [["부산 법무사", "/"], ["부산법무사", "/"], ["부산 법무사 추천", "/부산법무사추천"], ["부산 법무사 사무소", "/"], ["상속 종합", "/상속"], ["법인등기 종합", "/법인등기"], ["부산 공탁 법무사", "/부산공탁"], ["부산 지급명령", "/부산지방법원지급명령"], ["부산 개인회생 법무사", "/부산개인회생법무사"], ["부산 개인파산", "/부산개인파산"], ["부산 전세보증금 반환 법무사", "/부산전세보증금반환법무사"], ["부산 임차권등기명령", "/부산임차권등기명령"], ["상속포기 비대면 법무사", "/전국상속등기"], ["부산 법무사(업무 허브)", "/부산법무사"], ["부산 상속등기(지역)", "/해운대구상속등기"]];
const p2 = [["검색어", "URL", "title", "robots", "canonical 동일", "변경 필드"].map(q).join(",")];
for (const [k, u] of PROTECT) p2.push([k, u, after[u]?.title, after[u]?.robots, before[u] && after[u] ? before[u].canonical === after[u].canonical : "?", diff(u)].map(q).join(","));
fs.writeFileSync(path.join(DIR, "protected-urls.csv"), "﻿" + p2.join("\n") + "\n");

const cards = JSON.parse(fs.readFileSync(path.join(DIR, "cards/src/cards.json"), "utf8"));
const use = { "inheritance-registration-prep": "/부산상속등기", "renunciation-check": "/부산상속포기", "qualified-acceptance": "/부산한정승인 · 블로그 A", "company-establishment-prep": "/부산법인설립등기 · 블로그 B", "corporate-change": "/부산법인등기·/법인등기 · 블로그 C(1:1)", "officer-deadline": "/부산법인법무사 · 블로그 C 본문" };
const p3 = [["id", "가로형(본문 figure)", "1:1 master(블로그·공유)", "원본 사진", "제목", "사용처", "편집 소스", "비고"].map(q).join(",")];
for (const r of cards.results) {
  const c = cards.cards.find((x) => x.id === r.id);
  p3.push([r.id, r.landscape ? `/${r.landscape.file.replace(/^public\//, "")} (${r.landscape.bytes}B, 신규)` : `/image/cards/${r.id}.jpg (10-13 기존 유지)`, `/${r.square.file.replace(/^public\//, "")} (${r.square.bytes}B)`, `public/image/${c.photo}`, c.title.join(" "), use[r.id] ?? "웹 본문(10-13 배치)", `reports/naver-15kw-2026-10-14/cards/src/${r.id}-*.svg`, "OG·primaryImageOfPage 아님. 인물 원본 크롭만. 서류는 가린 원본"].map(q).join(","));
}
p3.push(["counsel-og", "", "", "public/image/상담-메인.jpg (/_img/image/상담-메인.og.jpg 1200×900)", "", "/부산법률상담 og:image·primaryImageOfPage", "src/lib/pageData/builders.ts", "상속 사진(등기필증_상속)에서 교체"].map(q).join(","));
fs.writeFileSync(path.join(DIR, "image-map.csv"), "﻿" + p3.join("\n") + "\n");
console.log("query-map 15, protected", PROTECT.length, "images", cards.results.length + 1);
