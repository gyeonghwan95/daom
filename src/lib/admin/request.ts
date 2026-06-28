import { cookies, headers } from "next/headers";
import { isAdminEnvConfigured } from "@/lib/admin/config";
import { isLocalAdminHost, isLocalAdminRequest } from "@/lib/admin/local-dev";
import { getAdminCookieName, verifyAdminSessionToken } from "@/lib/admin/session";

export function isAdminAvailable(request: Request): boolean {
  return isAdminEnvConfigured() || isLocalAdminRequest(request);
}

function hasValidAdminSessionCookie(cookieHeader: string): boolean {
  const name = getAdminCookieName();
  const match = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`));

  if (!match) return false;
  const token = decodeURIComponent(match.slice(name.length + 1));
  return verifyAdminSessionToken(token);
}

export async function isAdminRequestAuthenticated(): Promise<boolean> {
  const headersList = await headers();
  const host = headersList.get("host") ?? "";
  if (process.env.NODE_ENV === "development" && isLocalAdminHost(host)) {
    return true;
  }

  const cookieStore = await cookies();
  const token = cookieStore.get(getAdminCookieName())?.value;
  return verifyAdminSessionToken(token);
}

export function getAdminSessionFromRequest(request: Request): boolean {
  if (isLocalAdminRequest(request)) return true;

  const cookieHeader = request.headers.get("cookie") ?? "";
  return hasValidAdminSessionCookie(cookieHeader);
}
