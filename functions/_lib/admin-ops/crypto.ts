/** Copied subset for Pages Functions (no @/ imports). Keep in sync with src/lib/admin-ops. */

export const ADMIN_OPS_COOKIE = "daom_admin_session";
export const ADMIN_OPS_MAX_AGE_SEC = 8 * 60 * 60;

export function formatKstDate(d = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
}

export function formatKstDateTime(d = new Date()) {
  return new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(d);
}

export function addKstDays(dateYmd, delta) {
  const [y, m, d] = dateYmd.split("-").map(Number);
  const utc = Date.UTC(y, m - 1, d) + delta * 86400000;
  return formatKstDate(new Date(utc));
}

export function kstDateRange(days) {
  const today = formatKstDate();
  const out = [];
  for (let i = days - 1; i >= 0; i -= 1) out.push(addKstDays(today, -i));
  return out;
}

export function maskEmail(email) {
  const trimmed = String(email || "").trim();
  const at = trimmed.indexOf("@");
  if (at < 1) return "***";
  return `${trimmed.slice(0, 1)}***@${trimmed.slice(at + 1)}`;
}

export function classifyReferrer(host) {
  if (!host) return "direct";
  const h = host.toLowerCase();
  if (h.includes("google.")) return "google";
  if (h.includes("naver.")) return "naver";
  if (h.includes("daum.") || h.includes("kakao.")) return "daum";
  if (h.includes("bing.")) return "bing";
  if (h.includes("instagram.") || h.includes("facebook.") || h.includes("t.co")) return "sns";
  return "external";
}

export function normalizePath(raw) {
  try {
    if (String(raw).startsWith("http")) return normalizePath(new URL(raw).pathname || "/");
  } catch {
    /* ignore */
  }
  let path = String(raw || "/").split("?")[0].split("#")[0] || "/";
  if (!path.startsWith("/")) path = `/${path}`;
  if (path.length > 1 && path.endsWith("/")) path = path.slice(0, -1);
  if (path.includes("%")) {
    try {
      const decoded = decodeURIComponent(path);
      if (decoded.startsWith("/")) path = decoded;
    } catch {
      /* keep raw — invalid encoding */
    }
  }
  return path;
}

/** KST hour bucket 0–23 */
export function getKstHour(d = new Date()) {
  return Number(
    new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Seoul",
      hour: "2-digit",
      hour12: false,
    }).format(d),
  );
}

export function isSafeCtaUrl(url) {
  const t = String(url || "").trim();
  if (!t) return false;
  const lower = t.toLowerCase();
  if (lower.startsWith("javascript:") || lower.startsWith("data:") || lower.startsWith("vbscript:")) {
    return false;
  }
  if (t.startsWith("/")) return true;
  try {
    const u = new URL(t);
    return u.protocol === "https:" || u.protocol === "http:";
  } catch {
    return false;
  }
}

export function sanitizeNoticeText(input, maxLen) {
  return String(input || "")
    .replace(/<[^>]*>/g, "")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "")
    .trim()
    .slice(0, maxLen);
}

export function newId(prefix) {
  const rand = crypto.randomUUID().slice(0, 8);
  return `${prefix}_${Date.now().toString(36)}_${rand}`;
}

function b64url(bytes) {
  const u8 = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let s = "";
  for (let i = 0; i < u8.length; i += 1) s += String.fromCharCode(u8[i]);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function b64urlFromText(text) {
  return b64url(new TextEncoder().encode(text));
}

function textFromB64url(encoded) {
  const pad = encoded.length % 4 === 0 ? "" : "=".repeat(4 - (encoded.length % 4));
  const b64 = encoded.replace(/-/g, "+").replace(/_/g, "/") + pad;
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i += 1) bytes[i] = bin.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}

async function importKey(secret) {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
}

async function sign(encodedPayload, secret) {
  const key = await importKey(secret);
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(encodedPayload));
  return b64url(sig);
}

export async function createSessionToken(secret) {
  const payload = {
    sub: "OWNER_ADMIN",
    exp: Math.floor(Date.now() / 1000) + ADMIN_OPS_MAX_AGE_SEC,
  };
  const encoded = b64urlFromText(JSON.stringify(payload));
  return `${encoded}.${await sign(encoded, secret)}`;
}

export async function verifySessionToken(token, secret) {
  if (!token || !secret) return false;
  const [encoded, signature] = token.split(".");
  if (!encoded || !signature) return false;
  const expected = await sign(encoded, secret);
  if (expected.length !== signature.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i += 1) {
    diff |= expected.charCodeAt(i) ^ signature.charCodeAt(i);
  }
  if (diff !== 0) return false;
  try {
    const payload = JSON.parse(textFromB64url(encoded));
    return payload.sub === "OWNER_ADMIN" && payload.exp > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}

export async function verifyPassword(input, password, secret) {
  if (!input || !password || password.length < 12 || secret.length < 32) return false;
  const key = await importKey(secret);
  const a = new Uint8Array(
    await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(input)),
  );
  const b = new Uint8Array(
    await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(password)),
  );
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) diff |= a[i] ^ b[i];
  return diff === 0;
}

export function parseCookie(header, name) {
  if (!header) return undefined;
  for (const part of header.split(";")) {
    const [k, ...rest] = part.trim().split("=");
    if (k === name) return rest.join("=");
  }
  return undefined;
}

export function sessionCookieHeader(token, maxAge = ADMIN_OPS_MAX_AGE_SEC) {
  return `${ADMIN_OPS_COOKIE}=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${maxAge}; Secure`;
}

export function clearSessionCookieHeader() {
  return `${ADMIN_OPS_COOKIE}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0; Secure`;
}

export function json(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex, nofollow",
      ...headers,
    },
  });
}

export function getAdminSecrets(env) {
  const password = env.ADMIN_PASSWORD?.trim() || "";
  const secret = env.ADMIN_SESSION_SECRET?.trim() || "";
  return {
    password: password.length >= 12 ? password : null,
    secret: secret.length >= 32 ? secret : null,
    configured: password.length >= 12 && secret.length >= 32,
  };
}
