import { defineSituationPage, solutions } from "../create-page";

const LOCAL =
  "부산 해운대구·센텀, 재송동·반여동 일대에서도 전화·카카오톡·방문(예약) 상담이 가능합니다.";

export const inheritanceDeathPages = [
  defineSituationPage({
    slug: "상속재산-조회",
    cardTitle: "상속재산이 뭔지 모를 때",
    cardDescription: "예금·부동산·보험·채무 조회 방법",
    h1: "부모님이 남긴 재산이 뭔지 어떻게 찾나요?",
    metaDescriptionBase:
      "상속재산 조회 방법, 금융·부동산·보험·채무 확인 절차, 상속인이 알아야 할 조회 기관을 정리했습니다. 부산·해운대 상속 상담 안내.",
    intro: `사망 후 가장 먼저 해야 할 일 중 하나는 '무엇이 남았는지'를 파악하는 것입니다. 부동산은 등기부등본으로, 금융자산은 금융기관·금융감독원 조회로, 보험은 보험협회 조회로 확인할 수 있습니다. ${LOCAL}`,
    situationCategory: "inheritance-death",
    searchIntent: "상속재산 조회 방법",
    conclusion:
      "상속재산 조회는 등기·금융·보험·채무를 나눠 확인하는 것이 핵심입니다. 조회 결과를 바탕으로 상속포기·한정승인·등기 방향을 정하세요.",
    situationChecklist: [
      "부모님 명의 부동산이 있는지 모르겠다",
      "예금·적금·주식 계좌가 어디에 있는지 모른다",
      "보험금·퇴직금·연금 수령 대상인지 확인이 필요하다",
      "채무·보증·담보대출이 있는지 불안하다",
      "형제자매와 재산 목록을 공유해야 하는데 정리가 안 됐다",
    ],
    firstChecks: [
      "전국 부동산 등기부등본 발급(말소사항 포함)으로 명의 부동산 확인",
      "금융감독원 '한국신용정보원' 상속인 금융거래 조회 신청",
      "생명·손해보험협회 '내보험찾아줌'으로 보험 가입 내역 조회",
      "국민연금·건강보험·퇴직연금 등 공적연금·퇴직금 수령 여부 문의",
      "피상속인 명의 차량·법인 지분·가상자산 등 특수 재산 여부 점검",
    ],
    solutions: solutions([
      {
        title: "기관별 직접 조회",
        body: "등기소·금융감독원·보험협회 등 공식 조회 절차를 상속인 본인이 신청해 재산 목록을 만듭니다.",
        whenToChoose: "상속인 협의가 되고 조회 서류 발급이 가능한 경우",
      },
      {
        title: "재산·채무 목록 정리 후 방향 결정",
        body: "조회 결과를 표로 정리하고, 채무 대비 재산 규모를 비교해 단순승인·한정승인·포기를 검토합니다.",
        whenToChoose: "조회는 끝났지만 상속 방향이 불분명한 경우",
      },
      {
        title: "전문가와 함께 조회·정리",
        body: "법무사가 조회 범위·누락 가능성·한정승인 필요 여부를 함께 점검하고 후속 절차를 안내합니다.",
        whenToChoose: "재산이 여러 지역·기관에 분산되거나 채무가 의심되는 경우",
      },
    ]),
    selfHandleCases: [
      "부동산·예금이 단순하고 상속인 전원이 조회에 동의하는 경우",
      "금융감독원·보험협회 온라인 조회를 직접 신청할 수 있는 경우",
      "조회 결과만 정리하면 되고 분쟁·채무 이슈가 없는 경우",
    ],
    lawyerNeededCases: [
      "조회 결과 재산보다 채무가 많아 보이는 경우",
      "해외 부동산·법인 지분·신탁 등 특수 재산이 있는 경우",
      "상속인 간 재산 공개·분할 의견이 갈리는 경우",
      "사망 후 3개월 기한 안에 한정승인·포기를 결정해야 하는 경우",
    ],
    costFactors: [
      "부동산·등기 조회 건수와 지역 분산 여부",
      "금융·보험 조회 대행 및 재산목록 작성 범위",
      "한정승인·상속등기 등 후속 절차 포함 여부",
      "상속인 수와 협의·분쟁 대응 필요성",
    ],
    commonMistakes: [
      "부동산만 확인하고 금융·보험·채무 조회를 생략하는 경우",
      "말소사항 포함 등기부등본이 아닌 현행본만 확인하는 경우",
      "조회 전에 단순승인으로 등기를 먼저 진행하는 경우",
      "형제 중 일부만 조회하고 결과를 공유하지 않는 경우",
    ],
    caseExample: {
      title: "전국 부동산·금융 조회 후 상속 방향 정리",
      body: "상속인 세 명이 부모님 사망 후 재산 조회만 막막해 상담했습니다. 등기부등본 일괄 발급과 금융거래 조회 신청 방법을 안내하고, 조회 결과를 바탕으로 한정승인 필요 여부를 함께 검토한 사례입니다.",
    },
    documents: [
      "피상속인 기본증명서·가족관계증명서(상세)",
      "상속인 신분증·인감증명서(금융 조회 신청 시)",
      "등기부등본(말소사항 포함)",
      "금융거래 조회 신청서·위임장(해당 시)",
      "재산·채무 목록 초안",
    ],
    procedures: [
      "상속인 범위·대표 조회인 선정",
      "부동산 등기부등본 발급",
      "금융감독원·보험협회 조회 신청",
      "조회 결과 취합·재산목록 작성",
      "채무 조사 및 승인·한정·포기 방향 결정",
      "상속등기 또는 한정승인·포기 후속 절차",
    ],
    diagnosisLinks: [
      { href: "/상속등기자가진단", label: "상속등기 자가진단" },
      { href: "/한정승인자가진단", label: "한정승인 자가진단" },
      { href: "/상속포기자가진단", label: "상속포기 자가진단" },
      { href: "/자가진단", label: "자가진단 허브" },
    ],
    serviceLinks: [
      { href: "/services/inheritance-registration", label: "상속등기 업무안내" },
      { href: "/services/qualified-acceptance", label: "한정승인 안내" },
      { href: "/services/inheritance-renunciation", label: "상속포기 안내" },
      { href: "/상속", label: "상속 종합 허브" },
    ],
    faqLinks: [
      { href: "/faq/who-needs-inheritance-registration", label: "상속등기가 필요한 경우" },
      { href: "/faq/when-to-file-inheritance-registration", label: "상속등기 신청 시기" },
      { href: "/faq/what-is-qualified-acceptance", label: "한정승인이란" },
      { href: "/faq/inheritance-registration-cost", label: "상속등기 비용" },
    ],
    extraLinks: [
      { href: "/blog/busan-inheritance-registration-procedure-documents", label: "부산 상속등기 절차·서류" },
      { href: "/부산상속등기", label: "부산 상속등기" },
      { href: "/services/cases/haeundae-inheritance-registration-case", label: "해운대 상속등기 사례" },
      { href: "/contact", label: "상담 문의" },
    ],
    faqs: [
      {
        question: "상속재산 조회는 누가 할 수 있나요?",
        answer:
          "원칙적으로 상속인 본인이 각 기관에 신청합니다. 상속인이 여럿이면 대표자를 정하거나, 위임장을 통해 대리 신청할 수 있는 경우도 있습니다.",
      },
      {
        question: "조회하면 빚도 같이 나오나요?",
        answer:
          "금융감독원 채무조회 등을 통해 대출·보증 등 채무 정보를 확인할 수 있습니다. 다만 모든 채무가 자동으로 나오지는 않으므로, 담보·연대보증·사업자 채무는 별도로 점검하는 것이 좋습니다.",
      },
    ],
    relatedSituationSlugs: [
      "parent-passed-away",
      "inheritance-unknown-debt",
      "상속포기-한정승인-선택",
      "상속등기-지연-과태료",
    ],
    priority: 85,
    isNew: true,
    addedAt: "2026-07-21",
    serviceSlug: "inheritance-registration",
  }),

  defineSituationPage({
    slug: "상속포기-한정승인-선택",
    cardTitle: "상속포기 vs 한정승인",
    cardDescription: "3개월 기한 안 선택 가이드",
    h1: "상속포기와 한정승인, 3개월 안에 어떻게 선택하나요?",
    metaDescriptionBase:
      "상속포기·한정승인·단순승인 차이, 3개월 기한, 선택 기준과 신고 절차를 정리했습니다. 부산·센텀 상속 법무사 상담.",
    intro: `사망일(상속개시일)부터 3개월 안에 상속포기·한정승인·단순승인 중 하나를 결정해야 합니다. 기한을 넘기면 단순승인으로 보일 수 있어, 채무가 의심되면 특히 주의가 필요합니다. ${LOCAL}`,
    situationCategory: "inheritance-death",
    searchIntent: "상속포기 한정승인 선택",
    conclusion:
      "채무가 재산보다 많거나 불분명하면 한정승인·상속포기를, 재산이 분명하고 채무가 적으면 단순승인을 검토하세요. 3개월 기한 확인이 최우선입니다.",
    situationChecklist: [
      "부모님 빚이 재산보다 많을까 걱정된다",
      "상속포기와 한정승인 차이를 모르겠다",
      "사망 후 3개월이 거의 다 됐다",
      "형제자매마다 포기·승인 의견이 다르다",
      "단순승인으로 등기를 이미 진행 중이다",
    ],
    firstChecks: [
      "사망일(상속개시일)부터 경과 일수·3개월 기한 계산",
      "상속재산 가액과 채무 규모 대략 비교",
      "상속인 전원의 포기·한정·승인 의사 확인",
      "이미 진행한 등기·예금 해지 등 단순승인 정황 여부 점검",
      "가정법원 관할·신고 서류 요건 확인",
    ],
    solutions: solutions([
      {
        title: "단순승인 후 등기",
        body: "채무가 없거나 재산 대비 명확히 적을 때, 상속재산을 그대로 승인하고 상속등기를 진행합니다.",
        whenToChoose: "채무 조사 결과 재산이 충분하고 상속인 전원 동의가 있는 경우",
      },
      {
        title: "한정승인",
        body: "재산 범위 안에서만 채무를 변제하고, 초과 채무는 면책받는 방식입니다. 재산목록·채무 목록 작성이 필요합니다.",
        whenToChoose: "재산도 있지만 채무 규모가 불분명하거나 재산보다 채무가 많을 수 있는 경우",
      },
      {
        title: "상속포기",
        body: "상속 자체를 받지 않아 피상속인의 채무도 떠안지 않습니다. 후순위 상속인에게 넘어갈 수 있습니다.",
        whenToChoose: "재산보다 채무가 확실히 많고 상속 이익이 없는 경우",
      },
    ]),
    selfHandleCases: [
      "채무·재산이 단순하고 전 상속인이 한정승인·포기에 동의하는 경우",
      "가정법원 안내대로 재산·채무 목록을 직접 작성할 수 있는 경우",
      "이미 채무조회를 마치고 방향이 명확한 경우",
    ],
    lawyerNeededCases: [
      "기한이 1~2주 이내로 촉박한 경우",
      "상속인 간 의견이 갈리거나 일부가 연락 두절인 경우",
      "담보·보증·사업자·법인 채무가 얽힌 경우",
      "단순승인 정황이 있어 취소·한정승인 가능 여부가 불분명한 경우",
    ],
    costFactors: [
      "한정승인·포기 신고 대행 및 재산·채무 목록 작성 범위",
      "상속인 수와 의견 조율·분쟁 대응",
      "후속 상속등기·유류분 등 추가 절차 포함 여부",
      "긴급 대응(기한 임박) 필요성",
    ],
    commonMistakes: [
      "3개월 기한 확인 없이 '천천히 등기부터' 하는 경우",
      "한정승인과 상속포기를 같은 것으로 알고 선택하는 경우",
      "일부 상속인만 포기·한정 신고하는 경우",
      "재산·채무 목록을 대충 작성해 한정승인이 기각되는 경우",
    ],
    caseExample: {
      title: "기한 임박 한정승인 신고",
      body: "사망 후 2개월이 지나 채무조회 결과 담보대출이 예상보다 많아 급히 상담한 사례입니다. 재산·채무 목록 작성과 가정법원 신고를 진행하고, 이후 상속등기 방향까지 정리했습니다.",
    },
    documents: [
      "피상속인·상속인 가족관계증명서·기본증명서",
      "재산목록·채무 목록",
      "한정승인·상속포기 신고서",
      "채무조회 결과·금융기관 확인서",
      "상속인 인감증명서·신분증",
    ],
    procedures: [
      "사망일 확인 및 3개월 기한 계산",
      "재산·채무 조사",
      "단순승인·한정승인·포기 방향 결정",
      "가정법원에 한정승인·포기 신고(해당 시)",
      "승인·한정 후 상속등기 또는 포기 후속 처리",
      "채권자에 대한 공고·변제 절차(한정승인 시)",
    ],
    diagnosisLinks: [
      { href: "/한정승인자가진단", label: "한정승인 자가진단" },
      { href: "/상속포기자가진단", label: "상속포기 자가진단" },
      { href: "/상속등기자가진단", label: "상속등기 자가진단" },
      { href: "/자가진단", label: "자가진단 허브" },
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
      { href: "/blog/inheritance-renunciation-vs-qualified-acceptance", label: "상속포기 vs 한정승인" },
      { href: "/부산한정승인", label: "부산 한정승인" },
      { href: "/services/cases/dongnae-qualified-acceptance-consultation", label: "한정승인 상담 사례" },
      { href: "/contact", label: "상담 문의" },
    ],
    faqs: [
      {
        question: "한정승인과 상속포기의 가장 큰 차이는?",
        answer:
          "한정승인은 재산 범위 안에서만 채무를 부담하고 남은 재산은 가져갈 수 있습니다. 상속포기는 상속 자체를 거절해 재산·채무 모두 받지 않습니다.",
      },
      {
        question: "3개월을 넘기면 어떻게 되나요?",
        answer:
          "별도 의사표시 없이 단순승인한 것으로 추정될 수 있어, 채무까지 승인한 것으로 처리될 위험이 있습니다. 기한 임박 시 즉시 상담을 권합니다.",
      },
    ],
    relatedSituationSlugs: [
      "inheritance-unknown-debt",
      "parent-passed-away",
      "상속재산-조회",
      "siblings-not-cooperating",
    ],
    priority: 96,
    urgent: true,
    isNew: true,
    addedAt: "2026-07-21",
    serviceSlug: "qualified-acceptance",
  }),

  defineSituationPage({
    slug: "상속등기-지연-과태료",
    cardTitle: "상속등기 미루면 과태료",
    cardDescription: "신고 기한·과태료·세무 이슈",
    h1: "상속등기를 늦게 하면 과태료가 부과되나요?",
    metaDescriptionBase:
      "상속등기 지연 시 과태료·가산세, 신고 기한, 장기 미등기 리스크를 정리했습니다. 부산·해운대 상속등기 상담.",
    intro: `상속등기는 부동산이 있는 상속에서 필수에 가깝습니다. 사망 후 일정 기간 내 신청하지 않으면 과태료가 붙을 수 있고, 매매·담보·증여 등에도 제한이 생깁니다. ${LOCAL}`,
    situationCategory: "inheritance-death",
    searchIntent: "상속등기 지연 과태료",
    conclusion:
      "상속등기는 미루면 과태료·거래 제한·세무 불이익이 커질 수 있습니다. 상속인 협의가 어려워도 기한과 과태료 리스크부터 확인하세요.",
    situationChecklist: [
      "부모님 사망 후 6개월 이상 등기를 안 했다",
      "과태료 통지·독촉을 받았거나 받을 것 같다",
      "형제와 등기 문제로 오래 미뤄왔다",
      "집을 팔려는데 상속등기가 안 되어 있다",
      "등기 비용·세금 때문에 계속 미루고 있다",
    ],
    firstChecks: [
      "사망일(상속개시일)부터 경과 기간·과태료 부과 기준 확인",
      "등기부등본상 소유자가 여전히 피상속인인지 확인",
      "상속인 수·협의분할·공유 등기 필요 여부 점검",
      "취득세·등록면허세 등 세무 신고 기한 확인",
      "과태료·가산세 납부 전 등기 신청 가능 여부 문의",
    ],
    solutions: solutions([
      {
        title: "협의분할 등기로 신속 처리",
        body: "상속인 전원 협의가 되면 협의분할협의서를 작성해 상속등기를 진행하고, 과태료 누적을 막습니다.",
        whenToChoose: "상속인 협의가 되고 분할 방식이 정해진 경우",
      },
      {
        title: "공유 등기 후 분할",
        body: "분할 합의가 어려우면 일단 공유 등기로 명의를 정리하고, 이후 매매·분할을 진행합니다.",
        whenToChoose: "당장 분할은 어렵지만 등기 지연 리스크를 줄여야 할 때",
      },
      {
        title: "분쟁·협의 병행 대응",
        body: "형제 간 분쟁이 있어도 과태료·기한 리스크를 먼저 점검하고, 협의·조정·소송 경로를 함께 설계합니다.",
        whenToChoose: "상속인 간 의견 충돌로 등기가 장기 지연된 경우",
      },
    ]),
    selfHandleCases: [
      "상속인 전원 협의가 되고 과태료 전 등기 신청이 가능한 경우",
      "서류·인감이 준비되어 단순 협의분할 등기만 필요한 경우",
      "세무 신고·납부를 직접 진행할 수 있는 경우",
    ],
    lawyerNeededCases: [
      "과태료가 이미 부과되었거나 장기 미등기 상태인 경우",
      "상속인 일부가 협조하지 않는 경우",
      "담보·임차·점유 등 권리관계가 복잡한 부동산인 경우",
      "매매·증여 등 거래가 등기 지연으로 막힌 경우",
    ],
    costFactors: [
      "과태료·가산세·취득세 등 세금 규모",
      "상속인 수와 협의·분쟁 대응 범위",
      "부동산 수·담보 말소 등 부대 등기",
      "장기 지연으로 인한 추가 보정·서류 작업",
    ],
    commonMistakes: [
      "과태료가 붙을 때까지 등기를 미루는 경우",
      "세금만 납부하고 등기 신청을 안 하는 경우",
      "형제 한 명의 동의 없이 단독 등기를 시도하는 경우",
      "말소사항 없는 등기부등본으로 현재 상태를 착각하는 경우",
    ],
    caseExample: {
      title: "2년 미등기 후 과태료 대응",
      body: "부모님 사망 후 형제 간 분할 문제로 2년간 등기를 미루다 과태료 통지를 받고 상담한 사례입니다. 공유 등기로 먼저 명의를 정리하고, 이후 매매를 통해 분할하는 방안을 함께 설계했습니다.",
    },
    documents: [
      "피상속인·상속인 가족관계증명서(상세)",
      "등기부등본·토지대장",
      "협의분할협의서 또는 공유 등기 관련 서류",
      "상속인 인감증명서",
      "취득세·등록면허세 납부 증명(해당 시)",
    ],
    procedures: [
      "사망일·미등기 기간·과태료 발생 여부 확인",
      "상속인 협의·분할 방향 결정",
      "세금 신고·납부",
      "등기 서류 작성·인감",
      "관할 등기소 접수",
      "등기 완료 후 과태료 추가 발생 방지",
    ],
    diagnosisLinks: [
      { href: "/상속등기자가진단", label: "상속등기 자가진단" },
      { href: "/한정승인자가진단", label: "한정승인 자가진단" },
      { href: "/부동산등기자가진단", label: "부동산등기 자가진단" },
      { href: "/자가진단", label: "자가진단 허브" },
    ],
    serviceLinks: [
      { href: "/services/inheritance-registration", label: "상속등기 업무안내" },
      { href: "/services/real-estate-registration", label: "부동산등기 안내" },
      { href: "/상속", label: "상속 종합 허브" },
      { href: "/부동산등기", label: "부동산등기 허브" },
    ],
    faqLinks: [
      { href: "/faq/when-to-file-inheritance-registration", label: "상속등기 신청 시기" },
      { href: "/faq/inheritance-registration-cost", label: "상속등기 비용" },
      { href: "/faq/multiple-heirs-inheritance-registration", label: "상속인이 여럿일 때" },
      { href: "/faq/inheritance-registration-with-mortgage", label: "근저당 있는 부동산" },
    ],
    extraLinks: [
      { href: "/blog/busan-inheritance-registration-procedure-documents", label: "부산 상속등기 절차" },
      { href: "/부산상속등기", label: "부산 상속등기" },
      { href: "/해운대구상속등기", label: "해운대구 상속등기" },
      { href: "/contact", label: "상담 문의" },
    ],
    faqs: [
      {
        question: "과태료는 얼마나 부과되나요?",
        answer:
          "미등기 기간·부동산 가액 등에 따라 달라집니다. 장기간 미등기일수록 부담이 커질 수 있어, 빠른 등기 신청이 유리합니다.",
      },
      {
        question: "형제가 안 맞춰도 혼자 등기할 수 있나요?",
        answer:
          "협의분할 등기는 원칙적으로 상속인 전원의 협의가 필요합니다. 협의가 안 되면 공유 등기나 법적 분할 절차를 검토해야 합니다.",
      },
    ],
    relatedSituationSlugs: [
      "parent-passed-away",
      "siblings-not-cooperating",
      "상속재산-조회",
      "상속포기-한정승인-선택",
    ],
    priority: 88,
    isNew: true,
    addedAt: "2026-07-21",
    serviceSlug: "inheritance-registration",
  }),

  defineSituationPage({
    slug: "해외-거주-상속인",
    cardTitle: "해외 거주 상속인",
    cardDescription: "위임·공증·서류·원격 진행",
    h1: "해외에 사는 상속인은 상속등기를 어떻게 하나요?",
    metaDescriptionBase:
      "해외 거주 상속인의 상속등기, 위임장·공증·아포스티유, 원격 진행 방법을 정리했습니다. 부산 법무사 해외 상속 상담.",
    intro: `상속인이 해외에 있으면 인감·서명·위임 절차가 달라집니다. 공증·영사 확인·아포스티유 등 국가별 요건을 맞춰야 등기가 진행됩니다. ${LOCAL}`,
    situationCategory: "inheritance-death",
    searchIntent: "해외 거주 상속인 등기",
    conclusion:
      "해외 상속인은 위임·공증 요건과 기한(3개월·과태료)을 동시에 봐야 합니다. 입국 없이 진행 가능한 범위를 먼저 확인하세요.",
    situationChecklist: [
      "형제·가족 중 해외 거주자가 상속인이다",
      "해외 상속인의 인감·서명을 받기 어렵다",
      "위임장·공증·번역 서류가 필요한지 모르겠다",
      "해외 상속인이 상속포기·한정승인 의사를 밝혔다",
      "입국 일정 없이 등기를 끝내고 싶다",
    ],
    firstChecks: [
      "해외 상속인 거주 국가·현재 주소·연락처 확인",
      "해당 국가 공증·영사·아포스티유 요건 확인",
      "상속인 전원 동의·위임 범위(등기·포기·한정) 정리",
      "사망일 기준 3개월·등기 과태료 기한 점검",
      "해외 재산·계좌·국내 부동산 동시 상속 여부 확인",
    ],
    solutions: solutions([
      {
        title: "위임장·공증으로 원격 진행",
        body: "해외 상속인이 현지 공증 또는 영사 확인을 거친 위임장·인감증명을 보내 국내에서 대리 등기를 진행합니다.",
        whenToChoose: "해외 상속인이 등기에 동의하고 공증 절차 협조가 가능한 경우",
      },
      {
        title: "입국 일정 맞춰 일괄 처리",
        body: "짧은 귀국 기간에 상속인 전원 서류·인감·협의를 한 번에 처리하는 방식입니다.",
        whenToChoose: "공증 비용·기간 부담이 크고 입국이 가능한 경우",
      },
      {
        title: "공유 등기·단계적 분할",
        body: "해외 상속인 협조가 늦어질 때, 먼저 공유 등기로 명의를 정리하고 이후 분할·매매를 진행합니다.",
        whenToChoose: "해외 상속인 연락·서류 수령에 시간이 걸리는 경우",
      },
    ]),
    selfHandleCases: [
      "해외 상속인이 공증·위임 절차에 익숙하고 서류 발송이 원활한 경우",
      "상속인 수가 적고 분할 합의가 이미 된 경우",
      "금융기관이 요구하는 상속 서류만 제출하면 되는 경우",
    ],
    lawyerNeededCases: [
      "거주 국가별 공증·번역·아포스티유 요건이 복잡한 경우",
      "해외·국내 재산이 함께 있어 한정승인·포기 검토가 필요한 경우",
      "해외 상속인과 국내 상속인 간 의견이 다른 경우",
      "기한(3개월·과태료)이 촉박한 경우",
    ],
    costFactors: [
      "해외 공증·번역·아포스티유·국제우편 비용",
      "상속인 수·해외 거주자 수",
      "상속등기·한정승인·포기 등 후속 절차 범위",
      "긴급 대응·대리인 선임 필요성",
    ],
    commonMistakes: [
      "국내 인감증명서와 동일하다고 생각해 현지 공증 없이 서명만 받는 경우",
      "번역·아포스티유 누락으로 등기소 보정이 반복되는 경우",
      "해외 상속인 의사 미확인 상태로 국내만 등기 진행하는 경우",
      "3개월·과태료 기한 확인 없이 해외 서류 발송만 기다리는 경우",
    ],
    caseExample: {
      title: "미국 거주 상속인 위임 등기",
      body: "국내 부동산 상속에서 상속인 중 한 명이 미국 거주 중이었습니다. 현지 공증 위임장과 인감증명을 받아 입국 없이 협의분할 등기를 완료한 사례입니다.",
    },
    documents: [
      "피상속인·상속인 가족관계증명서(상세)",
      "해외 상속인 위임장(공증·영사 확인)",
      "해외 발급 인감증명서 또는 대체 서류",
      "협의분할협의서·등기부등본",
      "번역 공증본(해당 국가 요건 시)",
    ],
    procedures: [
      "상속인 현황·거주국·연락처 정리",
      "위임·공증 요건 안내 및 서류 발송",
      "국내 상속인과 분할·승인 방향 협의",
      "해외 서류 수령·번역·보완",
      "상속등기 또는 한정승인·포기 신청",
      "등기 완료 후 해외 상속인에게 결과 통보",
    ],
    diagnosisLinks: [
      { href: "/상속등기자가진단", label: "상속등기 자가진단" },
      { href: "/한정승인자가진단", label: "한정승인 자가진단" },
      { href: "/상속포기자가진단", label: "상속포기 자가진단" },
      { href: "/자가진단", label: "자가진단 허브" },
    ],
    serviceLinks: [
      { href: "/services/inheritance-registration", label: "상속등기 업무안내" },
      { href: "/services/qualified-acceptance", label: "한정승인 안내" },
      { href: "/services/inheritance-renunciation", label: "상속포기 안내" },
      { href: "/상속", label: "상속 종합 허브" },
    ],
    faqLinks: [
      { href: "/faq/multiple-heirs-inheritance-registration", label: "상속인이 여럿일 때" },
      { href: "/faq/when-to-file-inheritance-registration", label: "상속등기 신청 시기" },
      { href: "/faq/inheritance-registration-cost", label: "상속등기 비용" },
      { href: "/faq/qualified-acceptance-procedure", label: "한정승인 절차" },
    ],
    extraLinks: [
      { href: "/blog/busan-inheritance-registration-procedure-documents", label: "상속등기 절차·서류" },
      { href: "/부산상속등기", label: "부산 상속등기" },
      { href: "/services/cases/haeundae-inheritance-registration-case", label: "상속등기 사례" },
      { href: "/contact", label: "상담 문의" },
    ],
    faqs: [
      {
        question: "해외 상속인이 꼭 입국해야 하나요?",
        answer:
          "공증·위임 절차가 갖춰지면 입국 없이도 등기가 가능한 경우가 많습니다. 거주 국가별 요건이 다르므로 사전 확인이 필요합니다.",
      },
      {
        question: "해외에서 상속포기도 할 수 있나요?",
        answer:
          "가능합니다. 다만 가정법원 제출 서류·기한·공증 요건을 맞춰야 하므로, 3개월 기한 전에 절차를 시작하는 것이 좋습니다.",
      },
    ],
    relatedSituationSlugs: [
      "parent-passed-away",
      "siblings-not-cooperating",
      "상속등기-지연-과태료",
      "상속포기-한정승인-선택",
    ],
    priority: 80,
    isNew: true,
    addedAt: "2026-07-21",
    serviceSlug: "inheritance-registration",
  }),
];
