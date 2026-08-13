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

/**
 * 본문 중간 인라인 상담 카드.
 * 광고처럼 반복되지 않도록 기본 비활성. 히어로·하단 CTA만 사용한다.
 * force=true 인 화면(문의 전용 페이지 등)만 예외.
 */
export function shouldShowQuickInquiryInline(options: {
  category?: string;
  slug?: string;
  serviceSlug?: string;
  force?: boolean;
}): boolean {
  return options.force === true;
}
