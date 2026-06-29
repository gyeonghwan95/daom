import type { SeoIntentArticle } from "./types";

const BUSAN_TAGS = ["부산 법무사", "해운대 법무사", "센텀 법무사"];

export const corporateSeoIntentArticles: SeoIntentArticle[] = [
  {
    title: "법인 임원변경등기 기한과 준비",
    slug: "director-change-registration-deadline-guide",
    description:
      "법인 임원·대표이사 변경 후 임원변경등기 기한, 과태료 전에 확인할 사항과 준비 순서를 정리합니다.",
    category: "법인등기",
    tags: ["임원변경등기", "기한", ...BUSAN_TAGS],
    searchIntent: "deadline",
    date: "2026-01-16",
    area: "부산",
    seoTitle: "법인 임원변경등기 기한｜부산 법무사",
    seoDescription:
      "임원변경등기 신청 기한·과태료, 주주총회 의사록. 해운대·센텀 법인등기 상담.",
    relatedServices: ["director-change", "corporate-registration"],
    relatedFaqs: ["director-change-deadline-faq"],
    relatedDiagnosis: ["임원변경등기자가진단", "법인등기자가진단"],
    relatedTools: ["director-change-penalty-deadline"],
    relatedGlossary: ["director-change-registration"],
    sections: {
      problem: [
        "대표이사가 바뀌었는데 등기를 미뤄 두었다가, 은행·거래처 서류에서 등기부와 불일치가 드러나거나 과태료 통지를 받는 경우가 있습니다.",
      ],
      summary: [
        "임원 변경 사유 발생 후 일정 기간 내 등기 신청이 필요합니다.",
        "주주총회 의사록·취임승낙서·인감 등이 핵심 서류입니다.",
        "기한 경과 시 과태료가 부과될 수 있습니다.",
        "등기 전후로 사업자등록·통장·계약 담당자 정보도 맞춰야 합니다.",
      ],
      procedure: [
        "주주총회·이사회 결의",
        "취임·퇴임 서류 작성",
        "임원변경등기 신청",
        "등기 완료 후 대외 기관 정보 변경",
      ],
      documents: [
        "주주총회 의사록",
        "취임승낙서·사임서",
        "등기 임원 인감증명서",
        "법인 인감·등기부등본",
      ],
      caution: [
        "의사록 형식 오류는 등기 반려의 흔한 원인입니다.",
        "대표권 있는 임원 변경은 특히 빠르게 처리하는 것이 좋습니다.",
      ],
      faq: [
        {
          question: "기존 블로그 과태료 글과 다른가요?",
          answer: "이 글은 기한·준비 중심입니다. 과태료 계산은 계산기·FAQ를 함께 보세요.",
        },
        {
          question: "부산 법인도 같은 기한인가요?",
          answer: "전국 동일 기준입니다. 관할 등기소는 본점 소재지 기준입니다.",
        },
      ],
    },
    cta: {
      title: "임원변경등기 일정이 촉박하면",
      description: "센텀·해운대에서 의사록·등기 접수 일정을 빠르게 잡아 드립니다.",
    },
  },
  {
    title: "대표이사 주소 변경등기",
    slug: "ceo-address-change-registration",
    description:
      "법인 대표이사 주소만 바뀐 경우 임원변경등기(주소 변경) 절차와 필요 서류를 정리합니다.",
    category: "법인등기",
    tags: ["대표이사", "주소변경", "임원변경등기", ...BUSAN_TAGS],
    searchIntent: "procedure",
    date: "2026-01-23",
    area: "부산",
    seoTitle: "대표이사 주소 변경등기｜부산 법무사",
    seoDescription:
      "대표이사 주소 변경 임원변경등기 서류·기한. 해운대·센텀 법인등기.",
    relatedServices: ["director-change"],
    relatedFaqs: ["corporate-address-change-faq"],
    relatedDiagnosis: ["임원변경등기자가진단"],
    relatedSituations: ["corporate-officer-address-change"],
    sections: {
      problem: [
        "대표이사가 이사만 했는데 법인 등기는 그대로 두었다가, 등기부상 주소와 실제 주소가 달라 거래·대출에서 지적받는 경우가 있습니다.",
      ],
      summary: [
        "대표이사 주소 변경도 임원변경등기 대상입니다.",
        "주주총회 결의·취임승낙서 등이 필요할 수 있습니다.",
        "본점 주소 변경과는 다른 절차입니다.",
        "기한 내 신청하지 않으면 과태료가 있을 수 있습니다.",
      ],
      procedure: [
        "주주총회 결의(정관·내부 규정에 따름)",
        "주소 변경 취임승낙서 작성",
        "임원변경등기 신청",
        "등기부 확인",
      ],
      documents: [
        "주주총회 의사록",
        "취임승낙서",
        "대표이사 주민등록초본",
        "법인 인감·등기부등본",
      ],
      caution: [
        "본점 이전등기와 혼동하지 마세요.",
        "대표이사와 본점을 동시에 옮기면 절차가 겹칠 수 있습니다.",
      ],
      faq: [
        {
          question: "사업자등록증만 바꾸면 되나요?",
          answer: "등기와 사업자등록은 별개입니다. 둘 다 맞춰야 합니다.",
        },
        {
          question: "부산으로 이사한 경우 관할은?",
          answer: "법인 본점 관할 등기소에 신청합니다. 본점도 이전했으면 본점이전등기가 필요합니다.",
        },
      ],
    },
    cta: {
      title: "대표이사 주소 변경, 등기로 마무리하세요",
      description: "부산·센텀 법인에서 주소 변경등기 서류를 정리해 드립니다.",
    },
  },
  {
    title: "본점이전등기 관내·관외 차이",
    slug: "head-office-move-in-out-district",
    description:
      "법인 본점을 같은 등기소 관내에서 옮기는 경우와 관할 등기소가 바뀌는 관외 이전의 차이를 정리합니다.",
    category: "법인등기",
    tags: ["본점이전등기", "법인등기", ...BUSAN_TAGS],
    searchIntent: "procedure",
    date: "2026-01-30",
    area: "부산",
    seoTitle: "본점이전등기 관내·관외 차이｜부산 법무사",
    seoDescription:
      "법인 본점 관내·관외 이전 절차·세금·기한. 해운대에서 센텀·타 구 이전 상담.",
    relatedServices: ["corporate-registration", "company-establishment"],
    relatedFaqs: ["corporate-address-change-faq"],
    relatedDiagnosis: ["법인등기자가진단"],
    relatedTools: ["head-office-move-deadline"],
    relatedGlossary: ["head-office-move-registration"],
    sections: {
      problem: [
        "사무실을 옮기면서 본점이전등기를 해야 하는데, 같은 구 안인지 다른 구인지에 따라 절차·비용이 달라진다는 말을 듣고 헷갈리는 경우가 많습니다.",
      ],
      summary: [
        "관내 이전: 같은 등기소 관할 안에서 주소만 바뀌는 경우",
        "관외 이전: 등기소 관할이 바뀌는 경우(구·시 변경 등)",
        "둘 다 주주총회 결의·등기 신청이 필요합니다.",
        "관외 이전은 절차·수수료가 더 복잡할 수 있습니다.",
      ],
      procedure: [
        "새·구 주소의 관할 등기소 확인",
        "주주총회 결의",
        "본점이전등기 신청(관내·관외)",
        "사업자등록·통장 주소 변경",
      ],
      documents: [
        "주주총회 의사록",
        "본점이전 등기 신청서",
        "임대차계약서·사용승낙서",
        "법인 인감·등기부등본",
      ],
      caution: [
        "이전만 하고 등기 안 하면 과태료 대상입니다.",
        "센텀에서 다른 구로 옮기면 관외일 수 있습니다.",
      ],
      faq: [
        {
          question: "해운대구 안에서만 옮기면 관내인가요?",
          answer: "같은 등기소 관할이면 관내에 해당하는 경우가 많습니다. 정확한 구분은 주소로 확인합니다.",
        },
        {
          question: "지점도 같이 옮기나요?",
          answer: "지점이 있으면 지점 등기도 별도 검토가 필요합니다.",
        },
      ],
    },
    cta: {
      title: "본점 이전 전 관내·관외부터 확인하세요",
      description: "부산·센텀에서 이전 유형별 절차·기한을 안내합니다.",
    },
  },
  {
    title: "법인 목적변경등기",
    slug: "corporate-purpose-change-registration",
    description:
      "법인 정관 목적 변경 시 주주총회 결의, 등기 절차, 사업자등록 정비 사항을 정리합니다.",
    category: "법인등기",
    tags: ["목적변경", "정관변경", ...BUSAN_TAGS],
    searchIntent: "procedure",
    date: "2026-02-07",
    area: "부산",
    seoTitle: "법인 목적변경등기 절차｜부산 법무사",
    seoDescription:
      "정관 목적 변경·주주총회·등기. 해운대·센텀 스타트업·법인등기 상담.",
    relatedServices: ["corporate-registration"],
    relatedFaqs: ["capital-increase-registration-faq"],
    relatedDiagnosis: ["법인등기자가진단"],
    relatedGlossary: ["purpose-change-registration"],
    sections: {
      problem: [
        "사업 방향이 바뀌어 정관 목적을 수정해야 하는데, 결의 정족수·등기·사업자등록 업종 변경을 어떻게 맞춰야 할지 모르는 경우가 있습니다.",
      ],
      summary: [
        "정관 변경은 원칙적으로 주주총회 특별결의가 필요합니다.",
        "목적변경등기를 해야 등기부와 실제 사업이 맞습니다.",
        "사업자등록 업종·허가 업무가 있으면 별도 확인이 필요합니다.",
        "투자·대출 계약에 영향을 줄 수 있습니다.",
      ],
      procedure: [
        "변경할 목적 문구 확정",
        "주주총회 특별결의",
        "정관 변경 등기 신청",
        "사업자등록 정비",
      ],
      documents: [
        "주주총회 의사록",
        "개정 정관",
        "등기 신청서·법인 인감",
      ],
      caution: [
        "목적만 바꾸고 등기 안 하면 불일치 리스크가 있습니다.",
        "특정 업종은 인·허가가 따로 필요합니다.",
      ],
      faq: [
        {
          question: "목적을 넓게 써 두면 편한가요?",
          answer: "설립 시부터 적절한 목적 설계가 중요합니다. 무리한 포괄 표현은 문제가 될 수 있습니다.",
        },
        {
          question: "스타트업 피벗도 같은 절차인가요?",
          answer: "정관상 목적을 바꾸면 등기가 필요합니다.",
        },
      ],
    },
    cta: {
      title: "목적 변경 전 정관·등기 함께 봅니다",
      description: "센텀·부산 스타트업 법인 목적변경 상담.",
    },
  },
  {
    title: "법인 상호변경등기",
    slug: "corporate-name-change-registration",
    description:
      "법인 상호(회사 이름) 변경 시 중복 확인, 주주총회, 등기·대외 기관 변경 순서를 정리합니다.",
    category: "법인등기",
    tags: ["상호변경", "법인등기", ...BUSAN_TAGS],
    searchIntent: "procedure",
    date: "2026-02-14",
    area: "부산",
    seoTitle: "법인 상호변경등기｜부산 법무사",
    seoDescription:
      "법인 상호 변경 절차·서류·사업자등록. 해운대·센텀 법인등기.",
    relatedServices: ["corporate-registration"],
    relatedFaqs: ["corporate-address-change-faq"],
    relatedDiagnosis: ["법인등기자가진단"],
    sections: {
      problem: [
        "회사 이름을 바꾸려는데 상호 중복·상표·계약서·계좌명 변경까지 한꺼번에 고려해야 해 부담이 큽니다.",
      ],
      summary: [
        "상호 변경은 정관 변경·주주총회 결의 후 등기합니다.",
        "등기 전 상호 사용 가능 여부·중복을 확인해야 합니다.",
        "사업자등록·통장·계약·세금계산서 명칭도 변경해야 합니다.",
        "브랜드·도메인·상표와 별도로 등기 상호가 정식 명칭입니다.",
      ],
      procedure: [
        "변경 상호 가용성 확인",
        "주주총회 결의",
        "상호변경등기",
        "사업자·금융·계약 명칭 변경",
      ],
      documents: [
        "주주총회 의사록",
        "개정 정관",
        "법인 인감·등기 신청서",
      ],
      caution: [
        "등기 전 새 상호로 계약하면 불일치가 생길 수 있습니다.",
        "타사 상호·상표와 충돌하지 않는지 확인하세요.",
      ],
      faq: [
        {
          question: "영문 상호만 바꿀 수 있나요?",
          answer: "정관·등기에 반영된 명칭 변경 절차가 필요합니다.",
        },
        {
          question: "상호 변경 후 사업자번호는?",
          answer: "사업자번호는 유지되나 상호 항목은 변경 신고합니다.",
        },
      ],
    },
    cta: {
      title: "상호 변경 등기·대외 정리까지",
      description: "부산·센텀 법인 상호변경 절차를 안내합니다.",
    },
  },
  {
    title: "1인 법인설립 체크리스트",
    slug: "one-person-company-establishment-checklist",
    description:
      "1인 주주 법인을 설립할 때 정관·자본금·임원·사업자등록·등기 순서를 체크리스트로 정리합니다.",
    category: "법인등기",
    tags: ["1인 법인", "법인설립", ...BUSAN_TAGS],
    searchIntent: "preparation-documents",
    date: "2026-02-21",
    area: "부산",
    seoTitle: "1인 법인설립 체크리스트｜부산 법무사",
    seoDescription:
      "1인 주주 법인 설립 서류·순서·세금. 해운대·센텀 창업 법인설립 상담.",
    relatedServices: ["company-establishment", "corporate-registration"],
    relatedFaqs: ["company-establishment-documents-faq"],
    relatedDiagnosis: ["법인설립자가진단"],
    relatedGlossary: ["company-establishment-registration"],
    sections: {
      problem: [
        "프리랜서·소규모 사업자가 1인 법인을 만들려는데, 정관·자본금·사무실·등기 순서를 어디서부터 시작할지 막막합니다.",
      ],
      summary: [
        "1인도 주식회사 설립이 가능합니다(1인 주식회사).",
        "정관·발기·자본금 납입·설립등기·사업자등록 순서가 일반적입니다.",
        "본점 주소·상호·목적·임원을 먼저 정합니다.",
        "설립 후 통장·세무 기장도 함께 계획하세요.",
      ],
      procedure: [
        "상호·목적·본점·자본금 결정",
        "정관 작성·발기",
        "자본금 납입·잔고증명",
        "설립등기·사업자등록",
      ],
      documents: [
        "정관",
        "발기인 결의록",
        "자본금 납입 증명",
        "임원 취임승낙서·인감",
        "사무실 사용 승낙서",
      ],
      caution: [
        "가짜 사무실·명의대여는 문제가 될 수 있습니다.",
        "설립만 하고 운영 정비를 안 하면 세무 리스크가 있습니다.",
      ],
      faq: [
        {
          question: "기존 설립 체크리스트 글과 다른가요?",
          answer: "이 글은 1인 주주에 특화된 체크리스트입니다.",
        },
        {
          question: "부산·센텀에서 설립 가능한가요?",
          answer: "본점 소재지 기준으로 설립등기합니다.",
        },
      ],
    },
    cta: {
      title: "1인 법인 설립, 순서부터 정리해 드립니다",
      description: "해운대·센텀 창업 상담에서 설립·등기 일정을 잡아 드립니다.",
    },
  },
  {
    title: "법인등기 과태료가 나오는 경우",
    slug: "corporate-registration-penalty-cases",
    description:
      "임원변경·본점이전·목적변경 등 법인등기를 하지 않아 과태료가 부과되는 대표 사례와 예방 방법을 정리합니다.",
    category: "법인등기",
    tags: ["법인등기 과태료", "임원변경", ...BUSAN_TAGS],
    searchIntent: "penalty",
    date: "2026-02-28",
    area: "부산",
    seoTitle: "법인등기 과태료 나는 경우｜부산 법무사",
    seoDescription:
      "임원변경·본점이전 미등기 과태료. 해운대·센텀 법인 과태료 상담.",
    relatedServices: ["director-change", "corporate-registration"],
    relatedFaqs: ["director-change-deadline-faq"],
    relatedDiagnosis: ["임원변경등기자가진단"],
    relatedTools: ["director-change-penalty-deadline"],
    sections: {
      problem: [
        "법인은 운영 중인데 등기는 예전 그대로라, 나중에 과태료 고지를 받고 급히 등기하는 사례가 많습니다.",
      ],
      summary: [
        "임원 변경·본점 이전·목적·상호 변경 등은 등기 의무가 있습니다.",
        "기한 경과 시 일정 기간마다 과태료가 가산될 수 있습니다.",
        "등기부와 실제가 다르면 대출·계약에서도 문제가 됩니다.",
        "발생 후에도 빠르게 등기하면 이후 과태료를 막을 수 있습니다.",
      ],
      procedure: [
        "등기부와 실제 운영 상태 비교",
        "누락된 변경 사항 목록화",
        "필요 결의·서류 보완",
        "등기 신청·과태료 납부",
      ],
      documents: [
        "등기부등본",
        "주주총회 의사록 등 누락 결의 서류",
        "과태료 고지서(있는 경우)",
      ],
      caution: [
        "과태료만 내고 등기 안 하면 계속 가산될 수 있습니다.",
        "여러 변경이 누적되면 한꺼번에 정리하는 편이 낫습니다.",
      ],
      faq: [
        {
          question: "과태료는 얼마나 나오나요?",
          answer: "변경 유형·경과 기간에 따라 다릅니다. 계산기·상담으로 대략 확인합니다.",
        },
        {
          question: "이미 여러 해 지났어도 등기 가능한가요?",
          answer: "가능합니다. 누적 과태료와 함께 정리해야 합니다.",
        },
      ],
    },
    cta: {
      title: "과태료 고지 전에 등기 상태 점검하세요",
      description: "부산·센텀 법인 등기 누락 사항을 정리해 드립니다.",
    },
  },
  {
    title: "임원 임기 만료를 놓쳤을 때",
    slug: "missed-director-term-expiry",
    description:
      "법인 임원 임기가 끝났는데 연임·퇴임 등기를 하지 않은 경우 확인할 점과 정리 순서를 안내합니다.",
    category: "법인등기",
    tags: ["임원 임기", "임원변경등기", ...BUSAN_TAGS],
    searchIntent: "deadline",
    date: "2026-03-05",
    area: "부산",
    seoTitle: "임원 임기 만료 놓쳤을 때｜부산 법무사",
    seoDescription:
      "임기 만료·연임·사임 등기. 해운대·센텀 법인 임원변경 상담.",
    relatedServices: ["director-change"],
    relatedFaqs: ["director-change-deadline-faq"],
    relatedDiagnosis: ["임원변경등기자가진단"],
    sections: {
      problem: [
        "임원 임기가 지났는데 연임 결의·등기를 안 해 등기부상 임기와 실제가 어긋나는 법인이 있습니다.",
      ],
      summary: [
        "임기 만료 시 연임·사임·후임 선임 등 결의가 필요합니다.",
        "등기 없이 업무를 계속하면 과태료·대내외 불일치가 생깁니다.",
        "정관상 자동 연임 조항이 있는지 확인해야 합니다.",
        "대표권 공백은 계약·금융에 영향을 줍니다.",
      ],
      procedure: [
        "정관·등기부상 임기 확인",
        "연임·사임·선임 결의",
        "임원변경등기",
        "대외 기관 정보 갱신",
      ],
      documents: [
        "주주총회 의사록",
        "취임승낙서·사임서",
        "등기부등본",
      ],
      caution: [
        "임기와 주소 변경을 동시에 놓친 경우가 많습니다.",
        "오래 방치할수록 과태료가 커질 수 있습니다.",
      ],
      faq: [
        {
          question: "임기 지나도 대표로 일할 수 있나요?",
          answer: "실무와 등기가 어긋나면 법적 리스크가 있습니다. 빠르게 정리하세요.",
        },
        {
          question: "이사만 만료된 경우도 등기하나요?",
          answer: "변경 내용에 따라 등기 대상이 됩니다.",
        },
      ],
    },
    cta: {
      title: "임기·등기 불일치부터 점검하세요",
      description: "센텀·부산 법인 임원 정리 상담.",
    },
  },
  {
    title: "부산 법인설립등기 준비서류",
    slug: "busan-company-establishment-documents",
    description:
      "부산·해운대·센텀에서 법인설립등기 시 필요한 준비서류와 발급 순서를 정리합니다.",
    category: "법인등기",
    tags: ["법인설립", "준비서류", "부산", ...BUSAN_TAGS],
    searchIntent: "preparation-documents",
    date: "2026-03-12",
    area: "부산",
    region: "해운대구",
    seoTitle: "부산 법인설립등기 준비서류｜센텀 법무사",
    seoDescription:
      "부산 법인설립 등기 서류·순서. 해운대·센텀 창업 법인설립 상담.",
    relatedServices: ["company-establishment"],
    relatedFaqs: ["company-establishment-documents-faq"],
    relatedDiagnosis: ["법인설립자가진단"],
    sections: {
      problem: [
        "부산에서 법인을 설립하려는데 정관·잔고증명·인감·사무실 서류를 어떤 순서로 준비해야 할지 문의가 많습니다.",
      ],
      summary: [
        "정관·발기 결의·자본금 납입·설립등기·사업자등록이 기본 흐름입니다.",
        "본점 주소 확보·사용 승낙이 선행되어야 합니다.",
        "임원 인감·취임승낙서가 필요합니다.",
        "관할 등기소는 본점 소재지(해운대·센텀 등) 기준입니다.",
      ],
      procedure: [
        "상호·목적·자본금·임원 확정",
        "정관 작성",
        "자본금 납입",
        "설립등기 신청",
        "사업자등록",
      ],
      documents: [
        "정관·발기 결의록",
        "자본금 납입 증명(잔고증명)",
        "임원 인감·취임승낙서",
        "본점 사용 승낙서",
      ],
      caution: [
        "서류 발급일 제한을 확인하세요.",
        "설립 후 세무·통장 개설도 일정에 넣으세요.",
      ],
      faq: [
        {
          question: "센텀 사무실로 설립 가능한가요?",
          answer: "적법한 사업장 확보가 전제입니다. 주소 요건을 상담 시 확인합니다.",
        },
        {
          question: "원격으로 설립할 수 있나요?",
          answer: "일부 절차는 비대면 가능하나 인감·서명 요건이 있습니다.",
        },
      ],
    },
    cta: {
      title: "설립 서류 목록을 맞춤으로 드립니다",
      description: "해운대·센텀에서 법인설립등기 준비를 도와드립니다.",
    },
  },
  {
    title: "스타트업 법인등기 실무 체크",
    slug: "startup-corporate-registration-checklist",
    description:
      "스타트업이 설립 후 투자·임원 변경·스톡옵션·본점 이전까지 법인등기에서 자주 놓치는 항목을 정리합니다.",
    category: "법인등기",
    tags: ["스타트업", "법인등기", "센텀", ...BUSAN_TAGS],
    searchIntent: "consultation",
    date: "2026-03-19",
    area: "부산",
    region: "해운대구",
    seoTitle: "스타트업 법인등기 실무 체크｜센텀 법무사",
    seoDescription:
      "스타트업 임원변경·증자·본점이전 등기. 해운대·센텀 창업 법인 상담.",
    relatedServices: ["company-establishment", "director-change", "corporate-registration"],
    relatedFaqs: ["capital-increase-registration-faq", "company-establishment-documents-faq"],
    relatedDiagnosis: ["법인설립자가진단", "임원변경등기자가진단"],
    sections: {
      problem: [
        "센텀·해운대 스타트업이 투자·대표 변경·사무실 확장을 하면서 등기를 뒤로 미루다 투자 심사·대출에서 등기부 불일치가 문제가 되는 경우가 있습니다.",
      ],
      summary: [
        "설립등기 이후에도 임원·본점·목적·증자 등기가 이어집니다.",
        "투자 전 등기부 정합성을 맞추는 것이 좋습니다.",
        "스톡옵션·전환사채는 별도 계약·등기 검토가 필요할 수 있습니다.",
        "본점 이전·임원 변경은 기한·과태료를 함께 봐야 합니다.",
      ],
      procedure: [
        "등기부·정관·주주명부 정합성 점검",
        "누락 변경 사항 목록화",
        "투자·운영 일정에 맞춰 등기 계획",
        "등기 완료 후 투자자·은행 공유",
      ],
      documents: [
        "등기부등본·정관",
        "주주총회 의사록(누락분)",
        "투자 계약 관련 등기 서류(해당 시)",
      ],
      caution: [
        "임원만 바꾸고 등기 안 한 경우가 가장 흔합니다.",
        "증자·감자는 별도 등기 절차가 있습니다.",
      ],
      faq: [
        {
          question: "센텀 스타트업도 같은가요?",
          answer: "등기 제도는 동일합니다. 본점 관할 등기소에서 처리합니다.",
        },
        {
          question: "기존 설립 체크리스트와 다른가요?",
          answer: "이 글은 설립 이후 운영·투자 단계 등기에 초점을 둡니다.",
        },
      ],
    },
    cta: {
      title: "투자 전 등기부부터 점검하세요",
      description: "센텀·해운대 스타트업 법인등기 실무 상담.",
    },
  },
];
