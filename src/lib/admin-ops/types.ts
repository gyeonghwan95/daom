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
  | "search_used";

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
  startAt?: string;
  endAt?: string;
  displayScope: "home" | "all" | "selected-pages";
  selectedPaths?: string[];
  position: "bottom-left" | "bottom-right" | "top";
  style: "info" | "notice" | "important" | "event";
  ctaLabel?: string;
  ctaUrl?: string;
  dismissible: boolean;
  priority: number;
  createdAt: string;
  updatedAt: string;
};

/** Public payload — no admin metadata */
export type PublicFloatingNotice = {
  id: string;
  title: string;
  message: string;
  position: FloatingNotice["position"];
  style: FloatingNotice["style"];
  ctaLabel?: string;
  ctaUrl?: string;
  dismissible: boolean;
  priority: number;
  updatedAt: string;
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
    consultSubmitToday: number | null;
    emailSuccessToday: number | null;
    emailFailedToday: number | null;
    activeNotices: number;
    alertCount: number;
  };
  summaryLine: string;
  alerts: Array<{
    id: string;
    level: "critical" | "warning" | "info";
    title: string;
    detail: string;
  }>;
  topPathsToday: Array<{ path: string; visits: number; cta: number }>;
  visitsByDay: Array<{ date: string; visits: number; submits: number }>;
  emailRecent: EmailLogEntry[];
  activeNotices: FloatingNotice[];
  health: HealthCard[];
  recentAudit: AdminAuditLog[];
};
