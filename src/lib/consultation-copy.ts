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

export const consultationReassurance = {
  noCommit:
    "맡기기 전에 비용만 물어보셔도 됩니다. 상담 후 안 맡으셔도 됩니다.",
  photo:
    "등기부·계약서 사진만 보내셔도 됩니다. 주민등록번호는 가려 주세요.",
  cost:
    "상담만 받고 맡기지 않으셔도 됩니다. 비용은 법무사 보수와 세금·수수료를 나눠 먼저 알려 드립니다.",
} as const;
