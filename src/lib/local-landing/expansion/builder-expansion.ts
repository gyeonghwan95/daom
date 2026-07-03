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

const defaultRegistryGuide: LocalLandingJurisdictionGuide = {
  title: "부산 관할 등기소 안내",
  address: "부산광역시 연제구 법원로 8 (부산지방법원 등기국)",
  accessNote: "연산역·동래역 인근. 부동산 소재지에 따라 남부산·북부산·중부산·부산진 등기소로 관할이 나뉩니다.",
  jurisdictionNote:
    "등기 신청은 부동산·법인 본점 소재지를 기준으로 관할 등기소가 정해집니다. 인터넷등기소(전자등기) 가능 여부를 먼저 확인하면 방문 부담을 줄일 수 있습니다.",
  practicalNotes: [
    "관할 등기소 오접수는 반려·이송 사유가 될 수 있으니 소재지를 먼저 확인하세요.",
    "등기신청서 작성 오류는 보정명령으로 기간이 늘어날 수 있습니다.",
    "등록세·취득세 신고 기한과 등기 접수 순서를 맞추는 것이 중요합니다.",
  ],
};

const registryByRegionKey: Record<string, Partial<LocalLandingJurisdictionGuide>> = {
  haeundae: {
    title: "해운대·센텀 관할 등기소",
    address: "남부산등기소 (부산광역시 남구 수영로 312) 등",
    jurisdictionNote:
      "해운대구·수영구 일대 부동산은 남부산등기소 또는 동부지원 등기과 관할인 경우가 많습니다. 법인 본점이 센텀에 있으면 별도 확인이 필요합니다.",
  },
  centum: {
    title: "센텀·재송 관할 등기소",
    address: "남부산등기소·동부지원 등기과",
    jurisdictionNote:
      "센텀시티 법인·부동산은 본점 주소와 부동산 소재지에 따라 관할이 달라집니다. 스타트업 설립 후 본점 이전 시 관할 변경을 검토하세요.",
  },
  buk: {
    title: "북부산등기소",
    address: "부산광역시 북구 금곡대로 231",
    jurisdictionNote: "북구·금정·강서 일부 부동산 등기가 북부산등기소에 접수됩니다.",
  },
  dongnae: {
    title: "중부산등기소",
    address: "부산광역시 동래구 중앙대로 1333",
    jurisdictionNote: "동래·연제·북구 일부 부동산·법인 등기가 중부산등기소 관할입니다.",
  },
  busanjin: {
    title: "부산진등기소",
    address: "부산광역시 부산진구 중앙대로 686",
    jurisdictionNote: "서면·부전·전포 일대 상가·오피스·주택 등기가 집중 접수됩니다.",
  },
  gijang: {
    title: "북부산등기소·동부지원 등기과",
    jurisdictionNote: "기장군 토지·주택은 소재지에 따라 북부산 또는 동부 관할이 정해집니다.",
  },
  gangseo: {
    title: "북부산등기소",
    jurisdictionNote: "명지·강서구 신도시 부동산은 북부산등기소 관할인 경우가 많습니다.",
  },
};

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

  const district = districtProfiles[config.regionKey];
  const regional = registryByRegionKey[config.regionKey] ?? {};

  return {
    ...defaultRegistryGuide,
    title: district?.registryOffice ?? regional.title ?? defaultRegistryGuide.title,
    address: district?.registryAddress ?? regional.address ?? defaultRegistryGuide.address,
    jurisdictionNote:
      district?.courtNote ??
      regional.jurisdictionNote ??
      defaultRegistryGuide.jurisdictionNote,
    practicalNotes: defaultRegistryGuide.practicalNotes,
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
  return `${lawyerProfileMeta.fullTitle}는 ${lawyerProfileMeta.officeArea}에서 ${regionLabel} 일대 ${topic} 사건을 직접 상담·진행합니다. 법무사·공인중개사·신용관리사 자격을 갖추었고, 대한법무사협회 표창을 수상했으며 부산 시민도서관 법률특강·부산광역시 자립지원전담기관 전세사기 예방 특강 등 지역 법률 교육 경험이 있습니다. 민주평화통일자문회의 자문위원·부산 청년정책조정위원·부산법무사회 공식 통역사로서 ${regionLabel} 의뢰인께 절차와 비용을 알기 쉽게 설명합니다. 불안한 상황일수록 ‘지금 무엇을 해야 하는지’를 먼저 정리하는 것이 중요하다고 생각합니다.`;
}

function buildDirectionsNote(config: LocalLandingConfig): string {
  const district = districtProfiles[config.regionKey];
  const custom = district?.directionsFromOffice;
  if (custom) return custom;
  return `다옴법무사사무소는 ${officeLocation.fullAddress}에 있습니다. ${config.regionLabel}에서 오시는 경우 센텀시티역·벡스코 인근이며, 방문 상담은 네이버 예약 후 이용해 주세요. 주차·대중교통 안내는 오시는 길 페이지에서 확인하실 수 있습니다.`;
}

function buildRegionHubPage(config: LocalLandingConfig): LocalLandingPage | null {
  const district = districtProfiles[config.regionKey];
  if (!district) return null;

  const service = getServiceBySlug(config.serviceSlug);
  const serviceLabel = serviceLabels[config.serviceSlug] ?? "등기·상속";
  const neighborhoods = [...new Set([...config.neighborhoods, ...district.neighborhoods])].slice(0, 8);
  const neighborhoodText = neighborhoods.join(", ");
  const title = `${config.regionLabel} 법무사`;
  const demandNotes = district.demandNotes ?? [
    `${config.regionLabel} 아파트·상가 상속등기`,
    `${config.regionLabel} 법인 설립·임원변경 등기`,
    `${config.regionLabel} 부동산 매매·소유권이전등기`,
  ];

  const problemStatement = `${config.regionLabel}(${neighborhoodText})에서 등기·상속·법인·채무 문제로 법무사를 찾으시는 분들이 많습니다. ${district.context} 부동산 가액·가족 관계·채무 유무에 따라 필요한 절차가 달라지고, 관할 등기소·법원도 사건마다 다릅니다. 막연히 인터넷 정보만으로 진행하다 보면 서류 누락·기한 경과·보정명령으로 일정이 늘어나는 경우가 있습니다. 다옴법무사사무소는 부산 해운대 센텀에 있으며, ${config.regionLabel} 의뢰인의 상속등기·상속포기·한정승인·법인등기·부동산등기·개인회생 사건을 직접 상담합니다.`;

  const whenNeeded = demandNotes.map((note) => `${config.regionLabel}에서 ${note}가 필요한 경우`);

  const caseAngles = district.caseAngles ?? [
    config.caseAngle ?? `${config.regionLabel} 상속등기 상담`,
    `${config.regionLabel} 법인등기·임원변경`,
    `${config.regionLabel} 부동산 매매 등기`,
  ];

  const consultationCases = caseAngles.slice(0, 3).map((angle, i) => ({
    title: `${config.regionLabel} 상담 사례 ${i + 1}`,
    summary: `최근 ${config.regionLabel}에서 상담한 사례입니다. ${angle}. 의뢰인 상황에 맞춰 관할 기관·필요 서류·예상 기간·비용을 단계별로 안내하고 진행했습니다.`,
    href: config.relatedCaseSlug ? `/services/cases/${config.relatedCaseSlug}` : undefined,
  }));

  const faqs: ServiceFaq[] = [
    {
      question: `${config.regionLabel} 법무사는 어디에 있나요?`,
      answer: `다옴법무사사무소는 부산 해운대구 센텀에 있으며, ${config.regionLabel}·${neighborhoodText} 일대 의뢰인을 전화·카카오톡·네이버 예약으로 상담합니다.`,
    },
    {
      question: `${config.regionLabel}에서 방문 없이 진행할 수 있나요?`,
      answer: `가능한 사건은 서류를 우편·이메일·카카오톡으로 받아 원격 진행합니다. 상속·회생 등은 초기 상담을 권합니다.`,
    },
    {
      question: `${config.regionLabel} 관할 등기소는 어디인가요?`,
      answer: getJurisdictionGuide(config).jurisdictionNote,
    },
    {
      question: `${config.regionLabel} 법무사 비용은 얼마인가요?`,
      answer: `사건 유형·부동산 가액·상속인 수에 따라 다릅니다. 상담 후 항목별 견적을 투명하게 안내합니다.`,
    },
    {
      question: `상속·법인·부동산 중 무엇부터 상담해야 하나요?`,
      answer: `기한이 있는 상속포기·한정승인(3개월)이나 임원변경 과태료가 우려되면 해당 절차부터, 그 외에는 등기부·가족관계증명서를 준비해 상담하시면 순서를 정리해 드립니다.`,
    },
    {
      question: `여성 법무사 상담이 가능한가요?`,
      answer: `네. 안윤정 법무사가 직접 상담·진행합니다.`,
    },
  ];

  if (service) {
    faqs.push(...service.faqs.slice(0, 2));
  }

  return {
    slug: config.slug,
    path: `/${config.slug}`,
    pageType: "region-hub",
    serviceSlug: config.serviceSlug,
    title,
    h1: `${config.regionLabel} 법무사 상담 — 다옴법무사사무소`,
    description: `${config.regionLabel}(${neighborhoodText}) 법무사 — 상속등기·법인등기·부동산등기·개인회생. 다옴법무사사무소 안윤정 법무사. 전화·카카오톡·네이버 예약.`,
    regionLabel: config.regionLabel,
    regionKey: config.regionKey,
    neighborhoods: config.neighborhoods,
    problemStatement,
    whenNeeded,
    jurisdictionGuide: getJurisdictionGuide(config),
    consultationCase: consultationCases[0],
    consultationCases,
    legalIssues: [
      `${config.regionLabel} 사건에서도 상속인 협의·저당권 정리가 선행되어야 합니다.`,
      `관할 등기소·법원을 잘못 선택하면 접수 지연이 발생할 수 있습니다.`,
      `상속 개시 3개월 기한·임원변경 등기 기한을 놓치면 불이익이 있습니다.`,
      `${config.regionLabel} 특유의 재개발·신도시 이슈는 권리 관계 확인이 필요합니다.`,
    ],
    precautions: [
      "법원·등기소와 ‘공식 제휴’ 관계가 아닙니다. 관할·접수 절차·준비서류를 실무 관점에서 안내합니다.",
      "인터넷 검색만으로 서류를 준비하면 누락·오류가 잦습니다. 사건 유형별 체크리스트를 받아 진행하세요.",
      "가족 간 감정 문제는 법적 절차와 분리해, 기한과 서류를 우선 정리하는 것이 좋습니다.",
    ],
    procedures: service?.procedures ?? [
      "전화·카카오톡·방문(예약) 상담",
      "등기부·가족관계증명서 등 기본 서류 확인",
      "관할 기관·필요 서류·비용 안내",
      "신청서 작성·접수 대리",
      "등기·접수 완료 확인",
    ],
    documents: service?.documents ?? ["등기부등본", "가족관계증명서", "인감증명서", "신분증"],
    costGuide: `${config.regionLabel} 의뢰 사건도 사건 유형별로 법무사 수임료·등기 수수료·세금을 분리해 안내합니다. ${serviceLabel} 비용은 부동산 가액·상속인 수·채무 규모에 따라 달라지므로 상담 후 견적을 드립니다.`,
    faqs: faqs.slice(0, 10),
    lawyerOpinion: buildLawyerOpinion(config.regionLabel, "상속·등기·법인"),
    directionsNote: buildDirectionsNote(config),
    ctaDescription: consultationCopy.default,
    relatedBlogHrefs: getRelatedBlogPosts(config.serviceSlug),
    relatedServiceLinks: [],
    relatedRegionLinks: (config.linkedNeighborhoodSlugs ?? []).map((slug) => ({
      href: `/${slug}`,
      label: slug,
    })),
  };
}

function buildConversionPage(config: LocalLandingConfig): LocalLandingPage | null {
  const topic = config.conversionKey ? conversionTopics[config.conversionKey] : null;
  if (!topic) return null;

  const service = getServiceBySlug(topic.serviceSlug);
  const serviceLabel = serviceLabels[topic.serviceSlug] ?? topic.title;
  const neighborhoods = config.neighborhoods.join(", ");

  const problemStatement = `부산에서 ${topic.title}을(를) 검색하시는 분들은 대부분 실제 부담 금액과 준비 기간을 알고 싶어 하십니다. ${topic.focusKeywords.join(", ")} 관련 비용은 사건마다 다릅니다. 부동산 가액·상속인 수·채무 규모·법인 규모·저당권 말소 여부 등에 따라 법무사 수임료와 등기신청 수수료·세금이 달라집니다. 다옴법무사사무소는 ${neighborhoods} 일대를 포함한 부산 전역 의뢰인에게 항목별 견적을 투명하게 안내합니다. 숨겨진 비용 없이 상담 후 예상 범위를 설명해 드립니다.`;

  const whenNeeded = [
    `${serviceLabel}를 진행하기 전 예상 비용을 비교하고 싶을 때`,
    `가족·동업자와 비용 분담을 논의해야 할 때`,
    `등기 수수료·세금·법무사 보수를 구분해 알고 싶을 때`,
    `보정·과태료 등 추가 비용 가능성을 확인하고 싶을 때`,
  ];

  const consultationCases = [
    {
      title: `${topic.title} 상담 사례`,
      summary: `최근 부산 ${neighborhoods} 거주 의뢰인이 ${serviceLabel} 비용을 문의하셨습니다. ${config.caseAngle ?? "등기부와 상황을 확인한 뒤"} 법무사 수임료·등기 수수료·세금을 항목별로 안내하고 진행 여부를 결정하셨습니다.`,
    },
    {
      title: `복합 사건 견적 사례`,
      summary: `상속등기와 저당권 말소가 함께 필요한 사건에서 단계별 비용을 미리 안내해 일정과 예산을 맞춘 사례입니다.`,
    },
    {
      title: `원격 상담 후 견적 사례`,
      summary: `카카오톡으로 등기부·가족관계증명서를 보내주신 뒤 대략 견적을 드리고, 방문 없이 진행한 사례입니다.`,
    },
  ];

  const faqs: ServiceFaq[] = [
    {
      question: `${topic.title}은 얼마나 드나요?`,
      answer: topic.costFactors.join(" "),
    },
    {
      question: `법무사 수임료와 등기 수수료는 별도인가요?`,
      answer: "네. 법무사 수임료, 등기신청 수수료, 등록면허세·취득세 등 세금은 별도 항목입니다.",
    },
    {
      question: `견적은 어떻게 받나요?`,
      answer: "전화·카카오톡·방문 상담 후 사건 내용을 확인하고 항목별로 안내합니다.",
    },
    {
      question: `추가 비용이 발생할 수 있나요?`,
      answer: "보정명령·저당권 말소·해외 상속인 인증 등 부가 업무가 있으면 추가될 수 있으며, 사전에 설명합니다.",
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

  return {
    slug: config.slug,
    path: `/${config.slug}`,
    pageType: "conversion",
    serviceSlug: topic.serviceSlug,
    title: topic.title,
    h1: `${topic.title} 안내 — 부산 다옴법무사사무소`,
    description: `부산 ${topic.title} — 법무사 수임료·등기 수수료·세금 항목별 안내. 다옴법무사사무소 안윤정 법무사. ${neighborhoods} 상담 가능.`,
    regionLabel: config.regionLabel,
    regionKey: config.regionKey,
    neighborhoods: config.neighborhoods,
    problemStatement,
    whenNeeded,
    jurisdictionGuide: getJurisdictionGuide(config),
    consultationCase: consultationCases[0],
    consultationCases,
    legalIssues: topic.costFactors.map((f) => `비용 산정 시 ${f}`),
    precautions: [
      "최저가만 비교하기보다 포함 항목(말소·보정·세금 신고 등)을 확인하세요.",
      "인터넷 평균 비용과 실제 사건 비용은 차이가 날 수 있습니다.",
      "견적은 사건 내용 확인 후에만 유효합니다.",
    ],
    procedures: [
      "상담(전화·카카오톡·방문)",
      "등기부·관련 서류 확인",
      "항목별 견적 안내",
      "진행 여부 결정 후 서류 준비",
      "접수·완료",
    ],
    documents: topic.documentList,
    costGuide: `${topic.title}: ${topic.costFactors.join(" ")} ${topic.timelineNotes.join(" ")}`,
    faqs: faqs.slice(0, 10),
    lawyerOpinion: buildLawyerOpinion("부산", topic.title),
    directionsNote: buildDirectionsNote(config),
    ctaDescription: "비용·절차가 궁금하시면 카카오톡으로 등기부·상황을 보내주시면 대략적인 비용과 순서를 안내해 드립니다.",
    relatedBlogHrefs: getRelatedBlogPosts(topic.serviceSlug),
    relatedServiceLinks: [],
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
      title: `${inst.institutionName} 접수 전 상담`,
      summary: `최근 ${config.regionLabel} 의뢰인이 ${inst.institutionName} 접수 전 관할과 서류를 확인하셨습니다. ${config.caseAngle ?? "필요 서류를 정리한 뒤"} 접수까지 진행했습니다.`,
    },
    {
      title: `보정명령 대응 사례`,
      summary: `신청서 보완이 필요한 사건에서 보정 기한 내 서류를 준비해 재접수한 사례입니다.`,
    },
    {
      title: `원격 서류 준비 사례`,
      summary: `방문 전 카카오톡으로 서류를 검토하고, 당일 접수만 방문하신 사례입니다.`,
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
    relatedServiceLinks: inst.relatedServiceSlugs.map((slug) => ({
      href: `/services/${slug}`,
      label: serviceLabels[slug] ?? slug,
    })),
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
    relatedRegionLinks: [],
  };
}

function buildRealEstateDevPage(config: LocalLandingConfig): LocalLandingPage | null {
  const topic = config.realEstateDevKey ? realEstateDevTopics[config.realEstateDevKey] : null;
  if (!topic) return null;

  const service = getServiceBySlug(topic.serviceSlug);
  const serviceLabel = serviceLabels[topic.serviceSlug] ?? topic.title;
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
      summary: `최근 ${config.regionLabel} 의뢰인이 ${topic.title}를 문의하셨습니다. ${config.caseAngle ?? topic.legalPoints[0]}`,
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
    h1: `${topic.title} — 부산 법무사 상담`,
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
