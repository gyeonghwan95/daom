import type { SpecialEntityPageContent } from "../types";
import {
  SPECIAL_ENTITY_HUB_LINKS,
  SPECIAL_ENTITY_OFFICE_LINE,
  SPECIAL_ENTITY_SCOPE_NOTICE,
  baseSpecialRelated,
} from "./shared";

export const phase3ReligionExtensionPages: SpecialEntityPageContent[] = [
  {
    slug: "종교재단설립",
    kind: "intent",
    title: "종교재단 설립",
    metaTitle: "종교재단 설립｜출연재산·기본재산과 설립등기",
    metaDescription:
      "종교·기념·선교·교육 목적 재단법인 설립. 종교단체 등록과 구분, 허가 후 설립등기 — 다옴법무사.",
    h1: "종교재단 설립 — 출연재산과 재단법인을 먼저 구분하세요",
    eyebrow: "종교 · 재단법인",
    heroIntro:
      "종교 관련 기념·장학·복지·교육 사업을 재산 중심으로 운영하려면 민법상 재단법인(종교재단)을 검토하는 경우가 많습니다.",
    heroParagraphs: [
      "종교단체 등록, 사단법인, 재단법인은 제도가 다릅니다. 출연재산·기본재산·이사 구성이 재단 설립의 핵심이며, 주무관청 허가 후 설립등기를 합니다.",
      "교회·사찰 건물 소유권 등기와 재단법인 설립은 별개입니다. 법무사는 재단 설립·변경 등기와 관련 부동산 등기를 지원할 수 있으며, 종교 행정·교리 자문은 하지 않습니다.",
    ],
    officeLine: SPECIAL_ENTITY_OFFICE_LINE,
    scopeNotice: SPECIAL_ENTITY_SCOPE_NOTICE,
    conclusion:
      "종교재단은 보통 민법상 재단법인으로, 주무관청 허가 후 3주 이내 설립등기가 필요합니다. 기부금·세제는 별도 세무 확인이 필요합니다.",
    primaryKeyword: "종교재단 설립",
    secondaryKeywords: [
      "종교재단법인",
      "선교재단 설립",
      "교회 재단법인",
      "사찰 재단",
    ],
    questionKeywords: ["종교재단 설립 절차", "종교재단 기본재산"],
    searchIntent: "종교 목적 재단법인 설립을 확인하려는 검색",
    whoNeedsThis: [
      "출연재산으로 종교·기념·장학 사업을 하려는 경우",
      "교회·사찰 관련 재산 관리 재단",
    ],
    whenAndDeadline: ["설립허가 후 3주 이내 설립등기"],
    decisionBodies: ["설립위원회·이사회", "주무관청"],
    documents: [
      "설립허가서",
      "정관",
      "기본재산 목록·출연 증빙",
      "이사·감사 취임승낙서",
    ],
    procedures: ["정관·출연", "설립허가", "설립등기"],
    costFactors: ["기본재산 가액", "출연 형태"],
    penaltyRisks: ["기본재산 미귀속", "등기 지연"],
    commonConfusions: [
      "종교단체 등록=재단 설립",
      "사단법인과 재단법인 혼동",
    ],
    diyErrors: ["출연 권리 미정리", "감사 미선임"],
    faqs: [
      {
        question: "교회 사단법인과 무엇이 다른가요?",
        answer:
          "사단법인은 회원 중심, 재단법인은 출연재산·기본재산 중심입니다. `/교회사단법인설립`, `/사단법인과재단법인차이`를 참고하세요.",
      },
    ],
    relatedLinks: [
      { href: "/부산재단법인설립", label: "부산 재단법인 설립" },
      { href: "/종교단체사단법인설립", label: "종교단체 사단법인" },
      { href: "/장학재단설립", label: "장학재단 설립" },
      SPECIAL_ENTITY_HUB_LINKS.compareAssociationFoundation,
      ...baseSpecialRelated,
    ],
    ctaTitle: "종교재단 설립등기 상담",
    ctaText:
      "출연재산·정관 초안이 있다면 설립등기 준비 항목을 확인할 수 있습니다.",
    legalProfile: {
      entityName: "종교 목적 재단법인",
      legalBasis: ["민법 제32조·제42조", "종교단체 등에 관한 법률(참고)"],
      establishmentMethod: "주무관청 설립허가 후 설립등기",
      competentAuthority: ["목적별 주무관청", "관할 등기소"],
      preRegistrationSteps: ["출연·정관", "설립허가"],
      registrationDeadline: "허가 후 3주 이내",
      registrableMatters: ["목적·기본재산·임원·주사무소"],
      lawyerScope: ["설립·변경·해산 등기", "관련 부동산 등기(별도)"],
      excludedScope: ["종교 행정", "기부금·세무"],
      lastLegalReview: "2026-07-29",
    },
  },
  {
    slug: "국제교류단체사단법인설립",
    kind: "intent",
    title: "국제교류단체 사단법인 설립",
    metaTitle: "국제교류단체 사단법인 설립｜허가·정관·설립등기",
    metaDescription:
      "국제교류·자매도시·유학생·문화교류 단체 사단법인 설립. 주무관청 허가 후 등기 — 다옴법무사.",
    h1: "국제교류단체 사단법인 — 목적과 주무관청부터 확인하세요",
    eyebrow: "국제교류 · 사단법인",
    heroIntro:
      "국제교류·문화교류·유학생·해외동포·자매도시 관련 단체는 사단법인으로 법인화하는 경우가 많습니다.",
    heroParagraphs: [
      "부산은 항만·관광·국제행사 관련으로 국제교류 단체 설립 문의가 있습니다. 목적에 따라 외교·문화·교육·지자체 주무관청이 달라질 수 있습니다.",
      "외국인 회원·해외 사무소가 있으면 정관·등기사항 기재를 특히 신중히 해야 합니다. 비자·출입국은 별도 영역입니다.",
    ],
    officeLine: SPECIAL_ENTITY_OFFICE_LINE,
    scopeNotice: SPECIAL_ENTITY_SCOPE_NOTICE,
    conclusion:
      "국제교류단체 사단법인은 주무관청 허가 후 3주 이내 설립등기합니다. 법무사는 허가 이후 등기를 지원합니다.",
    primaryKeyword: "국제교류단체 사단법인 설립",
    secondaryKeywords: [
      "국제교류 법인",
      "문화교류 사단법인",
      "유학생 단체 법인",
      "부산 국제교류 단체",
    ],
    questionKeywords: ["국제교류단체 법인 설립"],
    searchIntent: "국제교류 단체의 사단법인 설립을 확인하려는 검색",
    whoNeedsThis: [
      "국제·문화 교류 협회·단체",
      "유학생·동포·자매도시 관련 단체",
    ],
    whenAndDeadline: ["허가 후 3주 이내"],
    decisionBodies: ["창립총회", "주무관청"],
    documents: ["허가서", "정관", "회원·발기인 명부", "의사록"],
    procedures: ["목적·주무관청 확인", "허가", "설립등기"],
    costFactors: ["회원·임원", "해외 요소"],
    penaltyRisks: ["관할 오류", "등기 지연"],
    commonConfusions: ["비영리민간단체와 혼동", "외국법인과 혼동"],
    diyErrors: ["목적 조항 과다·불명확"],
    faqs: [],
    relatedLinks: [
      { href: "/부산사단법인설립", label: "부산 사단법인 설립" },
      { href: "/문화예술단체사단법인설립", label: "문화예술단체" },
      { href: "/협회사단법인설립", label: "협회 사단법인" },
      ...baseSpecialRelated,
    ],
    ctaTitle: "국제교류단체 법인 설립 상담",
    ctaText: "교류 목적과 회원 구성을 알려주시면 허가·등기 단계를 확인할 수 있습니다.",
  },
];
