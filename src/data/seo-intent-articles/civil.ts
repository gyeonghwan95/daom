import type { SeoIntentArticle } from "./types";

const BUSAN_TAGS = ["부산 법무사", "해운대 법무사", "센텀 법무사"];

export const civilSeoIntentArticles: SeoIntentArticle[] = [
  {
    title: "지급명령 신청 전 확인사항",
    slug: "payment-order-application-pre-check",
    description:
      "채권 회수를 위해 지급명령을 검토할 때 관할·청구금액·증빙·이의 가능성 등 신청 전에 확인할 사항을 정리합니다.",
    category: "민사·채권",
    tags: ["지급명령", "채권회수", ...BUSAN_TAGS],
    searchIntent: "preparation-documents",
    date: "2026-01-20",
    area: "부산",
    seoTitle: "지급명령 신청 전 확인｜부산 법무사",
    seoDescription:
      "지급명령 관할·서류·비용·이의. 부산지방법원 채권 회수 상담. 해운대·센텀.",
    relatedServices: ["personal-rehabilitation"],
    relatedFaqs: ["how-to-book-consultation-faq"],
    relatedDiagnosis: ["지급명령자가진단"],
    relatedSituations: ["payment-order-certified-mail"],
    relatedGlossary: ["payment-order"],
    sections: {
      problem: [
        "대여금·매매대금 등을 받지 못해 지급명령을 알아보지만, 소송과 뭐가 다른지·이의당하면 어떻게 되는지 막연한 경우가 많습니다.",
      ],
      summary: [
        "지급명령은 비교적 간이한 독촉 절차입니다.",
        "청구금액·원인·증빙이 명확해야 합니다.",
        "채무자가 이의하면 본안 소송으로 이어질 수 있습니다.",
        "관할은 보통 채무자 주소지 법원입니다.",
      ],
      procedure: [
        "채권 원인·잔액·증빙 정리",
        "지급명령 신청서·소명자료 작성",
        "관할 법원에 신청·송달",
        "이의 없으면 확정·강제집행 검토",
      ],
      documents: [
        "차용증·계약서·거래 내역",
        "이자·변제 내역 계산서",
        "채무자 주소·인적사항",
        "지급명령 신청서",
      ],
      caution: [
        "증빙이 약하면 기각·이의 가능성이 큽니다.",
        "이자·지연손해금 계산을 정확히 해야 합니다.",
        "시효가 임박하면 빠르게 검토하세요.",
      ],
      faq: [
        {
          question: "부산지방법원에 신청하나요?",
          answer: "채무자 주소지 관할 법원에 신청합니다. 부산 채무자면 부산 관할일 수 있습니다.",
        },
        {
          question: "변호사 없이 가능한가요?",
          answer: "가능하지만 서식·청구 취지 작성이 중요해 상담을 권합니다.",
        },
      ],
    },
    cta: {
      title: "지급명령·소송 방향을 비교해 드립니다",
      description: "부산·해운대에서 채권 규모·증빙에 맞는 절차를 안내합니다.",
    },
  },
  {
    title: "내용증명 보내기 전 주의사항",
    slug: "certified-mail-before-sending",
    description:
      "분쟁·채권·임대차 등 내용증명을 보내기 전에 문구·시기·효과·부작용을 점검할 항목을 정리합니다.",
    category: "민사·채권",
    tags: ["내용증명", "채권", ...BUSAN_TAGS],
    searchIntent: "preparation-documents",
    date: "2026-01-27",
    area: "부산",
    seoTitle: "내용증명 보내기 전 주의｜부산 법무사",
    seoDescription:
      "내용증명 문구·시기·효력. 전세·대여금 분쟁. 해운대·센텀 상담.",
    relatedServices: ["personal-rehabilitation"],
    relatedFaqs: ["how-to-book-consultation-faq"],
    relatedDiagnosis: ["내용증명자가진단"],
    relatedSituations: ["payment-order-certified-mail", "jeonse-deposit-unpaid"],
    relatedGlossary: ["certified-mail"],
    sections: {
      problem: [
        "감정적으로 내용증명을 쓰거나, 너무 일찍·늦게 보내 오히려 협상이 깨지는 경우가 있습니다.",
      ],
      summary: [
        "내용증명은 의사 표시를 공식적으로 남기는 수단입니다.",
        "문구는 사실에 근거하고 요구·기한을 명확히 쓰는 것이 좋습니다.",
        "상대 성격·관계에 따라 효과가 달라집니다.",
        "이후 소송·지급명령의 전 단계로 쓰이기도 합니다.",
      ],
      procedure: [
        "사실관계·요구 사항 정리",
        "초안 작성·검토",
        "우체국·전자 내용증명 발송",
        "송달·보관",
      ],
      documents: [
        "계약서·대화·거래 증빙",
        "내용증명 초안",
        "발송·수령 증명",
      ],
      caution: [
        "허위·과장·모욕적 표현은 불리할 수 있습니다.",
        "내용증명만으로 돈이 바로 돌아오지는 않습니다.",
        "전세·임대차는 특약·확정일자와 함께 봐야 합니다.",
      ],
      faq: [
        {
          question: "내용증명을 받으면 어떻게 하나요?",
          answer: "무시하지 말고 내용을 검토하고 상담하는 것이 좋습니다.",
        },
        {
          question: "전자 내용증명도 되나요?",
          answer: "가능합니다. 보관·송달 증명 방식이 다릅니다.",
        },
      ],
    },
    cta: {
      title: "내용증명 초안 검토가 필요하면",
      description: "부산·해운대에서 보내기 전 문구·시기를 점검해 드립니다.",
    },
  },
  {
    title: "전세보증금 반환 내용증명",
    slug: "jeonse-deposit-return-certified-mail",
    description:
      "전세 만기 후 보증금을 돌려받지 못할 때 내용증명·임차권등기명령 등 다음 단계를 정리합니다.",
    category: "민사·채권",
    tags: ["전세보증금", "내용증명", "임차권", ...BUSAN_TAGS],
    searchIntent: "procedure",
    date: "2026-02-03",
    area: "부산",
    seoTitle: "전세보증금 반환 내용증명｜부산 법무사",
    seoDescription:
      "전세 만기 보증금 미반환 내용증명·임차권등기명령. 해운대·수영구 전세 상담.",
    relatedServices: ["real-estate-registration"],
    relatedFaqs: ["jeonse-registration-faq"],
    relatedDiagnosis: ["전세보증금자가진단", "임차권등기명령자가진단"],
    relatedSituations: ["jeonse-deposit-unpaid"],
    relatedGlossary: ["jeonse-right", "lease-registration-order"],
    relatedTools: ["jeonse-deposit-timeline"],
    sections: {
      problem: [
        "전세 만기가 지났는데 집주인이 보증금 반환을 미루거나, 새 세입자 때문에 돈이 없다고 하는 경우가 많습니다.",
      ],
      summary: [
        "반환 기일·계약 내용을 명시한 내용증명이 첫 단계 중 하나입니다.",
        "등기부·선순위 채권·전세권 설정 여부를 함께 봐야 합니다.",
        "협의가 안 되면 임차권등기명령·소송을 검토합니다.",
        "확정일자·전입신고·계약서가 중요합니다.",
      ],
      procedure: [
        "전세계약·만기·반환 조건 확인",
        "등기부·전세권·근저당 조회",
        "반환 촉구 내용증명 발송",
        "임차권등기명령·소송 검토",
      ],
      documents: [
        "전세계약서·확정일자",
        "주민등록·전입신고 증빙",
        "내용증명 초안",
        "등기부등본",
      ],
      caution: [
        "집주인에게만 말로 독촉하는 것만으로는 부족할 수 있습니다.",
        "보증금이 크면 빠르게 권리 관계를 확인하세요.",
      ],
      faq: [
        {
          question: "내용증명 후 바로 소송하나요?",
          answer: "상황에 따라 협의 기간을 두거나 임차권등기명령을 먼저 검토합니다.",
        },
        {
          question: "부산 전세도 같은 절차인가요?",
          answer: "제도는 같고 관할은 부동산·법원 소재지 기준입니다.",
        },
      ],
    },
    cta: {
      title: "전세보증금, 다음 단계부터 정리하세요",
      description: "해운대·부산 전역 전세 분쟁 상담.",
    },
  },
  {
    title: "대여금 반환청구 준비서류",
    slug: "loan-repayment-claim-documents",
    description:
      "지인·가족·사업 관련 대여금을 돌려받기 위해 소송·지급명령 전에 준비할 서류와 증빙을 정리합니다.",
    category: "민사·채권",
    tags: ["대여금", "반환청구", ...BUSAN_TAGS],
    searchIntent: "documents",
    date: "2026-02-10",
    area: "부산",
    seoTitle: "대여금 반환청구 준비서류｜부산 법무사",
    seoDescription:
      "대여금 소송·지급명령 증빙, 차용증·이체 내역. 부산 채권 회수 상담.",
    relatedServices: ["personal-rehabilitation"],
    relatedFaqs: ["how-to-book-consultation-faq"],
    relatedDiagnosis: ["지급명령자가진단"],
    relatedGlossary: ["payment-order", "certified-mail"],
    sections: {
      problem: [
        "돈을 빌려줬는데 차용증이 없거나, 이체 내역만 있어 반환 청구가 가능한지 불안한 경우가 많습니다.",
      ],
      summary: [
        "차용증·계약서가 있으면 유리하지만, 이체·메시지 등으로도 입증이 가능한 경우가 있습니다.",
        "원금·이자·변제·시효를 정리해야 합니다.",
        "지급명령·소송·내용증명 중 경로를 선택합니다.",
        "가족·지인 사이일수록 사실관계 정리가 중요합니다.",
      ],
      procedure: [
        "대여 경위·금액·변제 이력 정리",
        "증빙 수집(이체·카톡·녹취 등)",
        "청구금액·이자 계산",
        "내용증명·지급명령·소송 검토",
      ],
      documents: [
        "차용증·각서(있는 경우)",
        "계좌 이체·거래 내역",
        "변제·독촉 대화 기록",
        "채무자 인적사항",
      ],
      caution: [
        "시효가 지나면 권리가 제한될 수 있습니다.",
        "이자 약정이 없으면 법정이율 등이 적용됩니다.",
      ],
      faq: [
        {
          question: "차용증 없이도 소송 가능한가요?",
          answer: "다른 증거로 입증할 수 있으면 가능합니다. 난이도는 사안별로 다릅니다.",
        },
        {
          question: "부산 법원에 제출하나요?",
          answer: "채무자 주소지 관할 법원이 원칙입니다.",
        },
      ],
    },
    cta: {
      title: "대여금 증빙부터 함께 봅니다",
      description: "부산·해운대에서 회수 가능 여부를 검토해 드립니다.",
    },
  },
  {
    title: "소장 작성 전 필요한 자료",
    slug: "complaint-filing-required-materials",
    description:
      "민사 소송 소장을 제출하기 전에 사실관계·증빙·청구취지를 정리할 때 필요한 자료를 안내합니다.",
    category: "민사·채권",
    tags: ["소장", "민사소송", ...BUSAN_TAGS],
    searchIntent: "documents",
    date: "2026-02-17",
    area: "부산",
    seoTitle: "소장 작성 전 필요 자료｜부산 법무사",
    seoDescription:
      "민사 소송 소장 준비, 청구취지·증거. 부산지방법원 소송 상담.",
    relatedServices: ["personal-rehabilitation"],
    relatedFaqs: ["how-to-book-consultation-faq"],
    relatedDiagnosis: ["지급명령자가진단"],
    relatedGlossary: ["complaint", "answer-brief"],
    sections: {
      problem: [
        "소송을 고려하지만 어떤 자료를 모아야 하고, 청구금액을 어떻게 써야 하는지 막막한 경우가 많습니다.",
      ],
      summary: [
        "소장에는 당사자·청구취지·원인·증거 목록이 필요합니다.",
        "계약·이체·손해 발생 경위를 시간순으로 정리하는 것이 좋습니다.",
        "지급명령·조정·소송 중 어떤 경로가 맞는지 먼저 비교합니다.",
        "인지대·송달비 등 비용도 함께 봐야 합니다.",
      ],
      procedure: [
        "분쟁 유형·상대방 확인",
        "사실관계·손해·청구액 정리",
        "증거자료 목록화",
        "소장 초안·관할 검토",
        "제출·송달",
      ],
      documents: [
        "계약서·영수증·이체 내역",
        "내용증명·협의 기록",
        "사진·검사·감정 자료(해당 시)",
        "상대방 인적사항·주소",
      ],
      caution: [
        "감정적 표현보다 사실·날짜·금액 중심으로 정리하세요.",
        "잘못된 청구취지는 수정·기각 사유가 될 수 있습니다.",
      ],
      faq: [
        {
          question: "지급명령과 소송 중 뭐가 빠른가요?",
          answer: "증빙·상대 협조에 따라 다릅니다. 사안별 비교 상담이 필요합니다.",
        },
        {
          question: "부산에서 소송하면 어디 법원인가요?",
          answer: "사건 유형·당사자 주소에 따라 관할이 정해집니다.",
        },
      ],
    },
    cta: {
      title: "소송 전 자료 정리부터 도와드립니다",
      description: "부산·해운대에서 소장·지급명령 방향을 비교해 드립니다.",
    },
  },
];
