/**
 * 적합도 점수 — 관련성 40 + 수행가능성 25 + 긴급성 15 + 사업가치 20 = 100.
 *
 * 부산 1인 법무사사무소(config/office-profile.ts)의 운영 현실을 반영한다.
 * 점수는 참고용이며 참가자격은 반드시 원문 확인이 필요하다.
 */

import { EXCLUDE_KEYWORDS } from "../config/keywords";
import { OFFICE_PROFILE } from "../config/office-profile";
import type {
  ClassificationResult,
  RawNotice,
  Recommendation,
  ScoreResult,
} from "./types";
import { daysUntil, formatAmount } from "./util";

function relevanceScore(cls: ClassificationResult, reasons: string[]): number {
  // 원점수를 40점 만점으로 캡
  const score = Math.min(40, cls.relevanceRaw);
  if (cls.matchedKeywords.some((k) => k.includes("법무사"))) {
    reasons.push("법무사 직접 명시 공고");
  } else if (score >= 14) {
    reasons.push("등기·공탁·법원서류 직접 관련 키워드 매칭");
  } else if (score >= 8) {
    reasons.push("잠재 등기수요·연관 키워드 매칭");
  }
  return score;
}

function feasibilityScore(
  notice: RawNotice,
  cls: ClassificationResult,
  reasons: string[],
  risks: string[],
): number {
  let score = 0;
  const regions = notice.regionRequirements;
  const regionText = regions.join(" ");

  if (regions.length === 0) {
    score += 5;
    reasons.push("지역제한 미확인 — 원문 확인 필요");
  } else if (regionText.includes(OFFICE_PROFILE.region)) {
    score += 10;
    reasons.push(`${OFFICE_PROFILE.region} 지역 제한 충족`);
  } else if (OFFICE_PROFILE.nearbyRegions.some((r) => regionText.includes(r))) {
    score += 7;
    reasons.push("인접지역(경남·울산 등) 공고");
  } else if (OFFICE_PROFILE.remoteAvailable) {
    score += 3;
  } else {
    risks.push(`지역제한(${regionText}) — 참가 가능 여부 확인 필요`);
  }

  // 1인 수행 가능성: 대형 계약·컨소시엄 요구가 없으면 가점
  const amount = notice.estimatedAmount;
  if (amount === undefined || amount < OFFICE_PROFILE.largeContractThreshold) {
    score += 8;
  } else {
    score += 2;
    risks.push(`추정금액 ${formatAmount(amount)} — 1인 수행 물량 검토 필요`);
  }
  if (OFFICE_PROFILE.collaborationAvailable) score += 4;

  // 제외 키워드 감점
  let penalty = 0;
  for (const term of cls.excludedKeywords) {
    const entry = EXCLUDE_KEYWORDS.find((e) => e.term === term);
    if (!entry) continue;
    penalty += entry.penalty;
    risks.push(`${entry.reason} ("${term}")`);
  }
  score -= Math.min(20, penalty);

  return Math.max(-20, Math.min(25, score));
}

function urgencyScore(notice: RawNotice, reasons: string[], risks: string[]): number {
  const days = daysUntil(notice.applicationDeadline);
  if (days === undefined) return 0;
  if (days < 0) {
    risks.push("마감이 지난 공고");
    return -30;
  }
  if (days <= 3) {
    reasons.push(`마감 임박 (D-${days})`);
    return 15;
  }
  if (days <= 7) {
    reasons.push(`마감 7일 이내 (D-${days})`);
    return 10;
  }
  if (days <= 14) return 5;
  return 0;
}

function valueScore(notice: RawNotice, cls: ClassificationResult, reasons: string[]): number {
  let score = 0;
  const amount = notice.estimatedAmount;
  if (amount !== undefined) {
    if (amount >= 100_000_000) score += 8;
    else if (amount >= 30_000_000) score += 6;
    else if (amount >= 10_000_000) score += 4;
    else score += 2;
  }
  if (cls.subcategories.includes("집단등기")) {
    score += 8;
    reasons.push("집단등기·대량등기 가능성 — 사업가치 높음");
  }
  if (cls.category === "lecture") {
    score += 4;
    reasons.push("강의 수행 후 후속 업무 연결 가능성");
  }
  if (cls.category === "collaboration") score += 3;
  // 반복업무 가능성: 연간·단가 계약 표현
  if (/연간|단가계약|장기계속/.test(notice.title)) {
    score += 4;
    reasons.push("연간·장기 계약 — 반복업무 가능성");
  }
  return Math.min(20, score);
}

function recommend(total: number, cls: ClassificationResult): Recommendation {
  const hardBlocked = cls.excludedKeywords.some(
    (term) => EXCLUDE_KEYWORDS.find((e) => e.term === term)?.hardBlock,
  );
  if (hardBlocked) return "likely-ineligible";
  if (total >= 85) return "strong-review";
  if (total >= 70) return "review";
  if (total >= 55) return "collaboration";
  if (total >= 40) return "monitor";
  return "low-fit";
}

export const RECOMMENDATION_LABELS: Record<Recommendation, string> = {
  "strong-review": "오늘 우선 검토",
  review: "적극 검토",
  collaboration: "협업 포함 검토",
  monitor: "참고·모니터링",
  "low-fit": "낮은 적합도",
  "likely-ineligible": "참가자격 확인 필수",
};

export function scoreNotice(notice: RawNotice, cls: ClassificationResult): ScoreResult {
  const reasons: string[] = [...cls.reasons];
  const risks: string[] = [];

  const relevance = relevanceScore(cls, reasons);
  const feasibility = feasibilityScore(notice, cls, reasons, risks);
  const urgency = urgencyScore(notice, reasons, risks);
  const value = valueScore(notice, cls, reasons);
  const total = Math.max(0, Math.min(100, relevance + feasibility + urgency + value));

  return {
    relevanceScore: relevance,
    feasibilityScore: feasibility,
    urgencyScore: urgency,
    valueScore: value,
    totalScore: total,
    scoreReasons: reasons.slice(0, 5),
    risks,
    recommendation: recommend(total, cls),
  };
}
