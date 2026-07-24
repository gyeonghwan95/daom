/** 문의 본문·연락처 길이 제한 (서버·클라이언트 공통) */
export const MESSAGE_MIN = 5;
export const MESSAGE_MAX = 2000;
export const CONTACT_MAX = 120;

/** 동일 내용 중복 제출 차단 창 (ms) */
export const DUPLICATE_WINDOW_MS = 3 * 60 * 1000;

/** IP·연락처 기준 연속 요청 제한 */
export const RATE_LIMIT_WINDOW_MS = 60 * 1000;
export const RATE_LIMIT_MAX = 5;

export const HONEYPOT_FIELD = "website";
