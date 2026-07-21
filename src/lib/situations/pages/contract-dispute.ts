import { defineSituationPage, solutions } from "../create-page";

const LOCAL =
  "부산 해운대구·센텀, 재송동·반여동 일대에서도 전화·카카오톡·방문(예약) 상담이 가능합니다.";

export const contractDisputePages = [
  defineSituationPage({
    slug: "계약금-반환-분쟁",
    cardTitle: "계약금 반환 분쟁",
    cardDescription: "매매·임대·위약",
    h1: "계약금만 받고 거래가 깨졌을 때 돌려줘야 하나요?",
    metaDescriptionBase:
      "계약금·위약금·손해배상, 계약 해제·반환 청구, 부동산·중고·용역 계약 분쟁을 정리했습니다. 부산 계약 분쟁 상담.",
    intro: `계약금은 '계약 체결의 증거'이지만, 누가 먼저 계약을 깼는지·위약금 조항·손해 범위에 따라 반환·몰수·추가 배상이 갈립니다. ${LOCAL}`,
    situationCategory: "contract-dispute",
    searchIntent: "계약금 반환 분쟁",
    conclusion:
      "계약금 분쟁은 계약서·특약·해제·귀책 당사자를 먼저 정리하세요. 구두 합의보다 서면·이행 기록이 중요합니다.",
    situationChecklist: [
      "계약금만 받고 상대가 거래를 파기했다",
      "내가 계약을 취소했는데 계약금을 돌려달라고 한다",
      "위약금·손해배상을 더 달라고 한다",
      "부동산·중고·용역 계약금 문제다",
      "계약서에 위약 조항이 있는지 모르겠다",
    ],
    firstChecks: [
      "계약서·특약·계약금·잔금·이행 기한",
      "해제·취소·귀책·불가항력 주장",
      "위약금·손해배상·계약금 몰수 조항",
      "이행·지연·서면·카톡·내용증명",
      "중개·에스크로·공탁 여부",
    ],
    solutions: solutions([
      {
        title: "협의·합의서",
        body: "계약금 반환·위약금·추가 비용을 합의서로 정리합니다.",
        whenToChoose: "양쪽이 분쟁 최소화·빠른 종결 원할 때",
      },
      {
        title: "내용증명·지급명령",
        body: "청구 금액·귀책이 비교적 분명하면 서면 독촉·지급명령을 검토합니다.",
        whenToChoose: "반환·배상액·증거가 정리된 경우",
      },
      {
        title: "손해배상 소송",
        body: "계약금·위약금을 넘는 손해·이중 매매 등 복잡한 경우 소송을 검토합니다.",
        whenToChoose: "손해 규모 큼·사실관계·귀책 다툼",
      },
    ]),
    selfHandleCases: [
      "계약서·위약 조항 명확·합의 가능",
      "소액·단순 반환",
    ],
    lawyerNeededCases: [
      "귀책·위약·손해액 다툼",
      "부동산·중개·이중계약",
      "계약서 없음·증거 부족",
      "가압류·본안 소송 필요",
    ],
    costFactors: [
      "분쟁 금액·소송·지급명령",
      "사실관계·증거 정리",
      "부동산·감정·중개",
      "합의·조정 vs 소송",
    ],
    commonMistakes: [
      "위약 조항 확인 없이 반환·몰수",
      "구두 해제만",
      "계약금·위약금·손배 개념 혼동",
      "증거·내용증명 없이 독촉",
    ],
    caseExample: {
      title: "아파트 매매 계약금 반환",
      body: "매수인 귀책으로 매매가 파기됐고, 매도인이 계약금 몰수·추가 위약을 주장했습니다. 계약 특약과 대출·잔금 일정을 대조해 반환·배상 범위를 협의한 사례입니다.",
    },
    documents: [
      "계약서·특약·영수증",
      "계약금·중도금 이체",
      "내용증명·카톡·녹취",
      "중개대장·공인중개",
      "해제·합의서 초안",
    ],
    procedures: [
      "계약·특약·귀책 분석",
      "증거·손해액 정리",
      "협의·내용증명",
      "지급명령·소송",
      "합의·집행·종결",
    ],
    diagnosisLinks: [
      { href: "/내용증명자가진단", label: "내용증명 자가진단" },
      { href: "/지급명령자가진단", label: "지급명령 자가진단" },
      { href: "/채권회수자가진단", label: "채권회수 자가진단" },
      { href: "/자가진단", label: "자가진단 허브" },
    ],
    serviceLinks: [
      { href: "/민사소송", label: "민사·채권 허브" },
      { href: "/services/ownership-transfer", label: "부동산 매매·등기" },
      { href: "/contact", label: "상담 문의" },
      { href: "/faq", label: "FAQ" },
    ],
    faqLinks: [
      { href: "/faq/how-to-book-consultation-faq", label: "상담 예약" },
      { href: "/faq/lawyer-fee-and-remote-faq", label: "수임료" },
      { href: "/faq/ownership-transfer-documents", label: "매매 계약 FAQ" },
      { href: "/faq/jeonse-registration-faq", label: "임대차 FAQ" },
    ],
    extraLinks: [
      { href: "/blog/certified-mail-before-sending", label: "내용증명" },
      { href: "/부산지방법원지급명령", label: "지급명령" },
      { href: "/situations/real-estate-sale-registration", label: "부동산 매매 등기" },
      { href: "/contact", label: "상담 문의" },
    ],
    faqs: [
      {
        question: "계약금은 무조건 돌려받나요?",
        answer:
          "귀책 당사자·위약 조항·손해액에 따라 반환·몰수·추가 배상이 달라집니다. 계약서와 이행 경위를 함께 봐야 합니다.",
      },
      {
        question: "위약금과 계약금은 같은가요?",
        answer:
          "다를 수 있습니다. 계약금은 예약금 성격, 위약금은 위반 시 손해 예정액 등으로 약정됩니다. 조항마다 확인이 필요합니다.",
      },
    ],
    relatedSituationSlugs: [
      "payment-order-certified-mail",
      "real-estate-sale-registration",
      "손해배상-청구",
      "중고거래-분쟁",
    ],
    priority: 85,
    isNew: true,
    addedAt: "2026-07-21",
  }),

  defineSituationPage({
    slug: "중고거래-분쟁",
    cardTitle: "중고거래·직거래 분쟁",
    cardDescription: "사기·하자·환불",
    h1: "중고거래에서 사기·하자·환불 문제가 생겼어요",
    metaDescriptionBase:
      "중고나라·당근·직거래 분쟁, 사기·하자·환불·손해배상, 내용증명·신고·소송을 정리했습니다.",
    intro: `중고거래는 당사자·물품·대금·배송·하자·사기 여부가 쟁점입니다. 플랫폼 신고·내용증명·형사·민사 경로를 사건에 맞게 선택해야 합니다. ${LOCAL}`,
    situationCategory: "contract-dispute",
    searchIntent: "중고거래 분쟁",
    conclusion:
      "중고거래 분쟁은 대화·이체·배송·물품 상태 기록이 핵심입니다. 빠르게 증거를 고정하고 경로를 선택하세요.",
    situationChecklist: [
      "돈만 받고 물건을 안 보냈다",
      "물건이 설명과 다르거나 고장났다",
      "환불·반품을 거부한다",
      "직거래에서 문제가 생겼다",
      "중고 플랫폼 신고만으로는 해결이 안 된다",
    ],
    firstChecks: [
      "거래 채팅·프로필·연락처·계좌",
      "이체·송장·배송·수령·개봉",
      "물품 하자·사기·허위 설명",
      "플랫폼 이용약관·분쟁 조정",
      "형사(사기) vs 민사(환불·손배)",
    ],
    solutions: solutions([
      {
        title: "플랫폼·협의",
        body: "중고 플랫폼 신고·분쟁 조정과 직접 환불·반품 협의를 시도합니다.",
        whenToChoose: "금액이 작고 연락·협의 가능",
      },
      {
        title: "내용증명·지급명령",
        body: "대금·사기·하자 사실·금액이 정리되면 서면 독촉·지급명령을 검토합니다.",
        whenToChoose: "증거·송달 주소 확보",
      },
      {
        title: "형사고발·민사소송",
        body: "명백한 사기·고액·상습은 형사·민사 병행을 검토합니다.",
        whenToChoose: "사기 정황·회수 난이도 큼",
      },
    ]),
    selfHandleCases: [
      "소액·플랫폼 조정·환불 합의",
      "증거·계좌·주소 명확",
    ],
    lawyerNeededCases: [
      "고액·사기·다수 피해",
      "상대 주소·신원 불명",
      "형사·민사·집행 병행",
      "하자·손해액·입증 다툼",
    ],
    costFactors: [
      "거래 금액·소송·고발",
      "증거·송달·집행",
      "플랫폼·조정 vs 소송",
      "다수 피해·집단",
    ],
    commonMistakes: [
      "채팅·이체 삭제",
      "계좌만 보고 신원 미확인",
      "사기인데 협의만 기다림",
      "하자·환불 기한·약관 미확인",
    ],
    caseExample: {
      title: "중고 IT 기기 사기·지급명령",
      body: "당근마켓에서 노트북 대금을 송금했으나 미발송·연락 두절이었습니다. 채팅·이체·프로필을 정리해 지급명령을 신청한 사례입니다.",
    },
    documents: [
      "거래 채팅·프로필 캡처",
      "이체·영수·송장",
      "물품 사진·하자·설명",
      "플랫폼 신고·조정 기록",
      "내용증명·지급명령",
    ],
    procedures: [
      "증거·거래 경위 정리",
      "플랫폼 신고·협의",
      "내용증명·독촉",
      "지급명령·소송·고발",
      "집행·회수",
    ],
    diagnosisLinks: [
      { href: "/내용증명자가진단", label: "내용증명 자가진단" },
      { href: "/지급명령자가진단", label: "지급명령 자가진단" },
      { href: "/채권회수자가진단", label: "채권회수 자가진단" },
      { href: "/자가진단", label: "자가진단 허브" },
    ],
    serviceLinks: [
      { href: "/민사소송", label: "민사·채권 허브" },
      { href: "/contact", label: "상담 문의" },
      { href: "/faq", label: "FAQ" },
      { href: "/자가진단", label: "자가진단" },
    ],
    faqLinks: [
      { href: "/faq/how-to-book-consultation-faq", label: "상담 예약" },
      { href: "/faq/lawyer-fee-and-remote-faq", label: "수임료" },
      { href: "/faq/ownership-transfer-documents", label: "계약 FAQ" },
      { href: "/faq/jeonse-registration-faq", label: "분쟁 FAQ" },
    ],
    extraLinks: [
      { href: "/blog/certified-mail-before-sending", label: "내용증명" },
      { href: "/부산지방법원지급명령", label: "지급명령" },
      { href: "/부산지방법원채권회수", label: "채권회수" },
      { href: "/contact", label: "상담 문의" },
    ],
    faqs: [
      {
        question: "경찰 신고만 하면 되나요?",
        answer:
          "사기 해당 시 형사 고발도 가능하지만, 환불·배상은 별도 민사 절차가 필요할 수 있습니다. 사건마다 다릅니다.",
      },
      {
        question: "직거래도 소송할 수 있나요?",
        answer:
          "가능합니다. 다만 상대 신원·주소·증거 확보가 중요합니다.",
      },
    ],
    relatedSituationSlugs: [
      "payment-order-certified-mail",
      "계약금-반환-분쟁",
      "내용증명-받았을-때",
      "손해배상-청구",
    ],
    priority: 81,
    isNew: true,
    addedAt: "2026-07-21",
  }),

  defineSituationPage({
    slug: "내용증명-받았을-때",
    cardTitle: "내용증명을 받았을 때",
    cardDescription: "기한·답변·대응",
    h1: "내용증명을 받았는데 어떻게 대응해야 하나요?",
    metaDescriptionBase:
      "내용증명 수령 후 대응, 답변·이의·합의·소송 준비, 시효·증거 정리를 안내합니다. 부산 계약·채권 상담.",
    intro: `내용증명은 상대방이 '법적 기록'을 남기기 시작했다는 신호입니다. 무시하면 불리한 합의·소송으로 이어질 수 있어, 내용·기한·증거를 먼저 정리해야 합니다. ${LOCAL}`,
    situationCategory: "contract-dispute",
    searchIntent: "내용증명 받았을 때 대응",
    conclusion:
      "내용증명 수령 후에는 내용 사실 여부·요구 기한·증거를 정리하고, 답변·합의·대응 소송 중 경로를 선택하세요.",
    situationChecklist: [
      "집·회사로 내용증명이 왔다",
      "돈·계약·손해배상을 요구한다",
      "기한 내 답변하라고 한다",
      "사실과 다른 내용이다",
      "무시해도 되는지 모르겠다",
    ],
    firstChecks: [
      "발송인·청구 원인·금액·기한",
      "사실관계·계약·이행·증거",
      "시효·이미 지급·상계·합의",
      "답변·반박·합의 필요성",
      "후속 소송·지급명령 가능성",
    ],
    solutions: solutions([
      {
        title: "사실관계 검토·답변",
        body: "내용증명 사실 여부를 확인하고, 필요 시 반박·합의 답변을 보냅니다.",
        whenToChoose: "오해·일부 인정·협의 여지",
      },
      {
        title: "합의·조정",
        body: "분쟁 금액·조건을 조정해 합의서로 마무리합니다.",
        whenToChoose: "양쪽이 빠른 종결 원함",
      },
      {
        title: "본안·반소 대비",
        body: "부당 청구·과다 요구면 증거를 모아 소송·반소·이의를 준비합니다.",
        whenToChoose: "청구 부당·고액·후속 소송 예상",
      },
    ]),
    selfHandleCases: [
      "소액·사실 인정·합의 가능",
      "단순 답변·일정 연장",
    ],
    lawyerNeededCases: [
      "고액·형사·민사 병행",
      "사실관계·증거 복잡",
      "부동산·계약·손배 연계",
      "기한 촉박·후속 소장 예고",
    ],
    costFactors: [
      "분쟁 금액·소송·합의",
      "증거·사실관계 정리",
      "답변·대리·조정",
      "긴급 대응",
    ],
    commonMistakes: [
      "수령만 하고 방치",
      "감정적 즉흥 답변",
      "증거·계약 확인 없이 인정",
      "기한·송달 불이익 간과",
    ],
    caseExample: {
      title: "전세 보증금 독촉 내용증명 대응",
      body: "임대인으로부터 보증금 반환 독촉 내용증명을 받은 임차인이 상담했습니다. 계약·하자·대항력·반환 조건을 검토하고 답변·협의 방향을 정한 사례입니다.",
    },
    documents: [
      "수령 내용증명·등본",
      "관련 계약·이체·대화",
      "답변·내용증명 초안",
      "합의서·영수",
      "소송·지급명령 서류",
    ],
    procedures: [
      "내용증명·기한·청구 분석",
      "증거·사실관계 정리",
      "답변·협의·조정",
      "합의 또는 소송·반소",
      "집행·종결",
    ],
    diagnosisLinks: [
      { href: "/내용증명자가진단", label: "내용증명 자가진단" },
      { href: "/지급명령자가진단", label: "지급명령 자가진단" },
      { href: "/채권회수자가진단", label: "채권회수 자가진단" },
      { href: "/자가진단", label: "자가진단 허브" },
    ],
    serviceLinks: [
      { href: "/민사소송", label: "민사·채권 허브" },
      { href: "/임대차전세", label: "임대차·전세" },
      { href: "/contact", label: "상담 문의" },
      { href: "/faq", label: "FAQ" },
    ],
    faqLinks: [
      { href: "/faq/how-to-book-consultation-faq", label: "상담 예약" },
      { href: "/faq/lawyer-fee-and-remote-faq", label: "수임료" },
      { href: "/faq/jeonse-registration-faq", label: "전세 FAQ" },
      { href: "/faq/ownership-transfer-documents", label: "계약 FAQ" },
    ],
    extraLinks: [
      { href: "/blog/certified-mail-before-sending", label: "내용증명 보내기 전" },
      { href: "/blog/jeonse-deposit-return-certified-mail", label: "전세 내용증명" },
      { href: "/부산지방법원지급명령", label: "지급명령" },
      { href: "/contact", label: "상담 문의" },
    ],
    faqs: [
      {
        question: "내용증명을 받으면 꼭 답장해야 하나요?",
        answer:
          "법적으로 모든 내용증명에 답변 의무가 있는 것은 아닙니다. 다만 무시하면 상대가 소송·지급명령으로 넘어갈 수 있어 내용 검토는 필요합니다.",
      },
      {
        question: "사실이 아닌데 어떻게 하나요?",
        answer:
          "반박·증거·합의·소송 대비 중 경로를 선택합니다. 감정적 답변보다 사실·증거 중심 대응이 중요합니다.",
      },
    ],
    relatedSituationSlugs: [
      "payment-order-certified-mail",
      "jeonse-deposit-unpaid",
      "계약금-반환-분쟁",
      "대여금-못-받음",
    ],
    priority: 88,
    isNew: true,
    addedAt: "2026-07-21",
  }),

  defineSituationPage({
    slug: "손해배상-청구",
    cardTitle: "손해배상 청구·피청구",
    cardDescription: "계약·불법행위·액수",
    h1: "손해배상을 청구(또는 당)하려면 무엇을 준비해야 하나요?",
    metaDescriptionBase:
      "손해배상 청구·방어, 계약 위반·불법행위, 손해액·인과관계·증거를 정리했습니다. 부산 민사 상담.",
    intro: `손해배상은 '위법·위반 행위 → 손해 → 인과관계 → 손해액'을 입증해야 합니다. 감정·치료비·휴업·정신적 손해 등 항목별로 정리가 필요합니다. ${LOCAL}`,
    situationCategory: "contract-dispute",
    searchIntent: "손해배상 청구",
    conclusion:
      "손해배상은 감정보다 손해 항목·액수·증거가 중요합니다. 청구·방어 모두 사실관계표부터 만드세요.",
    situationChecklist: [
      "계약·거래·사고로 손해를 봤다",
      "상대가 손해배상을 요구한다",
      "액수가 과다하다고 느낀다",
      "병원비·수리비·휴업손해 등을 받고 싶다",
      "소송·합의 중 무엇이 맞는지 모르겠다",
    ],
    firstChecks: [
      "계약 위반·불법행위·과실",
      "손해 항목(재산·신체·정신·휴업)",
      "인과관계·감정·영수·견적",
      "상계·과실상계·면책·특약",
      "소멸시효·관할·증거",
    ],
    solutions: solutions([
      {
        title: "합의·조정",
        body: "손해 항목·액수를 조정해 합의서로 종결합니다.",
        whenToChoose: "양쪽이 비용·시간 절약 원함",
      },
      {
        title: "내용증명·지급명령",
        body: "금액·손해가 비교적 명확한 재산상 손해에 적용합니다.",
        whenToChoose: "단순 미지급·수리비·대금",
      },
      {
        title: "손해배상 소송",
        body: "액수·과실·인과관계 다툼·신체·명예 등 복잡한 경우 본안 소송을 검토합니다.",
        whenToChoose: "고액·다툼·감정 필요",
      },
    ]),
    selfHandleCases: [
      "소액·영수·견적 명확·합의",
      "단순 재산 손해",
    ],
    lawyerNeededCases: [
      "고액·신체·명예·과실 다툼",
      "감정·휴업·일실수입",
      "계약·불법행위·상계 복합",
      "피청구·반소·집행",
    ],
    costFactors: [
      "청구·분쟁 금액",
      "감정·소송·증인",
      "합의 vs 본안",
      "집행·가압류",
    ],
    commonMistakes: [
      "손해액 근거 없이 감으로 청구",
      "증거·영수·견적 미보관",
      "과실·면책 조항 무시",
      "시효·합의·면소 혼동",
    ],
    caseExample: {
      title: "공사 하자 손해배상 협의",
      body: "인테리어 하자로 추가 수리비·휴업 손해를 주장하는 분쟁이었습니다. 하자 범위·견적·과실을 정리해 손해액을 조정·합의한 사례입니다.",
    },
    documents: [
      "계약·약정·특약",
      "손해 영수·견적·감정",
      "사진·일지·카톡·내용증명",
      "합의서·지급명령·소장",
      "과실·상계 관련",
    ],
    procedures: [
      "사실·손해·과실 정리",
      "증거·액수 산정",
      "협의·내용증명",
      "조정·소송",
      "집행·합의 이행",
    ],
    diagnosisLinks: [
      { href: "/내용증명자가진단", label: "내용증명 자가진단" },
      { href: "/지급명령자가진단", label: "지급명령 자가진단" },
      { href: "/채권회수자가진단", label: "채권회수 자가진단" },
      { href: "/자가진단", label: "자가진단 허브" },
    ],
    serviceLinks: [
      { href: "/민사소송", label: "민사·채권 허브" },
      { href: "/contact", label: "상담 문의" },
      { href: "/faq", label: "FAQ" },
      { href: "/자가진단", label: "자가진단" },
    ],
    faqLinks: [
      { href: "/faq/how-to-book-consultation-faq", label: "상담 예약" },
      { href: "/faq/lawyer-fee-and-remote-faq", label: "수임료" },
      { href: "/faq/ownership-transfer-documents", label: "계약 FAQ" },
      { href: "/faq/jeonse-registration-faq", label: "분쟁 FAQ" },
    ],
    extraLinks: [
      { href: "/blog/certified-mail-before-sending", label: "내용증명" },
      { href: "/부산지방법원지급명령", label: "지급명령" },
      { href: "/부산지방법원채권회수", label: "채권회수" },
      { href: "/contact", label: "상담 문의" },
    ],
    faqs: [
      {
        question: "정신적 손해도 받을 수 있나요?",
        answer:
          "사건·법리·입증에 따라 가능합니다. 신체·명예·생활 침해 등 유형별 요건이 달라 상담이 필요합니다.",
      },
      {
        question: "상대도 잘못했으면 줄어드나요?",
        answer:
          "과실상계 등으로 손해액이 조정될 수 있습니다. 양쪽 과실·인과관계를 함께 봅니다.",
      },
    ],
    relatedSituationSlugs: [
      "payment-order-certified-mail",
      "계약금-반환-분쟁",
      "중고거래-분쟁",
      "내용증명-받았을-때",
    ],
    priority: 82,
    isNew: true,
    addedAt: "2026-07-21",
  }),
];
