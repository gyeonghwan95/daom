import { getNaverBlogUrl } from "@/lib/contact";
import { getBusinessProfileUrls } from "@/lib/seo/business-profiles";
import { siteConfig } from "@/lib/site";
import { withAssetVersion } from "@/lib/seo/asset-version";
import { DEFAULT_NAVER_PLACE_ID } from "@/lib/naver-place-reviews/types";

/**
 * 네이버 플레이스 정식 주소(ID 포함). 단축 주소(naver.me)는 검색엔진이 리디렉션을 따라 해석하지 않는 경우가 있어
 * 네이버 AI 브리핑·각종 AI가 "사이트 = 이 플레이스 업체"로 묶을 수 있게 ID가 보이는 주소를 함께 둔다(2026-11-24).
 */
function getNaverPlaceCanonicalUrls(): string[] {
  const id = process.env.NEXT_PUBLIC_NAVER_PLACE_ID?.trim() || DEFAULT_NAVER_PLACE_ID;
  return [`https://map.naver.com/p/entry/place/${id}`, `https://m.place.naver.com/place/${id}/home`];
}

/**
 * JSON-LD sameAs — 같은 사무소의 공식 프로필만 둔다(2026-11-28).
 * 카카오 채널 채팅·네이버 톡톡(대화 창)과 naver.me 단축 주소는 프로필이 아니라서 뺐다.
 * 지도 3사(Google·카카오·Bing) 프로필은 business-profiles.ts에서 값이 있을 때만 들어간다.
 */
export function getSocialProfileUrls(): string[] {
  return [
    ...getNaverPlaceCanonicalUrls(),
    ...getBusinessProfileUrls(),
    getNaverBlogUrl(),
    // 자기 사이트 경로(/contact·/location)는 넣지 않는다.
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
  // 이미지는 내용 해시를 붙여, 같은 이름에 덮어쓴 새 이미지를 검색엔진이 다시 받게 한다(asset-version.ts)
  return encoded ? withAssetVersion(`${siteConfig.url}/${encoded}`, siteConfig.url) : siteConfig.url;
}
