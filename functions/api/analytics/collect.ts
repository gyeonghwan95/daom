import {
  classifyReferrer,
  json,
  normalizePath,
} from "../../_lib/admin-ops/crypto";
import { hasKv, recordAnalyticsEvent } from "../../_lib/admin-ops/store";

const hits = new Map();

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
    return json({ ok: false, code: "rate_limited" }, 429);
  }

  if (isVerifiedBot(request)) {
    return json({ ok: true, skipped: true, reason: "bot" });
  }

  const body = await readJsonBody(request);
  if (!body || typeof body !== "object") {
    return json({ ok: false, code: "bad_request" }, 400);
  }

  const type = String(body?.type || "");
  if (!ALLOWED.has(type)) {
    return json({ ok: false, code: "invalid_type" }, 400);
  }

  const path = normalizePath(String(body?.path || "/"));
  if (path.startsWith("/admin") || path.startsWith("/api")) {
    return json({ ok: true, skipped: true });
  }

  if (!hasKv(env)) {
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
    meta:
      body?.meta && typeof body.meta === "object"
        ? Object.fromEntries(
            Object.entries(body.meta)
              .slice(0, 8)
              .map(([k, v]) => [String(k).slice(0, 40), String(v).slice(0, 80)]),
          )
        : undefined,
  });

  return json({ ok: true, stored: result.ok });
}

export async function onRequest(context) {
  if (context.request.method !== "POST") {
    return json({ ok: false, code: "method_not_allowed" }, 405);
  }
  return onRequestPost(context);
}
