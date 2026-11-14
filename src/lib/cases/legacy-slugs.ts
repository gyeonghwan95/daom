/**
 * 예전 /cases/<slug> 주소가 실제로 쓰였던 사례(정적 이동 페이지를 유지한다).
 * 그 뒤에 추가한 사례는 옛 주소가 존재한 적이 없고, /cases/* 는 public/_redirects 의 301이 받는다.
 * 사례마다 이동 페이지 파일이 10개씩 늘어 Cloudflare Pages 파일 한도(20,000)를 넘겼다(2026-11-15).
 */
export const LEGACY_CASE_SLUGS: ReadonlySet<string> = new Set([
  "busan-personal-rehabilitation-consultation",
  "centum-ownership-transfer-case",
  "dongnae-qualified-acceptance-consultation",
  "gijang-land-inheritance-case",
  "haeundae-inheritance-registration-case",
  "jaesong-inheritance-renunciation-consultation",
  "suyeong-company-establishment-case",
  "yeonje-director-change-case",
]);
