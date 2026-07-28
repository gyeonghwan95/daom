import type { SpecialEntityPageContent } from "../types";
import {
  SPECIAL_ENTITY_HUB_LINKS,
  SPECIAL_ENTITY_OFFICE_LINE,
  SPECIAL_ENTITY_SCOPE_NOTICE,
  baseSpecialRelated,
} from "./shared";

export const specialEntityComparisonPages: SpecialEntityPageContent[] = [
  {
    slug: "사단법인과재단법인차이",
    kind: "comparison",
    title: "사단법인과 재단법인 차이",
    metaTitle: "사단법인과 재단법인 차이｜회원 중심 단체와 재산 중심 조직의 선택 기준",
    metaDescription:
      "사단법인 vs 재단법인. 회원·출연재산·의사결정·설립 구조·등기 차이. 협회·장학·복지 단체 선택 — 다옴법무사.",
    h1: "사단법인과 재단법인 차이 — 회원형과 재산형 중 무엇이 맞을까요",
    eyebrow: "법인 유형 비교",
    heroIntro:
      "둘 다 민법상 비영리법인이지만, 회원 중심인지 출연재산 중심인지에 따라 설립·운영 구조가 달라집니다.",
    heroParagraphs: [
      "협회·학회·단체처럼 회원이 모여 운영하면 사단법인, 가족·기업 출연으로 장학·복지·문화 사업을 하면 재단법인이 검토 대상이 됩니다.",
      "어느 쪽이든 주무관청 설립허가 후 설립등기가 필요하며, 법무사는 등기 단계를 지원합니다.",
    ],
    officeLine: SPECIAL_ENTITY_OFFICE_LINE,
    scopeNotice: SPECIAL_ENTITY_SCOPE_NOTICE,
    conclusion:
      "사단법인은 회원·총회 중심, 재단법인은 출연재산·기본재산·이사회 중심입니다. 단체 목적·구성원·재산 구조에 맞는 형태를 선택한 뒤 허가·등기 절차를 진행하세요.",
    primaryKeyword: "사단법인과 재단법인 차이",
    secondaryKeywords: [
      "사단법인 재단법인 비교",
      "비영리법인 종류",
      "협회 재단 선택",
      "회원형 법인",
    ],
    questionKeywords: [
      "사단법인 재단법인 뭐가 다름",
      "협회는 사단 재단",
      "출연 조직 법인",
    ],
    searchIntent: "사단법인과 재단법인 중 자신의 조직에 맞는 형태를 선택하려는 검색",
    whoNeedsThis: [
      "법인 유형을 아직 정하지 못한 발기인",
      "협회인지 재단인지 고민하는 단체",
      "출연재산만 있고 회원 조직이 없는 경우",
    ],
    whenAndDeadline: [
      "선택 후 각각 설립허가·등기 절차 진행",
      "허가 후 3주 이내 설립등기(공통)",
    ],
    decisionBodies: [
      "사단법인: 회원·총회·이사회",
      "재단법인: 출연자·이사회·감사",
    ],
    documents: [
      "사단: 회원·발기인 명부, 창립총회 의사록",
      "재단: 기본재산 목록, 출연 증빙",
      "공통: 정관, 설립허가서, 임원 서류",
    ],
    procedures: [
      "목적·회원·재산 구조 분석",
      "법인 유형 결정",
      "정관·허가",
      "설립등기",
    ],
    costFactors: ["재단 기본재산 가액", "회원·임원 규모"],
    penaltyRisks: ["잘못된 유형 선택 후 정관 전면 개정"],
    commonConfusions: [
      "사단법인에도 출연만으로 운영 가능한지 혼동",
      "재단에도 회원을 두는 구조 혼동",
    ],
    diyErrors: ["목적에 맞지 않는 유형 선택", "기본재산 요건 간과"],
    faqs: [
      {
        question: "둘 다 수익사업이 가능한가요?",
        answer:
          "비영리 목적 범위 내 수익사업이 가능한 경우가 있으나, 잉여금 배분 제한 등 정관·법률을 확인해야 합니다.",
      },
    ],
    relatedLinks: [
      { href: "/부산사단법인설립", label: "부산 사단법인 설립" },
      { href: "/부산재단법인설립", label: "부산 재단법인 설립" },
      { href: "/장학재단설립", label: "장학재단 설립" },
      ...baseSpecialRelated,
    ],
    ctaTitle: "법인 유형 선택 상담",
    ctaText:
      "단체 목적·회원·재산 구조를 알려주시면 사단·재단 중 적합한 형태를 함께 검토할 수 있습니다.",
    comparisonSummary: [
      "사단법인: 회원을 구성원으로 하는 단체형",
      "재단법인: 출연재산을 기본재산으로 하는 재산형",
      "공통: 주무관청 허가 후 설립등기",
    ],
    comparisonPoints: [
      {
        aspect: "구성 기반",
        optionA: "회원·발기인(사단법인)",
        optionB: "출연재산·기본재산(재단법인)",
      },
      {
        aspect: "의사결정",
        optionA: "총회·이사회 중심",
        optionB: "이사회·감사 중심",
      },
      {
        aspect: "적합한 조직",
        optionA: "협회·학회·체육·복지 단체",
        optionB: "장학·문화·복지·기념 재단",
      },
      {
        aspect: "설립 핵심 서류",
        optionA: "회원 명부·창립총회",
        optionB: "기본재산 목록·출연 증빙",
      },
      {
        aspect: "설립 방식",
        optionA: "주무관청 허가 후 등기",
        optionB: "주무관청 허가 후 등기",
      },
      {
        aspect: "등기 기한",
        optionA: "허가 후 3주 이내",
        optionB: "허가 후 3주 이내",
      },
    ],
  },
  {
    slug: "비영리민간단체와사단법인차이",
    kind: "comparison",
    title: "비영리민간단체와 사단법인 차이",
    metaTitle: "비영리민간단체와 사단법인 차이｜등록 단체와 법인격",
    metaDescription:
      "비영리민간단체 등록 vs 사단법인 설립. 법인격·세무·대외 거래·등기 차이. 임의단체 법인화 — 다옴법무사.",
    h1: "비영리민간단체와 사단법인 — 등록과 설립등기는 다릅니다",
    eyebrow: "법인 유형 비교",
    heroIntro:
      "비영리민간단체는 주무관청에 설립등록을 하지만 법인격이 없고, 사단법인은 등기로 법인격을 취득합니다.",
    heroParagraphs: [
      "비영리민간단체 지원법에 따른 등록은 행정 신고에 가깝고, 사단법인은 민법상 비영리법인으로 설립허가·설립등기가 필요합니다.",
      "대외 계약·부동산 취득·책임 구조에 따라 어느 형태가 적합한지 달라집니다.",
    ],
    officeLine: SPECIAL_ENTITY_OFFICE_LINE,
    scopeNotice: SPECIAL_ENTITY_SCOPE_NOTICE,
    conclusion:
      "비영리민간단체는 법인격이 없는 등록 단체이고, 사단법인은 법인격 있는 비영리법인입니다. 법인화가 필요하면 사단법인 설립등기를 검토하세요.",
    primaryKeyword: "비영리민간단체와 사단법인 차이",
    secondaryKeywords: [
      "비영리민간단체 등록",
      "임의단체 법인화",
      "비영리단체 법인",
      "사단법인 설립",
    ],
    questionKeywords: [
      "비영리민간단체 법인격",
      "단체 등록과 법인",
      "협회 등록 차이",
    ],
    searchIntent: "비영리민간단체와 사단법인 중 선택하려는 검색",
    whoNeedsThis: [
      "등록 단체를 운영 중인 비영리 단체",
      "법인격이 필요해진 동호회·협회",
      "임의단체와 법인 차이를 알고 싶은 경우",
    ],
    whenAndDeadline: [
      "민간단체: 설립등록(신고성)",
      "사단법인: 허가 후 3주 이내 설립등기",
    ],
    decisionBodies: [
      "민간단체: 정관·운영위원회",
      "사단법인: 총회·이사회",
    ],
    documents: [
      "민간단체: 설립등록 신청서·정관",
      "사단법인: 설립허가서·등기 서류",
    ],
    procedures: [
      "현재 단체 형태·목적 확인",
      "법인격 필요 여부 판단",
      "사단법인 설립 시 허가·등기",
    ],
    costFactors: ["법인화 시 등기·허가 비용"],
    penaltyRisks: ["법인격 없이 법인 명칭 사용"],
    commonConfusions: [
      "민간단체 등록=법인 설립으로 오인",
      "등록만으로 부동산 명의 취득 가능하다고 가정",
    ],
    diyErrors: ["법인격 없이 ‘○○법인’ 명칭 사용", "등록·등기 절차 혼동"],
    faqs: [
      {
        question: "민간단체에서 사단법인으로 전환할 수 있나요?",
        answer:
          "새로 사단법인을 설립하고 단체·재산을 이전하는 방식으로 진행하는 경우가 많습니다. 사안별로 정관·재산 이전을 검토해야 합니다.",
      },
    ],
    relatedLinks: [
      { href: "/부산사단법인설립", label: "부산 사단법인 설립" },
      SPECIAL_ENTITY_HUB_LINKS.compareAssociationFoundation,
      ...baseSpecialRelated,
    ],
    ctaTitle: "단체 형태 선택 상담",
    ctaText:
      "현재 단체 운영 형태와 목적을 알려주시면 등록·법인화 방향을 확인할 수 있습니다.",
    comparisonSummary: [
      "비영리민간단체: 법인격 없음, 설립등록",
      "사단법인: 법인격 있음, 허가·설립등기",
      "법무사 업무: 사단법인 설립·변경 등기",
    ],
    comparisonPoints: [
      {
        aspect: "법인격",
        optionA: "없음(비영리민간단체)",
        optionB: "있음(사단법인)",
      },
      {
        aspect: "근거 법률",
        optionA: "비영리민간단체 지원법",
        optionB: "민법",
      },
      {
        aspect: "설립 방식",
        optionA: "주무관청 설립등록(신고)",
        optionB: "설립허가 후 설립등기",
      },
      {
        aspect: "대외 거래",
        optionA: "대표자·단체 명의(법인 아님)",
        optionB: "법인 명의·등기부",
      },
      {
        aspect: "법무사 등기 업무",
        optionA: "해당 없음(등록은 행정)",
        optionB: "설립·변경·해산 등기",
      },
      {
        aspect: "적합한 경우",
        optionA: "가벼운 비영리 활동·등록만으로 충분",
        optionB: "법인격·재산·대외 신뢰 필요",
      },
    ],
    legalProfile: {
      entityName: "비영리민간단체 vs 사단법인",
      legalBasis: [
        "비영리민간단체 지원법",
        "민법 제32조·제37조",
      ],
      establishmentMethod:
        "민간단체: 설립등록 / 사단법인: 설립허가 후 설립등기",
      competentAuthority: ["목적별 주무관청"],
      preRegistrationSteps: ["정관·목적 확인", "형태 선택"],
      registrationDeadline:
        "사단법인: 허가 후 3주 이내 등기",
      registrableMatters: ["사단법인: 법인 등기사항"],
      lawyerScope: ["사단법인 설립·변경 등기"],
      excludedScope: ["민간단체 설립등록(행정 신고)"],
      lastLegalReview: "2026-07-28",
    },
  },
];
