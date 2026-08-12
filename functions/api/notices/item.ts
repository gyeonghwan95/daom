import { json } from "../../_lib/admin-ops/crypto";
import { getPublicNoticeById, hasKv } from "../../_lib/admin-ops/store";

export async function onRequestGet(context) {
  const { request, env } = context;
  const id = new URL(request.url).searchParams.get("id") || "";
  if (!id) {
    return json({ ok: false, code: "bad_request", message: "id 필요" }, 400);
  }
  if (!hasKv(env)) {
    return json({ ok: false, code: "not_found" }, 404);
  }
  const notice = await getPublicNoticeById(env, id);
  if (!notice) {
    return json({ ok: false, code: "not_found" }, 404);
  }
  return json(
    { ok: true, notice },
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
