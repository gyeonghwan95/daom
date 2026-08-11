/**
 * Web Crypto HMAC session — works in Cloudflare Workers and modern Node.
 * Do not put secrets in NEXT_PUBLIC_*.
 */

export const ADMIN_OPS_COOKIE = "daom_admin_session";
export const ADMIN_OPS_MAX_AGE_SEC = 8 * 60 * 60;

type SessionPayload = { sub: "OWNER_ADMIN"; exp: number };

function b64url(bytes: ArrayBuffer | Uint8Array): string {
  const u8 = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let s = "";
  for (let i = 0; i < u8.length; i += 1) s += String.fromCharCode(u8[i]!);
  const b64 =
    typeof btoa === "function"
      ? btoa(s)
      : Buffer.from(u8).toString("base64");
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function b64urlFromText(text: string): string {
  const bytes = new TextEncoder().encode(text);
  return b64url(bytes);
}

function textFromB64url(encoded: string): string {
  const pad = encoded.length % 4 === 0 ? "" : "=".repeat(4 - (encoded.length % 4));
  const b64 = encoded.replace(/-/g, "+").replace(/_/g, "/") + pad;
  if (typeof atob === "function") {
    const bin = atob(b64);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i += 1) bytes[i] = bin.charCodeAt(i);
    return new TextDecoder().decode(bytes);
  }
  return Buffer.from(b64, "base64").toString("utf8");
}

async function importKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

async function sign(encodedPayload: string, secret: string): Promise<string> {
  const key = await importKey(secret);
  const sig = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(encodedPayload),
  );
  return b64url(sig);
}

export async function createSessionToken(secret: string): Promise<string> {
  const payload: SessionPayload = {
    sub: "OWNER_ADMIN",
    exp: Math.floor(Date.now() / 1000) + ADMIN_OPS_MAX_AGE_SEC,
  };
  const encoded = b64urlFromText(JSON.stringify(payload));
  const signature = await sign(encoded, secret);
  return `${encoded}.${signature}`;
}

export async function verifySessionToken(
  token: string | undefined,
  secret: string,
): Promise<boolean> {
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
    const payload = JSON.parse(textFromB64url(encoded)) as SessionPayload;
    if (payload.sub !== "OWNER_ADMIN") return false;
    return payload.exp > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}

export async function verifyPassword(
  input: string,
  password: string,
  secret: string,
): Promise<boolean> {
  if (!input || !password || password.length < 12 || secret.length < 32) {
    return false;
  }
  const key = await importKey(secret);
  const a = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(input));
  const b = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(password));
  const aa = new Uint8Array(a);
  const bb = new Uint8Array(b);
  if (aa.length !== bb.length) return false;
  let diff = 0;
  for (let i = 0; i < aa.length; i += 1) diff |= aa[i]! ^ bb[i]!;
  return diff === 0;
}

export function parseCookie(header: string | null, name: string): string | undefined {
  if (!header) return undefined;
  const parts = header.split(";");
  for (const part of parts) {
    const [k, ...rest] = part.trim().split("=");
    if (k === name) return rest.join("=");
  }
  return undefined;
}

export function sessionCookieHeader(token: string, maxAge = ADMIN_OPS_MAX_AGE_SEC): string {
  const secure = true;
  return `${ADMIN_OPS_COOKIE}=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${maxAge}${secure ? "; Secure" : ""}`;
}

export function clearSessionCookieHeader(): string {
  return `${ADMIN_OPS_COOKIE}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0; Secure`;
}
