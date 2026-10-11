import { defaultContact, getNaverBlogUrl } from "@/lib/contact";
import { getNaverPlaceUrl } from "@/lib/office-location";
import { siteConfig } from "@/lib/site";

/** JSON-LD sameAs, AI·검색엔진 신뢰 신호 */
export function getSocialProfileUrls(): string[] {
  const kakao =
    process.env.NEXT_PUBLIC_KAKAO_CHANNEL?.trim() || defaultContact.kakao;
  const naverTalk =
    process.env.NEXT_PUBLIC_NAVER_TALK?.trim() ||
    process.env.NEXT_PUBLIC_NAVER_BOOKING?.trim() ||
    defaultContact.naverTalk;

  return [
    getNaverPlaceUrl(),
    kakao,
    naverTalk,
    getNaverBlogUrl(),
    // sameAs는 같은 주체의 외부 프로필만 둔다. 자기 사이트 경로(/contact·/location)는 넣지 않는다.
  ].filter(Boolean);
}

export function getAbsoluteAssetUrl(path: string): string {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  const normalized = path.startsWith("/") ? path : `/${path}`;
  const segments = normalized.split("/").filter(Boolean);
  // siteImages 경로는 이미 퍼센트 인코딩돼 있다. 그대로 다시 인코딩하면 %25EC…가 되어 운영에서 404가 난다(2026-10-11).
  // 조각마다 한 번 디코드한 뒤 인코딩해, 원문·인코딩된 경로 모두 같은 URL이 되게 한다.
  const encoded = segments
    .map((segment) => {
      let raw = segment;
      try {
        raw = decodeURIComponent(segment);
      } catch {
        raw = segment;
      }
      return encodeURIComponent(raw.normalize("NFC"));
    })
    .join("/");
  return encoded ? `${siteConfig.url}/${encoded}` : siteConfig.url;
}
