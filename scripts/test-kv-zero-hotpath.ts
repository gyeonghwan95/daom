/**
 * KV zero-hotpath + chaos tests (mock KV, no live Cloudflare).
 * Usage: npx --yes tsx scripts/test-kv-zero-hotpath.ts
 */
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { onRequestPost as collectPost } from "../functions/api/analytics/collect.ts";
import { onRequestGet as noticesActive } from "../functions/api/notices/active.ts";
import { onRequestGet as noticesList } from "../functions/api/notices/list.ts";
import { invalidatePublicNoticeCache } from "../functions/_lib/admin-ops/edge-cache.ts";
import {
  HOME_H1,
  HOME_METADATA_TITLE,
} from "../src/lib/seo/metadata.ts";
import { trackPageView } from "../src/lib/admin-ops/track-client.ts";

const ROOT = process.cwd();
let failed = 0;

function assert(cond: unknown, msg: string) {
  if (!cond) {
    console.error(`FAIL: ${msg}`);
    failed += 1;
  }
}

class CountingKV {
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

class ThrowingKV {
  ops = { get: 0, put: 0, list: 0, delete: 0 };
  async get() {
    this.ops.get += 1;
    throw new Error("kv down");
  }
  async put() {
    this.ops.put += 1;
    throw new Error("kv down");
  }
  async list() {
    this.ops.list += 1;
    throw new Error("kv down");
  }
  async delete() {
    this.ops.delete += 1;
    throw new Error("kv down");
  }
}

function installMemoryCache() {
  const store = new Map<string, string>();
  (globalThis as { caches?: unknown }).caches = {
    default: {
      async match(req: Request | string) {
        const url = typeof req === "string" ? req : req.url;
        const body = store.get(url);
        if (body == null) return null;
        return new Response(body, {
          headers: { "Content-Type": "application/json" },
        });
      },
      async put(req: Request | string, res: Response) {
        const url = typeof req === "string" ? req : req.url;
        store.set(url, await res.text());
      },
      async delete(req: Request | string) {
        const url = typeof req === "string" ? req : req.url;
        return store.delete(url);
      },
    },
  };
}

function collectRequest(type: string, path = "/") {
  return new Request("https://example.test/api/analytics/collect", {
    method: "POST",
    headers: { "user-agent": "Mozilla/5.0 daom-test", "Content-Type": "application/json" },
    body: JSON.stringify({ type, path }),
  });
}

async function main() {
  installMemoryCache();

  assert(
    HOME_METADATA_TITLE === "부산 법무사 안윤정 | 다옴법무사사무소",
    "HOME title fingerprint",
  );
  assert(HOME_H1 === "부산 법무사 안윤정", "HOME H1 fingerprint");

  const robots = readFileSync(join(ROOT, "src/app/robots.ts"), "utf8");
  assert(!robots.includes("ADMIN_KV"), "robots.ts KV-free");
  assert(robots.includes("Yeti"), "Yeti allow rule kept");

  const headers = readFileSync(join(ROOT, "public/_headers"), "utf8");
  assert(
    headers.includes("Cache-Control: public, max-age=0, must-revalidate"),
    "HTML stays short-cache",
  );
  assert(
    !/\/image\/\*[\s\S]*max-age=86400/.test(headers) &&
      !headers.includes("/image/*"),
    "unfingerprinted /image must not get a long TTL (OG·본문 사진 파일명 고정)",
  );
  assert(!headers.includes("/video/*"), "unfingerprinted /video must not get a long TTL");
  assert(
    headers.includes("/_next/static/*") &&
      headers.includes("max-age=31536000, immutable"),
    "hashed JS/CSS keep immutable cache",
  );

  const appSrc = [
    "src/app/page.tsx",
    "src/app/layout.tsx",
    "src/lib/seo/metadata.ts",
    "src/lib/seo/json-ld.ts",
  ];
  for (const rel of appSrc) {
    const text = readFileSync(join(ROOT, rel), "utf8");
    assert(!text.includes("ADMIN_KV"), `${rel} must not read KV`);
  }

  const middleware = existsSync(join(ROOT, "src/middleware.ts"));
  assert(!middleware, "no Next middleware.ts (asset amplification)");

  trackPageView("/");
  const kvPv = new CountingKV();
  const pvRes = await collectPost({
    request: collectRequest("page_view", "/"),
    env: { ADMIN_KV: kvPv },
  });
  const pvJson = await pvRes.json();
  assert(pvRes.status === 200, "page_view status 200");
  assert(pvJson.skipped === true, "page_view skipped");
  assert(kvPv.ops.get === 0 && kvPv.ops.put === 0 && kvPv.ops.list === 0, "page_view KV ops 0");

  const impressionKv = new CountingKV();
  const impRes = await collectPost({
    request: collectRequest("notice_impression", "/"),
    env: { ADMIN_KV: impressionKv },
  });
  const impJson = await impRes.json();
  assert(impJson.skipped === true, "notice_impression skipped");
  assert(impressionKv.ops.get === 0 && impressionKv.ops.put === 0, "impression KV ops 0");

  const ctaKv = new CountingKV();
  const ctaRes = await collectPost({
    request: collectRequest("cta_click", "/contact"),
    env: { ADMIN_KV: ctaKv },
  });
  const ctaJson = await ctaRes.json();
  assert(ctaRes.status === 200, "cta status 200");
  assert(ctaJson.stored === true, "cta stored");
  assert(ctaKv.ops.list === 0, "cta no list");
  assert(ctaKv.ops.put >= 1, "cta writes event keys only");

  const throwKv = new ThrowingKV();
  const throwPage = await collectPost({
    request: collectRequest("page_view"),
    env: { ADMIN_KV: throwKv },
  });
  assert(throwPage.status === 200, "page_view KV-down still 200");

  const throwCta = await collectPost({
    request: collectRequest("cta_click", "/"),
    env: { ADMIN_KV: throwKv },
  });
  assert(throwCta.status === 200, "cta KV-down fail-open 200 stored:false");
  const throwCtaJson = await throwCta.json();
  assert(throwCtaJson.stored === false, "cta does not fake success on KV throw");

  const noticeKv = new CountingKV();
  noticeKv.data.set("notices:all", JSON.stringify([]));
  const active1 = await noticesActive({
    request: new Request("https://example.test/api/notices/active?path=/"),
    env: { ADMIN_KV: noticeKv },
  });
  assert(active1.status === 200, "notices/active 200");
  const firstReads = noticeKv.ops.get;
  assert(firstReads <= 1, `notices first GET <= 1, got ${firstReads}`);

  const active2 = await noticesActive({
    request: new Request("https://example.test/api/notices/active?path=/부산상속법무사"),
    env: { ADMIN_KV: noticeKv },
  });
  assert(active2.status === 200, "notices second path 200");
  assert(noticeKv.ops.get === firstReads, "second notices path uses cache, no extra GET");

  const listRes = await noticesList({
    request: new Request("https://example.test/api/notices/list"),
    env: { ADMIN_KV: noticeKv },
  });
  assert(listRes.status === 200, "notices/list 200");
  assert(noticeKv.ops.get === firstReads, "list uses same blob cache");

  await invalidatePublicNoticeCache();
  const chaosNotices = await noticesActive({
    request: new Request("https://example.test/api/notices/active?path=/"),
    env: { ADMIN_KV: new ThrowingKV() },
  });
  assert(chaosNotices.status === 200, "notices KV-down 200");
  const chaosJson = await chaosNotices.json();
  assert(Array.isArray(chaosJson.notices), "notices fail-open empty list");

  const noKvActive = await noticesActive({
    request: new Request("https://example.test/api/notices/active?path=/"),
    env: {},
  });
  assert(noKvActive.status === 200, "notices unbound KV 200");

  if (existsSync(join(ROOT, "out/index.html"))) {
    const html = readFileSync(join(ROOT, "out/index.html"), "utf8");
    assert(html.includes(HOME_H1) || html.includes("부산 법무사"), "static HOME html has H1");
    assert(html.includes("<title>") || html.includes("부산 법무사"), "static HOME has title");
  }

  if (failed) {
    console.error(`test-kv-zero-hotpath: ${failed} failed`);
    process.exit(1);
  }
  console.log("test-kv-zero-hotpath PASS");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
