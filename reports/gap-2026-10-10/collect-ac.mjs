#!/usr/bin/env node
/** 네이버 자동완성으로 법무사 업무 검색어 후보 수집(시드당 1회, 1초 간격, 재시도 없음). 결과 ac-suggestions.json */
import fs from "node:fs";
import path from "node:path";

const DIR = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1"));
const SEEDS = [
  "부산 법무사", "부산 법무사 사무실", "해운대 법무사", "센텀 법무사", "부산 상속", "부산 상속등기", "부산 상속포기", "부산 한정승인",
  "부산 상속재산", "부산 유언", "부산 법인", "부산 법인설립", "부산 법인등기", "부산 임원변경", "부산 본점이전", "부산 법인 해산",
  "부산 등기", "부산 부동산등기", "부산 소유권이전", "부산 증여", "부산 근저당", "부산 전세권", "부산 임차권등기", "부산 가압류",
  "부산 개인회생", "부산 개인파산", "부산 공탁", "부산 지급명령", "부산 내용증명", "부산 성년후견", "부산 가족관계", "부산 개명",
  "부산 등기소", "부산 가정법원", "부산 회생법원", "부산 셀프등기", "부산 법무사 비용", "부산 상속 법무사", "부산 법인 법무사", "부산 등기 법무사",
  "해운대 상속", "해운대 등기", "센텀 법인", "부산 아파트 등기", "부산 분양", "부산 경매 등기",
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
  await sleep(1000);
}
fs.writeFileSync(path.join(DIR, "ac-suggestions.json"), JSON.stringify({ collectedAtKST: new Date().toLocaleString("sv-SE", { timeZone: "Asia/Seoul" }), seeds: out }, null, 1));
const all = new Set(Object.values(out).flat().filter((x) => typeof x === "string"));
console.log(`seeds=${SEEDS.length} suggestions(unique)=${all.size} errors=${Object.values(out).filter((v) => !Array.isArray(v)).length}`);
