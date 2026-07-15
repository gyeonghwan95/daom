import type { SituationPage, SituationsHubConfig } from "./types";

const LOCAL_CONTEXT =
  "부산 해운대구·센텀, 재송동·반여동 일대에서도 전화·카카오톡·방문(예약) 상담이 가능합니다.";

export const situationsHub: SituationsHubConfig = {
  slug: "situations",
  path: "/situations",
  h1: "지금 겪는 문제, 어디서부터 확인해야 할까요?",
  intro:
    "상속·등기·전세·법인·채무처럼 업무명을 모를 때도 괜찮습니다. 실제로 많이 검색하는 생활 상황별로, 먼저 확인할 것·혼자 가능한 범위·상담이 필요한 경우를 정리했습니다. 부산·해운대·센텀에 있는 다옴법무사사무소가 절차와 서류를 함께 검토해 드립니다.",
  metaDescriptionBase:
    "상속·등기·전세·법인·채무 등 생활 속 법률문제를 상황별로 정리했습니다. 먼저 확인할 것, 혼자 처리 가능 여부, 필요 서류와 절차, 관련 자가진단·FAQ·업무안내 링크를 제공합니다.",
  faqs: [
    {
      question: "업무명을 몰라도 상담할 수 있나요?",
      answer:
        "네. ‘부모님이 돌아가셨다’, ‘전세보증금을 못 받았다’처럼 상황만 말씀해 주셔도 됩니다. 해운대·센텀 사무소에서 전화·카카오톡·네이버 톡톡으로 먼저 방향을 잡아 드립니다.",
    },
    {
      question: "부산 밖에 살아도 진행할 수 있나요?",
      answer:
        "가능합니다. 서류를 우편·전자·카카오톡으로 받아 원격 진행하는 사건도 많습니다. 다만 상속·회생 등은 초기 사실관계 확인을 위해 상담을 권합니다.",
    },
    {
      question: "자가진단과 상황별 안내는 무엇이 다른가요?",
      answer:
        "자가진단은 질문에 답해 위험도와 다음 절차를 안내합니다. 상황별 안내는 검색하신 생활 문제를 기준으로 체크리스트·서류·상담 필요 시점을 먼저 정리한 페이지입니다. 둘 다 무료로 활용하실 수 있습니다.",
    },
  ],
};

export const situationPages: SituationPage[] = [
  {
    slug: "parent-passed-away",
    path: "/situations/parent-passed-away",
    cardTitle: "부모님이 돌아가셨을 때",
    cardDescription: "상속인 확인, 등기 기한, 서류부터 정리",
    h1: "부모님이 돌아가셨는데 상속등기는 언제·어떻게 해야 하나요?",
    metaDescriptionBase:
      "부모님 사망 후 상속인 확인, 상속등기 기한, 필요 서류, 형제 간 협의 방법을 정리했습니다. 부산·해운대·센텀에서 상속등기 상담이 가능합니다.",
    intro: `사망 사실을 접하면 장례와 행정 처리가 먼저입니다. 그다음 상속인이 누구인지, 부동산이 있는지, 등기를 언제까지 해야 하는지를 확인해야 합니다. ${LOCAL_CONTEXT}`,
    situationChecklist: [
      "최근 부모님(피상속인)이 돌아가셨다",
      "부모님 명의 부동산·예금·차량이 있는지 확실하지 않다",
      "상속인이 본인 포함 몇 명인지 정리되지 않았다",
      "상속등기·상속포기·한정승인 중 무엇을 해야 할지 모르겠다",
      "형제자매와 연락이 잘 되지 않거나 의견이 갈린다",
    ],
    firstChecks: [
      "가족관계증명서(상세)·기본증명서로 상속인 범위 확인",
      "부동산은 등기부등본, 금융자산은 은행·보험 문의",
      "상속개시일(사망일)부터 상속포기·한정승인 기한(3개월) 확인",
      "상속등기 미이행 시 과태료·세무 이슈 가능성 점검",
      "부모님 유언장·재산목록·채무 유무 대략 파악",
    ],
    selfHandleCases: [
      "상속재산이 단순하고 상속인 전원 협의가 된 경우 — 서류 준비 후 등기 신청 가능",
      "금융사·보험사가 요구하는 상속 관련 서류는 각 기관 안내대로 제출",
      "상속인 명부·인감 등 기본 서류는 직접 발급 가능",
    ],
    lawyerNeededCases: [
      "상속인이 여럿이고 협의가 어려운 경우",
      "담보대출·임차인·점유 등 부동산 권리관계가 복잡한 경우",
      "채무 규모를 모르거나 한정승인·상속포기 검토가 필요한 경우",
      "해외 재산·법인 지분·분양권 등 특수 재산이 있는 경우",
    ],
    documents: [
      "피상속인 기준 가족관계증명서(상세)·기본증명서",
      "상속인 전원 인감증명서·인감도장",
      "등기부등본·토지대장(부동산 해당 시)",
      "협의분할협의서 또는 유언장(해당 시)",
      "채무·담보 관련 서류(한정승인·포기 검토 시)",
    ],
    procedures: [
      "사망 신고·장례 후 상속인·재산 목록 파악",
      "상속포기·한정승인 기한(3개월) 내 방향 결정",
      "상속인 협의 및 분할 방법 정리",
      "필요 서류 발급·작성",
      "관할 등기소에 상속등기 신청",
      "등기 완료 후 세무·금융 후속 처리",
    ],
    diagnosisLinks: [
      { href: "/상속등기자가진단", label: "상속등기 자가진단" },
      { href: "/상속포기자가진단", label: "상속포기 자가진단" },
      { href: "/한정승인자가진단", label: "한정승인 자가진단" },
    ],
    serviceLinks: [
      { href: "/services/inheritance-registration", label: "상속등기 업무안내" },
      { href: "/services/inheritance-renunciation", label: "상속포기 안내" },
      { href: "/services/qualified-acceptance", label: "한정승인 안내" },
      { href: "/상속", label: "상속 종합 허브" },
    ],
    faqLinks: [
      { href: "/faq/when-to-file-inheritance-registration", label: "상속등기 신청 시기" },
      { href: "/faq/who-needs-inheritance-registration", label: "상속등기가 필요한 경우" },
      { href: "/faq/multiple-heirs-inheritance-registration", label: "상속인이 여럿일 때" },
      { href: "/faq/inheritance-registration-cost", label: "상속등기 비용" },
    ],
    extraLinks: [
      { href: "/blog/busan-inheritance-registration-procedure-documents", label: "부산 상속등기 절차·서류" },
      { href: "/services/cases/haeundae-inheritance-registration-case", label: "해운대 상속등기 사례" },
      { href: "/해운대구상속등기", label: "해운대구 상속등기" },
      { href: "/부산상속등기", label: "부산 상속등기" },
    ],
    faqs: [
      {
        question: "상속등기는 꼭 해야 하나요?",
        answer:
          "부동산이 있는 경우 상속인 명의로 등기하지 않으면 매매·담보 설정 등에 제한이 생길 수 있습니다. 기한 내 신청하지 않으면 과태료가 부과될 수 있어, 사망 후 빠르게 확인하는 것이 좋습니다.",
      },
      {
        question: "형제가 협조하지 않으면 어떻게 하나요?",
        answer:
          "상속인 전원의 협의가 필요한 경우가 많습니다. 연락이 되지 않거나 의견이 갈리면 법무사 상담을 통해 협의분할·공유 형태·소송 필요 여부를 검토할 수 있습니다.",
      },
    ],
    serviceSlug: "inheritance-registration",
  },
  {
    slug: "siblings-not-cooperating",
    path: "/situations/siblings-not-cooperating",
    cardTitle: "형제자매가 상속 협조를 안 할 때",
    cardDescription: "연락 두절·의견 불일치 대응",
    h1: "형제자매가 상속 서류에 협조하지 않으면 어떻게 해야 하나요?",
    metaDescriptionBase:
      "상속 등기·분할에서 형제자매 협조가 안 될 때 확인할 절차, 협의분할·공유 등기, 법적 대응 시점을 정리했습니다. 부산 법무사 상담 안내.",
    intro: `상속인이 여럿이면 서명·인감·협의가 모두 필요합니다. 한 명이라도 연락이 두절되거나 거부하면 등기가 멈춥니다. 먼저 협의 가능 범위를 확인하고, 필요 시 법적 절차를 검토해야 합니다. ${LOCAL_CONTEXT}`,
    situationChecklist: [
      "상속인 중 일부가 연락이 되지 않는다",
      "등기·분할 방식에 대해 형제자매 의견이 다르다",
      "인감증명서·서명을 거부한다는 말을 들었다",
      "특정 상속인만 재산을 가져가려 한다",
      "부모님 유언이 있었는데 일부가 인정하지 않는다",
    ],
    firstChecks: [
      "상속인 전원 명단·지분 비율(법정상속분) 확인",
      "협의분할이 가능한지, 공유 등기가 필요한지 판단",
      "유언장 유효 여부·공증 유언 여부 확인",
      "각 상속인의 최근 주소·연락처 파악",
      "등기·소송 전 협상 기록(문자·내용증명) 정리",
    ],
    selfHandleCases: [
      "전원이 협의분할에 동의하고 서류 준비가 가능한 경우",
      "공유 등기로 일단 명의 정리 후 나중에 분할하는 방안 합의",
      "가족 회의로 분할안을 문서화할 수 있는 경우",
    ],
    lawyerNeededCases: [
      "상속인 일부가 장기간 연락 두절·서명 거부",
      "유언 효력·상속분 다툼이 있는 경우",
      "특정 재산만 독점하려는 정황이 있는 경우",
      "협의가 불가능해 상속재산분할심판·유류분 청구 검토가 필요한 경우",
    ],
    documents: [
      "가족관계증명서(상세)·기본증명서",
      "상속인 각각의 인감증명서(협의 시)",
      "등기부등본·재산 목록",
      "협의분할협의서 초안",
      "유언장·녹취·문자 등 협의 관련 증거",
    ],
    procedures: [
      "상속인 전원 현황·법정상속분 정리",
      "협의분할·공유 등기·분할 방향 가족 간 논의",
      "협조 거부 시 내용증명 등 의사 표시",
      "협의 불가 시 상속재산분할·유류분 등 법적 절차 검토",
      "합의 또는 판결에 따른 등기 신청",
    ],
    diagnosisLinks: [
      { href: "/상속등기자가진단", label: "상속등기 자가진단" },
      { href: "/한정승인자가진단", label: "한정승인 자가진단" },
    ],
    serviceLinks: [
      { href: "/services/inheritance-registration", label: "상속등기 업무안내" },
      { href: "/services/qualified-acceptance", label: "한정승인 안내" },
      { href: "/상속", label: "상속 종합 허브" },
    ],
    faqLinks: [
      { href: "/faq/multiple-heirs-inheritance-registration", label: "상속인이 여럿일 때" },
      { href: "/faq/renouncing-share-vs-full-renunciation", label: "지분 포기와 전부 포기" },
      { href: "/faq/qualified-acceptance-procedure", label: "한정승인 절차" },
    ],
    extraLinks: [
      { href: "/services/cases/jaesong-inheritance-renunciation-consultation", label: "재송동 상속포기 상담 사례" },
      { href: "/blog/inheritance-renunciation-vs-qualified-acceptance", label: "상속포기 vs 한정승인" },
      { href: "/재송동법무사", label: "재송동 법무사" },
      { href: "/faq", label: "FAQ 전체" },
    ],
    faqs: [
      {
        question: "협조하지 않는 상속인 때문에 등기가 안 되나요?",
        answer:
          "협의분할 등기는 원칙적으로 상속인 전원의 협의와 서류가 필요합니다. 협조가 없으면 공유 등기 후 분할하거나, 협의가 불가능할 때 법원 절차를 검토해야 할 수 있습니다.",
      },
    ],
    serviceSlug: "inheritance-registration",
  },
  {
    slug: "inheritance-unknown-debt",
    path: "/situations/inheritance-unknown-debt",
    cardTitle: "빚이 있는지 모르는 상속 문제",
    cardDescription: "채무 조사·한정승인·포기 판단",
    h1: "부모님 빚이 있는지 모르는데 상속을 받아도 될까요?",
    metaDescriptionBase:
      "상속 채무를 모를 때 확인 방법, 한정승인·상속포기 기한, 채무조회 절차를 정리했습니다. 부산·센텀 법무사가 상속 방향을 함께 검토합니다.",
    intro: `단순 승인으로 상속하면 채무도 함께 떠안을 수 있습니다. 사망 후 3개월 안에 한정승인·상속포기 여부를 결정해야 하므로, 채무 조사가 우선입니다. ${LOCAL_CONTEXT}`,
    situationChecklist: [
      "부모님 명의 대출·보증·카드 채무가 있는지 모르겠다",
      "상속재산보다 채무가 많을까 걱정된다",
      "한정승인·상속포기 중 무엇이 맞는지 헷갈린다",
      "사망 후 시간이 지나 기한을 놓칠까 불안하다",
      "형제 중 누가 채무를 알고 있는지도 불분명하다",
    ],
    firstChecks: [
      "사망일(상속개시일)부터 3개월 기한 확인 — 한정승인·포기",
      "금융감독원 채무조회·각 금융기관 문의",
      "부동산 담보·연대보증·사업자 채무 여부 조사",
      "상속재산 가액과 채무 규모 대략 비교",
      "상속인 전원이 같은 방향(승인·한정·포기)으로 움직이는지 확인",
    ],
    selfHandleCases: [
      "채무가 없거나 재산 대비 명확히 적은 경우 — 단순 승인·등기 가능",
      "전 상속인이 한정승인·포기에 동의하고 서류 준비가 되는 경우",
      "금융기관 안내대로 채무 확인서를 직접 요청하는 경우",
    ],
    lawyerNeededCases: [
      "채무 규모가 불분명하거나 숨은 보증이 의심되는 경우",
      "재산보다 채무가 많아 보이는 경우",
      "상속인 간 한정승인·포기 의견이 다른 경우",
      "기한이 임박했거나 이미 기한을 넘긴 것 같을 때",
    ],
    documents: [
      "가족관계증명서·기본증명서",
      "피상속인 채무조회 결과·금융기관 확인서",
      "재산목록(부동산·예금·보험 등)",
      "한정승인·상속포기 신고 관련 서류",
      "상속인 인감증명서",
    ],
    procedures: [
      "사망일 확인 후 3개월 기한 체크",
      "채무·재산 조사",
      "단순 승인·한정승인·상속포기 방향 결정",
      "가정법원 또는 관할 기관에 한정승인·포기 신고(해당 시)",
      "상속등기 또는 포기·한정 후속 절차",
    ],
    diagnosisLinks: [
      { href: "/한정승인자가진단", label: "한정승인 자가진단" },
      { href: "/상속포기자가진단", label: "상속포기 자가진단" },
      { href: "/상속등기자가진단", label: "상속등기 자가진단" },
    ],
    serviceLinks: [
      { href: "/services/qualified-acceptance", label: "한정승인 안내" },
      { href: "/services/inheritance-renunciation", label: "상속포기 안내" },
      { href: "/services/inheritance-registration", label: "상속등기 안내" },
      { href: "/상속", label: "상속 종합 허브" },
    ],
    faqLinks: [
      { href: "/faq/what-is-qualified-acceptance", label: "한정승인이란" },
      { href: "/faq/when-to-choose-qualified-acceptance", label: "한정승인 선택 시기" },
      { href: "/faq/what-is-inheritance-renunciation", label: "상속포기란" },
      { href: "/faq/inheritance-renunciation-deadline", label: "상속포기 기한" },
    ],
    extraLinks: [
      { href: "/blog/inheritance-renunciation-vs-qualified-acceptance", label: "상속포기 vs 한정승인 비교" },
      { href: "/부산한정승인", label: "부산 한정승인" },
      { href: "/부산상속포기", label: "부산 상속포기" },
      { href: "/services/cases/dongnae-qualified-acceptance-consultation", label: "한정승인 상담 사례" },
    ],
    faqs: [
      {
        question: "한정승인 기한을 놓치면 어떻게 되나요?",
        answer:
          "3개월 내 한정승인·상속포기를 하지 않으면 단순승인으로 보일 수 있어, 채무까지 승인한 것으로 처리될 위험이 있습니다. 사망 직후 기한 확인이 중요합니다.",
      },
    ],
    serviceSlug: "qualified-acceptance",
  },
  {
    slug: "real-estate-sale-registration",
    path: "/situations/real-estate-sale-registration",
    cardTitle: "부동산 매매 후 등기 문제",
    cardDescription: "소유권이전·말소·지연 대응",
    h1: "집을 샀는데 소유권이전등기가 안 되거나 문제가 생겼어요",
    metaDescriptionBase:
      "부동산 매매 후 소유권이전등기 지연, 근저당 말소, 서류 누락 등 문제 해결 절차를 정리했습니다. 부산·해운대 법무사 등기 상담.",
    intro: `잔금을 치렀는데 등기가 안 되면 내 집이 아닙니다. 매도인·중개인·대출·근저당 말소 등 변수가 많아, 계약서와 등기부등본을 먼저 대조해야 합니다. ${LOCAL_CONTEXT}`,
    situationChecklist: [
      "잔금은 치렀는데 소유권이전등기가 되지 않았다",
      "등기부에 근저당·가압류가 남아 있다",
      "매도인이 서류 제출·인감을 미룬다",
      "중개사만 연락되고 매도인 연락이 두절됐다",
      "등기 완료 전에 또 다른 권리가 설정됐다는 말을 들었다",
    ],
    firstChecks: [
      "최신 등기부등본으로 소유자·근저당·가압류·가처분 확인",
      "매매계약서상 잔금·등기 이전 기한·특약 확인",
      "매도인 인감·서류·대리 등기 가능 여부 확인",
      "대출 실행·말소 조건이 계약과 일치하는지 확인",
      "중개대장·영수증·잔금 이체 증빙 보관",
    ],
    selfHandleCases: [
      "서류만 보완하면 되는 단순 지연 — 매도인과 일정 조율 후 등기",
      "근저당 말소가 계약대로 진행 중인 경우 — 말소 등기 후 이전",
      "매수인이 직접 등기소 제출이 가능한 서류가 갖춰진 경우",
    ],
    lawyerNeededCases: [
      "매도인이 등기 협조를 거부하거나 연락 두절",
      "가압류·가처분·추가 담보 등 권리 하자 발견",
      "계약 위반·손해배상·등기절차 이행 청구 검토가 필요한 경우",
      "법인·신탁·공유 부동산 등 등기 구조가 복잡한 경우",
    ],
    documents: [
      "매매계약서·중개대장",
      "등기부등본·토지대장",
      "매도인·매수인 인감증명서·신분증",
      "잔금 이체 증빙·영수증",
      "대출·말소 관련 서류(해당 시)",
    ],
    procedures: [
      "등기부등본·계약서 대조",
      "하자(담보·가압류 등) 확인 및 말소 일정 확보",
      "소유권이전등기 서류 작성·인감",
      "관할 등기소 접수",
      "등기 완료 확인·등기부등본 재발급",
    ],
    diagnosisLinks: [
      { href: "/소유권이전등기자가진단", label: "소유권이전등기 자가진단" },
      { href: "/부동산등기자가진단", label: "부동산등기 자가진단" },
    ],
    serviceLinks: [
      { href: "/services/ownership-transfer", label: "소유권이전등기 안내" },
      { href: "/services/real-estate-registration", label: "부동산등기 안내" },
      { href: "/부동산등기", label: "부동산등기 허브" },
    ],
    faqLinks: [
      { href: "/faq/ownership-transfer-documents", label: "소유권이전 서류" },
      { href: "/faq/inheritance-registration-with-mortgage", label: "근저당 있는 부동산" },
    ],
    extraLinks: [
      { href: "/blog/real-estate-ownership-transfer-procedure", label: "소유권이전 절차" },
      { href: "/services/cases/centum-ownership-transfer-case", label: "센텀 소유권이전 사례" },
      { href: "/부산부동산등기", label: "부산 부동산등기" },
      { href: "/센텀부동산등기", label: "센텀 부동산등기" },
    ],
    faqs: [
      {
        question: "잔금 후 등기가 늦어지면 위험한가요?",
        answer:
          "등기 전에는 법적으로 소유권이 넘어오지 않았을 수 있습니다. 매도인 채무로 가압류가 들어오면 매수인에게도 피해가 갈 수 있어, 계약 특약과 등기 일정을 빠르게 확인해야 합니다.",
      },
    ],
    serviceSlug: "ownership-transfer",
  },
  {
    slug: "jeonse-deposit-unpaid",
    path: "/situations/jeonse-deposit-unpaid",
    cardTitle: "전세보증금을 못 받았을 때",
    cardDescription: "임차권등기·내용증명·배당",
    h1: "전세보증금을 돌려받지 못했는데 어떻게 해야 하나요?",
    metaDescriptionBase:
      "전세보증금 미반환 시 확정일자·임차권등기명령·배당요구·내용증명 등 대응 순서를 정리했습니다. 부산 임대차·전세 분쟁 법무사 상담.",
    intro: `계약 만료 후에도 보증금이 돌아오지 않으면, 임대인 재산·우선변제권·기한을 동시에 봐야 합니다. 말로만 독촉하기보다 서류로 권리를 고정하는 것이 중요합니다. ${LOCAL_CONTEXT}`,
    situationChecklist: [
      "전세 계약이 끝났는데 보증금을 돌려받지 못했다",
      "임대인이 일부만 돌려주겠다고 한다",
      "집주인에게 다른 채무·경매 이야기를 들었다",
      "이미 새 세입자가 들어온 것 같다",
      "보증금 반환 독촉을 여러 번 했지만 소용없다",
    ],
    firstChecks: [
      "전세계약서·확정일자·주택 임대차 신고 여부 확인",
      "등기부등본으로 임대인 소유·근저당·경매 개시 여부 확인",
      "임차권등기명령·배당요구 기한(대항력·우선변제 관련) 점검",
      "내용증명·합의 녹취 등 증거 확보",
      "전세보증보험·HUG 등 가입 여부 확인",
    ],
    selfHandleCases: [
      "임대인과 반환 일정·분할 반환이 문서로 합의된 경우",
      "보증보험 청구 요건을 갖춘 경우 — 보험사 절차 진행",
      "단순 연체로 합의가 가능한 경우 — 내용증명 후 일정 확정",
    ],
    lawyerNeededCases: [
      "임대인이 연락 두절·재산 처분·경매 진행",
      "대항력·우선변제권 확보를 위해 임차권등기명령이 급한 경우",
      "지급명령·소송·강제집행 검토가 필요한 경우",
      "보증금 규모가 크고 다수 채권자가 있는 경우",
    ],
    documents: [
      "전세계약서·확정일자 받은 계약서",
      "보증금 이체·영수 증빙",
      "등기부등본·임대인 신원 확인 서류",
      "내용증명·독촉 기록",
      "전세보증보험 관련 서류(해당 시)",
    ],
    procedures: [
      "계약·확정일자·대항력 요건 확인",
      "임대인 재산·채무 상태 조사",
      "내용증명 등 독촉·협의",
      "임차권등기명령·배당요구 등 권리 확보",
      "지급명령·소송·집행 등 후속 조치",
    ],
    diagnosisLinks: [
      { href: "/전세보증금자가진단", label: "전세보증금 자가진단" },
      { href: "/임차권등기명령자가진단", label: "임차권등기명령 자가진단" },
      { href: "/내용증명자가진단", label: "내용증명 자가진단" },
    ],
    serviceLinks: [
      { href: "/임대차전세", label: "임대차·전세 허브" },
      { href: "/민사소송", label: "민사·채권 허브" },
    ],
    faqLinks: [
      { href: "/faq/jeonse-registration-faq", label: "전세권·임차권 FAQ" },
    ],
    extraLinks: [
      { href: "/blog/jeonse-right-vs-lease-registration-order", label: "전세권 vs 임차권등기명령" },
      { href: "/수영구전세권설정", label: "수영구 전세 관련" },
      { href: "/faq", label: "FAQ 더 보기" },
      { href: "/contact", label: "상담 문의" },
    ],
    faqs: [
      {
        question: "임차권등기명령은 언제 필요한가요?",
        answer:
          "임대인에게 다른 채권자가 있거나 경매가 진행될 때, 임차인의 우선변제권을 지키기 위해 검토합니다. 대항력 요건과 함께 기한이 촉박할 수 있어 빠른 확인이 필요합니다.",
      },
    ],
    serviceSlug: "real-estate-registration",
  },
  {
    slug: "corporate-officer-address-change",
    path: "/situations/corporate-officer-address-change",
    cardTitle: "법인 임원·주소·본점 변경",
    cardDescription: "임기 만료·과태료·등기 누락",
    h1: "법인 임원 임기가 지났거나 주소·본점을 바꿔야 할 때 무엇부터 하나요?",
    metaDescriptionBase:
      "법인 임원 변경등기, 본점·주소 변경, 임기 만료 과태료를 피하는 절차와 서류를 정리했습니다. 부산·센텀 법인등기 법무사 상담.",
    intro: `임원 임기 만료·사임·주소 변경·본점 이전은 각각 등기 사유입니다. 신고를 미루면 과태료가 붙고, 은행·거래처 실사에서 문제가 될 수 있습니다. ${LOCAL_CONTEXT}`,
    situationChecklist: [
      "대표이사·이사 임기가 만료됐는데 등기를 안 했다",
      "본점·사무소 주소를 이전했지만 법인등기가 옛날 주소다",
      "임원이 사임했는데 등기부에 그대로 남아 있다",
      "취임·선임 후 법인 인감·통장이 안 맞는다",
      "과태료 통지를 받았거나 받을까 걱정된다",
    ],
    firstChecks: [
      "등기부등본·정관으로 현재 임원·임기·본점 확인",
      "주주총회·이사회 결의 요건(정관) 확인",
      "임기 만료·사임·주소변경 등 신고 기한·과태료 규정 확인",
      "인감·통장·사업자등록증 등 실무 서류와 등기 일치 여부",
      "본점 이전 시 관할 등기소 변경 여부",
    ],
    selfHandleCases: [
      "정관대로 결의가 끝나고 서류·인감이 준비된 단순 변경등기",
      "주소 변경만 해당하고 결의 서류가 갖춰진 경우",
    ],
    lawyerNeededCases: [
      "임기 경과가 길어 과태료·보정이 우려되는 경우",
      "주주 간 의견 충돌·결의 하자가 있는 경우",
      "본점 이전·정관 변경·임원 구성이 동시에 필요한 경우",
      "법인 인감·서류가 맞지 않아 은행·계약에 지장이 있는 경우",
    ],
    documents: [
      "법인 등기부등본·정관",
      "주주총회·이사회 의사록",
      "취임·사임 승낙서·인감증명서",
      "본점·주소 관련 임대차계약서·등기필증(해당 시)",
      "법인 인감카드·인감증명서",
    ],
    procedures: [
      "등기부·정관 확인",
      "주주총회·이사회 결의",
      "등기 신청서·첨부서류 작성",
      "관할 등기소 접수",
      "등기 완료 후 사업자등록·통장·계약서 주소 갱신",
    ],
    diagnosisLinks: [
      { href: "/임원변경등기자가진단", label: "임원변경등기 자가진단" },
      { href: "/법인등기자가진단", label: "법인등기 자가진단" },
    ],
    serviceLinks: [
      { href: "/services/director-change", label: "임원변경등기 안내" },
      { href: "/services/corporate-registration", label: "법인등기 안내" },
      { href: "/법인등기", label: "법인등기 허브" },
    ],
    faqLinks: [
      { href: "/faq/director-change-deadline-faq", label: "임원변경 기한·과태료" },
      { href: "/faq/corporate-address-change-faq", label: "법인 주소 변경" },
      { href: "/faq/capital-increase-registration-faq", label: "증자 등기 FAQ" },
    ],
    extraLinks: [
      { href: "/blog/director-change-registration-deadline-penalty", label: "임원변경 과태료" },
      { href: "/services/cases/yeonje-director-change-case", label: "임원변경 사례" },
      { href: "/센텀법인등기", label: "센텀 법인등기" },
      { href: "/부산법인등기", label: "부산 법인등기" },
    ],
    faqs: [
      {
        question: "임원변경등기를 안 하면 어떤 문제가 있나요?",
        answer:
          "법인의 대외 신용·계약·금융 거래에서 등기부와 실제가 다르면 거절·지연이 생길 수 있고, 일정 기간 경과 시 과태료가 부과될 수 있습니다.",
      },
    ],
    serviceSlug: "director-change",
  },
  {
    slug: "payment-order-certified-mail",
    path: "/situations/payment-order-certified-mail",
    cardTitle: "지급명령·내용증명·소장",
    cardDescription: "채권 회수·분쟁 기록 남기기",
    h1: "돈을 못 받았는데 지급명령·내용증명·소장 중 무엇부터 해야 하나요?",
    metaDescriptionBase:
      "채권 회수 시 내용증명·지급명령·소장 선택 기준, 소멸시효·증거 정리 방법을 안내합니다. 부산 민사·채권 법무사 상담.",
    intro: `독촉만으로는 권리가 고정되지 않습니다. 채권 금액·증거·상대방 주소·소멸시효에 따라 내용증명, 지급명령, 소장 중 경로가 달라집니다. ${LOCAL_CONTEXT}`,
    situationChecklist: [
      "대여금·매매대금·공사대금 등을 못 받고 있다",
      "상대방이 연락을 피하거나 일부만 갚겠다고 한다",
      "계약서·차용증은 없지만 이체·카톡 기록은 있다",
      "소멸시효가 지났는지 걱정된다",
      "소송 전에 간단한 절차가 있는지 알고 싶다",
    ],
    firstChecks: [
      "채권 발생 원인·금액·변제 약정·이행 기록 정리",
      "소멸시효 중단·완성 여부 확인",
      "상대방 성명·주소·송달 가능 여부",
      "계약서·영수증·이체·녹취·카톡 등 증거 목록화",
      "지급명령·소송 관할 법원 확인",
    ],
    selfHandleCases: [
      "금액·증거가 명확하고 상대가 지급명령에 이의하지 않을 것으로 예상",
      "관계 유지를 위해 내용증명으로 독촉·시효 중단만 하는 경우",
      "소액·단순 채권으로 지급명령 전자신청이 가능한 경우",
    ],
    lawyerNeededCases: [
      "채권·채무 관계가 복잡하거나 상계·손해배상 반론이 예상",
      "상대방 주소 불명·해외 거주",
      "증거가 부족해 사실관계 정리가 필요한 경우",
      "지급명령 이후 강제집행·채권추심까지 검토해야 하는 경우",
    ],
    documents: [
      "계약서·차용증·영수증",
      "이체 내역·카카오톡·녹취 등 증거",
      "내용증명·지급명령 신청서",
      "채무자 주소·신분 확인 자료",
      "위임장(대리 신청 시)",
    ],
    procedures: [
      "채권·증거·시효 정리",
      "내용증명 발송(필요 시)",
      "지급명령 또는 소장 제출",
      "이의·이의신청 대응",
      "확정 후 강제집행·회수",
    ],
    diagnosisLinks: [
      { href: "/지급명령자가진단", label: "지급명령 자가진단" },
      { href: "/내용증명자가진단", label: "내용증명 자가진단" },
    ],
    serviceLinks: [
      { href: "/민사소송", label: "민사·채권 허브" },
      { href: "/공탁채권회수", label: "공탁·채권회수 허브" },
    ],
    faqLinks: [
      { href: "/faq/how-to-book-consultation-faq", label: "상담 예약 방법" },
      { href: "/faq/lawyer-fee-and-remote-faq", label: "수임료·원격 상담" },
    ],
    extraLinks: [
      { href: "/부산지방법원지급명령", label: "부산지방법원 지급명령" },
      { href: "/부산지방법원채권회수", label: "부산 채권회수" },
      { href: "/contact", label: "상담 문의" },
      { href: "/자가진단", label: "자가진단 허브" },
    ],
    faqs: [
      {
        question: "지급명령과 소송의 차이는 무엇인가요?",
        answer:
          "지급명령은 비교적 간단한 독촉 절차로, 채무자가 이의하지 않으면 확정됩니다. 분쟁이 크거나 증거가 복잡하면 소장 제기를 검토합니다.",
      },
    ],
  },
  {
    slug: "personal-rehabilitation-bankruptcy",
    path: "/situations/personal-rehabilitation-bankruptcy",
    cardTitle: "개인회생·파산 고민",
    cardDescription: "채무 정리·신청 자격·절차",
    h1: "빚 때문에 개인회생·파산을 고민 중인데 나에게 맞는지 어떻게 알 수 있나요?",
    metaDescriptionBase:
      "개인회생·파산 차이, 신청 자격, 필요 서류, 부산회생법원 절차를 상황별로 정리했습니다. 해운대·센텀 법무사 채무 상담.",
    intro: `채무가 소득을 압도하면 일상이 멈춥니다. 개인회생은 상환 계획으로 정리하고, 파산은 전면 면책을 검토하는 절차입니다. 어느 쪽이 맞는지는 소득·재산·채무 구조에 따라 달라집니다. ${LOCAL_CONTEXT}`,
    situationChecklist: [
      "여러 곳에서 빚이 있어 이자만 갚고 있다",
      "급여압류·가압류·독촉 전화가 잦다",
      "개인회생과 파산 중 무엇이 나은지 모르겠다",
      "주택·차량·가족 재산이 있어 신청이 불가한지 걱정된다",
      "이미 연체가 길어져서 더 미루기 어렵다",
    ],
    firstChecks: [
      "총 채무액·채권자 수·담보 여부 목록 작성",
      "월 소득·고정 지출·부양가족 확인",
      "최근 5년 내 면책·회생 이력 여부",
      "재산(부동산·예금·보험) 가액 파악",
      "급여압류·가압류 진행 여부",
    ],
    selfHandleCases: [
      "채무 규모가 작고 채권자와 분할 상환 합의가 가능한 경우",
      "신용회복위원회 등 워크아웃 대상인 경우 — 기관 안내 확인",
      "단순 연체로 이자 협상만 필요한 경우",
    ],
    lawyerNeededCases: [
      "채권자가 많거나 담보·보증 구조가 복잡한 경우",
      "부동산·사업자·부양가족 재산이 있어 변제계획 설계가 필요한 경우",
      "급여압류·가압류로 생계가 위협되는 경우",
      "개인회생·파산 신청서·변제계획안 작성이 필요한 경우",
    ],
    documents: [
      "채무 목록·잔액증명서",
      "소득 증빙(급여·사업 소득)",
      "재산 목록·등기부등본(해당 시)",
      "가족관계증명서·주민등록등본",
      "최근 거래내역·압류 관련 서류",
    ],
    procedures: [
      "채무·소득·재산 현황 정리",
      "개인회생·파산·워크아웃 적합성 검토",
      "신청서·첨부서류·변제계획안 준비",
      "관할 법원(부산회생법원 등) 접수",
      "개시결정·인가·면책까지 절차 진행",
    ],
    diagnosisLinks: [
      { href: "/개인회생자가진단", label: "개인회생 자가진단" },
      { href: "/개인파산자가진단", label: "개인파산 자가진단" },
    ],
    serviceLinks: [
      { href: "/services/personal-rehabilitation", label: "개인회생 안내" },
      { href: "/services/bankruptcy", label: "개인파산 안내" },
      { href: "/개인회생파산", label: "개인회생·파산 허브" },
    ],
    faqLinks: [
      { href: "/faq/bankruptcy-vs-rehabilitation-faq", label: "회생 vs 파산" },
      { href: "/faq/personal-rehabilitation-eligibility-faq", label: "개인회생 자격" },
      { href: "/faq/personal-rehabilitation-documents-faq", label: "개인회생 서류" },
      { href: "/faq/who-can-file-bankruptcy-faq", label: "파산 신청 자격" },
    ],
    extraLinks: [
      { href: "/blog/bankruptcy-vs-personal-rehabilitation", label: "회생·파산 비교 글" },
      { href: "/blog/personal-rehabilitation-before-application", label: "신청 전 체크" },
      { href: "/services/cases/busan-personal-rehabilitation-consultation", label: "개인회생 상담 사례" },
      { href: "/부산개인회생", label: "부산 개인회생" },
    ],
    faqs: [
      {
        question: "집이 있어도 개인회생을 할 수 있나요?",
        answer:
          "재산 가액·담보·가족 상황에 따라 변제계획이 달라집니다. 무조건 불가하지 않으므로, 채무·재산 목록을 정리한 뒤 상담으로 가능 여부를 보는 것이 좋습니다.",
      },
    ],
    serviceSlug: "personal-rehabilitation",
  },
];

export function getSituationBySlug(slug: string): SituationPage | undefined {
  return situationPages.find((page) => page.slug === slug);
}

export function getAllSituationSlugs(): string[] {
  return situationPages.map((page) => page.slug);
}

export function getAllSituationPages(): SituationPage[] {
  return situationPages;
}
