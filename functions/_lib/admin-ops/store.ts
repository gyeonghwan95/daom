/**
 * ADMIN_KV store — notices, daily aggregates, email logs, audit.
 * Low-traffic single-admin design. No PII in analytics aggregates.
 */

import {
  addKstDays,
  formatKstDate,
  formatKstDateTime,
  getKstHour,
  kstDateRange,
  newId,
  normalizePath,
} from "./crypto";

const KEYS = {
  notices: "notices:all",
  emailLogs: "email:logs",
  audit: "audit:logs",
  jobs: "jobs:runs",
  recentActivity: "analytics:recent",
};

/** KV read-modify-write 충돌을 줄이기 위한 일별 샤드 수. 레거시 키도 읽기 병합. */
const ANALYTICS_SHARDS = 8;

function analyticsShard(ip) {
  const s = String(ip || "unknown");
  let h = 0;
  for (let i = 0; i < s.length; i += 1) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h % ANALYTICS_SHARDS;
}

function dayKey(date, shard) {
  return shard == null ? `analytics:day:${date}` : `analytics:day:${date}:s${shard}`;
}

function hourlyKey(date, shard) {
  return shard == null
    ? `analytics:hourly:${date}`
    : `analytics:hourly:${date}:s${shard}`;
}

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
    devices: { mobile: 0, desktop: 0, unknown: 0 },
    naverPlacePlacements: {},
    notices: {},
    lastEventAt: null,
  };
}

function emptyHourlyDay(date) {
  const hours = {};
  for (let h = 0; h < 24; h += 1) {
    hours[String(h)] = {
      pageViews: 0,
      cta: 0,
      consultSubmit: 0,
      naverPlace: 0,
    };
  }
  return { date, hours };
}

function mergePathRow(target, source) {
  target.visits += source.visits || 0;
  target.cta += source.cta || 0;
  target.phone += source.phone || 0;
  target.kakao += source.kakao || 0;
  target.naver += source.naver || 0;
  target.consultStart += source.consultStart || 0;
  target.consultSubmit += source.consultSubmit || 0;
  target.naverPlace = (target.naverPlace || 0) + (source.naverPlace || 0);
  target.naverPlaceReservation =
    (target.naverPlaceReservation || 0) + (source.naverPlaceReservation || 0);
}

/** Merge encoded/decoded duplicate path keys for display aggregation */
export function mergePathStats(paths) {
  const merged = {};
  for (const [rawPath, stats] of Object.entries(paths || {})) {
    const key = normalizePath(rawPath);
    if (!merged[key]) merged[key] = emptyPath();
    mergePathRow(merged[key], stats);
  }
  return merged;
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

function addNum(a, b) {
  return (a || 0) + (b || 0);
}

function mergeDay(target, source) {
  if (!source) return target;
  target.visits = addNum(target.visits, source.visits);
  target.cta = addNum(target.cta, source.cta);
  target.consultStart = addNum(target.consultStart, source.consultStart);
  target.consultSubmit = addNum(target.consultSubmit, source.consultSubmit);
  target.naverPlace = addNum(target.naverPlace, source.naverPlace);
  target.naverPlaceReservation = addNum(
    target.naverPlaceReservation,
    source.naverPlaceReservation,
  );
  target.naverPlaceMap = addNum(target.naverPlaceMap, source.naverPlaceMap);
  target.naverPlaceReview = addNum(target.naverPlaceReview, source.naverPlaceReview);
  target.naverPlaceOther = addNum(target.naverPlaceOther, source.naverPlaceOther);
  if (!target.devices) target.devices = { mobile: 0, desktop: 0, unknown: 0 };
  if (source.devices) {
    target.devices.mobile = addNum(target.devices.mobile, source.devices.mobile);
    target.devices.desktop = addNum(target.devices.desktop, source.devices.desktop);
    target.devices.unknown = addNum(target.devices.unknown, source.devices.unknown);
  }
  if (!target.sources) target.sources = {};
  for (const [k, v] of Object.entries(source.sources || {})) {
    target.sources[k] = addNum(target.sources[k], v);
  }
  if (!target.naverPlacePlacements) target.naverPlacePlacements = {};
  for (const [k, v] of Object.entries(source.naverPlacePlacements || {})) {
    target.naverPlacePlacements[k] = addNum(target.naverPlacePlacements[k], v);
  }
  if (!target.notices) target.notices = {};
  for (const [id, row] of Object.entries(source.notices || {})) {
    if (!target.notices[id]) target.notices[id] = { impression: 0, click: 0, dismiss: 0 };
    target.notices[id].impression = addNum(target.notices[id].impression, row.impression);
    target.notices[id].click = addNum(target.notices[id].click, row.click);
    target.notices[id].dismiss = addNum(target.notices[id].dismiss, row.dismiss);
  }
  if (!target.paths) target.paths = {};
  for (const [path, stats] of Object.entries(source.paths || {})) {
    if (!target.paths[path]) target.paths[path] = emptyPath();
    mergePathRow(target.paths[path], stats);
  }
  if (source.lastEventAt) {
    if (!target.lastEventAt || source.lastEventAt > target.lastEventAt) {
      target.lastEventAt = source.lastEventAt;
    }
  }
  return target;
}

function mergeHourly(target, source) {
  if (!source?.hours) return target;
  if (!target.hours) target.hours = emptyHourlyDay(target.date).hours;
  for (const [hour, row] of Object.entries(source.hours)) {
    if (!target.hours[hour]) {
      target.hours[hour] = { pageViews: 0, cta: 0, consultSubmit: 0, naverPlace: 0 };
    }
    target.hours[hour].pageViews = addNum(target.hours[hour].pageViews, row.pageViews);
    target.hours[hour].cta = addNum(target.hours[hour].cta, row.cta);
    target.hours[hour].consultSubmit = addNum(
      target.hours[hour].consultSubmit,
      row.consultSubmit,
    );
    target.hours[hour].naverPlace = addNum(target.hours[hour].naverPlace, row.naverPlace);
  }
  return target;
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
  const publishedAt =
    notice.publishedAt || notice.startAt || notice.createdAt || notice.updatedAt;
  return {
    id: notice.id,
    title: notice.title,
    message: notice.message,
    style: notice.style || "notice",
    ctaLabel: notice.ctaLabel,
    ctaUrl: notice.ctaUrl,
    dismissible: notice.dismissible !== false,
    priority: notice.priority || 0,
    publishedAt,
    updatedAt: notice.updatedAt,
    detailPath: `/공지사항/보기?id=${encodeURIComponent(notice.id)}`,
  };
}

export async function getActivePublicNotices(env, path = "/") {
  const all = await listNotices(env);
  const now = new Date();
  const p = normalizePath(path);
  return all
    .map((n) => ({ ...n, status: resolveNoticeStatus(n, now) }))
    .filter((n) => n.status === "active")
    .filter((n) => n.showPopup !== false)
    .filter((n) => {
      if (n.displayScope === "all") return true;
      if (n.displayScope === "home") return p === "/";
      if (n.displayScope === "selected-pages") {
        return (n.selectedPaths || []).some((x) => normalizePath(x) === p);
      }
      return false;
    })
    .sort((a, b) => b.priority - a.priority || b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, 1)
    .map(toPublicNotice);
}

/** Notices eligible for public archive list / detail. */
export function isPublicListable(notice, now = new Date()) {
  const status = resolveNoticeStatus(notice, now);
  if (status === "draft" || status === "scheduled") return false;
  if (status === "active") return true;
  if (status === "expired" || status === "archived") {
    return notice.isPublicArchive !== false;
  }
  return false;
}

export async function listPublicNotices(env) {
  const all = await listNotices(env);
  const now = new Date();
  return all
    .map((n) => ({ ...n, status: resolveNoticeStatus(n, now) }))
    .filter((n) => isPublicListable(n, now))
    .sort((a, b) => {
      const pa = a.publishedAt || a.createdAt || "";
      const pb = b.publishedAt || b.createdAt || "";
      return pb.localeCompare(pa);
    })
    .map((n) => ({
      id: n.id,
      title: n.title,
      publishedAt: n.publishedAt || n.startAt || n.createdAt,
      status: n.status === "active" ? "active" : n.status === "expired" ? "expired" : "archived",
      summary: String(n.message || "").slice(0, 120),
    }));
}

export async function getPublicNoticeById(env, id) {
  if (!id) return null;
  const all = await listNotices(env);
  const now = new Date();
  const found = all.find((n) => n.id === id);
  if (!found) return null;
  const withStatus = { ...found, status: resolveNoticeStatus(found, now) };
  if (!isPublicListable(withStatus, now)) return null;
  return toPublicNotice(withStatus);
}

export async function deleteNotice(env, id) {
  const notices = await listNotices(env);
  const next = notices.filter((n) => n.id !== id);
  if (next.length === notices.length) return false;
  await saveNotices(env, next);
  return true;
}

export async function getDaily(env, date) {
  if (!hasKv(env)) return emptyDay(date);
  const keys = [
    dayKey(date),
    ...Array.from({ length: ANALYTICS_SHARDS }, (_, i) => dayKey(date, i)),
  ];
  const parts = await Promise.all(
    keys.map((key) => getJson(env.ADMIN_KV, key, null)),
  );
  const day = emptyDay(date);
  for (const part of parts) mergeDay(day, part);
  day.paths = mergePathStats(day.paths);
  return day;
}

async function getHourly(env, date) {
  if (!hasKv(env)) return emptyHourlyDay(date);
  const keys = [
    hourlyKey(date),
    ...Array.from({ length: ANALYTICS_SHARDS }, (_, i) => hourlyKey(date, i)),
  ];
  const parts = await Promise.all(
    keys.map((key) => getJson(env.ADMIN_KV, key, null)),
  );
  const row = emptyHourlyDay(date);
  for (const part of parts) mergeHourly(row, part);
  return row;
}

async function bumpHourly(env, date, hour, event, shard) {
  const keyName = hourlyKey(date, shard);
  const bucket = await getJson(env.ADMIN_KV, keyName, emptyHourlyDay(date));
  if (!bucket.hours) bucket.hours = emptyHourlyDay(date).hours;
  const key = String(hour);
  if (!bucket.hours[key]) {
    bucket.hours[key] = {
      pageViews: 0,
      cta: 0,
      consultSubmit: 0,
      naverPlace: 0,
    };
  }
  const h = bucket.hours[key];
  switch (event.type) {
    case "page_view":
      h.pageViews += 1;
      break;
    case "cta_click":
    case "phone_click":
    case "kakao_click":
    case "naver_click":
      h.cta += 1;
      break;
    case "consultation_submit":
    case "collaboration_submit":
    case "lecture_inquiry_submit":
      h.consultSubmit += 1;
      break;
    case "naver_place_click":
      h.naverPlace += 1;
      break;
    default:
      break;
  }
  await putJson(env.ADMIN_KV, keyName, bucket);
}

const ACTIVITY_EVENTS = new Set([
  "cta_click",
  "phone_click",
  "kakao_click",
  "naver_click",
  "consultation_start",
  "consultation_submit",
  "naver_place_click",
]);

async function pushRecentActivity(env, event, path) {
  if (!ACTIVITY_EVENTS.has(event.type)) return;
  const list = await getJson(env.ADMIN_KV, KEYS.recentActivity, []);
  list.unshift({
    id: newId("act"),
    at: new Date().toISOString(),
    path,
    eventType: event.type,
    referrerType: event.referrerType || "direct",
    meta: event.meta,
  });
  await putJson(env.ADMIN_KV, KEYS.recentActivity, list.slice(0, 25));
}

export async function listRecentActivity(env, limit = 20) {
  if (!hasKv(env)) return [];
  const list = await getJson(env.ADMIN_KV, KEYS.recentActivity, []);
  return list.slice(0, limit);
}

export async function recordAnalyticsEvent(env, event) {
  if (!hasKv(env)) return { ok: false, reason: "no_storage" };
  const now = new Date();
  const date = formatKstDate(now);
  const hour = getKstHour(now);
  const shard = analyticsShard(event.ip);
  const day = await getJson(env.ADMIN_KV, dayKey(date, shard), emptyDay(date));
  const path = normalizePath(event.path || "/");
  if (!day.paths[path]) day.paths[path] = emptyPath();
  const row = day.paths[path];
  day.lastEventAt = now.toISOString();

  switch (event.type) {
    case "page_view":
      day.visits += 1;
      row.visits += 1;
      if (event.deviceType === "mobile") day.devices.mobile += 1;
      else if (event.deviceType === "desktop") day.devices.desktop += 1;
      else day.devices.unknown += 1;
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
    case "notice_impression":
    case "notice_click":
    case "notice_dismiss": {
      if (!day.notices) day.notices = {};
      const noticeId = String(event.meta?.noticeId || "unknown").slice(0, 64);
      if (!day.notices[noticeId]) {
        day.notices[noticeId] = { impression: 0, click: 0, dismiss: 0 };
      }
      if (event.type === "notice_impression") day.notices[noticeId].impression += 1;
      if (event.type === "notice_click") day.notices[noticeId].click += 1;
      if (event.type === "notice_dismiss") day.notices[noticeId].dismiss += 1;
      break;
    }
    default:
      break;
  }

  const source = event.referrerType || event.referrerHost || "direct";
  day.sources[source] = (day.sources[source] || 0) + (event.type === "page_view" ? 1 : 0);

  await putJson(env.ADMIN_KV, dayKey(date, shard), day);
  await bumpHourly(env, date, hour, event, shard);
  await pushRecentActivity(env, event, path);
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
  let ctaToday = null;
  let consultStartToday = null;
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
  let sourcesToday = [];
  let devicesToday = null;
  let hourlyToday = null;
  let hourly7DayAvg = null;
  let hourlyInsights = null;
  let recentActivity = [];
  let funnelToday = null;
  let lastEventAt = null;
  let visitsSameHourAvg7d = null;

  if (storageConfigured) {
    const dayToday = await getDaily(env, today);
    const dayY = await getDaily(env, yesterday);
    visitsToday = dayToday.visits;
    visitsYesterday = dayY.visits;
    consultSubmitToday = dayToday.consultSubmit;
    ctaToday = dayToday.cta;
    consultStartToday = dayToday.consultStart;
    naverPlaceToday = dayToday.naverPlace || 0;
    naverReservationToday = dayToday.naverPlaceReservation || 0;
    lastEventAt = dayToday.lastEventAt || null;
    devicesToday = dayToday.devices || { mobile: 0, desktop: 0, unknown: 0 };

    sourcesToday = Object.entries(dayToday.sources || {})
      .map(([source, count]) => ({ source, count }))
      .sort((a, b) => b.count - a.count);

    funnelToday = {
      pageViews: dayToday.visits,
      cta: dayToday.cta,
      consultStart: dayToday.consultStart,
      consultSubmit: dayToday.consultSubmit,
      mailSuccess: null,
    };

    const hourlyRow = await getHourly(env, today);
    hourlyToday = Object.entries(hourlyRow.hours || {}).map(([hour, v]) => ({
      hour: Number(hour),
      pageViews: v.pageViews || 0,
      cta: v.cta || 0,
      consultSubmit: v.consultSubmit || 0,
      naverPlace: v.naverPlace || 0,
    }));

    const avgBuckets = {};
    for (let h = 0; h < 24; h += 1) avgBuckets[h] = { pageViews: 0, days: 0 };
    for (const d of last7) {
      const row = await getHourly(env, d);
      for (const [hour, v] of Object.entries(row.hours || {})) {
        const n = Number(hour);
        avgBuckets[n].pageViews += v.pageViews || 0;
        avgBuckets[n].days += 1;
      }
    }
    hourly7DayAvg = Object.entries(avgBuckets).map(([hour, v]) => ({
      hour: Number(hour),
      pageViews: v.days > 0 ? Math.round((v.pageViews / v.days) * 10) / 10 : 0,
    }));

    const currentHour = getKstHour();
    let sumTodayToNow = 0;
    let sumAvgToNow = 0;
    for (let h = 0; h <= currentHour; h += 1) {
      sumTodayToNow += hourlyToday.find((x) => x.hour === h)?.pageViews || 0;
      sumAvgToNow += hourly7DayAvg.find((x) => x.hour === h)?.pageViews || 0;
    }
    if (sumAvgToNow > 0) {
      visitsSameHourAvg7d = Math.round((sumTodayToNow / sumAvgToNow - 1) * 1000) / 10;
    }

    let peakHour = null;
    let peakViews = 0;
    for (const row of hourlyToday) {
      if (row.pageViews > peakViews) {
        peakViews = row.pageViews;
        peakHour = row.hour;
      }
    }
    let avgPeakHour = null;
    let avgPeakViews = 0;
    for (const row of hourly7DayAvg) {
      if (row.pageViews > avgPeakViews) {
        avgPeakViews = row.pageViews;
        avgPeakHour = row.hour;
      }
    }
    hourlyInsights = {
      peakHourToday: peakHour,
      peakViewsToday: peakViews,
      peakHour7DayAvg: avgPeakHour,
      visitsSameHourVs7DayAvgPct: visitsSameHourAvg7d,
    };

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
        cta: day.cta,
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
      .map(([path, s]) => ({
        path,
        visits: s.visits,
        cta: s.cta,
        consultSubmit: s.consultSubmit || 0,
        naverPlace: s.naverPlace || 0,
      }))
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
    if (funnelToday) funnelToday.mailSuccess = emailSuccessToday;

    recentAudit = await listAudit(env, 15);
    notices = await listNotices(env);
    recentActivity = await listRecentActivity(env, 20);
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
      href: "/admin/email",
    });
  }
  if (lastEventAt) {
    const ageMs = Date.now() - Date.parse(lastEventAt);
    if (ageMs > 6 * 60 * 60 * 1000) {
      alerts.push({
        id: "analytics-stale",
        level: "warning",
        title: "Analytics 데이터 지연",
        detail: `마지막 이벤트 ${formatKstDateTime(new Date(lastEventAt))} — 6시간 이상 새 이벤트 없음`,
        href: "/admin/monitoring",
      });
    }
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
      detail: storageConfigured
        ? lastEventAt
          ? `마지막 이벤트 ${formatKstDateTime(new Date(lastEventAt))}`
          : "이벤트 집계 활성"
        : "수집 대기(KV 필요)",
      checkedAt: formatKstDateTime(),
    },
  ];

  const summaryParts = [
    `오늘 페이지뷰 ${visitsToday ?? "—"}`,
    `CTA ${ctaToday ?? "—"}`,
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
      ctaToday,
      consultStartToday,
      consultSubmitToday,
      emailSuccessToday,
      emailFailedToday,
      activeNotices: activeNotices.length,
      alertCount: alerts.length,
      naverPlaceToday,
      naverPlace7d,
      naverReservationToday,
      visitsSameHourVs7DayAvgPct: visitsSameHourAvg7d,
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
    sourcesToday,
    devicesToday,
    hourlyToday,
    hourly7DayAvg,
    hourlyInsights,
    recentActivity,
    funnelToday,
    lastEventAt,
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

export async function buildPagesReport(env, days = 30) {
  if (!hasKv(env)) {
    return { rows: [], message: "아직 측정되지 않음" };
  }
  const today = formatKstDate();
  const span = Math.min(Math.max(days, 1), 90);
  const range = kstDateRange(span);
  const last7 = kstDateRange(7);
  const prev7 = kstDateRange(14).slice(0, 7);

  const agg = {};
  const agg7 = {};
  const todayAgg = {};

  for (const d of range) {
    const day = await getDaily(env, d);
    for (const [path, s] of Object.entries(day.paths || {})) {
      if (!agg[path]) {
        agg[path] = {
          visits: 0,
          cta: 0,
          consultSubmit: 0,
          naverPlace: 0,
          phone: 0,
          kakao: 0,
          naver: 0,
        };
      }
      agg[path].visits += s.visits || 0;
      agg[path].cta += s.cta || 0;
      agg[path].consultSubmit += s.consultSubmit || 0;
      agg[path].naverPlace += s.naverPlace || 0;
      agg[path].phone += s.phone || 0;
      agg[path].kakao += s.kakao || 0;
      agg[path].naver += s.naver || 0;
      if (d === today) todayAgg[path] = s;
    }
  }

  for (const d of last7) {
    const day = await getDaily(env, d);
    for (const [path, s] of Object.entries(day.paths || {})) {
      if (!agg7[path]) agg7[path] = 0;
      agg7[path] += s.visits || 0;
    }
  }

  const prevAgg = {};
  for (const d of prev7) {
    const day = await getDaily(env, d);
    for (const [path, s] of Object.entries(day.paths || {})) {
      prevAgg[path] = (prevAgg[path] || 0) + (s.visits || 0);
    }
  }

  const rows = Object.entries(agg).map(([path, s]) => {
    const todayRow = todayAgg[path];
    const visits7d = agg7[path] || 0;
    const visitsPrev = prevAgg[path] || 0;
    let trend = "low_data";
    if (visits7d >= 20 && visitsPrev > 0) {
      const ch = ((visits7d - visitsPrev) / visitsPrev) * 100;
      if (ch > 15) trend = "up";
      else if (ch < -15) trend = "down";
      else trend = "stable";
    }
    const conversionRate =
      s.visits >= 5 && s.consultSubmit > 0
        ? Math.round((s.consultSubmit / s.visits) * 1000) / 10
        : null;
    return {
      path,
      visitsToday: todayRow?.visits || 0,
      visits7d,
      visits30d: s.visits,
      visitsPrevPeriod: visitsPrev,
      trend,
      cta: s.cta,
      consultSubmit: s.consultSubmit,
      naverPlace: s.naverPlace,
      phone: s.phone,
      kakao: s.kakao,
      naver: s.naver,
      conversionRate,
    };
  });

  rows.sort((a, b) => b.visits30d - a.visits30d);
  return { date: today, days: span, rows };
}

export async function getNoticeStatsMap(env, days = 7) {
  const map = {};
  if (!hasKv(env)) return map;
  const range = kstDateRange(Math.min(Math.max(days, 1), 30));
  for (const d of range) {
    const day = await getDaily(env, d);
    for (const [id, s] of Object.entries(day.notices || {})) {
      if (!map[id]) map[id] = { impression: 0, click: 0, dismiss: 0 };
      map[id].impression += s.impression || 0;
      map[id].click += s.click || 0;
      map[id].dismiss += s.dismiss || 0;
    }
  }
  return map;
}

export async function buildConversionsReport(env) {
  if (!hasKv(env)) {
    return {
      funnel: null,
      channels: [],
      topCtaPages: [],
      naverPlaceByPlacement: [],
      naverPlaceTopPaths: [],
      message: "아직 측정되지 않음 (ADMIN_KV 필요)",
    };
  }

  const today = formatKstDate();
  const last7 = kstDateRange(7);
  const dayToday = await getDaily(env, today);

  let phone = 0;
  let kakao = 0;
  let naver = 0;
  let ctaGeneric = 0;
  let consultStart = dayToday.consultStart || 0;
  let consultSubmit = dayToday.consultSubmit || 0;
  let visits = dayToday.visits || 0;
  let cta = dayToday.cta || 0;
  let naverPlace = dayToday.naverPlace || 0;

  const pathAgg = {};
  for (const [path, s] of Object.entries(dayToday.paths || {})) {
    phone += s.phone || 0;
    kakao += s.kakao || 0;
    naver += s.naver || 0;
    pathAgg[path] = {
      path,
      visits: s.visits || 0,
      cta: s.cta || 0,
      phone: s.phone || 0,
      kakao: s.kakao || 0,
      naver: s.naver || 0,
      consultSubmit: s.consultSubmit || 0,
      naverPlace: s.naverPlace || 0,
    };
  }
  ctaGeneric = Math.max(0, cta - phone - kakao - naver);

  let visits7 = 0;
  let cta7 = 0;
  let submit7 = 0;
  let naverPlace7 = 0;
  for (const d of last7) {
    const day = await getDaily(env, d);
    visits7 += day.visits || 0;
    cta7 += day.cta || 0;
    submit7 += day.consultSubmit || 0;
    naverPlace7 += day.naverPlace || 0;
  }

  const emailRecent = await listEmailLogs(env, 200);
  const mailSuccess = emailRecent.filter(
    (e) => e.status === "success" && isSameKstDay(e.timestamp, today),
  ).length;

  const rate = (num, den) =>
    den > 0 ? Math.round((num / den) * 1000) / 10 : null;

  const channels = [
    {
      channel: "전화",
      clicks: phone,
      topPage:
        Object.values(pathAgg).sort((a, b) => b.phone - a.phone)[0]?.path || null,
    },
    {
      channel: "카카오",
      clicks: kakao,
      topPage:
        Object.values(pathAgg).sort((a, b) => b.kakao - a.kakao)[0]?.path || null,
    },
    {
      channel: "네이버톡톡",
      clicks: naver,
      topPage:
        Object.values(pathAgg).sort((a, b) => b.naver - a.naver)[0]?.path || null,
    },
    {
      channel: "기타 CTA",
      clicks: ctaGeneric,
      topPage: null,
    },
    {
      channel: "네이버 플레이스 이동",
      clicks: naverPlace,
      topPage:
        Object.values(pathAgg)
          .sort((a, b) => b.naverPlace - a.naverPlace)[0]?.path || null,
    },
    {
      channel: "상담폼 제출",
      clicks: consultSubmit,
      topPage:
        Object.values(pathAgg)
          .sort((a, b) => b.consultSubmit - a.consultSubmit)[0]?.path || null,
    },
  ];

  const topCtaPages = Object.values(pathAgg)
    .filter((r) => r.cta > 0 || r.consultSubmit > 0 || r.naverPlace > 0)
    .sort(
      (a, b) =>
        b.cta + b.consultSubmit + b.naverPlace - (a.cta + a.consultSubmit + a.naverPlace),
    )
    .slice(0, 15);

  return {
    timezone: "Asia/Seoul",
    date: today,
    funnel: {
      pageViews: visits,
      cta,
      consultStart,
      consultSubmit,
      mailSuccess,
      rates: {
        viewToCta: rate(cta, visits),
        ctaToStart: rate(consultStart, cta),
        startToSubmit: rate(consultSubmit, consultStart || cta),
        submitToMail: rate(mailSuccess, consultSubmit),
      },
    },
    last7: {
      pageViews: visits7,
      cta: cta7,
      consultSubmit: submit7,
      naverPlace: naverPlace7,
    },
    channels,
    topCtaPages,
    naverPlaceByPlacement: Object.entries(dayToday.naverPlacePlacements || {})
      .map(([placement, count]) => ({ placement, count }))
      .sort((a, b) => b.count - a.count),
    naverPlaceTopPaths: Object.values(pathAgg)
      .filter((r) => r.naverPlace > 0)
      .sort((a, b) => b.naverPlace - a.naverPlace)
      .slice(0, 10)
      .map((r) => ({
        path: r.path,
        visits: r.visits,
        naverPlace: r.naverPlace,
        ctr: r.visits > 0 ? Math.round((r.naverPlace / r.visits) * 1000) / 10 : null,
      })),
  };
}
