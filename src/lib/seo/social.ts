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
  const encoded = segments.map((segment) => encodeURIComponent(segment)).join("/");
  return encoded ? `${siteConfig.url}/${encoded}` : siteConfig.url;
}
