/** 상담 회신·부담 완화 문구. 화면·폼 성공·헤더 힌트가 같은 말을 쓴다. */

export const consultationReplySla = {
  weekday: "평일 2시간 내 회신",
  afterHours: "야간·주말은 다음 영업일 오전에 회신",
  line: "평일 2시간 내, 야간·주말은 다음 영업일 오전에 회신합니다.",
  night:
    "지금 남기시면 내일 아침 제가 봅니다. 오늘 밤 정하지 않으셔도 됩니다.",
} as const;

export const consultationReassurance = {
  noCommit:
    "맡기기 전에 비용만 물어보셔도 됩니다. 상담 후 안 맡으셔도 됩니다.",
  photo:
    "등기부·계약서 사진만 보내셔도 됩니다. 주민등록번호는 가려 주세요.",
  cost:
    "상담은 상황 확인입니다. 수임료는 사실관계를 본 뒤 보수와 세금·수수료를 나눠 안내합니다.",
} as const;
