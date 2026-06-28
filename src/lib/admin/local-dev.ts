const LOCAL_ADMIN_HOSTS = new Set(["localhost", "127.0.0.1", "[::1]"]);

export function getHostnameFromHostHeader(host: string): string {
  const trimmed = host.trim().toLowerCase();
  if (trimmed.startsWith("[")) {
    const end = trimmed.indexOf("]");
    return end === -1 ? trimmed : trimmed.slice(0, end + 1);
  }
  return trimmed.split(":")[0] ?? "";
}

export function isLocalAdminHost(host: string): boolean {
  return LOCAL_ADMIN_HOSTS.has(getHostnameFromHostHeader(host));
}

/** npm run dev + localhost 접속 시 관리자 기능 자동 활성화 (프로덕션 빌드에서는 비활성) */
export function isLocalAdminRequest(request: Request): boolean {
  if (process.env.NODE_ENV !== "development") return false;
  const host = request.headers.get("host") ?? "";
  return isLocalAdminHost(host);
}
