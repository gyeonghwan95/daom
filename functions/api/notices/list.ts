import { json } from "../../_lib/admin-ops/crypto";
import { hasKv, listPublicNotices } from "../../_lib/admin-ops/store";

export async function onRequestGet(context) {
  const { env } = context;
  if (!hasKv(env)) {
    return json(
      { ok: true, notices: [] },
      200,
      { "Cache-Control": "public, max-age=60" },
    );
  }
  const notices = await listPublicNotices(env);
  return json(
    { ok: true, notices },
    200,
    { "Cache-Control": "public, max-age=60" },
  );
}

export async function onRequest(context) {
  if (context.request.method !== "GET") {
    return json({ ok: false, code: "method_not_allowed" }, 405);
  }
  return onRequestGet(context);
}
