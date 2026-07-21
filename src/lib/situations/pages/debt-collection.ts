import { defineSituationPage, solutions } from "../create-page";

const LOCAL =
  "부산 해운대구·센텀, 재송동·반여동 일대에서도 전화·카카오톡·방문(예약) 상담이 가능합니다.";

export const debtCollectionPages = [
  defineSituationPage({
    slug: "대여금-못-받음",
    cardTitle: "빌려준 돈을 못 받을 때",
    cardDescription: "차용증·지급명령·소송",
    h1: "친구·지인에게 빌려준 돈을 돌려받지 못하면?",
    metaDescriptionBase:
      "대여금 반환 청구, 차용증·이체 증거, 내용증명·지급명령·소송 절차를 정리했습니다. 부산 채권회수 상담.",
    intro: `돈을 빌려줬는데 갚지 않으면, 먼저 채권·증거·소멸시효·상대 주소를 정리해야 합니다. 관계를 유지할지, 법적으로 권리를 고정할지에 따라 경로가 달라집니다. ${LOCAL}`,
    situationCategory: "debt-collection",
    searchIntent: "대여금 못 받을 때",
    conclusion:
      "대여금은 증거·시효·송달 가능 주소가 핵심입니다. 내용증명·지급명령·소장 순서를 사건에 맞게 선택하세요.",
    situationChecklist: [
      "돈을 빌려줬는데 약속일이 지나도 안 갚는다",
      "차용증은 없지만 이체·카톡 기록은 있다",
      "연락을 피하거나 일부만 갚겠다고 한다",
      "소멸시효가 지났는지 걱정된다",
      "가족·친구라 소송이 부담스럽다",
    ],
    firstChecks: [
      "대여 원인·금액·변제 약정·일부 변제 이력",
      "차용증·영수증·이체·녹취·카톡 증거",
      "소멸시효 중단·완성 여부",
      "채무자 성명·주소·송달 가능성",
      "지급명령·소송 관할",
    ],
    solutions: solutions([
      {
        title: "내용증명·합의",
        body: "관계 유지를 위해 서면 독촉·분할 변제 합의를 시도하고 시효를 중단합니다.",
        whenToChoose: "상대가 연락 가능하고 합의 여지가 있는 경우",
      },
      {
        title: "지급명령",
        body: "증거·금액이 비교적 명확하면 법원 지급명령으로 빠르게 확정을 노립니다.",
        whenToChoose: "차용 사실·금액·송달 주소가 분명한 경우",
      },
      {
        title: "소송·강제집행",
        body: "분쟁·상계·일부 변제 등 복잡하면 소장 제기 후 강제집행까지 검토합니다.",
        whenToChoose: "지급명령 이의·금액·사실관계 다툼",
      },
    ]),
    selfHandleCases: [
      "소액·증거 명확·지급명령 전자신청 가능",
      "합의·분할 변제 문서화 가능",
    ],
    lawyerNeededCases: [
      "차용증·증거 부족·금액 다툼",
      "채무자 주소 불명·연락 두절",
      "지급명령 이의·상계·손배 반론",
      "집행·재산 조사 필요",
    ],
    costFactors: [
      "채권액·인지대·송달료",
      "지급명령·소송·집행 범위",
      "증거·사실관계 정리",
      "채무자 추적·재산조회",
    ],
    commonMistakes: [
      "구두 약속만 믿고 증거 미보관",
      "시효 확인 없이 미루기",
      "채무자 주소 불명인데 독촉만",
      "합의 없이 금액·일정이 불명확",
    ],
    caseExample: {
      title: "이체·카톡 증거로 지급명령",
      body: "차용증 없이 이체·카톡만 있던 800만 원 대여금 사건. 증거를 정리해 지급명령을 신청하고, 이의 없이 확정된 사례입니다.",
    },
    documents: [
      "차용증·각서·영수증",
      "이체·입금 내역",
      "카카오톡·녹취·문자",
      "내용증명·지급명령 신청서",
      "채무자 신분·주소 확인",
    ],
    procedures: [
      "채권·증거·시효 정리",
      "내용증명·협의(선택)",
      "지급명령 또는 소장",
      "확정·집행권원",
      "강제집행·회수",
    ],
    diagnosisLinks: [
      { href: "/지급명령자가진단", label: "지급명령 자가진단" },
      { href: "/내용증명자가진단", label: "내용증명 자가진단" },
      { href: "/채권회수자가진단", label: "채권회수 자가진단" },
      { href: "/자가진단", label: "자가진단 허브" },
    ],
    serviceLinks: [
      { href: "/민사소송", label: "민사·채권 허브" },
      { href: "/공탁채권회수", label: "공탁·채권회수 허브" },
      { href: "/contact", label: "상담 문의" },
      { href: "/faq", label: "FAQ" },
    ],
    faqLinks: [
      { href: "/faq/how-to-book-consultation-faq", label: "상담 예약" },
      { href: "/faq/lawyer-fee-and-remote-faq", label: "수임료·원격" },
      { href: "/faq/ownership-transfer-documents", label: "서류 FAQ" },
      { href: "/faq/jeonse-registration-faq", label: "분쟁 FAQ" },
    ],
    extraLinks: [
      { href: "/부산지방법원지급명령", label: "부산지방법원 지급명령" },
      { href: "/부산지방법원채권회수", label: "부산 채권회수" },
      { href: "/blog/certified-mail-before-sending", label: "내용증명 보내기 전" },
      { href: "/contact", label: "상담 문의" },
    ],
    faqs: [
      {
        question: "차용증 없이도 받을 수 있나요?",
        answer:
          "이체·카톡·녹취 등으로 대여 사실·금액·변제 약정을 입증할 수 있으면 가능합니다. 다만 분쟁 시 입증 부담이 커질 수 있습니다.",
      },
      {
        question: "친구라도 소송해도 되나요?",
        answer:
          "법적으로는 가능합니다. 다만 관계·비용·회수 가능성을 함께 고려해 내용증명·지급명령 등 단계적 접근도 검토할 수 있습니다.",
      },
    ],
    relatedSituationSlugs: [
      "payment-order-certified-mail",
      "채무자-재산-모름",
      "판결-후-강제집행",
      "내용증명-받았을-때",
    ],
    priority: 86,
    isNew: true,
    addedAt: "2026-07-21",
  }),

  defineSituationPage({
    slug: "채무자-재산-모름",
    cardTitle: "채무자 재산을 모를 때",
    cardDescription: "재산조회·집행·회수",
    h1: "돈을 못 받는데 상대방 재산이 있는지 어떻게 알죠?",
    metaDescriptionBase:
      "채권회수 시 채무자 재산조회, 부동산·예금·급여 압류, 집행 절차를 정리했습니다. 부산 채권회수 상담.",
    intro: `판결·지급명령이 있어도 재산이 없으면 회수가 어렵습니다. 부동산·예금·급여·채권 등 집행 가능 재산을 조회·압류하는 절차가 필요합니다. ${LOCAL}`,
    situationCategory: "debt-collection",
    searchIntent: "채무자 재산 조회",
    conclusion:
      "채권 확정 후에는 재산조회·압류 대상 선정이 관건입니다. 부동산·금융·급여부터 확인하세요.",
    situationChecklist: [
      "판결·지급명령은 있는데 돈이 안 들어온다",
      "상대가 무재력이라고 한다",
      "부동산·차·사업체가 있는지 모르겠다",
      "예금·급여 압류가 가능한지 궁금하다",
      "재산을 숨긴 것 같다",
    ],
    firstChecks: [
      "집행권원(판결·지급명령·공정증서 등) 확정 여부",
      "채무자 성명·주민번호·주소",
      "부동산·자동차·법인 지분 등기 조회",
      "예금·급여·채권 압류 가능성",
      "재산명시·채무자재산조회 신청",
    ],
    solutions: solutions([
      {
        title: "재산조회·압류",
        body: "부동산·예금·급여·채권 등 집행 가능 재산을 조회하고 압류·추심합니다.",
        whenToChoose: "집행권원이 있고 채무자 신원이 확인되는 경우",
      },
      {
        title: "재산명시·조회명령",
        body: "채무자가 재산 목록 제출을 거부하면 재산명시·재산조회 절차를 이용합니다.",
        whenToChoose: "재산 은닉·허위 신고 의심",
      },
      {
        title: "채권·담보·보증 추징",
        body: "제3채무자·연대보증인·담보권 실행 등 다른 경로를 검토합니다.",
        whenToChoose: "주 채무자 재산이 부족한 경우",
      },
    ]),
    selfHandleCases: [
      "부동산·예금 등 명확한 재산이 확인된 단순 집행",
      "소액·전자집행 가능",
    ],
    lawyerNeededCases: [
      "재산조회 결과 불명·은닉",
      "법인·담보·보증·제3채무자",
      "복수 채권자·배당·우선순위",
      "가압류·가처분·집행 이의",
    ],
    costFactors: [
      "집행·송달·등기·조회 비용",
      "재산조회·명시·추심 범위",
      "채권액·회수 난이도",
      "분쟁·이의 대응",
    ],
    commonMistakes: [
      "판결만 받고 집행 안 함",
      "시효·집행 기간 방치",
      "재산조회 없이 포기",
      "불법 추심·사적 압박",
    ],
    caseExample: {
      title: "예금·급여 압류로 회수",
      body: "지급명령 확정 후 채무자가 무재력을 주장했습니다. 재산조회로 예금·급여를 확인해 압류·추심으로 일부 회수한 사례입니다.",
    },
    documents: [
      "집행권원·확정증명",
      "채무자 신분·주소",
      "재산조회·압류 신청서",
      "부동산·등기 조회 결과",
      "압류·추심·배당 서류",
    ],
    procedures: [
      "집행권원·채무자 확인",
      "재산조회(부동산·금융·급여)",
      "압류·추심·전부명령",
      "배당·회수",
      "부족분 추가 집행·보증·담보",
    ],
    diagnosisLinks: [
      { href: "/채권회수자가진단", label: "채권회수 자가진단" },
      { href: "/지급명령자가진단", label: "지급명령 자가진단" },
      { href: "/내용증명자가진단", label: "내용증명 자가진단" },
      { href: "/자가진단", label: "자가진단 허브" },
    ],
    serviceLinks: [
      { href: "/민사소송", label: "민사·채권 허브" },
      { href: "/공탁채권회수", label: "공탁·채권회수 허브" },
      { href: "/contact", label: "상담 문의" },
      { href: "/faq", label: "FAQ" },
    ],
    faqLinks: [
      { href: "/faq/how-to-book-consultation-faq", label: "상담 예약" },
      { href: "/faq/lawyer-fee-and-remote-faq", label: "수임료" },
      { href: "/faq/ownership-transfer-documents", label: "서류 FAQ" },
      { href: "/faq/jeonse-registration-faq", label: "집행 FAQ" },
    ],
    extraLinks: [
      { href: "/부산지방법원채권회수", label: "부산 채권회수" },
      { href: "/부산지방법원지급명령", label: "지급명령 안내" },
      { href: "/blog/certified-mail-before-sending", label: "내용증명" },
      { href: "/contact", label: "상담 문의" },
    ],
    faqs: [
      {
        question: "재산조회는 누가 하나요?",
        answer:
          "집행권원을 가진 채권자가 법원 집행 절차를 통해 신청합니다. 직접 남의 통장을 조회할 수는 없습니다.",
      },
      {
        question: "재산이 없으면 끝인가요?",
        answer:
          "당장 회수가 어려워도 집행권원·시효·나중에 생길 재산(승계·취득)을 고려해 전략을 세울 수 있습니다.",
      },
    ],
    relatedSituationSlugs: [
      "payment-order-certified-mail",
      "대여금-못-받음",
      "판결-후-강제집행",
      "공사대금-못-받음",
    ],
    priority: 84,
    isNew: true,
    addedAt: "2026-07-21",
  }),

  defineSituationPage({
    slug: "공사대금-못-받음",
    cardTitle: "공사대금·용역비 미수",
    cardDescription: "계약·기성·지급명령",
    h1: "공사·용역 대금을 받지 못하면 어떻게 해야 하나요?",
    metaDescriptionBase:
      "공사대금·용역비 미수금 회수, 도급·하도급·기성·검수, 내용증명·소송을 정리했습니다. 부산 채권회수 상담.",
    intro: `공사·용역 대금은 계약·기성·검수·하자·정산 여부가 쟁점이 되기 쉽습니다. 청구 금액·이행 증거·발주자 재산을 함께 정리해야 합니다. ${LOCAL}`,
    situationCategory: "debt-collection",
    searchIntent: "공사대금 못 받을 때",
    conclusion:
      "공사대금은 '얼마를·왜·언제' 청구하는지가 명확해야 합니다. 계약·기성·세금계산서·검수 기록을 먼저 모으세요.",
    situationChecklist: [
      "공사·용역은 끝났는데 대금을 안 준다",
      "발주자가 하자·정산 문제를 제기한다",
      "하도급·원도급·실제 발주자가 다르다",
      "구두·카톡 계약만 있다",
      "기성·검수·세금계산서가 맞지 않는다",
    ],
    firstChecks: [
      "도급·용역 계약·특약·기성·지급 조건",
      "완공·검수·하자·정산·공제 주장",
      "기성고·세금계산서·이체·대화 기록",
      "발주자·원수급인·실제 채무자",
      "소멸시효·유보·지체상금",
    ],
    solutions: solutions([
      {
        title: "정산·협의",
        body: "하자·공제·정산 범위를 문서로 정리하고 잔액 지급을 협의합니다.",
        whenToChoose: "관계·공사 후속 유지·분쟁 최소화",
      },
      {
        title: "내용증명·지급명령",
        body: "청구 금액·이행 증거가 분명하면 서면 독촉·지급명령을 검토합니다.",
        whenToChoose: "미지급액·이행이 비교적 명확",
      },
      {
        title: "소송·가압류·집행",
        body: "금액·하자·상계 다툼·발주자 도피 시 소송·가압류·집행을 검토합니다.",
        whenToChoose: "대금 규모 큼·재산 처분 우려",
      },
    ]),
    selfHandleCases: [
      "계약·기성·세금계산서 일치·협의 가능",
      "소액·단순 미지급",
    ],
    lawyerNeededCases: [
      "하자·정산·상계·원도급 구조 복잡",
      "발주자·법인·실소유자 불명",
      "대금·손해배상·하자반환 병행",
      "가압류·집행·우선순위",
    ],
    costFactors: [
      "미수금액·쟁점·소송 규모",
      "가압류·집행·감정",
      "하자·정산 대응",
      "다수 당사자·하도급",
    ],
    commonMistakes: [
      "구두 계약·기성 기록 없음",
      "하자 주장에 대응 기록 없음",
      "세금계산서·실제 청구 불일치",
      "원수급인·하수급인 혼동",
    ],
    caseExample: {
      title: "인테리어 공사대금 지급명령",
      body: "완공 후 발주자가 하자를 이유로 대금 지급을 거부했습니다. 계약·사진·세금계산서로 이행을 입증하고 지급명령을 신청한 사례입니다.",
    },
    documents: [
      "도급·용역 계약·견적·변경계약",
      "기성·검수·준공·세금계산서",
      "사진·일지·자재·인건비",
      "이체·대화·내용증명",
      "하자·정산 관련 기록",
    ],
    procedures: [
      "계약·기성·미수액 정리",
      "하자·정산 쟁점 대응",
      "내용증명·협의",
      "지급명령·소송",
      "가압류·집행·회수",
    ],
    diagnosisLinks: [
      { href: "/지급명령자가진단", label: "지급명령 자가진단" },
      { href: "/채권회수자가진단", label: "채권회수 자가진단" },
      { href: "/내용증명자가진단", label: "내용증명 자가진단" },
      { href: "/자가진단", label: "자가진단 허브" },
    ],
    serviceLinks: [
      { href: "/민사소송", label: "민사·채권 허브" },
      { href: "/공탁채권회수", label: "공탁·채권회수 허브" },
      { href: "/contact", label: "상담 문의" },
      { href: "/faq", label: "FAQ" },
    ],
    faqLinks: [
      { href: "/faq/how-to-book-consultation-faq", label: "상담 예약" },
      { href: "/faq/lawyer-fee-and-remote-faq", label: "수임료" },
      { href: "/faq/ownership-transfer-documents", label: "계약·서류" },
      { href: "/faq/jeonse-registration-faq", label: "분쟁 FAQ" },
    ],
    extraLinks: [
      { href: "/부산지방법원채권회수", label: "부산 채권회수" },
      { href: "/blog/certified-mail-before-sending", label: "내용증명" },
      { href: "/부산지방법원지급명령", label: "지급명령" },
      { href: "/contact", label: "상담 문의" },
    ],
    faqs: [
      {
        question: "하자가 있다고 대금을 안 줘도 되나요?",
        answer:
          "하자 범위·수선·공제·지급 유보는 계약·법리에 따라 달라집니다. 무조적 지급 거부는 아닐 수 있어 사실관계 확인이 필요합니다.",
      },
      {
        question: "구두로 맡긴 공사도 받을 수 있나요?",
        answer:
          "이행·금액·완공을 입증할 증거(사진·자재·대화·부분 지급)가 있으면 가능합니다. 다만 입증이 어려울 수 있습니다.",
      },
    ],
    relatedSituationSlugs: [
      "payment-order-certified-mail",
      "대여금-못-받음",
      "채무자-재산-모름",
      "판결-후-강제집행",
    ],
    priority: 85,
    isNew: true,
    addedAt: "2026-07-21",
  }),

  defineSituationPage({
    slug: "판결-후-강제집행",
    cardTitle: "판결 후 돈 안 들어올 때",
    cardDescription: "집행·압류·배당",
    h1: "판결은 받았는데 돈이 들어오지 않으면?",
    metaDescriptionBase:
      "민사판결 확정 후 강제집행, 부동산·예금·급여 압류, 배당·회수 절차를 정리했습니다. 부산 집행 상담.",
    intro: `승소 판결이 나도 집행하지 않으면 돈이 들어오지 않습니다. 집행권원 확정·재산조회·압류·배당 순서와 기한을 확인해야 합니다. ${LOCAL}`,
    situationCategory: "debt-collection",
    searchIntent: "판결 후 강제집행",
    conclusion:
      "판결 확정 후에는 집행 신청·재산조회를 서두르세요. 채무자 재산 변동·시효·배당 경쟁을 함께 봐야 합니다.",
    situationChecklist: [
      "승소 판결이 나왔는데 아직 돈을 못 받았다",
      "집행을 어떻게 신청하는지 모르겠다",
      "채무자가 재산이 없다고 한다",
      "다른 채권자도 있는 것 같다",
      "판결 후 시간이 꽤 지났다",
    ],
    firstChecks: [
      "판결·지급명령 확정·집행권원",
      "집행·시효·승계 기간",
      "채무자·제3채무자·보증인",
      "부동산·예금·급여·채권 압류 대상",
      "가압류·담보·배당 순위",
    ],
    solutions: solutions([
      {
        title: "부동산·예금 집행",
        body: "부동산 경매·예금 압류 등 대표적 집행 수단으로 회수합니다.",
        whenToChoose: "재산이 확인된 경우",
      },
      {
        title: "급여·채권 추심",
        body: "급여·매출채권·제3채무자에게 전부명령·추심명령을 합니다.",
        whenToChoose: "부동산·예금이 부족한 경우",
      },
      {
        title: "재산명시·추가 소송",
        body: "재산 은닉·보증·담보·채권자취소 등 추가 경로를 검토합니다.",
        whenToChoose: "집행 실익 없음·은닉·편파변제 의심",
      },
    ]),
    selfHandleCases: [
      "단일 부동산·예금 압류 등 단순 집행",
      "전자집행·소액",
    ],
    lawyerNeededCases: [
      "복수 채권자·배당·우선순위",
      "집행 이의·가압류·가처분",
      "법인·담보·보증·제3채무자",
      "재산은닉·명의신탁·채권자취소",
    ],
    costFactors: [
      "집행·경매·송달·등기 비용",
      "재산조회·명시·추심",
      "채권액·회수율",
      "분쟁·이의·추가 소송",
    ],
    commonMistakes: [
      "판결만 받고 집행 방치",
      "집행권원·시효 확인 안 함",
      "재산조회·압류 대상 선정 오류",
      "배당·우선순위 미확인",
    ],
    caseExample: {
      title: "판결 후 부동산 경매 배당",
      body: "대여금 소송 승소 후 1년간 집행하지 않다 상담했습니다. 재산조회로 채무자 부동산을 확인해 경매 집행·배당으로 일부 회수한 사례입니다.",
    },
    documents: [
      "판결정본·확정증명",
      "집행권원·집행문",
      "채무자·재산 조회 결과",
      "압류·경매·추심 신청서",
      "배당·회수 내역",
    ],
    procedures: [
      "판결 확정·집행권원",
      "재산조회",
      "압류·경매·추심 신청",
      "배당·회수",
      "부족분 추가 집행·채권자취소 등",
    ],
    diagnosisLinks: [
      { href: "/채권회수자가진단", label: "채권회수 자가진단" },
      { href: "/지급명령자가진단", label: "지급명령 자가진단" },
      { href: "/내용증명자가진단", label: "내용증명 자가진단" },
      { href: "/자가진단", label: "자가진단 허브" },
    ],
    serviceLinks: [
      { href: "/민사소송", label: "민사·채권 허브" },
      { href: "/공탁채권회수", label: "공탁·채권회수 허브" },
      { href: "/contact", label: "상담 문의" },
      { href: "/faq", label: "FAQ" },
    ],
    faqLinks: [
      { href: "/faq/how-to-book-consultation-faq", label: "상담 예약" },
      { href: "/faq/lawyer-fee-and-remote-faq", label: "수임료" },
      { href: "/faq/ownership-transfer-documents", label: "집행 서류" },
      { href: "/faq/jeonse-registration-faq", label: "배당 FAQ" },
    ],
    extraLinks: [
      { href: "/부산지방법원채권회수", label: "부산 채권회수" },
      { href: "/부산지방법원지급명령", label: "지급명령" },
      { href: "/blog/certified-mail-before-sending", label: "내용증명" },
      { href: "/contact", label: "상담 문의" },
    ],
    faqs: [
      {
        question: "판결 후 얼마 안에 집행해야 하나요?",
        answer:
          "집행권원에는 시효·집행 가능 기간이 있습니다. 확정 후 가능한 빨리 집행·재산조회를 검토하는 것이 좋습니다.",
      },
      {
        question: "집행 비용은 누가 내나요?",
        answer:
          "원칙적으로 채권자가 선납하고, 회수 시 채무자 부담으로 정산되는 구조입니다. 사건별로 확인이 필요합니다.",
      },
    ],
    relatedSituationSlugs: [
      "payment-order-certified-mail",
      "채무자-재산-모름",
      "대여금-못-받음",
      "공사대금-못-받음",
    ],
    priority: 83,
    isNew: true,
    addedAt: "2026-07-21",
  }),
];
