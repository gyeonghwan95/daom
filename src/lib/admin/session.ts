import { createHmac, timingSafeEqual } from "node:crypto";
import {
  ADMIN_COOKIE_NAME,
  ADMIN_SESSION_MAX_AGE_SEC,
  getAdminSessionSecret,
} from "@/lib/admin/config";

type SessionPayload = {
  sub: "admin";
  exp: number;
};

function encodePayload(payload: SessionPayload): string {
  return Buffer.from(JSON.stringify(payload)).toString("base64url");
}

function decodePayload(encoded: string): SessionPayload | null {
  try {
    const parsed = JSON.parse(
      Buffer.from(encoded, "base64url").toString("utf8"),
    ) as SessionPayload;
    if (parsed.sub !== "admin" || typeof parsed.exp !== "number") return null;
    return parsed;
  } catch {
    return null;
  }
}

function sign(encodedPayload: string, secret: string): string {
  return createHmac("sha256", secret).update(encodedPayload).digest("base64url");
}

export function createAdminSessionToken(): string | null {
  const secret = getAdminSessionSecret();
  if (!secret) return null;

  const payload: SessionPayload = {
    sub: "admin",
    exp: Math.floor(Date.now() / 1000) + ADMIN_SESSION_MAX_AGE_SEC,
  };

  const encoded = encodePayload(payload);
  return `${encoded}.${sign(encoded, secret)}`;
}

export function verifyAdminSessionToken(token: string | undefined): boolean {
  if (!token) return false;

  const secret = getAdminSessionSecret();
  if (!secret) return false;

  const [encoded, signature] = token.split(".");
  if (!encoded || !signature) return false;

  const expected = sign(encoded, secret);
  const sigBuf = Buffer.from(signature);
  const expBuf = Buffer.from(expected);
  if (sigBuf.length !== expBuf.length) return false;
  if (!timingSafeEqual(sigBuf, expBuf)) return false;

  const payload = decodePayload(encoded);
  if (!payload) return false;

  return payload.exp > Math.floor(Date.now() / 1000);
}

export function getAdminCookieName(): string {
  return ADMIN_COOKIE_NAME;
}

export function getAdminCookieOptions(maxAgeSec = ADMIN_SESSION_MAX_AGE_SEC) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    path: "/",
    maxAge: maxAgeSec,
  };
}
