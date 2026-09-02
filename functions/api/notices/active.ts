import { json, normalizePath } from "../../_lib/admin-ops/crypto";
import {
  PUBLIC_NOTICE_TTL_S,
  publicNoticeCacheHeaders,
  readNoticesBlobFromCache,
  writeNoticesBlobToCache,
} from "../../_lib/admin-ops/edge-cache";
import {
  filterActivePublicNotices,
  hasKv,
  listNoticesSafe,
} from "../../_lib/admin-ops/store";

async function loadNotices(env, context) {
  const cached = await readNoticesBlobFromCache();
  if (cached) return { notices: cached, kvReads: 0 };
  if (!hasKv(env)) {
    await writeNoticesBlobToCache(context, []);
    return { notices: [], kvReads: 0 };
  }
  const notices = await listNoticesSafe(env);
  await writeNoticesBlobToCache(context, notices);
  return { notices, kvReads: 1 };
}

export async function onRequestGet(context) {
  const { request, env } = context;
  const path = normalizePath(
    new URL(request.url).searchParams.get("path") || "/",
  );

  try {
    const { notices } = await loadNotices(env, context);
    const active = filterActivePublicNotices(notices, path);
    return json({ ok: true, notices: active }, 200, publicNoticeCacheHeaders());
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
