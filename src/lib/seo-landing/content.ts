import { getSeoEntityById } from "@/data/seo";
import { CONTENT_PROFILES } from "@/lib/hub/content-profiles";
import { resolvePageTheme } from "@/lib/hub/resolve";
import { lawyerProfileMeta } from "@/lib/lawyer-profile";
import { officeLocation } from "@/lib/office-location";
import type { PageFaqItem, PageSection } from "@/lib/pageData/types";
import type { SeoLandingSpec } from "./types";

function hashSeed(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i += 1) {
    h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return h;
}

function pick<T>(items: T[], seed: string, offset = 0): T {
  const index = (hashSeed(`${seed}:${offset}`) % items.length + items.length) % items.length;
  return items[index]!;
}

function regionContext(regionId?: string): string {
  const region = regionId ? getSeoEntityById(regionId) : undefined;
  return region?.description ?? "부산은 관할 법원·등기소가 사건별로 달라 사전 정리가 중요한 지역입니다.";
}

function serviceContext(serviceId?: string): string {
  const service = serviceId ? getSeoEntityById(serviceId) : undefined;
  return service?.description ?? "사건 유형에 따라 필요 서류와 진행 순서가 달라집니다.";
}

function institutionContext(institutionId?: string): string {
  const inst = institutionId ? getSeoEntityById(institutionId) : undefined;
  return inst?.description ?? "관할 기관과 접수 창구를 먼저 확인하는 것이 좋습니다.";
}

function introForSpec(spec: SeoLandingSpec): string {
  const lawyer = lawyerProfileMeta.name;
  const office = officeLocation.areaLabel;

  switch (spec.type) {
    case "region-lawyer":
      return `${spec.regionLabel}에서 상속등기·부동산등기·법인등기·개인회생·파산 등을 검토하실 때, 관할과 서류를 먼저 정리하면 불필요한 재방문을 줄일 수 있습니다. ${regionContext(spec.regionId)} ${office}에 있는 다옴법무사사무소 ${lawyer} 법무사는 ${spec.regionLabel} 의뢰인 사건을 전화·카카오톡·방문(예약)으로 상담합니다.`;
    case "region-service":
      return `${spec.regionLabel}에서 ${spec.serviceName} 문의는 부동산 소재지·채무 여부·상속인 협의 상태에 따라 준비 순서가 달라집니다. ${regionContext(spec.regionId)} ${serviceContext(spec.serviceId)} 상담 시 필요한 서류 목록과 예상 일정·비용 범위를 항목별로 설명드립니다.`;
    case "service-intent":
      return `${spec.serviceName} ${spec.intentSuffix}을(를) 검색하신 경우, 사건 복잡도에 따라 답이 달라지는 경우가 많습니다. ${serviceContext(spec.serviceId)} 다옴법무사사무소는 부산 전역 사건을 다루며, ${spec.intentSuffix} 관련해서는 확인된 사실을 바탕으로 범위를 나눠 안내합니다.`;
    case "institution-lawyer":
      return `${spec.institutionName} 인근에서 법무사를 찾으시는 경우, 사건 종류(민사·가사·등기·회생)에 따라 준비 서류가 달라집니다. ${institutionContext(spec.institutionId)} 방문 전에 신청서·위임장·인감증명서 등을 정리해 두면 접수가 수월합니다.`;
    case "institution-service":
      return `${spec.institutionShortName}와(과) 관련된 ${spec.serviceName} 사건은 관할과 제출 서류를 먼저 맞추는 것이 중요합니다. ${institutionContext(spec.institutionId)} ${serviceContext(spec.serviceId)}`;
    case "special":
      return `${spec.title} 관련 문의는 검색 키워드만으로 절차가 결정되지 않는 경우가 많습니다. ${serviceContext(spec.serviceId)} ${regionContext(spec.regionId)} 다옴법무사사무소는 상황을 듣고 필요한 다음 단계부터 정리해 드립니다.`;
    default:
      return `${spec.title} 관련 상담을 안내합니다.`;
  }
}

function buildSections(spec: SeoLandingSpec): PageSection[] {
  const region = spec.regionLabel ?? "부산";
  const service = spec.serviceName ?? "등기·송무";
  const intent = spec.intentSuffix ?? "";
  const theme = resolvePageTheme({
    slug: spec.slug,
    path: spec.path,
    category: spec.category,
    serviceSlug: spec.serviceSiteSlug,
    regionKey: spec.regionKey,
    seoLandingType: spec.type,
    intentSuffix: spec.intentSuffix,
  });
  const profile = CONTENT_PROFILES[theme];

  const procedureVariants = [
    `① ${region} 사건의 관할(법원·등기소)을 확인합니다. ② 필요 서류·기한을 정리합니다. ③ 신청서·위임장을 검토한 뒤 접수·보정을 지원합니다. ④ 완료 후 등기부·접수증 등 결과를 공유합니다.`,
    `${region}에서 ${service} 진행 시 가족관계·재산·채무 여부를 먼저 파악합니다. 이후 협의서·신고서 작성, 세금·수수료 안내, 접수까지 단계별로 일정을 잡습니다.`,
    `상담 단계에서는 사실관계를 정리하고, 서류가 모이면 접수 준비를 합니다. ${intent ? `${intent} 관련해서는 사건별로 달라질 수 있어 일괄 단정하지 않습니다.` : "보정명령이 나오면 추가 서류를 신속히 준비합니다."}`,
  ];

  const costVariants = [
    `${service} 비용은 사건 난이도·부동산 가액·상속인 수·채무 규모에 따라 달라집니다. 법무사 수임료와 등기신청 수수료·세금을 구분해 설명하며, 상담 후 항목별 견적을 드립니다.`,
    `협회 보수 기준을 참고하되, 실제 수임료는 서류 상태와 추가 업무(말소·보정·해외 상속인 등)에 따라 조정됩니다. ${intent === "비용" || intent === "보수표" ? "견적은 투명하게 안내합니다." : "비용 문의는 상담 시 구체화됩니다."}`,
  ];

  const documentVariants = [
    `흔히 필요한 서류는 신분증·인감증명서·등기부등본·가족관계증명서 등이며, ${service} 원인에 따라 매매계약서·협의분할서·재산목록이 추가될 수 있습니다.`,
    `${region} 사건에서 해외 거주 상속인·공동명의·저당권이 있으면 위임장·동의서·말소 서류가 추가됩니다. 상담 시 체크리스트로 정리해 드립니다.`,
  ];

  const localVariants = [
    `${region}은(는) ${pick(["아파트·상가", "법인 사옥·오피스", "토지·전원주택", "전월세·매매"], spec.seed, 1)} 관련 문의가 많습니다. 관할 등기소와 법원이 다를 수 있어 소재지 기준 확인이 우선입니다.`,
    `${lawyerProfileMeta.name} 법무사는 ${officeLocation.areaLabel}에 있는 다옴법무사사무소에서 ${region} 포함 부산 전역 사건을 상담합니다. 급한 기한이 있으면 우선순위부터 정리합니다.`,
  ];

  const sections: PageSection[] = [
    {
      title: profile.sectionTitles[0] ?? `${region} ${service} 안내`,
      body: `${profile.focusNote} ${pick(procedureVariants, spec.seed, 2)}`,
    },
    {
      title: profile.sectionTitles[1] ?? "비용·기한 참고",
      body: pick(costVariants, spec.seed, 3),
      items:
        intent === "기한" || intent === "기간"
          ? [
              "상속포기·한정승인은 상속 개시 후 3개월 내 검토가 중요합니다. 상속등기·취득세 신고는 별도 기준으로 확인합니다.",
              "임원변경등기는 결의일로부터 등기 기한을 지키는 것이 좋습니다.",
              "개인회생·파산은 신청서 보정 기한을 놓치지 않도록 일정을 관리합니다.",
            ]
          : intent === "과태료"
            ? [
                "등기·신고 지연 시 과태료가 부과될 수 있습니다.",
                "결의·신고 기한을 확인한 뒤 신속히 접수하는 것이 좋습니다.",
              ]
            : undefined,
    },
    {
      title: "준비 서류",
      body: pick(documentVariants, spec.seed, 4),
    },
    {
      title: profile.sectionTitles[2] ?? `${region} 지역 특성`,
      body: pick(localVariants, spec.seed, 5),
    },
  ];

  if (spec.institutionName) {
    sections.push({
      title: `${spec.institutionName} 관련 실무 포인트`,
      body: `${institutionContext(spec.institutionId)} 접수 전 사건번호·창구·수수료 납부 방법을 확인하고, 위임장·인감증명서 누락을 방지합니다.`,
    });
  }

  if (spec.isHub) {
    sections.push(
      {
        title: "다옴법무사사무소 상담 안내",
        body: `해운대구 센텀에 위치한 다옴법무사사무소는 ${region}을(를) 포함해 부산 전역 상속·등기·회생 사건을 다룹니다. 전화·카카오톡·네이버 톡톡으로 간단히 상황을 남기시면, 필요한 준비부터 차분히 정리해 드립니다.`,
        items: [
          "상속등기·상속포기·한정승인",
          "부동산등기·소유권이전등기",
          "법인등기·설립·임원변경",
          "개인회생·개인파산",
        ],
      },
      {
        title: "의뢰인께 드리는 말씀",
        body: `막막할수록 지금 무엇부터 해야 하는지부터 정리하는 것이 우선이라고 생각합니다. ${lawyerProfileMeta.fullTitle}은(는) ${lawyerProfileMeta.practiceAreas.slice(0, 4).join("·")} 등을 다루며, ${region} 사건에서도 절차·비용·기한을 알기 쉽게 설명드립니다.`,
      },
    );
  }

  return sections;
}

function buildFaqs(spec: SeoLandingSpec): PageFaqItem[] {
  const region = spec.regionLabel ?? "부산";
  const service = spec.serviceName ?? "법무사 업무";

  const faqs: PageFaqItem[] = [
    {
      question: `${region}에서 ${spec.title} 상담은 어디서 받나요?`,
      answer: `다옴법무사사무소는 ${officeLocation.fullAddress}에 있으며, ${region} 사건도 전화·카카오톡·방문(예약)으로 상담합니다.`,
    },
    {
      question: `${service} 비용은 어떻게 안내되나요?`,
      answer:
        "사건 복잡도에 따라 달라집니다. 서류를 확인한 뒤 법무사 수임료와 등기·법원 비용을 구분해 설명드립니다.",
    },
  ];

  if (spec.intentSuffix) {
    faqs.push({
      question: `${spec.serviceName} ${spec.intentSuffix}은(는) 어디서 확인하나요?`,
      answer: `사건별로 달라 일괄 금액을 단정하기 어렵습니다. 상담 시 ${spec.intentSuffix} 범위를 항목별로 정리해 드립니다.`,
    });
  } else {
    faqs.push({
      question: "방문 없이도 진행할 수 있나요?",
      answer:
        "가능한 사건은 서류를 우편·전자·카카오톡으로 받아 원격으로 진행합니다. 초기 상황 설명을 위해 상담을 권하는 경우도 있습니다.",
    });
  }

  return faqs;
}

export function buildSeoLandingContent(spec: SeoLandingSpec) {
  return {
    intro: introForSpec(spec),
    introParagraphs: [
      regionContext(spec.regionId),
      serviceContext(spec.serviceId),
      spec.institutionId ? institutionContext(spec.institutionId) : `${spec.regionLabel ?? "부산"} 의뢰인 사례에서 관할·서류·기한을 함께 검토합니다.`,
    ],
    sections: buildSections(spec),
    faqs: buildFaqs(spec),
    consultationExample: {
      title: `${spec.regionLabel ?? "부산"} ${spec.title} 상담 예시`,
      body: `최근 ${spec.regionLabel ?? "부산"}에서 ${spec.title} 관련 문의가 있었습니다. 먼저 가족관계·재산·채무·관할을 확인했고, 급한 기한이 있으면 우선순위를 정리했습니다. 준비 서류 목록과 예상 일정·비용 범위를 단계별로 안내한 뒤, 서류가 모이면 접수까지 이어서 진행했습니다.`,
    },
    procedures: [
      `${spec.regionLabel ?? "부산"} 사건의 관할(법원·등기소)과 기한을 확인합니다.`,
      "필요 서류·협의 사항을 정리하고 신청서·위임장을 검토합니다.",
      "접수 후 보정·진행 상황을 공유하고 완료·후속 조치를 안내합니다.",
    ],
    documents: [
      "신분증·인감증명서(사건에 따라 주민등록등본 등)",
      "등기부등본·계약서·협의서 등 사건 관련 핵심 서류",
      "가족관계증명서·재산 목록(상속·가사 해당 시)",
    ],
    consultationPoints: spec.keywords.slice(0, 5),
    minContentLength: spec.isHub ? 2500 : 1500,
  };
}
