#!/usr/bin/env node
/**
 * 지역 페이지의 "○○구 부동산등기는 △△ 관할" 문장이 실제 관할과 맞는지 검사한다.
 *
 * 왜: /하단법무사에 "사하구 부동산은 남부산·서부산등기소 관할로 나뉠 수 있습니다"가 나갔다. 사하구는 서부지원 등기과 한 곳이고,
 * '서부산등기소'는 없다(2026-11-15). 관할 오류는 의뢰인이 엉뚱한 등기소를 찾게 하고 사이트 신뢰를 떨어뜨린다.
 *
 * 기준: src/lib/local-landing/expansion/institutions.ts 의 등기소 관할(부산지방법원 등기국 안내와 같음)
 *   node scripts/check-registry-jurisdiction.mjs [--strict]
 *
 * 문장 안에 구·군 이름이 하나만 있고, 그 문장이 부동산등기 관할을 말할 때만 판정한다(여러 구를 나열한 비교 문장은 건너뛴다).
 */
import fs from "node:fs";
import path from "node:path";

const OUT = path.join(process.cwd(), "out");
const strict = process.argv.includes("--strict");

const REGISTRY = {
  등기국: ["중구", "서구", "동구", "영도구", "부산진구", "동래구", "연제구", "금정구"],
  "동부지원 등기과": ["해운대구", "기장군"],
  남부산등기소: ["남구", "수영구"],
  "서부지원 등기과": ["사하구", "강서구"],
  북부산등기소: ["북구", "사상구"],
};
const OFFICE_RE = /(등기국|동부지원 등기과|남부산등기소|서부지원 등기과|북부산등기소|서부산등기소|동부산등기소)/g;
const GU = Object.values(REGISTRY).flat();
// "강서구"가 "서구"에, "부산진구"가 "진구"에 걸리지 않도록 긴 이름부터, 앞 글자가 한글이 아닐 때만
const GU_RE = new RegExp(`(?<![가-힣])(${[...GU].sort((a, b) => b.length - a.length).join("|")})(?![가-힣]{0,1}동)`, "g");

function mainText(html) {
  const m = html.match(/<main[\s\S]*<\/main>/);
  return (m ? m[0] : html).replace(/<script[\s\S]*?<\/script>/g, " ").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
}

const problems = [];
function check(route, text) {
  for (const sentence of text.split(/(?<=[.。!?])\s+/)) {
    if (!/관할/.test(sentence) || !/부동산|등기/.test(sentence)) continue;
    const gus = [...new Set([...sentence.matchAll(GU_RE)].map((m) => m[1]))];
    const offices = [...new Set([...sentence.matchAll(OFFICE_RE)].map((m) => m[1]))];
    if (gus.length !== 1 || offices.length === 0) continue;
    const gu = gus[0];
    // 법인(상업)등기는 등기국 관할이라 부동산과 다르다 — 법인 문장은 건너뛴다
    if (/법인|상업등기|본점/.test(sentence)) continue;
    const right = Object.entries(REGISTRY).find(([, list]) => list.includes(gu))?.[0];
    const wrong = offices.filter((o) => o !== right);
    if (wrong.length && offices.length === wrong.length) problems.push({ route, gu, right, said: offices.join("·"), sentence: sentence.slice(0, 160) });
  }
}

function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (!/^(_next|_img|admin|image|images|video|fonts|generated|resources)$/.test(e.name)) walk(full);
    } else if (e.name.endsWith(".html")) {
      const html = fs.readFileSync(full, "utf8");
      if (/<meta name="robots" content="noindex/.test(html)) continue;
      check("/" + path.relative(OUT, full).split(path.sep).join("/").replace(/\.html$/, ""), mainText(html));
    }
  }
}
walk(OUT);
console.log(`[jurisdiction] 관할이 맞지 않는 문장 ${problems.length}곳`);
for (const p of problems.slice(0, 60)) console.log(`${p.route} | ${p.gu} → 실제 ${p.right}, 표기 ${p.said} | ${p.sentence}`);
if (strict && problems.length) process.exit(1);
