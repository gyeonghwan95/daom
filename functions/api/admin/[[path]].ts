/**
 * /api/admin/* — OWNER_ADMIN only. Never expose to search engines.
 */
import {
  ADMIN_OPS_COOKIE,
  clearSessionCookieHeader,
  createSessionToken,
  formatKstDate,
  formatKstDateTime,
  getAdminSecrets,
  isSafeCtaUrl,
  json,
  newId,
  normalizePath,
  parseCookie,
  sessionCookieHeader,
  verifyPassword,
  verifySessionToken,
} from "../../_lib/admin-ops/crypto";
import {
  appendAudit,
  buildDashboard,
  getDaily,
  hasKv,
  kstDateRange,
  listEmailLogs,
  listNotices,
  resolveNoticeStatus,
  saveNotices,
} from "../../_lib/admin-ops/store";

const loginAttempts = new Map();

function clientIp(request) {
  return (
    request.headers.get("CF-Connecting-IP") ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown"
  );
}

/** Same-origin write guard (CSRF). Cookie auth alone is not enough for POST/PATCH. */
function assertSameOrigin(request) {
  const url = new URL(request.url);
  const origin = request.headers.get("Origin");
  if (origin) {
    try {
      if (new URL(origin).host !== url.host) {
        return json({ ok: false, code: "csrf", message: "Origin mismatch" }, 403);
      }
      return null;
    } catch {
      return json({ ok: false, code: "csrf", message: "Invalid Origin" }, 403);
    }
  }
  const referer = request.headers.get("Referer");
  if (referer) {
    try {
      if (new URL(referer).host !== url.host) {
        return json({ ok: false, code: "csrf", message: "Referer mismatch" }, 403);
      }
      return null;
    } catch {
      return json({ ok: false, code: "csrf", message: "Invalid Referer" }, 403);
    }
  }
  // Browsers always send Origin on cross-site POST; missing both is suspicious for writes.
  return json({ ok: false, code: "csrf", message: "Missing Origin" }, 403);
}

function rateLimited(ip) {
  const now = Date.now();
  const row = loginAttempts.get(ip) || { count: 0, start: now };
  if (now - row.start > 15 * 60 * 1000) {
    loginAttempts.set(ip, { count: 1, start: now });
    return false;
  }
  row.count += 1;
  loginAttempts.set(ip, row);
  return row.count > 5;
}

async function requireAdmin(request, env) {
  const secrets = getAdminSecrets(env);
  if (!secrets.configured) {
    return { ok: false, response: json({ ok: false, code: "not_configured" }, 503) };
  }
  const token = parseCookie(request.headers.get("Cookie"), ADMIN_OPS_COOKIE);
  const valid = await verifySessionToken(token, secrets.secret);
  if (!valid) {
    return { ok: false, response: json({ ok: false, code: "unauthorized" }, 401) };
  }
  return { ok: true, secrets };
}

function routeKey(params) {
  const parts = params.path;
  if (!parts) return "";
  return Array.isArray(parts) ? parts.join("/") : String(parts);
}

export async function onRequest(context) {
  const { request, env, params } = context;
  const method = request.method.toUpperCase();
  const key = routeKey(params);

  if (method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Credentials": "true",
      },
    });
  }

  // --- auth ---
  if (key === "session" && method === "GET") {
    const secrets = getAdminSecrets(env);
    if (!secrets.configured) {
      return json({
        ok: true,
        authenticated: false,
        configured: false,
        storageConfigured: hasKv(env),
      });
    }
    const token = parseCookie(request.headers.get("Cookie"), ADMIN_OPS_COOKIE);
    const authenticated = await verifySessionToken(token, secrets.secret);
    return json({
      ok: true,
      authenticated,
      configured: true,
      storageConfigured: hasKv(env),
      role: "OWNER_ADMIN",
    });
  }

  if (key === "login" && method === "POST") {
    const csrf = assertSameOrigin(request);
    if (csrf) return csrf;
    const secrets = getAdminSecrets(env);
    if (!secrets.configured) {
      return json(
        { ok: false, code: "not_configured", message: "ADMIN_PASSWORD / ADMIN_SESSION_SECRET 필요" },
        503,
      );
    }
    if (rateLimited(clientIp(request))) {
      return json({ ok: false, code: "rate_limited", message: "잠시 후 다시 시도하세요." }, 429);
    }
    let body;
    try {
      body = await request.json();
    } catch {
      return json({ ok: false, code: "bad_request" }, 400);
    }
    const okPw = await verifyPassword(String(body?.password || ""), secrets.password, secrets.secret);
    if (!okPw) {
      return json({ ok: false, code: "invalid_credentials", message: "비밀번호가 올바르지 않습니다." }, 401);
    }
    const token = await createSessionToken(secrets.secret);
    if (hasKv(env)) {
      await appendAudit(env, {
        id: newId("audit"),
        action: "login",
        createdAt: new Date().toISOString(),
        summary: `관리자 로그인 (${formatKstDateTime()})`,
      });
    }
    return json({ ok: true }, 200, { "Set-Cookie": sessionCookieHeader(token) });
  }

  if (key === "logout" && method === "POST") {
    const csrf = assertSameOrigin(request);
    if (csrf) return csrf;
    return json({ ok: true }, 200, { "Set-Cookie": clearSessionCookieHeader() });
  }

  const gate = await requireAdmin(request, env);
  if (!gate.ok) return gate.response;

  if (method !== "GET" && method !== "HEAD") {
    const csrf = assertSameOrigin(request);
    if (csrf) return csrf;
  }

  if (key === "dashboard" && method === "GET") {
    const data = await buildDashboard(env);
    return json({ ok: true, data });
  }

  if (key === "analytics" && method === "GET") {
    if (!hasKv(env)) {
      return json({ ok: true, data: { days: [], message: "아직 측정되지 않음 (ADMIN_KV 필요)" } });
    }
    const days = Number(new URL(request.url).searchParams.get("days") || "7");
    const list = kstDateRange(Math.min(Math.max(days, 1), 90));
    const series = [];
    for (const d of list) {
      series.push(await getDaily(env, d));
    }
    return json({ ok: true, data: { days: series } });
  }

  if (key === "pages" && method === "GET") {
    if (!hasKv(env)) {
      return json({ ok: true, data: { rows: [], message: "아직 측정되지 않음" } });
    }
    const today = await getDaily(env, formatKstDate());
    const rows = Object.entries(today.paths).map(([path, s]) => ({
      path,
      visits: s.visits,
      cta: s.cta,
      phone: s.phone,
      kakao: s.kakao,
      naver: s.naver,
      consultStart: s.consultStart,
      consultSubmit: s.consultSubmit,
      conversionRate:
        s.visits > 0 ? Math.round((s.consultSubmit / s.visits) * 1000) / 10 : null,
    }));
    rows.sort((a, b) => b.visits - a.visits);
    return json({ ok: true, data: { date: today.date, rows } });
  }

  if (key === "email" && method === "GET") {
    const logs = await listEmailLogs(env, 100);
    return json({
      ok: true,
      data: {
        logs,
        message: hasKv(env) ? undefined : "메일 로그 저장소 없음",
      },
    });
  }

  if (key === "monitoring" && method === "GET") {
    const dash = await buildDashboard(env);
    return json({ ok: true, data: { health: dash.health, alerts: dash.alerts } });
  }

  if (key === "notices" && method === "GET") {
    const notices = await listNotices(env);
    const now = new Date();
    return json({
      ok: true,
      data: {
        notices: notices.map((n) => ({ ...n, status: resolveNoticeStatus(n, now) })),
        storageConfigured: hasKv(env),
      },
    });
  }

  if (key === "notices" && method === "POST") {
    if (!hasKv(env)) {
      return json({ ok: false, code: "no_storage", message: "ADMIN_KV가 필요합니다." }, 503);
    }
    let body;
    try {
      body = await request.json();
    } catch {
      return json({ ok: false, code: "bad_request" }, 400);
    }
    const title = String(body?.title || "").trim().slice(0, 80);
    const message = String(body?.message || "").trim().slice(0, 500);
    if (!title || !message) {
      return json({ ok: false, code: "validation", message: "제목과 내용이 필요합니다." }, 400);
    }
    const ctaUrl = body?.ctaUrl ? String(body.ctaUrl).trim() : "";
    if (ctaUrl && !isSafeCtaUrl(ctaUrl)) {
      return json({ ok: false, code: "validation", message: "CTA URL이 허용되지 않습니다." }, 400);
    }
    const nowIso = new Date().toISOString();
    const notice = {
      id: newId("notice"),
      title,
      message,
      status: body?.publishNow ? "active" : String(body?.status || "draft"),
      startAt: body?.startAt || undefined,
      endAt: body?.endAt || undefined,
      displayScope: body?.displayScope || "home",
      selectedPaths: Array.isArray(body?.selectedPaths)
        ? body.selectedPaths.map(normalizePath).slice(0, 30)
        : undefined,
      position: body?.position || "bottom-left",
      style: body?.style || "notice",
      ctaLabel: body?.ctaLabel ? String(body.ctaLabel).slice(0, 40) : undefined,
      ctaUrl: ctaUrl || undefined,
      dismissible: body?.dismissible !== false,
      priority: Number(body?.priority) || 0,
      createdAt: nowIso,
      updatedAt: nowIso,
    };
    const notices = await listNotices(env);
    notices.unshift(notice);
    await saveNotices(env, notices.slice(0, 100));
    await appendAudit(env, {
      id: newId("audit"),
      action: "notice_create",
      entityType: "notice",
      entityId: notice.id,
      createdAt: nowIso,
      summary: `공지 생성: ${notice.title}`,
    });
    return json({ ok: true, data: notice });
  }

  if (key.startsWith("notices/") && (method === "PATCH" || method === "POST")) {
    if (!hasKv(env)) {
      return json({ ok: false, code: "no_storage" }, 503);
    }
    const id = key.slice("notices/".length).split("/")[0];
    const action = key.includes("/publish")
      ? "publish"
      : key.includes("/archive")
        ? "archive"
        : "patch";
    const notices = await listNotices(env);
    const idx = notices.findIndex((n) => n.id === id);
    if (idx < 0) return json({ ok: false, code: "not_found" }, 404);

    let body = {};
    if (method === "PATCH" || action === "patch") {
      try {
        body = await request.json();
      } catch {
        body = {};
      }
    }

    const current = notices[idx];
    const nowIso = new Date().toISOString();
    let next = { ...current, updatedAt: nowIso };

    if (action === "publish") {
      next.status = "active";
      next.startAt = next.startAt || nowIso;
    } else if (action === "archive") {
      next.status = "archived";
    } else {
      if (body.title != null) next.title = String(body.title).trim().slice(0, 80);
      if (body.message != null) next.message = String(body.message).trim().slice(0, 500);
      if (body.status != null) next.status = String(body.status);
      if (body.startAt !== undefined) next.startAt = body.startAt || undefined;
      if (body.endAt !== undefined) next.endAt = body.endAt || undefined;
      if (body.displayScope != null) next.displayScope = body.displayScope;
      if (body.position != null) next.position = body.position;
      if (body.style != null) next.style = body.style;
      if (body.ctaLabel !== undefined) next.ctaLabel = body.ctaLabel || undefined;
      if (body.ctaUrl !== undefined) {
        const u = body.ctaUrl ? String(body.ctaUrl).trim() : "";
        if (u && !isSafeCtaUrl(u)) {
          return json({ ok: false, code: "validation", message: "CTA URL이 허용되지 않습니다." }, 400);
        }
        next.ctaUrl = u || undefined;
      }
      if (body.dismissible != null) next.dismissible = Boolean(body.dismissible);
      if (body.priority != null) next.priority = Number(body.priority) || 0;
      if (Array.isArray(body.selectedPaths)) {
        next.selectedPaths = body.selectedPaths.map(normalizePath).slice(0, 30);
      }
    }

    notices[idx] = next;
    await saveNotices(env, notices);
    await appendAudit(env, {
      id: newId("audit"),
      action: `notice_${action}`,
      entityType: "notice",
      entityId: id,
      createdAt: nowIso,
      summary: `공지 ${action}: ${next.title}`,
    });
    return json({ ok: true, data: next });
  }

  return json({ ok: false, code: "not_found", path: key }, 404);
}
