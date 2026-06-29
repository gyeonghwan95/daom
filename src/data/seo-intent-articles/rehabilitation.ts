import type { SeoIntentArticle } from "./types";

const BUSAN_TAGS = ["부산 법무사", "해운대 법무사", "센텀 법무사"];

export const rehabilitationSeoIntentArticles: SeoIntentArticle[] = [
  {
    title: "개인회생 상담 전 준비서류",
    slug: "personal-rehabilitation-consultation-documents",
    description:
      "개인회생 신청을 검토할 때 상담 전에 준비하면 좋은 소득·채무·재산 서류 목록을 정리합니다.",
    category: "회생·파산",
    tags: ["개인회생", "준비서류", ...BUSAN_TAGS],
    searchIntent: "preparation-documents",
    date: "2026-01-22",
    area: "부산",
    seoTitle: "개인회생 상담 전 준비서류｜부산 법무사",
    seoDescription:
      "개인회생 소득·채무·재산 서류. 부산회생법원 신청 전 상담. 해운대·센텀.",
    relatedServices: ["personal-rehabilitation"],
    relatedFaqs: ["personal-rehabilitation-documents-faq", "personal-rehabilitation-eligibility-faq"],
    relatedDiagnosis: ["개인회생자가진단"],
    relatedSituations: ["personal-rehabilitation-bankruptcy"],
    relatedTools: ["rehab-income-debt-check"],
    sections: {
      problem: [
        "개인회생을 알아보지만 어떤 서류를 먼저 준비해야 하고, 소득이 들쭉날쭉하거나 사업자인 경우 무엇이 다른지 막막합니다.",
      ],
      summary: [
        "최근 소득·채무 목록·재산·가족 관계를 파악하는 것이 출발점입니다.",
        "급여소득자·자영업자·프리랜서별 필요 서류가 다릅니다.",
        "모든 서류가 처음부터 완벽하지 않아도 1차 상담은 가능합니다.",
        "채권자 수·총 채무액·담보 여부가 전략에 영향을 줍니다.",
      ],
      procedure: [
        "채무·채권자 목록 작성",
        "소득 증빙 수집(급여·사업소득)",
        "재산·임차·보증금 정리",
        "상담 후 부족 서류 보완",
        "신청서·개시 결정 절차",
      ],
      documents: [
        "신분증·주민등록등본·가족관계증명서",
        "급여명세·소득금액증명·사업소득 자료",
        "채무확인서·대출약정·카드내역",
        "등기부·예금·보험·차량 관련 자료",
      ],
      caution: [
        "최근 대출·재산 처분은 신중히 해야 합니다.",
        "허위·누락 신고는 불이익이 있습니다.",
        "기존 '신청 전' 안내 글과 함께 보시면 준비서류에 더 초점이 맞춰져 있습니다.",
      ],
      faq: [
        {
          question: "기존 블로그 글과 다른가요?",
          answer: "신청 전 일반 안내 글이 있다면, 이 글은 상담 시 가져올 서류 체크리스트에 가깝습니다.",
        },
        {
          question: "부산회생법원 사건인가요?",
          answer: "주소지 관할 법원이 정해집니다. 부산 거주자는 부산회생법원 관할일 수 있습니다.",
        },
      ],
    },
    cta: {
      title: "서류 일부만 있어도 상담 가능합니다",
      description: "해운대·센텀에서 개인회생 가능성·준비 순서를 안내합니다.",
    },
  },
  {
    title: "개인파산과 면책의 차이",
    slug: "bankruptcy-vs-discharge-difference",
    description:
      "개인파산 절차와 면책 결정의 의미, 개인회생과의 차이를 이해하기 쉽게 정리합니다.",
    category: "회생·파산",
    tags: ["개인파산", "면책", ...BUSAN_TAGS],
    searchIntent: "faq",
    date: "2026-01-29",
    area: "부산",
    seoTitle: "개인파산과 면책 차이｜부산 법무사",
    seoDescription:
      "개인파산 절차·면책 효과·개인회생 비교. 부산회생법원 상담.",
    relatedServices: ["bankruptcy", "personal-rehabilitation"],
    relatedFaqs: ["bankruptcy-discharge-faq", "bankruptcy-vs-rehabilitation-faq"],
    relatedDiagnosis: ["개인파산자가진단", "개인회생자가진단"],
    relatedGlossary: ["personal-bankruptcy", "discharge"],
    sections: {
      problem: [
        "파산을 신청하면 채무가 바로 없어지는지, 면책과 파산이 같은 말인지 헷갈리는 분이 많습니다.",
      ],
      summary: [
        "개인파산은 법원 절차를 통해 재산·채무를 정리하는 제도입니다.",
        "면책은 파산 절차 안에서 남은 채무를 면제받는 결정입니다.",
        "모든 채무가 자동 면책되는 것은 아닙니다.",
        "개인회생은 일정 채무를 분할 변제하는 다른 제도입니다.",
      ],
      procedure: [
        "파산·면책 가능성 상담",
        "신청서·채권자 목록 제출",
        "개시·재산 조사",
        "면책 심리·결정",
      ],
      documents: [
        "소득·채무·재산 목록",
        "신분증·주민등록등본",
        "채권자별 채무 증빙",
      ],
      caution: [
        "최근 고액 지출·재산 은닉은 면책 불허가 사유가 될 수 있습니다.",
        "담보·세금·일부 채무는 별도 규정이 있습니다.",
      ],
      faq: [
        {
          question: "면책되면 모든 빚이 사라지나요?",
          answer: "면책 범위에서 면제됩니다. 예외 채무는 별도입니다.",
        },
        {
          question: "개인회생과 동시에 고려할 수 있나요?",
          answer: "상황에 따라 하나를 선택합니다. 비교 상담이 필요합니다.",
        },
      ],
    },
    cta: {
      title: "파산·회생 방향을 비교해 드립니다",
      description: "부산·해운대에서 채무·소득에 맞는 제도를 안내합니다.",
    },
  },
  {
    title: "채권추심이 올 때 대응",
    slug: "debt-collection-response-guide",
    description:
      "채권추심 전화·방문·내용증명을 받았을 때 확인할 권리와 개인회생·파산 검토 시점을 정리합니다.",
    category: "회생·파산",
    tags: ["채권추심", "개인회생", ...BUSAN_TAGS],
    searchIntent: "consultation",
    date: "2026-02-06",
    area: "부산",
    seoTitle: "채권추심 대응 방법｜부산 법무사",
    seoDescription:
      "추심 전화·방문 대응, 채무조정·개인회생. 해운대·센텀 채무 상담.",
    relatedServices: ["personal-rehabilitation", "bankruptcy"],
    relatedFaqs: ["personal-rehabilitation-credit-faq"],
    relatedDiagnosis: ["개인회생자가진단", "개인파산자가진단"],
    sections: {
      problem: [
        "추심 전화가 잦아지거나, 직장·가족에게 연락이 간다는 말을 들어 불안해 상담하는 경우가 많습니다.",
      ],
      summary: [
        "추심에는 법적 한계가 있습니다. 불법 추심은 신고 대상입니다.",
        "채무 전체를 파악하고 우선순위를 정하는 것이 중요합니다.",
        "개인회생·파산 신청 시 금지명령 등 효과가 있을 수 있습니다.",
        "감정적 대응보다 기록·상담이 도움이 됩니다.",
      ],
      procedure: [
        "채권자·금액·담보 목록 작성",
        "추심 내용 기록(날짜·내용)",
        "불법 추심 여부 확인",
        "채무조정·회생·파산 상담",
      ],
      documents: [
        "대출·카드·채무확인서",
        "추심 문자·녹취·내용증명",
        "소득·재산 자료",
      ],
      caution: [
        "추심 업체에 무조건 입금 약속하지 마세요.",
        "새 대출로 막는 방식은 위험할 수 있습니다.",
      ],
      faq: [
        {
          question: "추심이 오면 바로 파산해야 하나요?",
          answer: "반드시 그렇지는 않습니다. 채무 규모·소득에 따라 회생이 맞을 수 있습니다.",
        },
        {
          question: "직장에 연락 오면요?",
          answer: "불법 추심에 해당할 수 있습니다. 기록 후 상담하세요.",
        },
      ],
    },
    cta: {
      title: "추심 대응·채무 정리 상담",
      description: "부산·해운대에서 긴급 상황부터 차분히 짚어 드립니다.",
    },
  },
  {
    title: "급여소득자 개인회생 가능성",
    slug: "salaried-worker-rehabilitation-eligibility",
    description:
      "직장인·급여소득자가 개인회생을 검토할 때 소득 기준·채무 한도·생계비를 중심으로 가능성을 정리합니다.",
    category: "회생·파산",
    tags: ["급여소득자", "개인회생", ...BUSAN_TAGS],
    searchIntent: "faq",
    date: "2026-02-13",
    area: "부산",
    seoTitle: "급여소득자 개인회생 가능성｜부산 법무사",
    seoDescription:
      "직장인 개인회생 소득·채무 기준. 부산회생법원. 해운대·센텀 상담.",
    relatedServices: ["personal-rehabilitation"],
    relatedFaqs: ["personal-rehabilitation-eligibility-faq", "personal-rehabilitation-duration-faq"],
    relatedDiagnosis: ["개인회생자가진단"],
    relatedTools: ["rehab-income-debt-check"],
    sections: {
      problem: [
        "월급은 받는데 카드·대출 이자가 버거워 개인회생이 가능한지, 직장에 알려지는지 걱정하는 상담이 많습니다.",
      ],
      summary: [
        "급여소득자도 개인회생 신청이 가능한 경우가 많습니다.",
        "가용소득·변제계획·채무 총액이 핵심입니다.",
        "담보채무·세금·최근 채무는 별도 검토가 필요합니다.",
        "개시 후 추심 중단 효과를 기대하는 경우가 많습니다.",
      ],
      procedure: [
        "소득·채무·가족 수 정리",
        "자가진단·상담",
        "변제계획안 초안",
        "신청·개시·인가",
      ],
      documents: [
        "급여명세·원천징수·소득금액증명",
        "채무확인서",
        "가족관계·주민등록등본",
      ],
      caution: [
        "소득이 높으면 변제액이 커질 수 있습니다.",
        "최근 고액 현금서비스는 설명이 필요할 수 있습니다.",
      ],
      faq: [
        {
          question: "회사에 통지되나요?",
          answer: "절차상 채권자 통지 등이 있습니다. 세부는 사안별로 설명드립니다.",
        },
        {
          question: "부산 직장인도 같은 기준인가요?",
          answer: "개인회생 제도는 전국 공통입니다.",
        },
      ],
    },
    cta: {
      title: "급여소득자 맞춤 가능성 검토",
      description: "해운대·센텀에서 소득·채무 자료로 1차 검토해 드립니다.",
    },
  },
  {
    title: "사업자 개인회생 상담 전 확인사항",
    slug: "business-owner-rehabilitation-pre-check",
    description:
      "자영업·개인사업자가 개인회생을 검토할 때 소득 산정·사업장·부가채무를 확인할 항목을 정리합니다.",
    category: "회생·파산",
    tags: ["사업자", "개인회생", ...BUSAN_TAGS],
    searchIntent: "consultation",
    date: "2026-02-20",
    area: "부산",
    seoTitle: "사업자 개인회생 상담 전 확인｜부산 법무사",
    seoDescription:
      "자영업 개인회생 소득·사업채무·부가세. 해운대·센텀 사업자 회생 상담.",
    relatedServices: ["personal-rehabilitation", "bankruptcy"],
    relatedFaqs: ["personal-rehabilitation-documents-faq", "who-can-file-bankruptcy-faq"],
    relatedDiagnosis: ["개인회생자가진단"],
    relatedTools: ["rehab-income-debt-check"],
    sections: {
      problem: [
        "매출은 있는데 경비·세금·대출 이자 때문에 순이익이 없어 개인회생을 검토하는 사업자 상담이 많습니다.",
      ],
      summary: [
        "사업소득 산정은 장부·신고·실제 흐름을 봅니다.",
        "사업용 계좌·부가세·4대보험·임대료가 함께 정리됩니다.",
        "개인 채무와 사업 채무 구분이 중요합니다.",
        "폐업·계속 영업 여부도 전략에 영향을 줍니다.",
      ],
      procedure: [
        "사업자등록·장부·신고 현황 정리",
        "개인·사업 채무 목록화",
        "소득·지출 3~12개월 흐름 확인",
        "회생·파산·워크아웃 비교 상담",
      ],
      documents: [
        "사업자등록증·부가세·종합소득 신고",
        "통장 거래·매출·경비 자료",
        "대출·카드·개인 채무 증빙",
        "임대차·직원 관련 서류",
      ],
      caution: [
        "현금 거래 비중이 크면 소득 입증이 어려울 수 있습니다.",
        "사업 재산·재고·보증도 함께 봐야 합니다.",
      ],
      faq: [
        {
          question: "사업을 계속할 수 있나요?",
          answer: "개인회생 인가 후에도 영업이 가능한 경우가 많습니다. 사안별로 다릅니다.",
        },
        {
          question: "센텀·해운대 소상공인도 같은가요?",
          answer: "제도는 같고, 소득·채무 자료 정리가 핵심입니다.",
        },
      ],
    },
    cta: {
      title: "사업자 채무, 자료부터 정리해 보세요",
      description: "부산·센텀에서 사업자 개인회생·파산 방향을 안내합니다.",
    },
  },
];
