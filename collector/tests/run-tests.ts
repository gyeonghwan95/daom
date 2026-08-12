/**
 * 단위 테스트 — 외부 API를 호출하지 않고 fixture·인메모리 데이터로 검증한다.
 * 실행: npm run bid:test
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { classifyNotice, isCandidate } from "../src/classify";
import { normalizeG2bItem, parseG2bResponse } from "../src/collectors/g2b";
import { normalizeNuriItem } from "../src/collectors/nuri";
import { contentHash, mergeWithExisting, opportunityId, toOpportunity } from "../src/dedupe";
import { buildSubject, renderHtml, renderText } from "../src/email";
import { scoreNotice } from "../src/score";
import type { BriefingData, RawNotice } from "../src/types";
import {
  daysUntil,
  escapeHtml,
  formatAmount,
  maskEmail,
  parseAmount,
  parseNoticeDate,
} from "../src/util";

let passed = 0;
let failed = 0;

function test(name: string, fn: () => void): void {
  try {
    fn();
    passed += 1;
    console.log(`  ✓ ${name}`);
  } catch (err) {
    failed += 1;
    console.error(`  ✗ ${name}`);
    console.error(`    ${err instanceof Error ? err.message : err}`);
  }
}

function makeNotice(overrides: Partial<RawNotice>): RawNotice {
  return {
    sourceId: "g2b-servc",
    sourceName: "나라장터 (용역)",
    title: "테스트 공고",
    organization: "테스트기관",
    regionRequirements: [],
    qualificationRequirements: [],
    originalUrl: "https://example.com",
    attachmentUrls: [],
    attachmentNames: [],
    ...overrides,
  };
}

const inFiveDays = new Date(Date.now() + 5 * 24 * 3600_000 + 9 * 3600_000)
  .toISOString()
  .slice(0, 16)
  .replace("T", " ");

console.log("── util ──");

test("parseAmount: 콤마·원 표기 파싱", () => {
  assert.equal(parseAmount("52,000,000원"), 52_000_000);
  assert.equal(parseAmount("52000000"), 52_000_000);
});

test("parseAmount: 확인 불가 값은 undefined (0으로 채우지 않음)", () => {
  assert.equal(parseAmount(""), undefined);
  assert.equal(parseAmount("미정"), undefined);
  assert.equal(parseAmount("0"), undefined);
  assert.equal(parseAmount(null), undefined);
});

test("parseNoticeDate: 다양한 형식 정규화", () => {
  assert.equal(parseNoticeDate("2026-08-05 18:00"), "2026-08-05 18:00");
  assert.equal(parseNoticeDate("202608051800"), "2026-08-05 18:00");
  assert.equal(parseNoticeDate("20260805"), "2026-08-05 00:00");
  assert.equal(parseNoticeDate("잘못된값"), undefined);
});

test("daysUntil: 마감일 계산", () => {
  const d = daysUntil(inFiveDays);
  assert.ok(d !== undefined && d >= 4 && d <= 5, `expected ~5, got ${d}`);
  assert.ok((daysUntil("2020-01-01 00:00") ?? 0) < 0, "past deadline should be negative");
});

test("escapeHtml: XSS 방지", () => {
  assert.equal(
    escapeHtml(`<script>alert("x")</script>`),
    "&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;",
  );
});

test("maskEmail: 로그 마스킹", () => {
  assert.equal(maskEmail("lawyoonjung@naver.com"), "la****@naver.com");
});

test("formatAmount: 억·만원 표기", () => {
  assert.equal(formatAmount(180_000_000), "1.8억원");
  assert.equal(formatAmount(undefined), "금액 미확인");
});

console.log("── classify ──");

test("직접 수임 키워드: 법무사 선정", () => {
  const cls = classifyNotice(makeNotice({ title: "소유권이전등기 법무사 선정 용역" }));
  assert.equal(cls.category, "direct-bid");
  assert.ok(cls.relevanceRaw >= 20);
  assert.ok(isCandidate(cls));
});

test("의미 기반 규칙: 법무사 미언급 집단등기 후보", () => {
  const cls = classifyNotice(
    makeNotice({ title: "공동주택 소유권 이전 업무 수행기관 선정" }),
  );
  assert.ok(cls.matchedKeywords.some((k) => k.startsWith("규칙:")));
  assert.ok(isCandidate(cls));
  assert.ok(cls.reasons.length > 0, "의미 규칙은 근거 문구를 남겨야 함");
});

test("의미 기반 규칙: 미등기 국유재산 권리보전", () => {
  const cls = classifyNotice(makeNotice({ title: "미등기 국유재산 권리보전 조치 용역" }));
  assert.equal(cls.category, "registration");
  assert.ok(isCandidate(cls));
});

test("강의 공고는 lecture 카테고리", () => {
  const cls = classifyNotice(makeNotice({ title: "청년 생활법률 교육 외부강사 모집" }));
  assert.equal(cls.category, "lecture");
});

test("무관 공고는 후보 제외", () => {
  const cls = classifyNotice(makeNotice({ title: "본사 사옥 청소 및 시설관리 용역" }));
  assert.ok(!isCandidate(cls));
});

test("제외 키워드: 법무법인 한정은 표시하되 삭제하지 않음", () => {
  const cls = classifyNotice(
    makeNotice({ title: "소송업무 수행 법무법인 선정 (법무법인에 한함)" }),
  );
  assert.ok(cls.excludedKeywords.length > 0);
});

console.log("── score ──");

test("부산 법무사 선정 공고는 고득점 + 우선 검토", () => {
  const notice = makeNotice({
    title: "공공임대주택 소유권이전등기 법무사 선정 용역",
    regionRequirements: ["부산광역시"],
    estimatedAmount: 52_000_000,
    applicationDeadline: inFiveDays,
  });
  const cls = classifyNotice(notice);
  const score = scoreNotice(notice, cls);
  assert.ok(score.totalScore >= 70, `totalScore ${score.totalScore} should be >= 70`);
  assert.ok(["strong-review", "review"].includes(score.recommendation));
  assert.ok(score.scoreReasons.length >= 2, "이유를 2개 이상 제공");
});

test("법무법인 한정 공고는 likely-ineligible", () => {
  const notice = makeNotice({ title: "법률자문 법무법인 선정 (법무법인에 한함)" });
  const cls = classifyNotice(notice);
  const score = scoreNotice(notice, cls);
  assert.equal(score.recommendation, "likely-ineligible");
  assert.ok(score.risks.length > 0);
});

test("마감 지난 공고는 감점", () => {
  const notice = makeNotice({
    title: "등기업무 대행 용역",
    applicationDeadline: "2020-01-01 00:00",
  });
  const cls = classifyNotice(notice);
  const score = scoreNotice(notice, cls);
  assert.ok(score.urgencyScore === -30);
  assert.ok(score.risks.some((r) => r.includes("마감")));
});

console.log("── dedupe ──");

test("중복 키: 공고번호 기준 (차수 제외)", () => {
  const a = makeNotice({ noticeNumber: "20260726001", revision: "00" });
  const b = makeNotice({ noticeNumber: "20260726001", revision: "01" });
  assert.equal(opportunityId(a), opportunityId(b));
});

test("공고번호 없으면 기관+제목+마감 해시 키", () => {
  const a = makeNotice({ title: "A 공고", organization: "기관1" });
  const b = makeNotice({ title: "B 공고", organization: "기관1" });
  assert.notEqual(opportunityId(a), opportunityId(b));
});

test("정정공고 병합: 마감 연장은 신규가 아닌 변경으로 추적", () => {
  const now = new Date().toISOString();
  const base = makeNotice({
    noticeNumber: "N1",
    title: "등기업무 법무사 선정",
    applicationDeadline: "2026-07-28 18:00",
  });
  const clsA = classifyNotice(base);
  const existing = toOpportunity(base, clsA, scoreNotice(base, clsA), now);

  const revised = makeNotice({
    noticeNumber: "N1",
    revision: "01",
    title: "등기업무 법무사 선정",
    applicationDeadline: "2026-07-31 18:00",
    noticeKind: "정정공고",
  });
  const clsB = classifyNotice(revised);
  const incoming = toOpportunity(revised, clsB, scoreNotice(revised, clsB), now);

  const result = mergeWithExisting(incoming, existing, now);
  assert.equal(result.isNew, false);
  assert.ok(result.change, "변경 요약이 생성되어야 함");
  assert.ok(result.change.changes.some((c) => c.includes("마감일")));
  assert.ok(result.change.changes.some((c) => c.includes("차수")));
  assert.equal(result.merged.firstSeenAt, existing.firstSeenAt);
});

test("취소공고는 cancelled 상태로 전환", () => {
  const now = new Date().toISOString();
  const base = makeNotice({ noticeNumber: "N2", title: "촉탁등기 지원 용역" });
  const clsA = classifyNotice(base);
  const existing = toOpportunity(base, clsA, scoreNotice(base, clsA), now);

  const cancelled = makeNotice({
    noticeNumber: "N2",
    title: "촉탁등기 지원 용역",
    noticeKind: "취소공고",
  });
  const clsB = classifyNotice(cancelled);
  const incoming = toOpportunity(cancelled, clsB, scoreNotice(cancelled, clsB), now);

  const result = mergeWithExisting(incoming, existing, now);
  assert.equal(result.merged.status, "cancelled");
  assert.ok(result.change?.changes.includes("공고 취소"));
});

test("동일 내용 재수집은 변경 없음", () => {
  const now = new Date().toISOString();
  const base = makeNotice({ noticeNumber: "N3", title: "법인등기 대행 용역" });
  const cls = classifyNotice(base);
  const existing = toOpportunity(base, cls, scoreNotice(base, cls), now);
  const incoming = toOpportunity(base, cls, scoreNotice(base, cls), now);
  const result = mergeWithExisting(incoming, existing, now);
  assert.equal(result.change, undefined);
  assert.equal(contentHash(base), existing.contentHash);
});

console.log("── g2b parser ──");

const fixturePath = join(process.cwd(), "collector", "tests", "fixtures", "g2b-servc-sample.json");
const fixtureBody = readFileSync(fixturePath, "utf8");

test("fixture 응답 파싱: totalCount·items", () => {
  const page = parseG2bResponse(fixtureBody);
  assert.equal(page.totalCount, 8);
  assert.equal(page.items.length, 8);
});

test("정규화: 필드 매핑·금액·지역·첨부", () => {
  const page = parseG2bResponse(fixtureBody);
  const source = {
    id: "g2b-servc",
    name: "나라장터 (용역)",
    type: "official-api" as const,
    baseUrl: "https://www.g2b.go.kr",
    enabled: true,
    priority: 1,
    categories: [],
    requiresApiKey: true,
    collectionMethod: "",
    termsReviewed: true,
    robotsReviewed: true,
  };
  const first = normalizeG2bItem(page.items[0], source);
  assert.ok(first);
  assert.equal(first.noticeNumber, "20260726001");
  assert.equal(first.estimatedAmount, 52_000_000);
  assert.deepEqual(first.regionRequirements, ["부산광역시"]);
  assert.equal(first.attachmentNames[0], "과업지시서.hwp");
  assert.equal(first.applicationDeadline, "2026-08-05 18:00");
});

test("XML 오류 응답(인증 실패)은 명확한 에러", () => {
  const xml =
    "<OpenAPI_ServiceResponse><cmmMsgHeader><returnAuthMsg>SERVICE_KEY_IS_NOT_REGISTERED_ERROR</returnAuthMsg></cmmMsgHeader></OpenAPI_ServiceResponse>";
  assert.throws(() => parseG2bResponse(xml), /SERVICE_KEY_IS_NOT_REGISTERED_ERROR/);
});

console.log("── nuri parser ──");

const nuriFixturePath = join(
  process.cwd(),
  "collector",
  "tests",
  "fixtures",
  "nuri-servc-sample.json",
);
const nuriFixtureBody = readFileSync(nuriFixturePath, "utf8");

test("누리장터 fixture: ntceNm·아파트단지 필드 정규화", () => {
  const page = parseG2bResponse(nuriFixtureBody);
  assert.equal(page.totalCount, 3);
  const source = {
    id: "nuri-servc",
    name: "누리장터 민간입찰 (용역)",
    type: "official-api" as const,
    baseUrl: "https://www.g2b.go.kr",
    enabled: true,
    priority: 1,
    categories: [],
    requiresApiKey: true,
    collectionMethod: "",
    termsReviewed: true,
    robotsReviewed: true,
    parserId: "nuri",
  };
  const first = normalizeNuriItem(page.items[0], source);
  assert.ok(first);
  assert.equal(first.noticeNumber, "P20260726001");
  assert.ok(first.title.includes("법무사 선정"));
  assert.ok(first.organization.includes("해운대센텀"));
  assert.equal(first.estimatedAmount, 28_000_000);
  assert.deepEqual(first.regionRequirements, ["부산광역시"]);
  assert.ok(first.bodyText?.includes("아파트단지"));
});

test("누리장터 아파트 법무사 선정은 후보·고득점", () => {
  const page = parseG2bResponse(nuriFixtureBody);
  const source = {
    id: "nuri-servc",
    name: "누리장터 민간입찰 (용역)",
    type: "official-api" as const,
    baseUrl: "https://www.g2b.go.kr",
    enabled: true,
    priority: 1,
    categories: [],
    requiresApiKey: true,
    collectionMethod: "",
    termsReviewed: true,
    robotsReviewed: true,
    parserId: "nuri",
  };
  const notice = normalizeNuriItem(page.items[0], source)!;
  // fixture 마감일은 고정값이라 시간이 지나면 urgency 감점으로 깨짐 → 상대 마감으로 고정
  notice.applicationDeadline = inFiveDays;
  const cls = classifyNotice(notice);
  assert.ok(isCandidate(cls));
  const score = scoreNotice(notice, cls);
  assert.ok(score.totalScore >= 70, `expected high score, got ${score.totalScore}`);
});

test("누리장터 무관 공고(승강기 유지보수)는 후보 제외", () => {
  const page = parseG2bResponse(nuriFixtureBody);
  const source = {
    id: "nuri-servc",
    name: "누리장터 민간입찰 (용역)",
    type: "official-api" as const,
    baseUrl: "https://www.g2b.go.kr",
    enabled: true,
    priority: 1,
    categories: [],
    requiresApiKey: true,
    collectionMethod: "",
    termsReviewed: true,
    robotsReviewed: true,
    parserId: "nuri",
  };
  const notice = normalizeNuriItem(page.items[2], source)!;
  const cls = classifyNotice(notice);
  assert.ok(!isCandidate(cls));
});

console.log("── email ──");

function emptyBriefing(): BriefingData {
  return {
    generatedAtKst: "2026-07-26 07:30",
    collectionWindow: { from: "2026-07-23 07:30", to: "2026-07-26 07:30" },
    summary: {
      fetchedTotal: 0,
      candidateTotal: 0,
      priorityCount: 0,
      deadlineSoonCount: 0,
      changedCount: 0,
      failedSources: [],
    },
    priorityItems: [],
    directBidItems: [],
    registrationLeads: [],
    collaborationItems: [],
    lectureItems: [],
    marketSignals: [],
    changedItems: [],
    runs: [],
  };
}

test("신규 공고 없음 제목", () => {
  assert.equal(buildSubject(emptyBriefing()), "[다옴 입찰브리핑] 신규 적합 공고 없음");
});

test("우선 검토 포함 제목", () => {
  const data = emptyBriefing();
  data.summary.candidateTotal = 12;
  data.summary.priorityCount = 3;
  assert.equal(
    buildSubject(data),
    "[다옴 입찰브리핑] 오늘 우선 검토 3건 · 신규 기회 12건",
  );
});

test("HTML 렌더링: 제목의 스크립트 태그가 escaping됨", () => {
  const data = emptyBriefing();
  const notice = makeNotice({
    title: `<script>alert("x")</script> 등기업무 법무사 선정`,
    noticeNumber: "X1",
  });
  const cls = classifyNotice(notice);
  const opp = toOpportunity(notice, cls, scoreNotice(notice, cls), new Date().toISOString());
  data.priorityItems = [opp];
  data.summary.candidateTotal = 1;
  const html = renderHtml(data);
  assert.ok(!html.includes("<script>alert"));
  assert.ok(html.includes("&lt;script&gt;"));
});

test("plain text 렌더링에 참가자격 원문 확인 고지 포함", () => {
  const text = renderText(emptyBriefing());
  assert.ok(text.includes("참가자격"));
  assert.ok(text.includes("원문"));
  assert.ok(text.includes("협업 필요"));
});

console.log(`\n결과: ${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
