import { cookies } from "next/headers";
import { getAdminCookieName, verifyAdminSessionToken } from "@/lib/admin/session";

export async function isAdminRequestAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(getAdminCookieName())?.value;
  return verifyAdminSessionToken(token);
}

export function getAdminSessionFromRequest(request: Request): boolean {
  const cookieHeader = request.headers.get("cookie") ?? "";
  const name = getAdminCookieName();
  const match = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`));

  if (!match) return false;
  const token = decodeURIComponent(match.slice(name.length + 1));
  return verifyAdminSessionToken(token);
}
