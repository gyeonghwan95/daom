import { NextResponse } from "next/server";
import { verifyAdminPassword } from "@/lib/admin/auth";
import { isAdminEnvConfigured } from "@/lib/admin/config";
import { isLocalAdminRequest } from "@/lib/admin/local-dev";
import {
  clearLoginAttempts,
  getClientIp,
  isLoginRateLimited,
  recordFailedLogin,
} from "@/lib/admin/rate-limit";
import {
  createAdminSessionToken,
  getAdminCookieName,
  getAdminCookieOptions,
} from "@/lib/admin/session";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!isAdminEnvConfigured() && !isLocalAdminRequest(request)) {
    return NextResponse.json(
      { error: "관리자 기능이 설정되지 않았습니다." },
      { status: 503 },
    );
  }

  const ip = getClientIp(request);
  if (isLoginRateLimited(ip)) {
    return NextResponse.json(
      { error: "로그인 시도 횟수를 초과했습니다. 잠시 후 다시 시도해 주세요." },
      { status: 429 },
    );
  }

  let password = "";
  try {
    const body = (await request.json()) as { password?: string };
    password = body.password?.trim() ?? "";
  } catch {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }

  if (!password) {
    return NextResponse.json({ error: "비밀번호를 입력해 주세요." }, { status: 400 });
  }

  if (!verifyAdminPassword(password)) {
    recordFailedLogin(ip);
    return NextResponse.json(
      { error: "비밀번호가 올바르지 않습니다." },
      { status: 401 },
    );
  }

  clearLoginAttempts(ip);
  const token = createAdminSessionToken();
  if (!token) {
    return NextResponse.json(
      { error: "세션을 생성할 수 없습니다." },
      { status: 500 },
    );
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(getAdminCookieName(), token, getAdminCookieOptions());
  return response;
}
