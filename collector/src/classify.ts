/**
 * 규칙 기반 분류 — 키워드 사전 + 의미 기반 규칙으로
 * 카테고리·매칭 키워드·관련성 원점수를 계산한다.
 */

import {
  ALL_POSITIVE_KEYWORDS,
  EXCLUDE_KEYWORDS,
  SEMANTIC_RULES,
  STRONG_KEYWORDS,
} from "../config/keywords";
import type {
  ClassificationResult,
  OpportunityCategory,
  RawNotice,
} from "./types";

/** 공백 차이를 무시하고 키워드를 찾는다 ("등기 업무" ↔ "등기업무"). */
function containsTerm(haystackCompact: string, term: string): boolean {
  return haystackCompact.includes(term.replace(/\s+/g, ""));
}

/**
 * 공동주택 시설관리성 공고(승강기·청소 등)는 관리사무소 키워드만으로
 * 후보에 올리지 않는다. 등기·법무사·강의 등 강한 신호가 있을 때만 통과.
 */
const FACILITY_NOISE =
  /(승강기|엘리베이터|청소|경비|시설관리|유지보수|조경|주차관제|주차관리|소방설비|방수공사|CCTV)/;

export function classifyNotice(notice: RawNotice): ClassificationResult {
  const text = [notice.title, notice.organization, notice.bodyText ?? ""].join("\n");
  const compact = text.replace(/\s+/g, "");

  const matched: string[] = [];
  const reasons: string[] = [];
  const categoryVotes = new Map<OpportunityCategory, number>();
  const subcategories = new Set<string>();
  let relevanceRaw = 0;
  let hasStrongSignal = false;

  for (const entry of ALL_POSITIVE_KEYWORDS) {
    if (!containsTerm(compact, entry.term)) continue;
    matched.push(entry.term);
    relevanceRaw += entry.weight;
    if (STRONG_KEYWORDS.some((s) => s.term === entry.term)) hasStrongSignal = true;
    if (entry.category === "registration" && entry.weight >= 12) hasStrongSignal = true;
    if (entry.category) {
      categoryVotes.set(
        entry.category,
        (categoryVotes.get(entry.category) ?? 0) + entry.weight,
      );
    }
    if (entry.subcategory) subcategories.add(entry.subcategory);
  }

  for (const rule of SEMANTIC_RULES) {
    if (!rule.pattern.test(text)) continue;
    matched.push(`규칙:${rule.id}`);
    relevanceRaw += rule.weight;
    hasStrongSignal = true;
    reasons.push(rule.reason);
    categoryVotes.set(
      rule.category,
      (categoryVotes.get(rule.category) ?? 0) + rule.weight,
    );
    if (rule.subcategory) subcategories.add(rule.subcategory);
  }

  // 시설관리 노이즈: 강한 법무·등기 신호가 없으면 후보에서 제외
  if (FACILITY_NOISE.test(text) && !hasStrongSignal) {
    relevanceRaw = 0;
    reasons.push("시설관리·유지보수성 공고로 판단 — 법무 관련 신호 없음");
  }

  const excluded: string[] = [];
  for (const entry of EXCLUDE_KEYWORDS) {
    if (containsTerm(compact, entry.term)) excluded.push(entry.term);
  }

  let category: OpportunityCategory = "other";
  let best = 0;
  for (const [cat, votes] of categoryVotes) {
    if (votes > best) {
      best = votes;
      category = cat;
    }
  }
  // "법무사" 직접 언급 공고는 카테고리와 무관하게 직접입찰 후보로 본다.
  if (containsTerm(compact, "법무사") && category !== "lecture") {
    category = "direct-bid";
  }

  return {
    category,
    subcategories: [...subcategories],
    matchedKeywords: matched,
    excludedKeywords: excluded,
    reasons,
    relevanceRaw,
  };
}

/** 브리핑 후보로 볼 최소 관련성 원점수 */
export const CANDIDATE_MIN_RELEVANCE = 8;

export function isCandidate(result: ClassificationResult): boolean {
  return result.relevanceRaw >= CANDIDATE_MIN_RELEVANCE;
}
