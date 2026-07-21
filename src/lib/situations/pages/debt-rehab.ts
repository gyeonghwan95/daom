import { defineSituationPage, solutions } from "../create-page";

const LOCAL =
  "부산 해운대구·센텀, 재송동·반여동 일대에서도 전화·카카오톡·방문(예약) 상담이 가능합니다.";

export const debtRehabPages = [
  defineSituationPage({
    slug: "급여-압류-빚",
    cardTitle: "급여가 압류됐을 때",
    cardDescription: "압류 한도·회생·해제",
    h1: "급여가 압류됐는데 생활비는 어떻게 하나요?",
    metaDescriptionBase:
      "급여압류 시 생활비·압류 한도, 채권압류 해제, 개인회생·워크아웃 검토를 정리했습니다. 부산 채무·회생 상담.",
    intro: `급여압류는 생계에 바로 영향을 줍니다. 압류 가능 범위·우선변제·생계비 공제 규정을 확인하고, 개인회생·워크아웃·분할 상환 등 경로를 검토해야 합니다. ${LOCAL}`,
    situationCategory: "debt-rehab",
    searchIntent: "급여 압류 대응",
    conclusion:
      "급여압류는 방치하면 생활이 어려워집니다. 압류 통지·채권자·한도를 확인하고 회생·협상·이의 경로를 검토하세요.",
    situationChecklist: [
      "회사에서 급여가 압류됐다는 통지를 받았다",
      "통장에서 돈이 빠져나갔다",
      "생활비가 부족해 생계가 어렵다",
      "압류를 풀려면 무엇을 해야 하는지 모르겠다",
      "개인회생을 해야 압류가 멈추는지 궁금하다",
    ],
    firstChecks: [
      "압류·추심명령·채권자·채무액·사건번호 확인",
      "압류 가능 급여 범위·생계비 공제 여부",
      "다른 채권자·담보·보증 채무 현황",
      "개인회생·워크아웃·신용회복 대상 여부",
      "압류 이의·취소·집행정지 가능성",
    ],
    solutions: solutions([
      {
        title: "채권자와 분할·감면 협상",
        body: "압류 전·후 채권자와 분할 상환·이자 감면을 협의해 압류 강도를 낮춥니다.",
        whenToChoose: "채무 규모가 비교적 작고 채권자 협의가 가능한 경우",
      },
      {
        title: "개인회생 신청",
        body: "회생 개시결정 후 압류·추심이 정지되고, 변제계획에 따라 채무를 정리합니다.",
        whenToChoose: "채무·소득 구조상 회생 요건을 충족하는 경우",
      },
      {
        title: "워크아웃·신용회복",
        body: "금융권 채무 위주라면 신용회복위원회 등 공적 지원 프로그램을 검토합니다.",
        whenToChoose: "은행·카드사 채무가 대부분인 경우",
      },
    ]),
    selfHandleCases: [
      "단일 채권자·소액 채무로 직접 분할 상환 합의가 가능한 경우",
      "신용회복위원회 안내대로 워크아웃 신청이 가능한 경우",
    ],
    lawyerNeededCases: [
      "다수 채권자·담보·보증·사업자 채무가 함께 있는 경우",
      "압류로 생계가 즉시 위협되는 경우",
      "개인회생·파산 신청서·변제계획 작성이 필요한 경우",
      "압류·추심·이의 절차가 복잡한 경우",
    ],
    costFactors: [
      "총 채무액·채권자 수·담보 여부",
      "개인회생·파산·워크아웃 선택",
      "법원·인지대·송달료",
      "긴급 집행정지·이의 대응",
    ],
    commonMistakes: [
      "압류 통지를 확인하지 않고 통장만 보는 경우",
      "불법 추심·과다 압류에 이의하지 않는 경우",
      "회생 가능성 확인 없이 고리 대출을 하는 경우",
      "배우자·가족 명의로 재산을 옮기려는 경우",
    ],
    caseExample: {
      title: "급여압류 후 개인회생 개시",
      body: "카드·대출 채권자 다수로 급여 1/3가 압류됐습니다. 채무·소득 목록을 정리해 개인회생을 신청하고, 개시결정 후 압류가 정지된 사례입니다.",
    },
    documents: [
      "압류·추심명령·집행문 사본",
      "채무 목록·잔액증명서",
      "급여명세·소득 증빙",
      "가족관계증명서·주민등록등본",
      "재산 목록·통장 거래내역",
    ],
    procedures: [
      "압류·채권자·채무액 확인",
      "생계비·압류 한도 점검",
      "협상·워크아웃·회생 적합성 검토",
      "개인회생·파산 신청(해당 시)",
      "개시·인가·면책 또는 합의 이행",
      "압류 해제·추심 종료 확인",
    ],
    diagnosisLinks: [
      { href: "/개인회생자가진단", label: "개인회생 자가진단" },
      { href: "/개인파산자가진단", label: "개인파산 자가진단" },
      { href: "/채무자가진단", label: "채무 자가진단" },
      { href: "/자가진단", label: "자가진단 허브" },
    ],
    serviceLinks: [
      { href: "/services/personal-rehabilitation", label: "개인회생 안내" },
      { href: "/services/bankruptcy", label: "개인파산 안내" },
      { href: "/개인회생파산", label: "개인회생·파산 허브" },
      { href: "/contact", label: "상담 문의" },
    ],
    faqLinks: [
      { href: "/faq/personal-rehabilitation-eligibility-faq", label: "개인회생 자격" },
      { href: "/faq/bankruptcy-vs-rehabilitation-faq", label: "회생 vs 파산" },
      { href: "/faq/personal-rehabilitation-documents-faq", label: "개인회생 서류" },
      { href: "/faq/who-can-file-bankruptcy-faq", label: "파산 신청 자격" },
    ],
    extraLinks: [
      { href: "/blog/bankruptcy-vs-personal-rehabilitation", label: "회생·파산 비교" },
      { href: "/services/cases/busan-personal-rehabilitation-consultation", label: "개인회생 상담 사례" },
      { href: "/부산개인회생", label: "부산 개인회생" },
      { href: "/contact", label: "상담 문의" },
    ],
    faqs: [
      {
        question: "개인회생을 신청하면 바로 압류가 멈추나요?",
        answer:
          "개시결정이 나면 원칙적으로 압류·추심이 정지됩니다. 신청 전·후 시점과 채권 종류에 따라 달라질 수 있어 상담이 필요합니다.",
      },
      {
        question: "압류된 급여 중 생활비는 받을 수 있나요?",
        answer:
          "법령상 압류 한도·생계비 공제 규정이 있습니다. 과다 압류로 보이면 이의·정정을 검토할 수 있습니다.",
      },
    ],
    relatedSituationSlugs: [
      "personal-rehabilitation-bankruptcy",
      "개인회생-가능-여부",
      "보증채무-부담",
      "빚-감당-어려울-때",
    ],
    priority: 96,
    urgent: true,
    isNew: true,
    addedAt: "2026-07-21",
    serviceSlug: "personal-rehabilitation",
  }),

  defineSituationPage({
    slug: "개인회생-가능-여부",
    cardTitle: "개인회생 가능한지 확인",
    cardDescription: "자격·소득·재산 요건",
    h1: "내가 개인회생 대상인지 어떻게 알 수 있나요?",
    metaDescriptionBase:
      "개인회생 신청 자격, 소득·재산·채무 요건, 파산과의 차이, 부산회생법원 절차를 정리했습니다.",
    intro: `개인회생은 일정 소득으로 채무를 조정하는 절차입니다. 총 채무·채권자 수·소득·재산·최근 면책 이력을 함께 봐야 가능 여부가 나옵니다. ${LOCAL}`,
    situationCategory: "debt-rehab",
    searchIntent: "개인회생 가능 여부",
    conclusion:
      "개인회생 가능 여부는 채무·소득·재산·면책 이력을 표로 정리하면 대략 가늠할 수 있습니다. 자가진단 후 상담을 권합니다.",
    situationChecklist: [
      "여러 금융사·카드·대출 빚이 있다",
      "매달 이자만 갚고 원금은 줄지 않는다",
      "개인회생과 파산 중 무엇이 맞는지 모르겠다",
      "집·차가 있어 회생이 불가한지 걱정된다",
      "5년 내 면책·회생 이력이 있다",
    ],
    firstChecks: [
      "총 채무액·채권자 수·담보·보증 구조 목록화",
      "월 소득·고정 지출·부양가족 확인",
      "부동산·예금·보험·퇴직금 등 재산 가액",
      "최근 5년 면책·회생·워크아웃 이력",
      "급여압류·가압류·연체 기간",
    ],
    solutions: solutions([
      {
        title: "개인회생",
        body: "3~5년 변제계획으로 채무를 조정하고, 인가 후 성실 상환 시 잔여 채무 면책을 받습니다.",
        whenToChoose: "일정 소득이 있고 회생 요건을 충족하는 경우",
      },
      {
        title: "개인파산",
        body: "재산·소득으로 변제가 어렵다면 파산·면책을 검토합니다.",
        whenToChoose: "소득·재산이 부족하고 채무가 과중한 경우",
      },
      {
        title: "워크아웃·개별 협상",
        body: "금융권 채무 위주거나 회생·파산 요건에 약간 못 미치면 워크아웃·분할 상환을 검토합니다.",
        whenToChoose: "채무 규모가 작거나 은행 채무 비중이 큰 경우",
      },
    ]),
    selfHandleCases: [
      "신용회복위원회 워크아웃 대상으로 안내받은 경우",
      "채무·소득이 단순해 자가진단 결과가 명확한 경우",
    ],
    lawyerNeededCases: [
      "담보·보증·사업자·세금 채무가 함께 있는 경우",
      "부동산·가족 재산이 있어 변제계획 설계가 필요한 경우",
      "면책 이력·기각 사유가 걱정되는 경우",
      "회생·파산 신청서·변제계획안 작성이 필요한 경우",
    ],
    costFactors: [
      "채무·재산·채권자 복잡도",
      "회생·파산 선택",
      "법원 비용·송달료",
      "변제계획 설계·보정 대응",
    ],
    commonMistakes: [
      "인터넷 후기만 보고 무조건 회생을 선택하는 경우",
      "재산·소득을 숨기려다 기각되는 경우",
      "신청 전 고리 대출·재산 처분을 하는 경우",
      "파산과 회생 차이를 모르고 잘못 선택하는 경우",
    ],
    caseExample: {
      title: "담보·무담보 혼합 채무 회생 검토",
      body: "주택담보·카드·보증 채무가 섞여 회생 가능 여부를 묻는 상담이었습니다. 재산·소득·변제율을 계산해 회생 적합성과 예상 변제액을 안내한 사례입니다.",
    },
    documents: [
      "채무 목록·잔액증명서",
      "소득 증빙(급여·사업)",
      "재산 목록·등기부등본",
      "가족관계증명서·주민등록등본",
      "최근 거래내역·연체·압류 서류",
    ],
    procedures: [
      "채무·소득·재산 현황 정리",
      "회생·파산·워크아웃 적합성 검토",
      "변제계획안·신청서 작성",
      "부산회생법원 등 관할 법원 접수",
      "개시결정·인가·변제·면책",
    ],
    diagnosisLinks: [
      { href: "/개인회생자가진단", label: "개인회생 자가진단" },
      { href: "/개인파산자가진단", label: "개인파산 자가진단" },
      { href: "/채무자가진단", label: "채무 자가진단" },
      { href: "/자가진단", label: "자가진단 허브" },
    ],
    serviceLinks: [
      { href: "/services/personal-rehabilitation", label: "개인회생 안내" },
      { href: "/services/bankruptcy", label: "개인파산 안내" },
      { href: "/개인회생파산", label: "개인회생·파산 허브" },
      { href: "/contact", label: "상담 문의" },
    ],
    faqLinks: [
      { href: "/faq/personal-rehabilitation-eligibility-faq", label: "개인회생 자격" },
      { href: "/faq/bankruptcy-vs-rehabilitation-faq", label: "회생 vs 파산" },
      { href: "/faq/personal-rehabilitation-documents-faq", label: "개인회생 서류" },
      { href: "/faq/bankruptcy-discharge-faq", label: "면책 FAQ" },
    ],
    extraLinks: [
      { href: "/blog/personal-rehabilitation-before-application", label: "신청 전 체크" },
      { href: "/blog/bankruptcy-vs-personal-rehabilitation", label: "회생·파산 비교" },
      { href: "/부산개인회생", label: "부산 개인회생" },
      { href: "/contact", label: "상담 문의" },
    ],
    faqs: [
      {
        question: "최저생계비보다 소득이 많아야 하나요?",
        answer:
          "회생은 일정 소득으로 변제계획을 세우는 절차입니다. 소득·부양가족·채무 규모에 따라 변제액이 달라지므로 개별 계산이 필요합니다.",
      },
      {
        question: "회생 중에도 집을 유지할 수 있나요?",
        answer:
          "담보·가액·변제계획에 따라 달라집니다. 무조건 못 사는 것은 아니며, 변제계획 설계가 중요합니다.",
      },
    ],
    relatedSituationSlugs: [
      "personal-rehabilitation-bankruptcy",
      "급여-압류-빚",
      "보증채무-부담",
      "빚-감당-어려울-때",
    ],
    priority: 92,
    isNew: true,
    addedAt: "2026-07-21",
    serviceSlug: "personal-rehabilitation",
  }),

  defineSituationPage({
    slug: "보증채무-부담",
    cardTitle: "보증으로 생긴 빚",
    cardDescription: "연대·주채무·회생",
    h1: "보증 서명 때문에 빚을 떠안게 됐어요",
    metaDescriptionBase:
      "연대보증·보증채무 대응, 주채무자·채권자 협상, 개인회생·구상권 검토를 정리했습니다. 부산 채무 상담.",
    intro: `연대보증은 주채무자가 갚지 않으면 보증인에게 바로 독촉·압류가 올 수 있습니다. 보증 범위·주채무자 재산·회생·구상권을 함께 봐야 합니다. ${LOCAL}`,
    situationCategory: "debt-rehab",
    searchIntent: "보증채무 대응",
    conclusion:
      "보증채무는 주채무자 추심과 별개로 진행될 수 있습니다. 보증서·채권자·주채무자 상태를 먼저 확인하세요.",
    situationChecklist: [
      "가족·지인 빚을 보증했는데 연락이 왔다",
      "주채무자는 못 갚는다고 한다",
      "내 통장·급여가 압류됐다",
      "보증 범위·기간을 잊었다",
      "보증 때문에 개인회생을 고민한다",
    ],
    firstChecks: [
      "보증계약서·연대보증 여부·보증 한도·기간",
      "주채무자·채권자·현재 잔액·연체 상태",
      "본인 재산·소득·다른 채무",
      "주채무자에게 구상·분담 가능성",
      "회생·워크아웃·면책 적용 가능성",
    ],
    solutions: solutions([
      {
        title: "주채무자·채권자 협상",
        body: "주채무자 상환 독촉과 채권자 분할·감면 협의를 병행합니다.",
        whenToChoose: "주채무자와 연락이 되고 일부 상환 여지가 있는 경우",
      },
      {
        title: "개인회생·파산",
        body: "보증채무 포함 전체 채무를 회생·파산으로 정리합니다.",
        whenToChoose: "보증채무가 생계를 위협하고 회생 요건을 충족하는 경우",
      },
      {
        title: "구상권·소송 검토",
        body: "보증인이 대신 변제한 뒤 주채무자에게 구상권을 행사합니다.",
        whenToChoose: "이미 변제했거나 주채무자에게 재산이 있는 경우",
      },
    ]),
    selfHandleCases: [
      "주채무자가 곧 상환하기로 합의한 경우",
      "소액·단기 보증으로 협상만으로 해결 가능한 경우",
    ],
    lawyerNeededCases: [
      "급여·통장 압류 등 즉시 생계 위협",
      "다수 보증·담보·사업자 연대",
      "보증계약 효력·면책·기간 다툼",
      "회생·파산·구상권 복합 검토",
    ],
    costFactors: [
      "보증채무 규모·연대보증 수",
      "회생·파산·협상·소송 범위",
      "주채무자·채권자 수",
      "압류·집행 긴급 대응",
    ],
    commonMistakes: [
      "주채무자만 믿고 아무 대응 안 하는 경우",
      "보증서 확인 없이 채권자 요구에만 응하는 경우",
      "재산·계좌를 급히 옮기려는 경우",
      "구상권 포기 각서 등 불리한 합의",
    ],
    caseExample: {
      title: "가족 사업 보증 → 회생",
      body: "부모 사업자 대출 연대보증으로 채권자 추심·압류가 시작됐습니다. 보증 범위 확인 후 개인회생으로 전체 채무를 정리하고, 추후 구상권 가능성을 안내한 사례입니다.",
    },
    documents: [
      "보증계약서·대출 약정",
      "채무 잔액증명·독촉·압류 서류",
      "주채무자·채권자 정보",
      "소득·재산 목록",
      "변제·협의 기록",
    ],
    procedures: [
      "보증·채무·채권자 확인",
      "주채무자 독촉·협상",
      "압류·집행 대응",
      "회생·파산·워크아웃 검토",
      "신청·변제·면책 또는 구상",
    ],
    diagnosisLinks: [
      { href: "/개인회생자가진단", label: "개인회생 자가진단" },
      { href: "/개인파산자가진단", label: "개인파산 자가진단" },
      { href: "/채무자가진단", label: "채무 자가진단" },
      { href: "/자가진단", label: "자가진단 허브" },
    ],
    serviceLinks: [
      { href: "/services/personal-rehabilitation", label: "개인회생 안내" },
      { href: "/services/bankruptcy", label: "개인파산 안내" },
      { href: "/개인회생파산", label: "개인회생·파산 허브" },
      { href: "/민사소송", label: "민사·채권 허브" },
    ],
    faqLinks: [
      { href: "/faq/personal-rehabilitation-eligibility-faq", label: "개인회생 자격" },
      { href: "/faq/bankruptcy-vs-rehabilitation-faq", label: "회생 vs 파산" },
      { href: "/faq/who-can-file-bankruptcy-faq", label: "파산 자격" },
      { href: "/faq/lawyer-fee-and-remote-faq", label: "수임료·원격 상담" },
    ],
    extraLinks: [
      { href: "/blog/bankruptcy-vs-personal-rehabilitation", label: "회생·파산 비교" },
      { href: "/부산개인회생", label: "부산 개인회생" },
      { href: "/services/cases/busan-personal-rehabilitation-consultation", label: "회생 상담 사례" },
      { href: "/contact", label: "상담 문의" },
    ],
    faqs: [
      {
        question: "주채무자가 안 갚으면 바로 보증인에게 오나요?",
        answer:
          "연대보증이면 채권자는 보증인에게 바로 청구할 수 있습니다. 보증 종류·계약 내용을 확인해야 합니다.",
      },
      {
        question: "보증채무도 회생에 포함되나요?",
        answer:
          "원칙적으로 포함됩니다. 다만 담보·보증 구조에 따라 변제계획이 달라지므로 목록화가 필요합니다.",
      },
    ],
    relatedSituationSlugs: [
      "personal-rehabilitation-bankruptcy",
      "급여-압류-빚",
      "개인회생-가능-여부",
      "빚-감당-어려울-때",
    ],
    priority: 88,
    isNew: true,
    addedAt: "2026-07-21",
    serviceSlug: "personal-rehabilitation",
  }),

  defineSituationPage({
    slug: "빚-감당-어려울-때",
    cardTitle: "빚이 감당이 안 될 때",
    cardDescription: "정리 경로·우선순위",
    h1: "빚이 너무 많아 어디서부터 정리해야 할까요?",
    metaDescriptionBase:
      "과중 채무 시 우선순위, 워크아웃·회생·파산·협상 경로, 금지 행위를 정리했습니다. 부산 채무 상담.",
    intro: `채무는 금액만큼 '어떤 빚인지'가 중요합니다. 담보·보증·세금·가압류 여부에 따라 우선순위가 달라집니다. ${LOCAL}`,
    situationCategory: "debt-rehab",
    searchIntent: "빚 감당 어려울 때",
    conclusion:
      "채무 목록·압류·담보·소득을 표로 정리하면 다음 경로가 보입니다. 무작정 미루거나 새 빚은 피하세요.",
    situationChecklist: [
      "여러 곳 빚이 쌓여 이자만 내고 있다",
      "최소 생활비도 빠듯하다",
      "어떤 빚부터 갚아야 할지 모르겠다",
      "독촉·압류·가족에게 들킬까 걱정된다",
      "회생·파산·워크아웃 중 선택이 어렵다",
    ],
    firstChecks: [
      "채권자별 잔액·이자·연체·담보·보증 표 작성",
      "급여·통장 압류·가압류 현황",
      "월 소득·필수 지출·부양가족",
      "재산(부동산·차·예금)과 면책 이력",
      "세금·4대보험·민사·형사 등 우선 채무 구분",
    ],
    solutions: solutions([
      {
        title: "우선순위·생활비 확보",
        body: "압류·담보·생계 위협 채무를 먼저 분류하고, 최소 생활비를 지키는 계획을 세웁니다.",
        whenToChoose: "당장 압류·독촉으로 일상이 막힌 경우",
      },
      {
        title: "공적·금융 지원",
        body: "신용회복·워크아웃·채무 조정 프로그램 적합성을 확인합니다.",
        whenToChoose: "금융권 채무 비중이 크고 요건을 충족하는 경우",
      },
      {
        title: "개인회생·파산",
        body: "채무 총량·소득·재산 구조상 법적 정리가 필요하면 회생·파산을 검토합니다.",
        whenToChoose: "협상·워크아웃으로 해결이 어려운 경우",
      },
    ]),
    selfHandleCases: [
      "채무 규모가 작고 1~2곳과 분할 합의 가능",
      "신용회복위원회 등 기관 안내로 워크아웃 신청",
    ],
    lawyerNeededCases: [
      "채권자·담보·보증·세금이 복합",
      "압류·가압류·명도 등 긴급 집행",
      "회생·파산 신청·변제계획 설계 필요",
      "불법 추심·과다 압류 대응",
    ],
    costFactors: [
      "채무 총액·채권자 수",
      "회생·파산·협상 선택",
      "압류·소송·집행 포함 여부",
      "재산·담보 복잡도",
    ],
    commonMistakes: [
      "이자만 막기 위해 고리 대출",
      "채무 목록 없이 감으로 상환",
      "재산·계좌 허위 이전",
      "불법 사채·무등록 대부 이용",
    ],
    caseExample: {
      title: "다중 채무 우선순위 정리 후 회생",
      body: "카드·대출·보증·세금 채무가 뒤섞여 막막해 상담했습니다. 표로 정리해 긴급 압류 채무와 회생 포함 범위를 구분하고, 개인회생 신청 방향을 잡은 사례입니다.",
    },
    documents: [
      "채무·채권자 목록",
      "잔액증명·연체·압류 서류",
      "소득·지출·재산 목록",
      "가족관계·주민등록등본",
      "거래내역·납세·4대보험",
    ],
    procedures: [
      "채무·소득·재산 전수 조사",
      "긴급·담보·압류 우선순위 설정",
      "워크아웃·협상·회생·파산 검토",
      "선택 경로 신청·진행",
      "변제·면책·생활 재정 복구",
    ],
    diagnosisLinks: [
      { href: "/채무자가진단", label: "채무 자가진단" },
      { href: "/개인회생자가진단", label: "개인회생 자가진단" },
      { href: "/개인파산자가진단", label: "개인파산 자가진단" },
      { href: "/자가진단", label: "자가진단 허브" },
    ],
    serviceLinks: [
      { href: "/services/personal-rehabilitation", label: "개인회생 안내" },
      { href: "/services/bankruptcy", label: "개인파산 안내" },
      { href: "/개인회생파산", label: "개인회생·파산 허브" },
      { href: "/contact", label: "상담 문의" },
    ],
    faqLinks: [
      { href: "/faq/bankruptcy-vs-rehabilitation-faq", label: "회생 vs 파산" },
      { href: "/faq/personal-rehabilitation-eligibility-faq", label: "개인회생 자격" },
      { href: "/faq/personal-rehabilitation-documents-faq", label: "개인회생 서류" },
      { href: "/faq/lawyer-fee-and-remote-faq", label: "수임료 안내" },
    ],
    extraLinks: [
      { href: "/blog/personal-rehabilitation-before-application", label: "신청 전 체크" },
      { href: "/blog/bankruptcy-vs-personal-rehabilitation", label: "회생·파산 비교" },
      { href: "/부산개인회생", label: "부산 개인회생" },
      { href: "/contact", label: "상담 문의" },
    ],
    faqs: [
      {
        question: "빚이 많으면 무조건 파산인가요?",
        answer:
          "아닙니다. 소득·재산·채무 종류에 따라 회생·워크아웃·협상이 더 맞을 수 있습니다.",
      },
      {
        question: "가족에게 알리지 않고 진행할 수 있나요?",
        answer:
          "절차·재산·소득 조사 범위상 배우자·가족 재산·소득이 관련될 수 있습니다. 사건별로 상담이 필요합니다.",
      },
    ],
    relatedSituationSlugs: [
      "personal-rehabilitation-bankruptcy",
      "급여-압류-빚",
      "개인회생-가능-여부",
      "보증채무-부담",
    ],
    priority: 87,
    isNew: true,
    addedAt: "2026-07-21",
    serviceSlug: "personal-rehabilitation",
  }),
];
