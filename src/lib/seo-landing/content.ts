import { getSeoEntityById } from "@/data/seo";
import { CONTENT_PROFILES } from "@/lib/hub/content-profiles";
import { resolvePageTheme } from "@/lib/hub/resolve";
import { lawyerProfileMeta } from "@/lib/lawyer-profile";
import { officeLocation } from "@/lib/office-location";
import type { PageFaqItem, PageSection } from "@/lib/pageData/types";
import { getLocalChampionOverlay } from "@/data/seo/local-champion-overlays";
import { getSeoLandingSlugOverlay } from "@/data/seo/region-service-overlays";
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
  const region = spec.regionLabel ?? "부산";
  const seed = spec.seed;

  switch (spec.type) {
    case "region-lawyer": {
      const openings = [
        `${region}에서 상속등기·부동산등기·법인등기·개인회생·파산을 검토할 때는 관할과 서류를 먼저 맞추는 것이 재방문을 줄입니다.`,
        `${region} 생활권에서 법무사 상담을 찾을 때, 먼저 확인할 것은 사무소 브랜드보다 사건 관할·기한·준비 서류입니다.`,
        `${region} 의뢰인이 자주 묻는 지점은 ‘어디 등기소인지’와 ‘지금 당장 놓치면 안 되는 기한’입니다.`,
      ];
      return `${pick(openings, seed, 0)} ${regionContext(spec.regionId)} ${office} 다옴법무사사무소 ${lawyer} 법무사는 ${region} 사건을 전화·카카오톡·방문(예약)으로 상담합니다.`;
    }
    case "region-service": {
      const openings = [
        `${region} ${spec.serviceName} 문의는 소재지·채무·협의 상태에 따라 준비 순서가 달라집니다.`,
        `${region}에서 ${spec.serviceName}을(를) 진행하려면 관할 확인 후 서류 체크리스트부터 잡는 편이 안전합니다.`,
        `${spec.serviceName}을(를) ${region} 기준으로 볼 때는 동일 절차라도 등기소·법원 창구가 사건별로 갈릴 수 있습니다.`,
      ];
      return `${pick(openings, seed, 0)} ${regionContext(spec.regionId)} ${serviceContext(spec.serviceId)} 상담 시 서류·일정·비용 범위를 항목별로 안내합니다.`;
    }
    case "service-intent": {
      const intentBlock = intentFocusBlock(spec);
      const openings = [
        intentBlock ??
          `${spec.serviceName} ${spec.intentSuffix} 검색 결과는 사건 복잡도에 따라 답이 달라지는 경우가 많습니다.`,
        `${spec.intentSuffix}만 보고 단정하기보다, ${spec.serviceName}의 사실관계·기한·관할을 먼저 나눠 보는 것이 실무적입니다.`,
      ];
      return `${pick(openings, seed, 0)} ${serviceContext(spec.serviceId)} 다옴법무사사무소는 부산 전역 사건을 다루며 ${spec.intentSuffix} 관련 범위를 항목별로 정리합니다.`;
    }
    case "institution-lawyer": {
      const openings = [
        `${spec.institutionName} 인근에서 법무사를 찾을 때는 거리보다 사건 종류(등기·회생·가사)에 맞는 서류 준비가 우선입니다.`,
        `${spec.institutionName} 관련 접수를 앞두고 있다면 창구·수수료·위임 서류부터 점검하는 것이 좋습니다.`,
        `${spec.institutionName} 근처 검색으로 들어왔더라도, 실제 관할과 접수 방식이 맞는지가 핵심입니다.`,
      ];
      return `${pick(openings, seed, 0)} ${institutionContext(spec.institutionId)} 방문 전 신청서·위임장·인감증명서를 정리해 두면 접수가 수월합니다.`;
    }
    case "institution-service":
      return `${spec.institutionShortName}와(과) 관련된 ${spec.serviceName} 사건은 관할과 제출 서류를 먼저 맞추는 것이 중요합니다. ${institutionContext(spec.institutionId)} ${serviceContext(spec.serviceId)}`;
    case "special":
      return `${spec.title} 관련 문의는 검색 키워드만으로 절차가 결정되지 않는 경우가 많습니다. ${serviceContext(spec.serviceId)} ${regionContext(spec.regionId)} 다옴법무사사무소는 상황을 듣고 다음 단계부터 정리합니다.`;
    default:
      return `${spec.title} 관련 상담을 안내합니다.`;
  }
}

/** 지역명 strip 후에도 남는 고유 각도 — 유사도 완화용 */
function uniqueAngleBlock(spec: SeoLandingSpec): string {
  const service = spec.serviceName ?? "등기·송무";
  const intent = spec.intentSuffix ?? "";
  const angles = [
    `${service}에서는 신청인·의무자·권리자 표기를 서류마다 맞추는 것이 보정 예방에 중요합니다.`,
    `${service} 접수 전에는 원인서류(계약·협의·결의)와 등기원인 문구가 일치하는지 먼저 봅니다.`,
    `${service}에서 근저당·전세권·가압류가 있으면 말소·승계 순서를 본등기와 함께 설계합니다.`,
    `${service}는 세금·수수료·수임료를 한 줄로 합치지 않고 항목별로 설명하는 편이 오해가 적습니다.`,
    intent
      ? `${service} ${intent} 문의는 견적 숫자보다 포함 범위(보정·말소·추가 상속인)를 먼저 확정합니다.`
      : `${service} 일정은 ‘서류 완비일’과 ‘관할 접수 가능일’을 구분해 안내합니다.`,
    `${service} 원격 진행 가능 여부는 전자등기·위임·본인확인 필요 여부에 따라 달라집니다.`,
    `${service}에서 공동명의·미성년·해외 거주가 있으면 동의·특별대리·인증 서류가 추가됩니다.`,
    `${service} 상담 메모에는 주소·날짜·당사자 관계만 적어도 1차 체크리스트를 만들 수 있습니다.`,
  ];
  return `${pick(angles, spec.seed, 30)} ${pick(angles, spec.seed, 31)}`;
}

/** serviceId별 고정 포인트 — 동일 업무×다른 지역 유사도 완화 */
function serviceFocusLines(serviceId?: string): string[] {
  const map: Record<string, string[]> = {
    "real-estate-registration": [
      "매매·증여·교환 원인에 따라 계약서·검인·취득세 순서가 달라집니다.",
      "잔금일·인도일·대출 실행일을 한 표로 맞춰야 접수 누락이 줄어듭니다.",
      "공동명의·미성년 매수인은 동의·특별대리 서류를 별도 점검합니다.",
    ],
    "ownership-transfer": [
      "소유권이전은 등기원인과 매도·매수 당사자 표기가 핵심입니다.",
      "근저당 승계·말소 여부를 이전 접수와 같은 일정에 둘지 먼저 정합니다.",
      "검인·취득세 완납 증빙이 빠지면 접수가 멈출 수 있습니다.",
    ],
    "inheritance-registration": [
      "상속등기 전에 단순승인·한정승인·포기 여부를 먼저 가립니다.",
      "상속인 전원 협의와 상속인 범위 확인이 서류 목록을 결정합니다.",
      "취득세·등록면허세는 등기 접수와 별도 일정으로 관리합니다.",
    ],
    "inheritance-renunciation": [
      "상속포기는 가정법원 신고이며 3개월 기한이 핵심입니다.",
      "후순위 상속인 효과와 가족 간 사전 조율을 함께 안내합니다.",
      "부동산 등기 일정과 포기 신고를 혼동하지 않도록 분리해 설명합니다.",
    ],
    "qualified-acceptance": [
      "한정승인은 재산 목록·채무 목록 작성이 중심입니다.",
      "안심상속 조회 후 승인 방식을 정하는 흐름을 권합니다.",
      "한정승인 후 상속등기·변제 순서는 사건별로 다시 설계합니다.",
    ],
    "corporate-registration": [
      "법인등기는 본점 주소·상호·목적·임원 구성이 등기부와 일치해야 합니다.",
      "설립·임원변경·본점이전·목적변경은 결의·공증 요건이 다릅니다.",
      "과태료 리스크가 있는 변경은 결의일부터 역산해 일정을 잡습니다.",
    ],
    "company-establishment": [
      "설립은 상호·목적·자본금·임원·본점 확정이 선행됩니다.",
      "정관·인감·잔고증명 등 준비 순서에 따라 접수일이 달라집니다.",
      "사업자등록·인허가와 등기 완료 시점을 맞춰 안내합니다.",
    ],
    "director-change": [
      "임원변경은 결의일·취임승낙·인감이 맞아야 보정이 줄어듭니다.",
      "사임·취임·중임이 섞이면 등기 원인을 분리해 작성합니다.",
      "등기 지연 시 과태료 가능성을 일정과 함께 안내합니다.",
    ],
    "personal-rehabilitation": [
      "개인회생은 소득·채무·재산 목록의 정합성이 신청서 품질을 좌우합니다.",
      "금지명령·개시결정 전후 해야 할 일을 단계별로 나눕니다.",
      "변제계획안 보정 기한을 놓치지 않도록 일정표를 둡니다.",
    ],
    bankruptcy: [
      "개인파산·면책은 재산·면책불허가 사유 점검이 선행됩니다.",
      "회생과 파산 중 어떤 경로가 맞는지 사실관계로 가릅니다.",
      "신청 전 처분·이체 이력이 있으면 별도 설명이 필요할 수 있습니다.",
    ],
  };
  return (
    map[serviceId ?? ""] ?? [
      "관할·당사자·원인서류·기한을 먼저 맞추는 것이 공통 포인트입니다.",
      "수임료와 관공서 비용을 구분해 안내합니다.",
      "원격·방문 가능 여부는 본인확인·전자접수 요건에 따라 달라집니다.",
    ]
  );
}

function exclusiveClusterBody(spec: SeoLandingSpec): string {
  const clusters = [
    "잔금·인도·대출 실행 일정을 한 줄에 두고 등기 접수를 맞춥니다. 중도금 연체가 있으면 계약 특약을 먼저 확인합니다.",
    "등기원인 문구와 검인·취득세 완납 증빙이 일치하는지 접수 직전에 재확인합니다. 공동매수면 지분 표기를 맞춥니다.",
    "말소할 근저당·전세권 목록을 본등기 신청서와 같은 묶음으로 준비합니다. 채권자 협의 필요 여부를 표시합니다.",
    "전자등기 가능 사건과 방문 열람이 필요한 사건을 분리해 일정을 잡습니다. 보정 대응 창구를 미리 적어 둡니다.",
    "수임·등록면허세·지방교육세·수수료 칸을 나눈 견적 초안을 상담 후 공유합니다. 추가 보정 비용은 별도 줄입니다.",
    "미성년·해외·연락두절 당사자가 있으면 위임·특별대리·공시송달 검토 여부를 체크합니다.",
    "다수 필지·다수 계좌면 목록 번호를 매겨 누락을 줄입니다. 완료 후 등기필정보 전달 방식을 정합니다.",
    "이미 소송·가압류가 있으면 등기 가능 시점부터 다시 설계합니다. 단순 매매 일정과 섞지 않습니다.",
    "법인 결의·취임승낙·인감 원본을 대조하고, 과태료 기한을 결의일부터 역산합니다.",
    "상속 승인 방식(단순·한정·포기)을 등기 일정과 분리해 먼저 가립니다. 3개월 기한을 별도 표시합니다.",
    "회생·파산 경로에서는 소득·재산·채무 목록 정합성을 신청서 품질의 기준으로 둡니다.",
    "산업단지·재개발·재건축처럼 특수한 권리관계는 일반 매매 체크리스트와 항목을 나눕니다.",
  ];
  return [1, 4, 7].map((off) => pick(clusters, spec.seed, off)).join(" ");
}

function seededLocalChecklist(spec: SeoLandingSpec): string[] {
  const pool = [
    "상담 메모에 잔금·결의·상속 개시처럼 날짜가 있으면 맨 위에 적습니다.",
    "등기부등본이 없어도 주소만으로 1차 관할·서류 목록을 만들 수 있습니다.",
    "공동명의·미성년·해외 거주가 있으면 동의·위임 서류를 별도 줄로 표시합니다.",
    "근저당·전세권·가압류 유무는 본등기 일정과 같은 표에 둡니다.",
    "전자등기 가능 여부와 방문 보정 가능성을 처음에 구분해 둡니다.",
    "수임료·세금·수수료를 한 금액으로 합치지 말고 항목 칸을 나눕니다.",
    "보정 명령이 나오면 추가 서류 목록을 즉시 갱신합니다.",
    "발급에 시간 걸리는 서류(가족관계·법인등기부)를 먼저 표시합니다.",
    "상담 채널과 서류 전달 방법을 미리 정해 둡니다.",
    "인감증명서 용도·유효기간을 체크합니다.",
    "다수 부동산·다수 계좌면 목록 표를 만들어 누락을 줄입니다.",
    "진행 중인 대출·매매가 있으면 연동 순서를 문의 시 알려 주세요.",
    "관공서 수수료 납부 방법도 일정에 포함해 안내합니다.",
    "검색 유입 생활권과 실제 사건 주소가 다르면 관할을 바꿉니다.",
    "완료 후 등기필·접수증 전달 방식(메일·카카오·방문)을 정합니다.",
  ];
  return [0, 1, 2, 3, 4].map((i) => pick(pool, spec.seed, 60 + i));
}

/** intentSuffix별 고유 초점 — 필요서류 vs 준비서류, 비용 vs 보수표 등 */
function intentFocusBlock(spec: SeoLandingSpec): string | null {
  const intent = spec.intentSuffix;
  if (!intent) return null;
  const service = spec.serviceName ?? "해당 업무";
  const banks: Record<string, string[]> = {
    필요서류: [
      `${service} ‘필요서류’ 안내는 접수에 반드시 붙는 핵심 서류(신분·인감·원인서류·관할 확인용 주소) 중심으로 정리합니다.`,
      "없어도 상담은 가능하지만, 접수 단계로 가려면 목록의 ★ 표시 항목부터 채우는 편이 빠릅니다.",
      "이 페이지는 ‘무엇을 준비해야 접수가 되는지’에 초점을 둡니다. 일정·비용은 별도 안내를 참고하세요.",
    ],
    준비서류: [
      `${service} ‘준비서류’ 안내는 상담 전에 모아 두면 좋은 참고 자료(등기부·계약서 사본·가족관계·잔고 등) 중심입니다.`,
      "필수 접수 서류와 달리, 준비서류는 사건 파악용으로 먼저 모아 두면 체크리스트가 짧아집니다.",
      "이 페이지는 ‘상담 전 미리 챙기면 좋은 것’에 초점을 둡니다. 접수 필수 목록은 필요서류 안내와 역할을 나눕니다.",
    ],
    비용: [
      `${service} 비용 안내는 수임료·세금·수수료를 항목별로 나누어 설명하는 데 초점을 둡니다.`,
      "확정 견적은 서류 확인 후 드리며, 이 페이지에서는 구성 항목과 달라지는 조건을 정리합니다.",
      "보수표·협회 기준만 보고 단정하지 않도록, 실제 포함 범위(보정·말소·추가 당사자)를 함께 봅니다.",
    ],
    보수표: [
      `${service} 보수표 안내는 협회·일반 보수 체계를 참고 기준으로 설명합니다.`,
      "실제 수임은 사건 난이도에 따라 조정될 수 있어, 보수표=최종 견적이 아닙니다.",
      "비용 구성(세금·수수료)과 보수표를 혼동하지 않도록 이 페이지에서는 보수 기준 쪽에 초점을 둡니다.",
    ],
    기한: [
      `${service} 기한 안내는 법정·실무상 놓치기 쉬운 날짜(결의일·상속 개시·잔금일)를 중심으로 정리합니다.`,
      "기한이 임박하면 서류 완비보다 우선순위 절차부터 안내합니다.",
    ],
    기간: [
      `${service} 소요 기간 안내는 서류 수집·접수·보정·완료까지 일반적인 흐름을 구간별로 설명합니다.`,
      "사건마다 달라 단정 일정을 약속하지 않으며, 병목 구간을 미리 알려 드립니다.",
    ],
    과태료: [
      `${service} 과태료 관련 안내는 지연 등기·신고가 문제될 수 있는 조건을 중심으로 봅니다.`,
      "이미 기한이 지난 경우에도 다음 조치 선택지를 상담에서 정리합니다.",
    ],
  };
  const lines = banks[intent];
  if (!lines) {
    return `${service} ${intent} 문의는 검색어 의도(${intent})에 맞춰 확인 범위를 좁혀 안내합니다. 단정 견적·단정 일정은 서류 확인 후로 미룹니다.`;
  }
  return lines.join(" ");
}

function parentHubSection(spec: SeoLandingSpec): PageSection | null {
  const region = spec.regionLabel ?? "부산";
  if (spec.type === "region-lawyer" && region !== "부산") {
    return {
      title: `${region}에서 이어 볼 안내`,
      body: `${region} 생활권 안내를 본 뒤에는 부산 전역 선택 가이드와 홈의 업무 허브로 이어가면 검색 의도에 맞는 페이지를 고르기 쉽습니다. exact 상호 검색은 홈을, 지역 생활권 안내는 이 페이지를 기준으로 보시면 됩니다.`,
      links: [
        { href: "/", label: "부산 법무사" },
        { href: "/부산법무사", label: "부산에서 법무사 찾을 때" },
        { href: "/부산법무사상담", label: "부산 법무사 상담" },
      ],
    };
  }
  if (spec.type === "region-service" && spec.serviceName) {
    const serviceLinks: PageSection["links"] = [
      { href: "/부산등기법무사", label: "부산 등기 법무사" },
      { href: "/부산상속법무사", label: "부산 상속 법무사" },
      { href: "/부산법무사상담", label: "상담 안내" },
    ];
    if (spec.serviceName.includes("상속")) {
      serviceLinks.unshift({ href: "/부산상속법무사", label: "부산 상속 법무사 허브" });
    }
    return {
      title: "관련 허브로 이어가기",
      body: `${region} ${spec.serviceName} 세부 안내는 이 페이지에서, 업무 선택·비교는 상위 허브에서 이어집니다.`,
      links: serviceLinks.slice(0, 4),
    };
  }
  if (spec.type === "service-intent") {
    return {
      title: "검색 의도별 다음 안내",
      body: `${spec.serviceName} ${spec.intentSuffix ?? ""} 관련해서는 허브 페이지에서 절차를 고른 뒤, 필요하면 상담으로 이어가면 됩니다.`,
      links: [
        { href: "/부산등기법무사", label: "부산 등기 법무사" },
        { href: "/부산상속법무사", label: "부산 상속 법무사" },
        { href: "/services", label: "업무안내" },
      ],
    };
  }
  return null;
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
    `${region} ${service}는 잔금일·상속 개시일·법인 변경일처럼 ‘날짜’가 있는 사건부터 우선순위를 둡니다. 날짜가 없으면 관할·당사자·권리관계 순으로 정리합니다.`,
    `전자등기·방문 접수·보정 대응을 구분해 안내합니다. ${region} 소재 부동산이라도 관할 등기소가 다를 수 있어 주소 확인이 먼저입니다.`,
  ];

  const costVariants = [
    `${service} 비용은 사건 난이도·부동산 가액·상속인 수·채무 규모에 따라 달라집니다. 법무사 수임료와 등기신청 수수료·세금을 구분해 설명하며, 상담 후 항목별 견적을 드립니다.`,
    `협회 보수 기준을 참고하되, 실제 수임료는 서류 상태와 추가 업무(말소·보정·해외 상속인 등)에 따라 조정됩니다. ${intent === "비용" || intent === "보수표" ? "견적은 투명하게 안내합니다." : "비용 문의는 상담 시 구체화됩니다."}`,
    `${region} ${service} 견적은 ‘고정 패키지’보다 항목별(수임·세금·수수료·추가 보정)로 나누어 설명하는 편이 오해가 적습니다.`,
    `급행·당일 접수·다수 부동산·공동명의가 겹치면 비용 구성이 달라질 수 있습니다. 상담 시 알려 주시면 범위를 먼저 좁힙니다.`,
  ];

  const documentVariants = [
    `흔히 필요한 서류는 신분증·인감증명서·등기부등본·가족관계증명서 등이며, ${service} 원인에 따라 매매계약서·협의분할서·재산목록이 추가될 수 있습니다.`,
    `${region} 사건에서 해외 거주 상속인·공동명의·저당권이 있으면 위임장·동의서·말소 서류가 추가됩니다. 상담 시 체크리스트로 정리해 드립니다.`,
    `서류는 ‘지금 있는 것’과 ‘추가로 발급할 것’을 구분해 안내합니다. ${service}에서 자주 빠지는 항목은 인감증명서 용도·유효기간·공동명의 동의입니다.`,
    `${region} 관할 확인용으로 부동산 주소·법인 본점 주소만 있어도 1차 목록을 만들 수 있습니다. 나머지는 상담 후 보완합니다.`,
  ];

  const localVariants = [
    `${region}은(는) ${pick(["아파트·상가", "법인 사옥·오피스", "토지·전원주택", "전월세·매매", "재개발·재건축 인근"], spec.seed, 1)} 관련 문의가 많습니다. 관할 등기소와 법원이 다를 수 있어 소재지 기준 확인이 우선입니다.`,
    `${lawyerProfileMeta.name} 법무사는 ${officeLocation.areaLabel}에 있는 다옴법무사사무소에서 ${region} 포함 부산 전역 사건을 상담합니다. 급한 기한이 있으면 우선순위부터 정리합니다.`,
    `${region}에서 검색해 들어오신 경우에도, 실제 접수 관할은 부동산 소재지·본점 주소 기준으로 다시 확인합니다. 생활권과 관할이 같지 않을 수 있습니다.`,
    `${region} 인근 교통·업무지구 특성상 잔금일·인도일·법인 결의일이 겹치는 문의가 있습니다. 일정표로 정리하면 누락을 줄일 수 있습니다.`,
  ];

  const angleVariants = [
    `${region} ${service}에서 자주 헷갈리는 지점은 ‘누가 신청인인지’와 ‘지금 당장 막히는 권리(근저당·가압류)가 있는지’입니다.`,
    `검색어만 보고 절차를 단정하지 않습니다. ${region} 사건이라도 상속·매매·증여·법인 변경은 출발 서류가 다릅니다.`,
    `상담 전에는 주소·당사자·희망 일정만 알려 주셔도 ${service} 1차 방향을 잡을 수 있습니다.`,
  ];

  const focusItems = serviceFocusLines(spec.serviceId);
  const intentBody = intentFocusBlock(spec);

  const sections: PageSection[] = [
    {
      title: profile.sectionTitles[0] ?? `${region} ${service} 안내`,
      body: `${exclusiveClusterBody(spec)} ${pick(angleVariants, spec.seed, 6)} ${profile.focusNote}`,
    },
    {
      title: `${service}에서 자주 놓치는 점`,
      body: `${uniqueAngleBlock(spec)} ${seededLocalChecklist(spec).join(" ")}`,
      items: [...focusItems, ...seededLocalChecklist(spec)].slice(0, 8),
    },
    ...(intentBody
      ? [
          {
            title: `${service} ${intent} 초점에서 볼 것`,
            body: intentBody,
          } satisfies PageSection,
        ]
      : []),
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
            : seededLocalChecklist(spec).slice(0, 3),
    },
    {
      title: "준비 서류",
      body: `${pick(documentVariants, spec.seed, 4)} ${exclusiveClusterBody({ ...spec, seed: `${spec.seed}:docs` })}`,
    },
    {
      title: profile.sectionTitles[2] ?? `${region} 지역 특성`,
      body: pick(localVariants, spec.seed, 5),
    },
  ];

  const parent = parentHubSection(spec);
  if (parent) sections.push(parent);

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
  const seed = spec.seed;

  const whereQ = [
    {
      question: `${region}에서 ${spec.title} 상담은 어디서 받나요?`,
      answer: `다옴법무사사무소는 ${officeLocation.fullAddress}에 있으며, ${region} 사건도 전화·카카오톡·방문(예약)으로 상담합니다.`,
    },
    {
      question: `${region} ${spec.title}은(는) 방문이 필수인가요?`,
      answer: `가능한 사건은 서류 전달로 원격 진행합니다. 보정·열람·당사자 확인이 있으면 방문을 안내할 수 있습니다. 사무소는 ${officeLocation.areaLabel}입니다.`,
    },
  ];

  const costQ = [
    {
      question: `${service} 비용은 어떻게 안내되나요?`,
      answer:
        "사건 복잡도에 따라 달라집니다. 서류를 확인한 뒤 법무사 수임료와 등기·법원 비용을 구분해 설명드립니다.",
    },
    {
      question: `${region} ${service} 견적은 바로 나오나요?`,
      answer:
        "주소·당사자·권리관계만으로 1차 범위를 말할 수 있고, 확정 견적은 서류 확인 후 항목별로 드립니다.",
    },
  ];

  const faqs: PageFaqItem[] = [
    pick(whereQ, seed, 10),
    pick(costQ, seed, 11),
  ];

  if (spec.intentSuffix) {
    const intentFaqs = [
      {
        question: `${spec.serviceName} ${spec.intentSuffix}은(는) 어디서 확인하나요?`,
        answer: `사건별로 달라 일괄 금액을 단정하기 어렵습니다. 상담 시 ${spec.intentSuffix} 범위를 항목별로 정리해 드립니다.`,
      },
      {
        question: `${spec.intentSuffix}만 보면 ${spec.serviceName} 절차가 정해지나요?`,
        answer: `아닙니다. ${spec.intentSuffix}는 참고 포인트이고, 관할·서류·기한을 함께 봐야 진행 순서가 정해집니다.`,
      },
    ];
    faqs.push(pick(intentFaqs, seed, 12));
  } else {
    const remoteFaqs = [
      {
        question: "방문 없이도 진행할 수 있나요?",
        answer:
          "가능한 사건은 서류를 우편·전자·카카오톡으로 받아 원격으로 진행합니다. 초기 상황 설명을 위해 상담을 권하는 경우도 있습니다.",
      },
      {
        question: `${region} 사건도 해운대·센텀에서 맡길 수 있나요?`,
        answer:
          "가능합니다. 관할은 부동산 소재지·법인 본점 기준으로 확인하고, 접수 방식(전자·방문)을 맞춰 진행합니다.",
      },
    ];
    faqs.push(pick(remoteFaqs, seed, 12));
  }

  faqs.push({
    question: `${region}에서 상담 전 무엇을 준비하면 좋나요?`,
    answer: pick(
      [
        "부동산·본점 주소, 당사자 관계, 희망 일정, 알고 있는 근저당·채무만 있어도 1차 방향을 잡을 수 있습니다.",
        "등기부등본이 있으면 함께 보내 주세요. 없어도 주소와 사건 유형만으로 서류 목록을 정리해 드립니다.",
        "잔금일·상속 개시일·법인 결의일처럼 날짜가 있으면 우선 알려 주세요. 기한 관리에 도움이 됩니다.",
      ],
      seed,
      13,
    ),
  });

  return faqs;
}

export function buildSeoLandingContent(spec: SeoLandingSpec) {
  if (spec.slug === "등기소근처법무사") {
    return {
      intro:
        "등기소 근처 법무사를 찾는 경우에는 사무소가 등기소와 가까운지보다, 해당 부동산·법인의 관할 등기소와 전자등기 가능 여부를 먼저 확인하는 것이 실무에 맞습니다.",
      introParagraphs: [
        "부산에서 특정 등기소 위치가 아니라 실제 등기업무를 맡길 법무사를 찾고 있다면 부산 등기 법무사 종합 안내에서 업무별 절차를 확인할 수 있습니다.",
        "방문이 필요한 보정·열람이 있는 사건도 있고, 전자등기로 접수하는 사건도 있습니다. 등기소 앞 사무소 여부만으로 진행 가능 여부가 결정되지는 않습니다.",
        "다옴법무사사무소는 해운대·센텀에 있으며, 부동산 소재지와 법인 본점을 기준으로 관할 등기소를 확인한 뒤 접수 방법을 안내합니다.",
      ],
      sections: [
        {
          title: "등기업무를 맡길 법무사를 찾는다면",
          body: "부산에서 특정 등기소 위치가 아니라 실제 등기업무를 맡길 법무사를 찾고 있다면 부산 등기 법무사 종합 안내에서 업무별 절차를 확인할 수 있습니다.",
          links: [
            { href: "/부산등기법무사", label: "부산 등기 법무사 안내" },
          ],
        },
        {
          title: "등기소와 가까워야 하나요",
          body: "모든 등기가 등기소 방문으로 끝나지는 않습니다. 전자등기가 가능한 사건은 관할만 맞으면 방문 없이 접수할 수 있고, 보정·열람·당사자 확인이 있으면 방문이 필요할 수 있습니다. 위치보다 관할·서류·접수 방식이 먼저입니다.",
        },
        {
          title: "부산의 주요 등기소",
          body: "부동산은 소재지, 법인은 본점 소재지를 기준으로 관할이 나뉩니다. 부산지방법원 등기국, 동부지원 등기과, 남부산등기소, 서부지원 등기과, 북부산등기소 등 실제 관할은 주소로 확인합니다. 중부산등기소·부산진등기소는 2021년 등기국으로 통합되었습니다.",
          links: [
            { href: "/부산지방법원등기국", label: "부산지방법원 등기국" },
            { href: "/남부산등기소법무사", label: "남부산등기소" },
            { href: "/북부산등기소법무사", label: "북부산등기소" },
            { href: "/부산진등기소법무사", label: "부산진등기소" },
          ],
        },
        {
          title: "근처 법무사를 고를 때 확인할 사항",
          body: "등기소와의 거리 외에 전자등기 가능 여부, 관할 확인, 보정 대응, 법무사 직접 상담 여부를 보면 이후 접수가 수월합니다. 부동산·상속·법인 등 업무 종류와 서류는 등기업무 안내에서 이어집니다.",
          links: [
            { href: "/부산등기법무사", label: "부산 등기 법무사 안내" },
          ],
        },
      ],
      faqs: [
        {
          question: "등기소 앞 법무사여야 등기를 맡길 수 있나요?",
          answer:
            "그렇지 않습니다. 관할 등기소와 접수 방식(방문·전자등기)이 맞으면 진행할 수 있습니다.",
        },
        {
          question: "부산 등기 법무사 안내와 이 페이지의 차이는?",
          answer:
            "이 페이지는 등기소 위치·관할·접근성을 안내합니다. 소유권이전·상속·법인 등 업무 종류와 서류는 부산 등기 법무사 페이지에서 확인하시면 됩니다.",
        },
        {
          question: "관할은 어떻게 확인하나요?",
          answer:
            "부동산은 소재지, 법인은 본점 주소가 기준입니다. 주소를 알려 주시면 해당하는 등기소를 확인합니다.",
        },
      ],
      consultationExample: {
        title: "등기소 관할 확인 상담",
        body: "해운대 부동산인데 등기소 근처 법무사를 검색해 문의하신 경우, 관할이 남부산등기소인지부터 확인하고 전자등기 가능 여부를 안내한 사례입니다.",
      },
      procedures: [
        "부동산 주소 또는 법인 본점으로 관할 등기소 확인",
        "방문 접수와 전자등기 중 가능한 방식 확인",
        "보정·열람처럼 방문이 필요한 단계가 있는지 구분",
        "필요한 등기 종류는 업무 안내 페이지에서 이어서 확인",
      ],
      documents: [
        "부동산 주소 또는 법인 본점 주소",
        "등기부등본(있으면)",
        "방문이 필요한 보정·열람 여부",
      ],
      consultationPoints: [
        "찾고 있는 것이 등기소 위치인지, 등기업무 자체인지",
        "부동산 소재지 또는 법인 본점",
        "전자등기 가능 여부",
      ],
      minContentLength: 900,
    };
  }

  if (
    spec.slug === "부산지방법원지급명령" ||
    spec.slug === "부산지방법원동부지원지급명령"
  ) {
    const court =
      spec.slug === "부산지방법원동부지원지급명령"
        ? "부산지방법원 동부지원"
        : "부산지방법원";
    return {
      intro: `${court} 지급명령은 금전 채권을 비교적 간이한 절차로 청구할 때 검토하는 민사신청입니다. 관할·당사자·청구 원인·증거 자료를 먼저 맞춰야 보정·각하 위험을 줄일 수 있습니다.`,
      introParagraphs: [
        "미수금·대여금·용역비처럼 다툼이 비교적 단순한 금전 청구에서 지급명령을 검토하는 경우가 많습니다. 상대방이 이의를 제기하면 소송으로 이행될 수 있어, 처음부터 ‘이의 가능성’을 함께 봅니다.",
        "법무사는 신청서·첨부서류 작성과 접수 준비를 돕습니다. 소송 대리·강제집행의 모든 단계를 대신하지는 않으며, 법률 판단이 더 필요하면 변호사 상담을 권합니다.",
        "결과는 개별 사정에 따라 달라질 수 있고, 무조건적인 회수를 보장하지 않습니다. 검토일 2026-07-30.",
      ],
      sections: [
        {
          title: "지급명령을 검토하는 경우",
          body: "계약서·거래명세·입금 내역 등 증거가 있고, 상대방·청구액이 특정되며, 관할이 맞을 때 검토합니다. 복잡한 손해배상·감정적 분쟁만으로는 적합하지 않을 수 있습니다.",
        },
        {
          title: `${court} 관할·접수 포인트`,
          body: `${institutionContext(spec.institutionId)} 상대방 주소지·사무소 소재 등에 따라 관할이 달라질 수 있어, 접수 전 관할을 확인합니다. 인지·송달료 등 비용은 청구액에 따라 달라집니다.`,
        },
        {
          title: "준비 서류와 자주 하는 실수",
          body: "청구 취지·원인, 당사자 특정, 계약·이행 증빙이 핵심입니다. 주소 오류, 청구액 산정 오류, 이미 시효가 문제될 수 있는 채권을 점검하지 않는 실수가 잦습니다.",
        },
        {
          title: "이의 이후·회수 단계",
          body: "채무자가 이의하면 통상의 소송 절차로 이어질 수 있습니다. 확정 후에도 임의 변제가 없으면 강제집행 등 별도 절차를 검토해야 하며, 범위는 사안별로 안내합니다.",
        },
      ],
      faqs: [
        {
          question: "지급명령과 소송의 차이는?",
          answer:
            "지급명령은 상대방 출석 없이 진행될 수 있는 간이 절차이고, 이의가 있으면 소송으로 넘어갈 수 있습니다.",
        },
        {
          question: "내용증명만으로 충분한가요?",
          answer:
            "독촉 기록을 남기는 데는 도움이 되지만, 집행력 있는 채무명의를 얻는 절차와는 다릅니다.",
        },
        {
          question: "상담 전 무엇을 준비하나요?",
          answer:
            "계약서·거래내역·미수 금액·상대방 주소·독촉 이력을 알려 주시면 관할과 청구 구성을 1차로 정리할 수 있습니다.",
        },
      ],
      consultationExample: {
        title: `${court} 지급명령 상담 예시`,
        body: "이해를 위한 가상 예시입니다. 용역비를 받지 못한 의뢰인이 계약서와 입금 내역을 가져와 관할·청구액·이의 가능성을 확인한 뒤 신청 서류를 준비한 경우입니다. 실제 결과는 달라질 수 있습니다.",
      },
      procedures: [
        "채권·당사자·관할·시효 가능성 확인",
        "청구취지·원인·증거 정리",
        "신청서·첨부서류 작성 후 접수",
        "송달·확정 여부 확인, 이의 시 후속 안내",
      ],
      documents: [
        "계약서·거래명세·세금계산서 등",
        "입금·미수 내역",
        "상대방 주소·사업자 정보",
        "위임장(수임 시)",
      ],
      consultationPoints: [
        "미수금 규모와 증거",
        "상대방 주소·관할",
        "이의 가능성",
        "시효·상계 주장 여부",
        "확정 후 집행 검토",
      ],
      minContentLength: 2200,
    };
  }

  const slugOverlay = getSeoLandingSlugOverlay(spec.slug);
  if (slugOverlay) {
    const parent = parentHubSection(spec);
    return {
      intro: slugOverlay.introParagraphs[0] ?? introForSpec(spec),
      introParagraphs: slugOverlay.introParagraphs,
      sections: parent
        ? [...slugOverlay.sections, parent]
        : slugOverlay.sections,
      faqs: slugOverlay.faqs,
      consultationExample: slugOverlay.consultationExample,
      procedures: slugOverlay.procedures,
      documents: slugOverlay.documents,
      consultationPoints: slugOverlay.consultationPoints,
      minContentLength: slugOverlay.minContentLength ?? 2200,
    };
  }

  const localOverlay = getLocalChampionOverlay(spec.regionId, spec.slug);
  if (localOverlay && spec.type === "region-lawyer") {
    return {
      intro: localOverlay.introParagraphs[0] ?? introForSpec(spec),
      introParagraphs: localOverlay.introParagraphs,
      sections: localOverlay.sections,
      faqs: localOverlay.faqs ?? buildFaqs(spec),
      consultationExample: {
        title: `${spec.regionLabel ?? "부산"} ${spec.title} 상담 예시`,
        body: `${spec.regionLabel ?? "부산"} 생활권에서 등기·상속·법인 문의가 있었습니다. 소재지와 등기 원인을 먼저 확인한 뒤, 관할·서류·기한을 항목별로 안내했습니다. 잔금·대출이 겹치면 연동 순서도 함께 정리했습니다.`,
      },
      procedures: [
        "관할 등기소·법원 확인",
        "등기 원인·당사자·권리관계 정리",
        "필요 서류·기한 안내",
        "접수·보정·완료까지 단계별 진행",
      ],
      documents: [
        "등기부등본(최신)",
        "신분증·인감증명서",
        "매매·임대차·증여 계약서(해당 시)",
        "가족관계·상속 관련 서류(해당 시)",
      ],
      consultationPoints: [
        "부동산·본점 주소",
        "잔금일·상속 개시일·법인 변경일",
        "근저당·전세권·가압류 유무",
        "준비된 서류",
      ],
      minContentLength: 2400,
    };
  }

  return {
    intro: introForSpec(spec),
    introParagraphs: [
      regionContext(spec.regionId),
      serviceContext(spec.serviceId),
      spec.institutionId
        ? institutionContext(spec.institutionId)
        : pick(
            [
              `${spec.regionLabel ?? "부산"} 의뢰인 사례에서 관할·서류·기한을 함께 검토합니다.`,
              `${spec.regionLabel ?? "부산"}에서 들어온 문의는 생활권과 실제 접수 관할을 구분해 안내합니다.`,
              `검색어(${spec.title})만으로 단정하지 않고, 확인된 사실부터 범위를 나눕니다.`,
            ],
            spec.seed,
            20,
          ),
    ],
    sections: buildSections(spec),
    faqs: buildFaqs(spec),
    consultationExample: {
      title: `${spec.regionLabel ?? "부산"} ${spec.title} 상담 예시`,
      body: pick(
        [
          `최근 ${spec.regionLabel ?? "부산"}에서 ${spec.title} 관련 문의가 있었습니다. 먼저 가족관계·재산·채무·관할을 확인했고, 급한 기한이 있으면 우선순위를 정리했습니다. 준비 서류 목록과 예상 일정·비용 범위를 단계별로 안내한 뒤, 서류가 모이면 접수까지 이어서 진행했습니다.`,
          `${spec.regionLabel ?? "부산"} 생활권 의뢰인이 ${spec.title}을(를) 검색해 문의하셨습니다. 주소와 당사자만으로 관할을 확인한 뒤, 필요 서류와 일정 리스크를 항목별로 안내한 가상 예시입니다. 실제 결과는 달라질 수 있습니다.`,
          `${spec.title} 문의에서 잔금·상속 개시·법인 변경일이 겹친 경우, 날짜가 있는 절차부터 정리하고 나머지 서류를 병렬로 준비하도록 안내했습니다.`,
        ],
        spec.seed,
        21,
      ),
    },
    procedures: [
      `${spec.regionLabel ?? "부산"} 사건의 관할(법원·등기소)과 기한을 확인합니다.`,
      pick(
        [
          "필요 서류·협의 사항을 정리하고 신청서·위임장을 검토합니다.",
          "당사자·권리관계·근저당 유무를 확인한 뒤 접수 체크리스트를 만듭니다.",
          "전자등기·방문 접수·보정 대응 중 가능한 방식을 먼저 고릅니다.",
        ],
        spec.seed,
        22,
      ),
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
