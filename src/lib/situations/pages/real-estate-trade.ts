import { defineSituationPage, solutions } from "../create-page";

const LOCAL =
  "부산 해운대구·센텀, 재송동·반여동 일대에서도 전화·카카오톡·방문(예약) 상담이 가능합니다.";

export const realEstateTradePages = [
  defineSituationPage({
    slug: "잔금-후-소유권이전-거부",
    cardTitle: "잔금 후 등기 협조 거부",
    cardDescription: "매도인·서류·이행청구",
    h1: "잔금을 치렀는데 매도인이 소유권이전등기를 거부해요",
    metaDescriptionBase:
      "잔금 후 매도인 등기 협조 거부 시 계약 특약, 등기부 확인, 이행청구·손해배상 절차를 정리했습니다. 부산 부동산등기 상담.",
    intro: `잔금까지 치렀는데 매도인이 인감·서류·등기 출석을 거부하면 법적으로 아직 내 집이 아닙니다. 계약서 특약과 등기부 상태를 먼저 확인하고, 이행청구·등기절차 이행 소송을 검토해야 합니다. ${LOCAL}`,
    situationCategory: "real-estate-trade",
    searchIntent: "잔금 후 소유권이전 거부",
    conclusion:
      "잔금 후 등기 거부는 계약 위반에 해당할 수 있습니다. 등기부·특약 확인 후 서면 독촉과 법적 이행 청구를 검토하세요.",
    situationChecklist: [
      "잔금은 치렀는데 매도인이 등기를 거부한다",
      "매도인이 인감·서류 제출을 미룬다",
      "중개사는 '조금만 기다리라'고만 한다",
      "등기 전 매도인에게 다른 채무·압류가 생길까 걱정된다",
      "계약 특약에 등기 기한이 있는지 모르겠다",
    ],
    firstChecks: [
      "매매계약서·특약의 잔금·등기 이전 기한·위약 조항 확인",
      "최신 등기부등본으로 소유자·가압류·근저당 변동 확인",
      "잔금 이체·영수·중개대장 증빙 정리",
      "매도인 연락처·주소·대리 등기 가능 여부",
      "대출 실행·말소 조건과 실제 진행 상태 대조",
    ],
    solutions: solutions([
      {
        title: "서면 독촉·협의",
        body: "내용증명 등으로 등기 협조를 요청하고, 특약상 기한·위약금을 근거로 협의합니다.",
        whenToChoose: "매도인과 연락이 되고 협조 가능성이 있는 경우",
      },
      {
        title: "등기 대행·말소 병행",
        body: "서류·말소만 정리되면 등기를 진행하고, 매도인 불이행 부분은 별도로 대응합니다.",
        whenToChoose: "근저당 말소 등 기술적 문제만 남은 경우",
      },
      {
        title: "이행청구·손해배상 소송",
        body: "매도인이 계속 거부하면 소유권이전등기절차 이행청구·손해배상을 검토합니다.",
        whenToChoose: "협의가 결렬되고 가압류·재매매 위험이 있는 경우",
      },
    ]),
    selfHandleCases: [
      "매도인이 일시적 사유로 서류만 늦추는 경우",
      "근저당 말소 일정만 조율하면 되는 경우",
      "계약·서류·인감이 모두 준비된 단순 등기",
    ],
    lawyerNeededCases: [
      "매도인 연락 두절·명시적 거부",
      "잔금 후 등기부에 가압류·추가 담보 발생",
      "이행청구·가압류·손해배상 등 법적 대응 필요",
      "법인·공유·신탁 등 복잡한 매도인 구조",
    ],
    costFactors: [
      "등기·말소 비용과 분쟁·소송 포함 여부",
      "가압류·손해배상 청구 범위",
      "부동산 가액·담보·대출 구조",
      "긴급 가압류·가처분 필요성",
    ],
    commonMistakes: [
      "잔금만 치르고 등기부 재확인을 안 하는 경우",
      "구두 약속만 믿고 서면 독촉을 안 하는 경우",
      "중개사 말만 듣고 매도인에게 직접 요청하지 않는 경우",
      "특약·위약금 조항 확인 없이 무기한 기다리는 경우",
    ],
    caseExample: {
      title: "잔금 후 등기 거부·이행청구",
      body: "아파트 잔금 후 매도인이 '바쁘다'며 등기를 2개월 미루다 거부했습니다. 등기부에 가압류가 들어오기 전 내용증명과 이행청구 소송을 검토하고, 등기와 손해배상을 병행한 사례입니다.",
    },
    documents: [
      "매매계약서·중개대장·특약",
      "등기부등본",
      "잔금 이체·영수 증빙",
      "매도인·매수인 인감증명서",
      "내용증명·협의 기록",
    ],
    procedures: [
      "계약·등기부·잔금 증빙 대조",
      "매도인에게 등기 협조 서면 요청",
      "근저당 말소·대출 조건 확인",
      "등기 신청 또는 이행청구 소송",
      "등기 완료·손해배상·위약금 검토",
    ],
    diagnosisLinks: [
      { href: "/소유권이전등기자가진단", label: "소유권이전등기 자가진단" },
      { href: "/부동산등기자가진단", label: "부동산등기 자가진단" },
      { href: "/내용증명자가진단", label: "내용증명 자가진단" },
      { href: "/자가진단", label: "자가진단 허브" },
    ],
    serviceLinks: [
      { href: "/services/ownership-transfer", label: "소유권이전등기 안내" },
      { href: "/services/real-estate-registration", label: "부동산등기 안내" },
      { href: "/부동산등기", label: "부동산등기 허브" },
      { href: "/민사소송", label: "민사·채권 허브" },
    ],
    faqLinks: [
      { href: "/faq/ownership-transfer-documents", label: "소유권이전 서류" },
      { href: "/faq/inheritance-registration-with-mortgage", label: "근저당 있는 부동산" },
      { href: "/faq/gift-registration-faq", label: "증여 등기 FAQ" },
      { href: "/faq/how-to-book-consultation-faq", label: "상담 예약" },
    ],
    extraLinks: [
      { href: "/blog/delayed-ownership-transfer-after-balance", label: "잔금 후 등기 지연" },
      { href: "/blog/when-seller-withholds-registration-documents", label: "매도인 서류 미제출" },
      { href: "/services/cases/centum-ownership-transfer-case", label: "센텀 소유권이전 사례" },
      { href: "/contact", label: "상담 문의" },
    ],
    faqs: [
      {
        question: "잔금만 치르면 내 집인가요?",
        answer:
          "등기 전에는 법적으로 소유권이 넘어오지 않았을 수 있습니다. 잔금·계약만으로는 부족하므로 등기 완료를 확인해야 합니다.",
      },
      {
        question: "매도인 거부 시 위약금을 받을 수 있나요?",
        answer:
          "계약 특약·위약금 조항과 거부 경위에 따라 가능합니다. 계약서와 협의·거부 기록을 함께 검토해야 합니다.",
      },
    ],
    relatedSituationSlugs: [
      "real-estate-sale-registration",
      "근저당-말소-지연",
      "공동명의-정리",
      "payment-order-certified-mail",
    ],
    priority: 89,
    isNew: true,
    addedAt: "2026-07-21",
    serviceSlug: "ownership-transfer",
  }),

  defineSituationPage({
    slug: "공동명의-정리",
    cardTitle: "부동산 공동명의 정리",
    cardDescription: "지분 매매·분할·등기",
    h1: "공동명의 부동산을 한 명 명의로 정리하려면?",
    metaDescriptionBase:
      "부동산 공동명의 해소, 지분 매매·증여·분할 등기 절차와 세금·협의 포인트를 정리했습니다. 부산 부동산등기 상담.",
    intro: `배우자·부모·형제와 공동명의인 부동산은 매매·담보·상속 때마다 모든 명의자 협의가 필요합니다. 지분 정리 방식(매매·증여·분할)에 따라 세금과 절차가 달라집니다. ${LOCAL}`,
    situationCategory: "real-estate-trade",
    searchIntent: "공동명의 부동산 정리",
    conclusion:
      "공동명의 정리는 지분 비율·세금·대출·가족 관계를 함께 봐야 합니다. 협의 후 등기 방식을 정하세요.",
    situationChecklist: [
      "배우자·가족과 공동명의인 집을 한 명으로 바꾸고 싶다",
      "이혼·상속 후 지분 정리가 필요하다",
      "공동명의 때문에 대출·매매가 어렵다",
      "지분 매매와 증여 중 무엇이 유리한지 모르겠다",
      "공명의자 중 일부가 협조하지 않는다",
    ],
    firstChecks: [
      "등기부등본상 지분 비율·담보·가압류 확인",
      "공유자 전원 협의 가능 여부",
      "지분 매매·증여·상환각·분할 등 방식 비교",
      "취득세·양도소득세·증여세 영향 검토",
      "대출·근저당 승낙 필요 여부",
    ],
    solutions: solutions([
      {
        title: "지분 매매 등기",
        body: "한 공유자가 다른 공유자의 지분을 매수해 단독 명의로 만듭니다.",
        whenToChoose: "시가 반영·세금 구조가 매매로 유리한 경우",
      },
      {
        title: "증여·분할",
        body: "가족 간 증여나 상속·협의분할로 지분을 재배분합니다.",
        whenToChoose: "가족 관계·세금·상속 계획과 맞는 경우",
      },
      {
        title: "공유물 분할·경매",
        body: "협의가 안 되면 법적 분할·경매 절차를 검토합니다.",
        whenToChoose: "공유자 간 의견 충돌·연락 두절",
      },
    ]),
    selfHandleCases: [
      "공유자 전원 협의·인감·서류가 준비된 단순 지분 이전",
      "세금·대출 문제 없이 지분 매매만 진행하면 되는 경우",
    ],
    lawyerNeededCases: [
      "공유자 일부 비협조·지분 다툼",
      "담보·가압류·세무 구조가 복잡한 경우",
      "이혼·상속·유류분과 연계된 분할",
      "법인·신탁·외국인 공유자 포함",
    ],
    costFactors: [
      "지분 가액·등기·세금 규모",
      "공유자 수·협의·분쟁 대응",
      "담보 말소·대출 승낙",
      "증여·매매·분할 방식 선택",
    ],
    commonMistakes: [
      "세금 비교 없이 증여·매매를 선택하는 경우",
      "공유자 한 명 동의 없이 등기 신청하는 경우",
      "담보·대출 승낙 확인 없이 지분 이전하는 경우",
      "구두 합의만 하고 지분 매매계약서를 안 쓰는 경우",
    ],
    caseExample: {
      title: "부부 공동명의 → 배우자 단독명의",
      body: "부부 공유 아파트를 대출 정리 후 배우자 단독명의로 바꾸려 상담했습니다. 지분 매매와 증여 세금을 비교하고, 은행 담보 승낙 후 등기를 진행한 사례입니다.",
    },
    documents: [
      "등기부등본",
      "공유자 인감증명서·신분증",
      "지분 매매계약서 또는 증여·분할 서류",
      "취득세·등록면허세 관련 서류",
      "대출·담보 승낙서(해당 시)",
    ],
    procedures: [
      "등기부·지분·담보 확인",
      "정리 방식(매매·증여·분할) 결정",
      "공유자 협의·계약서 작성",
      "세금 신고·납부",
      "지분 이전·말소 등기 신청",
      "등기 완료 후 대출·실거래 신고",
    ],
    diagnosisLinks: [
      { href: "/부동산등기자가진단", label: "부동산등기 자가진단" },
      { href: "/소유권이전등기자가진단", label: "소유권이전등기 자가진단" },
      { href: "/상속등기자가진단", label: "상속등기 자가진단" },
      { href: "/자가진단", label: "자가진단 허브" },
    ],
    serviceLinks: [
      { href: "/services/ownership-transfer", label: "소유권이전등기 안내" },
      { href: "/services/real-estate-registration", label: "부동산등기 안내" },
      { href: "/부동산등기", label: "부동산등기 허브" },
      { href: "/상속", label: "상속 허브" },
    ],
    faqLinks: [
      { href: "/faq/ownership-transfer-documents", label: "소유권이전 서류" },
      { href: "/faq/gift-registration-faq", label: "증여 등기 FAQ" },
      { href: "/faq/multiple-heirs-inheritance-registration", label: "공동상속인 등기" },
      { href: "/faq/inheritance-registration-with-mortgage", label: "근저당 있는 부동산" },
    ],
    extraLinks: [
      { href: "/blog/real-estate-ownership-transfer-procedure", label: "소유권이전 절차" },
      { href: "/부산부동산등기", label: "부산 부동산등기" },
      { href: "/센텀부동산등기", label: "센텀 부동산등기" },
      { href: "/contact", label: "상담 문의" },
    ],
    faqs: [
      {
        question: "공동명의 해제는 꼭 등기해야 하나요?",
        answer:
          "법적으로 명의를 바꾸려면 등기가 필요합니다. 구두·계약만으로는 등기부상 공동명의가 유지됩니다.",
      },
      {
        question: "지분 1/2 매매와 증여 중 뭐가 나은가요?",
        answer:
          "가액·보유 기간·가족 관계·대출에 따라 달라집니다. 세금 시뮬레이션 후 결정하는 것이 좋습니다.",
      },
    ],
    relatedSituationSlugs: [
      "real-estate-sale-registration",
      "parent-passed-away",
      "siblings-not-cooperating",
      "잔금-후-소유권이전-거부",
    ],
    priority: 84,
    isNew: true,
    addedAt: "2026-07-21",
    serviceSlug: "ownership-transfer",
  }),

  defineSituationPage({
    slug: "근저당-말소-지연",
    cardTitle: "근저당 말소가 지연될 때",
    cardDescription: "말소 순서·대출·등기",
    h1: "집 매매·대환인데 근저당 말소가 늦어지면 어떻게 하나요?",
    metaDescriptionBase:
      "근저당권 말소 지연 시 매매·대출·소유권이전등기 순서, 채권자 협조, 특약 대응을 정리했습니다. 부산 부동산등기 상담.",
    intro: `매매·대환·상속 등기에서 근저당 말소가 늦어지면 전체 일정이 밀립니다. 말소채권액·채권자·대출 실행 순서를 계약과 대조해야 합니다. ${LOCAL}`,
    situationCategory: "real-estate-trade",
    searchIntent: "근저당 말소 지연",
    conclusion:
      "근저당 말소는 등기의 전제 조건인 경우가 많습니다. 채권자·은행·매도인 일정을 서면으로 고정하세요.",
    situationChecklist: [
      "잔금·대출 실행 전인데 근저당 말소가 안 됐다",
      "매도인·은행·법무사 일정이 맞지 않는다",
      "말소비용·채권자 협조 문제로 지연된다",
      "등기부에 근저당이 여러 건 있다",
      "말소 전 가압류·추가 설정이 걱정된다",
    ],
    firstChecks: [
      "등기부등본상 근저당권자·채무액·설정 순서 확인",
      "매매계약·대출 약정의 말소·잔금·등기 순서",
      "말소채권액·완제 영수·채권자 인감 요건",
      "동시 이행(잔금·말소·이전) 특약 여부",
      "중도금·에스크로·공탁 등 리스크 관리 방안",
    ],
    solutions: solutions([
      {
        title: "말소·이전 동시 진행",
        body: "채권자·은행·매도·매수·법무사 일정을 맞춰 말소와 소유권이전을 같은 날 처리합니다.",
        whenToChoose: "잔금·대출 실행 일정이 정해진 경우",
      },
      {
        title: "채권자 직접 독촉·서면 확인",
        body: "말소 지연 원인이 채권자·은행 쪽일 때 서면으로 말소 일정·서류를 확정합니다.",
        whenToChoose: "매도인·은행 협조는 있으나 절차만 밀리는 경우",
      },
      {
        title: "계약 특약·손해배상 검토",
        body: "말소 지연으로 손해가 커지면 매도인·중개사 책임·특약 위약을 검토합니다.",
        whenToChoose: "장기 지연·가압류 위험·이중 매매 우려",
      },
    ]),
    selfHandleCases: [
      "은행·법무사 일정만 조율하면 되는 단순 말소",
      "말소채권액·완제 확인이 끝난 경우",
    ],
    lawyerNeededCases: [
      "채권자·매도인·은행 간 책임 다툼",
      "다수 근저당·가압류·복잡한 선후순위",
      "말소 지연으로 잔금·등기·손해배상 분쟁",
      "법인·분양·신탁 부동산",
    ],
    costFactors: [
      "근저당 건수·말소·등기 비용",
      "잔금·대출·동시 이행 조율",
      "분쟁·손해배상·가압류 대응",
      "긴급 일정·당일 접수",
    ],
    commonMistakes: [
      "말소 없이 소유권이전만 먼저 하려는 경우",
      "말소채권액·완제 확인 없이 잔금을 치르는 경우",
      "구두로만 '말소한다'고 믿는 경우",
      "등기부 최신본 없이 일정을 잡는 경우",
    ],
    caseExample: {
      title: "대환 대출 당일 말소·이전",
      body: "기존 근저당 2건이 설정된 아파트 대환 매매에서 말소 지연이 발생했습니다. 채권자·은행·법무사 일정을 당일 동시 이행으로 맞춰 말소와 소유권이전을 완료한 사례입니다.",
    },
    documents: [
      "등기부등본",
      "근저당권 말소 서류·완제 영수",
      "매매계약서·대출 약정",
      "말소채권액 확인서·채권자 인감",
      "잔금·이체 증빙",
    ],
    procedures: [
      "등기부·근저당 현황 확인",
      "말소채권액·완제·채권자 서류 준비",
      "잔금·대출·말소·이전 일정 확정",
      "말소등기 접수·완료",
      "소유권이전등기 접수",
      "등기부등본 재발급·대출 실행 확인",
    ],
    diagnosisLinks: [
      { href: "/부동산등기자가진단", label: "부동산등기 자가진단" },
      { href: "/소유권이전등기자가진단", label: "소유권이전등기 자가진단" },
      { href: "/상속등기자가진단", label: "상속등기 자가진단" },
      { href: "/자가진단", label: "자가진단 허브" },
    ],
    serviceLinks: [
      { href: "/services/real-estate-registration", label: "부동산등기 안내" },
      { href: "/services/ownership-transfer", label: "소유권이전등기 안내" },
      { href: "/부산근저당말소등기", label: "근저당 말소 안내" },
      { href: "/부동산등기", label: "부동산등기 허브" },
    ],
    faqLinks: [
      { href: "/faq/inheritance-registration-with-mortgage", label: "근저당 있는 부동산" },
      { href: "/faq/ownership-transfer-documents", label: "소유권이전 서류" },
      { href: "/faq/gift-registration-faq", label: "증여 등기 FAQ" },
      { href: "/faq/how-to-book-consultation-faq", label: "상담 예약" },
    ],
    extraLinks: [
      { href: "/blog/real-estate-ownership-transfer-procedure", label: "소유권이전 절차" },
      { href: "/부산근저당말소등기", label: "부산 근저당 말소" },
      { href: "/services/cases/centum-ownership-transfer-case", label: "소유권이전 사례" },
      { href: "/contact", label: "상담 문의" },
    ],
    faqs: [
      {
        question: "말소 없이 집을 살 수 있나요?",
        answer:
          "매매계약·대출 조건에 따라 다르지만, 근저당이 남은 채로 이전하면 매수인에게도 담보 책임이 올 수 있어 일반적으로 말소 후 이전합니다.",
      },
      {
        question: "말소는 누가 신청하나요?",
        answer:
          "보통 채무 변제 후 채권자(은행) 협조로 말소등기를 합니다. 계약서에 말소 의무·비용 부담을 명확히 두는 것이 좋습니다.",
      },
    ],
    relatedSituationSlugs: [
      "real-estate-sale-registration",
      "잔금-후-소유권이전-거부",
      "parent-passed-away",
      "셀프등기-실수",
    ],
    priority: 86,
    isNew: true,
    addedAt: "2026-07-21",
    serviceSlug: "real-estate-registration",
  }),

  defineSituationPage({
    slug: "셀프등기-실수",
    cardTitle: "셀프등기 실수·보정",
    cardDescription: "각하·오기·말소 방법",
    h1: "인터넷 등기(셀프등기)를 잘못 냈는데 어떻게 고치나요?",
    metaDescriptionBase:
      "셀프등기 실수·보정·각하·착오등기 말소 방법과 재신청 절차를 정리했습니다. 부산 부동산등기 법무사 상담.",
    intro: `등기소 온라인 등기는 저렴하지만, 한 번 잘못 들어가면 말소·재등기 비용과 시간이 더 듭니다. 접수 전 등기부·서식·말소사항을 꼼꼼히 확인해야 합니다. ${LOCAL}`,
    situationCategory: "real-estate-trade",
    searchIntent: "셀프등기 실수 보정",
    conclusion:
      "셀프등기 실수는 접수 전 발견할수록 비용이 적습니다. 각하·완료 후에도 말소·재등기 경로가 있으니 등기부로 현재 상태부터 확인하세요.",
    situationChecklist: [
      "인터넷 등기 신청을 잘못 작성했다",
      "등기소에서 보정·각하 통지를 받았다",
      "이미 잘못된 등기가 완료된 것 같다",
      "금액·지분·당사자 표시를 틀렸다",
      "말소해야 할 등기를 또 설정했다",
    ],
    firstChecks: [
      "최신 등기부등본으로 접수·완료·각하 상태 확인",
      "보정통지·각하 사유·기한 확인",
      "착오등기 말소·재등기 가능 여부",
      "취득세·등록면허세 중복 납부 여부",
      "담보·가압류 등 후속 리스크 점검",
    ],
    solutions: solutions([
      {
        title: "보정 기간 내 수정",
        body: "보정통지 기한 안에 서류·신청 내용을 수정해 등기를 완료합니다.",
        whenToChoose: "아직 각하·완료 전 보정 단계인 경우",
      },
      {
        title: "착오등기 말소·재등기",
        body: "잘못 완료된 등기를 말소하고 올바른 등기를 다시 신청합니다.",
        whenToChoose: "당사자 표시·지분·등기 원인 착오로 완료된 경우",
      },
      {
        title: "전문가 재위임",
        body: "복잡한 착오·다수 등기·담보가 얽힌 경우 법무사가 말소·재등기를 일괄 처리합니다.",
        whenToChoose: "말소·재등기·세금·대출까지 연쇄 문제가 있는 경우",
      },
    ]),
    selfHandleCases: [
      "보정통지 사유가 단순하고 기한 내 수정 가능한 경우",
      "각하 후 올바른 서식으로 재신청만 하면 되는 경우",
    ],
    lawyerNeededCases: [
      "잘못된 등기가 완료·담보·매매에 영향을 준 경우",
      "지분·상속인·법인 표시 착오",
      "말소·재등기·세금 환급·대출 승인 연계",
      "보정·각하 반복·등기소 문의 필요",
    ],
    costFactors: [
      "보정·말소·재등기 횟수",
      "부동산 가액·등록세",
      "착오 범위·담보·분쟁",
      "긴급 처리·당일 접수",
    ],
    commonMistakes: [
      "등기부등본 확인 없이 신청하는 경우",
      "말소사항·지분·주소 표시 오류",
      "각하 통지를 방치해 기한을 놓치는 경우",
      "잘못 완료된 등기를 방치하는 경우",
    ],
    caseExample: {
      title: "지분 착오 상속등기 말소·재등기",
      body: "셀프등기로 상속 지분을 잘못 입력해 등기가 완료됐습니다. 착오등기 말소 후 올바른 협의분할 등기를 재신청한 사례입니다.",
    },
    documents: [
      "등기부등본(말소사항 포함)",
      "보정통지·각하통지·접수증",
      "원 등기 신청서·첨부서류",
      "말소·재등기 신청서·인감증명서",
      "세금 납부·환급 관련 서류",
    ],
    procedures: [
      "등기부·통지서로 현재 상태 확인",
      "보정·각하·완료 여부 판단",
      "보정 제출 또는 말소등기 신청",
      "올바른 등기 재신청",
      "세금·대출·담보 후속 처리",
      "최종 등기부등본 확인",
    ],
    diagnosisLinks: [
      { href: "/부동산등기자가진단", label: "부동산등기 자가진단" },
      { href: "/소유권이전등기자가진단", label: "소유권이전등기 자가진단" },
      { href: "/상속등기자가진단", label: "상속등기 자가진단" },
      { href: "/자가진단", label: "자가진단 허브" },
    ],
    serviceLinks: [
      { href: "/services/real-estate-registration", label: "부동산등기 안내" },
      { href: "/services/ownership-transfer", label: "소유권이전등기 안내" },
      { href: "/services/inheritance-registration", label: "상속등기 안내" },
      { href: "/부동산등기", label: "부동산등기 허브" },
    ],
    faqLinks: [
      { href: "/faq/ownership-transfer-documents", label: "소유권이전 서류" },
      { href: "/faq/inheritance-registration-cost", label: "상속등기 비용" },
      { href: "/faq/multiple-heirs-inheritance-registration", label: "공동상속인 등기" },
      { href: "/faq/how-to-book-consultation-faq", label: "상담 예약" },
    ],
    extraLinks: [
      { href: "/blog/real-estate-ownership-transfer-procedure", label: "소유권이전 절차" },
      { href: "/부산부동산등기", label: "부산 부동산등기" },
      { href: "/services/cases/centum-ownership-transfer-case", label: "등기 사례" },
      { href: "/contact", label: "상담 문의" },
    ],
    faqs: [
      {
        question: "각하되면 수수료는 돌려받나요?",
        answer:
          "각하·미완료 시 등기 수수료·세금 처리는 사유·단계에 따라 달라집니다. 통지서와 영수증을 함께 확인해야 합니다.",
      },
      {
        question: "잘못된 등기를 방치하면 위험한가요?",
        answer:
          "매매·담보·상속·세무 모두 등기부 기준으로 처리되므로, 착오 등기는 가능한 빨리 말소·정정하는 것이 좋습니다.",
      },
    ],
    relatedSituationSlugs: [
      "real-estate-sale-registration",
      "parent-passed-away",
      "근저당-말소-지연",
      "공동명의-정리",
    ],
    priority: 78,
    isNew: true,
    addedAt: "2026-07-21",
    serviceSlug: "real-estate-registration",
  }),
];
