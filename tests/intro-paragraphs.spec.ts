/**
 * intro/summary/body 문단 중복 제거 계약.
 * 실행: npx --yes tsx --test tests/intro-paragraphs.spec.ts
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  partitionPageIntro,
  splitIntroParagraphs,
  uniqueParagraphs,
} from "../src/lib/pageData/template-helpers";

test("uniqueParagraphs는 공백만 다른 문단을 한 번만 남긴다", () => {
  assert.deepEqual(
    uniqueParagraphs(["가. 안내합니다.", "  가. 안내합니다.  ", "나. 다릅니다."]),
    ["가. 안내합니다.", "나. 다릅니다."],
  );
});

test("splitIntroParagraphs extras가 둘째 문단과 같으면 제거한다", () => {
  const intro =
    "첫 문장입니다. 둘째 문장입니다. 셋째 문장입니다. 넷째 문장입니다.";
  const second =
    "셋째 문장입니다. 넷째 문장입니다.";
  const paras = splitIntroParagraphs(intro, [second]);
  const keys = paras.map((p) => p.replace(/\s+/g, " ").trim());
  assert.equal(new Set(keys).size, keys.length);
});

test("partitionPageIntro는 Hero 문단을 요약·본문에 다시 쓰지 않는다", () => {
  const intro = [
    "이 페이지는 상속 종합 안내입니다.",
    "부산 검색은 부산 상속 법무사 안내가 대표입니다.",
    "상담 시 사망일과 상속인 구성을 확인합니다.",
  ];
  const dedicated =
    "전국 상속 안내는 등기·포기·한정승인을 한 페이지에서 고르는 출발점입니다.";
  const slots = partitionPageIntro(intro, {
    dedicatedConclusion: dedicated,
    h1: "상속등기·상속포기·한정승인·전국 상속 상담",
  });
  assert.deepEqual(slots.heroParagraphs, [intro[0], intro[1]]);
  assert.equal(slots.summaryConclusion, dedicated);
  assert.deepEqual(slots.bodyParagraphs, [intro[2]]);
});

test("전용 요약이 없으면 남은 고유 문단을 요약으로 쓰고 본단 반복을 만들지 않는다", () => {
  const intro = [
    "법인 설립과 변경은 결의가 맞아야 합니다.",
    "부산 센텀에서 임원변경 상담이 이어집니다.",
  ];
  const slots = partitionPageIntro(intro, { h1: "부산 법인등기" });
  assert.deepEqual(slots.heroParagraphs, intro);
  assert.equal(slots.bodyParagraphs.length, 0);
  assert.notEqual(slots.summaryConclusion, intro[0]);
});
