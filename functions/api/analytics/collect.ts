import {
  ADMIN_OPS_COOKIE,
  classifyReferrer,
  getAdminSecrets,
  isExcludedAnalyticsPath,
  json,
  normalizePath,
  parseCookie,
  verifySessionToken,
} from "../../_lib/admin-ops/crypto";
import { sanitizeOutboundHref } from "../../_lib/admin-ops/outbound-href";
import { hasKv, recordAnalyticsEvent, bumpIngest } from "../../_lib/admin-ops/store";

const hits = new Map();
const recentPv = new Map();

function rateOk(ip) {
  const now = Date.now();
  const row = hits.get(ip) || { count: 0, start: now };
  if (now - row.start > 60_000) {
    hits.set(ip, { count: 1, start: now });
    return true;
  }
  row.count += 1;
  hits.set(ip, row);
  return row.count <= 120;
}

const ALLOWED = new Set([
  "page_view",
  "cta_click",
  "phone_click",
  "kakao_click",
  "naver_click",
  "consultation_start",
  "consultation_submit",
  "collaboration_submit",
  "lecture_inquiry_submit",
  "notice_impression",
  "notice_click",
  "notice_dismiss",
  "search_used",
  "tool_used",
  "diagnosis_complete",
  "naver_place_click",
]);

const BOT_UA =
  /(?:bot|crawler|spider|yeti|googlebot|bingbot|baiduspider|yandex(?:bot)?|duckduckbot|facebookexternalhit|slackbot|twitterbot|linkedinbot|semrush|ahrefs|mj12bot|dotbot|petalbot|bytespider|gptbot|claudebot|applebot|ia_archiver|pingdom|uptimerobot)/i;

function isVerifiedBot(request) {
  try {
    if (request.cf?.botManagement?.verifiedBot) return true;
  } catch {
    /* ignore */
  }
  const ua = request.headers.get("user-agent") || "";
  return BOT_UA.test(ua);
}

async function readJsonBody(request) {
  const text = await request.text();
  if (!text || !text.trim()) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

export async function onRequestPost(context) {
  const { request, env } = context;
  const ip =
    request.headers.get("CF-Connecting-IP") ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown";
  if (!rateOk(ip)) {
    await bumpIngest(env, "rate_limited");
    return json({ ok: false, code: "rate_limited" }, 429);
  }

  if (isVerifiedBot(request)) {
    return json({ ok: true, skipped: true, reason: "bot" });
  }

  const ua = request.headers.get("user-agent") || "";
  if (!ua.trim()) {
    await bumpIngest(env, "empty_ua");
    return json({ ok: true, skipped: true, reason: "empty_ua" });
  }

  const body = await readJsonBody(request);
  if (!body || typeof body !== "object") {
    await bumpIngest(env, "bad_request");
    return json({ ok: false, code: "bad_request" }, 400);
  }

  const type = String(body?.type || "");
  if (!ALLOWED.has(type)) {
    await bumpIngest(env, "invalid_type");
    return json({ ok: false, code: "invalid_type" }, 400);
  }

  const path = normalizePath(String(body?.path || "/"));
  if (isExcludedAnalyticsPath(path)) {
    await bumpIngest(env, "admin_path");
    return json({ ok: true, skipped: true, reason: "admin_path" });
  }

  const secrets = getAdminSecrets(env);
  if (secrets.secret) {
    const token = parseCookie(request.headers.get("Cookie"), ADMIN_OPS_COOKIE);
    if (token && (await verifySessionToken(token, secrets.secret))) {
      await bumpIngest(env, "admin_session");
      return json({ ok: true, skipped: true, reason: "admin_session" });
    }
  }

  if (type === "page_view") {
    const now = Date.now();
    const dupKey = `${ip}|${path}`;
    const prev = recentPv.get(dupKey) || 0;
    if (now - prev < 8_000) {
      await bumpIngest(env, "dedupe");
      return json({ ok: true, skipped: true, reason: "dedupe" });
    }
    recentPv.set(dupKey, now);
  }

  if (!hasKv(env)) {
    await bumpIngest(env, "no_kv");
    return json({ ok: true, stored: false });
  }

  let requestHost;
  try {
    requestHost = new URL(request.url).hostname;
  } catch {
    requestHost = undefined;
  }

  const referrerHost = body?.referrerHost
    ? String(body.referrerHost).slice(0, 120)
    : undefined;
  let referrerType = classifyReferrer(referrerHost, requestHost);
  if (referrerType !== "internal" && body?.referrerType === "internal") {
    referrerType = "internal";
  } else if (referrerType === "direct" && body?.campaign) {
    referrerType = "campaign";
  }

  const result = await recordAnalyticsEvent(env, {
    type,
    path,
    ip,
    referrerHost,
    referrerType,
    campaign: body?.campaign ? String(body.campaign).slice(0, 80) : undefined,
    deviceType:
      body?.deviceType === "mobile" || body?.deviceType === "desktop"
        ? body.deviceType
        : "unknown",
    meta: sanitizeEventMeta(body?.meta, requestHost),
    sid: sanitizeSid(body?.meta?.sid),
  });

  if (!result.ok) {
    await bumpIngest(env, "store_error");
  }

  return json({ ok: true, stored: result.ok });
}

function sanitizeSid(raw) {
  const s = String(raw || "").slice(0, 36);
  return /^[a-zA-Z0-9-]{8,36}$/.test(s) ? s : "";
}

function sanitizeEventMeta(meta, requestHost) {
  if (!meta || typeof meta !== "object") return undefined;
  const origin = requestHost ? `https://${requestHost}` : undefined;
  const destRaw = meta.dest || meta.href;
  const dest = destRaw ? sanitizeOutboundHref(String(destRaw), origin) : "";
  const out = {};
  for (const [k, v] of Object.entries(meta).slice(0, 8)) {
    const key = String(k).slice(0, 40);
    if (key === "sid" || key === "href") continue;
    out[key] = String(v).slice(0, 80);
  }
  if (dest) out.dest = dest.slice(0, 160);
  return Object.keys(out).length ? out : undefined;
}

export async function onRequest(context) {
  if (context.request.method !== "POST") {
    return json({ ok: false, code: "method_not_allowed" }, 405);
  }
  return onRequestPost(context);
}
