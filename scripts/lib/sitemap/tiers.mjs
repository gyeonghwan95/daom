/** Tier 1 — 즉시 (핵심 전환·허브) */
export const TIER1 = new Set([
  "/",
  "/contact",
  "/contact/inquiry",
  "/services",
  "/services/inheritance-registration",
  "/services/inheritance-renunciation",
  "/services/qualified-acceptance",
  "/services/real-estate-registration",
  "/services/corporate-registration",
  "/부산법무사",
  "/부산상속등기",
  "/해운대법무사",
  "/전국업무",
  "/전국상속등기",
  "/업무사례",
  "/업무사례/지역별",
  "/업무사례/업무별",
  "/업무사례/부산법무사",
]);

/** Tier 2 — 1주차 (지역·전국 허브) */
export const TIER2 = new Set([
  "/about",
  "/office",
  "/location",
  "/faq",
  "/reviews",
  "/search-guides",
  "/situations",
  "/tools",
  "/glossary",
  "/busan-legal-map",
  "/업무사례/울산법무사업무",
  "/업무사례/대구법무사업무",
  "/업무사례/경북법무사업무",
  "/업무사례/경남법무사업무",
  "/업무사례/전국업무사례",
  "/전국유증등기",
  "/여러지역상속부동산등기",
  "/전국법인본점이전등기",
  "/전국공동담보등기",
]);

export const TIER_FILES = {
  1: "tier-1-core.xml",
  2: "tier-2-hubs.xml",
  3: "tier-3-tools.xml",
  4: "tier-4-regions.xml",
  5: "tier-5-local.xml",
  6: "tier-6-keywords.xml",
  7: "tier-7-blog.xml",
  8: "tier-8-media.xml",
};

/** 기존·예약 광역 metro slug (/업무사례/*) */
export const METRO_CASE_SLUGS = new Set([
  "서울상속등기법무사",
  "경기상속등기법무사",
  "인천상속등기법무사",
  "경남상속등기법무사",
  "울산상속등기법무사",
  "대구상속등기법무사",
  "대전상속등기법무사",
  "세종상속등기법무사",
  "충남상속등기법무사",
  "충북상속등기법무사",
  "광주상속등기법무사",
  "전남상속등기법무사",
  "전북상속등기법무사",
  "경북상속등기법무사",
  "강원상속등기법무사",
  "제주상속등기법무사",
  "울산남구상속등기법무사",
  "울주군상속등기법무사",
  "대구수성구상속등기법무사",
  "대구달서구상속등기법무사",
  "포항상속등기법무사",
  "구미상속등기법무사",
  "경산상속등기법무사",
  "경주상속등기법무사",
  "창원상속등기법무사",
  "김해상속등기법무사",
  "양산상속등기법무사",
]);

const TIER3_CASE_PATTERNS = [
  /상속등기비용$/,
  /상속등기필요서류$/,
  /아파트상속등기$/,
  /토지상속등기$/,
  /농지상속등기$/,
  /임야상속등기$/,
  /유증등기법무사$/,
  /오래된상속등기$/,
  /조부모명의/,
  /법인등기법무사$/,
  /여러필지/,
];

/** 색인 우선순위 Tier (1~8) — index-priority-urls.txt 와 동일 규칙 */
export function tierOf(routePath) {
  if (TIER1.has(routePath)) return 1;
  if (TIER2.has(routePath)) return 2;

  if (routePath.includes("자가진단") || routePath === "/자가진단") return 3;
  if (routePath.startsWith("/situations/분류/")) return 2;
  if (routePath.startsWith("/situations/")) return 3;
  if (routePath.startsWith("/tools/")) return 3;
  if (routePath.startsWith("/glossary/")) return 3;
  if (routePath.startsWith("/faq/")) return 3;
  if (routePath.startsWith("/services/")) return 3;

  if (routePath.startsWith("/업무사례/")) {
    const slug = routePath.slice("/업무사례/".length);

    if (METRO_CASE_SLUGS.has(slug)) return 3;
    if (TIER3_CASE_PATTERNS.some((re) => re.test(slug))) return 3;
    if (slug.startsWith("전국")) return 4;

    if (/^(울산|대구|경북|경남|부산|창원|김해|양산)/.test(slug)) {
      if (/[구군시]상속등기법무사$/.test(slug)) return 4;
      if (/상속등기법무사$/.test(slug) && !/동/.test(slug)) return 4;
    }

    if (slug.startsWith("부산") && slug.endsWith("법무사")) return 4;

    if (
      /동상속등기$/.test(slug) ||
      /^울주/.test(slug) ||
      /에서부산|부산에서|공동근저당|공동담보/.test(slug) ||
      /^(장유|율하|물금|증산|사송)/.test(slug) ||
      /거주/.test(slug) ||
      /^경남/.test(slug) ||
      /^김해|^양산|^창원/.test(slug)
    ) {
      return 5;
    }

    if (/^(울산|대구|경북|경남|안동|예천|김천|칠곡|포항|구미)/.test(slug)) return 5;

    return 5;
  }

  if (routePath.startsWith("/blog")) return 7;
  if (
    routePath.startsWith("/media/") ||
    routePath.startsWith("/강의") ||
    routePath === "/blog"
  ) {
    return routePath === "/blog" ? 7 : 8;
  }

  if (/상속등기법무사$/.test(routePath.slice(1)) && routePath !== "/") {
    return 4;
  }

  if (
    /^\/(부산|해운대|센텀|부산역|서면|광안|동래|연산|남천|대연|덕천|명지|정관|사상|하단)/.test(
      routePath,
    )
  ) {
    return 4;
  }

  return 6;
}

export const TIER1_REQUIRED = [...TIER1];
