/**
 * 필수 14개 검색어 표 자동 검증.
 * 실행: npx --yes tsx --test tests/keyword-14-coverage.spec.ts
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const REQUIRED = [
  "부산 법인전문 법무사",
  "부산 법인 법무사",
  "부산 법인설립 법무사",
  "부산 법인등기 법무사",
  "부산 상속 법무사",
  "부산 상속전문 법무사",
  "부산 상속포기 법무사",
  "부산 한정승인 법무사",
  "부산 법무사 상속",
  "부산 등기 법무사",
  "부산 등기전문 법무사",
  "부산 법무사",
  "부산 법무사 추천",
  "부산 법무사 상담",
] as const;

const COLUMNS = [
  "keyword",
  "observedIntent",
  "observedUrlStatus",
  "candidateUrl",
  "finalOwnerUrl",
  "competingUrls",
  "evidence",
  "changeLocation",
  "initialHtml",
  "duplicateReview",
  "protectionCheck",
  "unverified",
] as const;

test("14개 필수 키워드 표가 빠짐없이 있다", () => {
  const file = path.join(
    process.cwd(),
    "reports/seo-recovery-2026-10-08/14-keywords.json",
  );
  assert.equal(fs.existsSync(file), true, "14-keywords.json 없음");
  const rows = JSON.parse(fs.readFileSync(file, "utf8")) as Record<
    string,
    unknown
  >[];
  assert.equal(rows.length, 14, `행 수 ${rows.length}`);
  const keywords = rows.map((row) => String(row.keyword));
  assert.deepEqual(keywords, [...REQUIRED]);
  for (const row of rows) {
    for (const col of COLUMNS) {
      assert.equal(
        typeof row[col] === "string" && String(row[col]).trim().length > 0,
        true,
        `열 누락: ${row.keyword} / ${col}`,
      );
    }
    assert.match(String(row.finalOwnerUrl), /^\//);
  }
});
