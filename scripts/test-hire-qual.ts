/**
 * 수임 가능 신호 분류. 본문은 저장하지 않고 date·place·intent·docs 만 남긴다.
 * Usage: npx --yes tsx scripts/test-hire-qual.ts
 */
import { hireQualMeta, qualifyHireSignals } from "../src/lib/consultation/hire-qual.ts";

let failed = 0;
function assert(cond: unknown, msg: string) {
  if (!cond) {
    console.error(`FAIL: ${msg}`);
    failed += 1;
  }
}

assert(hireQualMeta("문의요") === "", "짧은 인사만으로는 수임 가능이 아님");
assert(hireQualMeta("절차만 궁금합니다") === "", "정보 문의는 수임 가능이 아님");
assert(
  hireQualMeta("상담만 받고 맡기지 않겠습니다") === "",
  "맡기지 않겠다는 문장은 맡기 의사로 세지 않음",
);

const ready = qualifyHireSignals("해운대구 우동 아파트, 잔금 12월 3일에 등기를 맡기고 싶습니다.");
assert(ready.includes("date") && ready.includes("place") && ready.includes("intent"), `기한·주소·맡김 ${ready.join(",")}`);

assert(hireQualMeta("사망일이 2026-10-02입니다") === "date", "사망일");
assert(hireQualMeta("", { hasDocuments: true }) === "docs", "서류만 있어도 수임 가능");
assert(hireQualMeta("등기부 있어요", { hasDocuments: false }) === "", "서류 단어만으로는 docs가 아님");

if (failed) {
  console.error(`test-hire-qual: ${failed} failed`);
  process.exit(1);
}
console.log("test-hire-qual PASS");
