/** 인라인 간편 문의 카드를 노출할 업무·토픽 (페이지당 최대 1개) */
export const QUICK_INQUIRY_SERVICE_SLUGS = new Set([
  "inheritance-registration",
  "inheritance-renunciation",
  "qualified-acceptance",
  "real-estate-registration",
  "corporate-registration",
  "personal-rehabilitation",
  "bankruptcy",
]);

export const QUICK_INQUIRY_TOPIC_SLUGS = new Set([
  "상속",
  "부동산등기",
  "법인등기",
  "개인회생파산",
  "임대차전세",
]);

export function shouldShowQuickInquiryInline(options: {
  category?: string;
  slug?: string;
  serviceSlug?: string;
  force?: boolean;
}): boolean {
  if (options.force) return true;
  if (options.category === "situation" || options.category === "case") return true;
  if (options.serviceSlug && QUICK_INQUIRY_SERVICE_SLUGS.has(options.serviceSlug)) {
    return true;
  }
  if (options.slug && QUICK_INQUIRY_SERVICE_SLUGS.has(options.slug)) return true;
  if (options.slug && QUICK_INQUIRY_TOPIC_SLUGS.has(options.slug)) return true;
  return false;
}
