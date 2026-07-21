import { defineSituationPage, solutions } from "../create-page";

const LOCAL =
  "부산 해운대구·센텀, 재송동·반여동 일대에서도 전화·카카오톡·방문(예약) 상담이 가능합니다.";

export const jeonseLeasePages = [
  defineSituationPage({
    slug: "집주인-연락-두절",
    cardTitle: "집주인 연락이 안 될 때",
    cardDescription: "보증금 반환·재산 조사·대응 순서",
    h1: "전세 계약이 끝났는데 집주인 연락이 두절됐어요",
    metaDescriptionBase:
      "전세 집주인 연락두절 시 보증금 반환, 등기부 조회, 임차권등기명령·내용증명 등 대응 순서를 정리했습니다. 부산 전세 분쟁 상담.",
    intro: `계약 만료 후 집주인 연락이 끊기면 보증금 반환만 기다리기 어렵습니다. 등기부등본으로 소유·채무 상태를 확인하고, 내용증명·임차권등기명령 등 권리 확보를 검토해야 합니다. ${LOCAL}`,
    situationCategory: "jeonse-lease",
    searchIntent: "전세 집주인 연락두절",
    conclusion:
      "연락두절은 보증금 미반환의 전조일 수 있습니다. 등기부 확인과 권리 확보 절차를 서두르세요.",
    situationChecklist: [
      "전세 계약 만료 후 집주인 전화·문자가 안 된다",
      "보증금 반환 일정을 미루다 연락이 끊겼다",
      "집주인이 다른 채무·경매 이야기를 들은 적 있다",
      "이미 새 세입자가 들어온 것 같다",
      "중개사도 집주인을 찾지 못한다",
    ],
    firstChecks: [
      "등기부등본으로 임대인 소유·근저당·압류·경매 개시 여부 확인",
      "전세계약서·확정일자·전입신고·대항력 요건 점검",
      "내용증명 등 서면 독촉 기록 남기기",
      "전세보증보험·HUG 가입 여부 확인",
      "임차권등기명령·배당요구 필요 시점 검토",
    ],
    solutions: solutions([
      {
        title: "내용증명 독촉·협의",
        body: "집주인 주소로 내용증명을 보내 보증금 반환을 요청하고, 협의 가능 여부를 확인합니다.",
        whenToChoose: "집주인 주소가 알려져 있고 아직 경매·압류 전인 경우",
      },
      {
        title: "임차권등기명령·배당요구",
        body: "임대인에게 다른 채권자가 있거나 경매가 예상될 때 우선변제권 확보를 위해 법원에 신청합니다.",
        whenToChoose: "대항력 요건을 갖췄고 임대인 재산에 경쟁 채권자가 있는 경우",
      },
      {
        title: "지급명령·소송·집행",
        body: "협의가 불가능하면 채권을 확정하고 강제집행까지 검토합니다.",
        whenToChoose: "연락두절이 장기화되거나 일부만 반환하겠다고 하는 경우",
      },
    ]),
    selfHandleCases: [
      "집주인 주소가 확실하고 내용증명 발송만 필요한 경우",
      "전세보증보험 청구 요건을 갖춘 경우",
      "단순 연착으로 곧 연락이 올 것으로 예상되는 경우",
    ],
    lawyerNeededCases: [
      "등기부에 경매·압류·다수 근저당이 있는 경우",
      "보증금 규모가 크고 대항력·우선변제 기한이 촉박한 경우",
      "집주인 주소 불명·실거주지와 등기상 주소가 다른 경우",
      "새 임차인·점유 상태로 보증금 회수가 어려워 보이는 경우",
    ],
    costFactors: [
      "보증금 규모와 임차권등기명령·소송 포함 여부",
      "등기부·재산 조사 범위",
      "집행·배당 절차 필요성",
      "전세보증보험 병행 여부",
    ],
    commonMistakes: [
      "연락만 기다리다 대항력·배당 기한을 놓치는 경우",
      "등기부 확인 없이 구두 약속만 믿는 경우",
      "집주인 개인 연락처만 쓰고 등기상 주소로 독촉하지 않는 경우",
      "새 세입자 퇴거 전에 권리 확보를 미루는 경우",
    ],
    caseExample: {
      title: "연락두절 후 임차권등기명령 신청",
      body: "계약 만료 2주 후 집주인 연락이 두절됐고, 등기부 확인 결과 근저당 채권자가 있었습니다. 내용증명 후 임차권등기명령을 신청해 우선변제권을 확보한 사례입니다.",
    },
    documents: [
      "전세계약서·확정일자 받은 계약서",
      "보증금 이체·영수 증빙",
      "등기부등본",
      "전입세대열람·주민등록등본",
      "내용증명·독촉 기록",
    ],
    procedures: [
      "계약·확정일자·대항력 요건 확인",
      "등기부등본 발급·임대인 재산 상태 조사",
      "내용증명 등 서면 독촉",
      "임차권등기명령·배당요구(필요 시)",
      "지급명령·소송·강제집행 검토",
      "전세보증보험 청구(해당 시)",
    ],
    diagnosisLinks: [
      { href: "/전세보증금자가진단", label: "전세보증금 자가진단" },
      { href: "/임차권등기명령자가진단", label: "임차권등기명령 자가진단" },
      { href: "/내용증명자가진단", label: "내용증명 자가진단" },
      { href: "/자가진단", label: "자가진단 허브" },
    ],
    serviceLinks: [
      { href: "/임대차전세", label: "임대차·전세 허브" },
      { href: "/services/real-estate-registration", label: "부동산등기 안내" },
      { href: "/민사소송", label: "민사·채권 허브" },
      { href: "/contact", label: "상담 문의" },
    ],
    faqLinks: [
      { href: "/faq/jeonse-registration-faq", label: "전세권·임차권 FAQ" },
      { href: "/faq/how-to-book-consultation-faq", label: "상담 예약 방법" },
      { href: "/faq/lawyer-fee-and-remote-faq", label: "수임료·원격 상담" },
      { href: "/faq/ownership-transfer-documents", label: "등기 관련 FAQ" },
    ],
    extraLinks: [
      { href: "/blog/jeonse-deposit-return-certified-mail", label: "전세보증금 반환 내용증명" },
      { href: "/tools/jeonse-deposit-timeline", label: "전세 타임라인 도구" },
      { href: "/blog/jeonse-right-vs-lease-registration-order", label: "전세권 vs 임차권등기명령" },
      { href: "/contact", label: "상담 문의" },
    ],
    faqs: [
      {
        question: "연락두절이면 바로 경매인가요?",
        answer:
          "반드시 그렇지는 않지만, 등기부에 근저당·압류·경매 개시가 있는지 확인해야 합니다. 위험 신호일 수 있어 빠른 조사가 필요합니다.",
      },
      {
        question: "중개사를 통해 연락하면 되나요?",
        answer:
          "중개사 연락도 시도할 수 있지만, 법적 독촉·권리 확보는 임대인 본인에게 서면으로 하는 것이 안전합니다.",
      },
    ],
    relatedSituationSlugs: [
      "jeonse-deposit-unpaid",
      "임차권등기명령-필요할-때",
      "전세-경매-진행",
      "payment-order-certified-mail",
    ],
    priority: 95,
    urgent: true,
    isNew: true,
    addedAt: "2026-07-21",
    serviceSlug: "real-estate-registration",
  }),

  defineSituationPage({
    slug: "임차권등기명령-필요할-때",
    cardTitle: "임차권등기명령이 필요할 때",
    cardDescription: "신청 요건·기한·우선변제",
    h1: "전세 보증금을 지키려면 임차권등기명령이 필요한가요?",
    metaDescriptionBase:
      "임차권등기명령 신청 요건, 대항력·우선변제권, 기한과 절차를 정리했습니다. 부산 전세·임대차 법무사 상담.",
    intro: `임차권등기명령은 임대인에게 다른 채권자가 있을 때 임차인의 우선변제권을 지키기 위한 절차입니다. 대항력 요건과 신청 기한을 함께 봐야 합니다. ${LOCAL}`,
    situationCategory: "jeonse-lease",
    searchIntent: "임차권등기명령 필요 시점",
    conclusion:
      "임대인에게 경쟁 채권자가 있거나 경매가 예상되면 임차권등기명령을 검토하세요. 대항력 요건과 기한 확인이 선행됩니다.",
    situationChecklist: [
      "집주인에게 다른 빚·근저당이 많다고 들었다",
      "경매·압류 진행 전에 보증금을 지키고 싶다",
      "전세계약 만료 후 보증금을 못 받았다",
      "확정일자·전입신고는 했지만 등기는 안 했다",
      "임차권등기명령과 전세권등기 차이를 모르겠다",
    ],
    firstChecks: [
      "전입신고·점유·확정일자로 대항력 요건 충족 여부",
      "등기부등본상 근저당·가압류·경매 개시 여부",
      "임차권등기명령 신청 기한(대항력 취득 후) 확인",
      "보증금액·임대인·부동산 표시 정확히 정리",
      "배당요구 종기·경매 일정과의 관계 점검",
    ],
    solutions: solutions([
      {
        title: "임차권등기명령 신청",
        body: "법원에 임차권등기명령을 신청해 등기부에 임차권을 기재하고 우선변제권을 확보합니다.",
        whenToChoose: "대항력 요건을 갖췄고 임대인에게 다른 채권자가 있는 경우",
      },
      {
        title: "내용증명·협의 병행",
        body: "임차권등기명령과 함께 보증금 반환 독촉·협의를 진행합니다.",
        whenToChoose: "아직 경매 전이고 임대인과 연락이 가능한 경우",
      },
      {
        title: "전세보증보험·배당요구",
        body: "보험 가입 시 보험사 청구와, 경매 진행 시 배당요구를 함께 준비합니다.",
        whenToChoose: "보증보험에 가입했거나 경매가 이미 진행 중인 경우",
      },
    ]),
    selfHandleCases: [
      "법원 서식·증빙이 단순하고 신청 요건이 명확한 경우",
      "임대인과 협의가 되어 등기명령 없이 반환받을 수 있는 경우",
      "전세보증보험 청구만으로 해결 가능한 경우",
    ],
    lawyerNeededCases: [
      "경매·배당 종기가 임박한 경우",
      "대항력·우선변제 요건 충족 여부가 불분명한 경우",
      "보증금 규모가 크고 다수 채권자가 있는 경우",
      "임차권등기명령 후 배당·집행까지 검토해야 하는 경우",
    ],
    costFactors: [
      "보증금 규모와 법원·등기 비용",
      "임차권등기명령·배당·소송 포함 범위",
      "긴급 신청·기한 임박 대응",
      "전세보증보험 병행 여부",
    ],
    commonMistakes: [
      "대항력 없이 임차권등기명령만 신청하려는 경우",
      "경매 배당 종기를 확인하지 않는 경우",
      "임차권등기명령과 전세권설정등기를 혼동하는 경우",
      "신청 후 배당요구를 하지 않아 우선변제를 못 받는 경우",
    ],
    caseExample: {
      title: "경매 전 임차권등기명령으로 우선변제 확보",
      body: "임대인 부동산에 다수 근저당이 설정돼 있었고, 계약 만료 후 보증금 미반환 상태였습니다. 대항력 요건 확인 후 임차권등기명령을 신청하고, 이후 경매 배당에서 우선변제받은 사례입니다.",
    },
    documents: [
      "전세계약서·확정일자 계약서",
      "전입세대열람·주민등록등본",
      "등기부등본",
      "보증금 지급 증빙",
      "임차권등기명령 신청서·위임장",
    ],
    procedures: [
      "대항력·우선변제 요건 확인",
      "등기부등본·임대인 채무 상태 조사",
      "임차권등기명령 신청",
      "등기소에 임차권 등기",
      "보증금 반환 협의 또는 배당·집행",
      "전세보증보험 청구(해당 시)",
    ],
    diagnosisLinks: [
      { href: "/임차권등기명령자가진단", label: "임차권등기명령 자가진단" },
      { href: "/전세보증금자가진단", label: "전세보증금 자가진단" },
      { href: "/내용증명자가진단", label: "내용증명 자가진단" },
      { href: "/자가진단", label: "자가진단 허브" },
    ],
    serviceLinks: [
      { href: "/임대차전세", label: "임대차·전세 허브" },
      { href: "/services/real-estate-registration", label: "부동산등기 안내" },
      { href: "/민사소송", label: "민사·채권 허브" },
      { href: "/contact", label: "상담 문의" },
    ],
    faqLinks: [
      { href: "/faq/jeonse-registration-faq", label: "전세권·임차권 FAQ" },
      { href: "/faq/how-to-book-consultation-faq", label: "상담 예약" },
      { href: "/faq/lawyer-fee-and-remote-faq", label: "수임료 안내" },
      { href: "/faq/ownership-transfer-documents", label: "등기 서류 FAQ" },
    ],
    extraLinks: [
      { href: "/blog/jeonse-right-vs-lease-registration-order", label: "전세권 vs 임차권등기명령" },
      { href: "/tools/jeonse-deposit-timeline", label: "전세 타임라인" },
      { href: "/수영구전세권설정", label: "전세 관련 안내" },
      { href: "/contact", label: "상담 문의" },
    ],
    faqs: [
      {
        question: "전세권설정등기와 임차권등기명령은 무엇이 다른가요?",
        answer:
          "전세권설정등기는 계약 초기에 임대인 협조로 등기부에 전세권을 설정하는 방식이고, 임차권등기명령은 분쟁·채무 상황에서 법원 명령으로 임차권을 등기하는 절차입니다.",
      },
      {
        question: "신청 후 바로 돈을 받을 수 있나요?",
        answer:
          "임차권등기명령은 우선변제권 확보 절차입니다. 보증금 회수는 반환 협의, 배당, 집행 등 후속 절차가 필요할 수 있습니다.",
      },
    ],
    relatedSituationSlugs: [
      "jeonse-deposit-unpaid",
      "집주인-연락-두절",
      "전세-경매-진행",
      "전입신고-확정일자-없음",
    ],
    priority: 92,
    urgent: true,
    isNew: true,
    addedAt: "2026-07-21",
    serviceSlug: "real-estate-registration",
  }),

  defineSituationPage({
    slug: "전세-경매-진행",
    cardTitle: "전세 집 경매가 진행될 때",
    cardDescription: "배당·우선변제·퇴거",
    h1: "살고 있는 집에 경매가 진행되면 전세 보증금은 어떻게 되나요?",
    metaDescriptionBase:
      "전세 집 경매 진행 시 임차인 권리, 배당요구, 우선변제, 퇴거·보증금 회수 절차를 정리했습니다. 부산 전세 경매 상담.",
    intro: `임대인 부동산이 경매에 넘어가면 임차인은 배당요구·우선변제권·대항력을 통해 보증금을 지킬 수 있습니다. 경매 일정과 배당 종기를 놓치면 안 됩니다. ${LOCAL}`,
    situationCategory: "jeonse-lease",
    searchIntent: "전세 경매 진행 대응",
    conclusion:
      "경매가 진행 중이면 배당요구 종기·우선변제권·전세보증보험을 즉시 확인하세요. 기한을 놓치면 회수가 어려워질 수 있습니다.",
    situationChecklist: [
      "집주인 집에 경매가 걸렸다는 통지를 받았다",
      "경매일·배당요구 종기를 모르겠다",
      "전세보증금을 전액 돌려받을 수 있을지 불안하다",
      "새 집주인·낙찰자에게 퇴거를 요구받을 것 같다",
      "임차권등기명령을 아직 신청하지 않았다",
    ],
    firstChecks: [
      "등기부·경매 사이트에서 경매 개시·기일·배당요구 종기 확인",
      "대항력(전입·점유)·확정일자·우선변제권 요건 점검",
      "임차권등기명령·배당요구 신청 여부 확인",
      "전세보증보험 가입·청구 가능 여부",
      "보증금액·미반환 잔액·이미 받은 금액 정리",
    ],
    solutions: solutions([
      {
        title: "배당요구·우선변제",
        body: "경매 배당절차에 참여해 확보된 우선변제권으로 보증금을 배당받습니다.",
        whenToChoose: "대항력·우선변제 요건을 갖춘 경우",
      },
      {
        title: "전세보증보험 청구",
        body: "HUG 등 보증보험에 가입했다면 보험금 청구 절차를 병행합니다.",
        whenToChoose: "보증보험 가입 요건을 충족하는 경우",
      },
      {
        title: "임차권등기명령·집행",
        body: "아직 등기명령·배당요구를 하지 않았다면 긴급 신청하고, 부족분은 집행·소송을 검토합니다.",
        whenToChoose: "배당 종기가 임박했거나 우선변제권이 불분명한 경우",
      },
    ]),
    selfHandleCases: [
      "배당요구 종기 전에 서류·신청을 직접 할 수 있는 경우",
      "전세보증보험 청구 요건만 갖추면 되는 경우",
      "이미 임차권등기명령·배당요구가 완료된 경우",
    ],
    lawyerNeededCases: [
      "배당 종기·경매 기일이 며칠 안 남은 경우",
      "대항력·우선변제 요건 충족 여부가 불분명한 경우",
      "보증금이 배당금보다 많을 가능성이 있는 경우",
      "낙찰 후 퇴거·명도·손해배상까지 검토해야 하는 경우",
    ],
    costFactors: [
      "보증금 규모와 배당·집행·소송 범위",
      "임차권등기명령 긴급 신청 필요성",
      "전세보증보험·배당 병행 여부",
      "명도·퇴거 분쟁 포함 여부",
    ],
    commonMistakes: [
      "경매 통지만 받고 배당요구를 하지 않는 경우",
      "대항력 없다고 포기해 보험·배당을 확인하지 않는 경우",
      "집주인에게만 독촉하고 배당절차 참여를 안 하는 경우",
      "배당 종기 후에야 임차권등기명령을 알아보는 경우",
    ],
    caseExample: {
      title: "경매 배당에서 우선변제 + 보증보험 병행",
      body: "임대인 채무로 경매가 진행됐고, 배당 종기 5일 전 상담했습니다. 배당요구와 전세보증보험 청구를 병행해 보증금 대부분을 회수한 사례입니다.",
    },
    documents: [
      "전세계약서·확정일자 계약서",
      "등기부등본·경매기일통지 등",
      "전입세대열람·주민등록등본",
      "배당요구서·임차권등기명령 서류",
      "전세보증보험 증권(해당 시)",
    ],
    procedures: [
      "경매·배당 종기·기일 확인",
      "대항력·우선변제권 요건 점검",
      "임차권등기명령·배당요구(미완 시)",
      "경매 배당절차 참여",
      "전세보증보험 청구(해당 시)",
      "부족분 집행·퇴거·이사 일정 조율",
    ],
    diagnosisLinks: [
      { href: "/전세보증금자가진단", label: "전세보증금 자가진단" },
      { href: "/임차권등기명령자가진단", label: "임차권등기명령 자가진단" },
      { href: "/내용증명자가진단", label: "내용증명 자가진단" },
      { href: "/자가진단", label: "자가진단 허브" },
    ],
    serviceLinks: [
      { href: "/임대차전세", label: "임대차·전세 허브" },
      { href: "/민사소송", label: "민사·채권 허브" },
      { href: "/services/real-estate-registration", label: "부동산등기 안내" },
      { href: "/contact", label: "상담 문의" },
    ],
    faqLinks: [
      { href: "/faq/jeonse-registration-faq", label: "전세권·임차권 FAQ" },
      { href: "/faq/how-to-book-consultation-faq", label: "상담 예약" },
      { href: "/faq/lawyer-fee-and-remote-faq", label: "수임료 안내" },
      { href: "/faq/ownership-transfer-documents", label: "등기 FAQ" },
    ],
    extraLinks: [
      { href: "/blog/jeonse-deposit-return-certified-mail", label: "전세보증금 반환" },
      { href: "/tools/jeonse-deposit-timeline", label: "전세 타임라인" },
      { href: "/blog/when-jeonse-right-registration-needed", label: "전세권등기 필요 시점" },
      { href: "/contact", label: "상담 문의" },
    ],
    faqs: [
      {
        question: "경매가 끝나면 바로 나가야 하나요?",
        answer:
          "낙찰 후 명도(퇴거) 문제는 별도로 발생할 수 있습니다. 보증금 배당·퇴거 일정·새 임대차를 함께 준비하는 것이 좋습니다.",
      },
      {
        question: "배당으로 전액 못 받으면 어떻게 하나요?",
        answer:
          "전세보증보험, 임대인에 대한 나머지 채권 집행, 손해배상 등 추가 경로를 검토해야 합니다. 배당 결과에 따라 달라집니다.",
      },
    ],
    relatedSituationSlugs: [
      "jeonse-deposit-unpaid",
      "임차권등기명령-필요할-때",
      "집주인-연락-두절",
      "payment-order-certified-mail",
    ],
    priority: 90,
    urgent: true,
    isNew: true,
    addedAt: "2026-07-21",
    serviceSlug: "real-estate-registration",
  }),

  defineSituationPage({
    slug: "전입신고-확정일자-없음",
    cardTitle: "전입신고·확정일자 안 했을 때",
    cardDescription: "대항력·우선변제 보완 방법",
    h1: "전입신고나 확정일자를 안 했는데 전세 보증금이 위험한가요?",
    metaDescriptionBase:
      "전입신고·확정일자 미비 시 대항력·우선변제권 영향, 보완 방법, 전세사기 예방을 정리했습니다. 부산 전세 상담.",
    intro: `전입신고와 확정일자는 임차인 권리의 기본입니다. 둘 다 없거나 늦으면 경매·임대인 파산 시 보증금 회수가 어려워질 수 있습니다. ${LOCAL}`,
    situationCategory: "jeonse-lease",
    searchIntent: "전입신고 확정일자 없을 때",
    conclusion:
      "전입신고·확정일자는 전세 보호의 출발점입니다. 아직 계약 중이라면 즉시 보완하고, 분쟁 중이라면 남은 권리부터 확인하세요.",
    situationChecklist: [
      "전입신고를 하지 않았거나 늦게 했다",
      "확정일자를 받지 않았다",
      "집주인이 보증금 반환을 미루고 있다",
      "계약서만 있고 다른 서류가 없다",
      "전세사기를 당한 것 같아 불안하다",
    ],
    firstChecks: [
      "전입신고·실제 점유·주택임대차 신고 여부 확인",
      "확정일자 수령 가능 여부(계약서 원본·관할 주민센터)",
      "등기부등본상 임대인 소유·담보·경매 여부",
      "전세보증보험 가입 시 전입·확정일자 요건 충족 여부",
      "계약 체결 시점·보증금 지급일·점유 시작일 정리",
    ],
    solutions: solutions([
      {
        title: "전입·확정일자 즉시 보완",
        body: "아직 거주 중이라면 전입신고와 확정일자를 즉시 받아 권리 기초를 마련합니다.",
        whenToChoose: "현재 점유 중이고 임대인·관할 기관 협조가 가능한 경우",
      },
      {
        title: "계약·점유 증거 확보",
        body: "관리비·공과금·이사·CCTV 등 실거주 증거와 계약서·이체 내역을 모읍니다.",
        whenToChoose: "전입·확정일자가 늦었지만 점유 사실은 분명한 경우",
      },
      {
        title: "분쟁·경매 대응",
        body: "이미 분쟁·경매가 진행 중이면 남은 요건과 전세보증보험·배당 가능성을 검토합니다.",
        whenToChoose: "보증금 미반환·집주인 연락두절·경매 통지를 받은 경우",
      },
    ]),
    selfHandleCases: [
      "아직 거주 중이고 전입·확정일자만 보완하면 되는 경우",
      "전세보증보험 청구 요건을 충족할 수 있는 경우",
      "임대인과 원만히 반환 일정이 합의된 경우",
    ],
    lawyerNeededCases: [
      "전입·확정일자 모두 없고 경매·압류가 진행 중인 경우",
      "전세사기·가짜 임대인·이중계약 의심",
      "보증금 규모가 크고 회수 가능성이 불투명한 경우",
      "대항력·우선변제 인정 여부가 쟁점인 경우",
    ],
    costFactors: [
      "보증금 규모와 분쟁·소송·배당 포함 여부",
      "전세보증보험·임차권등기명령 병행",
      "증거·사실관계 정리 난이도",
      "경매·집행 긴급 대응 필요성",
    ],
    commonMistakes: [
      "계약서만 있다고 권리가 충분하다고 생각하는 경우",
      "전입신고를 미루다 다른 세입자·경매가 발생하는 경우",
      "확정일자 없이 보증보험 청구가 된다고 가정하는 경우",
      "점유·이사·공과금 증거를 남기지 않는 경우",
    ],
    caseExample: {
      title: "확정일자 누락 후 증거 정리·협의",
      body: "전입은 했지만 확정일자를 받지 않은 채 계약 만료가 다가왔습니다. 점유·관리비 증거를 정리하고 확정일자 소급 가능 여부를 확인한 뒤, 내용증명과 반환 협의를 진행한 사례입니다.",
    },
    documents: [
      "전세계약서 원본",
      "보증금 이체·영수 증빙",
      "전입세대열람·주민등록등본",
      "관리비·공과금·이사 관련 증빙",
      "등기부등본",
    ],
    procedures: [
      "전입·확정일자·점유 현황 확인",
      "즉시 보완 가능한 절차 진행",
      "등기부·임대인 상태 조사",
      "증거·계약·이체 기록 정리",
      "내용증명·협의 또는 임차권등기명령",
      "전세보증보험·배당 검토",
    ],
    diagnosisLinks: [
      { href: "/전세보증금자가진단", label: "전세보증금 자가진단" },
      { href: "/임차권등기명령자가진단", label: "임차권등기명령 자가진단" },
      { href: "/내용증명자가진단", label: "내용증명 자가진단" },
      { href: "/자가진단", label: "자가진단 허브" },
    ],
    serviceLinks: [
      { href: "/임대차전세", label: "임대차·전세 허브" },
      { href: "/services/real-estate-registration", label: "부동산등기 안내" },
      { href: "/전세사기예방교육", label: "전세사기 예방 교육" },
      { href: "/contact", label: "상담 문의" },
    ],
    faqLinks: [
      { href: "/faq/jeonse-registration-faq", label: "전세권·임차권 FAQ" },
      { href: "/faq/how-to-book-consultation-faq", label: "상담 예약" },
      { href: "/faq/lawyer-fee-and-remote-faq", label: "수임료 안내" },
      { href: "/faq/ownership-transfer-documents", label: "등기 FAQ" },
    ],
    extraLinks: [
      { href: "/blog/jeonse-deposit-return-certified-mail", label: "전세보증금 반환" },
      { href: "/tools/jeonse-deposit-timeline", label: "전세 타임라인" },
      { href: "/blog/certified-mail-before-sending", label: "내용증명 보내기 전" },
      { href: "/contact", label: "상담 문의" },
    ],
    faqs: [
      {
        question: "나중에 전입신고해도 대항력이 생기나요?",
        answer:
          "전입신고 시점부터 대항력이 생깁니다. 늦을수록 다른 권리자·경매와 경합할 위험이 커집니다.",
      },
      {
        question: "확정일자는 소급 적용되나요?",
        answer:
          "확정일자는 받은 날짜가 기준이며, 계약 체결일로 소급되지 않습니다. 가능한 한 계약 직후 받는 것이 좋습니다.",
      },
    ],
    relatedSituationSlugs: [
      "jeonse-deposit-unpaid",
      "임차권등기명령-필요할-때",
      "집주인-연락-두절",
      "전세-경매-진행",
    ],
    priority: 82,
    isNew: true,
    addedAt: "2026-07-21",
    serviceSlug: "real-estate-registration",
  }),
];
