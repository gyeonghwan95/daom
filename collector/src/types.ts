/**
 * 법무사 업무기회 데일리 브리핑 — 공통 타입 정의.
 *
 * 모든 수집 소스의 데이터는 Opportunity 하나의 표준 형식으로 정규화된다.
 * 금액·날짜 등 확인되지 않은 값은 0/""으로 채우지 않고 undefined로 둔다.
 */

export type BidSourceType =
  | "official-api"
  | "open-data"
  | "rss"
  | "public-html"
  | "manual-link"
  | "email-forward";

export type BidSource = {
  id: string;
  name: string;
  organization?: string;
  type: BidSourceType;
  baseUrl: string;
  apiUrl?: string;
  enabled: boolean;
  priority: number;
  categories: string[];
  regions?: string[];
  requiresApiKey: boolean;
  secretEnvName?: string;
  collectionMethod: string;
  termsReviewed: boolean;
  robotsReviewed: boolean;
  requestIntervalMs?: number;
  parserId?: string;
  notes?: string;
  /** 페이지네이션 상한. 미지정 시 수집기 기본값(30). */
  maxPages?: number;
};

export type OpportunityCategory =
  | "direct-bid"
  | "registration"
  | "corporate"
  | "real-estate"
  | "trust"
  | "auction-public-sale"
  | "debt-court-document"
  | "lecture"
  | "collaboration"
  | "market-signal"
  | "other";

export type OpportunityStatus =
  | "new"
  | "updated"
  | "corrected"
  | "cancelled"
  | "closed"
  | "awarded";

export type Recommendation =
  | "strong-review"
  | "review"
  | "collaboration"
  | "monitor"
  | "low-fit"
  | "likely-ineligible";

export type Opportunity = {
  id: string;
  sourceId: string;
  sourceName: string;
  externalId?: string;
  noticeNumber?: string;
  revision?: string;
  title: string;
  organization: string;
  demandOrganization?: string;
  department?: string;
  category: OpportunityCategory;
  subcategories: string[];
  publishedAt?: string;
  applicationStartAt?: string;
  applicationDeadline?: string;
  openingAt?: string;
  estimatedAmount?: number;
  currency?: "KRW";
  regionRequirements: string[];
  qualificationRequirements: string[];
  performanceRequirements: string[];
  personnelRequirements: string[];
  depositRequirements?: string[];
  jointVenture?: boolean;
  visitRequired?: boolean;
  briefingRequired?: boolean;
  originalUrl: string;
  attachmentUrls: string[];
  attachmentNames: string[];
  status: OpportunityStatus;
  matchedKeywords: string[];
  excludedKeywords: string[];
  relevanceScore: number;
  feasibilityScore: number;
  urgencyScore: number;
  valueScore: number;
  totalScore: number;
  scoreReasons: string[];
  risks: string[];
  recommendation: Recommendation;
  previousVersionId?: string;
  firstSeenAt: string;
  lastSeenAt: string;
  contentHash: string;
  collectedAt: string;
};

/** 정규화 직후, 분류·점수화 이전의 중간 형태 */
export type RawNotice = {
  sourceId: string;
  sourceName: string;
  externalId?: string;
  noticeNumber?: string;
  revision?: string;
  title: string;
  organization: string;
  demandOrganization?: string;
  bodyText?: string;
  publishedAt?: string;
  applicationStartAt?: string;
  applicationDeadline?: string;
  openingAt?: string;
  estimatedAmount?: number;
  regionRequirements: string[];
  qualificationRequirements: string[];
  contractMethod?: string;
  noticeKind?: string;
  isReNotice?: boolean;
  originalUrl: string;
  attachmentUrls: string[];
  attachmentNames: string[];
  raw?: Record<string, unknown>;
};

export type CollectionRun = {
  runId: string;
  startedAt: string;
  finishedAt?: string;
  sourceId: string;
  status: "success" | "partial" | "failed" | "skipped";
  fetchedCount: number;
  newCount: number;
  updatedCount: number;
  errorCode?: string;
  errorMessage?: string;
  responseStatus?: number;
  durationMs: number;
};

/** 동일 공고의 정정·마감연장·취소 등 변경 요약 */
export type OpportunityChange = {
  opportunityId: string;
  title: string;
  organization: string;
  originalUrl: string;
  changes: string[];
  changedAt: string;
};

export type ClassificationResult = {
  category: OpportunityCategory;
  subcategories: string[];
  matchedKeywords: string[];
  excludedKeywords: string[];
  reasons: string[];
  /** 규칙 기반 관련성 원점수 (score.ts에서 40점 만점으로 캡) */
  relevanceRaw: number;
};

export type ScoreResult = {
  relevanceScore: number;
  feasibilityScore: number;
  urgencyScore: number;
  valueScore: number;
  totalScore: number;
  scoreReasons: string[];
  risks: string[];
  recommendation: Recommendation;
};

export type BriefingData = {
  generatedAtKst: string;
  collectionWindow: { from: string; to: string };
  summary: {
    fetchedTotal: number;
    candidateTotal: number;
    priorityCount: number;
    deadlineSoonCount: number;
    changedCount: number;
    failedSources: string[];
  };
  priorityItems: Opportunity[];
  directBidItems: Opportunity[];
  registrationLeads: Opportunity[];
  collaborationItems: Opportunity[];
  lectureItems: Opportunity[];
  courtDocumentItems: Opportunity[];
  corporateItems: Opportunity[];
  marketSignals: Opportunity[];
  changedItems: OpportunityChange[];
  runs: CollectionRun[];
};

export type CollectorState = {
  version: 1;
  /** id → 저장된 기회 (최신 버전) */
  opportunities: Record<string, Opportunity>;
  /** 최근 실행 로그 (최대 200건 유지) */
  runs: CollectionRun[];
  /** 중복 메일 방지: 마지막 발송 KST 날짜 (YYYY-MM-DD) */
  lastEmailKstDate?: string;
};
