/**
 * 업무 페이지 "핵심 답변" — H1 바로 아래에 보이는 결론·한눈 표·업무 범위.
 * 원칙: 법에 정해진 기한·세율·조문만 쓰고, 사건마다 다른 금액·처리기간은 약속하지 않는다.
 * "무료·100%·최저가·보장" 표현과, 재판에서 대신 다투는 일을 하는 것처럼 읽히는 문구는 쓰지 않는다.
 */
export type ServiceAnswer = {
  /** 업무 이름(표 캡션·aria-label) */
  name: string;
  /** 2~3문장 결론: 무엇인지 + 언제·어디에·어떻게 */
  answer: string;
  /** 한눈 표 [항목, 내용] — 4~6행 */
  facts: readonly (readonly [string, string])[];
  /** 법무사가 맡는 범위 한 줄 */
  scope: string;
};
