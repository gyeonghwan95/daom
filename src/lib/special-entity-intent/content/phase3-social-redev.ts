import type { SpecialEntityPageContent } from "../types";
import {
  SPECIAL_ENTITY_OFFICE_LINE,
  SPECIAL_ENTITY_SCOPE_NOTICE,
  baseSpecialRelated,
} from "./shared";

export const phase3SocialEconomyPages: SpecialEntityPageContent[] = [
  {
    slug: "사회적기업과법인설립차이",
    kind: "comparison",
    title: "사회적기업과 법인 설립 차이",
    metaTitle: "사회적기업과 법인 설립 차이｜인증·지정 vs 설립등기",
    metaDescription:
      "사회적기업 인증 vs 법인 설립등기. 주식회사·협동조합·사회적협동조합 선택 — 다옴법무사.",
    h1: "사회적기업 ≠ 법인 종류 — 인증과 설립을 나누세요",
    eyebrow: "사회적경제 · 비교",
    heroIntro:
      "사회적기업은 인증·지정 제도이고, 법인 설립은 상법·협동조합법·민법 등에 따른 별도 절차입니다.",
    heroParagraphs: [
      "먼저 주식회사·협동조합·사회적협동조합·사단법인 등 법인 형태를 정한 뒤, 필요하면 사회적기업·예비사회적기업 인증을 신청합니다. 인증만으로 법인격이 생기지 않습니다.",
    ],
    officeLine: SPECIAL_ENTITY_OFFICE_LINE,
    scopeNotice: SPECIAL_ENTITY_SCOPE_NOTICE,
    conclusion:
      "법인 설립등기와 사회적기업 인증은 순서·주체·서류가 모두 다릅니다. 법무사는 등기 단계를 지원합니다.",
    primaryKeyword: "사회적기업과 법인 설립 차이",
    secondaryKeywords: [
      "사회적기업 인증",
      "예비사회적기업",
      "소셜벤처 법인",
    ],
    questionKeywords: ["사회적기업 법인 설립"],
    searchIntent: "사회적기업과 법인 설립의 관계를 이해하려는 검색",
    whoNeedsThis: ["사회적 목적 창업·단체"],
    whenAndDeadline: ["법인 설립 후 인증 신청(일반적)"],
    decisionBodies: ["해당 없음"],
    documents: ["법인 설립 vs 인증 신청 서류"],
    procedures: ["법인 선택·설립", "인증(선택)"],
    costFactors: ["법인 유형"],
    penaltyRisks: ["인증=설립 오인"],
    commonConfusions: ["사회적기업=사회적협동조합"],
    diyErrors: ["인증만 받고 법인 미설립"],
    faqs: [],
    relatedLinks: [
      { href: "/사회적기업과사회적협동조합차이", label: "사회적기업 vs 사회적협동조합" },
      { href: "/부산사회적협동조합설립", label: "사회적협동조합" },
      ...baseSpecialRelated,
    ],
    ctaTitle: "법인 형태·등기 상담",
    ctaText: "사업 구조와 인증 계획을 알려주세요.",
    comparisonPoints: [
      { aspect: "성격", optionA: "사회적기업: 인증·지정", optionB: "법인 설립: 등기로 법인격" },
      { aspect: "근거", optionA: "사회적기업 육성법 등", optionB: "상법·협동조합법·민법" },
      { aspect: "법무사", optionA: "등기(선행 법인 기준)", optionB: "설립·변경 등기" },
      { aspect: "순서", optionA: "보통 법인 설립 후 인증", optionB: "설립등기 선행" },
    ],
  },
  {
    slug: "재단법인과공익법인차이",
    kind: "comparison",
    title: "재단법인과 공익법인 차이",
    metaTitle: "재단법인과 공익법인 차이｜민법 재단 vs 공익법인법",
    metaDescription:
      "민법 재단법인 vs 공익법인 등에 관한 법률. 설립·운영·세제 구분 — 다옴법무사.",
    h1: "재단법인 vs 공익법인 — 근거법이 다릅니다",
    eyebrow: "법인 유형 · 비교",
    heroIntro:
      "재단법인은 민법상 비영리법인이고, 공익법인은 공익법인 등에 관한 법률상 별도 제도입니다.",
    heroParagraphs: [
      "2024년 이후 공익법인 제도가 정비되었습니다. 설립 시점·목적·기존 재단·공익 지정 여부에 따라 선택이 달라질 수 있습니다. 세제·기부금은 별도 전문 확인이 필요합니다.",
    ],
    officeLine: SPECIAL_ENTITY_OFFICE_LINE,
    scopeNotice: SPECIAL_ENTITY_SCOPE_NOTICE,
    conclusion:
      "공익 목적이라도 반드시 공익법인일 필요는 없으며, 재단법인·공익법인 중 법령과 목적에 맞는 형태를 선택하세요.",
    primaryKeyword: "재단법인과 공익법인 차이",
    secondaryKeywords: ["공익법인 재단", "공익 목적 법인"],
    questionKeywords: ["재단 공익법인 차이"],
    searchIntent: "재단법인과 공익법인을 비교하려는 검색",
    whoNeedsThis: ["공익·복지·장학 재단 설립자"],
    whenAndDeadline: ["유형별 허가·인가 후 등기"],
    decisionBodies: ["설립위원회", "주무관청"],
    documents: ["유형별 정관·허가"],
    procedures: ["유형 선택", "허가·인가", "등기"],
    costFactors: ["기본재산"],
    penaltyRisks: ["제도 혼동"],
    commonConfusions: ["공익=재단"],
    diyErrors: ["구 제도 기준 적용"],
    faqs: [],
    relatedLinks: [
      { href: "/공익법인설립등기", label: "공익법인 설립" },
      { href: "/부산재단법인설립", label: "재단법인" },
      { href: "/사단법인과재단법인차이", label: "사단 vs 재단" },
      ...baseSpecialRelated,
    ],
    ctaTitle: "재단·공익 법인 선택 상담",
    ctaText: "목적과 출연 구조를 알려주세요.",
    comparisonPoints: [
      { aspect: "근거", optionA: "민법(재단법인)", optionB: "공익법인 등에 관한 법률" },
      { aspect: "구조", optionA: "출연·기본재산 중심", optionB: "공익법률상 요건" },
      { aspect: "설립", optionA: "주무관청 허가", optionB: "법률상 인가·허가" },
      { aspect: "세무", optionA: "별도 확인", optionB: "별도 확인" },
      { aspect: "법무사", optionA: "허가 후 등기", optionB: "인가 후 등기" },
    ],
  },
];

export const phase3RedevelopmentPages: SpecialEntityPageContent[] = [
  {
    slug: "재건축조합임원변경등기",
    kind: "intent",
    title: "재건축조합 임원변경등기",
    metaTitle: "재건축조합 임원변경등기｜총회 결의와 등기만 안내",
    metaDescription:
      "재건축조합·정비사업조합 임원 변경등기. 도시정비법 결의 후 등기 — 법무사는 등기만 — 다옴법무사.",
    h1: "재건축조합 임원변경 — 정비사업과 등기를 구분하세요",
    eyebrow: "정비조합 · 변경등기",
    heroIntro:
      "재건축·재개발 조합의 임원 변경은 도시 및 주거환경정비법상 절차와 조합 정관·등기가 연동됩니다.",
    heroParagraphs: [
      "조합장·이사 등 임원이 바뀌면 총회·이사회 결의 후 등기사항을 변경해야 합니다. 사업 시행·인가·관리처분 등 정비사업 행정은 별도 전문 영역입니다.",
      "법무사는 등기부상 임원 변경등기와 관련 서류 작성·접수만 지원합니다. 정비사업 legal advice·소송·행정 대리는 하지 않습니다.",
    ],
    officeLine: SPECIAL_ENTITY_OFFICE_LINE,
    scopeNotice: `${SPECIAL_ENTITY_SCOPE_NOTICE} 재건축·재개발 사업 자체의 법률자문·행정 대리·분양·세무는 수행하지 않습니다.`,
    conclusion:
      "재건축조합 임원변경은 정관·법령에 따른 결의 후 등기해야 합니다. 등기사항증명서와 의사록을 기준으로 확인하세요.",
    primaryKeyword: "재건축조합 임원변경등기",
    secondaryKeywords: [
      "재개발조합 임원변경",
      "정비사업조합 등기",
      "조합장 변경등기",
    ],
    questionKeywords: ["재건축조합 임원 바뀌면"],
    searchIntent: "재건축·재개발 조합 임원 변경 등기를 확인하려는 검색",
    whoNeedsThis: ["임원이 교체된 재건축·재개발 조합"],
    whenAndDeadline: ["결의 후 등기 기한(정관·법령)"],
    decisionBodies: ["총회·이사회"],
    documents: ["등기부", "의사록", "취임·사임 서류", "정관"],
    procedures: ["결의", "임원변경등기"],
    costFactors: ["사임·취임 동시"],
    penaltyRisks: ["등기부 불일치"],
    commonConfusions: ["정비사업 행정=등기"],
    diyErrors: ["결의 요건 미충족"],
    faqs: [
      {
        question: "정비사업조합 설립등기도 하나요?",
        answer:
          "설립·변경 등기 수요가 있으나 사업 단계·인가와 맞물립니다. 등기만 필요한 경우 등기부·인가서를 기준으로 확인합니다.",
      },
    ],
    relatedLinks: [
      { href: "/비영리법인임원변경등기", label: "비영리법인 임원변경" },
      ...baseSpecialRelated,
    ],
    ctaTitle: "조합 임원변경 등기 상담",
    ctaText: "등기사항증명서와 결의 서류를 알려주세요. 정비사업 자문은 해당하지 않습니다.",
    legalProfile: {
      entityName: "재건축·재개발 등 정비사업조합",
      legalBasis: ["도시 및 주거환경정비법", "정관"],
      establishmentMethod: "조합 설립·변경 절차 후 등기(해당 시)",
      competentAuthority: ["정비사업 행정: 시·도·구", "등기: 관할 등기소"],
      preRegistrationSteps: ["총회·이사회 결의"],
      registrationDeadline: "결의 후 정관·법령 기한",
      registrableMatters: ["임원·대표·주사무소 등"],
      lawyerScope: ["임원·주소 등 변경등기", "관련 서류"],
      excludedScope: [
        "정비사업 인가·시행",
        "분양·관리처분",
        "소송·행정 대리",
      ],
      lastLegalReview: "2026-07-29",
      regionalNotes: ["부산·경남 정비구역 조합"],
    },
  },
];
