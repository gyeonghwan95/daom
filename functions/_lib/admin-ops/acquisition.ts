/**
 * 유입 분석(Acquisition) — 세션 진입 채널·referrer 호스트·랜딩·UTM 기준 집계.
 *
 * - 일별 샤드(day.acq)에 중첩 저장한다. page_view 1건당 KV GET 1 + PUT 1을 유지.
 * - 개인정보 없음: 호스트·경로·UTM 문자열만 저장. 검색어·IP·UA는 받지 않는다.
 * - 세션 상태(day.acqSessions)는 같은 샤드 안의 참여·전환 1회 판정에만 쓰고 병합하지 않는다.
 */

import {
  addKstDays,
  bareAnalyticsHost,
  classifyReferrer,
  isExcludedAnalyticsPath,
  normalizePath,
} from "./crypto";

export const ACQ_VERSION = 1;

export const ACQ_CHANNELS = [
  "naver",
  "google",
  "daum",
  "bing",
  "ai",
  "sns",
  "external",
  "campaign",
  "direct",
  "internal",
];
const CHANNEL_SET = new Set(ACQ_CHANNELS);

/** 샤드·일 단위 키 상한. 넘치면 "(other)" 버킷으로 합친다. */
const CAPS = { ref: 120, land: 250, utm: 60 };
export const OTHER_KEY = "(other)";
const SESSION_STATE_CAP = 2000;
const FLAG_ENGAGED = 1;
const FLAG_CONVERTED = 2;

/** 상담으로 직접 이어지는 행동. 전환 세션 판정 기준. */
const CONTACT_KINDS = new Set(["phone", "kakao", "talk", "reserve", "submit"]);
const INTERACTION_TYPES = new Set(["search_used", "tool_used", "diagnosis_complete"]);
const METRIC_KEYS = [
  "s",
  "pv",
  "eng",
  "cv",
  "m",
  "phone",
  "kakao",
  "talk",
  "reserve",
  "place",
  "submit",
  "cta",
  "start",
];

function cleanHost(raw) {
  const h = bareAnalyticsHost(String(raw || "").trim().split(":")[0]);
  return /^[a-z0-9.-]{1,80}$/.test(h) && h.includes(".") ? h : "";
}

function cleanUtm(raw, lower) {
  const s = String(raw ?? "")
    .normalize("NFC")
    .replace(/[^\p{L}\p{N}_.+\- ]/gu, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 60);
  if (/\d{8,}/.test(s)) return "";
  return lower ? s.toLowerCase() : s;
}

/** 클라이언트 entry를 신뢰하지 않고 호스트로 채널을 다시 판정한다. */
export function sanitizeEntry(raw, requestHost) {
  if (!raw || typeof raw !== "object") return null;
  const host = cleanHost(raw.host);
  const us = cleanUtm(raw.us, true);
  const um = cleanUtm(raw.um, true);
  const uc = cleanUtm(raw.uc, false);
  let ch = host ? classifyReferrer(host, requestHost) : "direct";
  if (ch === "direct" && us) ch = "campaign";
  let lp = normalizePath(String(raw.lp || "/")).slice(0, 120);
  if (isExcludedAnalyticsPath(lp)) lp = "";
  return { ch, host: ch === "internal" ? "" : host, us, um, uc, lp };
}

export function conversionKind(event) {
  switch (event?.type) {
    case "phone_click":
      return "phone";
    case "kakao_click":
      return "kakao";
    case "naver_click":
      return "talk";
    case "naver_place_click":
      return event.meta?.variant === "reservation" ? "reserve" : "place";
    case "consultation_submit":
    case "collaboration_submit":
    case "lecture_inquiry_submit":
      return "submit";
    case "consultation_start":
      return "start";
    case "cta_click":
      return "cta";
    default:
      return null;
  }
}

function inc(row, key, n = 1) {
  row[key] = (row[key] || 0) + n;
}

function cappedRow(map, key, cap) {
  if (map[key]) return map[key];
  const k = Object.keys(map).length >= cap ? OTHER_KEY : key;
  if (!map[k]) map[k] = {};
  return map[k];
}

/** recordAnalyticsEvent 안에서 같은 샤드 객체를 갱신한다. */
export function applyAcquisition(day, event) {
  const entry = event?.entry;
  if (!entry || !CHANNEL_SET.has(entry.ch)) return;
  if (!day.acq) day.acq = { v: ACQ_VERSION, ch: {}, ref: {}, land: {}, utm: {} };
  const acq = day.acq;
  for (const dim of ["ch", "ref", "land", "utm"]) if (!acq[dim]) acq[dim] = {};

  if (!acq.ch[entry.ch]) acq.ch[entry.ch] = {};
  const rows = [acq.ch[entry.ch]];
  const landRow = entry.lp ? cappedRow(acq.land, entry.lp, CAPS.land) : null;
  if (landRow) rows.push(landRow);
  if (entry.host) rows.push(cappedRow(acq.ref, entry.host, CAPS.ref));
  if (entry.us) {
    const utmKey = `${entry.us}|${entry.um || ""}|${entry.uc || ""}`.slice(0, 180);
    rows.push(cappedRow(acq.utm, utmKey, CAPS.utm));
  }

  const type = event.type;
  if (type === "page_view") {
    for (const r of rows) inc(r, "pv");
    if (event.isEntry) {
      for (const r of rows) {
        inc(r, "s");
        if (event.deviceType === "mobile") inc(r, "m");
      }
      if (landRow) {
        if (!landRow.ch) landRow.ch = {};
        inc(landRow.ch, entry.ch);
      }
    }
  }

  const kind = conversionKind(event);
  if (kind) for (const r of rows) inc(r, kind);

  const sid = event.sid;
  if (!sid) return;
  if (!day.acqSessions) day.acqSessions = {};
  let state = day.acqSessions[sid];
  if (!state) {
    if (Object.keys(day.acqSessions).length >= SESSION_STATE_CAP) return;
    state = [0, 0];
    day.acqSessions[sid] = state;
  }
  if (type === "page_view") state[0] += 1;
  const interacted = kind != null || INTERACTION_TYPES.has(type);
  if (!(state[1] & FLAG_ENGAGED) && (state[0] >= 2 || interacted)) {
    state[1] |= FLAG_ENGAGED;
    for (const r of rows) inc(r, "eng");
  }
  if (!(state[1] & FLAG_CONVERTED) && kind && CONTACT_KINDS.has(kind)) {
    state[1] |= FLAG_CONVERTED;
    for (const r of rows) inc(r, "cv");
  }
}

function mergeRow(target, source) {
  for (const [k, v] of Object.entries(source || {})) {
    if (k === "ch" && v && typeof v === "object") {
      if (!target.ch) target.ch = {};
      for (const [c, n] of Object.entries(v)) inc(target.ch, c, Number(n) || 0);
    } else if (typeof v === "number") {
      inc(target, k, v);
    }
  }
}

/** mergeDay에서 샤드별 acq를 합친다. acqSessions(상태)는 합치지 않는다. */
export function mergeAcquisition(target, source) {
  if (!source) return;
  if (!target.acq) target.acq = { v: ACQ_VERSION, ch: {}, ref: {}, land: {}, utm: {} };
  for (const dim of ["ch", "ref", "land", "utm"]) {
    if (!target.acq[dim]) target.acq[dim] = {};
    for (const [key, row] of Object.entries(source[dim] || {})) {
      if (!target.acq[dim][key]) target.acq[dim][key] = {};
      mergeRow(target.acq[dim][key], row);
    }
  }
}

/* ── 보고서 ─────────────────────────────────────────────── */

export function dateRangeEnding(endYmd, days) {
  const out = [];
  for (let i = days - 1; i >= 0; i -= 1) out.push(addKstDays(endYmd, -i));
  return out;
}

/** 보고서·캐시에 필요한 필드만 남긴다 (paths 등 대용량 필드 제외). */
export function slimDayForAcquisition(day) {
  return {
    date: day.date,
    visits: day.visits || 0,
    sources: day.sources || {},
    devices: day.devices || { mobile: 0, desktop: 0, unknown: 0 },
    hours: day.hours || {},
    acq: day.acq || null,
  };
}

function emptyMetrics() {
  const m = {};
  for (const k of METRIC_KEYS) m[k] = 0;
  return m;
}

function addMetrics(target, row) {
  for (const k of METRIC_KEYS) target[k] += Number(row?.[k]) || 0;
}

function withContacts(m) {
  return { ...m, contacts: m.phone + m.kakao + m.talk + m.reserve + m.submit };
}

function summarizePeriod(days) {
  const channels = {};
  const refs = {};
  const lands = {};
  const utms = {};
  let acqDays = 0;
  let firstAcqDate = null;
  let pageViews = 0;
  const devices = { mobile: 0, desktop: 0, unknown: 0 };

  const channelRow = (id) => {
    if (!channels[id]) channels[id] = { entries: 0, acq: emptyMetrics() };
    return channels[id];
  };

  for (const day of days) {
    pageViews += day.visits || 0;
    devices.mobile += day.devices?.mobile || 0;
    devices.desktop += day.devices?.desktop || 0;
    devices.unknown += day.devices?.unknown || 0;
    for (const [src, n] of Object.entries(day.sources || {})) {
      channelRow(src).entries += Number(n) || 0;
    }
    if (!day.acq) continue;
    acqDays += 1;
    if (!firstAcqDate || day.date < firstAcqDate) firstAcqDate = day.date;
    for (const [ch, row] of Object.entries(day.acq.ch || {})) addMetrics(channelRow(ch).acq, row);
    for (const [dim, target] of [
      ["ref", refs],
      ["land", lands],
      ["utm", utms],
    ]) {
      for (const [key, row] of Object.entries(day.acq[dim] || {})) {
        if (!target[key]) target[key] = { ...emptyMetrics(), ch: {} };
        addMetrics(target[key], row);
        for (const [c, n] of Object.entries(row?.ch || {})) {
          target[key].ch[c] = (target[key].ch[c] || 0) + (Number(n) || 0);
        }
      }
    }
  }
  return { channels, refs, lands, utms, acqDays, firstAcqDate, pageViews, devices };
}

function periodTotals(p) {
  const acq = emptyMetrics();
  let sessions = 0;
  let internalSessions = 0;
  for (const [id, row] of Object.entries(p.channels)) {
    // sources.internal에는 사이트 내 이동 페이지뷰도 섞여 있어 진입 세션은 acq 기준으로만 센다.
    if (id === "internal") {
      internalSessions += row.acq.s;
      continue;
    }
    sessions += row.entries;
    addMetrics(acq, row.acq);
  }
  return {
    sessions,
    internalSessions,
    pageViews: p.pageViews,
    acqSessions: acq.s,
    ...withContacts(acq),
  };
}

function rowsFrom(map, prevMap, limit, decorate) {
  return Object.entries(map)
    .map(([key, row]) => {
      const { ch, ...metrics } = row;
      return {
        key,
        ...withContacts(metrics),
        mix: ch && Object.keys(ch).length ? ch : undefined,
        prevSessions: prevMap ? prevMap[key]?.s || 0 : null,
        ...decorate(key),
      };
    })
    .sort((a, b) => b.s - a.s || b.pv - a.pv)
    .slice(0, limit);
}

export function buildAcquisitionPayload({ days, prevDays, range, compareRange }) {
  const cur = summarizePeriod(days);
  const prev = prevDays ? summarizePeriod(prevDays) : null;

  const channelIds = new Set([
    ...Object.keys(cur.channels),
    ...(prev ? Object.keys(prev.channels) : []),
  ]);
  const channels = [...channelIds]
    .map((id) => {
      const c = cur.channels[id] || { entries: 0, acq: emptyMetrics() };
      const p = prev?.channels[id];
      const sessionsOf = (row) => (id === "internal" ? row?.acq.s || 0 : row?.entries || 0);
      return {
        id,
        sessions: sessionsOf(c),
        prevSessions: prev ? sessionsOf(p) : null,
        prevConverted: prev ? p?.acq.cv || 0 : null,
        prevAcqSessions: prev ? p?.acq.s || 0 : null,
        ...withContacts(c.acq),
      };
    })
    .filter((row) => row.sessions > 0 || (row.prevSessions || 0) > 0 || row.pv > 0)
    .sort((a, b) => {
      if (a.id === "internal") return 1;
      if (b.id === "internal") return -1;
      return b.sessions - a.sessions || (b.prevSessions || 0) - (a.prevSessions || 0);
    });

  const daily = days.map((day) => {
    const byChannel = {};
    let sessions = 0;
    for (const [src, n] of Object.entries(day.sources || {})) {
      if (src === "internal" || !n) continue;
      byChannel[src] = n;
      sessions += n;
    }
    let contacts = null;
    let converted = null;
    if (day.acq) {
      const m = emptyMetrics();
      for (const [ch, row] of Object.entries(day.acq.ch || {})) {
        if (ch !== "internal") addMetrics(m, row);
      }
      contacts = withContacts(m).contacts;
      converted = m.cv;
    }
    return {
      date: day.date,
      pageViews: day.visits || 0,
      sessions,
      byChannel,
      contacts,
      converted,
      hasAcq: Boolean(day.acq),
    };
  });

  const weekHour = Array.from({ length: 7 }, () => Array(24).fill(0));
  for (const day of days) {
    const [y, m, d] = String(day.date).split("-").map(Number);
    const weekday = (new Date(Date.UTC(y, m - 1, d)).getUTCDay() + 6) % 7; // 월=0
    for (const [hour, row] of Object.entries(day.hours || {})) {
      const h = Number(hour);
      if (h >= 0 && h < 24) weekHour[weekday][h] += row?.pageViews || 0;
    }
  }

  return {
    range,
    compareRange: prev ? compareRange : null,
    coverage: {
      days: days.length,
      acqDays: cur.acqDays,
      firstAcqDate: cur.firstAcqDate,
    },
    totals: periodTotals(cur),
    prevTotals: prev ? periodTotals(prev) : null,
    channels,
    daily,
    referrers: rowsFrom(cur.refs, prev?.refs, 80, (host) => ({
      host,
      channel: host === OTHER_KEY ? "external" : classifyReferrer(host),
    })),
    landings: rowsFrom(cur.lands, prev?.lands, 150, (path) => ({ path })),
    campaigns: rowsFrom(cur.utms, prev?.utms, 50, (key) => {
      const [source = "", medium = "", campaign = ""] = key.split("|");
      return { source, medium, campaign };
    }),
    weekHour,
    devices: cur.devices,
  };
}
