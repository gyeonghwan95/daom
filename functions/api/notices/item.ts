import { json } from "../../_lib/admin-ops/crypto";
import {
  PUBLIC_NOTICE_TTL_S,
  publicNoticeCacheHeaders,
  readNoticesBlobFromCache,
  writeNoticesBlobToCache,
} from "../../_lib/admin-ops/edge-cache";
import { findPublicNoticeById, hasKv, listNoticesSafe } from "../../_lib/admin-ops/store";

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
  const { request, env } = context;
  const id = new URL(request.url).searchParams.get("id") || "";
  if (!id) {
    return json({ ok: false, code: "bad_request", message: "id 필요" }, 400);
  }
  try {
    const raw = await loadNotices(env, context);
    const notice = findPublicNoticeById(raw, id);
    if (!notice) {
      return json({ ok: false, code: "not_found" }, 404);
    }
    return json({ ok: true, notice }, 200, publicNoticeCacheHeaders());
  } catch {
    return json(
      { ok: false, code: "not_found" },
      404,
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
