import type { ToolDefinition, ToolsHubConfig } from "./types";

export const toolsHub: ToolsHubConfig = {
  slug: "tools",
  path: "/tools",
  h1: "법률 계산기 — 기한·비용·서류를 대략 검토",
  intro:
    "상속등기 기한, 상속포기 3개월, 한정승인 기간, 법인등기 과태료, 임원변경등기 기한, 본점이전등기 기간 등을 빠르게 점검할 수 있는 검토용 도구입니다. 부산·해운대·센텀 다옴법무사사무소가 제공하며, 결과는 참고용이며 실제 사안은 서류 확인 후 달라질 수 있습니다.",
  metaDescriptionBase:
    "상속등기 기한, 상속포기·한정승인 3개월, 법인 임원변경 과태료, 본점이전등기, 전세보증금, 지급명령, 부동산등기 서류, 개인회생 소득·채무를 대략 검토하는 법률 계산기 모음입니다. 부산 법무사 상담 연결.",
  faqs: [
    {
      question: "계산 결과만으로 절차를 진행해도 되나요?",
      answer:
        "아니요. 본 도구는 대략적인 검토용입니다. 관할·서류·당사자 상황에 따라 기한·비용·절차가 달라질 수 있어 상담·서류 확인이 필요합니다.",
    },
    {
      question: "부산 밖에서도 이용할 수 있나요?",
      answer:
        "네. 계산기는 무료로 이용 가능하며, 상담은 전화·카카오톡·네이버 톡톡·방문(예약)으로 진행할 수 있습니다.",
    },
    {
      question: "자가진단과 무엇이 다른가요?",
      answer:
        "법률 계산기는 날짜·금액 등을 입력해 기한·비용·서류를 빠르게 점검합니다. 자가진단은 질문에 답해 위험도와 절차 방향을 안내합니다.",
    },
  ],
};

export const toolDefinitions: ToolDefinition[] = [
  {
    slug: "inheritance-registration-deadline",
    path: "/tools/inheritance-registration-deadline",
    calculatorType: "inheritance-registration-deadline",
    cardTitle: "상속등기 기한 계산기",
    cardDescription: "사망일 기준 등기·3개월 기한 참고",
    h1: "상속등기 기한은 언제까지 확인해야 할까요?",
    intro:
      "사망일(상속개시일)을 입력하면 상속포기·한정승인 3개월 기한과 등기 검토 시점을 참고용으로 안내합니다. 상속등기 기한·과태료는 사안별로 달라 추가 확인이 필요합니다.",
    metaDescriptionBase:
      "상속등기 기한 계산기. 사망일 기준 상속포기·한정승인 3개월, 등기 검토 시점을 대략 확인. 부산·해운대 법무사 상담.",
    primaryKeywords: ["상속등기 기한", "상속등기 기간", "부산 법무사", "상속포기 3개월"],
    documents: [
      "가족관계증명서(상세)·기본증명서",
      "등기부등본·토지대장",
      "상속인 인감증명서",
      "협의분할협의서(해당 시)",
    ],
    defaultActions: [
      "상속인·재산 목록을 정리해야 합니다.",
      "채무 조회 후 상속포기·한정승인 여부를 검토해야 합니다.",
      "등기 접수 일정을 가족과 조율해야 합니다.",
    ],
    diagnosisLinks: [
      { href: "/상속등기자가진단", label: "상속등기 자가진단" },
      { href: "/한정승인자가진단", label: "한정승인 자가진단" },
    ],
    serviceLinks: [
      { href: "/services/inheritance-registration", label: "상속등기 업무안내" },
      { href: "/상속", label: "상속 종합 허브" },
    ],
    faqs: [
      {
        question: "상속등기에 법정 기한이 있나요?",
        answer:
          "상속포기·한정승인은 3개월 기한이 알려져 있습니다. 상속등기 자체는 사안마다 다르지만 지연 시 과태료 등을 검토해야 할 수 있습니다.",
      },
    ],
    serviceSlug: "inheritance-registration",
  },
  {
    slug: "inheritance-renunciation-deadline",
    path: "/tools/inheritance-renunciation-deadline",
    calculatorType: "inheritance-renunciation-deadline",
    cardTitle: "상속포기·한정승인 3개월 기한",
    cardDescription: "사망일 기준 3개월 기한 계산",
    h1: "상속포기·한정승인 3개월 기한은 언제까지인가요?",
    intro:
      "상속개시일(사망일)부터 3개월 기한을 참고용으로 계산합니다. 한정승인 기간·상속포기 기한은 사실관계 확인이 필요합니다.",
    metaDescriptionBase:
      "상속포기·한정승인 3개월 기한 계산기. 사망일 입력으로 기한 참고. 부산 법무사 상담.",
    primaryKeywords: ["상속포기 3개월", "한정승인 기간", "한정승인 기한", "부산 법무사"],
    documents: [
      "가족관계증명서·기본증명서",
      "채무조회 결과·재산목록",
      "상속인 인감증명서",
    ],
    defaultActions: [
      "채무·재산을 조사해야 합니다.",
      "상속인 전원의 방향(포기·한정·승인)을 논의해야 합니다.",
      "기한이 임박하면 서류 준비를 우선해야 합니다.",
    ],
    diagnosisLinks: [
      { href: "/상속포기자가진단", label: "상속포기 자가진단" },
      { href: "/한정승인자가진단", label: "한정승인 자가진단" },
    ],
    serviceLinks: [
      { href: "/services/inheritance-renunciation", label: "상속포기 안내" },
      { href: "/services/qualified-acceptance", label: "한정승인 안내" },
    ],
    faqs: [
      {
        question: "3개월을 넘기면 어떻게 되나요?",
        answer:
          "단순승인으로 보일 수 있어 채무까지 승인한 것으로 처리될 위험이 있을 수 있습니다. 빠른 확인이 필요합니다.",
      },
    ],
    serviceSlug: "qualified-acceptance",
  },
  {
    slug: "director-change-penalty-deadline",
    path: "/tools/director-change-penalty-deadline",
    calculatorType: "director-change-penalty",
    cardTitle: "임원변경등기 과태료 위험일",
    cardDescription: "변경일 기준 2주 등기 기한",
    h1: "법인 임원변경등기 과태료 위험일은 언제인가요?",
    intro:
      "임원 취임·사임·임기만료일을 입력하면 등기 신청 참고 기한(2주)과 과태료 검토 시점을 안내합니다. 법인등기 과태료는 지연 기간에 따라 달라질 수 있습니다.",
    metaDescriptionBase:
      "법인 임원변경등기 과태료·기한 계산기. 변경일 기준 2주 등기 신청 참고. 임원변경등기 기한, 부산 법무사.",
    primaryKeywords: ["임원변경등기 기한", "법인등기 과태료", "법인등기", "부산 법무사"],
    documents: [
      "법인 등기부등본·정관",
      "주주총회·이사회 의사록",
      "취임·사임 승낙서·인감증명서",
    ],
    defaultActions: [
      "정관상 결의 요건을 확인해야 합니다.",
      "등기 신청 서류를 작성해야 합니다.",
      "기한 경과 시 과태료 범위를 상담으로 확인해야 합니다.",
    ],
    diagnosisLinks: [{ href: "/임원변경등기자가진단", label: "임원변경등기 자가진단" }],
    serviceLinks: [
      { href: "/services/director-change", label: "임원변경등기 안내" },
      { href: "/법인등기", label: "법인등기 허브" },
    ],
    faqs: [
      {
        question: "임원변경등기를 늦으면 과태료가 부과되나요?",
        answer:
          "일정 기간 경과 시 과태료가 부과될 수 있습니다. 정확한 금액·기간은 사안별로 확인이 필요합니다.",
      },
    ],
    serviceSlug: "director-change",
  },
  {
    slug: "head-office-move-deadline",
    path: "/tools/head-office-move-deadline",
    calculatorType: "head-office-move-deadline",
    cardTitle: "본점이전등기 기한",
    cardDescription: "이전일 기준 2주 등기 참고",
    h1: "본점이전등기 기한은 언제까지인가요?",
    intro:
      "본점 이전일을 입력하면 등기 신청 참고 기한을 계산합니다. 본점이전등기 기간·관할 등기소 변경 여부는 주소에 따라 달라질 수 있습니다.",
    metaDescriptionBase:
      "본점이전등기 기간·기한 계산기. 이전일 기준 2주 참고. 법인등기, 부산·센텀 법무사.",
    primaryKeywords: ["본점이전등기 기간", "본점이전등기", "법인등기", "부산 법무사"],
    documents: [
      "주주총회·이사회 의사록",
      "새 주소 임대차계약서·등기필증",
      "법인 인감증명서",
    ],
    defaultActions: [
      "이사·주주 결의를 진행해야 합니다.",
      "관할 등기소를 확인해야 합니다.",
      "사업자등록증·통장 주소 갱신을 준비해야 합니다.",
    ],
    diagnosisLinks: [{ href: "/법인등기자가진단", label: "법인등기 자가진단" }],
    serviceLinks: [
      { href: "/services/corporate-registration", label: "법인등기 안내" },
      { href: "/센텀법인등기", label: "센텀 법인등기" },
    ],
    faqs: [
      {
        question: "본점이전만 하고 등기를 안 하면 어떤 문제가 있나요?",
        answer:
          "등기부와 실제 주소가 달라지면 금융·계약·실사에서 문제가 될 수 있고, 과태료가 부과될 수 있습니다.",
      },
    ],
    serviceSlug: "corporate-registration",
  },
  {
    slug: "jeonse-deposit-timeline",
    path: "/tools/jeonse-deposit-timeline",
    calculatorType: "jeonse-deposit-timeline",
    cardTitle: "전세보증금 반환 대응 일정",
    cardDescription: "만료일 기준 독촴·권리 확보 참고",
    h1: "전세보증금 반환 대응 일정은 어떻게 잡을까요?",
    intro:
      "전세 계약 만료일을 입력하면 독촴·협의·권리 확보 검토 일정을 참고용으로 안내합니다. 임차권등기명령·배당요구 기한은 별도 확인이 필요합니다.",
    metaDescriptionBase:
      "전세보증금 반환 대응 일정 계산기. 계약 만료 기준 참고 일정. 부산 법무사 임대차 상담.",
    primaryKeywords: ["전세보증금", "임차권등기명령", "부산 법무사"],
    documents: [
      "전세계약서·확정일자 계약서",
      "보증금 이체 증빙",
      "임대인 등기부등본",
      "내용증명·독촉 기록",
    ],
    defaultActions: [
      "확정일자·대항력 요건을 확인해야 합니다.",
      "임대인 재산·채무 상태를 조사해야 합니다.",
      "반환 지연 시 임차권등기명령 검토가 필요할 수 있습니다.",
    ],
    diagnosisLinks: [
      { href: "/전세보증금자가진단", label: "전세보증금 자가진단" },
      { href: "/임차권등기명령자가진단", label: "임차권등기명령 자가진단" },
    ],
    serviceLinks: [
      { href: "/임대차전세", label: "임대차·전세 허브" },
      { href: "/services/real-estate-registration", label: "부동산등기 안내" },
    ],
    faqs: [
      {
        question: "보증금을 못 받으면 무엇부터 해야 하나요?",
        answer:
          "계약서·확정일자·등기부를 확인하고, 독촉 기록을 남긴 뒤 임차권등기명령·배당요구 등을 검토해야 할 수 있습니다.",
      },
    ],
    serviceSlug: "real-estate-registration",
  },
  {
    slug: "payment-order-fee-check",
    path: "/tools/payment-order-fee-check",
    calculatorType: "payment-order-fee",
    cardTitle: "지급명령 준비금액 체크",
    cardDescription: "청구금액 기준 인지대·비용 참고",
    h1: "지급명령 신청 전 준비금액은 얼마나 될까요?",
    intro:
      "청구 금액을 입력하면 인지대·송달료 등을 합친 대략적인 비용 구간을 참고용으로 안내합니다. 실제 금액은 관할·송달 횟수에 따라 달라집니다.",
    metaDescriptionBase:
      "지급명령 신청 비용·인지대 대략 계산. 청구금액 기준 참고. 부산 법무사 채권회수 상담.",
    primaryKeywords: ["지급명령", "부산 법무사", "채권회수"],
    documents: [
      "계약서·차용증·영수증",
      "이체 내역·증거 자료",
      "채무자 주소 확인 서류",
    ],
    defaultActions: [
      "채권 원인·금액을 서류로 정리해야 합니다.",
      "소멸시효를 확인해야 합니다.",
      "지급명령 vs 소장 경로를 검토해야 합니다.",
    ],
    diagnosisLinks: [{ href: "/지급명령자가진단", label: "지급명령 자가진단" }],
    serviceLinks: [
      { href: "/민사소송", label: "민사·채권 허브" },
      { href: "/부산지방법원지급명령", label: "부산지방법원 지급명령" },
    ],
    faqs: [
      {
        question: "지급명령과 소송 비용 차이는?",
        answer:
          "지급명령은 비교적 간단하지만, 분쟁이 크면 소장이 필요할 수 있습니다. 비용은 청구금액·절차에 따라 달라집니다.",
      },
    ],
  },
  {
    slug: "real-estate-documents-check",
    path: "/tools/real-estate-documents-check",
    calculatorType: "real-estate-documents",
    cardTitle: "부동산등기 준비서류 체크",
    cardDescription: "매매·증여·상속별 서류 목록",
    h1: "부동산등기에 어떤 서류가 필요할까요?",
    intro:
      "등기 유형(매매·증여·상속 등)과 근저당 유무를 선택하면 우선 확인하면 좋은 서류 목록을 안내합니다. 관할·특수 사정에 따라 추가 서류가 필요할 수 있습니다.",
    metaDescriptionBase:
      "부동산등기 준비서류 체크 계산기. 매매·증여·상속별 서류 목록. 소유권이전등기, 부산 법무사.",
    primaryKeywords: ["부동산등기", "소유권이전등기", "부산 법무사"],
    documents: [
      "등기부등본·토지대장",
      "매도인·매수인 인감증명서",
      "등기원인 증명 계약서",
    ],
    defaultActions: [
      "등기부등본으로 권리관계를 확인해야 합니다.",
      "매도인·매수인 일정을 맞춰야 합니다.",
      "취득세·등기 접수 순서를 확인해야 합니다.",
    ],
    diagnosisLinks: [
      { href: "/부동산등기자가진단", label: "부동산등기 자가진단" },
      { href: "/소유권이전등기자가진단", label: "소유권이전등기 자가진단" },
    ],
    serviceLinks: [
      { href: "/services/ownership-transfer", label: "소유권이전등기 안내" },
      { href: "/부동산등기", label: "부동산등기 허브" },
    ],
    faqs: [
      {
        question: "근저당이 있으면 서류가 더 필요한가요?",
        answer:
          "말소·승낙 절차가 추가될 수 있어 채권자 확인서 등이 필요할 수 있습니다.",
      },
    ],
    serviceSlug: "ownership-transfer",
  },
  {
    slug: "rehab-income-debt-check",
    path: "/tools/rehab-income-debt-check",
    calculatorType: "rehab-income-debt",
    cardTitle: "개인회생 소득·채무 체크",
    cardDescription: "월 소득·총 채무 비율 참고",
    h1: "개인회생 상담 전 월 소득·채무를 점검해 볼까요?",
    intro:
      "월 소득과 총 채무액을 입력하면 연 소득 대비 채무 비율을 참고용으로 계산합니다. 개인회생·파산 요건은 재산·담보·부양가족 등에 따라 달라집니다.",
    metaDescriptionBase:
      "개인회생 상담 전 월 소득·채무 체크. 채무 비율 참고. 부산회생법원, 부산 법무사.",
    primaryKeywords: ["개인회생", "부산 법무사", "개인파산"],
    documents: [
      "채무 목록·잔액증명서",
      "소득 증빙(급여·사업)",
      "재산 목록·가족관계증명서",
    ],
    defaultActions: [
      "채권자별 채무를 정리해야 합니다.",
      "담보·부양가족·재산을 함께 확인해야 합니다.",
      "급여압류가 있다면 우선 상담을 검토해야 합니다.",
    ],
    diagnosisLinks: [
      { href: "/개인회생자가진단", label: "개인회생 자가진단" },
      { href: "/개인파산자가진단", label: "개인파산 자가진단" },
    ],
    serviceLinks: [
      { href: "/services/personal-rehabilitation", label: "개인회생 안내" },
      { href: "/부산개인회생", label: "부산 개인회생" },
    ],
    faqs: [
      {
        question: "채무가 소득보다 많으면 무조건 회생인가요?",
        answer:
          "아닙니다. 재산·담보·가족 상황에 따라 회생·파산·워크아웃 등 방향이 달라질 수 있어 상담이 필요합니다.",
      },
    ],
    serviceSlug: "personal-rehabilitation",
  },
];

export function getToolBySlug(slug: string): ToolDefinition | undefined {
  return toolDefinitions.find((tool) => tool.slug === slug);
}

export function getAllToolSlugs(): string[] {
  return toolDefinitions.map((tool) => tool.slug);
}

export function getAllToolDefinitions(): ToolDefinition[] {
  return toolDefinitions;
}
