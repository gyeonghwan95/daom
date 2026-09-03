/**
 * 검색어 → 기존 URL 유입 정책.
 * 새 랜딩을 만들지 않고, 네이버 ‘함께 찾은 검색어’를 사이트 안에서 처리한다.
 * 링크 문구는 검색어와 다르게 둔다(혼합 앵커).
 */
import {
  BUSAN_LEGAL_SCRIVENER_CHAMPION,
  COST_CHAMPION,
  getPageRelation,
  HOME_BROAD_CHAMPION,
  LEGAL_CONSULTATION_CHAMPION,
  PERSONAL_BANKRUPTCY_CHAMPION,
  PERSONAL_REHABILITATION_CHAMPION,
  REAL_ESTATE_CHAMPION,
  SELECTION_CHAMPION,
} from "@/data/seo/page-relations";
import {
  BUSAN_DISTRICT_HUBS,
  isBusanDistrictHubPath,
} from "@/lib/geo/busan-district-hubs";
import { isInflowRailPath, normalizeSeoPath } from "@/lib/seo/champion-query";

export type InflowItem = {
  href: string;
  label: string;
  searchPhrase?: string;
  reason: string;
};

const REGISTRY_HUB = "/부산등기법무사";
const INHERITANCE_HUB = "/부산상속등기";
const INHERITANCE_CHOICE = "/부산상속법무사";
const RENUNCIATION_HUB = "/부산상속포기";
const QUALIFIED_HUB = "/부산한정승인";
const CORPORATE_HUB = "/부산법인등기";
const OFFICE_HUB = "/부산법무사무소";

const LIBRARY: InflowItem[] = [
  {
    href: HOME_BROAD_CHAMPION,
    label: "해운대·센텀 법무사 사무소",
    searchPhrase: "부산 법무사",
    reason: "다옴법무사사무소 안윤정 법무사가 상속·등기·법인·회생을 직접 상담합니다.",
  },
  {
    href: BUSAN_LEGAL_SCRIVENER_CHAMPION,
    label: "업무·비용·상담 전 확인 기준",
    reason: "정확한 업무명을 몰라도 지금 필요한 절차부터 가립니다.",
  },
  {
    href: REGISTRY_HUB,
    label: "부동산·상속·법인 등기 안내",
    searchPhrase: "부산 등기 법무사",
    reason: "등기 종류를 몰라도 현재 상황만 알려 주시면 됩니다.",
  },
  {
    href: INHERITANCE_HUB,
    label: "상속 명의이전 서류와 순서",
    searchPhrase: "부산 상속등기",
    reason: "상속인 구성·채무 여부에 따라 서류가 달라집니다.",
  },
  {
    href: "/부산상속포기",
    label: "상속포기 3개월 기한 확인",
    searchPhrase: "부산 상속포기 법무사",
    reason: "등기와 별개 절차입니다. 기한이 있으면 먼저 상담하는 편이 안전합니다.",
  },
  {
    href: CORPORATE_HUB,
    label: "설립·임원·본점 변경등기",
    searchPhrase: "부산 법인등기",
    reason: "결의일부터 등기 기한이 있어 등기부 대조가 먼저입니다.",
  },
  {
    href: REAL_ESTATE_CHAMPION,
    label: "매매·증여 소유권이전 순서",
    searchPhrase: "부산 부동산등기",
    reason: "잔금일·말소·취득세 순서를 맞추면 접수가 수월합니다.",
  },
  {
    href: PERSONAL_REHABILITATION_CHAMPION,
    label: "개인회생 신청 전 확인할 것",
    searchPhrase: "부산 개인회생",
    reason: "소득·채무·재산 자료를 먼저 보면 상담이 구체적입니다.",
  },
  {
    href: PERSONAL_BANKRUPTCY_CHAMPION,
    label: "개인파산·면책 구분 안내",
    searchPhrase: "부산 개인파산",
    reason: "회생과 파산은 요건이 다릅니다. 단정하지 않고 상황을 봅니다.",
  },
  {
    href: COST_CHAMPION,
    label: "보수와 공과금을 구분해 보기",
    searchPhrase: "부산 법무사 비용",
    reason: "수임료와 등록면허세·취득세는 항목이 다릅니다.",
  },
  {
    href: SELECTION_CHAMPION,
    label: "추천 검색 전에 볼 선택 기준",
    searchPhrase: "부산 법무사 추천",
    reason: "후기만으로 고르지 않고, 업무 범위·상담 방식부터 확인합니다.",
  },
  {
    href: LEGAL_CONSULTATION_CHAMPION,
    label: "상담 전 준비서류",
    searchPhrase: "부산 법무사 상담",
    reason: "전화·카카오톡으로 1차 확인이 가능합니다.",
  },
  {
    href: OFFICE_HUB,
    label: "해운대·센텀 사무소 위치",
    searchPhrase: "부산 법무사무소",
    reason: "주소·전화·방문 예약은 이 안내에서 확인합니다.",
  },
  {
    href: "/해운대법무사",
    label: "해운대 생활권 상담 안내",
    searchPhrase: "해운대 법무사",
    reason: "센텀 사무소에서 해운대구 사건을 상담합니다.",
  },
  {
    href: "/센텀법무사",
    label: "센텀·재송 인근 안내",
    searchPhrase: "센텀 법무사",
    reason: "방문은 예약 후, 서류는 원격으로도 받는 사건이 있습니다.",
  },
  {
    href: "/contact/inquiry",
    label: "1분 상담 문의",
    reason: "업무명을 몰라도 현재 상황만 남겨 주시면 됩니다.",
  },
  {
    href: "/busan-legal-map",
    label: "부산 구·군별 상담 주제",
    reason: "16개 구·군에서 자주 묻는 상속·등기 주제를 생활권 기준으로 봅니다.",
  },
  ...BUSAN_DISTRICT_HUBS.filter((hub) => hub.href !== "/해운대법무사").map((hub) => ({
    href: hub.href,
    label: hub.hint,
    searchPhrase: hub.label,
    reason: `센텀 사무소에서 ${hub.label.replace(" 법무사", "")} 소재 사건을 상담합니다.`,
  })),
];

const SKIP_PATHS = new Set([
  "/",
  "/search",
  "/contact/inquiry",
  "/개인정보처리방침",
  "/이용약관",
]);

function normalizePath(raw: string): string {
  return normalizeSeoPath(raw);
}

function libraryByHref(href: string): InflowItem | undefined {
  return LIBRARY.find((item) => item.href === href);
}

function fallbackItem(href: string): InflowItem {
  const fromLib = libraryByHref(href);
  if (fromLib) return fromLib;
  const slug = href.replace(/^\//, "");
  return {
    href,
    label: slug,
    reason: "같은 업무·지역 안내로 이어집니다.",
  };
}

function pushUnique(target: InflowItem[], item: InflowItem, current: string) {
  if (!item.href || item.href === current) return;
  if (target.some((row) => row.href === item.href)) return;
  target.push(item);
}

function fillerHrefs(current: string): string[] {
  if (isBusanDistrictHubPath(current) || current === "/busan-legal-map") {
    return [
      HOME_BROAD_CHAMPION,
      BUSAN_LEGAL_SCRIVENER_CHAMPION,
      "/busan-legal-map",
      LEGAL_CONSULTATION_CHAMPION,
      COST_CHAMPION,
      REGISTRY_HUB,
    ];
  }
  if (current === BUSAN_LEGAL_SCRIVENER_CHAMPION) {
    return [
      HOME_BROAD_CHAMPION,
      REGISTRY_HUB,
      INHERITANCE_HUB,
      CORPORATE_HUB,
      PERSONAL_REHABILITATION_CHAMPION,
      COST_CHAMPION,
      SELECTION_CHAMPION,
    ];
  }
  if (current === REGISTRY_HUB) {
    return [
      BUSAN_LEGAL_SCRIVENER_CHAMPION,
      REAL_ESTATE_CHAMPION,
      INHERITANCE_HUB,
      CORPORATE_HUB,
      "/부산소유권이전등기",
      SELECTION_CHAMPION,
    ];
  }
  if (
    current === INHERITANCE_CHOICE ||
    current === INHERITANCE_HUB ||
    current === RENUNCIATION_HUB ||
    current === QUALIFIED_HUB
  ) {
    return [
      BUSAN_LEGAL_SCRIVENER_CHAMPION,
      INHERITANCE_CHOICE,
      RENUNCIATION_HUB,
      QUALIFIED_HUB,
      INHERITANCE_HUB,
      COST_CHAMPION,
    ];
  }
  return [
    HOME_BROAD_CHAMPION,
    BUSAN_LEGAL_SCRIVENER_CHAMPION,
    REGISTRY_HUB,
    LEGAL_CONSULTATION_CHAMPION,
    COST_CHAMPION,
    OFFICE_HUB,
  ];
}

/** 현재 경로에서 이탈하지 않고 대표 페이지로 이어 주는 링크 */
export function getInflowItemsForPath(pathname: string): InflowItem[] {
  const current = normalizePath(pathname);
  if (
    SKIP_PATHS.has(current) ||
    current.startsWith("/admin") ||
    !isInflowRailPath(current)
  ) {
    return [];
  }

  const items: InflowItem[] = [];
  const relation = getPageRelation(current);

  if (relation?.parentHub) {
    pushUnique(items, fallbackItem(relation.parentHub), current);
  }

  for (const href of relation?.relatedPages ?? []) {
    pushUnique(items, fallbackItem(href), current);
    if (items.length >= 4) break;
  }

  for (const href of fillerHrefs(current)) {
    pushUnique(items, fallbackItem(href), current);
    if (items.length >= 6) break;
  }

  return items.slice(0, 6);
}

/** Speculation Rules·llms.txt에 쓰는 대표 경로 (기존 URL만) */
export const PREFETCH_CHAMPION_PATHS = [
  "/",
  BUSAN_LEGAL_SCRIVENER_CHAMPION,
  REGISTRY_HUB,
  INHERITANCE_HUB,
  RENUNCIATION_HUB,
  CORPORATE_HUB,
  REAL_ESTATE_CHAMPION,
  PERSONAL_REHABILITATION_CHAMPION,
  COST_CHAMPION,
  "/contact/inquiry",
] as const;
