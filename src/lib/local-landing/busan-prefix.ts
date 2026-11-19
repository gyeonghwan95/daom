/**
 * "부산 ○○동 법무사"로 검색할 때 담당 동 페이지가 잡히도록 H1 앞에 "부산"을 붙이는 동 페이지 목록.
 * 템플릿(makeTopic)이 H1을 만드는 페이지만 여기서 처리하고, 제목(metaTitle)은 각 원본에 직접 적었다.
 *
 * 2026-11-19 측정("부산 ○○ 법무사" 62개): 이 동들은 구 허브가 대신 잡히거나(의도 불일치)
 * 웹 결과 1위가 아니었다. 이미 1위인 동(개금동·다대동·동삼동)과 사례 페이지가 잡히는 동은 넣지 않는다.
 */
export const BUSAN_PREFIX_TEMPLATE_SLUGS = new Set<string>([
  "거제동법무사",
  "좌동법무사",
  "남포동법무사",
  "사직동법무사",
  "전포동법무사",
  "문현동법무사",
  "화명동법무사",
  "망미동법무사",
  "구포동법무사",
  "구서동법무사",
  "기장읍법무사",
  "초량동법무사",
  "범일동법무사",
]);

export function withBusanPrefix(slug: string, text: string): string {
  if (!BUSAN_PREFIX_TEMPLATE_SLUGS.has(slug) || text.startsWith("부산")) return text;
  return `부산 ${text}`;
}
