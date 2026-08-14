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
  | "naver_place_click";

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
  }>;
  visitsByDay: Array<{
    date: string;
    visits: number;
    sessions?: number;
    submits: number;
    cta?: number;
    naverPlace?: number;
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
  }>;
  hourly7DayAvg?: Array<{ hour: number; pageViews: number }>;
  hourlyInsights?: {
    peakHourToday: number | null;
    peakViewsToday: number;
    peakHour7DayAvg: number | null;
    visitsSameHourVs7DayAvgPct: number | null;
  } | null;
  recentActivity?: Array<{
    id: string;
    at: string;
    path: string;
    eventType: string;
    referrerType: string;
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
};
