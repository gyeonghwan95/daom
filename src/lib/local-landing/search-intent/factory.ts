import type { ServiceFaq } from "@/types/service";
import type { SearchIntentContent, SearchIntentSeed } from "./types";

const OFFICE =
  "다옴법무사사무소(해운대·센텀)는 부산 전역 의뢰인의 등기·상속·법인·개인회생 상담을 진행합니다.";

const LAWYER_SCOPE_FAQ: ServiceFaq = {
  question: "법무사와 변호 업무는 어떻게 다른가요?",
  answer:
    "법무사는 변호 업무를 수행하는 직역은 아니며, 사건의 성격에 따라 적절한 전문가를 선택하는 것이 중요합니다. 등기·비송과 소송·방어가 필요한 절차는 범위가 다를 수 있으니, 상담 시 사건 성격부터 확인하는 것이 좋습니다.",
};

function baseFaqs(seed: SearchIntentSeed): ServiceFaq[] {
  const k = seed.label;
  const faqs: ServiceFaq[] = [
    {
      question: `${k} 검색 시 무엇을 먼저 확인해야 하나요?`,
      answer: `${k}는 보통 ‘견적만’이 아니라 서류·기한·관할·업무 범위가 맞는지 함께 보는 편이 안전합니다. ${seed.focus} 관점으로 필요 절차와 준비물을 먼저 정리해 보세요.`,
    },
    {
      question: "법무사 수임료만 비교하면 되나요?",
      answer:
        "수임료와 등록면허세·취득세·국민주택채권 등 공과금·실비를 구분해 확인하는 것이 좋습니다. 최저 견적만 보면 보정·재접수·추가 서류 비용이 커질 수 있습니다.",
    },
    {
      question: "상담 전에 어떤 서류를 준비하면 좋나요?",
      answer: `${seed.focus}에 맞는 등기부·계약서·가족관계·법인 결의서류 등 핵심 자료를 준비하면 상담이 구체적입니다. 자료가 없어도 상황만 먼저 문의하실 수 있습니다.`,
    },
    {
      question: "부산에서 등기·신고는 어디서 하나요?",
      answer:
        "부동산 소재지·법인 본점·사건 유형에 따라 관할 등기소·법원이 달라집니다. 남부산·북부산·중부산·부산진 등기소와 부산가정법원·회생법원 등을 사건별로 확인합니다.",
    },
    {
      question: "처리 기간은 얼마나 걸리나요?",
      answer:
        "사건 유형·서류 완성도·보정 여부에 따라 달라집니다. 접수 전 준비 기간과 접수 후 처리 기간을 구분해 안내받는 것이 좋습니다.",
    },
    {
      question: "혼자 진행과 법무사 대행의 차이는 무엇인가요?",
      answer:
        "직접 하시면 비용은 줄일 수 있으나 서류 누락·기한·보정 대응 부담이 큽니다. 법무사에게 맡기면 신청서·첨부서류·전자신청·보정 안내를 체계적으로 진행하는 데 도움이 됩니다.",
    },
    {
      question: `${k} 관련해 자주 하는 실수는 무엇인가요?`,
      answer: `${seed.focus}에서 흔한 실수는 기한 착오, 서류 미비, 관할 오인, 비용 항목 혼동입니다. 아래 ‘자주 하는 실수’ 섹션과 체크리스트를 참고하세요.`,
    },
    {
      question: "전화·카카오톡 상담도 가능한가요?",
      answer:
        "가능합니다. 방문은 예약 후 이용해 주시고, 급한 서류·기한 확인은 전화·카카오톡·네이버 톡톡으로 먼저 문의해 주세요.",
    },
  ];

  if (seed.includeLawyerScopeFaq) {
    faqs.splice(3, 0, LAWYER_SCOPE_FAQ);
  }

  return faqs.slice(0, seed.includeLawyerScopeFaq ? 9 : 8);
}

function defaultSearchIntents(seed: SearchIntentSeed): string[] {
  return [
    `${seed.label}를 검색하며 비용·서류·기간을 한눈에 보려는 경우`,
    `${seed.focus} 전에 준비물을 확인하려는 경우`,
    "직접 할지 법무사에게 맡길지 비교하려는 경우",
    "부산 관할 등기소·법원 위치를 확인하려는 경우",
    "후기·추천보다 절차와 위험을 먼저 알고 싶은 경우",
    "급하게 기한이 있어 상담 순서를 잡으려는 경우",
  ];
}

function defaultWhenNeeded(seed: SearchIntentSeed): string[] {
  return [
    `${seed.focus} 절차를 시작하기 전 전체 흐름을 잡고 싶을 때`,
    "필요서류·예상 비용·처리 기간을 미리 확인해야 할 때",
    "등기부·계약서·가족관계 등 자료를 어디서부터 모을지 모를 때",
    "보정·반려·기한 도과 위험이 걱정될 때",
    "관할·접수 방법(창구·전자신청)을 확인해야 할 때",
  ];
}

function defaultDocuments(seed: SearchIntentSeed): string[] {
  switch (seed.serviceSlug) {
    case "inheritance-registration":
    case "inheritance-renunciation":
    case "qualified-acceptance":
      return [
        "피상속인 기본증명서·가족관계증명서·혼인관계증명서",
        "상속인별 인감증명서·인감도장(협의서 작성 시)",
        "부동산 등기부등본·건축물대장·토지대장",
        "상속재산분할협의서(해당 시)",
        "채무·금융자료(포기·한정승인 검토 시)",
      ];
    case "corporate-registration":
    case "company-establishment":
    case "director-change":
      return [
        "법인 등기사항전부증명서·정관",
        "주주총회·이사회 의사록(해당 시)",
        "취임·사임 승낙서, 인감·주민등록등본",
        "본점 소재지 증빙(이전 시)",
        "과태료·기한 관련 메모",
      ];
    case "personal-rehabilitation":
    case "bankruptcy":
      return [
        "신분증·주민등록등본",
        "소득·재산·부채 목록",
        "급여명세서·통장거래내역",
        "임대차·부동산·차량 관련 서류",
        "채권자 목록·독촉장(있는 경우)",
      ];
    case "ownership-transfer":
    case "real-estate-registration":
    default:
      return [
        "부동산 등기부등본(최신)",
        "매매·증여·임대 등 원인 계약서",
        "신분증·인감증명서(해당 시)",
        "취득세·등록면허세 관련 고지·메모",
        "건축물·토지 대장 등 공부 서류",
      ];
  }
}

function defaultProcedures(seed: SearchIntentSeed): string[] {
  return [
    `${seed.focus} 목표와 관할(등기소·법원)을 확인합니다.`,
    "등기부·공부·계약·가족관계 등 기초 서류를 수집합니다.",
    "필요 등기·신고 유형과 비용을 항목별로 구분합니다.",
    "신청서·첨부서류를 작성하고 전자신청 또는 창구 접수를 진행합니다.",
    "보정 통지가 있으면 기한 내 보완하고 완료·등기필정보를 확인합니다.",
  ];
}

function defaultMistakes(seed: SearchIntentSeed): string[] {
  return [
    "수임료와 공과금을 구별하지 않고 총액만 비교하는 경우",
    "관할 등기소·법원을 확인하지 않고 접수하는 경우",
    "기한(상속 3개월, 임원변경 등)을 놓치는 경우",
    "등기부·공부상 표시와 계약 내용이 다른데도 그대로 진행하는 경우",
    "보정 통지 후 기한을 넘기거나 연락이 끊기는 경우",
    `${seed.focus} 관련 서류를 일부만 준비해 재접수하는 경우`,
  ];
}

function relatedFor(seed: SearchIntentSeed): Pick<
  SearchIntentContent,
  "relatedCaseLinks" | "relatedServiceLinks" | "relatedGuideLinks"
> {
  const relatedCaseLinks = seed.caseHref
    ? [{ href: seed.caseHref, label: seed.caseLabel ?? "관련 사례" }]
    : [];

  const relatedServiceLinks = [
    {
      href: `/services/${seed.serviceSlug}`,
      label: "관련 업무 안내",
    },
    ...(seed.diagnosisHref
      ? [
          {
            href: seed.diagnosisHref,
            label: seed.diagnosisLabel ?? "자가진단",
          },
        ]
      : [{ href: "/자가진단", label: "업무별 자가진단" }]),
    ...(seed.toolHref
      ? [{ href: seed.toolHref, label: seed.toolLabel ?? "법률 계산기" }]
      : [{ href: "/tools", label: "법률 계산기" }]),
    ...(seed.glossaryHref
      ? [
          {
            href: seed.glossaryHref,
            label: seed.glossaryLabel ?? "용어사전",
          },
        ]
      : [{ href: "/glossary", label: "법률 용어사전" }]),
    { href: "/faq", label: "FAQ" },
    { href: "/부산법무사", label: "부산 법무사" },
  ];

  const relatedGuideLinks = [
    { href: "/search-guides", label: "검색의도 안내 허브" },
    { href: "/부산법무사추천", label: "법무사 선택 기준" },
    { href: "/부산법무사상담", label: "상담 준비" },
    { href: "/contact", label: "상담 문의" },
  ];

  return { relatedCaseLinks, relatedServiceLinks, relatedGuideLinks };
}

/** Build full search-intent page content from a seed */
export function buildSearchIntentContent(
  seed: SearchIntentSeed,
): SearchIntentContent {
  const title = seed.label;
  const metaTitle = `${seed.label}｜다옴법무사사무소`;
  const metaDescription = `${seed.label} 검색 안내. ${seed.focus} 기준의 준비서류·절차·자주 하는 실수·FAQ를 정리했습니다. 해운대·센텀 다옴법무사사무소.`;

  return {
    slug: seed.slug,
    category: seed.category,
    title,
    metaTitle,
    metaDescription,
    h1: `${seed.label} — 상담 전 확인 가이드`,
    eyebrow: "검색의도 안내",
    heroParagraphs: [
      `${seed.label} 검색 시, 키워드만 보고 결정하기보다 ${seed.focus}에 맞는 서류·기한·관할·비용을 먼저 확인하는 것이 안전합니다.`,
      OFFICE,
      "이 페이지는 특정 사무소를 ‘추천’하거나 전문 자격을 단정하지 않습니다. 실제 고객 검색 의도를 바탕으로 상담 전 체크포인트를 정리한 안내입니다.",
    ],
    summaryBullets: [
      `${seed.label}는 ${seed.focus}를 중심으로 서류·절차·비용을 함께 봅니다.`,
      "수임료와 공과금·실비를 구분해 비교하세요.",
      "관할·기한·보정 대응을 놓치면 기간과 비용이 늘어날 수 있습니다.",
      "아래 준비서류·절차·실수 모음을 체크한 뒤 상담하시면 빠릅니다.",
      "자가진단·FAQ·사례 페이지와 함께 보시면 비교가 쉽습니다.",
    ],
    primaryKeywords: seed.keywords,
    searchIntents: defaultSearchIntents(seed),
    whenNeeded: defaultWhenNeeded(seed),
    documents: defaultDocuments(seed),
    documentsNote:
      "서류는 사건마다 달라질 수 있습니다. 목록은 상담 전 체크용이며, 확정 안내는 자료를 확인한 뒤 드립니다.",
    procedures: defaultProcedures(seed),
    commonMistakes: defaultMistakes(seed),
    faqs: baseFaqs(seed),
    ...relatedFor(seed),
    bottomCtaText: `${seed.label} 관련해 서류·기간·비용이 궁금하시면 전화·카카오톡으로 문의해 주세요. 상황을 들으며 다음 절차를 안내해 드립니다.`,
    serviceSlug: seed.serviceSlug,
  };
}
