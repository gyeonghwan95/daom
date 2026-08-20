import { normalizeRouteSlug } from "@/lib/seo/slug";

/** 「부산 법무사」 exact-match 메타·키워드는 홈(`/`)만 가져간다. */
export const BUSAN_LAWYER_CHAMPION_PATH = "/" as const;

/** 업무·비용·선택 기준 안내. 홈과 검색의도를 나누는 supporting 페이지. */
export const BUSAN_LAWYER_GUIDE_PATH = "/부산법무사" as const;

/** 「부산 법무사 추천」 exact-match는 `/부산법무사추천`만. */
export const BUSAN_RECOMMEND_CHAMPION_PATH = "/부산법무사추천" as const;

/** 「부산 법무사 상담」 exact-match 메타 키워드는 `/부산법무사상담`만 가져간다. */
export const BUSAN_CONSULT_CHAMPION_PATH = "/부산법무사상담" as const;

/** 「부산 상속포기 법무사」 exact-match는 `/부산상속포기` 한 곳만 가져간다. */
export const BUSAN_RENUNCIATION_CHAMPION_PATH = "/부산상속포기" as const;

export const BUSAN_LAWYER_EXACT_QUERIES = ["부산 법무사", "부산법무사"] as const;

export const BUSAN_RENUNCIATION_EXACT_QUERIES = [
  "부산 상속포기 법무사",
  "부산상속포기법무사",
] as const;

type ExactKeywordChampion = {
  path: string;
  compactQueries: readonly string[];
};

const EXACT_KEYWORD_CHAMPIONS: readonly ExactKeywordChampion[] = [
  {
    path: BUSAN_LAWYER_CHAMPION_PATH,
    compactQueries: ["부산법무사"],
  },
  {
    path: BUSAN_RECOMMEND_CHAMPION_PATH,
    compactQueries: ["부산법무사추천"],
  },
  {
    path: BUSAN_CONSULT_CHAMPION_PATH,
    compactQueries: ["부산법무사상담"],
  },
  {
    path: BUSAN_RENUNCIATION_CHAMPION_PATH,
    compactQueries: ["부산상속포기법무사"],
  },
];

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
  "/부산상속포기",
  "/부산한정승인",
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

function compactQuery(value: string): string {
  return value.replace(/\s+/g, "");
}

export function isBusanLawyerExactQuery(value: string): boolean {
  return compactQuery(value) === "부산법무사";
}

export function isBusanRenunciationExactQuery(value: string): boolean {
  return compactQuery(value) === "부산상속포기법무사";
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
  const normalized = normalizeSeoPath(path);
  const filtered = keywords.filter((item) => {
    const compact = compactQuery(item);
    const rule = EXACT_KEYWORD_CHAMPIONS.find((row) =>
      row.compactQueries.includes(compact),
    );
    if (!rule) return true;
    return normalized === rule.path;
  });
  return filtered.length > 0 ? filtered : undefined;
}
