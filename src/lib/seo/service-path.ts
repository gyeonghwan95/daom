/**
 * 업무 상세(/services/<slug>) 링크 주소.
 *
 * 일부 업무 상세는 지역 대표 페이지로 통합돼 noindex·canonical 처리됐다(seo/index-policy.json canonicalOverrides).
 * 통합된 주소로 계속 내부 링크를 걸면 링크 신호가 색인 제외 페이지로 새고, 방문자는 한 번 더 이동해야 한다.
 * 링크만 대표 페이지로 보내고, 원래 URL은 그대로 살아 있다(삭제·변경 없음).
 * index-policy.json 의 /services/* canonicalOverrides 와 같아야 한다(tests/seo-recovery.spec.ts 에서 확인).
 */
export const MERGED_SERVICE_PATHS: Readonly<Record<string, string>> = {
  // 2026-10-22 /부산상속포기로 통합
  "inheritance-renunciation": "/부산상속포기",
};

export function serviceLinkPath(slug: string): string {
  return MERGED_SERVICE_PATHS[slug] ?? `/services/${slug}`;
}

/** 이미 완성된 내부 주소가 통합된 업무 상세를 가리키면 대표 페이지 주소로 바꾼다(카드·캐러셀용). */
export function mergedServiceHref(href: string): string {
  const m = /^\/services\/([a-z0-9-]+)(?=$|[?#])/.exec(href);
  if (!m || !MERGED_SERVICE_PATHS[m[1]]) return href;
  return MERGED_SERVICE_PATHS[m[1]] + href.slice(m[0].length);
}
