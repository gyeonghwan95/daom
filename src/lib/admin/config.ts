export const ADMIN_COOKIE_NAME = "daom_admin_session";
export const ADMIN_SESSION_MAX_AGE_SEC = 8 * 60 * 60;
export const ADMIN_LOGIN_MAX_ATTEMPTS = 5;
export const ADMIN_LOGIN_WINDOW_MS = 15 * 60 * 1000;

export function getAdminSessionSecret(): string | null {
  const secret = process.env.ADMIN_SESSION_SECRET?.trim();
  return secret && secret.length >= 32 ? secret : null;
}

export function getAdminPassword(): string | null {
  const password = process.env.ADMIN_PASSWORD?.trim();
  return password && password.length >= 12 ? password : null;
}

export function isAdminEnvConfigured(): boolean {
  return Boolean(getAdminSessionSecret() && getAdminPassword());
}

/** @deprecated API 라우트에서는 isAdminAvailable(request) 사용 */
export function isAdminConfigured(): boolean {
  return isAdminEnvConfigured();
}

export function isStaticExportBuild(): boolean {
  return process.env.STATIC_EXPORT === "true";
}
