import type { SeoIntentArticle } from "./types";

const BUSAN_TAGS = ["부산 법무사", "해운대 법무사", "센텀 법무사"];

export const realEstateSeoIntentArticles: SeoIntentArticle[] = [
  {
    title: "잔금 후 소유권이전등기가 지연될 때",
    slug: "delayed-ownership-transfer-after-balance",
    description:
      "부동산 매매 잔금 후 소유권이전등기가 늦어질 때 확인할 점, 매도인·매수인 각각의 리스크와 대응 순서를 정리합니다.",
    category: "부동산등기",
    tags: ["소유권이전등기", "잔금", "매매", ...BUSAN_TAGS],
    searchIntent: "procedure",
    date: "2026-01-14",
    area: "부산",
    seoTitle: "잔금 후 소유권이전등기 지연 대응｜부산 법무사",
    seoDescription:
      "매매 잔금 후 등기 지연 시 확인 사항, 취득세·대출·점유 리스크. 해운대·센텀 부동산등기 상담.",
    relatedServices: ["ownership-transfer", "real-estate-registration"],
    relatedFaqs: ["ownership-transfer-documents"],
    relatedDiagnosis: ["소유권이전등기자가진단", "부동산등기자가진단"],
    relatedSituations: ["real-estate-sale-registration"],
    relatedGlossary: ["ownership-transfer-registration", "acquisition-tax"],
    sections: {
      problem: [
        "잔금은 지급했는데 매도인이 등기서류를 늦게 주거나, 근저당 말소가 안 되어 소유권이전등기가 밀리는 경우가 있습니다. 대출 실행·입주·취득세 납부 일정이 겹치면 불안이 커집니다.",
      ],
      summary: [
        "잔금일과 등기 접수일 사이에 취득세 신고·납부 기한이 따로 있습니다.",
        "등기 전까지 법률상 소유권은 매도인에게 남아 있을 수 있습니다.",
        "근저당·가압류가 있으면 말소·해제 후 이전등기가 가능합니다.",
        "매매계약서의 등기 이행 조항·손해배상 약정을 확인해야 합니다.",
      ],
      procedure: [
        "매매계약서·잔금 영수증·인도 확인",
        "등기부등본으로 권리관계 재확인",
        "매도인에게 필요 서류·말소 일정 요청",
        "취득세 신고·납부",
        "소유권이전등기 접수·완료 확인",
      ],
      documents: [
        "매매계약서·잔금 영수증",
        "매도인·매수인 인감증명서·신분증",
        "등기권리증·토지·건물 대장",
        "취득세 납부서류",
        "근저당 말소 서류(해당 시)",
      ],
      caution: [
        "장기 지연 시 매도인 재산 상태가 바뀔 수 있습니다.",
        "중도금·잔금 구조에 따라 리스크가 달라집니다.",
        "내용증명 등으로 이행 촉구를 남겨 두는 것이 도움이 될 수 있습니다.",
      ],
      faq: [
        {
          question: "잔금 후 얼마 안에 등기해야 하나요?",
          answer:
            "계약서에 정한 기한이 우선입니다. 취득세 신고 기한도 별도로 있어 일정을 함께 봐야 합니다.",
        },
        {
          question: "부산 아파트도 같은 절차인가요?",
          answer:
            "기본 절차는 같고, 관할 등기소·취득세 신고처는 부동산 소재지 기준입니다.",
        },
      ],
    },
    cta: {
      title: "등기 일정이 밀리면 먼저 상담하세요",
      description:
        "해운대·센텀에서 매도인 협조·말소·이전등기 순서를 정리해 드립니다.",
    },
  },
  {
    title: "매도인이 등기서류를 안 줄 때",
    slug: "when-seller-withholds-registration-documents",
    description:
      "부동산 매매 후 매도인이 인감·등기서류 제출을 거부하거나 지연할 때 법적·실무적 대응 방향을 안내합니다.",
    category: "부동산등기",
    tags: ["매도인", "등기서류", "소유권이전", ...BUSAN_TAGS],
    searchIntent: "case",
    date: "2026-01-21",
    area: "부산",
    seoTitle: "매도인 등기서류 거부 대응｜부산 법무사",
    seoDescription:
      "매도인이 소유권이전등기 서류를 안 줄 때 계약 이행·내용증명·소송 검토. 부산 부동산등기 상담.",
    relatedServices: ["ownership-transfer"],
    relatedFaqs: ["ownership-transfer-documents"],
    relatedDiagnosis: ["소유권이전등기자가진단"],
    relatedSituations: ["real-estate-sale-registration"],
    sections: {
      problem: [
        "잔금까지 지급했는데 매도인이 갑자기 연락이 안 되거나, 인감증명서·서명을 거부해 등기가 막히는 사례가 있습니다.",
      ],
      summary: [
        "매매계약상 소유권이전등기 이행 의무가 있는지 확인합니다.",
        "협의·내용증명·조정·소송 등 단계적 대응이 가능합니다.",
        "등기부상 다른 권리(가압류·근저당)가 원인일 수도 있습니다.",
        "계약서·잔금 증빙을 잘 보관해야 합니다.",
      ],
      procedure: [
        "매매계약서 이행 조항 확인",
        "매도인에게 서류 제출 요청(문자·내용증명)",
        "등기부 재조회로 권리 변동 확인",
        "필요 시 법률 상담·소송 검토",
        "이행 판결·강제집행 또는 합의 후 등기",
      ],
      documents: [
        "매매계약서·잔금 영수증",
        "등기부등본(최신)",
        "내용증명·협의 기록",
        "중개사 확인서(있는 경우)",
      ],
      caution: [
        "폭력적 점유·임의 처분은 오히려 불리할 수 있습니다.",
        "매도인 개인 채무로 가압류가 걸렸을 수 있습니다.",
        "기한이 급하면 전문가와 빠르게 대응 방향을 정하세요.",
      ],
      faq: [
        {
          question: "중개사가 책임지나요?",
          answer:
            "중개 계약·설명 의무 범위에 따라 다릅니다. 매도인 이행 문제는 별도로 대응해야 합니다.",
        },
        {
          question: "이미 입주한 경우는요?",
          answer:
            "점유와 소유권은 별개입니다. 등기 완료 전 리스크를 인지하고 대응해야 합니다.",
        },
      ],
    },
    cta: {
      title: "매도인 불응 사안은 빠른 정리가 중요합니다",
      description: "부산·해운대에서 계약서 기준으로 다음 단계를 안내해 드립니다.",
    },
  },
  {
    title: "근저당 말소를 안 하면 생기는 문제",
    slug: "mortgage-cancellation-risks",
    description:
      "부동산 매매·상속·증여 시 근저당권 말소를 하지 않으면 생기는 문제와 말소 절차를 정리합니다.",
    category: "부동산등기",
    tags: ["근저당 말소", "부동산등기", ...BUSAN_TAGS],
    searchIntent: "procedure",
    date: "2026-01-28",
    area: "부산",
    seoTitle: "근저당 말소 안 할 때 문제｜부산 법무사",
    seoDescription:
      "근저당 말소 필요성, 채권자 협조, 상속·매매 시 리스크. 해운대 부동산등기 상담.",
    relatedServices: ["real-estate-registration", "ownership-transfer"],
    relatedFaqs: ["inheritance-registration-with-mortgage"],
    relatedDiagnosis: ["부동산등기자가진단"],
    relatedGlossary: ["mortgage"],
    sections: {
      problem: [
        "집을 사거나 상속받았는데 등기부에 근저당이 그대로 남아 있거나, 말소 비용을 누가 낼지 두고 다투는 경우가 많습니다.",
      ],
      summary: [
        "근저당이 남아 있으면 깨끗한 소유권 이전·대출 실행이 어렵습니다.",
        "말소는 보통 채무 변제와 함께 이뤄집니다.",
        "상속 시 피상속인 채무와 함께 검토해야 합니다.",
        "말소 등기를 하지 않으면 나중에 경매·추심 리스크가 남습니다.",
      ],
      procedure: [
        "등기부등본으로 근저당 내역 확인",
        "채권자(은행 등)에 대출 잔액·말소 절차 문의",
        "변제 또는 말소 동의 서류 수령",
        "근저당권 말소 등기 신청",
        "이후 소유권이전·상속등기 진행",
      ],
      documents: [
        "등기부등본",
        "대출 잔액 증명·말소 동의서",
        "채권자 인감·위임 서류(금융사 양식)",
        "말소 등기 신청서",
      ],
      caution: [
        "말소 비용 부담은 계약·협의로 정합니다.",
        "가등기·전세권과 함께 있으면 순서가 중요합니다.",
        "상속 한정승인 검토 시 근저당 채무액이 핵심입니다.",
      ],
      faq: [
        {
          question: "상속등기 전에 근저당을 말소해야 하나요?",
          answer:
            "승계·변제·말소 중 어떤 방식이 맞는지 채무 규모에 따라 다릅니다.",
        },
        {
          question: "말소 등기 비용은 얼마나 드나요?",
          answer:
            "등기 수수료·대리 비용이 있습니다. 채무 변제액과는 별개입니다.",
        },
      ],
    },
    cta: {
      title: "근저당·말소 일정을 함께 짜 드립니다",
      description: "부산·센텀에서 등기부 기준으로 말소·이전 순서를 안내합니다.",
    },
  },
  {
    title: "전세권 설정이 필요한 경우",
    slug: "when-jeonse-right-registration-needed",
    description:
      "전세 계약 후 전세권 설정등기가 필요한 상황, 임차권등기명령과의 차이, 부산 임차인이 확인할 점을 정리합니다.",
    category: "부동산등기",
    tags: ["전세권", "전세", "임차인", ...BUSAN_TAGS],
    searchIntent: "faq",
    date: "2026-02-05",
    area: "부산",
    seoTitle: "전세권 설정이 필요한 경우｜부산 법무사",
    seoDescription:
      "전세권 설정등기 필요 시점, 보증금 보호, 임차권등기명령 비교. 해운대·수영구 전세 상담.",
    relatedServices: ["real-estate-registration"],
    relatedFaqs: ["jeonse-registration-faq"],
    relatedDiagnosis: ["전세보증금자가진단", "임차권등기명령자가진단"],
    relatedSituations: ["jeonse-deposit-unpaid"],
    relatedGlossary: ["jeonse-right", "lease-registration-order"],
    sections: {
      problem: [
        "전세 보증금이 큰데 집주인이 다른 채무로 건물이 경매될까 걱정되거나, 전세권 설정을 권유받고 필요한지 모르겠다는 문의가 많습니다.",
      ],
      summary: [
        "전세권 설정등기는 보증금 회수 우선순위를 높이는 방법 중 하나입니다.",
        "모든 전세에 필수는 아니며, 보증금 규모·집주인 신용·선순위 채권을 봅니다.",
        "이미 선순위 근저당이 크면 설정 한계가 있을 수 있습니다.",
        "임차권등기명령은 다른 제도로, 상황에 따라 병행·대안이 됩니다.",
      ],
      procedure: [
        "등기부·선순위 채권·보증금 규모 확인",
        "집주인과 전세권 설정 합의",
        "전세계약서·확정일자·전입신고 확인",
        "전세권 설정등기 신청",
        "만기·해지 시 말소 등기",
      ],
      documents: [
        "전세계약서",
        "전세권 설정 신청서·집주인 인감",
        "등기부등본",
        "주민등록·확정일자 관련 서류",
      ],
      caution: [
        "설정 비용은 보통 임차인이 부담하는 경우가 많습니다.",
        "집주인이 설정에 협조하지 않으면 다른 보호 수단을 검토해야 합니다.",
        "보증보험 가입과 등기는 별개입니다.",
      ],
      faq: [
        {
          question: "전세권 설정과 확정일자만으로 충분한가요?",
          answer:
            "둘 다 중요하지만 역할이 다릅니다. 보증금 규모가 크면 설정을 검토하는 경우가 많습니다.",
        },
        {
          question: "부산 전세 사고도 같은가요?",
          answer:
            "제도는 전국 공통이나, 관할 법원·등기소는 부동산 소재지 기준입니다.",
        },
      ],
    },
    cta: {
      title: "전세 보증금 보호 방법을 비교해 드립니다",
      description: "해운대·부산 전역 임차 사안에서 전세권·임차권등기명령 방향을 안내합니다.",
    },
  },
  {
    title: "전세권 말소 절차",
    slug: "jeonse-right-cancellation-procedure",
    description:
      "전세 계약 종료 후 전세권 말소등기 절차, 집주인 협조가 없을 때 확인할 점을 정리합니다.",
    category: "부동산등기",
    tags: ["전세권 말소", "전세 만료", ...BUSAN_TAGS],
    searchIntent: "procedure",
    date: "2026-02-12",
    area: "부산",
    seoTitle: "전세권 말소 절차｜부산 법무사",
    seoDescription:
      "전세권 말소등기 서류, 집주인 협조, 보증금 반환 후 처리. 해운대 임차 상담.",
    relatedServices: ["real-estate-registration"],
    relatedFaqs: ["jeonse-registration-faq"],
    relatedDiagnosis: ["전세보증금자가진단"],
    relatedGlossary: ["jeonse-right"],
    relatedTools: ["jeonse-deposit-timeline"],
    sections: {
      problem: [
        "전세 만기 후 보증금은 돌려받았는데 등기부에 전세권이 남아 있거나, 집주인이 말소에 협조하지 않는 경우가 있습니다.",
      ],
      summary: [
        "전세권 말소는 통상 임대인·임차인 합의 후 등기합니다.",
        "보증금 완전 반환·계약 해지를 확인한 뒤 진행합니다.",
        "말소를 안 하면 이후 매매·대출에 지장이 생길 수 있습니다.",
        "협조가 없으면 내용증명·협의·소송을 검토합니다.",
      ],
      procedure: [
        "전세계약 해지·보증금 반환 확인",
        "말소 등기 서류 요청",
        "전세권 말소 등기 신청",
        "등기부상 말소 완료 확인",
      ],
      documents: [
        "전세계약서·해지 합의서",
        "보증금 반환 영수증",
        "말소 등기 위임·인감 서류",
        "등기권리증(있는 경우)",
      ],
      caution: [
        "보증금이 일부만 반환된 상태에서는 말소 합의가 어려울 수 있습니다.",
        "집주인 변경 시 새 소유자와도 확인이 필요합니다.",
      ],
      faq: [
        {
          question: "말소 비용은 누가 내나요?",
          answer: "계약서·합의에 따릅니다. 관행적으로 임차인이 부담하는 경우가 많습니다.",
        },
        {
          question: "집주인이 안 나오면요?",
          answer: "내용증명·소송 등 법적 절차를 검토해야 합니다.",
        },
      ],
    },
    cta: {
      title: "전세권 말소·보증금 문제 함께 봅니다",
      description: "부산·해운대에서 임차 종료 후 등기 정리를 도와드립니다.",
    },
  },
  {
    title: "증여등기 전에 확인할 사항",
    slug: "gift-registration-pre-check",
    description:
      "부동산·현금 증여 전 증여세, 취득세, 증여계약서, 등기 절차에서 미리 확인할 항목을 정리합니다.",
    category: "부동산등기",
    tags: ["증여등기", "증여세", ...BUSAN_TAGS],
    searchIntent: "preparation-documents",
    date: "2026-02-19",
    area: "부산",
    seoTitle: "증여등기 전 확인사항｜부산 법무사",
    seoDescription:
      "증여 부동산 등기 전 세금·서류·가족 관계 확인. 해운대·센텀 증여등기 상담.",
    relatedServices: ["real-estate-registration", "ownership-transfer"],
    relatedFaqs: ["gift-registration-faq"],
    relatedDiagnosis: ["부동산등기자가진단"],
    relatedGlossary: ["acquisition-tax", "registration-license-tax"],
    sections: {
      problem: [
        "자녀에게 집을 증여하려다 증여세·취득세·등기 비용이 예상보다 커지거나, 증여 후 처분 제한을 몰랐다는 상담이 있습니다.",
      ],
      summary: [
        "증여는 계약·세금 신고·등기가 함께 진행됩니다.",
        "증여세는 관계·재산가액·공제에 따라 달라집니다.",
        "취득세·등록면허세도 납부 대상입니다.",
        "증여 후 양도 시 취득가액 산정에 영향을 줄 수 있습니다.",
      ],
      procedure: [
        "증여 대상·수증자·가액 결정",
        "증여계약서 작성",
        "증여세·취득세 신고·납부",
        "소유권이전(증여) 등기 신청",
      ],
      documents: [
        "증여계약서",
        "가족관계증명서",
        "등기부등본·감정평가서(필요 시)",
        "세금 납부 증명",
      ],
      caution: [
        "명의신탁으로 오인받지 않도록 실제 증여 의사를 문서화해야 합니다.",
        "공동명의·지분 증여는 별도 검토가 필요합니다.",
        "사전 증여 계획은 세무 전문가와 병행하는 것이 좋습니다.",
      ],
      faq: [
        {
          question: "상속보다 증여가 유리한가요?",
          answer: "가족 구성·재산가액·시점에 따라 다릅니다. 개별 비교 상담이 필요합니다.",
        },
        {
          question: "부산 부동산도 같은 세율인가요?",
          answer: "증여세는 국세, 취득세는 지방세로 각각 신고합니다.",
        },
      ],
    },
    cta: {
      title: "증여 전 등기·세금 방향을 짚어 드립니다",
      description: "해운대·센텀에서 증여등기 절차와 준비 서류를 안내합니다.",
    },
  },
  {
    title: "신축아파트 소유권이전등기",
    slug: "new-apartment-ownership-transfer",
    description:
      "신축 아파트 분양·준공 후 소유권이전등기, 선순위 근저당·대출·입주와 관련해 확인할 점을 정리합니다.",
    category: "부동산등기",
    tags: ["신축아파트", "소유권이전등기", ...BUSAN_TAGS],
    searchIntent: "procedure",
    date: "2026-02-26",
    area: "부산",
    seoTitle: "신축아파트 소유권이전등기｜부산 법무사",
    seoDescription:
      "신축 아파트 준공 후 등기, 선순위 말소·대출 실행 순서. 해운대·센텀 신축 단지 상담.",
    relatedServices: ["ownership-transfer", "real-estate-registration"],
    relatedFaqs: ["ownership-transfer-documents"],
    relatedDiagnosis: ["소유권이전등기자가진단"],
    relatedGlossary: ["ownership-transfer-registration", "ownership-preservation-registration"],
    sections: {
      problem: [
        "신축 아파트 입주를 앞두고 대출 실행·선순위 근저당 말소·소유권이전등기 일정이 겹쳐 혼란스러운 경우가 많습니다.",
      ],
      summary: [
        "준공 후 소유권이전등기 일정은 사업주체·대출 구조에 따라 다릅니다.",
        "선순위 근저당 말소와 대출 실행 순서가 중요합니다.",
        "취득세·등록세 신고 기한을 놓치지 않아야 합니다.",
        "입주·등기·대출 일정을 한 번에 정리하는 것이 좋습니다.",
      ],
      procedure: [
        "분양계약·대출 약정 확인",
        "준공·말소·이전 일정 사업주체에 확인",
        "취득세 신고·납부",
        "소유권이전등기 접수",
        "대출 실행·입주",
      ],
      documents: [
        "분양계약서·잔금 영수증",
        "등기부등본·말소 서류",
        "인감·신분증",
        "취득세 납부 서류",
      ],
      caution: [
        "사업주체 지연 시 중도금·잔금 구조를 확인하세요.",
        "등기 전 입주는 계약상 가능해도 소유권은 별개입니다.",
      ],
      faq: [
        {
          question: "해운대·센텀 신축 단지도 같은가요?",
          answer: "절차는 같고, 관할 등기소는 부동산 소재지 기준입니다.",
        },
        {
          question: "법무사 비용은 언제 드나요?",
          answer: "등기 대리 시 사안별로 안내합니다. 상담 시 범위를 설명해 드립니다.",
        },
      ],
    },
    cta: {
      title: "신축 아파트 등기·대출 일정 정리",
      description: "부산 신축 분양 사안에서 말소·이전 순서를 안내해 드립니다.",
    },
  },
  {
    title: "공동명의 등기 시 주의사항",
    slug: "joint-ownership-registration-cautions",
    description:
      "부부·가족 공동명의 부동산 등기 시 지분, 세금, 이후 처분·대출에서 주의할 점을 정리합니다.",
    category: "부동산등기",
    tags: ["공동명의", "지분등기", ...BUSAN_TAGS],
    searchIntent: "documents",
    date: "2026-03-03",
    area: "부산",
    seoTitle: "공동명의 등기 주의사항｜부산 법무사",
    seoDescription:
      "부동산 공동명의 지분·세금·처분 동의. 해운대·센텀 부동산등기 상담.",
    relatedServices: ["real-estate-registration", "ownership-transfer"],
    relatedFaqs: ["real-estate-divorce-registration"],
    relatedDiagnosis: ["부동산등기자가진단"],
    sections: {
      problem: [
        "부부 공동명의로 등기했다가 이혼·상속·매각 시 지분 정리가 복잡해지거나, 한 명만 동의해 처분이 막히는 경우가 있습니다.",
      ],
      summary: [
        "공동명의는 지분 비율을 명확히 해야 합니다.",
        "처분·대출 시 공동명의인 동의가 필요한 경우가 많습니다.",
        "증여·상속·매매마다 세금 부담이 달라집니다.",
        "명의만 공동이고 실질 부담이 다르면 분쟁 소지가 있습니다.",
      ],
      procedure: [
        "공동명의 목적·지분 비율 결정",
        "취득 원인별 계약·세금 확인",
        "공동명의 등기 신청",
        "이후 처분·대출 시 동의 절차 확인",
      ],
      documents: [
        "매매·증여·상속 관련 계약서",
        "지분 약정서(필요 시)",
        "인감·신분증",
        "세금 납부 서류",
      ],
      caution: [
        "이혼 시 재산분할과 등기 지분이 별도로 정리되어야 합니다.",
        "한 명 100% 부담인데 공동명의면 문제가 될 수 있습니다.",
      ],
      faq: [
        {
          question: "부부 공동명의는 50:50인가요?",
          answer: "반드시 그렇지는 않습니다. 등기할 때 지분을 정합니다.",
        },
        {
          question: "한 명만 매각할 수 있나요?",
          answer: "지분 매각은 가능하나 절차·동의가 필요할 수 있습니다.",
        },
      ],
    },
    cta: {
      title: "공동명의 전후로 상담 받으세요",
      description: "부산·해운대에서 지분·세금·처분 리스크를 짚어 드립니다.",
    },
  },
  {
    title: "부산 부동산등기 준비서류",
    slug: "busan-real-estate-registration-documents",
    description:
      "부산·해운대·센텀에서 부동산등기(매매·상속·증여) 시 일반적으로 필요한 준비서류를 정리합니다.",
    category: "부동산등기",
    tags: ["부동산등기 서류", "부산", ...BUSAN_TAGS],
    searchIntent: "preparation-documents",
    date: "2026-03-10",
    area: "부산",
    region: "해운대구",
    seoTitle: "부산 부동산등기 준비서류｜해운대 법무사",
    seoDescription:
      "부산 부동산등기 공통·유형별 서류. 매매·상속·증여. 센텀 다옴법무사사무소.",
    relatedServices: ["real-estate-registration", "ownership-transfer"],
    relatedFaqs: ["ownership-transfer-documents"],
    relatedDiagnosis: ["부동산등기자가진단", "소유권이전등기자가진단"],
    relatedTools: ["real-estate-documents-check"],
    sections: {
      problem: [
        "부산에서 부동산등기를 맡기려는데 매매·상속·증여마다 서류가 다른지, 무엇을 먼저 준비해야 할지 문의가 많습니다.",
      ],
      summary: [
        "공통: 등기부등본, 인감증명서, 신분증, 등기권리증 등",
        "매매: 매매계약서·잔금 영수증·취득세",
        "상속: 가족관계증명서·분할협의서",
        "증여: 증여계약서·증여세 신고",
      ],
      procedure: [
        "등기 목적(매매·상속·증여) 확인",
        "등기부·권리관계 조회",
        "유형별 서류 목록 작성",
        "발급·작성 후 등기 신청",
      ],
      documents: [
        "등기부등본·토지·건물 대장",
        "당사자 인감증명서·신분증",
        "원인증명서류(매매·상속·증여)",
        "세금 납부 증명",
      ],
      caution: [
        "관할 등기소는 부동산 소재지 기준입니다.",
        "발급일 제한이 있는 서류는 일정에 맞춰 준비하세요.",
      ],
      faq: [
        {
          question: "해운대·센텀 사무소에서 발급 대행이 되나요?",
          answer: "위임 시 일부 서류 발급·등기 신청을 대리할 수 있습니다.",
        },
        {
          question: "기존 안내 글과 차이는?",
          answer: "이 글은 부산 지역 실무 기준 준비서류 체크리스트에 가깝습니다.",
        },
      ],
    },
    cta: {
      title: "등기 유형별 서류 목록을 드립니다",
      description: "부산·해운대·센텀에서 사안에 맞는 준비서류만 골라 안내합니다.",
    },
  },
  {
    title: "부동산등기 법무사 상담이 필요한 경우",
    slug: "when-to-consult-real-estate-registration-lawyer",
    description:
      "스스로 등기할지 법무사 상담이 필요한지 판단할 수 있도록, 부동산등기에서 전문가 도움이 특히 필요한 상황을 정리합니다.",
    category: "부동산등기",
    tags: ["부동산등기 상담", "법무사", ...BUSAN_TAGS],
    searchIntent: "consultation",
    date: "2026-03-17",
    area: "부산",
    seoTitle: "부동산등기 법무사 상담이 필요한 때｜부산",
    seoDescription:
      "근저당·공동명의·상속·매도인 불응 등 법무사 상담이 필요한 부동산등기 사례. 해운대·센텀.",
    relatedServices: ["real-estate-registration", "ownership-transfer"],
    relatedFaqs: ["lawyer-fee-and-remote-faq", "how-to-book-consultation-faq"],
    relatedDiagnosis: ["부동산등기자가진단"],
    sections: {
      problem: [
        "등기를 직접 하려다 서류가 반려되거나, 근저당·가압류·공동명의 문제로 막혀 시간만 흘러가는 경우가 많습니다.",
      ],
      summary: [
        "근저당·가압류·전세권이 얽힌 경우",
        "상속·이혼·증여 등 가족 관계가 복잡한 경우",
        "매도인·상속인이 협조하지 않는 경우",
        "신축·법인 소유 부동산 등 특수 구조",
        "기한(취득세·상속·임원변경 등)이 촉박한 경우",
      ],
      procedure: [
        "등기부·계약서로 사안 복잡도 확인",
        "직접 등기 vs 대리 비용·리스크 비교",
        "상담 후 서류·일정 계획 수립",
        "등기 완료·권리관계 최종 확인",
      ],
      documents: [
        "등기부등본",
        "매매·상속·증여 관련 계약서",
        "기존 등기 신청 반려 서류(있는 경우)",
      ],
      caution: [
        "반려 후 수정보다 처음부터 정리하는 편이 빠른 경우가 많습니다.",
        "인터넷 등기만으로 해결되지 않는 사안이 많습니다.",
      ],
      faq: [
        {
          question: "부산 법무사 비용은 어떻게 되나요?",
          answer: "사안·부동산 수·권리 관계에 따라 다릅니다. 상담 시 범위를 설명합니다.",
        },
        {
          question: "방문 없이 진행되나요?",
          answer: "서류 위임·비대면 상담이 가능한 경우가 많습니다.",
        },
      ],
    },
    cta: {
      title: "복잡한 등기일수록 먼저 상담하세요",
      description: "해운대·센텀 다옴법무사사무소에서 등기 가능 여부부터 확인해 드립니다.",
    },
  },
];
