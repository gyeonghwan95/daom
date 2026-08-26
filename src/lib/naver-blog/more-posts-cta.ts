/** 업무사례·상황별 하위 글 히어로에 붙는 네이버 블로그 더보기 버튼 문구 */
export const NAVER_BLOG_MORE_POSTS_LABEL = "블로그에서 더 많은 글 보기";

/**
 * 업무사례(`/업무사례/*`, `/services/cases/*`)와
 * 상황별 법률문제 상세(`/situations/*`, 분류 허브 제외)에서만 표시.
 */
export function shouldShowNaverBlogMoreCta(path: string): boolean {
  if (path.startsWith("/업무사례/")) return true;
  if (path.startsWith("/services/cases/")) return true;
  if (path.startsWith("/situations/분류/")) return false;
  if (path.startsWith("/situations/")) return true;
  return false;
}
