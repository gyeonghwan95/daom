#!/usr/bin/env node
/** 네이버 자동완성으로 법무사 업무 검색어 수요 후보 수집(시드당 1회, 1.2초 간격). 결과 ac-suggestions.json */
import fs from "node:fs";
import path from "node:path";
const DIR = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1"));
const SEEDS = [
  "상속등기", "상속포기", "한정승인", "셀프등기", "소유권이전등기", "근저당 말소", "증여등기", "법인설립", "임원변경등기",
  "본점이전", "법인 해산", "개인회생", "개인파산", "지급명령", "내용증명", "가압류", "공탁", "전세권설정", "임차권등기명령",
  "성년후견", "유언장", "개명", "경매 등기", "주소변경 등기", "보존등기", "협의분할", "상속재산", "부동산 명의변경", "법무사 비용", "등기 비용",
  "부산 상속등기", "부산 소유권이전", "부산 법인설립", "부산 개인회생", "부산 근저당", "부산 지급명령", "부산 공탁", "부산 전세",
];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const out = {};
for (const q of SEEDS) {
  try {
    const u = `https://ac.search.naver.com/nx/ac?q=${encodeURIComponent(q)}&con=0&frm=nv&ans=2&r_format=json&r_enc=UTF-8&r_unicode=0&t_koreng=1&run=2&rev=4&q_enc=UTF-8&st=100`;
    const j = await (await fetch(u, { headers: { "user-agent": "Mozilla/5.0 Chrome/130" } })).json();
    out[q] = (j.items?.[0] || []).map((x) => x[0]);
  } catch (e) {
    out[q] = { error: String(e.message) };
  }
  await sleep(1200);
}
fs.writeFileSync(path.join(DIR, "ac-suggestions.json"), JSON.stringify({ collectedAtKST: new Date().toLocaleString("sv-SE", { timeZone: "Asia/Seoul" }), seeds: out }, null, 1));
const all = new Set(Object.values(out).flat().filter((x) => typeof x === "string"));
console.log(`seeds=${SEEDS.length} suggestions(unique)=${all.size}`);
