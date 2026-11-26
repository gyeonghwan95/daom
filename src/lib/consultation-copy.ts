/** 상담 회신·부담 완화 문구. 화면·폼 성공·헤더 힌트가 같은 말을 쓴다. */

export const consultationReplySla = {
  weekday: "평일 2시간 내 회신",
  afterHours: "야간·주말은 다음 영업일 오전 10시 전 회신",
  line: "평일 2시간 내, 야간·주말은 다음 영업일 오전 10시 전에 회신합니다.",
  night:
    "지금 남기시면 다음 영업일 오전 10시 전에 제가 먼저 연락드립니다. 지금 다 정하지 않으셔도 됩니다.",
} as const;

/**
 * 영업 외 시간 문구 — 회신 시점을 요일까지 박아 말한다("월요일 오전 10시 전").
 * 예전 문구("내일 아침 제가 봅니다")는 금요일 밤·주말에도 '내일'이라고 해 사실과 달랐다(2026-11-15).
 * nextReplyAt 이 없으면(시각 확정 전) 요일 없는 기본 문구를 쓴다.
 */
export function consultationNightLine(nextReplyAt?: string): string {
  if (!nextReplyAt) return consultationReplySla.night;
  // 주말 낮에도 보이므로 '오늘 밤' 같은 시간대 표현은 쓰지 않는다
  return `지금 남기시면 ${nextReplyAt}에 제가 먼저 연락드립니다. 지금 다 정하지 않으셔도 됩니다.`;
}

/** 상담을 정보 문의로 끝내지 않고, 맡길지 정하는 다음 단계로 받는 문장. */
export const consultationDecisionLine =
  "비용과 순서를 알려 드린 뒤, 맡기실지만 정하시면 됩니다. 기한이나 주소가 있으면 같이 적어 주세요.";

export const consultationReassurance = {
  noCommit: consultationDecisionLine,
  photo:
    "등기부·계약서 사진만 보내셔도 됩니다. 주민등록번호는 가려 주세요.",
  /** 보수 구분만. 결정 문장은 consultationDecisionLine. */
  feeSplit: "법무사 보수와 세금·수수료는 나눠 먼저 알려 드립니다.",
  cost: `${consultationDecisionLine} 법무사 보수와 세금·수수료는 나눠 먼저 알려 드립니다.`,
} as const;
