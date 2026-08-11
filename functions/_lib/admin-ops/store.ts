/**
 * ADMIN_KV store — notices, daily aggregates, email logs, audit.
 * Low-traffic single-admin design. No PII in analytics aggregates.
 */

import {
  addKstDays,
  formatKstDate,
  formatKstDateTime,
  kstDateRange,
  newId,
  normalizePath,
} from "./crypto";

const KEYS = {
  notices: "notices:all",
  emailLogs: "email:logs",
  audit: "audit:logs",
  jobs: "jobs:runs",
};

function emptyDay(date) {
  return {
    date,
    visits: 0,
    cta: 0,
    consultStart: 0,
    consultSubmit: 0,
    naverPlace: 0,
    naverPlaceReservation: 0,
    naverPlaceMap: 0,
    naverPlaceReview: 0,
    naverPlaceOther: 0,
    paths: {},
    sources: {},
    naverPlacePlacements: {},
  };
}

function emptyPath() {
  return {
    visits: 0,
    cta: 0,
    phone: 0,
    kakao: 0,
    naver: 0,
    consultStart: 0,
    consultSubmit: 0,
    naverPlace: 0,
    naverPlaceReservation: 0,
  };
}

export function hasKv(env) {
  return Boolean(env?.ADMIN_KV);
}

async function getJson(kv, key, fallback) {
  const raw = await kv.get(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

async function putJson(kv, key, value) {
  await kv.put(key, JSON.stringify(value));
}

export async function listNotices(env) {
  if (!hasKv(env)) return [];
  return getJson(env.ADMIN_KV, KEYS.notices, []);
}

export async function saveNotices(env, notices) {
  await putJson(env.ADMIN_KV, KEYS.notices, notices);
}

export function resolveNoticeStatus(notice, now = new Date()) {
  if (notice.status === "archived" || notice.status === "draft") return notice.status;
  const t = now.getTime();
  const start = notice.startAt ? Date.parse(notice.startAt) : null;
  const end = notice.endAt ? Date.parse(notice.endAt) : null;
  if (start && !Number.isNaN(start) && t < start) return "scheduled";
  if (end && !Number.isNaN(end) && t > end) return "expired";
  if (notice.status === "scheduled" && start && t >= start) return "active";
  if (notice.status === "active") return "active";
  if (!notice.startAt && notice.status === "active") return "active";
  return notice.status;
}

export function toPublicNotice(notice) {
  return {
    id: notice.id,
    title: notice.title,
    message: notice.message,
    position: notice.position,
    style: notice.style,
    ctaLabel: notice.ctaLabel,
    ctaUrl: notice.ctaUrl,
    dismissible: notice.dismissible,
    priority: notice.priority,
    updatedAt: notice.updatedAt,
  };
}

export async function getActivePublicNotices(env, path = "/") {
  const all = await listNotices(env);
  const now = new Date();
  const p = normalizePath(path);
  return all
    .map((n) => ({ ...n, status: resolveNoticeStatus(n, now) }))
    .filter((n) => n.status === "active")
    .filter((n) => {
      if (n.displayScope === "all") return true;
      if (n.displayScope === "home") return p === "/";
      if (n.displayScope === "selected-pages") {
        return (n.selectedPaths || []).some((x) => normalizePath(x) === p);
      }
      return false;
    })
    .sort((a, b) => b.priority - a.priority || b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, 3)
    .map(toPublicNotice);
}

export async function getDaily(env, date) {
  if (!hasKv(env)) return emptyDay(date);
  return getJson(env.ADMIN_KV, `analytics:day:${date}`, emptyDay(date));
}

export async function recordAnalyticsEvent(env, event) {
  if (!hasKv(env)) return { ok: false, reason: "no_storage" };
  const date = formatKstDate();
  const day = await getDaily(env, date);
  const path = normalizePath(event.path || "/");
  if (!day.paths[path]) day.paths[path] = emptyPath();
  const row = day.paths[path];

  switch (event.type) {
    case "page_view":
      day.visits += 1;
      row.visits += 1;
      break;
    case "cta_click":
      day.cta += 1;
      row.cta += 1;
      break;
    case "phone_click":
      day.cta += 1;
      row.phone += 1;
      row.cta += 1;
      break;
    case "kakao_click":
      day.cta += 1;
      row.kakao += 1;
      row.cta += 1;
      break;
    case "naver_click":
      day.cta += 1;
      row.naver += 1;
      row.cta += 1;
      break;
    case "consultation_start":
      day.consultStart += 1;
      row.consultStart += 1;
      break;
    case "consultation_submit":
    case "collaboration_submit":
    case "lecture_inquiry_submit":
      day.consultSubmit += 1;
      row.consultSubmit += 1;
      break;
    case "naver_place_click": {
      day.naverPlace = (day.naverPlace || 0) + 1;
      row.naverPlace = (row.naverPlace || 0) + 1;
      const variant = String(event.meta?.variant || "place");
      const placement = String(event.meta?.placement || "other").slice(0, 40);
      if (variant === "reservation") {
        day.naverPlaceReservation = (day.naverPlaceReservation || 0) + 1;
        row.naverPlaceReservation = (row.naverPlaceReservation || 0) + 1;
      } else if (variant === "map") {
        day.naverPlaceMap = (day.naverPlaceMap || 0) + 1;
      } else if (variant === "review") {
        day.naverPlaceReview = (day.naverPlaceReview || 0) + 1;
      } else {
        day.naverPlaceOther = (day.naverPlaceOther || 0) + 1;
      }
      if (!day.naverPlacePlacements) day.naverPlacePlacements = {};
      day.naverPlacePlacements[placement] =
        (day.naverPlacePlacements[placement] || 0) + 1;
      break;
    }
    default:
      break;
  }

  const source = event.referrerType || "direct";
  day.sources[source] = (day.sources[source] || 0) + (event.type === "page_view" ? 1 : 0);

  await putJson(env.ADMIN_KV, `analytics:day:${date}`, day);
  return { ok: true };
}

export async function appendEmailLog(env, entry) {
  if (!hasKv(env)) return;
  const logs = await getJson(env.ADMIN_KV, KEYS.emailLogs, []);
  logs.unshift(entry);
  await putJson(env.ADMIN_KV, KEYS.emailLogs, logs.slice(0, 500));
}

export async function listEmailLogs(env, limit = 50) {
  if (!hasKv(env)) return [];
  const logs = await getJson(env.ADMIN_KV, KEYS.emailLogs, []);
  return logs.slice(0, limit);
}

export async function appendAudit(env, entry) {
  if (!hasKv(env)) return;
  const logs = await getJson(env.ADMIN_KV, KEYS.audit, []);
  logs.unshift(entry);
  await putJson(env.ADMIN_KV, KEYS.audit, logs.slice(0, 200));
}

export async function listAudit(env, limit = 30) {
  if (!hasKv(env)) return [];
  const logs = await getJson(env.ADMIN_KV, KEYS.audit, []);
  return logs.slice(0, limit);
}

export async function buildDashboard(env) {
  const storageConfigured = hasKv(env);
  const today = formatKstDate();
  const yesterday = addKstDays(today, -1);
  const last7 = kstDateRange(7);
  const prev7 = kstDateRange(14).slice(0, 7);

  let visitsToday = null;
  let visitsYesterday = null;
  let visits7d = null;
  let visitsPrev7d = null;
  let consultSubmitToday = null;
  let emailSuccessToday = null;
  let emailFailedToday = null;
  let visitsByDay = [];
  let topPathsToday = [];
  let emailRecent = [];
  let recentAudit = [];
  let notices = [];
  let naverPlaceToday = null;
  let naverPlace7d = null;
  let naverReservationToday = null;
  let naverPlaceByPlacement = [];
  let naverPlaceTopPaths = [];

  if (storageConfigured) {
    const dayToday = await getDaily(env, today);
    const dayY = await getDaily(env, yesterday);
    visitsToday = dayToday.visits;
    visitsYesterday = dayY.visits;
    consultSubmitToday = dayToday.consultSubmit;
    naverPlaceToday = dayToday.naverPlace || 0;
    naverReservationToday = dayToday.naverPlaceReservation || 0;

    let v7 = 0;
    let vp = 0;
    let np7 = 0;
    const series = [];
    for (const d of last7) {
      const day = await getDaily(env, d);
      v7 += day.visits;
      np7 += day.naverPlace || 0;
      series.push({
        date: d,
        visits: day.visits,
        submits: day.consultSubmit,
        naverPlace: day.naverPlace || 0,
      });
    }
    for (const d of prev7) {
      const day = await getDaily(env, d);
      vp += day.visits;
    }
    visits7d = v7;
    visitsPrev7d = vp;
    naverPlace7d = np7;
    visitsByDay = series;

    topPathsToday = Object.entries(dayToday.paths)
      .map(([path, s]) => ({ path, visits: s.visits, cta: s.cta }))
      .sort((a, b) => b.visits - a.visits)
      .slice(0, 10);

    naverPlaceTopPaths = Object.entries(dayToday.paths)
      .map(([path, s]) => ({
        path,
        visits: s.visits || 0,
        naverPlace: s.naverPlace || 0,
        reservation: s.naverPlaceReservation || 0,
        ctr:
          s.visits > 0
            ? Math.round(((s.naverPlace || 0) / s.visits) * 1000) / 10
            : null,
      }))
      .filter((r) => r.naverPlace > 0)
      .sort((a, b) => b.naverPlace - a.naverPlace)
      .slice(0, 15);

    naverPlaceByPlacement = Object.entries(dayToday.naverPlacePlacements || {})
      .map(([placement, count]) => ({ placement, count }))
      .sort((a, b) => b.count - a.count);

    emailRecent = await listEmailLogs(env, 20);
    const allEmail = await listEmailLogs(env, 200);
    emailSuccessToday = allEmail.filter(
      (e) => e.status === "success" && isSameKstDay(e.timestamp, today),
    ).length;
    emailFailedToday = allEmail.filter(
      (e) => e.status === "failed" && isSameKstDay(e.timestamp, today),
    ).length;

    recentAudit = await listAudit(env, 15);
    notices = await listNotices(env);
  }

  const now = new Date();
  const activeNotices = notices
    .map((n) => ({ ...n, status: resolveNoticeStatus(n, now) }))
    .filter((n) => n.status === "active");

  const alerts = [];
  if (!storageConfigured) {
    alerts.push({
      id: "no-kv",
      level: "warning",
      title: "ADMIN_KV 미연결",
      detail: "Cloudflare KV 바인딩 ADMIN_KV를 연결하면 통계·공지·메일 로그가 저장됩니다.",
    });
  }
  if (emailFailedToday && emailFailedToday > 0) {
    alerts.push({
      id: "email-fail",
      level: "critical",
      title: `상담메일 실패 ${emailFailedToday}건`,
      detail: "Resend/Telegram 설정·도메인 인증·Secret을 확인하세요.",
    });
  }

  const health = [
    {
      id: "public-site",
      label: "Public Site",
      status: "ok",
      detail: "정적 배포(Pages)",
      checkedAt: formatKstDateTime(),
    },
    {
      id: "storage",
      label: "Admin Storage",
      status: storageConfigured ? "ok" : "warn",
      detail: storageConfigured ? "ADMIN_KV 연결됨" : "ADMIN_KV 없음",
      checkedAt: formatKstDateTime(),
    },
    {
      id: "email",
      label: "Email",
      status: emailFailedToday > 0 ? "warn" : "unknown",
      detail: storageConfigured
        ? `오늘 성공 ${emailSuccessToday ?? 0} / 실패 ${emailFailedToday ?? 0}`
        : "로그 저장소 없음 — Resend 대시보드 확인",
      checkedAt: formatKstDateTime(),
    },
    {
      id: "analytics",
      label: "Analytics",
      status: storageConfigured ? "ok" : "unknown",
      detail: storageConfigured ? "이벤트 집계 활성" : "수집 대기(KV 필요)",
      checkedAt: formatKstDateTime(),
    },
  ];

  const summaryParts = [
    `오늘 방문 ${visitsToday ?? "—"}`,
    `상담제출 ${consultSubmitToday ?? "—"}`,
    `네이버이동 ${naverPlaceToday ?? "—"}`,
    `메일실패 ${emailFailedToday ?? "—"}`,
    `경고 ${alerts.length}`,
  ];

  return {
    generatedAt: new Date().toISOString(),
    timezone: "Asia/Seoul",
    storageConfigured,
    kpis: {
      visitsToday,
      visitsYesterday,
      visits7d,
      visitsPrev7d,
      consultSubmitToday,
      emailSuccessToday,
      emailFailedToday,
      activeNotices: activeNotices.length,
      alertCount: alerts.length,
      naverPlaceToday,
      naverPlace7d,
      naverReservationToday,
    },
    summaryLine: summaryParts.join(" · "),
    alerts,
    topPathsToday,
    visitsByDay,
    emailRecent: emailRecent.slice(0, 10),
    activeNotices,
    health,
    recentAudit,
    naverPlaceByPlacement,
    naverPlaceTopPaths,
  };
}

function isSameKstDay(timestamp, ymd) {
  if (!timestamp) return false;
  if (timestamp.startsWith(ymd)) return true;
  // ko-KR format: 2026. 08. 11. ...
  const compact = ymd.replace(/-/g, "");
  const digits = String(timestamp).replace(/\D/g, "").slice(0, 8);
  return digits === compact;
}

export { emptyDay, KEYS, newId, formatKstDateTime, formatKstDate, kstDateRange };
