export type SituationCategoryId =
  | "inheritance-death"
  | "jeonse-lease"
  | "real-estate-trade"
  | "debt-rehab"
  | "corporate-business"
  | "debt-collection"
  | "contract-dispute";

export type SituationCategoryDef = {
  id: SituationCategoryId;
  slug: string;
  path: string;
  label: string;
  shortLabel: string;
  description: string;
  hubIntro: string;
  representativeConcerns: string[];
  icon: string;
};

export const SITUATION_CATEGORY_ORDER: SituationCategoryId[] = [
  "inheritance-death",
  "jeonse-lease",
  "real-estate-trade",
  "debt-rehab",
  "corporate-business",
  "debt-collection",
  "contract-dispute",
];

export const SITUATION_CATEGORIES: Record<
  SituationCategoryId,
  SituationCategoryDef
> = {
  "inheritance-death": {
    id: "inheritance-death",
    slug: "가족-사망-상속",
    path: "/situations/분류/가족-사망-상속",
    label: "가족 사망·상속",
    shortLabel: "상속",
    description:
      "사망 후 상속인 확인, 채무·재산 조사, 상속등기·포기·한정승인까지 가족이 겪는 상황을 정리합니다.",
    hubIntro:
      "부모님이나 배우자 사망 직후에는 장례와 함께 상속인·재산·채무를 확인해야 합니다. 기한과 선택을 놓치면 불이익이 커질 수 있어, 지금 상황에 맞는 순서부터 안내합니다.",
    representativeConcerns: [
      "사망 후 무엇부터 해야 하나요?",
      "빚이 있는지 모르겠어요",
      "형제가 협조하지 않아요",
      "상속등기를 미루면 어떻게 되나요?",
    ],
    icon: "inheritance",
  },
  "jeonse-lease": {
    id: "jeonse-lease",
    slug: "전세-임대차-보증금",
    path: "/situations/분류/전세-임대차-보증금",
    label: "전세·임대차·보증금",
    shortLabel: "전세",
    description:
      "전세보증금 미반환, 임대인 연락두절, 경매·임차권등기명령 등 세입자 권리를 지키는 상황별 안내입니다.",
    hubIntro:
      "계약이 끝났는데 보증금이 돌아오지 않으면, 말로만 기다리기보다 대항력·우선변제권·기한을 함께 봐야 합니다. 급한 경우가 많아 우선 확인할 순서를 정리했습니다.",
    representativeConcerns: [
      "전세금을 못 받았어요",
      "집주인 연락이 안 됩니다",
      "경매가 진행된다고 들었어요",
      "확정일자를 안 받았어요",
    ],
    icon: "lease",
  },
  "real-estate-trade": {
    id: "real-estate-trade",
    slug: "부동산-매매-증여-등기",
    path: "/situations/분류/부동산-매매-증여-등기",
    label: "부동산 매매·증여·등기",
    shortLabel: "부동산등기",
    description:
      "매매·증여·명의변경·말소등기 등 부동산 거래와 등기 과정에서 생기는 문제를 상황별로 설명합니다.",
    hubIntro:
      "잔금을 치렀거나 명의를 바꿔야 하는데 등기가 막히면, 계약서·등기부등본·말소 순서를 먼저 대조해야 합니다. 셀프등기 실수도 되돌리기 어려울 수 있어 주의가 필요합니다.",
    representativeConcerns: [
      "잔금 후 등기가 안 됩니다",
      "근저당 말소가 지연됩니다",
      "공동명의를 정리하고 싶어요",
      "증여와 매매 중 무엇이 맞나요?",
    ],
    icon: "real-estate",
  },
  "debt-rehab": {
    id: "debt-rehab",
    slug: "개인채무-회생-파산",
    path: "/situations/분류/개인채무-회생-파산",
    label: "개인채무·회생·파산",
    shortLabel: "채무",
    description:
      "빚 부담, 급여압류, 개인회생·파산 선택, 보증채무 등 채무 정리 전에 확인할 상황을 모았습니다.",
    hubIntro:
      "채무는 금액만큼 구조(담보·보증·소득)가 중요합니다. 무조건 회생이나 파산이 정답은 아니며, 지금 압류·독촉 상황에 맞는 경로를 함께 정리할 수 있습니다.",
    representativeConcerns: [
      "급여가 압류됐어요",
      "개인회생이 가능한지 모르겠어요",
      "보증으로 빚이 생겼어요",
      "배우자에게 알리지 않고 가능한가요?",
    ],
    icon: "rehab",
  },
  "corporate-business": {
    id: "corporate-business",
    slug: "법인-사업-운영",
    path: "/situations/분류/법인-사업-운영",
    label: "법인·사업 운영",
    shortLabel: "법인",
    description:
      "법인 설립·임원 변경·본점 이전·증감자·해산·청산 등 회사 운영 중 등기와 절차 이슈를 정리합니다.",
    hubIntro:
      "법인은 실제 운영과 등기부가 어긋나면 은행·계약·입찰에서 막히기 쉽습니다. 임기 만료·대표자 변경·본점 이전은 각각 기한과 과태료 규정이 있어 빠른 확인이 필요합니다.",
    representativeConcerns: [
      "임원 임기가 지났어요",
      "본점을 옮겼는데 등기가 옛 주소예요",
      "대표자가 사망했어요",
      "법인을 처음 설립하려고 해요",
    ],
    icon: "corporate",
  },
  "debt-collection": {
    id: "debt-collection",
    slug: "돈을-받지-못한-경우",
    path: "/situations/분류/돈을-받지-못한-경우",
    label: "돈을 받지 못한 경우",
    shortLabel: "채권회수",
    description:
      "대여금·대금·공사대금 미수, 지급명령·소송·강제집행 등 채권을 받아내기 위한 상황별 안내입니다.",
    hubIntro:
      "돈을 못 받을 때는 증거·소멸시효·상대방 주소가 핵심입니다. 관계를 유지할지, 법적 절차로 권리를 고정할지에 따라 내용증명·지급명령·소송 순서가 달라집니다.",
    representativeConcerns: [
      "빌려준 돈을 못 받았어요",
      "공사대금을 안 줍니다",
      "상대 재산이 있는지 모르겠어요",
      "판결은 받았는데 돈이 안 들어와요",
    ],
    icon: "collection",
  },
  "contract-dispute": {
    id: "contract-dispute",
    slug: "계약-일상-분쟁",
    path: "/situations/분류/계약-일상-분쟁",
    label: "계약·일상 분쟁",
    shortLabel: "계약분쟁",
    description:
      "계약 취소·계약금 반환·중고거래·손해배상·합의서·내용증명 대응 등 일상 분쟁 상황을 정리합니다.",
    hubIntro:
      "계약 분쟁은 ‘누가 먼저 잘못했는지’보다, 계약서·대화 기록·이행 여부를 어떻게 정리하느냐가 결과에 큰 영향을 줍니다. 합의 전에 확인할 포인트를 모았습니다.",
    representativeConcerns: [
      "계약금만 받고 거래가 깨졌어요",
      "중고거래에서 피해를 봤어요",
      "내용증명을 받았어요",
      "합의서를 어떻게 써야 하나요?",
    ],
    icon: "contract",
  },
};

export const SITUATION_CATEGORY_LABELS: Record<SituationCategoryId, string> =
  Object.fromEntries(
    SITUATION_CATEGORY_ORDER.map((id) => [
      id,
      SITUATION_CATEGORIES[id].label,
    ]),
  ) as Record<SituationCategoryId, string>;

export function getSituationCategoryBySlug(
  categorySlug: string,
): SituationCategoryDef | undefined {
  return Object.values(SITUATION_CATEGORIES).find(
    (cat) => cat.slug === categorySlug,
  );
}

export function getSituationCategoryById(
  id: SituationCategoryId,
): SituationCategoryDef {
  return SITUATION_CATEGORIES[id];
}

export function getAllSituationCategorySlugs(): string[] {
  return SITUATION_CATEGORY_ORDER.map(
    (id) => SITUATION_CATEGORIES[id].slug,
  );
}
