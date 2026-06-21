import { defaultContact, getNaverBlogUrl } from "@/lib/contact";
import { getNaverMapSearchUrl } from "@/lib/office-location";
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
    kakao,
    naverTalk,
    getNaverBlogUrl(),
    getNaverMapSearchUrl(),
    `${siteConfig.url}/contact`,
    `${siteConfig.url}/location`,
  ].filter(Boolean);
}

export function getAbsoluteAssetUrl(path: string): string {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${siteConfig.url}${normalized}`;
}
