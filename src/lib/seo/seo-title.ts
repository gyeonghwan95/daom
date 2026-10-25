import { seoBrand } from "@/lib/seo/brand";

/**
 * 제목 문자열 유틸 — 의존성이 brand 뿐이라 클라이언트 번들에서도 가볍다.
 * (metadata.ts는 이미지 크기 표·페이지별 썸네일 맵을 함께 읽으므로 제목만 필요할 때는 이 파일을 쓴다)
 */
export function titleContainsBrand(text: string): boolean {
  return (
    text.includes(seoBrand.siteName) || text.includes(seoBrand.representative)
  );
}

/** 페이지 제목에 브랜드 접미사를 한 번만 붙입니다. */
export function buildSeoTitle(
  primary: string,
  options?: { withRepresentative?: boolean },
): string {
  const trimmed = primary.trim();
  if (titleContainsBrand(trimmed)) {
    return trimmed;
  }

  const suffix = options?.withRepresentative
    ? `${seoBrand.siteName} ${seoBrand.representative}`
    : seoBrand.siteName;

  return `${trimmed} | ${suffix}`;
}
