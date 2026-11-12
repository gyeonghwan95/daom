#!/usr/bin/env node
/**
 * 부분 글꼴(public/fonts)이 빌드 결과(out/)의 글자를 얼마나 덮는지 확인한다.
 * 덮이지 않은 글자는 맑은 고딕 같은 폴백 글꼴로 그려져 서체가 섞여 보인다.
 *
 *   node scripts/fonts/check-font-coverage.mjs [out] [--strict]
 *
 * --strict: 미포함 한글이 5자를 넘으면 종료 코드 1. 새 글이 늘어 미포함 글자가 생기면
 *           scripts/fonts/build-font-subsets.py 를 다시 실행한다(순서는 그 파일 머리말).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const outDir = path.resolve(process.argv[2]?.startsWith("--") ? "out" : process.argv[2] || "out");
const strict = process.argv.includes("--strict");
const meta = JSON.parse(fs.readFileSync(path.join(ROOT, "scripts/fonts/font-subset-meta.json"), "utf8"));
const covered = new Set(Object.values(meta).flatMap((m) => m.codepoints));

const missing = new Map(); // 글자 -> 쓰인 페이지 수
let pages = 0;
function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (!/^(_next|_img|admin|image|images|video|resources|fonts)$/.test(e.name)) walk(p);
    } else if (e.name.endsWith(".html")) {
      pages++;
      const html = fs.readFileSync(p, "utf8").replace(/<script[\s\S]*?<\/script>/g, " ").replace(/<style[\s\S]*?<\/style>/g, " ");
      const text = html.replace(/<[^>]+>/g, "\n");
      for (const ch of new Set(text)) {
        const cp = ch.codePointAt(0);
        if (cp < 0x20 || cp === 0xa0 || covered.has(cp)) continue;
        missing.set(ch, (missing.get(ch) || 0) + 1);
      }
    }
  }
}
walk(outDir);

const isHangul = (c) => c.codePointAt(0) >= 0xac00 && c.codePointAt(0) <= 0xd7a3;
const rows = [...missing].sort((a, b) => b[1] - a[1]);
const hangul = rows.filter(([c]) => isHangul(c));
console.log(`페이지 ${pages}개 검사, 글꼴 미포함 글자 ${rows.length}종(한글 ${hangul.length}자)`);
if (rows.length) console.log("  " + rows.slice(0, 40).map(([c, n]) => `${c}(${n})`).join(" "));
if (strict && hangul.length > 5) {
  console.error("한글 미포함 글자가 많습니다. scripts/fonts/build-font-subsets.py 를 다시 실행하세요.");
  process.exit(1);
}
