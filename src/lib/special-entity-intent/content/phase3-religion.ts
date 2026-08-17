import type { SpecialEntityPageContent } from "../types";
import {
  SPECIAL_ENTITY_OFFICE_LINE,
  SPECIAL_ENTITY_SCOPE_NOTICE,
  baseSpecialRelated,
} from "./shared";

export const phase3ReligionPages: SpecialEntityPageContent[] = [
  {
    slug: "종교단체사단법인설립",
    kind: "intent",
    title: "종교단체 사단법인 설립",
    metaTitle: "종교단체 사단법인 설립｜종교단체법과 민법 비영리 구분",
    metaDescription:
      "종교단체 사단법인 설립. 종교단체법 등록·민법 사단법인·재산 등기 구분. 등기만 안내 — 다옴법무사.",
    h1: "종교단체 사단법인 — 종교단체법과 비영리법인을 구분하세요",
    eyebrow: "종교 · 사단법인",
    heroIntro:
      "교회·사찰·성당 등 종교 community는 ‘종교단체’ 등록, ‘사단법인’ 설립, 부동산 등기가 서로 다른 제도입니다.",
    heroParagraphs: [
      "종교단체의 법인격·재산 귀속은 종교단체 등에 관한 법률 등이 적용될 수 있고, 별도로 민법상 사단법인(종교 관련 목적)을 설립하는 경우도 있습니다. 목적에 맞는 제도를 먼저 선택해야 합니다.",
      "법무사는 선택된 형태에 따른 법인설립등기·변경등기·부동산 등기(해당 시)를 지원합니다. 종교 행정·교리·내부 규범 자문은 해당 분야가 아닙니다.",
    ],
    officeLine: SPECIAL_ENTITY_OFFICE_LINE,
    scopeNotice: SPECIAL_ENTITY_SCOPE_NOTICE,
    conclusion:
      "종교단체 사단법인은 주무관청 설립허가 후 설립등기하는 민법상 비영리법인입니다. 종교단체 등록만으로 법인격이 생기지 않을 수 있으므로, 등기부·종교단체 등록 여부를 구분해 확인하세요.",
    primaryKeyword: "종교단체 사단법인 설립",
    secondaryKeywords: [
      "종교단체 법인화",
      "교회 사단법인",
      "사찰 법인 설립",
      "종교법인 설립",
    ],
    questionKeywords: ["종교단체 법인 만들기", "교회 법인 설립"],
    searchIntent: "종교 community의 법인화·등기 절차를 확인하려는 검색",
    whoNeedsThis: [
      "교회·사찰·성당 관련 단체의 법인화 검토",
      "종교단체 등록과 사단법인 차이를 알고 싶은 경우",
    ],
    whenAndDeadline: ["설립허가 후 3주 이내 설립등기(민법상 사단법인)"],
    decisionBodies: ["창립총회", "주무관청(문화·종교·지자체 등)"],
    documents: ["허가서", "정관", "창립총회 의사록", "임원 서류"],
    procedures: [
      "종교단체 등록 vs 사단법인 필요성 검토",
      "설립허가",
      "설립등기",
    ],
    costFactors: ["법인 유형", "재산·부동산 등기 연계"],
    penaltyRisks: ["제도 혼동", "등기 지연"],
    commonConfusions: [
      "종교단체 등록=사단법인",
      "부동산 등기와 법인 설립 혼동",
      "종중·문중을 사단법인과 동일시",
    ],
    diyErrors: ["허가 없이 등기", "종교단체법 절차 미확인"],
    faqs: [
      {
        question: "종중·문중도 사단법인으로 설립하나요?",
        answer:
          "종중·문중은 민법상 재단·조합 등 다른 제도나 관습법·재산 관계가 얽혀 있어 사안별 검토가 필요합니다. 일반적인 ‘협회형’ 사단법인과 동일하지 않을 수 있습니다.",
      },
    ],
    relatedLinks: [
      { href: "/종교재단설립", label: "종교재단 설립" },
      { href: "/교회사단법인설립", label: "교회 사단법인 설립" },
      { href: "/부산사단법인설립", label: "부산 사단법인" },
      ...baseSpecialRelated,
    ],
    ctaTitle: "종교단체 법인·등기 상담",
    ctaText: "현재 등록·허가·등기 상태를 알려주시면 등기 단계부터 확인할 수 있습니다.",
    legalProfile: {
      entityName: "종교 관련 사단법인",
      legalBasis: ["민법 제32·37조", "종교단체 등에 관한 법률(등록·재산)"],
      establishmentMethod: "주무관청 허가 후 설립등기(사단법인 선택 시)",
      competentAuthority: ["목적별 주무관청", "관할 등기소"],
      preRegistrationSteps: ["제도 선택", "허가", "창립총회"],
      registrationDeadline: "허가 후 3주 이내(사단법인)",
      registrableMatters: ["목적·임원·주사무소"],
      lawyerScope: ["설립·변경·해산 등기", "관련 부동산 등기(별도)"],
      excludedScope: ["종교단체 등록 대행", "종교·세무 자문"],
      lastLegalReview: "2026-07-29",
    },
  },
  {
    slug: "교회사단법인설립",
    kind: "intent",
    title: "교회 사단법인 설립",
    metaTitle: "교회 사단법인 설립｜교회 재산·등기와 비영리법인 구분",
    metaDescription:
      "교회·교단 관련 사단법인 설립등기. 종교단체 등록·재산·허가 후 등기 — 다옴법무사.",
    h1: "교회 사단법인 — 재산·등기 구조부터 정리하세요",
    eyebrow: "교회 · 사단법인",
    heroIntro:
      "교회 관련 organization의 법인화는 종교단체 등록, 사단법인 설립, 교회 재산 등기가 각각 다른 문제입니다.",
    heroParagraphs: [
      "교육·선교·복지·재산 관리 목적에 따라 사단법인·재단법인을 검토할 수 있습니다. 부산·경남 교회 community에서도 허가 주체·등기소 관할을 먼저 확인하는 경우가 많습니다.",
    ],
    officeLine: SPECIAL_ENTITY_OFFICE_LINE,
    scopeNotice: SPECIAL_ENTITY_SCOPE_NOTICE,
    conclusion:
      "교회 사단법인 설립은 주무관청 허가 후 설립등기합니다. 교회 building·토지 등기는 별도 부동산등기 절차입니다.",
    primaryKeyword: "교회 사단법인 설립",
    secondaryKeywords: ["교회 법인화", "교회 재산 등기", "교단 사단법인"],
    questionKeywords: ["교회 법인 설립 절차"],
    searchIntent: "교회 community의 사단법인 설립을 확인하려는 검색",
    whoNeedsThis: ["교회·교단 관련 단체 발기인"],
    whenAndDeadline: ["허가 후 3주 이내"],
    decisionBodies: ["창립총회", "주무관청"],
    documents: ["허가서", "정관", "의사록"],
    procedures: ["허가", "설립등기"],
    costFactors: ["임원·재산 연계"],
    penaltyRisks: ["재산·법인 혼동"],
    commonConfusions: ["교회 등록=법인"],
    diyErrors: ["재산 등기와 법인 설립 혼동"],
    faqs: [],
    relatedLinks: [
      { href: "/종교단체사단법인설립", label: "종교단체 사단법인" },
      ...baseSpecialRelated,
    ],
    ctaTitle: "교회 사단법인 설립 상담",
    ctaText: "허가·정관 준비 상태를 알려주세요.",
  },
];
