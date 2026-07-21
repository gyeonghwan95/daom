import type { SituationCategoryId } from "./categories";
import type { SituationPage, SituationSolution } from "./types";

export const LEGACY_SITUATION_CATEGORIES: Record<string, SituationCategoryId> =
  {
    "parent-passed-away": "inheritance-death",
    "siblings-not-cooperating": "inheritance-death",
    "inheritance-unknown-debt": "inheritance-death",
    "jeonse-deposit-unpaid": "jeonse-lease",
    "real-estate-sale-registration": "real-estate-trade",
    "corporate-officer-address-change": "corporate-business",
    "payment-order-certified-mail": "debt-collection",
    "personal-rehabilitation-bankruptcy": "debt-rehab",
  };

const LEGACY_PRIORITY: Record<string, number> = {
  "parent-passed-away": 95,
  "inheritance-unknown-debt": 92,
  "siblings-not-cooperating": 88,
  "jeonse-deposit-unpaid": 94,
  "real-estate-sale-registration": 86,
  "personal-rehabilitation-bankruptcy": 90,
  "payment-order-certified-mail": 87,
  "corporate-officer-address-change": 84,
};

const LEGACY_URGENT = new Set([
  "inheritance-unknown-debt",
  "jeonse-deposit-unpaid",
  "personal-rehabilitation-bankruptcy",
]);

export function normalizeSituationPage(page: SituationPage): SituationPage {
  const category =
    page.situationCategory ??
    LEGACY_SITUATION_CATEGORIES[page.slug] ??
    "inheritance-death";

  const conclusion =
    page.conclusion ??
    `${page.cardTitle} 상황에서는 ${page.firstChecks[0] ?? "사실관계와 기한"}부터 확인하는 것이 우선입니다.`;

  const solutions: SituationSolution[] =
    page.solutions ??
    [
      {
        title: "직접 진행",
        body: page.selfHandleCases[0] ?? "서류가 단순하면 직접 진행할 수 있습니다.",
        whenToChoose: "상속인·당사자 협의가 되고 서류가 갖춰진 경우",
      },
      {
        title: "전문가와 함께 진행",
        body:
          page.lawyerNeededCases[0] ??
          "기한·권리관계·분쟁 가능성이 있으면 상담을 권합니다.",
        whenToChoose: "협의가 어렵거나 기한·절차가 복잡한 경우",
      },
    ];

  const relatedSituationSlugs =
    page.relatedSituationSlugs ??
    page.relatedSituations ??
    [];

  return {
    ...page,
    situationCategory: category,
    conclusion,
    searchIntent: page.searchIntent ?? page.cardDescription,
    solutions,
    costFactors: page.costFactors ?? [
      "사건 복잡도(당사자 수·재산·채무 규모)",
      "필요한 등기·법원·공탁 비용",
      "서류 보완·분쟁 대응 여부",
      "원격 진행 가능 여부와 방문 필요 횟수",
    ],
    commonMistakes: page.commonMistakes ?? [
      "기한(상속 3개월, 임차권·시효 등) 확인 없이 미루는 경우",
      "서류·증거를 정리하지 않고 구두 합의만 믿는 경우",
      "등기부등본·계약서 최신본 없이 판단하는 경우",
    ],
    caseExample: page.caseExample ?? {
      title: `${page.cardTitle} — 상담 사례`,
      body: `전화 상담으로 상황을 듣고 필요 서류 목록과 다음 단계(자가진단·등기·법원 절차)를 정리해 드린 뒤, 진행 범위와 예상 비용을 구분해 안내한 사례가 있습니다. 사건마다 달라질 수 있어 참고용으로 확인해 주세요.`,
    },
    relatedSituationSlugs,
    relatedSituations: relatedSituationSlugs,
    priority: page.priority ?? LEGACY_PRIORITY[page.slug] ?? 70,
    urgent: page.urgent ?? LEGACY_URGENT.has(page.slug),
    isNew: page.isNew ?? false,
  };
}

export function normalizeAllSituationPages(
  pages: SituationPage[],
): SituationPage[] {
  return pages.map(normalizeSituationPage);
}
