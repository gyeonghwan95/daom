/**
 * Admin console ingest + API smoke tests (mock KV, no live Cloudflare).
 * Usage: npx --yes tsx scripts/test-admin-console.ts
 */
import { onRequestPost as collectPost } from "../functions/api/analytics/collect.ts";
import { onRequest as adminOnRequest } from "../functions/api/admin/[[path]].ts";
import {
  appendEmailLog,
  buildConversionsReport,
  buildDashboard,
  buildMonitoring,
  buildPagesReport,
  getDaily,
  getNoticeStatsMap,
  listEmailLogs,
  listNotices,
  recordAnalyticsEvent,
  saveNotices,
} from "../functions/_lib/admin-ops/store.ts";
import { formatKstDate } from "../functions/_lib/admin-ops/crypto.ts";

let failed = 0;

function assert(cond: unknown, msg: string) {
  if (!cond) {
    console.error(`FAIL: ${msg}`);
    failed += 1;
  }
}

class MemoryKV {
  ops = { get: 0, put: 0, list: 0, delete: 0 };
  data = new Map<string, string>();
  async get(key: string) {
    this.ops.get += 1;
    return this.data.get(key) ?? null;
  }
  async put(key: string, value: string) {
    this.ops.put += 1;
    this.data.set(key, value);
  }
  async list() {
    this.ops.list += 1;
    return { keys: [] };
  }
  async delete(key: string) {
    this.ops.delete += 1;
    this.data.delete(key);
  }
}

const PASSWORD = "admin-console-test-password";
const SECRET = "admin-console-test-secret-32chars!!";

function adminEnv(kv: MemoryKV) {
  return {
    ADMIN_KV: kv,
    ADMIN_PASSWORD: PASSWORD,
    ADMIN_SESSION_SECRET: SECRET,
  };
}

function collectRequest(input: {
  type: string;
  path?: string;
  ip?: string;
  sid?: string;
  ua?: string;
  cookie?: string;
  meta?: Record<string, string>;
}) {
  const headers: Record<string, string> = {
    "user-agent": input.ua ?? "Mozilla/5.0 daom-admin-test",
    "Content-Type": "application/json",
  };
  if (input.ip) headers["CF-Connecting-IP"] = input.ip;
  if (input.cookie) headers.Cookie = input.cookie;
  const meta = { ...(input.meta || {}) };
  if (input.sid) meta.sid = input.sid;
  return new Request("https://example.test/api/analytics/collect", {
    method: "POST",
    headers,
    body: JSON.stringify({ type: input.type, path: input.path || "/", meta }),
  });
}

async function adminRequest(
  env: ReturnType<typeof adminEnv>,
  method: string,
  path: string,
  opts?: { cookie?: string; body?: unknown; origin?: string },
) {
  const headers: Record<string, string> = {
    Accept: "application/json",
  };
  if (opts?.cookie) headers.Cookie = opts.cookie;
  if (opts?.origin) headers.Origin = opts.origin;
  if (opts?.body != null) headers["Content-Type"] = "application/json";
  const pathOnly = path.split("?")[0];
  const request = new Request(`https://example.test/api/admin/${path}`, {
    method,
    headers,
    body: opts?.body != null ? JSON.stringify(opts.body) : undefined,
  });
  return adminOnRequest({
    request,
    env,
    params: { path: pathOnly.split("/") },
  });
}

function cookieFrom(res: Response) {
  const raw = res.headers.get("Set-Cookie") || "";
  return raw.split(";")[0];
}

async function main() {
  const kv = new MemoryKV();
  const env = adminEnv(kv);

  const pv1 = await collectPost({
    request: collectRequest({
      type: "page_view",
      path: "/",
      ip: "203.0.113.10",
      sid: "sessionAA",
    }),
    env,
  });
  const pv1Json = await pv1.json();
  assert(pv1.status === 200 && pv1Json.stored === true, "first page_view stored");

  const pv2 = await collectPost({
    request: collectRequest({
      type: "page_view",
      path: "/부산상속법무사",
      ip: "203.0.113.10",
      sid: "sessionAA",
    }),
    env,
  });
  const pv2Json = await pv2.json();
  assert(pv2.status === 200 && pv2Json.stored === true, "second path page_view stored");

  const pvOther = await collectPost({
    request: collectRequest({
      type: "page_view",
      path: "/부산상속포기",
      ip: "203.0.113.11",
      sid: "sessionBB",
    }),
    env,
  });
  assert((await pvOther.json()).stored === true, "other session page_view stored");

  const today = formatKstDate();
  const day = await getDaily(env, today);
  assert(day.visits === 3, `visits=3 got ${day.visits}`);
  assert(day.sessions === 2, `sessions=2 got ${day.sessions}`);
  assert(day.paths["/"]?.visits === 1, "home path visits");
  assert(day.paths["/부산상속법무사"]?.visits === 1, "champion path visits");

  const samePath = await collectPost({
    request: collectRequest({
      type: "page_view",
      path: "/",
      ip: "203.0.113.10",
      sid: "sessionAA",
    }),
    env,
  });
  const samePathJson = await samePath.json();
  assert(
    samePathJson.skipped === true && samePathJson.reason === "dedupe",
    "same IP+path 8s dedupe",
  );
  const dayAfterDedupe = await getDaily(env, today);
  assert(dayAfterDedupe.visits === 3, "dedupe did not increment visits");

  const adminPath = await collectPost({
    request: collectRequest({ type: "page_view", path: "/admin", ip: "203.0.113.20" }),
    env,
  });
  assert((await adminPath.json()).reason === "admin_path", "/admin page_view skipped");

  const putsBeforeBot = kv.ops.put;
  const bot = await collectPost({
    request: collectRequest({
      type: "page_view",
      path: "/",
      ip: "203.0.113.30",
      ua: "Mozilla/5.0 (compatible; Googlebot/2.1)",
    }),
    env,
  });
  const botJson = await bot.json();
  assert(botJson.skipped === true && botJson.reason === "bot", "bot skipped");
  assert(kv.ops.put === putsBeforeBot, "bot skip writes 0");

  const cta = await collectPost({
    request: collectRequest({
      type: "cta_click",
      path: "/contact",
      ip: "203.0.113.40",
      meta: { kind: "phone", dest: "tel:" },
    }),
    env,
  });
  assert((await cta.json()).stored === true, "cta stored");

  const consult = await recordAnalyticsEvent(env, {
    type: "consultation_submit",
    path: "/contact/inquiry",
    ip: "203.0.113.41",
  });
  assert(consult.ok === true, "consult submit stored");

  const impression = await recordAnalyticsEvent(env, {
    type: "notice_impression",
    path: "/",
    ip: "203.0.113.42",
    meta: { noticeId: "n1" },
  });
  assert(impression.ok === true, "notice impression stored");

  await appendEmailLog(env, {
    id: "mail-1",
    timestamp: new Date().toISOString(),
    messageType: "inquiry",
    provider: "resend",
    recipientMasked: "a***@example.com",
    status: "success",
    path: "/contact/inquiry",
  });
  const mails = await listEmailLogs(env, 10);
  assert(mails.length === 1 && mails[0].status === "success", "email log stored");

  await saveNotices(env, [
    {
      id: "n1",
      title: "테스트 공지",
      message: "본문",
      status: "active",
      publishedAt: new Date().toISOString(),
      displayScope: "all",
      position: "bottom-left",
      style: "notice",
      dismissible: true,
      priority: 10,
      showPopup: true,
      isPublicArchive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ]);
  const notices = await listNotices(env);
  assert(notices.length === 1 && notices[0].id === "n1", "notice saved");
  const noticeStats = await getNoticeStatsMap(env, 7);
  assert(noticeStats.n1?.impression >= 1, "notice impression in 7d stats");

  const dash = await buildDashboard(env);
  assert(dash.kpis.visitsToday === 3, `dashboard visitsToday=3 got ${dash.kpis.visitsToday}`);
  assert(dash.kpis.sessionsToday === 2, `dashboard sessionsToday=2 got ${dash.kpis.sessionsToday}`);
  assert(dash.kpis.ctaToday >= 1, "dashboard ctaToday");
  assert(dash.kpis.consultSubmitToday >= 1, "dashboard consultSubmitToday");
  assert(dash.kpis.emailSuccessToday >= 1, "dashboard emailSuccessToday");
  assert(Array.isArray(dash.hourlyToday), "dashboard hourlyToday");
  const hourSum = (dash.hourlyToday || []).reduce(
    (n: number, h: { pageViews?: number }) => n + (h.pageViews || 0),
    0,
  );
  assert(hourSum === 3, `hourly pageViews=3 got ${hourSum}`);
  assert(
    [...kv.data.keys()].every((k) => !String(k).includes("analytics:hourly:")),
    "new events do not create analytics:hourly keys",
  );

  // Same-isolate: dashboard GET memo must not poison a later write on an unread shard.
  const afterDash = await collectPost({
    request: collectRequest({
      type: "page_view",
      path: "/부산법무사상담",
      ip: "203.0.113.77",
      sid: "sessionCC",
    }),
    env,
  });
  assert((await afterDash.json()).stored === true, "page_view after dashboard still stored");
  const dayAfterDash = await getDaily(env, today);
  assert(dayAfterDash.visits === 4, `visits after dashboard write=4 got ${dayAfterDash.visits}`);
  assert(dayAfterDash.sessions === 3, `sessions after dashboard write=3 got ${dayAfterDash.sessions}`);

  const monitoring = await buildMonitoring(env);
  assert(monitoring.kpis.visitsToday === 4, "monitoring visitsToday");
  assert(monitoring.kpis.sessionsToday === 3, "monitoring sessionsToday");
  assert(Array.isArray(monitoring.health), "monitoring health cards");
  assert(monitoring.noticeToday?.impression >= 1, "monitoring notice impression");

  const pages = await buildPagesReport(env, 30);
  assert((pages.rows || []).some((r: { path: string }) => r.path === "/"), "pages report has /");

  const conversions = await buildConversionsReport(env);
  assert(conversions.funnel?.pageViews === 4, "conversions funnel pageViews");
  assert((conversions.channels || []).length >= 1, "conversions channels");

  const sessionAnon = await adminRequest(env, "GET", "session");
  const sessionAnonJson = await sessionAnon.json();
  assert(sessionAnon.status === 200, "session endpoint 200");
  assert(sessionAnonJson.configured === true, "admin configured");
  assert(sessionAnonJson.authenticated === false, "anon not authenticated");
  assert(sessionAnonJson.storageConfigured === true, "KV bound");

  const dashUnauth = await adminRequest(env, "GET", "dashboard");
  assert(dashUnauth.status === 401, "dashboard requires auth");

  const loginCsrf = await adminRequest(env, "POST", "login", {
    body: { password: PASSWORD },
  });
  assert(loginCsrf.status === 403, "login without Origin is CSRF");

  const loginBad = await adminRequest(env, "POST", "login", {
    origin: "https://example.test",
    body: { password: "wrong-password-xx" },
  });
  assert(loginBad.status === 401, "bad password 401");

  const loginOk = await adminRequest(env, "POST", "login", {
    origin: "https://example.test",
    body: { password: PASSWORD },
  });
  const loginJson = await loginOk.json();
  const cookie = cookieFrom(loginOk);
  assert(loginOk.status === 200 && loginJson.ok === true, "login ok");
  assert(cookie.startsWith("daom_admin_session="), "session cookie set");

  const sessionAuth = await adminRequest(env, "GET", "session", { cookie });
  assert((await sessionAuth.json()).authenticated === true, "session authenticated");

  const adminCollect = await collectPost({
    request: collectRequest({
      type: "page_view",
      path: "/부산한정승인",
      ip: "203.0.113.99",
      sid: "sessionAD",
      cookie,
    }),
    env,
  });
  assert((await adminCollect.json()).reason === "admin_session", "admin cookie not counted");
  const dayAfterAdmin = await getDaily(env, today);
  assert(dayAfterAdmin.visits === 4, "admin browsing did not add visits");

  for (const route of [
    "dashboard",
    "analytics?days=14",
    "pages?days=30",
    "conversions",
    "email",
    "monitoring",
    "notices",
  ]) {
    const path = route.split("?")[0];
    const res = await adminRequest(env, "GET", route, { cookie });
    const json = await res.json();
    assert(res.status === 200 && json.ok === true, `GET /api/admin/${path} 200`);
  }

  const dashApi = await adminRequest(env, "GET", "dashboard", { cookie });
  const dashApiJson = await dashApi.json();
  assert(dashApiJson.data?.kpis?.visitsToday === 4, "API dashboard visitsToday");
  assert(dashApiJson.data?.kpis?.sessionsToday === 3, "API dashboard sessionsToday");

  const noticeCreate = await adminRequest(env, "POST", "notices", {
    cookie,
    origin: "https://example.test",
    body: { title: "콘솔 테스트", message: "내용", publishNow: true },
  });
  const created = await noticeCreate.json();
  assert(noticeCreate.status === 200 && created.data?.id, "notice create");
  const noticeId = created.data.id as string;

  const noticePatch = await adminRequest(env, "PATCH", `notices/${noticeId}`, {
    cookie,
    origin: "https://example.test",
    body: { title: "콘솔 테스트 수정" },
  });
  assert(noticePatch.status === 200, "notice patch");

  const noticeArchive = await adminRequest(env, "POST", `notices/${noticeId}/archive`, {
    cookie,
    origin: "https://example.test",
  });
  assert(noticeArchive.status === 200, "notice archive");

  const noticeDelete = await adminRequest(env, "DELETE", `notices/${noticeId}`, {
    cookie,
    origin: "https://example.test",
  });
  assert(noticeDelete.status === 200, "notice delete");

  kv.__daomReadMemo?.clear?.();
  await kv.put(
    `analytics:hourly:${today}`,
    JSON.stringify({
      date: today,
      hours: {
        "3": { pageViews: 7, cta: 0, consultSubmit: 0, naverPlace: 0, sources: {} },
      },
    }),
  );
  const dashLegacy = await buildDashboard(env);
  const hour3 = (dashLegacy.hourlyToday || []).find(
    (h: { hour: number }) => h.hour === 3,
  );
  assert((hour3?.pageViews || 0) >= 7, "legacy hourly keys still merge into charts");

  const logout = await adminRequest(env, "POST", "logout", {
    cookie,
    origin: "https://example.test",
  });
  assert(logout.status === 200, "logout 200");

  if (failed) {
    console.error(`test-admin-console: ${failed} failed`);
    process.exit(1);
  }
  console.log("test-admin-console PASS");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
