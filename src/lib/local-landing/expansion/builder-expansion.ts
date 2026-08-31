import { getAllContent } from "@/lib/content/loader";
import { consultationCopy } from "@/lib/consultation";
import { lawyerProfileMeta } from "@/lib/lawyer-profile";
import { officeLocation } from "@/lib/office-location";
import { getServiceBySlug } from "@/lib/services-data";
import type {
  LocalLandingConfig,
  LocalLandingJurisdictionGuide,
  LocalLandingPage,
} from "@/types/local-landing";
import type { ServiceFaq } from "@/types/service";
import { districtProfiles, serviceLabels } from "../districts";
import {
  businessZoneTopics,
  conversionTopics,
  institutionTopics,
  realEstateDevTopics,
} from "./institutions";
import { buildBusanLawyerFlagshipPage } from "../flagship-busan-lawyer";
import { buildStationSectionsForHost } from "@/lib/seo/station-sections";
import { consultHubLinkForLocalPage } from "@/lib/seo/consult-hub-link";
import { isBusanDistrictHubPath, ADJACENT_DISTRICT_HUBS } from "@/lib/geo/busan-district-hubs";
import {
  getRegionHubCoverage,
  isRegionHubIdentityLocked,
  neighborhoodSlugToLabel,
  fitRegionHubDescription,
} from "../region-hub-coverage";
import {
  fallbackRegionHubMeta,
  getRegionHubIdentity,
} from "../region-hub-identity";
import { buildJurisdictionGuideForRegionKey } from "@/lib/geo/busan-registry";

const defaultRegistryGuide: LocalLandingJurisdictionGuide =
  buildJurisdictionGuideForRegionKey("busan");

export function getJurisdictionGuide(
  config: LocalLandingConfig,
  institutionKey?: string,
): LocalLandingJurisdictionGuide {
  if (institutionKey && institutionTopics[institutionKey]) {
    const inst = institutionTopics[institutionKey];
    return {
      title: inst.institutionName,
      address: inst.address,
      accessNote: inst.accessNote,
      jurisdictionNote: inst.jurisdictionNote,
      practicalNotes: inst.practicalNotes,
    };
  }

  const fromSsot = buildJurisdictionGuideForRegionKey(config.regionKey);

  return {
    ...fromSsot,
  };
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

function buildLawyerOpinion(regionLabel: string, topic: string): string {
  return `${lawyerProfileMeta.fullTitle}는 ${lawyerProfileMeta.officeArea}에서 ${regionLabel} ${topic} 상담을 직접 진행합니다. 관할·기한·준비서류는 확인된 사실만 안내합니다.`;
}

function buildDirectionsNote(config: LocalLandingConfig): string {
  const district = districtProfiles[config.regionKey];
  const custom = district?.directionsFromOffice;
  if (custom) return custom;
  return `다옴법무사사무소는 ${officeLocation.fullAddress}에 있습니다. ${config.regionLabel} 사건도 센텀시티역·벡스코 인근에서 방문 상담할 수 있으며, 전화·카카오톡·네이버 예약이 가능합니다.`;
}

/** 보조 키워드만. 동 전용 페이지가 가져갈 `{동} 법무사` exact는 넣지 않는다. */
const regionRecommendKeywords: Record<string, string[]> = {
  해운대법무사: ["해운대 법무사 추천", "해운대 등기 상담"],
  센텀법무사: ["센텀 법무사 추천", "센텀 법인등기"],
  재송동법무사: ["재송동 법무사 추천", "재송동 상속등기"],
  반여동법무사: ["반여동 법무사 추천"],
  수영구법무사: ["수영구 법무사 추천"],
  연제구법무사: ["연제구 법무사 추천"],
  동래구법무사: ["동래구 법무사 추천"],
  부산진구법무사: ["부산진구 법무사 추천"],
  남구법무사: ["남구 법무사 추천"],
  금정구법무사: ["금정구 법무사 추천"],
  북구법무사: ["북구 법무사 추천"],
  기장군법무사: ["기장군 법무사 추천", "기장군 상속등기"],
  사상구법무사: ["사상구 법무사 추천"],
  사하구법무사: ["사하구 법무사 추천"],
  중구법무사: ["중구 법무사 추천"],
  서구법무사: ["서구 법무사 추천"],
  영도구법무사: ["영도구 법무사 추천"],
  강서구법무사: ["강서구 법무사 추천"],
  동구법무사: ["동구 법무사 추천"],
};

function buildRegionHubPage(config: LocalLandingConfig): LocalLandingPage | null {
  if (config.slug === "부산법무사") {
    return buildBusanLawyerFlagshipPage(config);
  }

  const district = districtProfiles[config.regionKey];
  if (!district) return null;

  const coverage = getRegionHubCoverage(config.slug);
  const identity = getRegionHubIdentity(config.slug);
  const identityLocked = isRegionHubIdentityLocked(config.slug);
  const service = getServiceBySlug(config.serviceSlug);
  const serviceLabel = serviceLabels[config.serviceSlug] ?? "등기·상속";
  const coreNeighborhoods = [
    ...new Set([...config.neighborhoods, ...district.neighborhoods]),
  ].slice(0, 8);
  const neighborhoodText = coreNeighborhoods.join(", ");
  const fallbackMeta = fallbackRegionHubMeta(config.regionLabel, coreNeighborhoods);
  const title = `${config.regionLabel} 법무사`;
  const h1 = identity?.h1 ?? fallbackMeta.h1;
  const metaTitle = identity?.metaTitle ?? fallbackMeta.metaTitle;
  const description =
    identity?.description ??
    (identityLocked
      ? fallbackMeta.description
      : coverage?.description
        ? fitRegionHubDescription(coverage.description)
        : fallbackMeta.description);

  const problemStatement =
    identity?.answerBlock ??
    `${district.context} ${config.regionLabel} 생활권(${neighborhoodText}) 안내는 부동산·법인 소재지 관할을 기준으로 합니다. 다옴법무사사무소는 해운대 센텀에서 ${config.regionLabel} 사건을 상담합니다.`;

  const expandParagraphs =
    identity?.expandParagraphs ??
    (!identityLocked && coverage?.summaryParagraphs.length
      ? coverage.summaryParagraphs
      : [
          `${config.regionLabel}에서 상담할 때는 상속·매매·법인 중 어떤 업무인지와 부동산·법인 주소를 먼저 알려 주시면 됩니다.`,
        ]);

  const practiceFocus = identity?.practiceFocus ?? [
    { label: "상속등기", href: "/부산상속등기", note: "명의 이전·협의분할" },
    { label: "부동산등기", href: "/부산부동산등기", note: "매매·담보" },
    { label: "법인등기", href: "/부산법인등기", note: "설립·임원·본점" },
  ];

  const whenNeeded =
    identity?.checkFirst.map(
      (item) => `${config.regionLabel} 상담 전: ${item}`,
    ) ??
    [
      `${config.regionLabel} 부동산·법인 소재지`,
      `${config.regionLabel}에서 상속·매매·법인 중 어떤 업무인지`,
      "기한(상속 3개월, 임원변경 등기)이 있는지",
    ];

  const consultationCases = (
    identity?.typicalSituations ?? [
      {
        title: `${config.regionLabel}에서 자주 검토하는 상황`,
        summary: `${config.regionLabel} 생활권에서 ${serviceLabel}를 진행할 때는 관할·서류·일정을 사건 내용에 맞춰 확인합니다. 가상의 절차 예시이며 실제 사건 기록이 아닙니다.`,
      },
    ]
  ).map((row) => ({
    title: row.title,
    summary: `${row.summary} 실제 상담 기록이 아니라 절차를 이해하기 위한 예시입니다.`,
  }));

  const faqs: ServiceFaq[] = [
    ...(identity?.faqs ?? []),
    {
      question: `${config.regionLabel} 법무사 사무소는 어디에 있나요?`,
      answer: `다옴법무사사무소는 부산 해운대구 센텀에 있습니다. ${config.regionLabel} 사건은 전화·카카오톡·방문(예약)으로 상담합니다.`,
    },
    {
      question: `${config.regionLabel} 관할 등기소는 어디인가요?`,
      answer: getJurisdictionGuide(config).jurisdictionNote,
    },
    {
      question: `${config.regionLabel} 비용은 바로 나오나요?`,
      answer:
        "수임료와 세금·공과금은 별도입니다. 부동산 가액·상속인 수·법인 변경 내용에 따라 달라지며, 확정 금액은 서류 확인 후 안내합니다.",
    },
  ];
  if (coverage?.faqs.length) {
    faqs.push(...coverage.faqs);
  }

  const primaryKeywords = [
    `${config.regionLabel} 법무사`,
    ...(coverage?.extraKeywords ?? []),
    ...(regionRecommendKeywords[config.slug] ?? []),
  ].filter((item, index, list) => list.indexOf(item) === index);

  const neighborhoodLinks = (config.linkedNeighborhoodSlugs ?? []).map((slug) => ({
    href: `/${slug}`,
    label: neighborhoodSlugToLabel(slug),
  }));

  const extraPageSections = [
    {
      title: `이 페이지에서 다루는 ${config.regionLabel} 업무`,
      body: `통계로 ‘많다’고 단정하지 않습니다. ${config.regionLabel} 검색 의도에 맞춰 아래 업무를 중심으로 안내합니다.`,
      items: practiceFocus.map((item) => `${item.label}: ${item.note}`),
      links: practiceFocus.map((item) => ({ href: item.href, label: item.label })),
    },
    {
      title: `${config.regionLabel}에서 먼저 확인할 사항`,
      body: "상담 전에 아래만 정리해 주셔도 다음 절차를 나눌 수 있습니다.",
      items: identity?.checkFirst ?? whenNeeded,
    },
    ...(coverage
      ? [
          {
            title: `${config.regionLabel} 동·생활권에서 찾는 경우`,
            body: coverage.coverageBody,
            items: coverage.coverageItems,
            links: [
              ...neighborhoodLinks,
              { href: "/busan-legal-map", label: "부산 구·군 법률지도" },
            ],
          },
        ]
      : []),
    {
      title: "안윤정 법무사가 직접 확인하는 부분",
      body: identity?.trustLine ?? buildLawyerOpinion(config.regionLabel, "등기·상속"),
      links: [{ href: "/about", label: "안윤정 법무사 소개" }],
    },
  ];

  const relatedServiceLinks = [
    ...(isBusanDistrictHubPath(`/${config.slug}`)
      ? [{ href: "/", label: "부산 법무사" }]
      : []),
    consultHubLinkForLocalPage(config.slug),
    { href: "/busan-legal-map", label: "부산 구·군 법률지도" },
    ...practiceFocus.slice(0, 4).map((item) => ({
      href: item.href,
      label: item.label,
    })),
    { href: "/about", label: "안윤정 법무사 소개" },
  ];

  return {
    slug: config.slug,
    path: `/${config.slug}`,
    pageType: "region-hub",
    serviceSlug: config.serviceSlug,
    title,
    metaTitle,
    h1,
    description,
    summaryParagraphs: expandParagraphs,
    extraPageSections,
    primaryKeywords,
    regionLabel: config.regionLabel,
    regionKey: config.regionKey,
    neighborhoods: config.neighborhoods,
    problemStatement,
    whenNeeded,
    jurisdictionGuide: getJurisdictionGuide(config),
    consultationCase: consultationCases[0],
    consultationCases,
    legalIssues: (identity?.checkFirst ?? whenNeeded).slice(0, 4),
    precautions: [
      "법원·등기소와 공식 제휴 관계가 아닙니다. 관할·접수 절차·준비서류를 실무 관점에서 안내합니다.",
      "확인되지 않은 지역 통계나 성공률은 제시하지 않습니다.",
    ],
    procedures: service?.procedures ?? [
      "전화·카카오톡·방문(예약)으로 지역·업무·기한 확인",
      "등기부·가족관계 등 기본 자료 확인",
      "관할 기관·필요 서류·비용 항목 안내",
      "신청서 작성·접수",
      "완료 확인",
    ],
    documents: service?.documents ?? ["등기부등본", "가족관계증명서", "인감증명서", "신분증"],
    costGuide: `${config.regionLabel} 사건도 수임료와 세금·공과금을 구분해 안내합니다. ${serviceLabel} 금액은 가액·상속인 수·변경 내용에 따라 달라집니다.`,
    faqs: faqs
      .filter(
        (faq, index, list) =>
          list.findIndex((row) => row.question === faq.question) === index,
      )
      .slice(0, 8),
    lawyerOpinion: identity?.trustLine ?? buildLawyerOpinion(config.regionLabel, "등기·상속"),
    directionsNote: buildDirectionsNote(config),
    ctaDescription:
      "지역과 업무(상속·매매·법인 등), 알고 있는 주소만 알려 주셔도 다음 확인 항목을 정리합니다.",
    relatedBlogHrefs: getRelatedBlogPosts(config.serviceSlug).slice(0, 2),
    relatedServiceLinks,
    relatedRegionLinks: [
      ...neighborhoodLinks.slice(0, 6),
      ...(ADJACENT_DISTRICT_HUBS[`/${config.slug}`] ?? []),
    ].filter(
      (link, index, list) => list.findIndex((row) => row.href === link.href) === index,
    ),
    breadcrumbParent: { href: "/busan-legal-map", label: "부산 법률지도" },
    stationSections: buildStationSectionsForHost(`/${config.slug}`),
  };
}

function buildConversionPage(config: LocalLandingConfig): LocalLandingPage | null {
  const topic = config.conversionKey ? conversionTopics[config.conversionKey] : null;
  if (!topic) return null;

  const serviceLabel = serviceLabels[topic.serviceSlug] ?? topic.title;
  const neighborhoods = config.neighborhoods.join(", ");

  const problemStatement = topic.uniqueProblemStatement
    ? topic.uniqueProblemStatement
    : `부산에서 ${topic.title}을(를) 검색하시는 분들은 대부분 실제 부담 금액과 준비 기간을 알고 싶어 하십니다. ${topic.focusKeywords.join(", ")} 관련 비용은 사건마다 다릅니다. 부동산 가액·상속인 수·채무 규모·법인 규모·병행 업무 여부에 따라 법무사 보수와 등기신청 수수료·세금이 달라집니다. 다옴법무사사무소는 ${neighborhoods} 일대를 포함한 부산 전역 의뢰인에게 항목별 견적을 투명하게 안내합니다. 숨겨진 비용 없이 상담 후 예상 범위를 설명해 드립니다.`;

  const whenNeeded = [
    `${serviceLabel}를 진행하기 전 예상 비용을 비교하고 싶을 때`,
    `가족·동업자와 비용 분담을 논의해야 할 때`,
    `등기 수수료·세금·법무사 보수를 구분해 알고 싶을 때`,
    `보정·과태료 등 추가 비용 가능성을 확인하고 싶을 때`,
  ];

  const consultationCases = topic.skipMortgageExample
    ? [
        {
          title: `${topic.title} — 이해를 위한 예시`,
          summary: `상황을 단순화한 예시입니다. 부산 ${neighborhoods} 일대에서 ${serviceLabel} 비용을 문의하는 경우, ${config.caseAngle ?? "관련 자료와 당사자 구성을 확인한 뒤"} 법무사 보수와 사건별 실비를 항목별로 구분해 안내하고 진행 여부를 결정하는 흐름이 일반적입니다. 개별 사정에 따라 결론이 달라질 수 있습니다.`,
        },
        {
          title: `서류 확인 후 확정 — 이해를 위한 예시`,
          summary: `전화로는 구성만 안내하고, 등기부·가족관계·결의서류 확인 뒤에야 항목이 정해지는 경우가 있습니다. 실제 금액은 사건별 확인이 필요합니다.`,
        },
        {
          title: `비대면 견적 문의 — 이해를 위한 예시`,
          summary: `카카오톡으로 등기부·가족관계증명서를 보내주신 뒤 대략적인 구성을 안내하고, 방문 없이 진행하는 경우도 있습니다. 확정 견적은 서류 확인 후입니다.`,
        },
      ]
    : [
        {
          title: `${topic.title} — 이해를 위한 예시`,
          summary: `상황을 단순화한 예시입니다. 부산 ${neighborhoods} 일대에서 ${serviceLabel} 비용을 문의하는 경우, ${config.caseAngle ?? "등기부와 상황을 확인한 뒤"} 법무사 보수·등기 수수료·세금을 항목별로 구분해 안내하고 진행 여부를 결정하는 흐름이 일반적입니다. 개별 사정에 따라 결론이 달라질 수 있습니다.`,
        },
        {
          title: `복합 사건 견적 — 이해를 위한 예시`,
          summary: `상속등기와 저당권 말소가 함께 필요한 사건에서 단계별 비용 구성을 미리 안내해 일정과 예산을 맞추는 경우가 있습니다. 실제 금액은 사건별 확인이 필요합니다.`,
        },
        {
          title: `비대면 견적 문의 — 이해를 위한 예시`,
          summary: `카카오톡으로 등기부·가족관계증명서를 보내주신 뒤 대략적인 구성을 안내하고, 방문 없이 진행하는 경우도 있습니다. 확정 견적은 서류 확인 후입니다.`,
        },
      ];

  const genericFaqs: ServiceFaq[] = [
    {
      question: `${topic.title}은 얼마나 드나요?`,
      answer: topic.costFactors.join(" "),
    },
    {
      question: `법무사 수임료와 등기 수수료는 별도인가요?`,
      answer: "네. 법무사 수임료, 등기신청 수수료, 등록면허세·취득세 등 세금은 별도 항목입니다. 해당 사건에 실제로 발생하는 항목만 안내합니다.",
    },
    {
      question: `견적은 어떻게 받나요?`,
      answer: "전화·카카오톡·방문 상담 후 사건 내용을 확인하고 항목별로 안내합니다. 업무명과 핵심 정보만 보내주셔도 어떤 항목이 필요한지부터 구분합니다.",
    },
    {
      question: `추가 비용이 발생할 수 있나요?`,
      answer: "보정명령·병행 등기·해외 서류 인증 등 부가 업무가 있으면 추가될 수 있으며, 사전에 설명합니다.",
    },
    {
      question: `기한이 촉박하면 비용이 더 드나요?`,
      answer: "긴급 진행 자체로 수임료가 달라지지는 않지만, 기한을 놓치면 과태료·불이익이 생길 수 있어 빠른 상담을 권합니다.",
    },
    ...topic.timelineNotes.map((note) => ({
      question: `${topic.title} 관련 일정 안내`,
      answer: note,
    })),
  ];
  const faqs: ServiceFaq[] = topic.uniqueFaqs?.length
    ? [...topic.uniqueFaqs, ...genericFaqs].filter(
        (faq, index, arr) =>
          arr.findIndex((row) => row.question === faq.question) === index,
      )
    : genericFaqs;

  const isLawyerFeeBusan = topic.key === "lawyer-fee-busan";
  const feeProblemStatement = isLawyerFeeBusan
    ? `부산 법무사 비용·수수료를 검색하시는 분들은 대개 ‘얼마가 드는지’보다 ‘무엇을 내는 돈인지’를 먼저 알고 싶어 하십니다. 법무사 보수와 취득세·등록면허세·국민주택채권·증명서·등기신청수수료는 성격이 다릅니다. 같은 업무라도 부동산 가액, 상속인 수, 법인 변경사항, 채권자 수, 말소·보정 병행 여부에 따라 달라지며, 전화로는 대략적인 구성만 안내하고 확정 금액은 서류 확인 후에 안내하는 경우가 많습니다. 다옴법무사사무소는 ${neighborhoods} 일대를 포함한 부산 전역 의뢰인에게 항목별 구성을 구분해 설명합니다. 근거 없는 고정 단가나 ‘최저’ 금액만으로 비교하도록 유도하지 않습니다.`
    : problemStatement;

  return {
    slug: config.slug,
    path: `/${config.slug}`,
    pageType: "conversion",
    serviceSlug: topic.serviceSlug,
    title: topic.title,
    metaTitle: isLawyerFeeBusan
      ? "부산 법무사 비용은 어떻게 정해질까｜보수·세금·공과금을 구분해서 확인하세요"
      : undefined,
    h1: isLawyerFeeBusan
      ? "부산 법무사 비용은 어떻게 정해질까"
      : `${topic.title} 안내 — 부산 다옴법무사사무소`,
    description: isLawyerFeeBusan
      ? "부산 법무사 비용·수수료는 보수와 세금·공과금이 다릅니다. 같은 업무라도 달라지는 이유, 전화 안내와 서류 확인 후 확정의 차이, 견적 전 준비자료를 안내합니다."
      : `부산 ${topic.title} — 법무사 수임료·등기 수수료·세금 항목별 안내. 다옴법무사사무소 안윤정 법무사. ${neighborhoods} 상담 가능.`,
    regionLabel: config.regionLabel,
    regionKey: config.regionKey,
    neighborhoods: config.neighborhoods,
    problemStatement: feeProblemStatement,
    whenNeeded,
    jurisdictionGuide: getJurisdictionGuide(config),
    consultationCase: consultationCases[0],
    consultationCases,
    legalIssues: topic.costFactors.map((f) => `비용 산정 시 ${f}`),
    precautions: [
      "지나치게 낮은 금액만으로 비교하기보다 포함 항목(말소·보정·출장·복대리)을 확인하세요.",
      "인터넷 평균 비용과 실제 사건 비용은 차이가 날 수 있습니다.",
      "견적은 사건 내용 확인 후에만 유효하며, 확정되지 않은 금액은 사건별 확인이 필요합니다.",
    ],
    procedures: [
      "상담(전화·카카오톡·방문)으로 업무·기한·보유 서류 확인",
      "등기부·관련 서류 확인",
      "보수·세금·공과금을 구분해 항목별 안내",
      "진행 여부 결정 후 서류 준비",
      "접수·완료",
    ],
    documents: topic.documentList,
    costGuide: `${topic.title}: ${topic.costFactors.join(" ")} ${topic.timelineNotes.join(" ")}`,
    faqs: faqs.slice(0, 10),
    lawyerOpinion: buildLawyerOpinion("부산", topic.title),
    directionsNote: buildDirectionsNote(config),
    relatedBlogHrefs: getRelatedBlogPosts(topic.serviceSlug),
    relatedServiceLinks: isLawyerFeeBusan
      ? [
          { href: "/부산법무사상담", label: "상담 전 비용·준비서류 안내" },
          { href: "/부산법무사보수표", label: "부산 법무사 보수표 참고" },
          { href: "/부산법률상담", label: "부산 법률상담 절차" },
          { href: "/부동산등기비용", label: "부동산등기 비용 항목" },
        ]
      : (topic.relatedServiceLinks ?? []),
    ctaDescription: isLawyerFeeBusan
      ? "확인하고 싶은 비용 항목과 준비된 자료를 남겨 주시면, 접수 가능 여부와 보수·공과금의 대략적 구성을 먼저 안내합니다. 확정 견적은 서류 확인 후입니다."
      : (topic.ctaDescription ??
        "업무명과 핵심 정보를 보내주시면 어떤 항목이 필요한지부터 구분합니다. 확정 금액은 자료 확인 후입니다."),
    relatedRegionLinks: [],
  };
}

function buildCourtRegistryPage(config: LocalLandingConfig): LocalLandingPage | null {
  const inst = config.institutionKey ? institutionTopics[config.institutionKey] : null;
  if (!inst) return null;

  const service = getServiceBySlug(inst.primaryServiceSlug);
  const serviceLabel = serviceLabels[inst.primaryServiceSlug] ?? "등기·상속";
  const neighborhoods = config.neighborhoods.join(", ");

  const problemStatement = `${inst.institutionName} 관련 절차를 앞두고 계신가요? ${inst.jurisdictionNote} 방문 전에 관할, 서류, 신청 순서를 미리 확인하는 것이 중요합니다. 다옴법무사사무소는 부산 해운대 센텀에 있으며, ${neighborhoods} 일대를 포함해 ${inst.institutionName} 접수 전 상담·서류 준비·대리 접수를 도와드립니다. 본 페이지는 공식 기관 사이트가 아니며, 실무상 접수 절차와 준비서류를 법무사 관점에서 안내합니다.`;

  const whenNeeded = [
    `${inst.institutionName}에 ${serviceLabel} 관련 서류를 접수해야 할 때`,
    `관할이 맞는지 확인이 필요할 때`,
    `신청서 작성·첨부 서류를 점검하고 싶을 때`,
    `보정명령을 받아 대응 방법을 알고 싶을 때`,
  ];

  const consultationCases = [
    {
      title: `${inst.institutionName} 접수 전 확인`,
      summary: `${config.regionLabel}에서 ${inst.institutionName} 접수를 앞둔 경우 관할과 서류를 먼저 확인하는 흐름입니다. 가상의 절차 예시이며 특정 의뢰 기록이 아닙니다.`,
    },
    {
      title: `보정명령이 있는 경우`,
      summary: `신청서 보완이 필요하면 보정 기한 내 서류를 준비해 재접수하는 흐름입니다. 실제 사건 기록이 아닙니다.`,
    },
    {
      title: `방문 전 서류 검토`,
      summary: `방문 전 카카오톡으로 서류를 검토하고 당일 접수만 방문하는 경우도 있습니다. 일반적 진행 안내입니다.`,
    },
  ];

  const faqs: ServiceFaq[] = [
    {
      question: `${inst.institutionName} 주소와 찾아가는 방법은?`,
      answer: `${inst.address}. ${inst.accessNote}`,
    },
    {
      question: `관할은 어떻게 정해지나요?`,
      answer: inst.jurisdictionNote,
    },
    {
      question: `어떤 서류가 필요한가요?`,
      answer: inst.documentTips.join(", "),
    },
    {
      question: `법무사가 대리 접수할 수 있나요?`,
      answer: "위임장을 작성하시면 대리 접수가 가능한 사건이 많습니다. 사건 유형별로 상담해 드립니다.",
    },
    {
      question: `인터넷등기소로 대체할 수 있나요?`,
      answer: "전자등기 가능 여부는 사건에 따라 다릅니다. 방문 없이 진행 가능한지 먼저 확인합니다.",
    },
    {
      question: `접수 전 확인할 실무 사항은?`,
      answer: inst.practicalNotes.join(" "),
    },
  ];

  return {
    slug: config.slug,
    path: `/${config.slug}`,
    pageType: "court-registry",
    serviceSlug: inst.primaryServiceSlug,
    title: `${inst.institutionName} ${serviceLabel}`,
    h1: `${inst.institutionName} — 접수 절차·서류 안내`,
    description: `${inst.institutionName} 관할·접수 절차·준비서류 — 부산 다옴법무사사무소. ${neighborhoods} 상담. 공식 기관이 아닌 법무사 실무 안내.`,
    regionLabel: config.regionLabel,
    regionKey: config.regionKey,
    neighborhoods: config.neighborhoods,
    problemStatement,
    whenNeeded,
    jurisdictionGuide: getJurisdictionGuide(config, config.institutionKey),
    consultationCase: consultationCases[0],
    consultationCases,
    legalIssues: inst.practicalNotes,
    precautions: [
      "본 사무소는 법원·등기소와 공식 제휴 관계가 아닙니다.",
      "‘법원 지정’·‘등기소 지정’ 등 오해의 소지가 있는 표현을 사용하지 않습니다.",
      "접수 마감 시각·휴무일은 당일 기관 안내를 확인하세요.",
    ],
    procedures: service?.procedures ?? [
      "관할·사건 유형 확인",
      "필요 서류 목록 작성",
      "신청서·첨부서류 준비",
      "접수(방문 또는 전자)",
      "보정·완료 확인",
    ],
    documents: inst.documentTips,
    costGuide: `법무사 수임료는 사건 유형에 따라 다릅니다. ${inst.institutionName} 접수 수수료·인지대는 별도이며 상담 시 안내합니다.`,
    faqs,
    lawyerOpinion: buildLawyerOpinion(config.regionLabel, `${inst.institutionName} 관련 ${serviceLabel}`),
    directionsNote: `${inst.address} — ${inst.accessNote} ${buildDirectionsNote(config)}`,
    ctaDescription:
      "법원·등기소 접수 전에는 관할, 서류, 신청 순서를 미리 확인하는 것이 중요합니다. 다옴법무사사무소 안윤정 법무사가 현재 상황에 맞는 절차를 안내해드리겠습니다.",
    relatedBlogHrefs: getRelatedBlogPosts(inst.primaryServiceSlug),
    relatedServiceLinks: [
      ...(config.institutionKey?.includes("registry")
        ? [{ href: "/부산등기법무사", label: "부산 등기 상담" }]
        : []),
      ...inst.relatedServiceSlugs.map((slug) => ({
        href: `/services/${slug}`,
        label: serviceLabels[slug] ?? slug,
      })),
    ],
    relatedRegionLinks: [],
  };
}

function buildBusinessZonePage(config: LocalLandingConfig): LocalLandingPage | null {
  const zone = config.businessZoneKey ? businessZoneTopics[config.businessZoneKey] : null;
  if (!zone) return null;

  const service = getServiceBySlug(zone.serviceSlug);
  const serviceLabel = serviceLabels[zone.serviceSlug] ?? zone.title;
  const neighborhoods = config.neighborhoods.join(", ");

  const problemStatement = `${zone.zoneName} 일대에서 ${zone.title} 수요가 꾸준합니다. ${zone.zoneContext} 창업·입주·투자 유치 과정에서 법인 설립등기·임원변경·본점 이전등기가 필요한 경우가 많습니다. ${neighborhoods} 인근 기업·스타트업·전문서비스 업체가 문의하시는 ${serviceLabel} 절차를 다옴법무사사무소가 상담·진행합니다. 정관·주주총회 결의·등기신청서 작성 오류는 보정과 지연으로 이어질 수 있어 사전 점검이 중요합니다.`;

  const whenNeeded = zone.commonCases.map(
    (c) => `${zone.zoneName}에서 ${c}가 필요한 경우`,
  );

  const consultationCases = zone.commonCases.slice(0, 3).map((c, i) => ({
    title: `${zone.zoneName} ${serviceLabel} 사례 ${i + 1}`,
    summary: `${zone.zoneName} 소재 의뢰인이 ${c}를 진행하셨습니다. ${config.caseAngle ?? "정관·결의서를 확인한 뒤"} 관할 등기소에 접수했습니다.`,
  }));

  const faqs: ServiceFaq[] = [
    {
      question: `${zone.zoneName} 법인등기 관할 등기소는?`,
      answer: getJurisdictionGuide(config).jurisdictionNote,
    },
    {
      question: `${zone.title} 기간은?`,
      answer: "서류 준비가 되면 보통 1~2주 내외입니다. 보정 여부에 따라 달라집니다.",
    },
    {
      question: `설립 후 사업자등록도 도와주나요?`,
      answer: "등기 완료 후 사업자등록·계좌 개설 안내까지 설명해 드립니다.",
    },
    {
      question: `1인 법인도 가능한가요?`,
      answer: "1인 주식회사 설립이 가능합니다. 자본금·정관 설계를 상담해 드립니다.",
    },
    {
      question: `임원변경 지연 시 과태료가 있나요?`,
      answer: "결의 후 등기 기한을 넘기면 과태료가 부과될 수 있습니다. 빠른 접수를 권합니다.",
    },
  ];

  return {
    slug: config.slug,
    path: `/${config.slug}`,
    pageType: "business-zone",
    serviceSlug: zone.serviceSlug,
    title: zone.title,
    h1: `${zone.title} — ${zone.zoneName} 법무사 상담`,
    description: `부산 ${zone.title} — ${zone.zoneName} 법인 설립·등기·임원변경. 다옴법무사사무소 안윤정 법무사.`,
    regionLabel: config.regionLabel,
    regionKey: config.regionKey,
    neighborhoods: config.neighborhoods,
    problemStatement,
    whenNeeded,
    jurisdictionGuide: getJurisdictionGuide(config),
    consultationCase: consultationCases[0],
    consultationCases,
    legalIssues: [
      `${zone.zoneName} 법인은 본점 주소 변경 시 관할 등기소가 바뀔 수 있습니다.`,
      "정관과 등기부 불일치는 거래·대출에서 문제가 됩니다.",
      "임원 자격·결의 요건 미충족 시 반려됩니다.",
    ],
    precautions: [
      "투자 유치·지분 변동 시 정관·주주명부를 함께 점검하세요.",
      "사업자등록 업종·본점 주소는 등기와 일치해야 합니다.",
    ],
    procedures: service?.procedures ?? [
      "상담·정관 검토",
      "주주총회·이사회 결의",
      "등기신청서 작성",
      "관할 등기소 접수",
      "등기 완료·사업자등록 안내",
    ],
    documents: service?.documents ?? ["정관", "주주총회 의사록", "인감증명서"],
    costGuide: `${zone.zoneName} ${serviceLabel} 비용은 자본금·임원 수·변경 항목에 따라 다릅니다. 상담 후 견적을 안내합니다.`,
    faqs,
    lawyerOpinion: buildLawyerOpinion(zone.zoneName, zone.title),
    directionsNote: buildDirectionsNote(config),
    ctaDescription: consultationCopy.default,
    relatedBlogHrefs: getRelatedBlogPosts(zone.serviceSlug),
    relatedServiceLinks: zone.relatedServiceSlugs.map((slug) => ({
      href: `/services/${slug}`,
      label: serviceLabels[slug] ?? slug,
    })),
    relatedRegionLinks: (config.linkedNeighborhoodSlugs ?? []).map((slug) => ({
      href: `/${slug}`,
      label: neighborhoodSlugToLabel(slug),
    })),
  };
}

function buildRealEstateDevPage(config: LocalLandingConfig): LocalLandingPage | null {
  const topic = config.realEstateDevKey ? realEstateDevTopics[config.realEstateDevKey] : null;
  if (!topic) return null;

  const service = getServiceBySlug(topic.serviceSlug);
  const neighborhoods = config.neighborhoods.join(", ");

  const problemStatement = `부산에서 ${topic.title} 관련 문의가 늘고 있습니다. ${topic.topicContext} 재개발·재건축·신축 분양·토지 상속 등은 일반 매매와 권리 관계가 다릅니다. ${neighborhoods} 일대 사건도 조합원 지위·분양권·저당권·상속인 협의가 겹치면 절차가 복잡해집니다. 다옴법무사사무소는 ${topic.legalPoints.join(" ")} 등 실무 포인트를 중심으로 상담·진행합니다.`;

  const whenNeeded = [
    `${topic.title}가 필요한 부동산·상속 상황`,
    `조합원 지위·분양권 승계가 필요할 때`,
    `신축 입주 후 최초 등기를 진행할 때`,
    `토지·농지 상속 후 명의 정리가 필요할 때`,
  ];

  const consultationCases = [
    {
      title: `${topic.title} 상담 사례`,
      summary: `${config.regionLabel}에서 ${topic.title}를 검토할 때는 ${config.caseAngle ?? "관련 자료와 당사자 구성을 확인한 뒤"} 법무사 보수와 사건별 실비를 항목별로 구분해 안내하는 흐름이 일반적입니다. 가상의 절차 예시이며 실제 사건 기록이 아닙니다.`,
    },
    {
      title: `상속·매매 병행 사례`,
      summary: `상속등기 완료 후 매매까지 일정을 맞춘 사례입니다.`,
    },
    {
      title: `저당권 정리 후 등기 사례`,
      summary: `대출·근저당 말소를 선행한 뒤 소유권이전등기를 진행한 사례입니다.`,
    },
  ];

  const faqs: ServiceFaq[] = [
    {
      question: `${topic.title}와 일반 매매 등기의 차이는?`,
      answer: topic.legalPoints.join(" "),
    },
    {
      question: `관할 등기소는 어디인가요?`,
      answer: getJurisdictionGuide(config).jurisdictionNote,
    },
    {
      question: `필요 서류는?`,
      answer: service?.documents.join(", ") ?? "등기부등본, 원인증서, 인감증명서 등 사건에 따라 다릅니다.",
    },
    {
      question: `기간은 얼마나 걸리나요?`,
      answer: "서류·저당권 정리·보정 여부에 따라 수 주 내외입니다.",
    },
    {
      question: `상속포기·한정승인과 함께 진행할 수 있나요?`,
      answer: "채무가 우려되면 상속포기·한정승인을 먼저 검토한 뒤 등기 순서를 정합니다.",
    },
  ];

  return {
    slug: config.slug,
    path: `/${config.slug}`,
    pageType: "real-estate-dev",
    serviceSlug: topic.serviceSlug,
    title: topic.title,
    h1: `${topic.title} 절차·서류 안내`,
    description: `부산 ${topic.title} — ${topic.topicContext}. 다옴법무사사무소 안윤정 법무사. ${neighborhoods} 상담.`,
    regionLabel: config.regionLabel,
    regionKey: config.regionKey,
    neighborhoods: config.neighborhoods,
    problemStatement,
    whenNeeded,
    jurisdictionGuide: getJurisdictionGuide(config),
    consultationCase: consultationCases[0],
    consultationCases,
    legalIssues: topic.legalPoints,
    precautions: [
      "조합·시행사 서류와 등기 원인증서 내용이 일치해야 합니다.",
      "재개발·재건축 단계에 따라 필요 서류가 달라집니다.",
      "농지·임야는 취득 자격·분할 규정을 추가로 확인하세요.",
    ],
    procedures: service?.procedures ?? [
      "등기부·조합 서류 확인",
      "상속인·매수인 협의",
      "세금·말소 등기 정리",
      "등기신청·접수",
      "완료 확인",
    ],
    documents: service?.documents ?? ["등기부등본", "계약서·협의서", "인감증명서"],
    costGuide: `${topic.title} 비용은 부동산 가액·말소 등기·상속인 수에 따라 다릅니다. 상담 후 견적을 안내합니다.`,
    faqs,
    lawyerOpinion: buildLawyerOpinion(config.regionLabel, topic.title),
    directionsNote: buildDirectionsNote(config),
    ctaDescription: consultationCopy.default,
    relatedBlogHrefs: getRelatedBlogPosts(topic.serviceSlug),
    relatedServiceLinks: topic.relatedServiceSlugs.map((slug) => ({
      href: `/services/${slug}`,
      label: serviceLabels[slug] ?? slug,
    })),
    relatedRegionLinks: [],
  };
}

export function buildExpansionLandingPage(
  config: LocalLandingConfig,
): LocalLandingPage | null {
  const pageType = config.pageType ?? "service-region";

  switch (pageType) {
    case "region-hub":
      return buildRegionHubPage(config);
    case "conversion":
      return buildConversionPage(config);
    case "court-registry":
      return buildCourtRegistryPage(config);
    case "business-zone":
      return buildBusinessZonePage(config);
    case "real-estate-dev":
      return buildRealEstateDevPage(config);
    default:
      return null;
  }
}
