import { readGeneratedTable } from "@/lib/seo/server-json";

/**
 * 서버 렌더링 전용(빌드 시 HTML·구조화 데이터 생성)이다. 클라이언트 컴포넌트에서 import하지 않는다 — 목록 JSON이 브라우저 JS에 실린다.
 * 검색엔진에 알리는 이미지 주소 뒤에 내용 해시(?v=)를 붙인다.
 * 같은 파일 이름에 새 이미지를 덮어써도 주소가 바뀌어, 네이버가 예전 썸네일을 계속 쓰지 않고 새 이미지를 받는다.
 * 목록은 빌드 전에 scripts/generate-asset-versions.mjs가 만든다. 목록에 없는 경로·외부 주소는 그대로 둔다.
 */
export function withAssetVersion(absoluteOrPath: string, sitePrefix = ""): string {
  if (/[?&]v=/.test(absoluteOrPath)) return absoluteOrPath;
  const local = sitePrefix && absoluteOrPath.startsWith(sitePrefix) ? absoluteOrPath.slice(sitePrefix.length) : absoluteOrPath;
  if (!local.startsWith("/")) return absoluteOrPath;
  const pathOnly = local.split(/[?#]/)[0];
  let decoded = pathOnly;
  try {
    decoded = decodeURIComponent(pathOnly);
  } catch {
    decoded = pathOnly;
  }
  const hash = readGeneratedTable("asset-versions.json")[decoded.normalize("NFC")];
  if (!hash) return absoluteOrPath;
  return `${absoluteOrPath}${absoluteOrPath.includes("?") ? "&" : "?"}v=${hash}`;
}
