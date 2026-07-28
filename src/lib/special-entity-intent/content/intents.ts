import type { SpecialEntityPageContent } from "../types";
import {
  SPECIAL_ENTITY_HUB_LINKS,
  SPECIAL_ENTITY_OFFICE_LINE,
  SPECIAL_ENTITY_SCOPE_NOTICE,
  baseSpecialRelated,
} from "./shared";

export const specialEntityIntentPages: SpecialEntityPageContent[] = [
  {
    slug: "부산사단법인설립",
    kind: "intent",
    title: "부산 사단법인 설립",
    metaTitle: "부산 사단법인 설립｜협회·학회 법인화 전 확인할 허가와 등기 절차",
    metaDescription:
      "부산 사단법인 설립허가·창립총회·설립등기. 주무관청·정관·임원 구성, 허가 후 3주 이내 등기 — 다옴법무사.",
    h1: "부산 사단법인 설립 — 협회·학회·단체의 허가와 등기를 단계별로",
    eyebrow: "사단법인 · 설립",
    heroIntro:
      "사단법인은 회원을 기본으로 하는 비영리법인으로, 협회·학회·문화·체육·복지 단체가 법인화할 때 많이 선택합니다.",
    heroParagraphs: [
      "민법 제32조에 따라 주무관청 설립허가를 받은 뒤 설립등기를 해야 합니다. 부산에 주사무소를 두는 경우 관할 주무관청은 정관상 목적·사업에 따라 부산광역시, 구·군, 교육청 등으로 달라집니다.",
      "법무사는 허가 후 설립등기 서류 작성·검토·접수를 지원합니다. 허가 신청·심사는 발기인·단체와 주무관청 간 행정 절차입니다.",
    ],
    officeLine: SPECIAL_ENTITY_OFFICE_LINE,
    scopeNotice: SPECIAL_ENTITY_SCOPE_NOTICE,
    conclusion:
      "부산 사단법인 설립은 주무관청 설립허가 후 3주 이내 설립등기가 필요합니다(민법 시행령 제4조). 창립총회에서 정관 확정·임원 선임 후 등기서류를 준비합니다.",
    primaryKeyword: "부산 사단법인 설립",
    secondaryKeywords: [
      "사단법인 설립허가",
      "사단법인 창립총회",
      "협회 사단법인",
      "부산 협회 법인설립",
    ],
    questionKeywords: [
      "사단법인 설립 절차",
      "사단법인 주무관청",
      "사단법인 설립등기 기한",
    ],
    searchIntent: "부산에서 협회·학회·단체를 사단법인으로 설립하려는 검색",
    whoNeedsThis: [
      "임의단체·동호회를 법인화하려는 협회",
      "업종별·종목별 협회 설립을 검토하는 경우",
      "문화·체육·교육·복지 목적의 단체",
    ],
    whenAndDeadline: [
      "설립허가 후 3주 이내 설립등기",
      "창립총회는 허가 전·후 일정을 주무관청과 조율",
    ],
    decisionBodies: [
      "창립총회: 정관 확정·임원 선임",
      "이사회·총회: 정관에 따른 운영",
    ],
    documents: [
      "설립허가 신청서·정관(안)",
      "설립허가서",
      "창립총회 의사록",
      "회원·발기인 명부",
      "임원 취임승낙서·인감증명서",
      "주사무소 사용권 증빙",
    ],
    procedures: [
      "목적·주무관청 확인 및 정관 작성",
      "설립허가 신청",
      "창립총회 개최",
      "관할 등기소 설립등기",
    ],
    costFactors: ["임원 수", "정관 복잡도", "보정 횟수"],
    penaltyRisks: ["허가 후 등기 기한 경과"],
    commonConfusions: [
      "비영리민간단체 등록과 혼동",
      "회원 2명으로 설립 가능 여부(정관·목적별 검토)",
    ],
    anonymousCase:
      "부산 수영구 소재 체육단체가 협회 법인화를 위해 사단법인 설립을 진행했으나, 허가 전 창립총회 일정과 정관 초안이 맞지 않아 보정이 반복되었습니다. 허가 확정 후 등기 서류를 정리해 설립등기를 완료했습니다.",
    diyErrors: ["허가 없이 등기", "정관 필수 조항 누락", "임원 자격 미충족"],
    faqs: [
      {
        question: "사단법인 최소 회원 수가 있나요?",
        answer:
          "민법상 일정 인원 요건이 있으나, 목적·주무관청 지침·정관에 따라 실무 요건이 달라질 수 있습니다. 설립 전 정관과 주무관청 안내를 확인하는 것이 좋습니다.",
      },
      {
        question: "재단법인과 어떻게 다른가요?",
        answer: "`/사단법인과재단법인차이` 페이지에서 회원 중심·재산 중심 구조 차이를 비교할 수 있습니다.",
      },
    ],
    relatedLinks: [
      SPECIAL_ENTITY_HUB_LINKS.nonprofit,
      { href: "/협회사단법인설립", label: "협회 사단법인 설립" },
      { href: "/부산협회단체법인설립", label: "부산 협회·단체 법인설립" },
      SPECIAL_ENTITY_HUB_LINKS.permitThenRegistry,
      SPECIAL_ENTITY_HUB_LINKS.compareAssociationFoundation,
      ...baseSpecialRelated,
    ],
    ctaTitle: "부산 사단법인 설립 상담",
    ctaText:
      "설립하려는 단체의 목적과 회원 구성만 알려주셔도 허가·등기 단계를 확인할 수 있습니다.",
    legalProfile: {
      entityName: "사단법인",
      legalBasis: ["민법 제32조·제37조", "민법 시행령 제3조·제4조"],
      establishmentMethod: "주무관청 설립허가 후 설립등기",
      competentAuthority: [
        "목적별 주무관청(부산광역시·구·군·교육청 등)",
        "설립등기: 주사무소 관할 등기소",
      ],
      preRegistrationSteps: [
        "정관 작성",
        "설립허가 신청",
        "창립총회",
        "임원 구성",
      ],
      registrationDeadline: "설립허가 후 3주 이내",
      registrableMatters: ["목적·명칭·주사무소·임원·대표권"],
      lawyerScope: ["허가 후 설립등기", "정관·등기부 정합성 검토"],
      excludedScope: ["설립허가 대리 보장", "세무·기부금 지정"],
      lastLegalReview: "2026-07-28",
      regionalNotes: ["부산 소재 주사무소 → 부산지방법원 등기국 등"],
    },
  },
  {
    slug: "부산재단법인설립",
    kind: "intent",
    title: "부산 재단법인 설립",
    metaTitle: "부산 재단법인 설립등기｜출연재산·정관·임원 구성에서 자주 막히는 부분",
    metaDescription:
      "부산 재단법인 설립. 기본재산·출연재산, 설립허가, 임원·정관, 허가 후 설립등기 — 다옴법무사.",
    h1: "부산 재단법인 설립 — 출연재산과 기본재산부터 정리하세요",
    eyebrow: "재단법인 · 설립",
    heroIntro:
      "재단법인은 출연된 재산을 기본재산으로 하여 목적 사업을 수행하는 비영리법인입니다.",
    heroParagraphs: [
      "장학·문화·복지·연구·지역발전 등 재산을 기반으로 운영하는 조직에 적합합니다. 설립허가 시 기본재산 귀속·정관·이사·감사 구성이 핵심입니다.",
      "부산 소재 재단법인은 주무관청 허가 후 관할 등기소에 설립등기합니다.",
    ],
    officeLine: SPECIAL_ENTITY_OFFICE_LINE,
    scopeNotice: SPECIAL_ENTITY_SCOPE_NOTICE,
    conclusion:
      "재단법인 설립은 출연재산의 기본재산 귀속과 설립허가 후 3주 이내 설립등기가 필요합니다. 법무사는 등기 단계 서류를 지원하며, 출연 계약·세무는 별도 확인이 필요합니다.",
    primaryKeyword: "부산 재단법인 설립",
    secondaryKeywords: [
      "재단법인 설립등기",
      "재단법인 기본재산",
      "출연재산 재단법인",
      "부산 재단 설립",
    ],
    questionKeywords: [
      "재단법인 설립 절차",
      "재단법인 최소 재산",
      "재단법인 정관",
    ],
    searchIntent: "부산에서 재단법인을 설립하려는 출연자·발기인의 검색",
    whoNeedsThis: [
      "가족·기업이 장학·복지 재단을 설립하려는 경우",
      "문화·예술·지역발전 목적의 재단",
      "출연재산 중심 조직",
    ],
    whenAndDeadline: ["설립허가 후 3주 이내 설립등기"],
    decisionBodies: ["설립위원회·이사회·출연자(정관·절차에 따름)"],
    documents: [
      "설립허가 신청서·정관",
      "기본재산 목록·출연 증빙",
      "설립허가서",
      "이사·감사 취임승낙서",
      "주사무소 증빙",
    ],
    procedures: [
      "목적·기본재산·정관 설계",
      "설립허가 신청",
      "출연재산 귀속",
      "설립등기",
    ],
    costFactors: ["기본재산 가액(등록면허세)", "출연재산 종류"],
    penaltyRisks: ["기본재산 미귀속", "등기 기한 경과"],
    commonConfusions: [
      "사단법인과 재산 구조 혼동",
      "출연과 기부금 공제 혼동(세무 별도)",
    ],
    anonymousCase:
      "부산 해운대 소재 가족 출연 장학재단이 기본재산 증빙과 이사 구성에서 지연되었으나, 허가 후 등기 서류를 정리해 설립등기를 마쳤습니다.",
    diyErrors: ["기본재산 목록 누락", "감사 미선임", "출연 재산 권리 미정리"],
    faqs: [
      {
        question: "장학재단도 재단법인인가요?",
        answer:
          "장학 목적 재단은 보통 민법상 재단법인 형태로 설립합니다. `/장학재단설립` 페이지를 참고하세요.",
      },
    ],
    relatedLinks: [
      { href: "/장학재단설립", label: "장학재단 설립" },
      SPECIAL_ENTITY_HUB_LINKS.compareAssociationFoundation,
      SPECIAL_ENTITY_HUB_LINKS.nonprofit,
      SPECIAL_ENTITY_HUB_LINKS.permitThenRegistry,
      ...baseSpecialRelated,
    ],
    ctaTitle: "부산 재단법인 설립 상담",
    ctaText:
      "출연재산·정관·임원 구성이 준비되었다면 설립등기 서류부터 검토할 수 있습니다.",
    legalProfile: {
      entityName: "재단법인",
      legalBasis: ["민법 제32조·제42조", "민법 시행령 제3조·제4조"],
      establishmentMethod: "주무관청 설립허가 후 설립등기",
      competentAuthority: ["목적별 주무관청", "주사무소 관할 등기소"],
      preRegistrationSteps: [
        "정관·기본재산 설계",
        "출연",
        "설립허가",
        "임원 구성",
      ],
      registrationDeadline: "설립허가 후 3주 이내",
      registrableMatters: ["목적·명칭·주사무소·기본재산·임원"],
      lawyerScope: ["설립등기 서류", "등기 접수 대리"],
      excludedScope: ["출연재산 세무", "기부금 공제"],
      lastLegalReview: "2026-07-28",
    },
  },
  {
    slug: "부산사회적협동조합설립",
    kind: "intent",
    title: "부산 사회적협동조합 설립",
    metaTitle: "사회적협동조합 인가 후 설립등기｜기한과 준비서류를 놓치지 않으려면",
    metaDescription:
      "부산 사회적협동조합 설립. 행정안전부 장관 인가, 인가 후 1월 이내 설립등기, 정관·조합원 — 다옴법무사.",
    h1: "부산 사회적협동조합 설립 — 인가와 등기를 구분하세요",
    eyebrow: "사회적협동조합 · 설립",
    heroIntro:
      "사회적협동조합은 사회적협동조합법에 따른 조합으로, 설립 인가 후 별도로 법인 설립등기를 해야 합니다.",
    heroParagraphs: [
      "일반협동조합과 달리 행정안전부 장관의 설립 인가가 필요합니다(사회적협동조합법 제13조). 인가 후 1월 이내 설립등기를 해야 합니다(제15조).",
      "사회적기업 인증·지정과 법인 설립은 별개입니다. 인증 없이도 사회적협동조합 법인 설립이 가능한 구조인지 법률과 목적을 함께 확인해야 합니다.",
    ],
    officeLine: SPECIAL_ENTITY_OFFICE_LINE,
    scopeNotice: SPECIAL_ENTITY_SCOPE_NOTICE,
    conclusion:
      "부산 사회적협동조합은 설립 인가 후 1월 이내 설립등기가 필요합니다. 법무사는 인가 이후 등기와 서류 작성·접수를 지원하며, 인가 신청은 조합 설립 준비위원회의 행정 절차입니다.",
    primaryKeyword: "부산 사회적협동조합 설립",
    secondaryKeywords: [
      "사회적협동조합 인가",
      "사회적협동조합 설립등기",
      "사회적협동조합 정관",
    ],
    questionKeywords: [
      "사회적협동조합 설립 절차",
      "사회적협동조합 등기 기한",
      "사회적기업과 차이",
    ],
    searchIntent: "사회적협동조합 인가 후 등기 절차를 확인하려는 검색",
    whoNeedsThis: [
      "돌봄·문화·교육·지역사회 목적의 협동조합",
      "인가를 받고 등기를 준비하는 조합",
      "사회적기업과 협동조합 중 선택을 고민하는 경우",
    ],
    whenAndDeadline: ["인가일부터 1월 이내 설립등기(사회적협동조합법 제15조)"],
    decisionBodies: ["창립총회·총회·이사회"],
    documents: [
      "설립 인가서",
      "정관",
      "창립총회 의사록",
      "조합원 명부·출자 증빙",
      "임원 취임승낙서",
    ],
    procedures: [
      "설립 인가 신청",
      "인가 후 창립총회",
      "설립등기",
    ],
    costFactors: ["조합원 수", "출자금", "정관"],
    penaltyRisks: ["인가 후 등기 기한 경과"],
    commonConfusions: [
      "사회적기업 인증과 혼동",
      "일반협동조합과 인가 요건 혼동",
    ],
    diyErrors: ["인가 전 등기", "사회적 목적 요건 미충족"],
    faqs: [
      {
        question: "부산에서 인가 신청은 어디에 하나요?",
        answer:
          "사회적협동조합 설립 인가는 행정안전부 장관에게 신청합니다. 지역별 안내 창구는 법령·고시를 확인하세요.",
      },
    ],
    relatedLinks: [
      { href: "/부산협동조합설립등기", label: "일반협동조합 설립등기" },
      SPECIAL_ENTITY_HUB_LINKS.cooperative,
      SPECIAL_ENTITY_HUB_LINKS.master,
      ...baseSpecialRelated,
    ],
    ctaTitle: "사회적협동조합 설립등기 상담",
    ctaText: "인가서가 준비되어 있다면 설립등기 서류부터 검토할 수 있습니다.",
    legalProfile: {
      entityName: "사회적협동조합",
      legalBasis: ["사회적협동조합법"],
      establishmentMethod: "행정안전부 장관 설립 인가 후 설립등기",
      competentAuthority: [
        "설립 인가: 행정안전부 장관",
        "등기: 주사무소 관할 등기소",
      ],
      preRegistrationSteps: ["정관·사업계획", "설립 인가 신청", "창립총회"],
      registrationDeadline: "인가일부터 1월 이내(제15조)",
      registrableMatters: ["명칭·주사무소·임원·출자"],
      lawyerScope: ["인가 후 설립등기", "등기 서류"],
      excludedScope: ["설립 인가 대리 보장", "사회적기업 인증"],
      lastLegalReview: "2026-07-28",
      regionalNotes: ["부산 소재 주사무소 관할 등기소에 설립등기"],
    },
  },
  {
    slug: "부산협동조합설립등기",
    kind: "intent",
    title: "부산 협동조합 설립등기",
    metaTitle: "부산 협동조합 설립등기｜창립총회 후 2주 이내 등기",
    metaDescription:
      "부산 일반협동조합 설립등기. 창립총회·정관·출자금·조합원, 2주 이내 등기 기한 — 다옴법무사.",
    h1: "부산 협동조합 설립등기 — 창립총회 다음이 등기입니다",
    eyebrow: "협동조합 · 설립등기",
    heroIntro:
      "일반협동조합은 협동조합기본법에 따라 창립총회 후 별도 인가 없이 설립등기를 진행합니다.",
    heroParagraphs: [
      "부산에서 소상공인·프리랜서·지역주민·문화예술 등이 협동조합을 설립할 때, 창립총회일부터 2주 이내 설립등기를 해야 합니다(협동조합기본법 제12조).",
      "사회적협동조합은 인가가 필요하므로 `/부산사회적협동조합설립` 페이지와 절차가 다릅니다.",
    ],
    officeLine: SPECIAL_ENTITY_OFFICE_LINE,
    scopeNotice: SPECIAL_ENTITY_SCOPE_NOTICE,
    conclusion:
      "부산 협동조합 설립등기는 창립총회일부터 2주 이내 관할 등기소에 접수해야 합니다. 법무사는 정관·의사록·등기신청서 작성·접수를 지원합니다.",
    primaryKeyword: "부산 협동조합 설립등기",
    secondaryKeywords: [
      "협동조합 설립",
      "일반협동조합 설립",
      "협동조합 창립총회",
      "협동조합 정관",
    ],
    questionKeywords: [
      "협동조합 설립등기 기한",
      "협동조합 최소 조합원",
      "협동조합 출자금",
    ],
    searchIntent: "부산에서 일반협동조합 설립등기 절차를 확인하려는 검색",
    whoNeedsThis: [
      "소상공인·프리랜서 협동조합 창립",
      "지역주민·마을기업형 협동조합",
      "문화예술·돌봄 협동조합",
    ],
    whenAndDeadline: ["창립총회일부터 2주 이내 설립등기(제12조)"],
    decisionBodies: ["창립총회·총회·이사회"],
    documents: [
      "정관",
      "창립총회 의사록",
      "조합원 명부",
      "출자금 납입 증빙",
      "임원 취임승낙서",
      "주사무소 증빙",
    ],
    procedures: [
      "발기·정관 작성",
      "창립총회",
      "출자금 납입",
      "설립등기",
    ],
    costFactors: ["조합원 수", "출자금 총액"],
    penaltyRisks: ["2주 등기 기한 경과"],
    commonConfusions: [
      "사회적협동조합과 혼동",
      "주식회사와 출자 구조 혼동",
    ],
    diyErrors: ["출자 미납 상태 등기", "정관 필수 조항 누락"],
    faqs: [
      {
        question: "협동조합 최소 조합원 수는?",
        answer:
          "협동조합기본법상 조합원 수 요건이 있으므로, 창립 전 법령과 정관을 확인하세요.",
      },
    ],
    relatedLinks: [
      { href: "/부산사회적협동조합설립", label: "사회적협동조합 설립" },
      SPECIAL_ENTITY_HUB_LINKS.cooperative,
      ...baseSpecialRelated,
    ],
    ctaTitle: "협동조합 설립등기 상담",
    ctaText: "창립총회 의사록과 정관이 있다면 등기 서류 검토가 가능합니다.",
    legalProfile: {
      entityName: "협동조합",
      legalBasis: ["협동조합기본법"],
      establishmentMethod: "창립총회 후 설립등기(별도 설립 인가 없음)",
      competentAuthority: ["주사무소 관할 등기소"],
      preRegistrationSteps: ["정관 작성", "창립총회", "출자금 납입"],
      registrationDeadline: "창립총회일부터 2주 이내(제12조)",
      registrableMatters: ["명칭·주사무소·임원·출자"],
      lawyerScope: ["설립등기", "변경·해산 등기"],
      excludedScope: ["조합 사업 인허가", "노무·세무"],
      lastLegalReview: "2026-07-28",
    },
  },
  {
    slug: "부산농업회사법인설립",
    kind: "intent",
    title: "부산 농업회사법인 설립",
    metaTitle: "부산 농업회사법인 설립｜인증과 설립등기 순서",
    metaDescription:
      "부산·경남 농업회사법인 설립. 농림축산식품부 장관 인증, 인증 후 1월 이내 설립등기 — 다옴법무사.",
    h1: "부산 농업회사법인 설립 — 인증과 등기는 별도 단계입니다",
    eyebrow: "농업회사법인 · 설립",
    heroIntro:
      "농업회사법인은 농업회사법인육성에 관한 법률에 따른 법인으로, 인증 후 설립등기를 합니다.",
    heroParagraphs: [
      "농림축산식품부 장관의 인증을 받은 후 1월 이내 설립등기를 해야 합니다(농업회사법인육성법 제16조). 주식회사형·유한회사형 등 유형에 따라 정관·출자 구조가 다릅니다.",
      "농지 취득·세제 혜택·정책자금은 등기와 별도 영역이며, 해당 요건은 농림·세무 전문가와 확인이 필요합니다.",
    ],
    officeLine: SPECIAL_ENTITY_OFFICE_LINE,
    scopeNotice: SPECIAL_ENTITY_SCOPE_NOTICE,
    conclusion:
      "농업회사법인 설립은 인증 후 1월 이내 설립등기가 필요합니다. 법무사는 인증 이후 등기 서류 작성·접수를 지원하며, 인증 신청·농지 관련 행정은 별도 절차입니다.",
    primaryKeyword: "부산 농업회사법인 설립",
    secondaryKeywords: [
      "농업회사법인 인증",
      "농업회사법인 설립등기",
      "경남 농업회사법인",
      "농업법인 설립",
    ],
    questionKeywords: [
      "농업회사법인 설립 절차",
      "농업회사법인 인증 기한",
      "영농조합법인 차이",
    ],
    searchIntent: "부산·경남에서 농업회사법인 설립·등기를 확인하려는 검색",
    whoNeedsThis: [
      "농산물 생산·가공·유통·체험 사업을 법인화하려는 농업인",
      "귀농·귀어 사업자",
      "스마트팜·농촌융복합 사업",
    ],
    whenAndDeadline: ["인증일부터 1월 이내 설립등기(제16조)"],
    decisionBodies: ["발기인·창립총회·주주총회(유형별)"],
    documents: [
      "인증서",
      "정관",
      "창립총회·주주총회 의사록",
      "출자·납입 증빙",
      "임원 취임승낙서",
    ],
    procedures: [
      "사업계획·정관 준비",
      "농업회사법인 인증 신청",
      "인증 후 창립·설립등기",
    ],
    costFactors: ["출자금·자본금", "유형(주식·유한)"],
    penaltyRisks: ["인증 후 등기 기한 경과", "인증 요건 미유지"],
    commonConfusions: [
      "영농조합법인과 혼동",
      "세제 혜택을 등기와 동일시",
    ],
    diyErrors: ["인증 전 등기", "출자자 자격 미확인"],
    faqs: [
      {
        question: "영농조합법인과 무엇이 다른가요?",
        answer:
          "영농조합법인은 농업협동조합법 체계이고, 농업회사법인은 별도 육성법에 따릅니다. 사업 구조에 따라 선택이 달라집니다.",
      },
    ],
    relatedLinks: [
      SPECIAL_ENTITY_HUB_LINKS.cooperative,
      SPECIAL_ENTITY_HUB_LINKS.special,
      ...baseSpecialRelated,
    ],
    ctaTitle: "농업회사법인 설립등기 상담",
    ctaText: "인증서와 정관이 준비되었다면 설립등기 서류부터 확인할 수 있습니다.",
    legalProfile: {
      entityName: "농업회사법인",
      legalBasis: ["농업회사법인육성에 관한 법률"],
      establishmentMethod: "농림축산식품부 장관 인증 후 설립등기",
      competentAuthority: [
        "인증: 농림축산식품부 장관",
        "등기: 주사무소 관할 등기소",
      ],
      preRegistrationSteps: ["사업계획", "인증 신청", "창립총회"],
      registrationDeadline: "인증일부터 1월 이내(제16조)",
      registrableMatters: ["명칭·본점·임원·자본금"],
      lawyerScope: ["인증 후 설립등기"],
      excludedScope: ["인증 대리 보장", "농지 취득·세무"],
      lastLegalReview: "2026-07-28",
      regionalNotes: [
        "부산·기장·강서 등 농업지역 사업자 문의",
        "인증 창구는 농림부·유관기관 안내 확인",
      ],
    },
  },
  {
    slug: "부산협회단체법인설립",
    kind: "intent",
    title: "부산 협회·단체 법인설립",
    metaTitle: "부산 협회·단체 법인설립｜임의단체에서 사단법인으로",
    metaDescription:
      "부산 협회·학회·단체의 사단법인 설립. 주무관청·정관·창립총회·허가 후 등기 — 다옴법무사.",
    h1: "부산 협회·단체 법인설립 — 임의단체와 사단법인을 구분하세요",
    eyebrow: "협회·단체 · 부산",
    heroIntro:
      "부산의 협회·학회·동호회·업종단체가 법인격을 갖추려면 대개 민법상 사단법인 설립을 검토합니다.",
    heroParagraphs: [
      "임의단체는 내부 규약으로 운영되지만 법인격이 없고, 사단법인은 등기로 법인격을 취득합니다. 협회 설립 시 주무관청·회원 구조·비영리 목적을 정관에 반영해야 합니다.",
      "부산 지역 협회는 목적에 따라 부산시·구청·교육청 등 관할이 달라집니다.",
    ],
    officeLine: SPECIAL_ENTITY_OFFICE_LINE,
    scopeNotice: SPECIAL_ENTITY_SCOPE_NOTICE,
    conclusion:
      "부산 협회·단체의 법인설립은 사단법인 설립허가 후 등기가 일반적입니다. 협동조합·주식회사와 구조가 다르므로 `/협회사단법인설립`, `/사단법인과재단법인차이`도 함께 참고하세요.",
    primaryKeyword: "부산 협회 법인설립",
    secondaryKeywords: [
      "협회 사단법인",
      "학회 법인화",
      "단체 법인설립",
      "임의단체 법인 전환",
    ],
    questionKeywords: [
      "협회 법인 만들기",
      "협회 사단법인 절차",
      "단체 법인화",
    ],
    searchIntent: "부산 협회·단체를 법인으로 만들 방법을 찾는 검색",
    whoNeedsThis: [
      "업종·종목 협회 설립",
      "학회·동문회·향우회 법인화",
      "문화·체육·복지 단체",
    ],
    whenAndDeadline: ["설립허가 후 3주 이내 설립등기"],
    decisionBodies: ["창립총회·총회"],
    documents: ["설립허가서", "정관", "창립총회 의사록", "임원 서류"],
    procedures: [
      "법인 형태 선택",
      "정관·허가",
      "창립총회",
      "설립등기",
    ],
    costFactors: ["회원·임원 규모", "허가 단계"],
    penaltyRisks: ["등기 기한 경과"],
    commonConfusions: [
      "협회와 주식회사 선택 혼동",
      "비영리민간단체와 혼동",
    ],
    diyErrors: ["수익 배분 구조를 비영리 정관에 혼입"],
    faqs: [
      {
        question: "협회는 주식회사로도 만들 수 있나요?",
        answer:
          "가능하지만 목적·세무·운영 부담이 다릅니다. 비영리 협회 목적이면 사단법인이 일반적입니다.",
      },
    ],
    relatedLinks: [
      { href: "/협회사단법인설립", label: "협회 사단법인 설립" },
      { href: "/부산사단법인설립", label: "부산 사단법인 설립" },
      SPECIAL_ENTITY_HUB_LINKS.compareNgoAssociation,
      ...baseSpecialRelated,
    ],
    ctaTitle: "협회·단체 법인설립 상담",
    ctaText:
      "협회 목적과 회원 구조를 알려주시면 사단법인·협동조합 중 적합한 형태를 함께 검토할 수 있습니다.",
  },
  {
    slug: "협회사단법인설립",
    kind: "intent",
    title: "협회 사단법인 설립",
    metaTitle: "협회를 사단법인으로 설립하는 방법｜허가·정관·등기",
    metaDescription:
      "업종별·종목별 협회의 사단법인 설립. 주무관청 허가, 창립총회, 회원·이사회, 설립등기 — 다옴법무사.",
    h1: "협회를 사단법인으로 — 회원 협회에 맞는 설립 절차",
    eyebrow: "협회 · 사단법인",
    heroIntro:
      "업종·종목·지역 협회는 회원 기반 비영리 목적에 맞아 사단법인 형태로 설립하는 경우가 많습니다.",
    heroParagraphs: [
      "협회 설립 시 정관에 회원 자격·총회·이사회·재산 관리를 명확히 해야 합니다. 주무관청은 협회 목적(교육·체육·산업·복지 등)에 따라 달라집니다.",
      "부산에 주사무소를 두는 협회는 `/부산협회단체법인설립` 지역 안내도 참고할 수 있습니다.",
    ],
    officeLine: SPECIAL_ENTITY_OFFICE_LINE,
    scopeNotice: SPECIAL_ENTITY_SCOPE_NOTICE,
    conclusion:
      "협회 사단법인 설립은 주무관청 허가 후 설립등기가 필요합니다. 법무사는 허가 이후 등기 단계를 지원합니다.",
    primaryKeyword: "협회 사단법인 설립",
    secondaryKeywords: [
      "업종별 협회 법인화",
      "협회 설립 절차",
      "협회 정관",
      "협회 창립총회",
    ],
    questionKeywords: [
      "협회 법인 설립",
      "협회 사단법인 허가",
      "협회 등기",
    ],
    searchIntent: "협회를 사단법인으로 설립하는 방법을 찾는 검색",
    whoNeedsThis: [
      "업종·종목 협회 발기인",
      "기존 임의단체 협회의 법인화",
      "중앙회·지회 구조를 설계하는 경우",
    ],
    whenAndDeadline: ["설립허가 후 3주 이내 설립등기"],
    decisionBodies: ["창립총회·총회·이사회"],
    documents: ["설립허가서", "정관", "회원·발기인 명부", "의사록", "임원 서류"],
    procedures: ["정관·허가", "창립총회", "설립등기"],
    costFactors: ["회원 규모", "지회 설치 여부"],
    penaltyRisks: ["등기 지연", "정관 위반"],
    commonConfusions: ["중앙회·지회 등기 구조 혼동"],
    diyErrors: ["회원 자격 미명시", "수익 사업 조항 오류"],
    faqs: [
      {
        question: "전국 협회도 부산에서 설립할 수 있나요?",
        answer:
          "주사무소 소재지 관할로 허가·등기가 이뤄집니다. 전국 단위 협회도 주사무소 위치에 따라 관할이 정해집니다.",
      },
    ],
    relatedLinks: [
      { href: "/부산협회단체법인설립", label: "부산 협회·단체 법인설립" },
      { href: "/부산사단법인설립", label: "부산 사단법인 설립" },
      ...baseSpecialRelated,
    ],
    ctaTitle: "협회 사단법인 설립 상담",
    ctaText: "협회 목적과 회원 구조를 알려주시면 허가·등기 단계를 확인할 수 있습니다.",
  },
  {
    slug: "장학재단설립",
    kind: "intent",
    title: "장학재단 설립",
    metaTitle: "장학재단 설립｜출연재산·이사·감사와 설립등기",
    metaDescription:
      "장학 목적 재단법인 설립. 기본재산·출연·설립허가·설립등기. 기부금·세무는 별도 확인 — 다옴법무사.",
    h1: "장학재단 설립 — 재단법인 구조와 등기를 먼저 이해하세요",
    eyebrow: "재단법인 · 장학",
    heroIntro:
      "장학재단은 보통 민법상 재단법인으로 설립하며, 출연재산을 기본재산으로 귀속시킵니다.",
    heroParagraphs: [
      "가족·기업·동문·지역 출연으로 장학 사업을 하려면 정관에 장학 대상·선발·재산 관리를 명시하고 설립허가를 받아야 합니다.",
      "기부금 단체 지정·세제 혜택은 설립등기와 별도이며, 세무 전문가 확인이 필요합니다.",
    ],
    officeLine: SPECIAL_ENTITY_OFFICE_LINE,
    scopeNotice: SPECIAL_ENTITY_SCOPE_NOTICE,
    conclusion:
      "장학재단 설립은 재단법인 설립허가 후 설립등기가 필요합니다. 법무사는 등기와 서류 작성·접수를 지원합니다.",
    primaryKeyword: "장학재단 설립",
    secondaryKeywords: [
      "장학재단 법인",
      "장학회 법인화",
      "재단법인 장학",
      "출연 장학재단",
    ],
    questionKeywords: [
      "장학재단 설립 절차",
      "장학재단 최소 재산",
      "장학재단 정관",
    ],
    searchIntent: "장학 목적 재단법인 설립 절차를 확인하려는 검색",
    whoNeedsThis: [
      "가족·기업 출연 장학재단",
      "학교·동문 장학 기금 법인화",
      "지역 인재 육성 재단",
    ],
    whenAndDeadline: ["설립허가 후 3주 이내 설립등기"],
    decisionBodies: ["설립위원회·이사회"],
    documents: ["설립허가서", "정관", "기본재산 목록", "출연 증빙", "임원 서류"],
    procedures: ["정관·출연", "설립허가", "설립등기"],
    costFactors: ["기본재산 가액", "출연 형태"],
    penaltyRisks: ["기본재산 미귀속", "등기 지연"],
    commonConfusions: ["장학회 임의단체와 재단법인 혼동", "기부금 공제와 설립 혼동"],
    diyErrors: ["장학 사업 범위 미기재", "이사·감사 구성 오류"],
    faqs: [
      {
        question: "장학회와 장학재단의 차이는?",
        answer:
          "장학회는 임의단체·비영리민간단체 등으로 운영될 수 있고, 장학재단은 보통 재단법인으로 법인격을 취득합니다.",
      },
    ],
    relatedLinks: [
      { href: "/부산재단법인설립", label: "부산 재단법인 설립" },
      SPECIAL_ENTITY_HUB_LINKS.compareAssociationFoundation,
      ...baseSpecialRelated,
    ],
    ctaTitle: "장학재단 설립 상담",
    ctaText: "출연재산·정관 초안이 있다면 설립등기 준비 항목을 확인할 수 있습니다.",
    legalProfile: {
      entityName: "장학 목적 재단법인",
      legalBasis: ["민법 제32조·제42조"],
      establishmentMethod: "주무관청 설립허가 후 설립등기",
      competentAuthority: ["목적별 주무관청(교육·복지 등)", "관할 등기소"],
      preRegistrationSteps: ["출연·정관", "설립허가"],
      registrationDeadline: "설립허가 후 3주 이내",
      registrableMatters: ["목적·기본재산·임원"],
      lawyerScope: ["설립등기"],
      excludedScope: ["기부금 단체 지정", "세무"],
      lastLegalReview: "2026-07-28",
    },
  },
  {
    slug: "비영리법인임원변경등기",
    kind: "intent",
    title: "비영리법인 임원변경등기",
    metaTitle: "비영리법인 임원변경등기｜주무관청 승인과 등기 순서를 확인하세요",
    metaDescription:
      "사단·재단법인 임원 취임·사임·중임 등기. 총회·이사회 결의, 승인, 등기 기한 — 다옴법무사.",
    h1: "비영리법인 임원변경등기 — 취임·사임·중임을 등기부에 반영하세요",
    eyebrow: "비영리법인 · 변경등기",
    heroIntro:
      "사단법인·재단법인도 이사장·이사·감사가 바뀌면 등기가 필요합니다.",
    heroParagraphs: [
      "임원 변경은 정관·민법에 따른 총회·이사회 결의 후, 일부 사항은 주무관청 승인이 필요할 수 있습니다. 취임·사임·중임·대표권 있는 이사 변경은 각각 서류가 다릅니다.",
      "주식회사 임원변경(`/부산임원변경등기`)과 유사해 보이지만, 비영리법인은 주무관청 승인 단계가 추가되는 경우가 많습니다.",
    ],
    officeLine: SPECIAL_ENTITY_OFFICE_LINE,
    scopeNotice: SPECIAL_ENTITY_SCOPE_NOTICE,
    conclusion:
      "비영리법인 임원변경등기는 결의·승인 후 법정 기한 내 접수해야 합니다. 사임만 하고 취임을 미등기하면 대표권 공백이 생길 수 있습니다.",
    primaryKeyword: "비영리법인 임원변경등기",
    secondaryKeywords: [
      "사단법인 임원변경",
      "재단법인 이사 변경",
      "사단법인 이사장 변경",
      "비영리법인 대표 변경",
    ],
    questionKeywords: [
      "사단법인 임원 바뀌면",
      "재단법인 이사 변경 등기",
      "임원 중임등기",
    ],
    searchIntent: "비영리법인 임원 변경 시 필요한 등기를 확인하려는 검색",
    whoNeedsThis: [
      "이사장·이사·감사가 교체된 사단·재단법인",
      "임기 만료 후 중임·퇴임이 필요한 경우",
      "대표권 있는 이사 변경",
    ],
    whenAndDeadline: ["취임·사임 결의 후 등기 기한 적용"],
    decisionBodies: ["총회·이사회", "주무관청 승인(해당 시)"],
    documents: [
      "등기사항전부증명서",
      "정관",
      "의사록",
      "취임승낙서·사임서",
      "승인서(해당 시)",
    ],
    procedures: [
      "결의·승인",
      "등기 신청",
      "등기 완료 확인",
    ],
    costFactors: ["사임·취임 동시 여부", "대표권 변경"],
    penaltyRisks: ["등기 지연 과태료", "대표권 공백"],
    commonConfusions: [
      "내부 임명만 하고 등기 안 함",
      "주식회사와 동일 절차로 가정",
    ],
    diyErrors: ["사임만 등기", "승인 전 접수"],
    anonymousCase:
      "부산 소재 복지 사단법인이 이사장 교체 후 6개월간 등기를 미뤄 입찰 서류에서 등기부 불일치가 발생했습니다. 결의 서류 정리 후 취임·사임 등기를 완료했습니다.",
    faqs: [
      {
        question: "임기 만료만으로 퇴임되나요?",
        answer:
          "정관·결의에 따라 중임·사임·퇴임을 정리하고 등기해야 합니다. `/부산임원임기만료등기`는 주식회사 중심이나 절차 비교에 참고할 수 있습니다.",
      },
    ],
    relatedLinks: [
      SPECIAL_ENTITY_HUB_LINKS.change,
      { href: "/부산사단법인설립", label: "부산 사단법인 설립" },
      { href: "/법인변경등기", label: "주식회사 변경등기 허브" },
      { href: "/부산임원변경등기", label: "부산 임원변경등기(주식회사)" },
      ...baseSpecialRelated,
    ],
    ctaTitle: "비영리법인 임원변경 상담",
    ctaText:
      "등기사항증명서와 결의 서류를 기준으로 필요한 등기를 확인할 수 있습니다.",
  },
  {
    slug: "주무관청허가후설립등기",
    kind: "intent",
    title: "주무관청 허가 후 설립등기",
    metaTitle: "주무관청 허가 후 설립등기｜행정 허가와 법인등기 구분",
    metaDescription:
      "비영리 사단·재단법인 설립허가 후 설립등기. 허가서·정관·창립총회·등기 기한 3주 — 다옴법무사.",
    h1: "주무관청 허가를 받았다면 — 이제 설립등기를 준비하세요",
    eyebrow: "허가 후 · 설립등기",
    heroIntro:
      "민법상 비영리법인은 설립허가와 법인설립등기가 분리된 두 단계입니다.",
    heroParagraphs: [
      "허가서·확정 정관·창립총회 의사록·임원 서류를 갖춘 뒤 관할 등기소에 설립등기를 신청합니다. 허가 후 3주 이내 등기가 원칙입니다(민법 시행령 제4조).",
      "사회복지법인·학교법인·의료법인·공익법인 등은 다른 법률의 인가·허가 후 등기하므로 해당 법인 유형 안내를 별도로 확인해야 합니다.",
    ],
    officeLine: SPECIAL_ENTITY_OFFICE_LINE,
    scopeNotice: SPECIAL_ENTITY_SCOPE_NOTICE,
    conclusion:
      "주무관청 허가 후 설립등기는 허가서와 정관·의사록을 기준으로 준비하며, 법무사는 이 단계의 서류 작성·검토·접수를 지원합니다.",
    primaryKeyword: "주무관청 허가 후 설립등기",
    secondaryKeywords: [
      "설립허가 후 등기",
      "비영리법인 설립등기",
      "허가서 등기",
      "사단법인 설립등기",
    ],
    questionKeywords: [
      "허가 받고 등기",
      "설립등기 기한",
      "허가 후 준비서류",
    ],
    searchIntent: "행정 허가를 받은 뒤 법인 설립등기 절차를 확인하려는 검색",
    whoNeedsThis: [
      "설립허가를 받고 등기만 남은 발기인",
      "허가서와 정관 불일치를 점검하려는 경우",
      "등기 기한이 임박한 단체",
    ],
    whenAndDeadline: ["설립허가 후 3주 이내(민법상 비영리법인)"],
    decisionBodies: ["창립총회·이사회(이미 완료된 결의 확인)"],
    documents: [
      "설립허가서",
      "확정 정관",
      "창립총회 의사록",
      "임원 취임승낙서·인감증명서",
      "주사무소 증빙",
      "기본재산 증빙(재단법인)",
    ],
    procedures: [
      "허가서·정관 대조",
      "등기신청서·첨부 작성",
      "관할 등기소 접수",
      "등기 완료 확인",
    ],
    costFactors: ["재단 기본재산 가액", "임원 수"],
    penaltyRisks: ["3주 등기 기한 경과"],
    commonConfusions: [
      "허가=설립 완료로 오인",
      "허가 전 등기 시도",
    ],
    diyErrors: ["허가서 첨부 누락", "정관·허가서 불일치"],
    faqs: [
      {
        question: "협동조합도 허가 후 등기인가요?",
        answer:
          "일반협동조합은 창립총회 후 등기하고, 사회적협동조합은 인가 후 등기합니다. `/부산협동조합설립등기`를 참고하세요.",
      },
    ],
    relatedLinks: [
      { href: "/부산사단법인설립", label: "부산 사단법인 설립" },
      { href: "/부산재단법인설립", label: "부산 재단법인 설립" },
      SPECIAL_ENTITY_HUB_LINKS.nonprofit,
      ...baseSpecialRelated,
    ],
    ctaTitle: "허가 후 설립등기 검토",
    ctaText: "허가서와 정관이 준비되어 있다면 설립등기 서류부터 검토할 수 있습니다.",
    legalProfile: {
      entityName: "민법상 비영리법인(허가 후 등기)",
      legalBasis: ["민법 제32조", "민법 시행령 제4조"],
      establishmentMethod: "설립허가 후 설립등기",
      competentAuthority: ["주무관청(허가)", "등기소(등기)"],
      preRegistrationSteps: ["설립허가 완료", "창립총회·임원"],
      registrationDeadline: "허가 후 3주 이내",
      registrableMatters: ["설립 등기사항 전반"],
      lawyerScope: ["설립등기 서류·접수"],
      excludedScope: ["허가 신청"],
      lastLegalReview: "2026-07-28",
    },
  },
];
