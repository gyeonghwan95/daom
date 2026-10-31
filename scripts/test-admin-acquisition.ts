/**
 * 유입 분석(acquisition) 수집·집계·API 테스트 (mock KV, live Cloudflare 없음).
 * Usage: npx --yes tsx scripts/test-admin-acquisition.ts
 */
import { onRequestPost as collectPost } from "../functions/api/analytics/collect.ts";
import { onRequest as adminOnRequest } from "../functions/api/admin/[[path]].ts";
import { classifyReferrer } from "../functions/_lib/admin-ops/crypto.ts";
import { classifyReferrer as classifyReferrerClient } from "../src/lib/admin-ops/utils.ts";

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

const PASSWORD = "admin-acquisition-test-password";
const SECRET = "admin-acquisition-test-secret-32chars!";

function adminEnv(kv: MemoryKV) {
  return { ADMIN_KV: kv, ADMIN_PASSWORD: PASSWORD, ADMIN_SESSION_SECRET: SECRET };
}

type Entry = { ch: string; host?: string; us?: string; um?: string; uc?: string; lp: string };

function collect(
  env: ReturnType<typeof adminEnv>,
  input: {
    type: string;
    path: string;
    ip: string;
    sid: string;
    entry: Entry;
    entryView?: boolean;
    deviceType?: "mobile" | "desktop";
    meta?: Record<string, string>;
  },
) {
  const request = new Request("https://example.test/api/analytics/collect", {
    method: "POST",
    headers: {
      "user-agent": "Mozilla/5.0 daom-acquisition-test",
      "Content-Type": "application/json",
      "CF-Connecting-IP": input.ip,
    },
    body: JSON.stringify({
      type: input.type,
      path: input.path,
      referrerHost: input.entry.host,
      referrerType: input.entryView ? input.entry.ch : "internal",
      deviceType: input.deviceType ?? "desktop",
      meta: { ...(input.meta || {}), sid: input.sid },
      entry: input.entry,
      entryView: input.entryView === true,
    }),
  });
  return collectPost({ request, env });
}

async function adminRequest(
  env: ReturnType<typeof adminEnv>,
  method: string,
  path: string,
  opts?: { cookie?: string; body?: unknown; origin?: string },
) {
  const headers: Record<string, string> = { Accept: "application/json" };
  if (opts?.cookie) headers.Cookie = opts.cookie;
  if (opts?.origin) headers.Origin = opts.origin;
  if (opts?.body != null) headers["Content-Type"] = "application/json";
  const pathOnly = path.split("?")[0];
  const request = new Request(`https://example.test/api/admin/${path}`, {
    method,
    headers,
    body: opts?.body != null ? JSON.stringify(opts.body) : undefined,
  });
  return adminOnRequest({ request, env, params: { path: pathOnly.split("/") } });
}

async function main() {
  // ── 분류 규칙 (서버·클라이언트 동일) ──
  const cases: Array<[string, string]> = [
    ["search.naver.com", "naver"],
    ["m.blog.naver.com", "naver"],
    ["www.google.co.kr", "google"],
    ["gemini.google.com", "ai"],
    ["chatgpt.com", "ai"],
    ["www.perplexity.ai", "ai"],
    ["copilot.microsoft.com", "ai"],
    ["search.daum.net", "daum"],
    ["map.kakao.com", "daum"],
    ["story.kakao.com", "sns"],
    ["t.co", "sns"],
    ["m.youtube.com", "sns"],
    ["toast.co.kr", "external"],
    ["xn--v92b7y13glcu4ce1d19f.kr", "external"],
    ["www.bing.com", "bing"],
    ["xn--2j1br1na42lvxja38mk8r.kr", "internal"],
  ];
  for (const [host, expected] of cases) {
    assert(classifyReferrer(host) === expected, `server classify ${host} → ${expected}, got ${classifyReferrer(host)}`);
    assert(
      classifyReferrerClient(host) === expected,
      `client classify ${host} → ${expected}, got ${classifyReferrerClient(host)}`,
    );
  }

  // ── 핫패스 비용: page_view 1건 = GET 1 + PUT 1 ──
  {
    const kv = new MemoryKV();
    const env = adminEnv(kv);
    const res = await collect(env, {
      type: "page_view",
      path: "/",
      ip: "198.51.100.1",
      sid: "hotpath01",
      entry: { ch: "naver", host: "search.naver.com", lp: "/" },
      entryView: true,
    });
    assert((await res.json()).stored === true, "hot path page_view stored");
    assert(kv.ops.get === 1 && kv.ops.put === 1, `page_view with entry = 1 GET/1 PUT, got ${kv.ops.get}/${kv.ops.put}`);
  }

  const kv = new MemoryKV();
  const env = adminEnv(kv);

  // A: 네이버 검색 → 모바일 진입 → 2페이지 → 전화 (참여·전환)
  const a: Entry = { ch: "naver", host: "search.naver.com", lp: "/부산상속등기" };
  await collect(env, { type: "page_view", path: "/부산상속등기", ip: "203.0.113.1", sid: "sessA0001", entry: a, entryView: true, deviceType: "mobile" });
  await collect(env, { type: "page_view", path: "/contact", ip: "203.0.113.1", sid: "sessA0001", entry: a, deviceType: "mobile" });
  await collect(env, { type: "phone_click", path: "/contact", ip: "203.0.113.1", sid: "sessA0001", entry: a, deviceType: "mobile", meta: { kind: "phone" } });

  // B: ChatGPT → 1페이지 이탈
  const b: Entry = { ch: "ai", host: "chatgpt.com", lp: "/" };
  await collect(env, { type: "page_view", path: "/", ip: "203.0.113.2", sid: "sessB0001", entry: b, entryView: true });

  // C: UTM 캠페인(직접 진입) → 카카오 + 문의 제출 (전환은 세션당 1회)
  const c: Entry = { ch: "direct", us: "Naver_Blog", um: "Blog", uc: "가을 상속", lp: "/services" };
  await collect(env, { type: "page_view", path: "/services", ip: "203.0.113.3", sid: "sessC0001", entry: c, entryView: true });
  await collect(env, { type: "kakao_click", path: "/services", ip: "203.0.113.3", sid: "sessC0001", entry: c, meta: { kind: "kakao" } });
  await collect(env, { type: "consultation_submit", path: "/services", ip: "203.0.113.3", sid: "sessC0001", entry: c, meta: { kind: "inquiry" } });

  // D: 네이버 블로그 → 계산기 사용 (참여, 전환 아님)
  const d: Entry = { ch: "naver", host: "m.blog.naver.com", lp: "/tools" };
  await collect(env, { type: "page_view", path: "/tools", ip: "203.0.113.4", sid: "sessD0001", entry: d, entryView: true });
  await collect(env, { type: "tool_used", path: "/tools", ip: "203.0.113.4", sid: "sessD0001", entry: d, meta: { tool: "x" } });

  // E: 클라이언트가 채널을 속여도 서버가 호스트로 재판정, 숫자 8자리+ UTM은 버림
  const e: Entry = { ch: "google", host: "toast.co.kr", us: "01012345678", lp: "/" };
  await collect(env, { type: "page_view", path: "/", ip: "203.0.113.5", sid: "sessE0001", entry: e, entryView: true });

  // F: 새 탭 등 자사 referrer 진입 → internal (외부 세션 합계에서 제외)
  const f: Entry = { ch: "internal", host: "xn--2j1br1na42lvxja38mk8r.kr", lp: "/faq" };
  await collect(env, { type: "page_view", path: "/faq", ip: "203.0.113.6", sid: "sessF0001", entry: f, entryView: true });

  const login = await adminRequest(env, "POST", "login", {
    body: { password: PASSWORD },
    origin: "https://example.test",
  });
  const cookie = (login.headers.get("Set-Cookie") || "").split(";")[0];
  assert(login.status === 200, "login 200");

  const unauth = await adminRequest(env, "GET", "acquisition?days=7");
  assert(unauth.status === 401, "acquisition requires admin session");

  const res = await adminRequest(env, "GET", "acquisition?days=7", { cookie });
  assert(res.status === 200, `acquisition 200, got ${res.status}`);
  const report = (await res.json()).data;

  assert(report.range.days === 7, "range 7 days");
  assert(report.compareRange != null, "7-day report has compare range");
  assert(report.coverage.acqDays === 1, `acqDays=1 got ${report.coverage.acqDays}`);

  const t = report.totals;
  assert(t.sessions === 5, `external sessions=5 got ${t.sessions}`);
  assert(t.internalSessions === 1, `internal sessions=1 got ${t.internalSessions}`);
  assert(t.acqSessions === 5, `acqSessions=5 got ${t.acqSessions}`);
  assert(t.eng === 3, `engaged=3 (A,C,D) got ${t.eng}`);
  assert(t.cv === 2, `converted sessions=2 (A,C) got ${t.cv}`);
  assert(t.contacts === 3, `contacts=3 (phone,kakao,submit) got ${t.contacts}`);
  assert(t.submit === 1, "submit=1");
  assert(t.m === 1, `mobile entries=1 got ${t.m}`);

  const ch = (id: string) => report.channels.find((r: { id: string }) => r.id === id);
  assert(ch("naver")?.sessions === 2 && ch("naver")?.eng === 2 && ch("naver")?.cv === 1, "naver channel s2/eng2/cv1");
  assert(ch("naver")?.phone === 1, "naver phone=1");
  assert(ch("ai")?.sessions === 1 && ch("ai")?.eng === 0, "ai channel bounce");
  assert(ch("campaign")?.cv === 1 && ch("campaign")?.kakao === 1 && ch("campaign")?.submit === 1, "campaign converts once, counts both actions");
  assert(ch("external")?.sessions === 1, "spoofed google re-classified as external");
  assert(!ch("google"), "no google row from spoofed client channel");
  assert(report.channels[report.channels.length - 1].id === "internal", "internal channel sorted last");

  const ref = (host: string) => report.referrers.find((r: { host: string }) => r.host === host);
  assert(ref("search.naver.com")?.s === 1 && ref("search.naver.com")?.cv === 1, "referrer search.naver.com");
  assert(ref("m.blog.naver.com")?.eng === 1 && ref("m.blog.naver.com")?.channel === "naver", "referrer blog engaged");
  assert(ref("toast.co.kr")?.channel === "external", "referrer row channel");
  assert(!report.referrers.some((r: { host: string }) => r.host.startsWith("xn--2j1br1na42")), "own host never listed");

  const land = (path: string) => report.landings.find((r: { path: string }) => r.path === path);
  assert(land("/부산상속등기")?.s === 1 && land("/부산상속등기")?.cv === 1, "landing conversions by landing page");
  assert(land("/부산상속등기")?.mix?.naver === 1, "landing channel mix");
  assert(land("/부산상속등기")?.pv === 2, `landing pv counts whole session, got ${land("/부산상속등기")?.pv}`);

  assert(report.campaigns.length === 1, `one campaign (numeric utm dropped), got ${report.campaigns.length}`);
  const camp = report.campaigns[0];
  assert(camp?.source === "naver_blog" && camp?.medium === "blog" && camp?.campaign === "가을 상속", "utm normalized");
  assert(camp?.cv === 1, "campaign conversion");

  const today = report.daily[report.daily.length - 1];
  assert(today.hasAcq === true && today.sessions === 5, `daily today sessions=5 got ${today.sessions}`);
  assert(today.byChannel.naver === 2 && today.byChannel.internal == null, "daily byChannel excludes internal");
  const heat = report.weekHour.flat().reduce((s: number, n: number) => s + n, 0);
  assert(heat === t.pageViews, `weekHour sum ${heat} = pageViews ${t.pageViews}`);

  const r90 = (await (await adminRequest(env, "GET", "acquisition?days=90", { cookie })).json()).data;
  assert(r90.compareRange === null && r90.prevTotals === null, "90-day report skips compare (KV op budget)");
  const rBad = (await (await adminRequest(env, "GET", "acquisition?days=999", { cookie })).json()).data;
  assert(rBad.range.days === 30, "invalid days falls back to 30");

  await testClientAttribution();

  if (failed) {
    console.error(`test-admin-acquisition: ${failed} failed`);
    process.exit(1);
  }
  console.log("test-admin-acquisition PASS");
}

/** 브라우저 beacon: 첫 page_view만 진입, 진입 정보는 세션 내 모든 이벤트에 유지. */
async function testClientAttribution() {
  const storage = new Map<string, string>();
  const sent: Array<Record<string, unknown>> = [];
  const location = {
    pathname: "/부산상속등기",
    search: "?utm_source=QR&utm_medium=offline&utm_campaign=명함",
    hostname: "xn--2j1br1na42lvxja38mk8r.kr",
    protocol: "https:",
  };
  const g = globalThis as Record<string, unknown>;
  g.window = { location, matchMedia: () => ({ matches: true }) };
  g.document = { referrer: "https://m.search.naver.com/search.naver?query=x", cookie: "" };
  g.sessionStorage = {
    getItem: (k: string) => storage.get(k) ?? null,
    setItem: (k: string, v: string) => void storage.set(k, String(v)),
    removeItem: (k: string) => void storage.delete(k),
  };
  Object.defineProperty(globalThis, "navigator", {
    configurable: true,
    value: {
      sendBeacon: (_url: string, blob: Blob) => {
        void blob.text().then((text) => sent.push(JSON.parse(text)));
        return true;
      },
    },
  });

  const { trackEvent } = await import("../src/lib/admin-ops/beacon.ts");
  const flush = () => new Promise((r) => setTimeout(r, 20));

  await trackEvent({ type: "page_view", path: "/부산상속등기" });
  location.pathname = "/contact";
  location.search = "";
  (g.document as { referrer: string }).referrer = "https://m.search.naver.com/search.naver?query=x";
  await trackEvent({ type: "page_view", path: "/contact" });
  await trackEvent({ type: "phone_click", path: "/contact", meta: { kind: "phone" } });
  await flush();

  const [entryPv, nextPv, phone] = sent;
  assert(sent.length === 3, `client sent 3 events, got ${sent.length}`);
  assert(entryPv?.entryView === true && entryPv?.referrerType === "naver", "first page_view is entry, channel naver");
  const entry = entryPv?.entry as Entry | undefined;
  assert(entry?.host === "m.search.naver.com" && entry?.lp === "/부산상속등기", "entry host and landing");
  assert(entry?.us === "QR" && entry?.um === "offline" && entry?.uc === "명함", "utm captured on landing only");
  assert(nextPv?.entryView === false && nextPv?.referrerType === "internal", "second page_view is internal");
  assert((nextPv?.entry as Entry | undefined)?.lp === "/부산상속등기", "landing kept on later page_view");
  assert((phone?.entry as Entry | undefined)?.ch === "naver" && phone?.referrerType === "naver", "conversion carries entry channel");

  // 30분 무활동 → 새 sid → 새 진입
  storage.set("daom_sid_at", String(Date.now() - 31 * 60 * 1000));
  location.pathname = "/faq";
  await trackEvent({ type: "page_view", path: "/faq" });
  await flush();
  assert(sent[3]?.entryView === true, "idle > 30m starts a new entry");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
