/** IndexNow API 키 (public/{key}.txt 와 동일) */
export const INDEXNOW_KEY = "dc56e361ff344411bd1493b60a7d1ef7";

/** 공유 엔드포인트 — Bing·Naver·Yandex 등으로 전파 */
export const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";

/** 검색엔진별 엔드포인트 (선택 제출용) */
export const INDEXNOW_ENDPOINTS = {
  global: INDEXNOW_ENDPOINT,
  bing: "https://www.bing.com/indexnow",
  naver: "https://searchadvisor.naver.com/indexnow",
  yandex: "https://yandex.com/indexnow",
};

export function getIndexNowKeyLocation(siteUrl) {
  const base = siteUrl.replace(/\/$/, "");
  return `${base}/${INDEXNOW_KEY}.txt`;
}

/** https://도메인 → 호스트명 (한글 도메인 유지, punycode 변환 안 함) */
export function getIndexNowHost(siteUrl) {
  return siteUrl.replace(/^https?:\/\//i, "").replace(/\/$/, "").split("/")[0];
}

/** sitemap과 동일하게 path → 절대 URL (한글 세그먼트 percent-encode) */
export function pathToIndexNowUrl(siteUrl, routePath) {
  const base = siteUrl.replace(/\/$/, "");
  if (routePath === "/") return base;
  const segments = routePath.split("/").filter(Boolean);
  const encoded = segments.map((s) => encodeURIComponent(s)).join("/");
  return `${base}/${encoded}`;
}
