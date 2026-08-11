import { json, normalizePath } from "../../_lib/admin-ops/crypto";
import { getActivePublicNotices, hasKv } from "../../_lib/admin-ops/store";

export async function onRequestGet(context) {
  const { request, env } = context;
  const path = normalizePath(
    new URL(request.url).searchParams.get("path") || "/",
  );

  if (!hasKv(env)) {
    return json(
      { ok: true, notices: [] },
      200,
      { "Cache-Control": "public, max-age=30" },
    );
  }

  const notices = await getActivePublicNotices(env, path);
  return json(
    { ok: true, notices },
    200,
    { "Cache-Control": "public, max-age=30" },
  );
}

export async function onRequest(context) {
  if (context.request.method !== "GET") {
    return json({ ok: false, code: "method_not_allowed" }, 405);
  }
  return onRequestGet(context);
}
