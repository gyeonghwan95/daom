import { isBusanDistrictHubPath } from "@/lib/geo/busan-district-hubs";
import { NATIONWIDE_PAGE_SLUGS } from "./pages";

/** 업무안내 — 전국·비대면 수임이 가능한 서비스 */
export const NATIONWIDE_SERVICE_SLUGS = new Set([
  "inheritance-registration",
  "inheritance-renunciation",
  "qualified-acceptance",
  "corporate-registration",
  "company-establishment",
  "director-change",
]);

/**
 * FAQ — relatedServices가 비어 있어도 전국·비대면 메시지를 노출할 슬러그
 * (수임료·원격·상담 예약 등)
 */
export const NATIONWIDE_FAQ_SLUGS = new Set([
  "lawyer-fee-and-remote-faq",
  "how-to-book-consultation-faq",
  "inheritance-registration-cost",
  "when-to-file-inheritance-registration",
  "who-needs-inheritance-registration",
  "multiple-heirs-inheritance-registration",
  "inheritance-registration-with-mortgage",
  "what-is-inheritance-renunciation",
  "inheritance-renunciation-deadline",
  "inheritance-renunciation-family-effect",
  "renouncing-share-vs-full-renunciation",
  "what-is-qualified-acceptance",
  "when-to-choose-qualified-acceptance",
  "qualified-acceptance-procedure",
  "qualified-acceptance-vs-simple-acceptance",
  "director-change-deadline-faq",
  "company-establishment-documents-faq",
  "capital-increase-registration-faq",
  "corporate-address-change-faq",
]);

/** 자가진단 슬러그 — 전국 가능 업무 */
export const NATIONWIDE_DIAGNOSIS_SLUGS = new Set([
  "상속등기자가진단",
  "상속포기자가진단",
  "한정승인자가진단",
  "임원변경등기자가진단",
  "법인등기자가진단",
]);

/** FAQ·업무별 첫 화면 배너 헤드라인 (없으면 기본 문구) */
export const NATIONWIDE_BANNER_HEADLINES: Record<string, string> = {
  "inheritance-registration-cost":
    "상속등기 비용 상담도, 부산 방문 없이 전국 비대면으로 가능합니다",
  "when-to-file-inheritance-registration":
    "상속등기 시기 안내도 전국 어디서나 비대면으로 끝까지 진행할 수 있습니다",
  "who-needs-inheritance-registration":
    "상속등기가 필요한지, 방문 없이 전국에서 먼저 확인해 보세요",
  "multiple-heirs-inheritance-registration":
    "상속인이 전국에 흩어져 있어도 비대면으로 서류·절차를 정리합니다",
  "inheritance-registration-with-mortgage":
    "근저당이 있는 상속등기도 전국 비대면 상담이 가능합니다",
  "lawyer-fee-and-remote-faq":
    "수임료 안내부터 원격 진행까지, 전국 어디서나 문의할 수 있습니다",
  "how-to-book-consultation-faq":
    "부산에 오지 않아도 전화·카카오톡으로 상담을 시작할 수 있습니다",
};

/** 제목 위 '전 지역 업무 가능' chip · 비대면 배너 표시 여부 */
export function shouldShowNationwideRegionChip(
  path: string,
  slug: string,
  serviceSlug?: string,
): boolean {
  if ((NATIONWIDE_PAGE_SLUGS as readonly string[]).includes(slug)) {
    return true;
  }
  if (NATIONWIDE_SERVICE_SLUGS.has(slug)) {
    return true;
  }
  if (serviceSlug && NATIONWIDE_SERVICE_SLUGS.has(serviceSlug)) {
    return true;
  }
  if (NATIONWIDE_FAQ_SLUGS.has(slug)) {
    return true;
  }
  if (NATIONWIDE_DIAGNOSIS_SLUGS.has(slug)) {
    return true;
  }
  if (path.startsWith("/업무사례/전국")) {
    return true;
  }
  if (path.startsWith("/전국") || path === "/여러지역상속부동산등기") {
    return true;
  }
  return false;
}

/** 부산 구·동·챔피언 페이지 — 전국 안내를 내지 않는다 */
const BUSAN_LOCAL_PATH =
  /^\/(부산|해운대|센텀|재송|반여|광안|정관|일광|기장읍|오시리아|명지|녹산|서면|전포|연산|거제동|하단|괴정)/;

/** 전국·비대면으로 진행하는 업무 허브 */
const NATIONWIDE_TOPIC_PATHS = new Set([
  "/상속",
  "/법인등기",
  "/창업법무",
]);

/**
 * 본문 시작 썸네일 아래 '부산이 아니어도…' 한 줄.
 * chip과 같은 전국 가능 업무만 내고, 부산 지역·상황 분류 허브·현장 업무 페이지는 빼다.
 */
export function shouldShowLeadNationwideNote(
  path: string,
  slug?: string,
  serviceSlug?: string,
): boolean {
  let p = path;
  try {
    p = decodeURIComponent(path);
  } catch {
    // 이미 디코딩된 경로
  }
  p = p.split("?")[0].split("#")[0];
  if (!p || p === "/") return false;
  if (p.startsWith("/situations/분류/") || p === "/situations") return false;
  if (isBusanDistrictHubPath(p) || BUSAN_LOCAL_PATH.test(p)) return false;

  const last = slug ?? p.replace(/^\//, "").split("/").pop() ?? "";
  if (shouldShowNationwideRegionChip(p, last, serviceSlug)) return true;
  if (NATIONWIDE_TOPIC_PATHS.has(p)) return true;
  if (p.startsWith("/업무사례/")) return true;
  if (/타지역|원격|비대면/.test(p)) return true;
  return false;
}

export function getNationwideBannerHeadline(slug: string): string | undefined {
  return NATIONWIDE_BANNER_HEADLINES[slug];
}
