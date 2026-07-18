import { getAllContent } from "@/lib/content/loader";
import { consultationCopy } from "@/lib/consultation";
import { lawyerProfileMeta } from "@/lib/lawyer-profile";
import { officeLocation } from "@/lib/office-location";
import { getServiceBySlug } from "@/lib/services-data";
import { normalizeRouteSlug } from "@/lib/seo/slug";
import type { LocalLandingConfig, LocalLandingPage } from "@/types/local-landing";
import type { ServiceFaq } from "@/types/service";
import { getLocalLandingConfig, localLandingConfigs } from "./config";
import { districtProfiles, serviceLabels } from "./districts";
import { buildExpansionLandingPage } from "./expansion/builder-expansion";
import { buildKeywordHubPage } from "./keyword-builder";
import { buildNeighborhoodHubPage } from "./neighborhood-hub-builder";
import { buildPreservationRegistrationPage } from "./preservation-registration-builder";
import { buildPublicAgencyRegistrationPage } from "./public-agency-registration-builder";
import { buildSelectionHubPage } from "./selection-builder";
import { buildLecturePage } from "@/lib/lectures/builder";
import { buildBusinessPage } from "@/lib/business/builder";
import { buildB2BCollaborationPage } from "@/lib/b2b/builder";
import { buildSearchIntentPage } from "./search-intent-builder";

const legalIssuesByService: Record<string, string[]> = {
  "inheritance-registration": [
    "상속인 수·협의 여부에 따라 필요 서류와 소요 기간이 달라집니다.",
    "등기부상 저당권·가압류가 있으면 채권자 협의 또는 정리가 선행되어야 합니다.",
    "상속 개시 후 3개월 신고 기한과 과태료 리스크를 함께 검토해야 합니다.",
    "해외 거주 상속인이 있으면 위임·인증 절차가 추가될 수 있습니다.",
  ],
  "inheritance-renunciation": [
    "상속 개시 사실을 안 날로부터 3개월 내 신고하지 않으면 단순승인될 수 있습니다.",
    "상속포기 시 상속 순위가 다음 상속인에게 넘어가는 점을 가족과 사전에 조율해야 합니다.",
    "채무 규모를 정확히 파악하지 못한 상태에서의 결정은 되돌리기 어렵습니다.",
    "공동상속인 중 일부만 포기하는 경우와 전원 포기의 효과가 다릅니다.",
  ],
  "qualified-acceptance": [
    "상속재산 한도 내에서만 채무를 변제하므로 재산·채무 목록 작성이 핵심입니다.",
    "한정승인과 단순승인·상속포기의 선택 시점이 좁아 실무상 서두르는 경우가 많습니다.",
    "부동산·예금·보험 등 재산 조사 누락 시 추후 분쟁 소지가 있습니다.",
    "상속등기와 병행 일정을 맞추지 않으면 권리 행사가 지연될 수 있습니다.",
  ],
  "company-establishment": [
    "정관·임원·본점 주소 등 기재 사항 오류는 설립 후 정정 등기 비용을 키웁니다.",
    "자본금 납입·임원 자격 요건을 충족하지 않으면 보정이 발생합니다.",
    "설립 등기 후 사업자등록·법인 계좌 등 후속 절차 일정이 겹칠 수 있습니다.",
    "업종·목적 변경이 잦은 사업은 정관 설계 단계에서 여지를 두는 것이 좋습니다.",
  ],
  "director-change": [
    "취임·퇴임·주소변경 등 변경 사유마다 필요 서류가 다릅니다.",
    "등기 지연 시 과태료가 부과될 수 있어 변경 결의 후 신속한 접수가 필요합니다.",
    "대표이사와 이사 변경이 동시에 이뤄지면 인감·계좌 변경도 함께 검토해야 합니다.",
    "주주총회·이사회 결의 요건을 정관과 대조하지 않으면 반려될 수 있습니다.",
  ],
  "real-estate-registration": [
    "매매·증여·상속 등 원인별로 필요 서류와 세금 부담이 달라집니다.",
    "전세권·근저당 등 기존 권리 관계를 등기부에서 먼저 확인해야 합니다.",
    "취득세·등록면허세 등 세무 신고 기한과 등기 접수 순서를 맞춰야 합니다.",
    "공동명의·지분이전은 협의서와 지분 비율 기재가 정확해야 합니다.",
  ],
  "corporate-registration": [
    "본점 이전·목적 변경·증자 등 사건마다 결의 기관과 첨부 서류가 다릅니다.",
    "법인 인감·계좌·계약서에 사용 중인 등기 정보와 실제 등기부가 불일치하면 분쟁이 생깁니다.",
    "지연 등기는 과태료와 거래 상대방의 신뢰도 하락으로 이어질 수 있습니다.",
    "정관과 등기부 현황을 주기적으로 대조하는 것이 안전합니다.",
  ],
  "ownership-transfer": [
    "매매대금·잔금 일정과 등기 접수 시점을 맞추지 않으면 분쟁이 생길 수 있습니다.",
    "취득세 신고 기한을 놓치면 가산세가 부과됩니다.",
    "특수관계인 증여는 시가 기준 과세 이슈가 있을 수 있습니다.",
    "전입신고·확정일자 등 주택 관련 후속 조치가 겹치는 경우가 많습니다.",
  ],
  "personal-rehabilitation": [
    "채무·소득·재산 현황을 정확히 기재하지 않으면 기각·폐지 사유가 됩니다.",
    "면책 범위와 변제 계획안 설계에 따라 실질 부담이 크게 달라집니다.",
    "최근 대출·카드 사용 내역은 신청 적격성 판단에 영향을 줄 수 있습니다.",
    "주택·전세보증금 등 재산 유지 여부는 사건마다 다르게 검토됩니다.",
  ],
  bankruptcy: [
    "파산은 면책과 동시에 재산 처분 절차가 진행될 수 있습니다.",
    "회생과 파산 중 어느 절차가 유리한지 소득·재산·채무 구조를 비교해야 합니다.",
    "최근 채무 변제·재산 처분 행위는 법원 심사에서 문제될 수 있습니다.",
    "가족 명의 재산·보증 채무까지 함께 점검하는 것이 안전합니다.",
  ],
};

const costGuideByService: Record<string, string> = {
  "inheritance-registration":
    "상속등기 비용은 부동산 가액·상속인 수·채권·채무 정리 여부에 따라 달라집니다. 법무사 수임료와 등기신청 수수료·세금(등록면허세 등)을 분리해 안내하며, 상담 시 예상 범위를 투명하게 설명해 드립니다.",
  "inheritance-renunciation":
    "상속포기는 가정법원 신고 사건으로, 사건 복잡도에 따라 수임료가 책정됩니다. 상속포기와 상속등기·한정승인을 함께 검토하는 경우 일괄 견적이 가능합니다.",
  "qualified-acceptance":
    "한정승인은 재산·채무 조사 범위에 따라 수임료가 달라집니다. 이후 상속등기까지 진행하는 경우 단계별 비용을 미리 안내해 드립니다.",
  "company-establishment":
    "법인설립등기는 자본금 규모·임원 수·정관 복잡도에 따라 달라집니다. 등기 완료 후 사업자등록·계좌 개설 안내까지 포함해 설명합니다.",
  "director-change":
    "임원변경등기는 변경 항목 수(대표·이사·감사·주소 등)에 따라 비용이 달라집니다. 지연 과태료를 피하기 위해 결의 후 빠른 접수를 권합니다.",
  "real-estate-registration":
    "부동산등기 비용은 거래 유형·가액·저당권 말소 여부에 따라 달라집니다. 취득세는 별도이며, 상담 시 등기 비용과 세금을 구분해 안내합니다.",
  "corporate-registration":
    "법인등기(본점이전·목적변경·증자 등)는 사건 유형별로 수임료가 다릅니다. 정관·등기부를 확인한 뒤 견적을 드립니다.",
  "ownership-transfer":
    "소유권이전등기는 부동산 가액과 말소 등기 필요 여부에 따라 달라집니다. 매매·증여·상속 원인별로 세금 부담도 함께 설명합니다.",
  "personal-rehabilitation":
    "개인회생은 채무 규모·재산·소득에 따라 수임료가 책정됩니다. 법원 납부금과 변제 계획은 별도이며, 상담 시 총 부담 구조를 설명합니다.",
  bankruptcy:
    "개인파산도 사건 복잡도에 따라 수임료가 달라집니다. 회생과 비교 상담 시 각 절차의 비용·기간·효과를 함께 안내합니다.",
};

function buildRegionFaqs(
  regionLabel: string,
  serviceLabel: string,
  neighborhoods: string[],
): ServiceFaq[] {
  const area = neighborhoods.slice(0, 3).join("·");
  return [
    {
      question: `${regionLabel}에서 ${serviceLabel} 상담은 어디서 받나요?`,
      answer: `다옴법무사사무소는 부산 해운대구 센텀에 있으며, ${regionLabel}·${area} 일대 의뢰인을 직접 상담합니다. 전화·카카오톡·방문(예약) 모두 가능합니다.`,
    },
    {
      question: `${regionLabel} ${serviceLabel} 비용은 얼마인가요?`,
      answer: `사건마다 다릅니다. 부동산 가액·채무 규모·상속인 수·법인 규모 등에 따라 달라지므로, 상담 후 항목별 견적을 안내해 드립니다.`,
    },
    {
      question: `${regionLabel} 사무소 방문 없이 진행할 수 있나요?`,
      answer: `가능한 사건은 서류를 우편·이메일·카카오톡으로 받아 원격으로 진행합니다. 다만 상속·회생 등은 상황 설명을 위해 초기 상담을 권합니다.`,
    },
    {
      question: `${regionLabel}에서 다른 구·군 부동산도 처리할 수 있나요?`,
      answer: `네. 부산 소재 사무소이지만 관할 등기소·법원이 다른 지역 사건도 대리합니다. ${regionLabel} 거주 의뢰인 사건도 수시로 진행합니다.`,
    },
  ];
}

function buildServiceRegionFaqs(
  regionLabel: string,
  serviceSlug: string,
  serviceLabel: string,
): ServiceFaq[] {
  const extras: Record<string, ServiceFaq[]> = {
    "inheritance-registration": [
      {
        question: `${regionLabel} 아파트 상속등기 기간은 얼마나 걸리나요?`,
        answer: `서류가 준비되면 보통 수 주 내외입니다. 상속인 협의·저당권 정리·보정 여부에 따라 달라집니다.`,
      },
      {
        question: `${regionLabel}에서 상속등기는 언제까지 해야 하나요?`,
        answer: `상속 개시일(사망일)부터 3개월 이내 신고·등기가 원칙입니다. 기한이 임박했으면 바로 상담해 주세요.`,
      },
      {
        question: `상속포기와 한정승인의 차이는 무엇인가요?`,
        answer: `상속포기는 상속 자체를 포기하고, 한정승인은 재산만 승인하고 채무는 한도 내에서만 부담합니다. ${regionLabel} 상속 사건도 사정에 따라 선택이 달라집니다.`,
      },
    ],
    "inheritance-renunciation": [
      {
        question: `${regionLabel}에서 상속포기 신고는 어디에 하나요?`,
        answer: `관할 가정법원에 신고합니다. 피상속인 마지막 주소지 등을 기준으로 관할이 정해집니다.`,
      },
      {
        question: `상속포기 후에도 등기가 필요한가요?`,
        answer: `상속포기를 하면 상속등기는 하지 않습니다. 이미 단순승인한 경우에는 다른 절차가 필요할 수 있습니다.`,
      },
    ],
    "qualified-acceptance": [
      {
        question: `${regionLabel} 한정승인 후 상속등기도 해야 하나요?`,
        answer: `한정승인 후에도 부동산 등 상속재산 명의 변경을 위해 상속등기가 필요한 경우가 많습니다.`,
      },
    ],
    "company-establishment": [
      {
        question: `${regionLabel} 법인설립등기 기간은?`,
        answer: `서류 준비가 되면 보통 1~2주 내외입니다. 정관·자본금 납입 확인에 따라 달라집니다.`,
      },
    ],
    "director-change": [
      {
        question: `임원변경등기 지연 과태료는 얼마인가요?`,
        answer: `변경 사유 발생 후 등기 지연 시 과태료가 부과될 수 있습니다. 결의 후 가능한 빨리 접수하는 것이 좋습니다.`,
      },
    ],
    "real-estate-registration": [
      {
        question: `${regionLabel} 부동산등기에 필요한 서류는?`,
        answer: `매매·증여·상속 등 원인에 따라 다릅니다. 등기부·계약서·인감증명서 등을 상담 시 목록으로 안내합니다.`,
      },
    ],
    "corporate-registration": [
      {
        question: `${regionLabel} 법인 본점 이전 등기 절차는?`,
        answer: `주주총회 결의·정관 변경·등기 신청 순으로 진행합니다. 사업자등록 변경도 함께 검토해야 합니다.`,
      },
    ],
    "personal-rehabilitation": [
      {
        question: `${regionLabel} 개인회생 신청 자격은?`,
        answer: `채무·소득·재산 요건을 충족해야 합니다. 최근 채무·변제 이력도 영향을 주므로 상담이 필요합니다.`,
      },
    ],
    bankruptcy: [
      {
        question: `개인회생과 파산 중 무엇이 나을까요?`,
        answer: `소득·재산·채무 구조에 따라 다릅니다. ${regionLabel} 거주 의뢰인도 두 절차를 비교 상담합니다.`,
      },
    ],
  };

  return extras[serviceSlug] ?? [
    {
      question: `${regionLabel}에서 ${serviceLabel} 절차는 어떻게 되나요?`,
      answer: `상담 → 서류 안내 → 신청·접수 → 완료 확인 순으로 진행합니다. 사건별 세부 단계는 상담 시 설명드립니다.`,
    },
  ];
}

function buildLawyerOpinion(
  regionLabel: string,
  serviceLabel: string,
  neighborhoods: string[],
): string {
  const area = neighborhoods.join(", ");
  return `${lawyerProfileMeta.fullTitle}는 ${lawyerProfileMeta.officeArea}에서 ${regionLabel}·${area} 일대 ${serviceLabel} 사건을 직접 상담·진행합니다. 법무사·공인중개사·신용관리사 자격을 갖추었고, 대한법무사협회 표창을 수상했으며 민주평화통일자문회의·부산광역시 청년정책조정위원회 등 정책 자문과 시민도서관 법률 강의 경험을 바탕으로, ${regionLabel} 의뢰인께 절차와 비용을 알기 쉽게 설명합니다. 불안한 상황일수록 ‘지금 무엇을 해야 하는지’를 먼저 정리하는 것이 중요하다고 생각합니다.`;
}

function getRelatedBlogPosts(
  serviceSlug: string,
  limit = 5,
): { href: string; label: string }[] {
  return getAllContent("blog")
    .filter(
      (post) =>
        post.relatedServices?.includes(serviceSlug) ||
        post.area?.includes("부산") ||
        post.area?.includes("해운대"),
    )
    .slice(0, limit)
    .map((post) => ({ href: post.href, label: post.title }));
}

export function buildLocalLandingPage(
  config: LocalLandingConfig,
): LocalLandingPage | null {
  const service = getServiceBySlug(config.serviceSlug);
  const district = districtProfiles[config.regionKey];
  if (!service || !district) return null;

  const serviceLabel = serviceLabels[config.serviceSlug] ?? service.title;
  const defaultSlug = normalizeRouteSlug(`${config.regionLabel}${serviceLabel}`);
  const title =
    normalizeRouteSlug(config.slug) !== defaultSlug
      ? config.slug
      : `${config.regionLabel} ${serviceLabel}`;
  const path = `/${config.slug}`;
  const neighborhoodText = [...new Set([...config.neighborhoods, ...district.neighborhoods])]
    .slice(0, 6)
    .join(", ");

  const problemStatement = `${config.regionLabel} ${neighborhoodText} 일대에서 ${serviceLabel}가 필요한 상황은 생각보다 다양합니다. ${district.context} 막상 등기소·법원 절차를 찾아보면 서류와 기한이 복잡해 막막한 경우가 많습니다. 상속·매매·법인 변경·채무 문제는 감정만으로 결정하기 어렵고, 기한을 놓치면 과태료·단순승인·권리 상실로 이어질 수 있습니다.`;

  const consultationCase = {
    title: `${config.regionLabel} ${serviceLabel} 상담 사례`,
    summary: `최근 ${config.regionLabel}에서 상담한 사례입니다. ${config.caseAngle ?? `${serviceLabel} 진행`}. 의뢰인 상황에 맞춰 필요 서류·예상 기간·비용을 단계별로 안내하고 진행했습니다.`,
    href: config.relatedCaseSlug
      ? `/services/cases/${config.relatedCaseSlug}`
      : undefined,
  };

  const consultationCases = [
    consultationCase,
    {
      title: `${config.regionLabel} 서류 준비 상담`,
      summary: `등기부·가족관계증명서를 미리 검토해 누락 서류를 줄이고 접수 일정을 맞춘 사례입니다.`,
    },
    {
      title: `${config.regionLabel} 원격 진행 사례`,
      summary: `카카오톡 상담 후 방문 없이 서류를 받아 진행한 사례입니다.`,
      href: consultationCase.href,
    },
  ];

  const legalIssues = (legalIssuesByService[config.serviceSlug] ?? []).map(
    (issue) => `${config.regionLabel} 사건에서도 ${issue}`,
  );

  const regionFaqs = buildRegionFaqs(
    config.regionLabel,
    serviceLabel,
    config.neighborhoods,
  );
  const serviceRegionFaqs = buildServiceRegionFaqs(
    config.regionLabel,
    config.serviceSlug,
    serviceLabel,
  );
  const faqs = [
    ...service.faqs,
    ...regionFaqs,
    ...serviceRegionFaqs,
  ].slice(0, 12);

  const description = `${config.regionLabel} ${serviceLabel} 실무 안내 — 다옴법무사사무소 안윤정 법무사. ${neighborhoodText} 일대 상담·서류·등기 대리. 전화·카카오톡 상담 가능.`;

  const jurisdictionGuide = {
    title: district.registryOffice ?? "부산 관할 등기소",
    address: district.registryAddress ?? "부동산·법인 소재지 기준 관할 등기소 확인 필요",
    accessNote: district.courtNote,
    jurisdictionNote:
      district.courtNote ??
      "부동산 소재지·법인 본점 주소에 따라 남부산·북부산·중부산·부산진 등기소 관할이 달라집니다.",
    practicalNotes: (legalIssuesByService[config.serviceSlug] ?? []).slice(0, 3),
  };

  const whenNeeded = [
    `${config.regionLabel}에서 ${serviceLabel}가 필요한 경우`,
    `상속·매매·법인 변경 일정이 겹쳐 순서를 정리해야 할 때`,
    `관할 등기소·법원을 확인하고 싶을 때`,
    `기한(3개월·등기 기한)이 임박했을 때`,
  ];

  const directionsNote =
    district.directionsFromOffice ??
    `다옴법무사사무소는 ${officeLocation.fullAddress}에 있습니다. ${config.regionLabel}에서 센텀시티역·벡스코 인근으로 방문하실 수 있으며, 네이버 예약 후 상담해 주세요.`;

  return {
    slug: config.slug,
    path,
    pageType: config.pageType ?? "service-region",
    serviceSlug: config.serviceSlug,
    title,
    h1: `${config.regionLabel} ${serviceLabel} 법무사 상담`,
    description,
    regionLabel: config.regionLabel,
    regionKey: config.regionKey,
    neighborhoods: config.neighborhoods,
    problemStatement,
    whenNeeded,
    jurisdictionGuide,
    consultationCase,
    consultationCases,
    legalIssues,
    precautions: [
      "관할 등기소·법원을 사전에 확인하지 않으면 접수가 지연될 수 있습니다.",
      "상속·임원변경 등은 법정 기한이 있으니 서류 준비를 서두르는 것이 좋습니다.",
      "인터넷 정보만으로 서류를 준비하면 보정명령이 발생할 수 있습니다.",
    ],
    procedures: service.procedures.map(
      (step, i) =>
        i === 0
          ? `[${config.regionLabel}] ${step}`
          : step,
    ),
    documents: service.documents,
    costGuide: `${costGuideByService[config.serviceSlug] ?? ""} ${config.regionLabel}·${neighborhoodText} 의뢰 사건도 동일한 기준으로 견적을 안내합니다.`,
    faqs,
    lawyerOpinion: buildLawyerOpinion(
      config.regionLabel,
      serviceLabel,
      config.neighborhoods,
    ),
    directionsNote,
    ctaDescription: consultationCopy.default,
    relatedBlogHrefs: getRelatedBlogPosts(config.serviceSlug),
    relatedServiceLinks: [],
    relatedRegionLinks: [],
  };
}

function resolveLocalLandingPage(config: LocalLandingConfig): LocalLandingPage | null {
  const pageType = config.pageType ?? "service-region";
  let page: LocalLandingPage | null = null;

  if (pageType === "keyword-hub") {
    page = buildKeywordHubPage(config);
  } else if (pageType === "neighborhood-hub") {
    page = buildNeighborhoodHubPage(config);
  } else if (pageType === "preservation-registration") {
    page = buildPreservationRegistrationPage(config);
  } else if (pageType === "public-agency-registration") {
    page = buildPublicAgencyRegistrationPage(config);
  } else if (pageType === "selection-hub") {
    page = buildSelectionHubPage(config);
  } else if (pageType === "search-intent") {
    page = buildSearchIntentPage(config);
  } else if (pageType === "lecture") {
    page = buildLecturePage(config);
  } else if (pageType === "business") {
    page = buildBusinessPage(config);
  } else if (pageType === "b2b-collaboration") {
    page = buildB2BCollaborationPage(config);
  } else if (pageType !== "service-region") {
    page = buildExpansionLandingPage(config);
  } else {
    page = buildLocalLandingPage(config);
  }

  return page ? enrichBusinessCrossLinks(page) : null;
}

/** 기업 법률실무 허브와 기존 법인·공공 페이지 상호링크 */
function enrichBusinessCrossLinks(page: LocalLandingPage): LocalLandingPage {
  const extras: Record<string, { href: string; label: string }[]> = {
    부산법인등기: [
      { href: "/부산기업법률자문", label: "기업 운영 단계별 법률실무 지원" },
      { href: "/부산기업채권관리", label: "기업 미수금·채권관리" },
      { href: "/부산기업부동산등기", label: "기업 부동산등기" },
      { href: "/기업업무문의", label: "기업 업무 문의" },
      { href: "/partners", label: "전문직·기업 협업 안내" },
    ],
    부산법인설립등기: [
      { href: "/부산기업법률자문", label: "기업 법률실무 허브" },
      { href: "/창업법률교육", label: "창업 법률교육" },
      { href: "/partners", label: "협업·프로젝트 문의" },
    ],
    부산부동산등기: [
      { href: "/partners", label: "부산 현지 등기 협업" },
      { href: "/부산부동산협력법무사", label: "부동산 협력 법무사" },
    ],
    부산소유권이전등기: [
      { href: "/부산부동산협력법무사", label: "잔금·이전등기 협업" },
      { href: "/partners", label: "전문직·기업 협업 안내" },
    ],
    부산재개발등기: [
      { href: "/partners", label: "여러 건의 등기업무 문의" },
      { href: "/부산집단등기", label: "집단·대량등기" },
    ],
    부산재건축등기: [
      { href: "/partners", label: "건축·시행사 등기 협업" },
      { href: "/부산집단등기", label: "집단·대량등기" },
    ],
    공탁채권회수: [
      { href: "/부산기업채권관리", label: "기업 미수금·매출채권 관련 업무" },
    ],
  };

  const add = extras[page.slug];
  if (!add?.length) return page;

  const existing = new Set(page.relatedServiceLinks.map((link) => link.href));
  const merged = [
    ...add.filter((link) => !existing.has(link.href)),
    ...page.relatedServiceLinks,
  ];

  return { ...page, relatedServiceLinks: merged };
}

export function getLocalLandingBySlug(slug: string): LocalLandingPage | null {
  const config = getLocalLandingConfig(slug);
  if (!config) return null;
  return resolveLocalLandingPage(config);
}

export function getAllLocalLandingPages(): LocalLandingPage[] {
  return localLandingConfigs
    .map((c) => resolveLocalLandingPage(c))
    .filter((p): p is LocalLandingPage => p !== null);
}
