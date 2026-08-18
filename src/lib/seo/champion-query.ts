import { normalizeRouteSlug } from "@/lib/seo/slug";

/** 「부산 법무사」 exact-match는 `/부산법무사` 한 곳만 메타·키워드로 가져간다. */
export const BUSAN_LAWYER_CHAMPION_PATH = "/부산법무사" as const;

export const BUSAN_LAWYER_EXACT_QUERIES = ["부산 법무사", "부산법무사"] as const;

/** 유입 레일·significantLink를 둘 허브만. 동·사례 전 페이지에 동일 블록을 두지 않는다. */
export const INFLOW_RAIL_ALLOWLIST = new Set<string>([
  "/부산법무사",
  "/부산등기법무사",
  "/부산법무사추천",
  "/부산법무사비교",
  "/부산법무사상담",
  "/부산법무사비용",
  "/부산법무사무소",
  "/해운대법무사",
  "/센텀법무사",
  "/재송동법무사",
  "/부산상속법무사",
  "/부산상속등기",
  "/부산부동산등기",
  "/부산법인법무사",
  "/부산법인등기",
  "/부산개인회생",
  "/about",
  "/office",
  "/services",
  "/contact",
  "/location",
]);

export function normalizeSeoPath(raw: string): string {
  const decoded = normalizeRouteSlug(raw.split("?")[0] ?? raw);
  if (!decoded || decoded === "/") return "/";
  return decoded.startsWith("/") ? decoded : `/${decoded}`;
}

export function isBusanLawyerExactQuery(value: string): boolean {
  const compact = value.replace(/\s+/g, "");
  return compact === "부산법무사";
}

export function allowsBusanLawyerExactKeywords(path: string): boolean {
  return normalizeSeoPath(path) === BUSAN_LAWYER_CHAMPION_PATH;
}

export function isInflowRailPath(path: string): boolean {
  return INFLOW_RAIL_ALLOWLIST.has(normalizeSeoPath(path));
}

export function sanitizePageKeywords(
  path: string,
  keywords: readonly string[] | undefined,
): string[] | undefined {
  if (!keywords || keywords.length === 0) return undefined;
  if (allowsBusanLawyerExactKeywords(path)) {
    return [...keywords];
  }
  const filtered = keywords.filter((item) => !isBusanLawyerExactQuery(item));
  return filtered.length > 0 ? filtered : undefined;
}
