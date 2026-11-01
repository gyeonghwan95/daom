import lastmodManifest from "../../../scripts/lib/sitemap/lastmod-manifest.json";

const routes = (lastmodManifest as { routes: Record<string, string> }).routes;

/**
 * 사이트맵 lastmod 기록(내용이 실제로 바뀐 날)을 경로로 조회한다.
 * 화면의 "최종 수정"과 구조화 데이터의 dateModified가 같은 값을 쓰게 하는 단일 출처이며,
 * 기록이 없으면 undefined라 날짜를 지어내지 않는다.
 */
export function getRecordedLastModified(path: string): string | undefined {
  const value = routes[path.normalize("NFC")] ?? routes[path.normalize("NFD")];
  return /^\d{4}-\d{2}-\d{2}$/.test(value ?? "") ? value : undefined;
}
