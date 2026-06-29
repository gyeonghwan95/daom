import type { SeoIntentArticle } from "./types";

const BUSAN_TAGS = ["부산 법무사", "해운대 법무사", "센텀 법무사"];

export const inheritanceSeoIntentArticles: SeoIntentArticle[] = [
  {
    title: "부모님 사망 후 상속등기를 먼저 해야 하나요",
    slug: "inheritance-registration-priority-after-parent-death",
    description:
      "부모님 사망 직후 상속포기·한정승인·상속등기 중 무엇을 먼저 봐야 하는지, 부산 상속 상담 전에 정리할 순서를 안내합니다.",
    category: "상속 안내",
    tags: ["상속등기", "사망 후 절차", ...BUSAN_TAGS],
    searchIntent: "procedure",
    date: "2026-01-12",
    area: "부산",
    region: "해운대구",
    seoTitle: "부모님 사망 후 상속등기 먼저? 순서 정리｜부산 법무사",
    seoDescription:
      "사망 직후 상속등기·상속포기·한정승인 중 무엇을 먼저 볼지, 3개월 기한과 준비 순서. 해운대·센텀 다옴법무사사무소.",
    relatedServices: ["inheritance-registration", "inheritance-renunciation", "qualified-acceptance"],
    relatedFaqs: ["when-to-file-inheritance-registration", "who-needs-inheritance-registration"],
    relatedDiagnosis: ["상속등기자가진단", "상속포기자가진단", "한정승인자가진단"],
    relatedSituations: ["parent-passed-away"],
    relatedGlossary: ["inheritance-registration", "legal-inheritance-order"],
    sections: {
      problem: [
        "부모님이 돌아가신 뒤 장례를 마치고 나면, 상속등기부터 해야 하는지, 빚 확인부터 해야 하는지 순서가 헷갈리는 경우가 많습니다. 형제자매마다 생각이 달라 갈등이 생기기도 합니다.",
      ],
      summary: [
        "상속 개시와 동시에 상속인 지위가 생기며, 채무가 의심되면 상속등기보다 상속포기·한정승인 여부를 먼저 검토해야 합니다.",
        "채무가 크지 않다고 판단되면 상속등기를 진행하되, 피상속인 명의 부동산·예금·주식 등 재산 목록을 먼저 정리하는 것이 좋습니다.",
        "상속포기·한정승인은 상속인임을 안 날로부터 3개월 이내 가정법원 신고가 필요합니다.",
        "상속등기는 기한이 지나 과태료가 부과될 수 있어, 방치하지 않는 것이 중요합니다.",
      ],
      procedure: [
        "사망신고·가족관계증명서·등기부등본 등 기본 서류 확보",
        "피상속인 재산·채무 현황 파악(등기부, 금융거래, 세금 납부 내역 등)",
        "채무 규모에 따라 상속포기·한정승인·단순승인 방향 결정",
        "상속재산분할협의서 작성(공동상속인이 여럿인 경우)",
        "상속등기 신청 및 등기 완료",
      ],
      documents: [
        "피상속인 기본증명서·가족관계증명서·혼인관계증명서",
        "상속인 전원 신분증·인감증명서",
        "피상속인 및 상속인 주민등록초본",
        "부동산 등기사항전부증명서, 임대차 관련 서류",
        "상속재산분할협의서(해당 시)",
      ],
      caution: [
        "상속등기만 급하게 진행했다가 나중에 채무를 발견하면 대응이 어려워질 수 있습니다.",
        "공동상속인 중 한 명만 등기를 진행하면 나머지 지분 정리가 꼬일 수 있습니다.",
        "해외에 거주하는 상속인이 있으면 위임·공증 절차가 추가될 수 있습니다.",
      ],
      faq: [
        {
          question: "장례 직후 바로 상속등기 신청해도 되나요?",
          answer:
            "채무 여부를 어느 정도 확인한 뒤 진행하는 것이 안전합니다. 급한 부동산 처분이 필요하면 상담을 통해 순서를 정하는 것이 좋습니다.",
        },
        {
          question: "부산에서 상속등기는 어디서 하나요?",
          answer:
            "관할 등기소에 신청합니다. 부동산 소재지·본인 거주지 등에 따라 관할이 달라지므로 사전 확인이 필요합니다.",
        },
      ],
    },
    cta: {
      title: "사망 직후 무엇부터 할지 함께 정리해 드립니다",
      description:
        "재산·채무 자료가 일부만 있어도 괜찮습니다. 해운대·센텀 다옴법무사사무소에서 상속등기·상속포기·한정승인 순서를 상황에 맞게 안내해 드립니다.",
    },
  },
  {
    title: "상속포기와 한정승인의 차이",
    slug: "inheritance-renunciation-vs-qualified-acceptance",
    description:
      "채무가 있는 상속에서 상속포기와 한정승인의 차이와 선택 기준을 정리합니다.",
    category: "상속 안내",
    tags: ["상속포기", "한정승인", ...BUSAN_TAGS],
    searchIntent: "faq",
    date: "2025-10-28",
    area: "부산",
    seoTitle: "부산 상속포기·한정승인 비교 | 다옴법무사사무소",
    seoDescription: "상속포기와 한정승인 차이, 신고 기한, 선택 기준. 부산 상속 채무 상담.",
    relatedServices: ["inheritance-renunciation", "qualified-acceptance"],
    relatedFaqs: ["what-is-qualified-acceptance", "inheritance-renunciation-deadline"],
    relatedDiagnosis: ["상속포기자가진단", "한정승인자가진단"],
    relatedGlossary: ["inheritance-renunciation", "qualified-acceptance"],
    sections: {
      problem: ["기존 블로그 글과 동일 주제입니다."],
      summary: [],
      procedure: [],
      documents: [],
      caution: [],
      faq: [],
    },
    cta: { title: "", description: "" },
    skipGeneration: true,
  },
  {
    title: "돌아가신 부모님 빚 확인 방법",
    slug: "how-to-check-deceased-parent-debt",
    description:
      "피상속인 사망 후 채무를 어디서 어떻게 확인하는지, 한정승인·상속포기 판단 전에 꼭 볼 항목을 정리합니다.",
    category: "상속 안내",
    tags: ["상속 채무", "빚 확인", ...BUSAN_TAGS],
    searchIntent: "preparation-documents",
    date: "2026-01-18",
    area: "부산",
    seoTitle: "돌아가신 부모님 빚 확인 방법｜부산 상속 법무사",
    seoDescription:
      "피상속인 채무 조회 방법, 금융·세금·보증 채무 확인 순서. 한정승인 전 상담은 해운대 다옴법무사사무소.",
    relatedServices: ["qualified-acceptance", "inheritance-renunciation"],
    relatedFaqs: ["inheritance-registration-with-mortgage", "what-is-qualified-acceptance"],
    relatedDiagnosis: ["한정승인자가진단", "상속포기자가진단"],
    relatedSituations: ["inheritance-unknown-debt"],
    relatedGlossary: ["qualified-acceptance", "mortgage"],
    sections: {
      problem: [
        "부모님이 돌아가신 뒤 상속을 진행하려다 보증·대출·카드값 등 채무 규모를 모르는 경우가 많습니다. 나중에 채권자 연락을 받고 한정승인 기한을 놓치기도 합니다.",
      ],
      summary: [
        "금융기관 조회(신용정보원 채무확인서), 국세·지방세 완납증명, 등기부상 근저당·가압류 확인이 기본입니다.",
        "가족이 알고 있는 보증·사업 관련 채무는 별도로 정리해야 합니다.",
        "채무가 재산보다 많을 가능성이 있으면 상속등기 전에 한정승인·상속포기를 검토합니다.",
        "모든 채무를 100% 파악하기 어렵더라도, 확인 가능한 범위에서 판단하는 것이 중요합니다.",
      ],
      procedure: [
        "신용정보원 채무확인서 발급(상속인 신청)",
        "피상속인 명의 부동산·자동차 등기부 조회",
        "국세·지방세 납세증명·체납 여부 확인",
        "가족·지인에게 보증·사업 채무 여부 확인",
        "확인 결과를 바탕으로 한정승인·상속포기·상속등기 방향 결정",
      ],
      documents: [
        "피상속인 사망 관련 증명서",
        "상속인 신분증",
        "채무확인서·등기부등본·납세증명서",
        "보증계약서·대출약정서(보유 시)",
      ],
      caution: [
        "채무 확인 전 단순승인 상태가 되면 대응이 제한될 수 있습니다.",
        "공동보증·연대보증은 상속인에게도 영향을 줄 수 있습니다.",
        "숨겨진 채무가 나중에 발견될 수 있어 한정승인을 검토하는 경우가 많습니다.",
      ],
      faq: [
        {
          question: "빚이 없는지 어떻게 확실히 알 수 있나요?",
          answer:
            "공식 조회와 가족 확인을 병행합니다. 완전한 확정은 어렵지만, 확인된 범위에서 리스크를 줄이는 방향을 잡을 수 있습니다.",
        },
        {
          question: "채무가 많으면 상속을 포기해야 하나요?",
          answer:
            "반드시 포기할 필요는 없습니다. 재산이 남는다면 한정승인 후 필요한 등기만 진행하는 방법도 있습니다.",
        },
      ],
    },
    cta: {
      title: "채무 규모를 모르셔도 상담 가능합니다",
      description:
        "확인된 자료부터 함께 보며 한정승인·상속포기·상속등기 중 어떤 절차가 맞는지 부산·해운대에서 안내해 드립니다.",
    },
  },
  {
    title: "형제가 상속등기 협조를 안 할 때",
    slug: "when-siblings-refuse-inheritance-registration",
    description:
      "공동상속인인 형제·자매가 상속등기 서류에 협조하지 않을 때 확인할 점과 대응 방향을 정리합니다.",
    category: "상속 안내",
    tags: ["공동상속", "상속등기", "형제 상속", ...BUSAN_TAGS],
    searchIntent: "case",
    date: "2026-01-25",
    area: "부산",
    seoTitle: "형제 상속등기 협조 거부 대응｜부산 법무사",
    seoDescription:
      "공동상속인이 등기에 협조하지 않을 때 분할협의·지분등기·소송 검토 순서. 센텀·해운대 상속 상담.",
    relatedServices: ["inheritance-registration"],
    relatedFaqs: ["multiple-heirs-inheritance-registration"],
    relatedDiagnosis: ["상속등기자가진단"],
    relatedSituations: ["siblings-not-cooperating"],
    relatedGlossary: ["inheritance-division-agreement"],
    sections: {
      problem: [
        "부모님 유산을 정리하려는데 형제 중 일부가 연락이 안 되거나, 상속재산분할협의서 작성·인감 날인을 거부하는 경우가 있습니다. 부동산 매각이나 명의 정리가 막히기도 합니다.",
      ],
      summary: [
        "공동상속인 전원의 협의 없이 한 명만 전체 상속등기를 마칠 수는 없습니다.",
        "지분별 등기·분할협의·대리·소송 등 상황에 맞는 방법이 달라집니다.",
        "감정적 대립이 있어도 서류 요건과 법적 절차는 별도로 정리해야 합니다.",
        "부동산 처분이 급하면 지분등기 후 매각·경매 등을 검토할 수 있습니다.",
      ],
      procedure: [
        "상속인 범위·지분 비율 확인(가족관계증명서)",
        "협조 가능한 상속인과 1차 협의·분할안 작성",
        "불협조 상속인에게 내용증명 등으로 협의 요청",
        "분할협의가 안 되면 조정·소송·지분등기 등 법적 절차 검토",
        "합의 또는 판결 후 상속등기·처분 진행",
      ],
      documents: [
        "가족관계증명서·기본증명서",
        "등기부등본·재산 목록",
        "상속재산분할협의서 초안",
        "협의·내용증명 발송 기록",
      ],
      caution: [
        "일방적으로 재산을 처분하면 나중에 분쟁이 커질 수 있습니다.",
        "오래 방치하면 과태료·세금 문제가 생길 수 있습니다.",
        "형제 간 감정 문제와 법적 절차를 분리해 상담하는 것이 좋습니다.",
      ],
      faq: [
        {
          question: "혼자 상속등기를 할 수 없나요?",
          answer:
            "공동상속인이 여럿이면 전원 동의 또는 법원 판결 등이 필요합니다. 본인 지분만 등기하는 방법은 별도로 검토합니다.",
        },
        {
          question: "연락이 두절된 상속인은 어떻게 하나요?",
          answer:
            "주소 확인·공시송달·소송 등 절차가 있습니다. 구체적 방법은 사안별로 달라 상담이 필요합니다.",
        },
      ],
    },
    cta: {
      title: "형제 간 상속 갈등, 절차부터 정리해 보세요",
      description:
        "부산에서 공동상속 분쟁 사례를 많이 다룹니다. 협의 가능 여부부터 차분히 짚어 드립니다.",
    },
  },
  {
    title: "상속재산분할협의서 작성 전 주의사항",
    slug: "inheritance-division-agreement-cautions",
    description:
      "공동상속인이 상속재산분할협의서를 작성할 때 흔한 실수와 반드시 확인할 조항을 안내합니다.",
    category: "상속 안내",
    tags: ["상속재산분할", "분할협의서", ...BUSAN_TAGS],
    searchIntent: "documents",
    date: "2026-02-01",
    area: "부산",
    seoTitle: "상속재산분할협의서 작성 주의｜부산 법무사",
    seoDescription:
      "상속재산분할협의서 필수 조항, 부동산·예금 분할 시 확인 사항. 해운대·센텀 상속등기 상담.",
    relatedServices: ["inheritance-registration"],
    relatedFaqs: ["multiple-heirs-inheritance-registration"],
    relatedDiagnosis: ["상속등기자가진단"],
    relatedGlossary: ["inheritance-division-agreement", "statutory-reserve-share"],
    sections: {
      problem: [
        "형제끼리 대충 나누기로 하고 협의서를 썼다가, 부동산 가액·대출·세금 부담을 두고 다시 싸우는 경우가 있습니다. 등기소에서 반려되거나 수정을 여러 번 하기도 합니다.",
      ],
      summary: [
        "분할 대상 재산·지분·대금 정산·인도 시기를 구체적으로 적어야 합니다.",
        "특정 상속인에게만 부동산이 가면 취득세·양도세 이슈가 생길 수 있습니다.",
        "유류분·특별수익이 있으면 분할 비율이 달라질 수 있습니다.",
        "모든 공동상속인이 서명·날인해야 하며, 미성년 상속인은 법정대리인 서명이 필요합니다.",
      ],
      procedure: [
        "상속 재산 목록 작성(부동산·예금·주식·채권 등)",
        "분할 방식 협의(현물·대금·공유 지분)",
        "협의서 초안 작성 및 조항 검토",
        "전원 서명·인감 날인",
        "상속등기 첨부서류로 제출",
      ],
      documents: [
        "상속재산분할협의서 정본",
        "상속인 인감증명서·신분증",
        "분할 대상 부동산 등기부등본",
        "미성년자 법정대리인 증명(해당 시)",
      ],
      caution: [
        "구두 합의만으로는 등기에 사용할 수 없습니다.",
        "부동산 1건만 한 명 명의로 가져가는 경우 다른 상속인 지분 정산이 명확해야 합니다.",
        "나중에 매각할 계획이 있으면 분할 시점부터 세금을 고려하는 것이 좋습니다.",
      ],
      faq: [
        {
          question: "협의서 없이 상속등기가 가능한가요?",
          answer:
            "공동상속인이 여럿이면 원칙적으로 분할협의서가 필요합니다. 지분대로 등기하는 방식도 있습니다.",
        },
        {
          question: "이미 작성한 협의서를 고칠 수 있나요?",
          answer:
            "전원 합의로 수정·재작성할 수 있습니다. 등기 신청 전에 검토받는 것이 좋습니다.",
        },
      ],
    },
    cta: {
      title: "분할협의서 검토가 필요하시면",
      description:
        "작성 전·후 모두 상담 가능합니다. 부산·해운대에서 등기 가능한 형태로 조항을 점검해 드립니다.",
    },
  },
  {
    title: "미성년자가 상속인일 때",
    slug: "minor-heir-inheritance-guide",
    description:
      "미성년자가 상속인인 경우 법정대리인, 상속재산분할, 상속등기 절차에서 필요한 사항을 정리합니다.",
    category: "상속 안내",
    tags: ["미성년 상속인", "상속등기", ...BUSAN_TAGS],
    searchIntent: "procedure",
    date: "2026-02-08",
    area: "부산",
    seoTitle: "미성년자 상속인 절차｜부산 법무사",
    seoDescription:
      "미성년 상속인 법정대리인, 분할협의서, 상속등기 서류. 해운대·센텀 가정·상속 상담.",
    relatedServices: ["inheritance-registration"],
    relatedFaqs: ["multiple-heirs-inheritance-registration"],
    relatedDiagnosis: ["상속등기자가진단"],
    relatedGlossary: ["statutory-reserve-share", "legal-inheritance-order"],
    sections: {
      problem: [
        "자녀가 미성년인 상태에서 조부모·부모 상속이 발생하면, 누가 서명하고 재산을 어떻게 관리해야 하는지 막막한 경우가 많습니다.",
      ],
      summary: [
        "미성년 상속인은 법정대리인(보통 부모)이 상속 관련 행위를 대리합니다.",
        "상속재산분할협의서에 법정대리인 서명이 필요합니다.",
        "미성년자 명의 부동산 처분에는 가정법원 허가가 필요할 수 있습니다.",
        "상속 재산은 원칙적으로 미성년자 본인에게 귀속됩니다.",
      ],
      procedure: [
        "상속인·미성년 여부 확인",
        "법정대리인 자격 확인(친권자)",
        "상속재산분할협의(다른 상속인과)",
        "필요 서류 준비·상속등기 신청",
        "부동산 처분 시 가정법원 허가 여부 확인",
      ],
      documents: [
        "미성년 상속인 기본증명서·가족관계증명서",
        "법정대리인 신분증·인감증명서",
        "상속재산분할협의서",
        "친권·후견 관련 서류(해당 시)",
      ],
      caution: [
        "법정대리인이 다른 상속인과 이해가 충돌할 수 있어 조항을 명확히 해야 합니다.",
        "미성년자 지분 부동산을 성인 상속인 명의로만 등기하면 문제가 될 수 있습니다.",
        "상속세 신고·납부 시기도 함께 확인해야 합니다.",
      ],
      faq: [
        {
          question: "미성년자도 상속포기를 할 수 있나요?",
          answer:
            "가능하지만 가정법원 허가 등 별도 절차가 필요합니다. 단순히 부모가 대신 결정할 수 없습니다.",
        },
        {
          question: "조부모 유산을 부모가 관리해도 되나요?",
          answer:
            "상속 재산의 관리·처분에는 법정 절차가 따릅니다. 명의와 실제 귀속을 구분해야 합니다.",
        },
      ],
    },
    cta: {
      title: "미성년 상속인 사안은 서류 검토가 중요합니다",
      description:
        "가족 구성에 맞는 분할·등기 방향을 부산·해운대에서 안내해 드립니다.",
    },
  },
  {
    title: "해외 거주 상속인이 있을 때",
    slug: "overseas-heir-inheritance-busan",
    description:
      "해외에 사는 상속인이 있는 경우 위임장·공증·상속등기 절차와 부산에서 준비할 사항을 정리합니다.",
    category: "상속 안내",
    tags: ["해외 상속인", "상속등기", ...BUSAN_TAGS],
    searchIntent: "procedure",
    date: "2026-02-15",
    area: "부산",
    seoTitle: "해외 거주 상속인 상속등기｜부산 법무사",
    seoDescription:
      "해외 상속인 위임장·영사확인·공증, 상속재산분할. 부산·해운대 국제 상속 상담.",
    relatedServices: ["inheritance-registration"],
    relatedFaqs: ["multiple-heirs-inheritance-registration", "lawyer-fee-and-remote-faq"],
    relatedDiagnosis: ["상속등기자가진단"],
    sections: {
      problem: [
        "형제·자매 중 해외에 거주하는 상속인이 있으면 인감·서명 문제로 상속등기가 수개월 지연되기도 합니다.",
      ],
      summary: [
        "해외 상속인은 위임장·인감증명 또는 공증된 서명으로 대리 신청이 가능한 경우가 많습니다.",
        "거주 국가에 따라 영사확인·아포스티유 절차가 필요합니다.",
        "상속재산분할협의서에도 해외 상속인의 서명이 필요합니다.",
        "시차·우편 지연을 감안해 일정을 넉넉히 잡는 것이 좋습니다.",
      ],
      procedure: [
        "해외 상속인 연락처·주소 확인",
        "필요 서류 목록 안내(위임장·인감·분할협의서)",
        "현지 공증·영사확인 진행",
        "국내 도착 서류 검토 후 상속등기 신청",
      ],
      documents: [
        "해외 상속인 위임장(공증·영사확인)",
        "인감증명서 또는 서명공증",
        "상속재산분할협의서",
        "상속인·피상속인 가족관계증명서",
      ],
      caution: [
        "서류 형식이 맞지 않으면 등기소에서 보정 요구가 반복될 수 있습니다.",
        "위임 범위가 불명확하면 나중에 분쟁 소지가 있습니다.",
        "해외 상속인이 상속포기·한정승인을 하려면 별도 절차가 필요합니다.",
      ],
      faq: [
        {
          question: "해외에 와야만 하나요?",
          answer:
            "원칙적으로 방문 없이 위임·공증 서류로 진행할 수 있는 경우가 많습니다. 국가별 요건이 다릅니다.",
        },
        {
          question: "부산에서 대리 진행이 가능한가요?",
          answer:
            "국내 상속인이 위임받아 진행하거나, 법무사가 서류 정리·등기 신청을 도울 수 있습니다.",
        },
      ],
    },
    cta: {
      title: "해외 상속인 서류, 국가별로 안내해 드립니다",
      description:
        "센텀·해운대 사무소에서 국내 절차를 정리하고, 해외 상속인에게 필요한 서류 목록을 드립니다.",
    },
  },
  {
    title: "사망 후 3개월이 지났을 때",
    slug: "three-months-after-death-inheritance",
    description:
      "상속 개시 후 3개월이 지난 뒤 상속포기·한정승인·상속등기·과태료 등에서 달라지는 점을 정리합니다.",
    category: "상속 안내",
    tags: ["상속 3개월", "한정승인 기한", "상속등기 과태료", ...BUSAN_TAGS],
    searchIntent: "deadline",
    date: "2026-02-22",
    area: "부산",
    seoTitle: "사망 후 3개월 지나면?｜부산 상속 법무사",
    seoDescription:
      "상속포기·한정승인 3개월 기한, 단순승인·상속등기 과태료. 해운대·센텀 긴급 상담.",
    relatedServices: ["qualified-acceptance", "inheritance-renunciation", "inheritance-registration"],
    relatedFaqs: ["inheritance-renunciation-deadline", "when-to-file-inheritance-registration"],
    relatedDiagnosis: ["한정승인자가진단", "상속포기자가진단"],
    relatedTools: ["inheritance-renunciation-deadline"],
    sections: {
      problem: [
        "장례와 정리하느라 시간이 흘러, 상속포기·한정승인 3개월 기한을 넘긴 뒤에야 채무 문제를 알게 되는 상담이 많습니다.",
      ],
      summary: [
        "상속포기·한정승인은 원칙적으로 3개월 이내 신고가 필요합니다.",
        "기한을 넘기면 단순승인으로 추정될 수 있어 채무 대응이 어려워집니다.",
        "상속등기는 별도 기한·과태료 규정이 있어 방치 시 불이익이 생길 수 있습니다.",
        "이미 기한이 지났어도 가능한 조치가 있는지 사안별로 확인해야 합니다.",
      ],
      procedure: [
        "사망일·상속인 지위 안 날짜 확인",
        "3개월·상속등기 기한 각각 계산",
        "단순승인 추정 여부·채무 현황 점검",
        "가능한 법적 조치·등기 진행 방향 상담",
      ],
      documents: [
        "사망신고 기록·가족관계증명서",
        "채무·재산 확인 자료",
        "기존 제출·신고 서류(있는 경우)",
      ],
      caution: [
        "기한 경과 후에도 모든 경우에 복구가 되는 것은 아닙니다.",
        "채권자가 이미 추심을 시작했을 수 있습니다.",
        "빠르게 전문가와 상황을 공유하는 것이 중요합니다.",
      ],
      faq: [
        {
          question: "3개월이 지나면 무조건 채무를 져야 하나요?",
          answer:
            "단순승인 추정 등 법적 상태가 달라질 수 있습니다. 즉시 상황을 정리해 대응 방향을 찾아야 합니다.",
        },
        {
          question: "상속등기 과태료는 언제부터 나오나요?",
          answer:
            "일정 기간 경과 후 신고·등기를 하지 않으면 과태료 대상이 될 수 있습니다. 개별 계산이 필요합니다.",
        },
      ],
    },
    cta: {
      title: "기한이 지났다면 먼저 연락 주세요",
      description:
        "부산·해운대에서 가능한 조치부터 빠르게 짚어 드립니다. 채무 자료가 없어도 상담 가능합니다.",
    },
  },
  {
    title: "상속등기 필요서류 한눈에 보기",
    slug: "inheritance-registration-documents-checklist",
    description:
      "상속등기 신청 시 일반적으로 필요한 서류와 공동상속·부동산 유형별 추가 서류를 정리합니다.",
    category: "상속 안내",
    tags: ["상속등기 서류", "필요서류", ...BUSAN_TAGS],
    searchIntent: "documents",
    date: "2026-03-01",
    area: "부산",
    seoTitle: "상속등기 필요서류 목록｜부산 법무사",
    seoDescription:
      "상속등기 공통·추가 서류, 공동상속·근저당 있는 경우. 해운대·센텀 상속등기 상담.",
    relatedServices: ["inheritance-registration"],
    relatedFaqs: ["who-needs-inheritance-registration", "inheritance-registration-with-mortgage"],
    relatedDiagnosis: ["상속등기자가진단"],
    relatedTools: ["real-estate-documents-check"],
    relatedGlossary: ["inheritance-registration", "mortgage"],
    sections: {
      problem: [
        "상속등기를 알아보다 보면 가족관계증명서·인감증명서 외에도 분할협의서·토지·건물 대장 등 종류가 많아 무엇부터 준비해야 할지 막막합니다.",
      ],
      summary: [
        "공통: 피상속인·상속인 가족관계증명서, 인감증명서, 주민등록초본 등",
        "공동상속: 상속재산분할협의서가 일반적으로 필요합니다.",
        "부동산: 등기권리증·토지·건물 대장, 근저당이 있으면 말소 서류 또는 승계 정리",
        "사망 시점·상속인 구성에 따라 추가 서류가 달라집니다.",
      ],
      procedure: [
        "상속인·피상속인 관계 확인",
        "등기 대상 부동산·권리 조사",
        "공통 서류 발급",
        "분할협의·특수 사항 서류 준비",
        "등기 신청·수수료 납부",
      ],
      documents: [
        "피상속인 기본증명서·가족관계증명서·혼인관계증명서(해당 시)",
        "상속인 인감증명서·신분증",
        "상속재산분할협의서",
        "등기권리증 또는 등기부등본",
        "토지·건물 대장, 국세·지방세 완납증명(해당 시)",
      ],
      caution: [
        "발급일 기한이 있는 서류는 등기 신청 시점에 유효해야 합니다.",
        "등기권리증을 분실했으면 재발급 절차가 필요합니다.",
        "임대차·근저당이 있으면 별도 확인이 필요합니다.",
      ],
      faq: [
        {
          question: "서류를 대신 발급받을 수 있나요?",
          answer:
            "위임을 받으면 일부 서류는 대리 발급이 가능합니다. 법무사 상담 시 목록을 정리해 드립니다.",
        },
        {
          question: "FAQ와 뭐가 다른가요?",
          answer:
            "이 글은 상속등기 신청 직전 체크리스트에 가깝습니다. 비용·기한은 FAQ와 업무 안내 페이지를 함께 보시면 됩니다.",
        },
      ],
    },
    cta: {
      title: "우리 가족에 맞는 서류 목록을 드립니다",
      description:
        "부산·해운대·센텀에서 상속 구성에 맞춰 필요 서류만 골라 안내해 드립니다.",
    },
  },
  {
    title: "부산 상속등기 상담 전 준비사항",
    slug: "busan-inheritance-consultation-prep",
    description:
      "부산·해운대·센텀에서 상속등기 상담을 받기 전에 준비하면 시간을 절약할 수 있는 자료와 질문 목록을 정리합니다.",
    category: "상속 안내",
    tags: ["상속 상담", "부산 상속등기", ...BUSAN_TAGS],
    searchIntent: "consultation",
    date: "2026-03-08",
    area: "부산",
    region: "해운대구",
    seoTitle: "부산 상속등기 상담 전 준비｜해운대 법무사",
    seoDescription:
      "부산 상속등기 상담 시 가져올 서류·확인 질문. 센텀·해운대 다옴법무사사무소 방문·전화 상담.",
    relatedServices: ["inheritance-registration", "qualified-acceptance"],
    relatedFaqs: ["how-to-book-consultation-faq", "inheritance-registration-cost"],
    relatedDiagnosis: ["상속등기자가진단"],
    relatedSituations: ["parent-passed-away"],
    sections: {
      problem: [
        "부산에서 상속등기 법무사를 찾았지만, 상담 한 번에 끝내려면 무엇을 미리 준비해야 할지 몰라 연락을 미루는 경우가 많습니다.",
      ],
      summary: [
        "최소한 사망일, 상속인 구성, 부동산 유무·소재지를 알고 오시면 상담이 빠릅니다.",
        "등기부등본·가족관계증명서가 있으면 지분·서류 방향을 바로 잡을 수 있습니다.",
        "채무가 걱정되면 확인한 금융·세금 자료를 함께 가져오세요.",
        "상담 목표(등기만·분할협의·한정승인 등)를 정해 오시면 좋습니다.",
      ],
      procedure: [
        "전화·온라인으로 상담 예약",
        "기본 사실관계 정리(사망일, 상속인, 재산)",
        "가능한 서류 사진·스캔 준비",
        "상담 후 서류 발급·등기 일정 확정",
      ],
      documents: [
        "가족관계증명서(있으면)",
        "부동산 등기부등본(있으면)",
        "상속인 연락처 목록",
        "채무 관련 자료(있으면)",
      ],
      caution: [
        "서류가 없어도 1차 상담은 가능합니다.",
        "여러 상속인이 관여하면 대표 연락창구를 정하는 것이 좋습니다.",
        "상담 내용은 개별 사안에 따라 달라집니다.",
      ],
      faq: [
        {
          question: "해운대·센텀에서 방문 상담이 가능한가요?",
          answer:
            "다옴법무사사무소는 해운대구 센텀동에 있으며, 전화·카카오 상담도 가능합니다.",
        },
        {
          question: "비용은 상담 때 바로 나오나요?",
          answer:
            "재산 구성·상속인 수에 따라 달라 대략 범위를 안내해 드립니다. 자세한 보수는 사안 확인 후 설명합니다.",
        },
      ],
    },
    cta: {
      title: "준비 없이도 먼저 연락 주세요",
      description:
        "부산·해운대·센텀에서 상속등기·한정승인 방향을 1차 상담으로 정리해 드립니다. [상담 예약](/contact)",
    },
  },
];
