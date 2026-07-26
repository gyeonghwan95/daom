/**
 * 중복·정정·재공고 처리.
 *
 * 중복 키 우선순위:
 * 1. sourceId + 공고번호 + 차수
 * 2. 공식 externalId
 * 3. 기관 + 제목 + 마감일
 * 4. contentHash
 *
 * 동일 공고번호의 차수 변경·정정·취소·재공고는 신규 공고로 반복 발송하지 않고
 * 변경점만 요약한다.
 */

import type {
  ClassificationResult,
  Opportunity,
  OpportunityChange,
  OpportunityStatus,
  RawNotice,
  ScoreResult,
} from "./types";
import { sha256 } from "./util";

export function opportunityId(notice: RawNotice): string {
  if (notice.noticeNumber) {
    // 차수는 키에 포함하지 않는다 — 같은 공고의 차수 변경을 update로 추적하기 위함
    return `${notice.sourceId}:${notice.noticeNumber}`;
  }
  if (notice.externalId) return `${notice.sourceId}:${notice.externalId}`;
  return `${notice.sourceId}:${sha256(
    [notice.organization, notice.title, notice.applicationDeadline ?? ""].join("|"),
  ).slice(0, 16)}`;
}

export function contentHash(notice: RawNotice): string {
  return sha256(
    [
      notice.title,
      notice.organization,
      notice.revision ?? "",
      notice.noticeKind ?? "",
      notice.applicationDeadline ?? "",
      notice.openingAt ?? "",
      notice.estimatedAmount?.toString() ?? "",
      notice.attachmentNames.join(","),
    ].join("|"),
  );
}

function statusFromNotice(notice: RawNotice, isUpdate: boolean): OpportunityStatus {
  const kind = notice.noticeKind ?? "";
  if (kind.includes("취소")) return "cancelled";
  if (kind.includes("정정")) return isUpdate ? "corrected" : "new";
  if (isUpdate) return "updated";
  return "new";
}

export function toOpportunity(
  notice: RawNotice,
  cls: ClassificationResult,
  score: ScoreResult,
  nowIso: string,
): Opportunity {
  return {
    id: opportunityId(notice),
    sourceId: notice.sourceId,
    sourceName: notice.sourceName,
    externalId: notice.externalId,
    noticeNumber: notice.noticeNumber,
    revision: notice.revision,
    title: notice.title,
    organization: notice.organization,
    demandOrganization: notice.demandOrganization,
    category: cls.category,
    subcategories: cls.subcategories,
    publishedAt: notice.publishedAt,
    applicationStartAt: notice.applicationStartAt,
    applicationDeadline: notice.applicationDeadline,
    openingAt: notice.openingAt,
    estimatedAmount: notice.estimatedAmount,
    currency: notice.estimatedAmount !== undefined ? "KRW" : undefined,
    regionRequirements: notice.regionRequirements,
    qualificationRequirements: notice.qualificationRequirements,
    performanceRequirements: [],
    personnelRequirements: [],
    originalUrl: notice.originalUrl,
    attachmentUrls: notice.attachmentUrls,
    attachmentNames: notice.attachmentNames,
    status: statusFromNotice(notice, false),
    matchedKeywords: cls.matchedKeywords,
    excludedKeywords: cls.excludedKeywords,
    relevanceScore: score.relevanceScore,
    feasibilityScore: score.feasibilityScore,
    urgencyScore: score.urgencyScore,
    valueScore: score.valueScore,
    totalScore: score.totalScore,
    scoreReasons: score.scoreReasons,
    risks: score.risks,
    recommendation: score.recommendation,
    firstSeenAt: nowIso,
    lastSeenAt: nowIso,
    contentHash: contentHash(notice),
    collectedAt: nowIso,
  };
}

export type MergeResult = {
  merged: Opportunity;
  isNew: boolean;
  change?: OpportunityChange;
};

/** 기존 저장분과 병합하고 변경점을 요약한다. */
export function mergeWithExisting(
  incoming: Opportunity,
  existing: Opportunity | undefined,
  nowIso: string,
): MergeResult {
  if (!existing) {
    return { merged: incoming, isNew: true };
  }

  const changes: string[] = [];
  if (existing.contentHash !== incoming.contentHash) {
    if (existing.applicationDeadline !== incoming.applicationDeadline) {
      changes.push(
        `마감일 ${existing.applicationDeadline ?? "미정"} → ${incoming.applicationDeadline ?? "미정"}`,
      );
    }
    if (existing.title !== incoming.title) changes.push("공고 제목 변경");
    if (existing.revision !== incoming.revision) {
      changes.push(`차수 ${existing.revision ?? "00"} → ${incoming.revision ?? "00"}`);
    }
    if (existing.estimatedAmount !== incoming.estimatedAmount) changes.push("금액 변경");
    if (existing.attachmentNames.join(",") !== incoming.attachmentNames.join(",")) {
      changes.push("첨부파일 변경");
    }
    if (changes.length === 0) changes.push("공고 내용 변경 (원문 확인 필요)");
  }
  if (incoming.status === "cancelled" && existing.status !== "cancelled") {
    changes.push("공고 취소");
  }

  const merged: Opportunity = {
    ...incoming,
    status:
      changes.length > 0
        ? incoming.status === "cancelled"
          ? "cancelled"
          : "updated"
        : existing.status,
    firstSeenAt: existing.firstSeenAt,
    previousVersionId: changes.length > 0 ? existing.contentHash : existing.previousVersionId,
    lastSeenAt: nowIso,
  };

  return {
    merged,
    isNew: false,
    change:
      changes.length > 0
        ? {
            opportunityId: merged.id,
            title: merged.title,
            organization: merged.organization,
            originalUrl: merged.originalUrl,
            changes,
            changedAt: nowIso,
          }
        : undefined,
  };
}
