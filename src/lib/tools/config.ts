import type { ToolDefinition, ToolsHubConfig } from "./types";

export const toolsHub: ToolsHubConfig = {
  slug: "tools",
  path: "/tools",
  h1: "법률 계산기 — 기한·비용·서류를 대략 검토",
  intro:
    "상속등기 기한, 상속포기 3개월, 한정승인 기간, 법인등기 과태료, 임원변경등기 기한, 본점이전등기 기간 등을 빠르게 점검할 수 있는 검토용 도구입니다. 부산·해운대·센텀 다옴법무사사무소가 제공하며, 결과는 참고용이며 실제 사안은 서류 확인 후 달라질 수 있습니다.",
  metaDescriptionBase:
    "상속등기 비용(취득세·수수료)과 기한, 상속포기·한정승인 3개월, 지급명령 인지대·송달료, 임원변경 과태료, 본점이전등기, 전세보증금, 개인회생 소득·채무를 계산하는 법률 계산기 모음입니다.",
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
      "사망일(상속개시일)을 입력하면 상속포기·한정승인 3개월 기한과 등기 검토 시점을 참고용으로 안내합니다. 상속등기 자체에는 과태료가 없지만, 취득세는 상속개시일이 속한 달의 말일부터 6개월 안에 신고·납부해야 합니다.",
    metaDescriptionBase:
      "상속등기 기한 계산기. 사망일을 넣으면 상속포기·한정승인 3개월 기한과 상속 취득세 신고기한(사망한 달 말일부터 6개월)을 민법 기간 계산으로 보여 줍니다.",
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
          "상속등기 자체에는 신청기한과 과태료가 없습니다. 다만 상속 취득세는 사망한 달 말일부터 6개월(외국에 주소를 둔 상속인이 있으면 9개월) 안에 신고·납부해야 하고, 넘기면 가산세가 붙습니다. 상속포기·한정승인은 상속개시를 안 날부터 3개월 안에 해야 합니다.",
      },
      {
        question: "3개월·6개월은 어떻게 계산하나요?",
        answer:
          "사망한 날은 빼고 다음 날부터 셉니다. 예를 들어 1월 10일 사망이면 상속포기·한정승인 기한은 4월 10일, 취득세 신고기한은 7월 31일입니다. 마지막 날이 토요일·공휴일이면 그다음 날까지입니다.",
      },
    ],
    serviceSlug: "inheritance-registration",
  },
  {
    slug: "inheritance-registration-cost",
    path: "/tools/inheritance-registration-cost",
    calculatorType: "inheritance-registration-cost",
    cardTitle: "상속등기 비용 계산기",
    cardDescription: "취득세·교육세·등기신청수수료 계산",
    h1: "상속등기 비용 계산기: 취득세·등기수수료",
    intro:
      "상속받는 부동산의 시가표준액(공시가격)과 종류를 입력하면 상속 취득세·지방교육세·농어촌특별세와 등기신청수수료를 법정 세율로 계산합니다. 법무사 보수와 국민주택채권 할인 비용은 따로 안내합니다.",
    metaDescriptionBase:
      "상속등기 비용 계산기. 시가표준액 입력으로 상속 취득세 2.8%(농지 2.3%)·지방교육세·농특세, 무주택 1주택 특례 0.96%, 등기신청수수료를 계산합니다.",
    primaryKeywords: ["상속등기 비용 계산기", "상속 취득세 계산", "상속등기 비용", "상속 취득세율"],
    documents: [
      "주택공시가격 또는 개별공시지가 확인서",
      "등기부등본(부동산별)",
      "가족관계증명서(상세)·기본증명서·제적등본",
      "상속재산분할협의서(협의분할 시)",
    ],
    defaultActions: [
      "부동산별 시가표준액을 확인해야 합니다.",
      "무주택 특례·85㎡ 이하 여부를 확인해야 합니다.",
      "취득세 신고기한(사망한 달 말일부터 6개월)을 확인해야 합니다.",
    ],
    diagnosisLinks: [
      { href: "/상속등기자가진단", label: "상속등기 자가진단" },
      { href: "/tools/inheritance-registration-deadline", label: "상속등기 기한 계산기" },
    ],
    serviceLinks: [
      { href: "/상속등기비용", label: "상속등기 비용 안내" },
      { href: "/services/inheritance-registration", label: "상속등기 업무안내" },
      { href: "/상속취득세와등기순서", label: "상속 취득세와 등기 순서" },
    ],
    guideSections: [
      {
        id: "inheritance-cost-rates",
        title: "상속 취득세율과 부가세목",
        body: "상속으로 부동산을 취득하면 시가표준액을 과세표준으로 아래 세율이 적용됩니다.",
        items: [
          "주택·토지·건물(농지 외): 취득세 2.8% + 지방교육세 0.16% + 농어촌특별세 0.2% = 합계 3.16%",
          "전용면적 85㎡ 이하 주택: 농어촌특별세 비과세로 합계 2.96%",
          "농지(논·밭·과수원): 취득세 2.3% + 지방교육세 0.06% + 농어촌특별세 0.2% = 합계 2.56%",
          "무주택 가구가 상속으로 1가구 1주택이 되는 경우: 취득세 0.8% + 지방교육세 0.16% = 합계 0.96%(지방세법 제15조 제1항)",
          "취득가액 50만원 이하는 취득세를 부과하지 않습니다(지방세법 제17조).",
        ],
        links: [
          { href: "https://www.law.go.kr/법령/지방세법", label: "지방세법 원문(국가법령정보센터)" },
        ],
      },
      {
        id: "inheritance-cost-fees",
        title: "등기신청수수료와 그 밖의 비용",
        items: [
          "등기신청수수료: 부동산 1개마다 서면 20,000원, 전자표준양식 17,000원, 전자신청 20,000원(토지와 건물은 각각 1개, 2025년 8월 1일 개정)",
          "국민주택채권: 시가표준액과 지역에 따라 매입 금액이 정해지며, 바로 팔면 할인 비용만 부담합니다.",
          "제적등본·가족관계증명서 등 증명서 발급 비용은 따로 듭니다.",
          "법무사 보수는 상속인 수, 부동산 수, 협의 여부에 따라 달라 견적에서 공과금과 나누어 안내합니다.",
        ],
      },
      {
        id: "inheritance-cost-example",
        title: "계산 예시(이해를 위한 예시)",
        items: [
          "시가표준액 3억원, 전용 85㎡ 초과 아파트 1채(토지·건물 일괄 1개), 서면 신청: 취득세 8,400,000원 + 지방교육세 480,000원 + 농어촌특별세 600,000원 + 등기신청수수료 20,000원 = 9,500,000원",
          "같은 아파트를 무주택 가구가 상속받아 1주택이 되는 경우: 취득세 2,400,000원 + 지방교육세 480,000원 + 등기신청수수료 20,000원 = 2,900,000원",
        ],
      },
    ],
    faqs: [
      {
        question: "상속 취득세는 무엇을 기준으로 계산하나요?",
        answer:
          "상속은 무상취득이라 시가표준액(주택공시가격, 개별공시지가 등)을 과세표준으로 합니다. 매매처럼 실거래가를 기준으로 하지 않습니다.",
      },
      {
        question: "무주택 1주택 특례는 누가 받을 수 있나요?",
        answer:
          "상속인과 같은 세대의 가구원이 모두 무주택이고, 상속으로 1가구 1주택이 되는 경우 취득세율 0.8%가 적용됩니다. 공동상속이면 지분이 가장 큰 상속인 등 기준이 있어 가족관계와 주택 보유 현황을 함께 확인해야 합니다.",
      },
      {
        question: "취득세를 늦게 내면 어떻게 되나요?",
        answer:
          "사망한 달 말일부터 6개월 안에 신고·납부하지 않으면 신고불성실 가산세와 납부지연 가산세가 붙습니다. 상속등기 자체에는 과태료가 없습니다.",
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
      "청구 금액과 당사자 수를 입력하면 지급명령 신청 때 법원에 내는 인지액과 송달료를 법정 기준으로 계산합니다. 소송으로 넘어갈 때의 소장 인지액도 함께 보여 줍니다.",
    metaDescriptionBase:
      "지급명령 인지대·송달료 계산기. 청구금액과 당사자 수로 인지액(소장의 1/10)과 송달료(1인당 6회분)를 계산합니다. 부산 법무사 채권회수 상담.",
    guideSections: [
      {
        id: "payment-order-stamp",
        title: "지급명령 인지액 계산 기준",
        body: "지급명령 신청서에는 같은 금액으로 소장을 낼 때 붙이는 인지액의 10분의 1을 붙입니다(민사소송 등 인지법 제7조 제2항).",
        items: [
          "청구금액 1천만원 미만: 청구금액 × 0.0005",
          "1천만원 이상 1억원 미만: 청구금액 × 0.00045 + 500원",
          "1억원 이상 10억원 미만: 청구금액 × 0.0004 + 5,500원",
          "10억원 이상: 청구금액 × 0.00035 + 55,500원",
          "계산한 인지액이 1천원 미만이면 1천원, 1천원 이상이면 100원 미만은 버립니다.",
        ],
        links: [
          { href: "https://www.scourt.go.kr/nm/min_1/min_1_7/min_1_7_2/index.html", label: "대법원 전자민원센터 독촉절차 안내" },
        ],
      },
      {
        id: "payment-order-service-fee",
        title: "송달료와 이의신청 시 비용",
        items: [
          "송달료: 1회 5,640원(2026년 7월 1일부터) × 당사자 수 × 6회분을 미리 내고, 남으면 돌려받습니다.",
          "채무자가 지급명령을 받고 2주 안에 이의신청을 하면 소송으로 넘어가며, 소장 인지액과의 차액과 추가 송달료를 냅니다.",
          "예시(이해를 위한 예시): 청구금액 1,000만원, 당사자 2명이면 인지액 5,000원 + 송달료 67,680원 = 72,680원입니다.",
        ],
      },
    ],
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
          "법원에 내는 인지액은 지급명령이 소장의 10분의 1이고, 송달료도 지급명령은 당사자 1인당 6회분으로 소송보다 적습니다. 다만 채무자가 이의신청을 하면 소송으로 넘어가 차액을 더 내야 하므로, 다툼이 예상되면 처음부터 소송을 검토하기도 합니다.",
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
