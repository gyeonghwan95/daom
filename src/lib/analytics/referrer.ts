/** Friendly referrer labels for admin analytics (no query guessing). */

const SOURCE_LABELS: Record<string, string> = {
  direct: "직접 방문",
  google: "Google",
  naver: "Naver",
  daum: "Daum",
  bing: "Bing",
  sns: "SNS",
  external: "외부",
  internal: "내부",
  campaign: "캠페인",
};

export function getSourceLabel(source: string | undefined): string {
  if (!source) return SOURCE_LABELS.direct;
  return SOURCE_LABELS[source] ?? source;
}

export function getReferrerHostLabel(host: string | undefined): string {
  if (!host) return "직접 방문";
  const h = host.toLowerCase();
  if (h.includes("search.naver.com")) return "네이버 검색";
  if (h.includes("naver.com")) return "Naver";
  if (h.includes("google.")) return "Google";
  if (h.includes("daum.") || h.includes("kakao.")) return "Daum";
  if (h.includes("bing.")) return "Bing";
  if (h.includes("instagram.") || h.includes("facebook.")) return "SNS";
  return host;
}
