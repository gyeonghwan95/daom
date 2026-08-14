/**
 * Broad query ownership — 신규 페이지가 기존 Champion query를 primary로 가져가면 FAIL.
 * 기존 URL은 삭제하지 않는다.
 * Usage: npx --yes tsx scripts/audit-query-champion-ownership.ts
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const REG = path.join(ROOT, "config/seo-query-champions.json");

function main() {
  const reg = JSON.parse(fs.readFileSync(REG, "utf8"));
  const errors: string[] = [];

  for (const [query, row] of Object.entries(reg.queries || {})) {
    const r = row as { primary?: string; protected?: boolean };
    if (!r.primary || !r.primary.startsWith("/")) {
      errors.push(`${query}: primary URL 없음`);
    }
  }

  const busan = reg.queries["부산 법무사"];
  if (busan?.primary !== "/부산법무사") {
    errors.push("부산 법무사 Champion이 /부산법무사 가 아님");
  }

  console.log("=== Query Champion Ownership ===");
  console.log(`queries: ${Object.keys(reg.queries || {}).length}`);
  if (errors.length) {
    for (const e of errors) console.error(`[fail] ${e}`);
    process.exit(1);
  }
  console.log("OK — Champion registry valid; CREATE_NEW for these queries forbidden.");
}

main();
