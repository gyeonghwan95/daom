/**
 * 검색 의도 → 대표 URL 고정표 (내부 운영용, meta keywords로 출력하지 않는다).
 * 같은 query를 다른 URL의 title·H1 primary로 새로 잡지 않는다.
 * 대표 URL의 title·H1·description은 여기 값이 기준이며 TITLE_FROZEN 동안 임의로 바꾸지 않는다.
 */
export const TITLE_FROZEN = true;

export const SEO_INTENT_OWNERS_REVIEWED_ON = "2026-09-27";

export type SeoIntentRole = "PROVIDER_SELECTION" | "ACTION_PROCEDURE" | "LOCAL_PROVIDER";

export type SeoIntentOwner = {
  query: string;
  role: SeoIntentRole;
  path: string;
  secondaryQueries: readonly string[];
  /** 같은 query를 primary로 잡으면 안 되는 내부 URL (참조 링크만 허용) */
  supportingPaths: readonly string[];
  titleFrozen: boolean;
  metaTitle: string;
  h1: string;
  description: string;
};

export const SEO_INTENT_OWNERS: readonly SeoIntentOwner[] = [
  {
    query: "부산 상속전문 법무사",
    role: "PROVIDER_SELECTION",
    path: "/부산상속전문법무사",
    secondaryQueries: ["부산 상속 법무사 추천", "부산 상속 법무사 선택"],
    supportingPaths: ["/부산상속법무사", "/부산상속포기", "/부산한정승인"],
    titleFrozen: TITLE_FROZEN,
    metaTitle: "부산 상속전문 법무사를 찾는다면｜업무범위와 선택 기준",
    h1: "부산에서 상속전문 법무사를 찾을 때 무엇을 확인해야 할까요?",
    description:
      "등기만 맡길지, 상속포기·한정승인과 미성년·해외 상속인까지 함께 볼지에 따라 비교 기준이 달라집니다. 업무범위, 공개된 처리·상담 기록, 상담 방식을 확인하는 방법을 정리했습니다.",
  },
  {
    query: "부산 상속포기 법무사",
    role: "ACTION_PROCEDURE",
    path: "/부산상속포기",
    secondaryQueries: ["부산 상속포기", "상속포기 3개월", "상속포기 후순위"],
    supportingPaths: ["/상속포기비용", "/부산가정법원상속포기", "/상속포기자가진단", "/부산한정승인"],
    titleFrozen: TITLE_FROZEN,
    metaTitle: "부산 상속포기 법무사｜3개월·후순위 상속인부터 확인",
    h1: "부산 상속포기, 3개월과 다음 상속인부터 확인하세요",
    description:
      "상속포기 3개월 기한, 배우자·자녀 포기의 후순위 효과, 처분·인출 이력과 한정승인 비교를 먼저 확인합니다. 부산 해운대 센텀 다옴법무사 안내.",
  },
  {
    query: "해운대구 법무사",
    role: "LOCAL_PROVIDER",
    path: "/해운대법무사",
    secondaryQueries: ["해운대 법무사", "센텀 법무사", "재송동 법무사", "반여동 법무사"],
    supportingPaths: ["/센텀법무사", "/재송동법무사", "/해운대구부동산등기", "/해운대구상속등기", "/업무사례/해운대구법무사"],
    titleFrozen: TITLE_FROZEN,
    metaTitle: "해운대구 법무사｜센텀·재송·반여 부동산·상속·법인등기",
    h1: "해운대구 법무사, 어떤 업무를 맡길 수 있을까요?",
    description:
      "센텀동로 사무소에서 해운대구 아파트·오피스텔 매매등기, 상속등기, 근저당, 법인설립·임원변경을 안윤정 법무사가 직접 상담합니다. 방문 예약, 동부지원 등기과 관할, 준비서류를 안내합니다.",
  },
];

function normalizeOwnerPath(input: string): string {
  let value = String(input || "").split("?")[0].split("#")[0];
  try {
    value = decodeURIComponent(value);
  } catch {
    /* keep raw */
  }
  if (!value.startsWith("/")) value = `/${value}`;
  if (value.length > 1 && value.endsWith("/")) value = value.slice(0, -1);
  return value;
}

const ownerByPath = new Map(SEO_INTENT_OWNERS.map((owner) => [owner.path, owner] as const));

export function getSeoIntentOwnerByPath(pathOrSlug: string): SeoIntentOwner | undefined {
  return ownerByPath.get(normalizeOwnerPath(pathOrSlug));
}

/** usePathname은 정적 export SSR에서 인코딩된 경로를 줄 수 있어 디코드 후 비교한다. */
export function isNaverRecoveryTargetPath(pathOrSlug: string): boolean {
  return ownerByPath.has(normalizeOwnerPath(pathOrSlug));
}
