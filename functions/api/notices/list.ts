import { json } from "../../_lib/admin-ops/crypto";
import {
  PUBLIC_NOTICE_TTL_S,
  publicNoticeCacheHeaders,
  readNoticesBlobFromCache,
  writeNoticesBlobToCache,
} from "../../_lib/admin-ops/edge-cache";
import { hasKv, listNoticesSafe, mapPublicNoticeList } from "../../_lib/admin-ops/store";

async function loadNotices(env, context) {
  const cached = await readNoticesBlobFromCache();
  if (cached) return cached;
  if (!hasKv(env)) {
    await writeNoticesBlobToCache(context, []);
    return [];
  }
  const notices = await listNoticesSafe(env);
  await writeNoticesBlobToCache(context, notices);
  return notices;
}

export async function onRequestGet(context) {
  const { env } = context;
  try {
    const raw = await loadNotices(env, context);
    return json(
      { ok: true, notices: mapPublicNoticeList(raw) },
      200,
      publicNoticeCacheHeaders(),
    );
  } catch {
    return json(
      { ok: true, notices: [] },
      200,
      { "Cache-Control": `public, max-age=${PUBLIC_NOTICE_TTL_S}` },
    );
  }
}

export async function onRequest(context) {
  if (context.request.method !== "GET") {
    return json({ ok: false, code: "method_not_allowed" }, 405);
  }
  return onRequestGet(context);
}
