/**
 * 상속 생애주기 여정 — 검색 유입을 시간 순서로 연결.
 * 신규 페이지 추가 시 STAGES·PAGE_STAGE에만 등록하면 네비가 갱신된다.
 */

export type InheritanceJourneyStage = {
  id: string;
  step: number;
  label: string;
  shortLabel: string;
  href: string;
  description: string;
};

export const INHERITANCE_JOURNEY_STAGES: InheritanceJourneyStage[] = [
  {
    id: "after-death",
    step: 1,
    label: "장례 직후 할 일",
    shortLabel: "장례 직후",
    href: "/부모님사망후해야할일",
    description: "사망일·상속인부터 정리",
  },
  {
    id: "admin",
    step: 2,
    label: "사망신고·행정",
    shortLabel: "사망신고",
    href: "/사망신고와상속등기차이",
    description: "행정과 등기를 구분",
  },
  {
    id: "assets",
    step: 3,
    label: "재산·채무 조회",
    shortLabel: "재산조회",
    href: "/사망자재산채무조회",
    description: "예금·부동산·빚 확인",
  },
  {
    id: "choice",
    step: 4,
    label: "상속방법 선택",
    shortLabel: "포기·한정",
    href: "/부모빚상속방법",
    description: "등기·포기·한정승인",
  },
  {
    id: "registry",
    step: 5,
    label: "상속등기",
    shortLabel: "상속등기",
    href: "/부산상속등기",
    description: "부동산 명의이전",
  },
  {
    id: "special",
    step: 6,
    label: "특수·장기 미정리",
    shortLabel: "특수상황",
    href: "/오래된상속토지정리",
    description: "해외·미성년·연락두절",
  },
  {
    id: "remote-cost",
    step: 7,
    label: "비대면·비용",
    shortLabel: "비대면·비용",
    href: "/방문없이준비하는상속등기",
    description: "방문 전 확인·견적",
  },
];

/** slug → 여정 단계 id */
export const INHERITANCE_PAGE_STAGE: Record<string, string> = {
  부모님사망후해야할일: "after-death",
  장례후재산채무정리: "after-death",
  사망신고와상속등기차이: "admin",
  안심상속원스톱서비스이후: "assets",
  사망자재산채무조회: "assets",
  부모빚상속방법: "choice",
  고인계좌장례비사용: "choice",
  사망후3개월지난상속: "choice",
  부산상속포기: "choice",
  부산한정승인: "choice",
  부산상속등기: "registry",
  부산상속후매매등기: "registry",
  임대인사망전세계약: "registry",
  오래된상속토지정리: "special",
  연락두절상속인: "special",
  미성년상속인: "special",
  재혼가정상속: "special",
  해외거주상속인: "special",
  방문없이준비하는상속등기: "remote-cost",
  상속상담전준비서류와비용: "remote-cost",
  부산법무사비대면상담: "remote-cost",
  전국상속등기: "remote-cost",
  부산상속법무사: "choice",
  상속: "after-death",
};

/** 플래그십·허브에서 비대면·비용 블록을 노출할 slug */
export const INHERITANCE_FLAGSHIP_SLUGS = new Set([
  "부산상속등기",
  "부산상속포기",
  "부산한정승인",
  "부산상속법무사",
  "상속",
  "전국상속등기",
  "여러지역상속부동산등기",
]);

export function getInheritanceJourneyStage(
  slug: string,
): InheritanceJourneyStage | undefined {
  const stageId = INHERITANCE_PAGE_STAGE[slug];
  if (!stageId) return undefined;
  return INHERITANCE_JOURNEY_STAGES.find((s) => s.id === stageId);
}

export function getInheritanceJourneyNeighbors(slug: string): {
  current?: InheritanceJourneyStage;
  prev?: InheritanceJourneyStage;
  next?: InheritanceJourneyStage;
} {
  const current = getInheritanceJourneyStage(slug);
  if (!current) return {};
  const idx = INHERITANCE_JOURNEY_STAGES.findIndex((s) => s.id === current.id);
  return {
    current,
    prev: idx > 0 ? INHERITANCE_JOURNEY_STAGES[idx - 1] : undefined,
    next:
      idx >= 0 && idx < INHERITANCE_JOURNEY_STAGES.length - 1
        ? INHERITANCE_JOURNEY_STAGES[idx + 1]
        : undefined,
  };
}

export function isInheritanceJourneyPage(slug: string): boolean {
  return slug in INHERITANCE_PAGE_STAGE;
}

export function isInheritanceFlagshipPage(slug: string): boolean {
  return INHERITANCE_FLAGSHIP_SLUGS.has(slug);
}
