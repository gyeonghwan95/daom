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

/**
 * 화면의 "최종 수정"·구조화 데이터 dateModified에 쓸 날짜.
 * 페이지 데이터에 적어 둔 검토일(stated)과 사이트맵 lastmod 기록(본문이 실제로 바뀐 날) 중 더 늦은 날을 쓴다.
 * 예전에는 페이지 데이터의 날짜가 먼저 쓰여, 본문을 고친 뒤에도 dateModified가 몇 주 전 날짜로 남았고
 * 네이버 검색결과에도 그 옛 날짜가 표시됐다(2026-11-13 확인: /부산상속법무사 09-25, /부산한정승인 10-14).
 */
export function getEffectiveModified(path: string, stated?: string): string | undefined {
  const recorded = getRecordedLastModified(path);
  const valid = (v?: string) => (v && /^\d{4}-\d{2}-\d{2}/.test(v) ? v.slice(0, 10) : undefined);
  const a = valid(stated);
  const b = valid(recorded);
  if (a && b) return a > b ? a : b;
  return a ?? b;
}
