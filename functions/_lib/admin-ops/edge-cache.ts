/**
 * Public notice responses: Cloudflare Cache API in front of KV.
 * Per-colo cache — not a global store. TTL is minutes, not hours.
 * Does not cache admin / cookie / PII responses.
 */

export const PUBLIC_NOTICE_TTL_S = 300;

const CACHE_ORIGIN = "https://daom-public-kv-cache.invalid";

function cacheRequest(pathname) {
  return new Request(`${CACHE_ORIGIN}${pathname}`, { method: "GET" });
}

export function publicNoticeCacheHeaders() {
  return {
    "Cache-Control": `public, max-age=${PUBLIC_NOTICE_TTL_S}, s-maxage=${PUBLIC_NOTICE_TTL_S}`,
  };
}

export function noticesBlobCacheKey() {
  return cacheRequest("/notices/blob");
}

export async function matchPublicCache(keyRequest) {
  try {
    if (typeof caches === "undefined") return null;
    return await caches.default.match(keyRequest);
  } catch {
    return null;
  }
}

export async function putPublicCache(context, keyRequest, response) {
  try {
    if (typeof caches === "undefined") return;
    const copy = response.clone();
    const task = caches.default.put(keyRequest, copy);
    if (context?.waitUntil) context.waitUntil(task);
    else await task;
  } catch {
    /* cache is optional */
  }
}

export async function invalidatePublicNoticeCache() {
  try {
    if (typeof caches === "undefined") return;
    await caches.default.delete(noticesBlobCacheKey());
  } catch {
    /* ignore */
  }
}

export async function readNoticesBlobFromCache() {
  const hit = await matchPublicCache(noticesBlobCacheKey());
  if (!hit) return null;
  try {
    const data = await hit.json();
    return Array.isArray(data) ? data : null;
  } catch {
    return null;
  }
}

export async function writeNoticesBlobToCache(context, notices) {
  const body = JSON.stringify(Array.isArray(notices) ? notices : []);
  const response = new Response(body, {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": `public, max-age=${PUBLIC_NOTICE_TTL_S}`,
    },
  });
  await putPublicCache(context, noticesBlobCacheKey(), response);
}
