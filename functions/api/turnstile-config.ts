/**
 * Turnstile 공개 사이트 키를 실행 시점에 내려준다(공개 값 — 비밀 키가 아니다).
 * NEXT_PUBLIC_TURNSTILE_SITE_KEY가 Cloudflare 빌드 환경에 없으면 정적 번들에 키가 빠져
 * 보안 확인 위젯이 뜨지 않고 모든 문의가 실패한다(2026-10-12 확인). 그때 클라이언트가 이 값을 쓴다.
 */
type Env = {
  NEXT_PUBLIC_TURNSTILE_SITE_KEY?: string;
  TURNSTILE_SITE_KEY?: string;
};

export async function onRequestGet(context: { env: Env }): Promise<Response> {
  const siteKey = (context.env.TURNSTILE_SITE_KEY || context.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "").trim();
  return new Response(JSON.stringify({ siteKey }), {
    status: 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=300",
    },
  });
}
