import { NextResponse } from "next/server";
import { isAdminConfigured } from "@/lib/admin/config";
import { getAdminSessionFromRequest } from "@/lib/admin/request";

export const runtime = "nodejs";

export async function GET(request: Request) {
  if (!isAdminConfigured()) {
    return NextResponse.json({ authenticated: false, configured: false });
  }

  return NextResponse.json({
    authenticated: getAdminSessionFromRequest(request),
    configured: true,
  });
}
