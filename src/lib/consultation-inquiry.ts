/**
 * 상담 신청서(/contact/inquiry) 경로·카피.
 * 플로팅·모바일 하단 「상담하기」팝업은 제외하고, 페이지 CTA는 여기로 연결한다.
 */
export const CONTACT_INQUIRY_PATH = "/contact/inquiry" as const;

export const consultationInquiryCopy = {
  /** 주요 CTA 버튼 */
  ctaPrimary: "1분만에 상담 신청하기",
  /** 짧은 버튼 */
  ctaShort: "상담 신청하기",
  /** 신청서 작성 유도 */
  ctaForm: "상담 신청서 작성하기",
  /** 1분 안내 (본문·힌트) */
  oneMinute:
    "약 1분이면 상담 신청을 완료할 수 있습니다. 서류가 없어도 상황만 남겨 주세요.",
  oneMinuteShort: "약 1분이면 상담 신청을 남길 수 있습니다.",
  /** 사이드바·카드 힌트 */
  hintForm: "약 1분 · 상황만 적어 보내기",
} as const;

export function contactInquiryHref(query?: Record<string, string>): string {
  if (!query || Object.keys(query).length === 0) return CONTACT_INQUIRY_PATH;
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value) params.set(key, value);
  }
  const qs = params.toString();
  return qs ? `${CONTACT_INQUIRY_PATH}?${qs}` : CONTACT_INQUIRY_PATH;
}
