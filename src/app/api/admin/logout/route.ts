import { NextResponse } from "next/server";
import {
  getAdminCookieName,
  getAdminCookieOptions,
} from "@/lib/admin/session";

export const runtime = "nodejs";

export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(getAdminCookieName(), "", {
    ...getAdminCookieOptions(0),
    maxAge: 0,
  });
  return response;
}
