/**
 * 지도·업체 등록 서비스의 공식 업체 프로필 주소.
 * JSON-LD sameAs와 llms.txt에 들어가, ChatGPT·Copilot(Bing Places)·Gemini(Google 비즈니스 프로필)·카카오맵이
 * "이 사이트 = 그 지도에 등록된 같은 사무소"로 묶게 한다(2026-11-28).
 *
 * - 채팅 링크(카카오 채널 채팅, 네이버 톡톡)와 단축 주소는 넣지 않는다. 같은 주체의 '프로필 페이지'가 아니기 때문이다.
 * - 값이 비어 있으면 출력하지 않는다. 환경변수로 덮어쓸 수 있다.
 * - 주소 예시
 *   · Google: https://www.google.com/maps?cid=1234567890 또는 https://maps.app.goo.gl/xxxx(공유 링크)
 *   · 카카오맵: https://place.map.kakao.com/12345678
 *   · Bing Places: https://www.bing.com/maps?ss=ypid.YN... (등록 승인 후 업체 페이지 주소)
 */
export const BUSINESS_PROFILE_URLS = {
  // 공유 링크 https://maps.app.goo.gl/GaAZwgJFPMPQBvr3A 의 지도 ID(0x3eb16148b47afd66)를 10진 cid로 바꾼 정식 주소(2026-11-28)
  googleBusinessProfile:
    process.env.NEXT_PUBLIC_GOOGLE_BUSINESS_PROFILE_URL?.trim() || "https://maps.google.com/?cid=4517498866122816870",
  // 같은 링크가 가리키는 Google 지식그래프 엔티티(/g/11xtr2pb3g) — AI·검색이 사무소를 하나의 엔티티로 묶는 기준
  googleKnowledgeGraph: "https://www.google.com/search?kgmid=/g/11xtr2pb3g",
  kakaoMapPlace: process.env.NEXT_PUBLIC_KAKAO_MAP_PLACE_URL?.trim() || "https://place.map.kakao.com/953940316",
  // Bing Places는 게시 승인 대기 중(2026-11-28). 승인 후 bing.com/maps 업체 공유 링크를 넣는다.
  bingPlaces: process.env.NEXT_PUBLIC_BING_PLACES_URL?.trim() || "",
} as const;

export const BUSINESS_PROFILE_LABELS: Record<keyof typeof BUSINESS_PROFILE_URLS, string> = {
  googleBusinessProfile: "Google 비즈니스 프로필(구글 지도)",
  googleKnowledgeGraph: "Google 업체 정보",
  kakaoMapPlace: "카카오맵",
  bingPlaces: "Bing 지도(Bing Places)",
};

export function getBusinessProfileUrls(): string[] {
  return Object.values(BUSINESS_PROFILE_URLS).filter((u) => /^https:\/\//.test(u));
}

export function getBusinessProfileEntries(): { label: string; url: string }[] {
  return (Object.keys(BUSINESS_PROFILE_URLS) as (keyof typeof BUSINESS_PROFILE_URLS)[])
    .map((k) => ({ label: BUSINESS_PROFILE_LABELS[k], url: BUSINESS_PROFILE_URLS[k] }))
    .filter((e) => /^https:\/\//.test(e.url));
}
