/**
 * Admin Ops — shared types (client + server safe).
 * No secrets. No PII in analytics event payloads.
 */

export type AdminRole = "OWNER_ADMIN";

export type AnalyticsEventType =
  | "page_view"
  | "cta_click"
  | "phone_click"
  | "kakao_click"
  | "naver_click"
  | "consultation_start"
  | "consultation_submit"
  | "collaboration_submit"
  | "lecture_inquiry_submit"
  | "notice_impression"
  | "notice_click"
  | "notice_dismiss"
  | "search_used"
  | "tool_used"
  | "diagnosis_complete"
  | "naver_place_click";

/** 세션 진입 정보 — 첫 page_view에서 정해지고 같은 세션의 모든 이벤트에 붙는다. */
export type AcquisitionEntry = {
  /** 진입 채널 (naver·google·daum·bing·ai·sns·external·campaign·direct·internal) */
  ch: string;
  /** referrer 호스트 (www. 제거) */
  host?: string;
  us?: string;
  um?: string;
  uc?: string;
  /** 랜딩 경로 */
  lp: string;
};

/** 유입 지표 묶음. s=진입 세션, eng=참여 세션, cv=상담 연결 세션, m=모바일 진입. */
export type AcquisitionMetrics = {
  s: number;
  pv: number;
  eng: number;
  cv: number;
  m: number;
  phone: number;
  kakao: number;
  talk: number;
  reserve: number;
  place: number;
  submit: number;
  cta: number;
  start: number;
  /** phone + kakao + talk + reserve + submit */
  contacts: number;
};

export type AcquisitionTotals = AcquisitionMetrics & {
  /** sources 기준 외부 진입 세션 (수집 개편 이전 날짜 포함) */
  sessions: number;
  internalSessions: number;
  pageViews: number;
  /** acq 수집 이후 날짜의 외부 진입 세션 — 비율 계산 분모 */
  acqSessions: number;
};

export type AcquisitionChannelRow = AcquisitionMetrics & {
  id: string;
  sessions: number;
  prevSessions: number | null;
  prevConverted: number | null;
  prevAcqSessions: number | null;
};

export type AcquisitionDimensionRow = AcquisitionMetrics & {
  key: string;
  prevSessions: number | null;
  /** 랜딩별 진입 채널 구성 */
  mix?: Record<string, number>;
};

export type AcquisitionReport = {
  generatedAt: string;
  timezone: "Asia/Seoul";
  storageConfigured: boolean;
  periods: number[];
  range: { start: string; end: string; days: number };
  compareRange: { start: string; end: string } | null;
  coverage: { days: number; acqDays: number; firstAcqDate: string | null };
  totals: AcquisitionTotals;
  prevTotals: AcquisitionTotals | null;
  channels: AcquisitionChannelRow[];
  daily: Array<{
    date: string;
    pageViews: number;
    sessions: number;
    byChannel: Record<string, number>;
    contacts: number | null;
    converted: number | null;
    hasAcq: boolean;
  }>;
  referrers: Array<AcquisitionDimensionRow & { host: string; channel: string }>;
  landings: Array<AcquisitionDimensionRow & { path: string }>;
  campaigns: Array<
    AcquisitionDimensionRow & { source: string; medium: string; campaign: string }
  >;
  /** [월..일][0..23] 페이지뷰 */
  weekHour: number[][];
  devices: { mobile: number; desktop: number; unknown: number };
};

export type AnalyticsEventInput = {
  type: AnalyticsEventType;
  path: string;
  referrerHost?: string;
  referrerType?: string;
  campaign?: string;
  deviceType?: "mobile" | "desktop" | "unknown";
  meta?: Record<string, string>;
};

export type FloatingNoticeStatus =
  | "draft"
  | "scheduled"
  | "active"
  | "expired"
  | "archived";

export type FloatingNotice = {
  id: string;
  title: string;
  message: string;
  status: FloatingNoticeStatus;
  /** Public display / sort date (ISO). Falls back to createdAt. */
  publishedAt?: string;
  startAt?: string;
  endAt?: string;
  displayScope: "home" | "all" | "selected-pages";
  selectedPaths?: string[];
  /** @deprecated Corner toast positions — popup is always centered modal. */
  position: "bottom-left" | "bottom-right" | "top";
  style: "info" | "notice" | "important" | "event";
  ctaLabel?: string;
  ctaUrl?: string;
  dismissible: boolean;
  priority: number;
  /** Show centered popup when active. Default true. */
  showPopup?: boolean;
  /** Appear on public /공지사항 archive when expired/archived. Default true. */
  isPublicArchive?: boolean;
  createdAt: string;
  updatedAt: string;
};

/** Public payload — no admin metadata */
export type PublicFloatingNotice = {
  id: string;
  title: string;
  message: string;
  style: FloatingNotice["style"];
  ctaLabel?: string;
  ctaUrl?: string;
  dismissible: boolean;
  priority: number;
  publishedAt: string;
  updatedAt: string;
  detailPath: string;
};

export type PublicNoticeListItem = {
  id: string;
  title: string;
  publishedAt: string;
  status: "active" | "expired" | "archived";
  summary: string;
};

export type EmailLogStatus = "success" | "failed" | "skipped";

export type EmailLogEntry = {
  id: string;
  timestamp: string;
  messageType: string;
  provider: "resend" | "telegram" | "unknown";
  recipientMasked: string;
  status: EmailLogStatus;
  providerMessageId?: string;
  errorSummary?: string;
  path?: string;
};

export type AdminAuditLog = {
  id: string;
  action: string;
  entityType?: string;
  entityId?: string;
  createdAt: string;
  summary: string;
};

export type HealthStatus = "ok" | "warn" | "down" | "unknown";

export type HealthCard = {
  id: string;
  label: string;
  status: HealthStatus;
  detail?: string;
  checkedAt?: string;
};

export type DailyPathStats = {
  visits: number;
  cta: number;
  phone: number;
  kakao: number;
  naver: number;
  consultStart: number;
  consultSubmit: number;
  mobile?: number;
  desktop?: number;
};

export type DailyAggregate = {
  date: string; // YYYY-MM-DD (KST)
  visits: number;
  cta: number;
  consultStart: number;
  consultSubmit: number;
  paths: Record<string, DailyPathStats>;
  sources: Record<string, number>;
};

export type DashboardPayload = {
  generatedAt: string;
  timezone: "Asia/Seoul";
  storageConfigured: boolean;
  kpis: {
    visitsToday: number | null;
    visitsYesterday: number | null;
    visits7d: number | null;
    visitsPrev7d: number | null;
    sessionsToday?: number | null;
    sessionsYesterday?: number | null;
    sessions7d?: number | null;
    ctaToday?: number | null;
    consultStartToday?: number | null;
    consultSubmitToday: number | null;
    emailSuccessToday: number | null;
    emailFailedToday: number | null;
    activeNotices: number;
    alertCount: number;
    naverPlaceToday?: number | null;
    naverPlace7d?: number | null;
    naverReservationToday?: number | null;
    visitsSameHourVs7DayAvgPct?: number | null;
    searchUsedToday?: number | null;
    toolUsedToday?: number | null;
    diagnosisCompleteToday?: number | null;
  };
  summaryLine: string;
  alerts: Array<{
    id: string;
    level: "critical" | "warning" | "info";
    title: string;
    detail: string;
    href?: string;
  }>;
  topPathsToday: Array<{
    path: string;
    visits: number;
    cta: number;
    consultSubmit?: number;
    naverPlace?: number;
    mobile?: number;
    desktop?: number;
  }>;
  visitsByDay: Array<{
    date: string;
    visits: number;
    sessions?: number;
    submits: number;
    cta?: number;
    naverPlace?: number;
    mobile?: number;
    desktop?: number;
    sources?: Record<string, number>;
  }>;
  emailRecent: EmailLogEntry[];
  activeNotices: FloatingNotice[];
  health: HealthCard[];
  recentAudit: AdminAuditLog[];
  naverPlaceByPlacement?: Array<{ placement: string; count: number }>;
  naverPlaceTopPaths?: Array<{
    path: string;
    visits: number;
    naverPlace: number;
    reservation: number;
    ctr: number | null;
  }>;
  sourcesToday?: Array<{ source: string; count: number }>;
  devicesToday?: { mobile: number; desktop: number; unknown: number };
  hourlyToday?: Array<{
    hour: number;
    pageViews: number;
    cta: number;
    consultSubmit: number;
    naverPlace: number;
    sources?: Record<string, number>;
  }>;
  hourlyYesterday?: Array<{
    hour: number;
    pageViews: number;
    cta: number;
    consultSubmit: number;
    naverPlace: number;
    sources?: Record<string, number>;
  }>;
  hourly7DayAvg?: Array<{ hour: number; pageViews: number }>;
  hourlyInsights?: {
    peakHourToday: number | null;
    peakViewsToday: number;
    peakHourYesterday: number | null;
    peakViewsYesterday: number;
    peakHour7DayAvg: number | null;
    visitsSameHourVs7DayAvgPct: number | null;
  } | null;
  recentActivity?: Array<{
    id: string;
    at: string;
    path: string;
    eventType: string;
    referrerType: string;
    deviceType?: "mobile" | "desktop" | "unknown";
    meta?: Record<string, string>;
  }>;
  funnelToday?: {
    pageViews: number;
    cta: number;
    consultStart: number;
    consultSubmit: number;
    mailSuccess: number | null;
  } | null;
  lastEventAt?: string | null;
  lastEventAgeMinutes?: number | null;
  ingestToday?: {
    stored: number;
    skippedAdminSession: number;
    skippedDedupe: number;
    skippedAdminPath: number;
    skippedEmptyUa: number;
    skippedNoKv: number;
    badRequest: number;
    invalidType: number;
    rateLimited: number;
    storeError: number;
    lastAt?: string | null;
    lastReason?: string | null;
  } | null;
  noticeToday?: {
    impression: number;
    click: number;
    dismiss: number;
  } | null;
  notifyChannels?: { telegram: boolean; email: boolean };
};
