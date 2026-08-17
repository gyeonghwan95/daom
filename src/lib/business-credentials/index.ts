import {
  businessCredentials,
  type BusinessCredentialRecord,
} from "@/data/business-credentials";

export type {
  BusinessCredentialId,
  BusinessCredentialRecord,
} from "@/data/business-credentials";

export type CredentialCopyGroup =
  | "general"
  | "corporate"
  | "partnership"
  | "startup"
  | "women";

export type CredentialVariant = "strip" | "panel" | "inline";

export type CredentialPlacement = {
  variant: CredentialVariant;
  copyGroup: CredentialCopyGroup;
};

/** 정적 export 기준일. 클라이언트 hydration 분기 없이 빌드·요청 시점에 동일하게 사용 */
export function getCredentialsAsOfDate(): string {
  return (
    process.env.CREDENTIALS_AS_OF?.trim() ||
    new Date().toISOString().slice(0, 10)
  );
}

function parseIsoDate(value: string | null): number | null {
  if (!value) return null;
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;
  const t = Date.UTC(
    Number(match[1]),
    Number(match[2]) - 1,
    Number(match[3]),
  );
  return Number.isFinite(t) ? t : null;
}

export function isCredentialCurrentlyValid(
  credential: BusinessCredentialRecord,
  asOf = getCredentialsAsOfDate(),
): boolean {
  if (!credential.verified || !credential.enabled) return false;
  if (!credential.validUntil) return false;
  const until = parseIsoDate(credential.validUntil);
  const today = parseIsoDate(asOf);
  if (until === null || today === null) return false;
  return until >= today;
}

const DAY_MS = 24 * 60 * 60 * 1000;

/** 만료 30일 이내 — 빌드/서버 콘솔 경고용 (일반 사용자 UI 없음) */
export function isCredentialExpiringSoon(
  credential: BusinessCredentialRecord,
  asOf = getCredentialsAsOfDate(),
  withinDays = 30,
): boolean {
  if (!isCredentialCurrentlyValid(credential, asOf)) return false;
  const until = parseIsoDate(credential.validUntil);
  const today = parseIsoDate(asOf);
  if (until === null || today === null) return false;
  const daysLeft = Math.floor((until - today) / DAY_MS);
  return daysLeft >= 0 && daysLeft <= withinDays;
}

export function formatCredentialExpiry(iso: string | null): string {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  if (!y || !m || !d) return iso;
  return `${y}.${m}.${d}`;
}

let warnedForBuild = false;

function emitBuildWarnings(
  credentials: BusinessCredentialRecord[],
  asOf: string,
): void {
  if (warnedForBuild || typeof process === "undefined") return;
  if (process.env.NODE_ENV === "test") return;
  warnedForBuild = true;

  for (const item of credentials) {
    if (item.verificationRequired && (!item.verified || !item.enabled)) {
      console.warn(
        `[business-credentials] 검증 보류: ${item.officialName} (verificationRequired=true, enabled=${item.enabled})`,
      );
    }
    if (isCredentialExpiringSoon(item, asOf)) {
      console.warn(
        `[business-credentials] 만료 임박: ${item.officialName} validUntil=${item.validUntil}`,
      );
    }
  }
}

/** 화면에 노출할 유효 확인서만 반환 (만료·미검증·비활성은 DOM에서 제외) */
export function getVisibleBusinessCredentials(
  asOf = getCredentialsAsOfDate(),
): BusinessCredentialRecord[] {
  emitBuildWarnings(businessCredentials, asOf);
  return businessCredentials.filter((item) =>
    isCredentialCurrentlyValid(item, asOf),
  );
}

/**
 * 소개 페이지 등: 문서 메타(발급일·유효기간) 검증 전이라도
 * 공식 명칭·설명만 안내할 때 사용. 유효기간·‘현재 유효’는 표시하지 않는다.
 */
export function getMentionBusinessCredentials(): BusinessCredentialRecord[] {
  emitBuildWarnings(businessCredentials, getCredentialsAsOfDate());
  return [...businessCredentials];
}

export function hasVisibleBusinessCredentials(
  asOf = getCredentialsAsOfDate(),
): boolean {
  return getVisibleBusinessCredentials(asOf).length > 0;
}

export function getVisibleCredentialCount(
  asOf = getCredentialsAsOfDate(),
): number {
  return getVisibleBusinessCredentials(asOf).length;
}

export function getOfficialNamesLabel(
  credentials: BusinessCredentialRecord[] = getVisibleBusinessCredentials(),
): string {
  if (credentials.length === 0) return "";
  if (credentials.length === 3) {
    return "여성기업·중소기업·창업기업 확인서";
  }
  return credentials.map((c) => c.officialName).join("·");
}

export type CredentialCopy = {
  title: string;
  body: string;
  stripLabel: string;
  stripSupport: string;
  inline: string;
};

const COPY: Record<CredentialCopyGroup, CredentialCopy> = {
  general: {
    title: "기업의 시작과 성장을 직접 이해하는 법무사사무소",
    body: "다옴법무사사무소는 여성기업확인서, 중소기업확인서, 창업기업확인서를 보유하고 있습니다. 창업과 기업 운영 과정에서 필요한 법인설립, 임원변경, 본점이전, 목적변경, 증자와 각종 등기 업무를 대표자의 관점에서도 세심하게 살펴봅니다.",
    stripLabel: "여성기업 · 중소기업 · 창업기업 확인서 보유",
    stripSupport:
      "개인 의뢰뿐 아니라 기업·기관·조합과의 협업에 필요한 기본 확인서류를 갖추고 있습니다.",
    inline:
      "다옴법무사사무소는 여성기업·중소기업·창업기업 확인서를 보유하고 있습니다.",
  },
  corporate: {
    title: "중소기업의 실제 운영 흐름을 고려한 법인등기",
    body: "중소기업확인서를 보유한 법무사사무소로서, 기업 규모와 운영 상황에 맞춰 필요한 법인등기를 구분합니다. 매번 새로운 절차를 권하기보다 현재 등기부와 정관을 기준으로 실제로 필요한 변경사항부터 확인합니다.",
    stripLabel: "여성기업 · 중소기업 · 창업기업 확인서 보유",
    stripSupport:
      "공공·기업 협업 시 확인서류 제출이 필요한 경우 유효한 서류를 안내합니다.",
    inline:
      "다옴법무사사무소는 여성기업·중소기업·창업기업 확인서를 보유하고 있습니다.",
  },
  partnership: {
    title: "공공·기업 협업에 필요한 확인서류를 갖추고 있습니다",
    body: "여성기업·중소기업·창업기업 확인서를 유효하게 보유하고 있으며, 공공기관·법인·조합·협력기관의 계약 및 증빙 절차에서 확인서류가 필요한 경우 제출할 수 있습니다. 업무 범위와 일정, 필요서류를 사전에 확인하여 협업 과정이 명확하게 진행되도록 안내합니다. 계약상 혜택·가점·수의계약 가능 여부는 각 공고와 적용 법령에 따라 달라질 수 있어 별도 확인이 필요합니다.",
    stripLabel: "기업확인서 3종 보유",
    stripSupport: "공공·기업 협업 시 확인서류 제출 가능",
    inline:
      "다옴법무사사무소는 여성기업·중소기업·창업기업 확인서를 보유하고 있으며, 협업 계약·증빙에 필요한 경우 유효한 서류를 제출할 수 있습니다.",
  },
  startup: {
    title: "창업기업의 고민을 창업기업의 관점에서도 살펴봅니다",
    body: "다옴법무사사무소 역시 창업기업확인서를 보유하고 있습니다. 법인을 처음 설립하는 대표자가 상호·목적·자본금·임원·본점 주소를 정할 때 마주하는 현실적인 고민을 이해하고, 설립 이후 필요한 변경등기까지 함께 확인합니다. 세무·회계·노무·인허가 판단이 필요한 부분은 관련 전문가 또는 기관의 별도 확인이 필요합니다.",
    stripLabel: "창업기업 · 중소기업 · 여성기업 확인서 보유",
    stripSupport:
      "설립등기만 마치는 것이 아니라 이후 변경등기까지 함께 확인합니다.",
    inline:
      "다옴법무사사무소는 창업기업확인서와 중소기업확인서를 보유한 사업자로서, 설립 이후의 운영 등기도 함께 살펴봅니다.",
  },
  women: {
    title: "여성 대표자가 직접 운영하는 여성기업 법무사사무소",
    body: "다옴법무사사무소는 여성기업확인서를 보유한 여성 대표 법무사사무소입니다. 여성 창업자와 기업 대표자가 법인설립이나 변경등기를 준비할 때 필요한 절차를 어렵지 않게 이해할 수 있도록 직접 설명하고 진행합니다. 일반적으로 여성기업 인증, 중소기업 인증, 창업기업 인증이라고도 검색하지만 공식 문서명은 각각 여성기업확인서, 중소기업확인서, 창업기업확인서입니다.",
    stripLabel: "여성기업확인서 보유",
    stripSupport:
      "여성 대표자가 직접 운영하며, 중소기업·창업기업 확인서도 함께 보유하고 있습니다.",
    inline:
      "다옴법무사사무소는 여성기업확인서를 보유한 여성 대표 법무사사무소입니다.",
  },
};

export function getCredentialCopy(
  group: CredentialCopyGroup,
): CredentialCopy {
  return COPY[group];
}

/** 민감·개인 사건 페이지 — 기업확인서 강조 금지 */
const EXCLUDE_SLUG_RE =
  /(상속|한정승인|포기|회생|파산|면책|전세보증금|임차권등기명령|지급명령|내용증명|가압류|가처분|채권압류|공탁|후견|특별대리)/;

const EXCLUDE_PATH_RE =
  /(\/상속|\/한정승인|\/포기|\/회생|\/파산|\/전세|\/임차권|\/지급명령|\/내용증명|\/situations\/)/;

function isSensitiveCredentialContext(path: string, slug: string): boolean {
  if (EXCLUDE_PATH_RE.test(path)) return true;
  if (EXCLUDE_SLUG_RE.test(slug)) return true;
  // 여성법무사 중 상속·회생 의도만 제외
  if (
    slug === "상속여성법무사" ||
    slug === "개인회생여성법무사"
  ) {
    return true;
  }
  return false;
}

/**
 * 경로·슬러그 기준 표시 위치 결정.
 * 동일 페이지에서 strip/panel/inline 중 하나만 쓰도록 단일 결과를 반환한다.
 */
export function resolveCredentialPlacement(
  path: string,
  slug: string,
): CredentialPlacement | null {
  if (!hasVisibleBusinessCredentials()) return null;
  if (isSensitiveCredentialContext(path, slug)) return null;

  const p = path;
  const s = slug;

  if (
    p === "/about" ||
    p === "/office" ||
    s === "partners" ||
    s === "협업문의" ||
    s.includes("복대리") ||
    s.includes("협업") ||
    s === "공공기관등기업무" ||
    s.includes("공공기관") ||
    s.includes("촉탁") ||
    s === "법무사협업" ||
    s === "특수등기의뢰"
  ) {
    return { variant: "panel", copyGroup: "partnership" };
  }

  if (
    s === "부산여성법무사" ||
    s === "해운대여성법무사" ||
    s === "센텀여성법무사"
  ) {
    return { variant: "panel", copyGroup: "women" };
  }

  if (
    s.includes("법인설립") ||
    s.includes("창업") ||
    s.includes("스타트업") ||
    s.includes("개인사업자법인전환") ||
    s === "company-establishment" ||
    p.includes("법인설립")
  ) {
    return { variant: "inline", copyGroup: "startup" };
  }

  if (
    s.includes("법인등기") ||
    s.includes("임원변경") ||
    s.includes("본점이전") ||
    s.includes("목적변경") ||
    s.includes("유상증자") ||
    s.includes("무상증자") ||
    s.includes("해산") ||
    s.includes("청산") ||
    s.includes("상호변경") ||
    s.includes("지점") ||
    s === "corporate-registration" ||
    s === "director-change" ||
    s === "법인변경등기" ||
    s === "부산법인법무사" ||
    s === "부산기업법무사" ||
    s === "부산스타트업법무사"
  ) {
    return { variant: "inline", copyGroup: "corporate" };
  }

  if (
    s.includes("기업법률") ||
    s.includes("창업법률") ||
    s === "강의문의" ||
    s === "기업업무문의"
  ) {
    return { variant: "inline", copyGroup: "corporate" };
  }

  if (p === "/contact" || p === "/contact/inquiry" || p === "/location") {
    return { variant: "inline", copyGroup: "general" };
  }

  return null;
}

export function resolveHomeCredentialPlacement(): CredentialPlacement | null {
  if (!hasVisibleBusinessCredentials()) return null;
  return { variant: "strip", copyGroup: "general" };
}
