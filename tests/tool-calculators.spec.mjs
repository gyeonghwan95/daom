/**
 * 상속포기·한정승인 기간 계산기 회귀 검사.
 * 민법 제157조(초일 불산입)·제160조(역에 의한 계산, 해당일 없으면 말일)·제161조(토요일·공휴일이면 익일, 일요일만 반영).
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { civilMonthPeriodEnd, parseInputDate, runToolCalculator } from "../src/lib/tools/calculators.ts";

const ymd = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const at = (s) => {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
};
const end3 = (s) => ymd(civilMonthPeriodEnd(at(s), 3).end);

test("일반 날짜: 안 날 다음 날부터 3개월째 같은 날의 전날", () => {
  assert.equal(end3("2026-09-01"), "2026-12-01"); // 화요일
});

test("월말: 2월 28일에 알면 5월 31일(3개월은 90일이 아님)", () => {
  assert.equal(end3("2027-02-28"), "2027-05-31");
});

test("최종 월에 해당일이 없으면 그 달 말일", () => {
  assert.equal(end3("2026-01-30"), "2026-04-30");
});

test("윤년 2월 말일", () => {
  assert.equal(end3("2027-11-29"), "2028-02-29");
});

test("말일이 토요일·일요일이면 다음 월요일", () => {
  const r = civilMonthPeriodEnd(at("2026-10-02"), 3); // 원래 2027-01-02(토)
  assert.equal(ymd(r.end), "2027-01-04");
  assert.equal(r.shiftedFrom && ymd(r.shiftedFrom), "2027-01-02");
  assert.equal(end3("2026-11-30"), "2027-03-01"); // 원래 2027-02-28(일)
});

test("잘못된 입력은 오류로만 처리하고 우선도 평가를 내지 않는다", () => {
  for (const bad of ["", "202609-01-01", "2026-02-30", "2099-01-01"]) {
    const r = runToolCalculator("inheritance-renunciation-deadline", { situation: "general", knownDate: bad });
    assert.equal(r.invalid, true, `입력 ${JSON.stringify(bad)}`);
    assert.equal(r.timeline, undefined);
  }
  assert.ok("error" in parseInputDate("2099-01-01", "날짜"));
});

test("정상 입력은 값이 계산에 반영된다", () => {
  const r = runToolCalculator("inheritance-renunciation-deadline", { situation: "general", knownDate: "2026-09-01" });
  assert.equal(r.invalid, undefined);
  assert.ok(r.details[0].includes("2026") && r.details[0].includes("9월 1일"));
  assert.ok(r.timeline?.some((t) => t.date?.includes("12월 1일")));
});

test("추가 사실이 필요한 상황은 날짜를 계산하지 않는다", () => {
  for (const situation of ["later-heir", "minor-or-incapacity", "debt-found-later", "unknown"]) {
    const r = runToolCalculator("inheritance-renunciation-deadline", { situation, knownDate: "2026-09-01" });
    assert.equal(r.invalid, undefined);
    assert.equal(r.timeline, undefined, situation);
  }
});
