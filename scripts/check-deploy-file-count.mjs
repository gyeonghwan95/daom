#!/usr/bin/env node
/**
 * Cloudflare Pages 배포 파일 수 점검 — out/ 안의 파일 개수를 세어 한도(20,000)까지 남은 여유를 알려 준다.
 * 이미지 파생본을 늘리는 작업(scripts/optimize-images.mjs)이나 페이지를 대량으로 추가하는 작업 뒤에 돌린다.
 *
 *   node scripts/check-deploy-file-count.mjs [out 폴더]
 *
 * 한도를 넘으면 종료 코드 1, 여유가 500개 이하면 경고만 한다.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const dir = path.resolve(process.argv[2] ?? path.join(ROOT, "out"));
const LIMIT = 20000;
const WARN_MARGIN = 500;

if (!fs.existsSync(dir)) {
  console.error(`폴더가 없습니다: ${dir} (먼저 npm run build)`);
  process.exit(2);
}

let total = 0;
const byTop = new Map();
(function walk(d, top) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p, top ?? e.name);
    else {
      total += 1;
      const k = top ?? "(루트)";
      byTop.set(k, (byTop.get(k) ?? 0) + 1);
    }
  }
})(dir, null);

const left = LIMIT - total;
console.log(`배포 파일 ${total.toLocaleString("ko-KR")}개 / 한도 ${LIMIT.toLocaleString("ko-KR")}개 (여유 ${left.toLocaleString("ko-KR")}개)`);
for (const [k, n] of [...byTop.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5)) console.log(`  ${k}: ${n.toLocaleString("ko-KR")}`);

if (left < 0) {
  console.error("FAIL: Cloudflare Pages 파일 수 한도를 넘었습니다.");
  process.exit(1);
}
if (left <= WARN_MARGIN) console.warn(`WARN: 여유가 ${WARN_MARGIN}개 이하입니다. 파일을 늘리는 작업은 다른 파일을 줄인 뒤에 하세요.`);
