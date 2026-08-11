/**
 * Admin console fetch helper — surfaces API codes instead of generic "네트워크 오류".
 */

export type AdminApiResult<T> =
  | { ok: true; data: T; status: number }
  | { ok: false; message: string; code?: string; status: number };

export async function adminFetchJson<T = unknown>(
  input: string,
  init?: RequestInit,
): Promise<AdminApiResult<T>> {
  let res: Response;
  try {
    res = await fetch(input, {
      credentials: "include",
      ...init,
      headers: {
        Accept: "application/json",
        ...(init?.headers || {}),
      },
    });
  } catch {
    return {
      ok: false,
      status: 0,
      message: "네트워크 오류 — 연결을 확인한 뒤 다시 시도하세요.",
    };
  }

  let json: {
    ok?: boolean;
    data?: T;
    message?: string;
    code?: string;
  } = {};
  try {
    json = (await res.json()) as typeof json;
  } catch {
    return {
      ok: false,
      status: res.status,
      message: `응답을 해석하지 못했습니다 (HTTP ${res.status}). Pages Function 배포·라우팅을 확인하세요.`,
    };
  }

  if (!res.ok || json.ok === false) {
    const code = json.code;
    let message = json.message;
    if (!message) {
      if (res.status === 401 || code === "unauthorized") {
        message = "로그인이 필요합니다. 다시 로그인해 주세요.";
      } else if (code === "not_configured") {
        message = "ADMIN_PASSWORD / ADMIN_SESSION_SECRET이 설정되지 않았습니다.";
      } else if (code === "no_storage") {
        message =
          "ADMIN_KV 바인딩이 없습니다. wrangler.toml을 확인한 뒤 재배포하세요.";
      } else {
        message = `불러오기 실패 (HTTP ${res.status}${code ? ` · ${code}` : ""})`;
      }
    }
    return { ok: false, status: res.status, message, code };
  }

  return { ok: true, status: res.status, data: json.data as T };
}
