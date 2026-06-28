import { NextResponse } from "next/server";
import { isLocalAdminRequest } from "@/lib/admin/local-dev";
import {
  getAdminSessionFromRequest,
  isAdminAvailable,
} from "@/lib/admin/request";

export const runtime = "nodejs";

export async function GET(request: Request) {
  if (!isAdminAvailable(request)) {
    return NextResponse.json({ authenticated: false, configured: false });
  }

  const localDev = isLocalAdminRequest(request);

  return NextResponse.json({
    authenticated: getAdminSessionFromRequest(request),
    configured: true,
    localDev,
  });
}
