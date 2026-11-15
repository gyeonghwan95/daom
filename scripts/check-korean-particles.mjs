#!/usr/bin/env node
/**
 * 빌드된 페이지 본문에서 받침과 맞지 않는 조사(을/를, 이/가, 은/는, 과/와, 으로/로)를 찾는다.
 *
 * 왜: 템플릿이 받침을 보지 않고 조사를 붙여 "상속등기을", "지급명령를" 같은 문장이 지역 페이지에 그대로 나갔다
 * (2026-11-15 /하단법무사 점검). 사람이 쓴 글이 아니라는 인상을 주고 신뢰를 떨어뜨린다.
 *
 *   node scripts/check-korean-particles.mjs            # out/ 전체, 오류 페이지 수와 예시
 *   node scripts/check-korean-particles.mjs --strict   # 하나라도 있으면 종료 코드 1
 *
 * 판정은 "한글 음절 + 조사 + 공백/문장부호"만 본다(낱말 안의 글자는 건드리지 않는다).
 * 이/가·은/는·으로/로는 어미와 모양이 같아 판정하지 않는다.
 */
import fs from "node:fs";
import path from "node:path";

const OUT = path.join(process.cwd(), "out");
const strict = process.argv.includes("--strict");

const hasBatchim = (ch) => {
  const code = ch.charCodeAt(0) - 0xac00;
  return code >= 0 && code <= 11171 && code % 28 !== 0;
};


// [조사, 받침 있을 때 맞는 형태, 받침 없을 때 맞는 형태]
// 이/가·은/는·으로/로는 동사 어미(있는, 찾는, 하는 이유)와 모양이 같아 오탐이 많으므로 판정하지 않는다
const PAIRS = [
  ["을", "를"],
  ["과", "와"],
];

function findErrors(text) {
  const errors = [];
  const re = /([가-힣])(을|를|과|와)(?=[\s.,·!?)」』"'’”]|$)/g;
  for (const m of text.matchAll(re)) {
    const [whole, prev, josa] = m;
    const b = hasBatchim(prev);
    let wrong = false;
    for (const [withB, withoutB] of PAIRS) {
      if (josa === withB && !b) wrong = true;
      if (josa === withoutB && b) wrong = true;
    }
    if (!wrong) continue;
    // 조사가 아니라 낱말의 일부일 수 있는 흔한 경우는 건너뛴다(예: "정가", "평가", "부가", "추가", "단가", "가이드")
    const word = text.slice(Math.max(0, m.index - 6), m.index + whole.length);
    if (/(정가|평가|부가|추가|단가|원가|시가|대가|주가|고가|저가|공시가|증가|참가|휴가|가능)$/.test(word)) continue;
    if (/(경우|이유|비용|이용|주이|위이)$/.test(word)) continue;
    // '과'로 끝나는 명사(기관 부서·일반 명사)와 '을'로 끝나는 동사 활용형
    if (/(등기과|수사과|민원과|세무과|지적과|건축과|효과|결과|사과|학과|통과|경과|초과|성과|부과|교과|외과|내과)$/.test(word)) continue;
    if (/(모을|띠을|마을|나을|가을|고을|지을|치과|도과)$/.test(word)) continue;
    errors.push(text.slice(Math.max(0, m.index - 12), m.index + whole.length + 6).replace(/\s+/g, " "));
  }
  return errors;
}

function mainText(html) {
  const m = html.match(/<main[\s\S]*<\/main>/);
  return (m ? m[0] : html)
    .replace(/<script[\s\S]*?<\/script>/g, " ")
    .replace(/<style[\s\S]*?<\/style>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ");
}

const pages = [];
function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (!/^(_next|_img|admin|image|images|video|fonts|generated|resources)$/.test(e.name)) walk(full);
    } else if (e.name.endsWith(".html")) {
      const html = fs.readFileSync(full, "utf8");
      if (/<meta name="robots" content="noindex/.test(html)) continue;
      const errs = findErrors(mainText(html));
      if (errs.length) pages.push({ route: "/" + path.relative(OUT, full).split(path.sep).join("/").replace(/\.html$/, ""), errs });
    }
  }
}
walk(OUT);
const total = pages.reduce((a, p) => a + p.errs.length, 0);
console.log(`[particles] 색인 페이지 중 조사 오류 ${pages.length}쪽, ${total}곳`);
const freq = new Map();
for (const p of pages) for (const e of p.errs) freq.set(e, (freq.get(e) ?? 0) + 1);
for (const [e, n] of [...freq.entries()].sort((a, b) => b[1] - a[1]).slice(0, 40)) console.log(`${String(n).padStart(4)}× ${e}`);
if (strict && total > 0) process.exit(1);
