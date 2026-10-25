/**
 * 브라우저 번들용 빈 모듈 — next.config.ts webpack alias가 클라이언트 빌드에서만
 * page-og-thumbnails.ts(1,500여 페이지의 경로·alt 맵) 대신 이 파일을 쓴다.
 * og:image·구조화데이터·대표 이미지는 모두 서버(정적 HTML 생성)에서 정해지므로 브라우저에는 맵이 필요 없다.
 */
export function getPageOgThumbnail(path: string): { src: string; alt: string } | undefined {
  void path;
  return undefined;
}
