import type {
  CounselIntentCategory,
  CounselIntentStage,
  CounselPageContent,
  CounselSelectorResult,
} from "@/lib/counsel-intent/types";

export const counselPages: CounselPageContent[] = [
  {
    slug: "부산법률상담",
    title: "부산 법률상담 — 법무사가 지원하는 절차 안내",
    metaTitle:
      "부산에서 법률상담을 찾을 때｜공공 상담과 법무사 업무의 차이",
    metaDescription:
      "부산에서 법률상담을 찾을 때 공공 상담이 적합한 경우와 등기·서류·신청이 필요한 경우를 구분해 안내합니다. 법무사 지원 가능 업무와 별도 검토가 필요한 사안을 확인할 수 있습니다.",
    h1: "부산에서 법률상담을 찾을 때 확인할 곳",
    eyebrow: "공공 상담과 법무사 업무의 차이",
    heroIntro:
      "상담만 필요한지, 등기·서류·신청까지 필요한지에 따라 찾는 곳이 달라집니다.",
    heroParagraphs: [
      "부산에서 법률상담을 검색할 때 공공 무료상담이 맞는 경우와, 실제 등기신청·서류작성이 필요한 경우를 먼저 나누어 보는 것이 좋습니다. 이 페이지는 사무소 홍보를 위해 공공 상담을 대체한다고 안내하지 않습니다.",
      "대한법률구조공단은 경제적으로 어렵거나 법률 제도 이용이 어려운 분들을 위해 법률상담·법률구조를 제공하는 공공기관입니다. 전화상담은 국번 없이 132, 방문·사이버 상담은 공단 공식 홈페이지(www.klac.or.kr)에서 예약·이용 방법을 확인하실 수 있습니다. 대상·시간·예약 방식은 기관·시점에 따라 달라질 수 있어, 이 사이트에 지부 전화·운영시간을 임의로 적지 않습니다.",
      "세무·노무·소비자·금융 분쟁 등은 국세청(126)·고용노동부(1350)·소비자상담센터(1372)·금융감독원(1332) 등 분야별 상담 창구가 따로 있습니다. 법무사 상담은 등기·공탁·법원 제출서류·상속·회생파산 신청서류 등 실무 절차를 중심으로 안내합니다.",
      "다옴법무사사무소 안윤정 법무사는 소송대리·형사변호·포괄적 법률의견을 대체하지 않습니다. 상담을 받은 뒤 등기나 법원 제출서류가 필요한 경우, 현재 자료를 기준으로 진행 가능 여부와 준비서류를 확인할 수 있습니다.",
    ],
    officeLine: "다옴법무사사무소 안윤정 법무사 · 부산 해운대·센텀",
    scopeNotice:
      "소송대리, 형사변호, 협상대리, 포괄적 법률의견 제공은 법무사 업무범위와 다를 수 있습니다. 사안별로 적절한 업무영역 확인이 필요합니다.",
    summaryItems: [
      {
        label: "이 페이지의 목적",
        value: "넓은 검색어를 실제 등기·서류·절차 업무로 연결",
      },
      {
        label: "자격 표시",
        value: "다옴법무사사무소 · 안윤정 법무사",
      },
      {
        label: "주요 지원",
        value: "상속·부동산·법인등기, 회생·파산, 내용증명·지급명령 서류",
      },
      {
        label: "별도 검토",
        value: "소송대리·형사·협상·세무·노무·특허·인허가 등",
      },
      {
        label: "상담 전 준비",
        value: "상황 요약, 기한, 관련 서류·통지서 사진",
      },
      {
        label: "다음 단계",
        value: "상황 카드·업무 선택기 → 관련 페이지 → 상담 문의",
      },
    ],
    situationCards: [
      {
        title: "상담만 필요하고 절차는 아직인 경우",
        description: "공공 법률상담·분야별 상담 창구 먼저 확인",
        href: "/부산법무사상담",
      },
      {
        title: "등기·서류 신청이 필요한 경우",
        description: "법무사 업무 가능 여부와 준비서류 확인",
        href: "/부산법무사상담",
      },
      {
        title: "부모님이 돌아가신 경우",
        description: "상속등기·상속인 협의·관할 확인",
        href: "/부산상속등기",
      },
      {
        title: "상속받을 재산보다 빚이 걱정되는 경우",
        description: "상속포기·한정승인 기한과 서류",
        href: "/부산상속포기",
      },
      {
        title: "부동산 명의를 이전해야 하는 경우",
        description: "매매·증여·명의변경 등기",
        href: "/부산소유권이전등기",
      },
      {
        title: "전세보증금을 받지 못한 경우",
        description: "피해 상황 구분 후 임차권등기·반환 절차 안내",
        href: "/전세사기피해대응절차",
      },
      {
        title: "대출을 갚고 근저당을 지워야 하는 경우",
        description: "근저당 말소등기 서류·절차",
        href: "/부산부동산등기",
      },
      {
        title: "법인을 설립하거나 변경해야 하는 경우",
        description: "설립·임원·본점 등 법인등기",
        href: "/부산법인등기",
      },
      {
        title: "거래처가 돈을 지급하지 않는 경우",
        description: "내용증명·지급명령 신청서류",
        href: "/민사소송",
      },
      {
        title: "채무를 감당하기 어려운 경우",
        description: "개인회생·개인파산 신청서류 안내",
        href: "/부산개인회생",
      },
      {
        title: "법원에서 서류를 받은 경우",
        description: "기한·서류 유형을 먼저 확인",
        href: "/등기서류상담",
      },
      {
        title: "어떤 절차가 필요한지 모르는 경우",
        description: "상황만 선택해도 안내되는 상담",
        href: "/상담",
      },
    ],
    supportItems: [
      "부동산등기",
      "법인등기",
      "상속등기",
      "등기·공탁 신청대리",
      "법원 제출서류 작성",
      "지급명령 신청서류",
      "내용증명 작성",
      "가압류·가처분 신청서류 작성",
      "개인회생·개인파산 신청서류",
      "경매·공매 재산취득 관련 절차",
      "임차권등기명령 신청서류",
      "법인 변경사항 점검",
    ],
    scopeRows: [
      {
        label: "부동산·법인·상속등기",
        level: "direct-support",
        note: "신청·서류·절차 진행",
      },
      {
        label: "등기·공탁 신청대리",
        level: "direct-support",
        note: "법무사 업무범위 내 대리",
      },
      {
        label: "법원 제출서류 작성",
        level: "direct-support",
        note: "지급명령·가압류·회생파산 등",
      },
      {
        label: "내용증명·신청 절차 안내",
        level: "procedure-guide",
        note: "사실관계 정리와 서류 준비",
      },
      {
        label: "재판 출석·소송대리",
        level: "expert-review",
        note: "사안별 적절한 업무영역 확인 필요",
      },
      {
        label: "수사기관 대응·형사변호",
        level: "expert-review",
        note: "별도 전문가 검토가 필요할 수 있음",
      },
      {
        label: "상대방과의 협상대리",
        level: "expert-review",
        note: "협상 대리는 범위와 다를 수 있음",
      },
      {
        label: "포괄적인 계약 법률의견",
        level: "expert-review",
        note: "등기·서류와 연결된 범위만 안내",
      },
      {
        label: "세무신고·세금 판단",
        level: "expert-review",
        note: "세무사 등 별도 검토",
      },
      {
        label: "노무·인사 자문",
        level: "expert-review",
        note: "노무사 등 별도 검토",
      },
      {
        label: "특허·상표 출원",
        level: "expert-review",
        note: "변리사 등 별도 검토",
      },
      {
        label: "행정 인허가",
        level: "expert-review",
        note: "업종·인허가 전문 검토가 필요할 수 있음",
      },
    ],
    documents: [
      "현재 상황을 한 문단으로 정리한 메모",
      "관련 계약서·등기부·통지서(있으면)",
      "법원·등기소에서 받은 서류 사진",
      "확인해야 할 기한(사망일·잔금일·제출기한 등)",
      "문의하고 싶은 목표(등기·서류·절차 확인)",
    ],
    procedures: [
      "상담만 필요한지, 등기·서류·신청까지 필요한지 먼저 구분합니다.",
      "공공 상담이 맞으면 대한법률구조공단 공식 홈페이지(www.klac.or.kr) 또는 전화상담(국번 없이 132)에서 이용 방법을 확인합니다. 세무·노무·소비자·금융은 분야별 상담 창구를 확인합니다.",
      "등기·서류·신청이 필요하면 상황 카드나 업무 선택기로 가까운 절차를 확인합니다.",
      "관련 안내 페이지에서 서류·기한을 먼저 봅니다.",
      "지원 가능 범위를 확인하고 상담을 요청합니다.",
      "필요 서류를 정리한 뒤 등기·신청을 진행합니다.",
      "완료 서류와 후속 확인사항을 안내합니다.",
    ],
    costFactors: [
      "등기·신청 종류와 건수",
      "등록면허세·인지대 등 공과금",
      "서류 보정·촉박한 기한",
      "관할·물건·채무 구조의 복잡성",
      "초기 안내와 정식 검토·수임의 범위 차이",
    ],
    commonMistakes: [
      "법률상담만 찾고 필요한 절차(등기·서류)를 확인하지 않는 경우",
      "공공 상담과 법무사 실무 신청을 같은 것으로 오해하는 경우",
      "기한이 있는 상속포기·한정승인을 미루는 경우",
      "소송대리가 필요한 사안을 등기·서류 업무로만 진행하려는 경우",
      "준비서류 없이 결과만 먼저 묻는 경우",
    ],
    faqs: [
      {
        question: "공공 무료법률상담과 법무사 상담은 무엇이 다른가요?",
        answer:
          "공공 상담(예: 대한법률구조공단)은 자격·대상에 따라 법률상담·법률구조를 제공합니다. 법무사 상담은 등기·서류·신청 실무를 중심으로 접수 가능 여부·준비서류·비용 구성을 안내하고, 수임 후 신청·대리를 진행합니다. 상담만 필요한지, 실제 등기·제출이 필요한지에 따라 이용처가 달라질 수 있습니다.",
      },
      {
        question: "대한법률구조공단은 어디서 확인하나요?",
        answer:
          "공식 홈페이지(www.klac.or.kr)와 전화상담(국번 없이 132)에서 이용 방법을 확인하세요. 지부 주소·전화·운영시간은 시점마다 달라질 수 있어 이 페이지에 임의로 적지 않습니다.",
      },
      {
        question: "법무사에게 어떤 법률상담을 받을 수 있나요?",
        answer:
          "등기, 공탁, 법원 제출서류 작성, 상속·회생파산 신청서류, 내용증명·지급명령 등 법무사가 수행할 수 있는 절차와 준비사항을 안내합니다. 모든 법률문제나 소송 전반을 처리한다고 안내하지 않습니다.",
      },
      {
        question: "등기업무와 법원서류 작성은 어떻게 다른가요?",
        answer:
          "등기업무는 부동산·법인 등기부에 권리관계를 반영하는 절차입니다. 법원서류 작성은 지급명령·가압류·회생파산 등 법원에 제출하는 신청서류를 작성·준비하는 업무입니다. 둘 다 사안에 따라 함께 필요할 수 있습니다.",
      },
      {
        question: "법원에서 서류를 받았는데 문의할 수 있나요?",
        answer:
          "가능합니다. 받은 서류의 종류와 기한을 확인한 뒤, 법무사 지원이 가능한 신청·서류인지 아니면 별도 검토가 필요한지 구분합니다. 서류 사진과 기한을 함께 남겨 주시면 안내가 수월합니다.",
      },
      {
        question: "전세보증금 문제도 상담할 수 있나요?",
        answer:
          "임차권등기명령 신청서류, 관련 등기·절차 안내를 중심으로 상담할 수 있습니다. 임대인과의 협상 대리나 소송 수행이 핵심인 경우 별도 검토가 필요할 수 있습니다.",
      },
      {
        question: "상속포기와 한정승인은 언제 확인해야 하나요?",
        answer:
          "상속 개시를 안 날부터 일정 기간 안에 신고해야 하는 경우가 많습니다. 재산·채무가 불확실하면 한정승인, 채무가 명백히 많으면 상속포기를 검토하는 경우가 있습니다. 구체 기한은 상담에서 확인합니다.",
      },
      {
        question: "개인회생·개인파산 상담 전 어떤 자료가 필요한가요?",
        answer:
          "채무 목록, 소득·생계비 관련 자료, 재산 현황, 최근 거래 내역 요약을 준비하면 도움이 됩니다. 자격 진단 결과만으로 인용을 보장하지는 않습니다.",
      },
      {
        question: "소송 출석이나 형사사건 대응도 가능한가요?",
        answer:
          "재판 출석·소송대리·형사변호는 법무사 업무범위와 다를 수 있어 사안별로 적절한 업무영역 확인이 필요합니다. 등기·신청서류 작성 중심인지 상담에서 구분합니다.",
      },
      {
        question: "어떤 업무영역에 해당하는지 모르면 어떻게 문의하나요?",
        answer:
          "아래 업무 선택기나 상황 카드로 가까운 절차를 고르거나, 상담·문의 페이지에 상황과 기한만 남겨 주시면 지원 가능 업무를 안내합니다.",
      },
      {
        question: "부산 외 지역의 등기업무도 가능한가요?",
        answer:
          "관할·서류·일정에 따라 가능 여부를 상담에서 확인합니다. 여러 지역 부동산·본점 이전 등은 전국업무 안내도 참고할 수 있습니다.",
      },
      {
        question: "전화나 이메일로 먼저 문의할 수 있나요?",
        answer:
          "가능합니다. 전화·카카오톡·문의 양식으로 먼저 상황을 남겨 주시면, 법무사가 지원할 수 있는 절차인지 안내합니다.",
      },
    ],
    relatedLinks: [
      { href: "/상담", label: "상황 선택형 법무사 상담" },
      { href: "/부산법무사상담", label: "법무사 업무 상담·준비서류" },
      { href: "/전세사기피해대응절차", label: "전세보증금 피해 대응" },
      { href: "/개인회생파산", label: "회생·파산 비교" },
      { href: "/부산법무사비용", label: "부산 법무사 비용 구성" },
      { href: "/무슨법률업무인지모를때", label: "업무명을 모를 때" },
      { href: "/부산법무사", label: "부산 법무사 안내" },
      { href: "/services", label: "전체 업무안내" },
      { href: "/부산상속등기", label: "부산 상속등기" },
      { href: "/부산부동산등기", label: "부산 부동산등기" },
      { href: "/부산증여등기", label: "부산 증여등기" },
      { href: "/부산법인등기", label: "부산 법인등기" },
      { href: "/부산개인회생", label: "부산 개인회생" },
      { href: "/자가진단", label: "업무별 자가진단" },
      { href: "/contact/inquiry", label: "업무 가능 여부 확인하기" },
    ],
    primaryKeywords: [
      "부산 법률상담",
      "부산 무료법률상담",
      "법률구조공단 상담",
      "법무사 업무범위",
      "부산 등기 상담",
    ],
    ctaTitle: "등기·서류가 필요하신가요?",
    ctaText:
      "상담을 받은 뒤 등기나 법원 제출서류가 필요한 경우, 현재 자료를 기준으로 진행 가능 여부와 준비서류를 확인할 수 있습니다.",
  },
];

export function getCounselContent(slug: string): CounselPageContent | undefined {
  return counselPages.find((page) => page.slug === slug);
}

export function getAllCounselSlugs(): string[] {
  return counselPages.map((page) => page.slug);
}

const CATEGORY_RESULTS: Record<
  CounselIntentCategory,
  CounselSelectorResult[]
> = {
  inheritance: [
    {
      title: "부산 상속등기",
      href: "/부산상속등기",
      note: "상속 부동산·명의이전 절차",
      documents: ["기본증명서", "가족관계증명서", "부동산 등기부"],
      deadlineHint: "상속세·협의 일정과 별도로 등기 필요 여부를 확인합니다.",
    },
    {
      title: "부산 상속포기",
      href: "/부산상속포기",
      note: "채무가 많을 때 검토",
      documents: ["사망 사실 확인 서류", "상속인 관계 서류"],
      deadlineHint: "상속 개시 인지 후 신고 기한이 있을 수 있습니다.",
    },
    {
      title: "부산 한정승인",
      href: "/부산한정승인",
      note: "채무가 불확실할 때 검토",
      documents: ["재산·채무 파악 자료", "상속인 관계 서류"],
      deadlineHint: "기한 내 신고가 필요할 수 있어 빨리 확인하는 것이 좋습니다.",
    },
  ],
  "real-estate": [
    {
      title: "부산 부동산등기",
      href: "/부산부동산등기",
      note: "매매·말소·담보 등기 전반",
      documents: ["계약서", "등기필정보", "신분증"],
    },
    {
      title: "소유권이전등기",
      href: "/부산소유권이전등기",
      note: "잔금 후 명의이전",
      documents: ["매매계약서", "잔금 일정"],
      deadlineHint: "잔금일·소유권이전 일정을 함께 확인합니다.",
    },
    {
      title: "임차권등기명령",
      href: "/부산임차권등기명령",
      note: "보증금을 못 받고 이사할 때",
      documents: ["임대차계약서", "내용증명·독촉 기록"],
    },
  ],
  corporate: [
    {
      title: "부산 법인등기",
      href: "/부산법인등기",
      note: "설립·임원·본점 변경",
      documents: ["등기사항증명서", "정관·의사록 요약"],
      deadlineHint: "임원·본점 변경은 등기 기한이 있을 수 있습니다.",
    },
    {
      title: "부산 법인설립등기",
      href: "/부산법인설립등기",
      note: "신규 법인 설립",
      documents: ["상호·목적·자본금 계획", "발기인·임원 정보"],
    },
    {
      title: "부산 기업 법률실무",
      href: "/부산기업법률자문",
      note: "기업 담당자용 절차 허브",
    },
  ],
  debt: [
    {
      title: "부산 개인회생",
      href: "/부산개인회생",
      note: "변제계획·신청서류 안내",
      documents: ["채무 목록", "소득·재산 자료"],
    },
    {
      title: "부산 개인파산",
      href: "/부산파산",
      note: "면책까지 절차 확인",
      documents: ["채무·재산 현황", "소득 자료"],
    },
    {
      title: "개인회생 상담",
      href: "/부산개인회생상담",
      note: "상담 전 확인 가이드",
    },
  ],
  collection: [
    {
      title: "지급명령·가압류·소장 안내",
      href: "/민사소송",
      note: "신청서류 중심 안내",
      documents: ["계약서", "거래명세서", "독촉 기록"],
    },
    {
      title: "내용증명 자가진단",
      href: "/내용증명자가진단",
      note: "발송 전 확인 항목",
    },
    {
      title: "지급명령 자가진단",
      href: "/지급명령자가진단",
      note: "신청 전 점검",
    },
  ],
  "court-docs": [
    {
      title: "등기·서류 상담",
      href: "/등기서류상담",
      note: "받은 서류·기한 확인",
      documents: ["받은 서류 사진", "통지일·제출기한"],
      deadlineHint: "서류에 적힌 기한을 먼저 확인하세요.",
    },
    {
      title: "상황별 안내",
      href: "/situations",
      note: "비슷한 상황 찾기",
    },
    {
      title: "상담 문의",
      href: "/contact",
      note: "서류 사진을 첨부해 문의",
    },
  ],
  unknown: [
    {
      title: "상황 선택형 상담",
      href: "/상담",
      note: "무슨 업무인지 몰라도 시작할 수 있습니다",
    },
    {
      title: "무슨 법률업무인지 모를 때",
      href: "/무슨법률업무인지모를때",
      note: "상황만 말해도 안내",
    },
    {
      title: "업무별 자가진단",
      href: "/자가진단",
      note: "주제별 체크리스트",
    },
  ],
};

export function resolveCounselSelector(
  category: CounselIntentCategory,
  stage: CounselIntentStage,
): CounselSelectorResult[] {
  const base = CATEGORY_RESULTS[category] ?? CATEGORY_RESULTS.unknown;
  if (stage === "court-notice") {
    return [
      ...CATEGORY_RESULTS["court-docs"].slice(0, 2),
      ...base.slice(0, 1),
    ].slice(0, 3);
  }
  if (stage === "deadline") {
    return base.map((item) => ({
      ...item,
      deadlineHint:
        item.deadlineHint ??
        "기한이 임박한 경우 상황·서류 사진을 먼저 남겨 주세요.",
    }));
  }
  return base.slice(0, 3);
}

/** 기업 허브용 선택기 결과 */
export function resolveBusinessSelector(
  category: CounselIntentCategory,
  stage: CounselIntentStage,
): CounselSelectorResult[] {
  if (category === "corporate" || category === "collection") {
    const corporate: CounselSelectorResult[] = [
      {
        title: "부산 법인설립등기",
        href: "/부산법인설립등기",
        note: "법인을 처음 설립하는 경우",
        documents: ["상호·목적·자본금", "임원 후보 정보"],
      },
      {
        title: "부산 임원변경등기",
        href: "/부산임원변경등기",
        note: "대표·임원 변경·임기",
        documents: ["등기사항증명서", "의사록 요약"],
        deadlineHint: "임원변경은 등기 기한이 있을 수 있습니다.",
      },
      {
        title: "부산 기업 채권관리",
        href: "/부산기업채권관리",
        note: "미수금·내용증명·지급명령",
        documents: ["계약서", "세금계산서", "독촉 기록"],
      },
      {
        title: "부산 기업 부동산등기",
        href: "/부산기업부동산등기",
        note: "회사 명의 부동산·근저당",
        documents: ["법인 등기부", "계약서"],
      },
      {
        title: "기업 업무 문의",
        href: "/기업업무문의",
        note: "회사명·업무·기한만 남겨 문의",
      },
    ];
    if (category === "collection") {
      return [
        corporate[2],
        {
          title: "지급명령 자가진단",
          href: "/지급명령자가진단",
          note: "신청 전 점검",
        },
        corporate[4],
      ];
    }
    if (stage === "deadline") {
      return [corporate[1], corporate[0], corporate[4]];
    }
    return corporate.slice(0, 3);
  }
  return resolveCounselSelector(category, stage);
}
