import type {
  ArticleImageAsset,
  ArticleVisualAspect,
  ArticleVisualOverlayPosition,
  ArticleVisualPlacement,
  ArticleVisualSlot,
} from "./types";

/** 업무 분야 풀 — 자동 배치 시 path/service로 선택 */
export type ArticleVisualField =
  | "inheritance"
  | "real-estate"
  | "building"
  | "corporate"
  | "rehab"
  | "consultation"
  | "situations"
  | "lecture"
  | "court"
  | "general";

export type ArticleVisualResolveContext = {
  category?: string;
  serviceSlug?: string;
};

type OverlaySet = {
  afterIntro: string[];
  beforeProcedures: string[];
  beforeExample: string[];
  beforeCta: string[];
  midBody: string[];
};

const FIELD_ASSETS: Record<ArticleVisualField, string[]> = {
  inheritance: [
    "docReviewDesk",
    "inheritanceRegCert",
    "consultTalk",
    "officeDocs",
    "mortgageRegCert",
  ],
  "real-estate": [
    "saleGiftRegCert",
    "registryOfficeVisit",
    "mortgageRegCert",
    "contractOfficerReview",
    "busanRegistryBureau",
  ],
  building: [
    "busanRegistryBureau",
    "saleGiftRegCert",
    "registryOfficeVisit",
    "contractOfficerReview",
    "officeExteriorSeason",
  ],
  corporate: [
    "contractOfficerReview",
    "deskComputer",
    "officeDocs",
    "registryOfficeVisit",
    "officeNameplate",
  ],
  rehab: [
    "consultMain",
    "courtProcedureBook",
    "consultTalk",
    "deskComputer",
    "portraitFront",
  ],
  consultation: [
    "consultMain",
    "portraitFront",
    "consultTalk",
    "officeDocs",
    "docReviewDesk",
  ],
  situations: [
    "consultTalk",
    "consultMain",
    "docReviewDesk",
    "portraitFront",
    "officeDocs",
  ],
  lecture: [
    "lectureYouthJeonse",
    "lectureCitizenLib",
    "portraitFront",
    "consultMain",
  ],
  court: [
    "courtProcedureBook",
    "busanRegistryBureau",
    "registryOfficeVisit",
    "consultTalk",
  ],
  general: [
    "portraitFront",
    "officeDocs",
    "docReviewDesk",
    "consultMain",
    "deskComputer",
    "officeExteriorSeason",
  ],
};

const FIELD_OVERLAYS: Record<ArticleVisualField, OverlaySet> = {
  inheritance: {
    afterIntro: [
      "상속인은 서류보다 먼저 확인합니다",
      "재산과 채무를 함께 살펴야 합니다",
      "가족관계에 따라 절차가 달라집니다",
    ],
    beforeProcedures: [
      "승인 방식을 먼저 가립니다",
      "3개월 기한을 달력에 표시하세요",
      "협의와 등기 순서를 맞춥니다",
    ],
    beforeExample: ["상황을 단순화한 예시로 살펴봅니다"],
    beforeCta: ["현재 상황부터 남겨주세요"],
    midBody: ["준비가 덜 되어도 방향부터 잡을 수 있습니다"],
  },
  "real-estate": {
    afterIntro: [
      "등기부와 계약을 함께 봅니다",
      "잔금과 말소 순서를 맞춰야 합니다",
      "권리관계가 일정을 바꿉니다",
    ],
    beforeProcedures: [
      "관할 등기소부터 확인합니다",
      "서류와 세금 일정을 한 줄로 맞춥니다",
    ],
    beforeExample: ["잔금일 연속 처리를 예시로 봅니다"],
    beforeCta: ["등기부와 일정을 알려주시면 됩니다"],
    midBody: ["특약과 등기 순서가 어긋나지 않게 봅니다"],
  },
  building: {
    afterIntro: [
      "대장과 등기부가 같은지 확인하세요",
      "철거 후에도 등기부가 남을 수 있습니다",
      "준공 이후 보존등기가 시작됩니다",
    ],
    beforeProcedures: [
      "건축물대장과 도면을 맞춰 봅니다",
      "멸실·표시변경·보존 중 무엇을 볼지 가립니다",
    ],
    beforeExample: ["건물 유형에 따라 서류가 달라집니다"],
    beforeCta: ["건물 현황을 알려주시면 됩니다"],
    midBody: ["순서만 바꿔도 접수가 달라질 수 있습니다"],
  },
  corporate: {
    afterIntro: [
      "정관과 등기부를 함께 확인합니다",
      "임기와 결의 절차가 등기의 출발점입니다",
      "변경 사실과 등기 시점은 다를 수 있습니다",
    ],
    beforeProcedures: [
      "결의일·등기 기한을 달력에 표시하세요",
      "누락된 변경부터 목록으로 만듭니다",
    ],
    beforeExample: ["임원·본점 변경을 예시로 봅니다"],
    beforeCta: ["등기사항증명서만 있어도 시작할 수 있습니다"],
    midBody: ["과태료는 기한 확인이 먼저입니다"],
  },
  rehab: {
    afterIntro: [
      "소득·채무·재산을 함께 검토합니다",
      "채무액만으로 결정되지는 않습니다",
      "현재 조건부터 차분히 확인합니다",
    ],
    beforeProcedures: [
      "변제 가능성과 청산가치를 비교합니다",
      "서류 정합성이 보정 여부를 바꿉니다",
    ],
    beforeExample: ["이해를 위한 가상 예시로 살펴봅니다"],
    beforeCta: ["월 소득과 채무 규모만 있어도 됩니다"],
    midBody: ["결과를 보장하지 않고 기준을 안내합니다"],
  },
  consultation: {
    afterIntro: [
      "정확한 업무명을 몰라도 괜찮습니다",
      "현재 상황부터 남겨주세요",
    ],
    beforeProcedures: ["준비된 서류가 없어도 시작할 수 있습니다"],
    beforeExample: ["상담은 상황 확인부터 시작합니다"],
    beforeCta: ["전화·카카오·네이버로 남기실 수 있습니다"],
    midBody: ["방문은 예약 후 이용해 주세요"],
  },
  situations: {
    afterIntro: [
      "지금 상황과 가까운 안내부터 고릅니다",
      "현재 상황부터 남겨주세요",
    ],
    beforeProcedures: ["필요한 절차만 짧게 가립니다"],
    beforeExample: ["비슷한 상담 흐름을 참고합니다"],
    beforeCta: ["업무명을 몰라도 상담할 수 있습니다"],
    midBody: ["기한이 임박하면 먼저 말씀해 주세요"],
  },
  lecture: {
    afterIntro: [
      "실제 강의·상담 경험을 바탕으로 안내합니다",
      "기관 일정에 맞춰 주제를 조정합니다",
    ],
    beforeProcedures: ["대상·시간에 맞는 구성을 잡습니다"],
    beforeExample: ["확인된 강의 이력을 참고합니다"],
    beforeCta: ["출강 문의를 남겨 주세요"],
    midBody: ["생활법률·전세·등기 주제를 다룹니다"],
  },
  court: {
    afterIntro: [
      "관할과 서류를 먼저 맞춥니다",
      "간이 절차와 소송 이행을 함께 봅니다",
    ],
    beforeProcedures: ["청구 원인과 증거를 정리합니다"],
    beforeExample: ["이해를 위한 가상 예시입니다"],
    beforeCta: ["상대방 주소와 미수 금액을 알려주세요"],
    midBody: ["이의가 있으면 후속 절차가 달라집니다"],
  },
  general: {
    afterIntro: [
      "정확한 업무명을 몰라도 괜찮습니다",
      "필요한 절차부터 가려 드립니다",
    ],
    beforeProcedures: ["준비된 서류가 없어도 시작할 수 있습니다"],
    beforeExample: ["상담 예시를 참고해 보세요"],
    beforeCta: ["현재 상황부터 남겨주세요"],
    midBody: ["사안마다 결과가 달라질 수 있습니다"],
  },
};

const FIELD_ALT: Record<ArticleVisualField, string[]> = {
  inheritance: [
    "상속·가족관계 서류를 검토하는 안윤정 법무사",
    "상속등기 관련 등기필 서류를 확인하는 모습",
    "상속 절차를 상담하는 다옴법무사사무소",
  ],
  "real-estate": [
    "부동산등기 서류를 확인하는 모습",
    "부산 등기소 앞에서 등기 서류를 든 안윤정 법무사",
    "매매·증여 등기필정보를 정리한 서류",
  ],
  building: [
    "부산지방법원등기국 건물 외관",
    "건물등기 관련 서류를 검토하는 모습",
    "보존·멸실등기 서류를 확인하는 안윤정 법무사",
  ],
  corporate: [
    "법인등기 서류를 검토하는 안윤정 법무사",
    "정관·의사록을 모니터와 함께 확인하는 모습",
    "법인 변경등기 자료를 정리하는 사무 공간",
  ],
  rehab: [
    "개인회생 상담을 경청하는 안윤정 법무사",
    "채무·소득 자료를 차분히 검토하는 상담 장면",
    "법원 절차 안내를 위한 법률 자료",
  ],
  consultation: [
    "상담을 준비하는 안윤정 법무사",
    "다옴법무사사무소 상담 공간",
    "의뢰인 상황을 경청하는 모습",
  ],
  situations: [
    "상황별 법률 문제를 상담하는 안윤정 법무사",
    "현재 상황을 듣고 절차를 가리는 상담 장면",
  ],
  lecture: [
    "법률 강의·특강 현장 모습",
    "지역 생활법률 교육을 진행하는 장면",
  ],
  court: [
    "법원·등기 관할 안내와 연결되는 자료",
    "지급명령·민사 서류를 검토하는 맥락",
  ],
  general: [
    "다옴법무사사무소 안윤정 법무사",
    "부산 해운대 사무소에서 서류를 검토하는 모습",
  ],
};

const ASPECT_BY_SLOT: Record<ArticleVisualSlot, ArticleVisualAspect> = {
  "after-intro": "3:2",
  "before-procedures": "16:9",
  "before-example": "3:2",
  "before-cta": "3:2",
  "mid-body": "16:9",
};

const OVERLAY_POS_CYCLE: ArticleVisualOverlayPosition[] = [
  "left",
  "center",
  "right",
];

export function hashString(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function pickFrom<T>(items: T[], seed: string, salt = 0): T {
  const idx = (hashString(`${seed}:${salt}`) + salt) % items.length;
  return items[idx]!;
}

export function inferArticleVisualField(
  path: string,
  serviceSlug?: string,
): ArticleVisualField {
  const key = `${path} ${serviceSlug ?? ""}`;
  if (/강의|특강|출강|lecture/i.test(key)) return "lecture";
  if (/situations|상황/.test(key)) return "situations";
  if (/상담|문의|contact|consult/i.test(key)) return "consultation";
  if (/회생|파산|채무|지급명령|개인회생|파산/.test(key)) return "rehab";
  if (
    /상속|한정승인|포기|유증|inheritance|qualified|renunciation/i.test(key)
  ) {
    return "inheritance";
  }
  if (/건물|멸실|보존|표시변경|건축|공장|창고|building|preservation/i.test(key)) {
    return "building";
  }
  if (
    /법인|임원|본점|설립|정관|상업|기업|회사|corporate|director|establishment/i.test(
      key,
    )
  ) {
    return "corporate";
  }
  if (
    /부동산|매매|증여|근저당|전세|소유권|등기소|real-estate|ownership|mortgage|jeonse/i.test(
      key,
    )
  ) {
    return "real-estate";
  }
  if (/법원|지급명령|공탁|court|payment/i.test(key)) return "court";
  return "general";
}

/** 페이지당 자동 이미지 개수(우선 오버라이드 제외) */
export function autoVisualCount(
  path: string,
  category?: string,
): 0 | 1 | 2 {
  if (
    category === "tool" ||
    category === "glossary" ||
    category === "external"
  ) {
    return 0;
  }
  if (
    category === "blog" ||
    category === "case" ||
    category === "faq" ||
    category === "media"
  ) {
    return 1;
  }
  // 목록성·짧은 허브
  if (
    path === "/" ||
    path === "/services" ||
    path === "/faq" ||
    path === "/blog" ||
    path === "/cases"
  ) {
    return 1;
  }
  return 2;
}

export function slotsForAutoCount(count: 0 | 1 | 2): ArticleVisualSlot[] {
  if (count === 0) return [];
  if (count === 1) return ["after-intro"];
  return ["after-intro", "before-procedures"];
}

export function buildAutoPlacement(
  path: string,
  slot: ArticleVisualSlot,
  field: ArticleVisualField,
  assets: Record<string, ArticleImageAsset>,
): ArticleVisualPlacement | null {
  const pool = FIELD_ASSETS[field].filter((id) => assets[id]?.usable);
  if (pool.length === 0) return null;

  const assetId = pickFrom(pool, path, hashString(slot) % 97);
  const overlays = FIELD_OVERLAYS[field];
  const overlayKey =
    slot === "after-intro"
      ? "afterIntro"
      : slot === "before-procedures"
        ? "beforeProcedures"
        : slot === "before-example"
          ? "beforeExample"
          : slot === "before-cta"
            ? "beforeCta"
            : "midBody";
  const overlayList = overlays[overlayKey];
  const altList = FIELD_ALT[field];

  return {
    path,
    slot,
    assetId,
    alt: pickFrom(altList, path, hashString(assetId)),
    overlayText: pickFrom(overlayList, path, hashString(slot)),
    aspectRatio: ASPECT_BY_SLOT[slot],
    overlayPosition: pickFrom(OVERLAY_POS_CYCLE, path, pool.indexOf(assetId)),
    tone: "dark",
  };
}
