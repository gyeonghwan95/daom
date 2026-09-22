/**
 * `/부산상속법무사` Champion 보강 모듈
 * - 「부산 상속전문 법무사」 검색의도는 허브에서 받되 공인 전문자격처럼 표방하지 않음
 * 검토일: busanInheritanceHubReviewedOn
 */
import type { ServiceFaq } from "@/types/service";

export const busanInheritanceHubReviewedOn = "2026-09-22";
export const busanInheritanceHubReviewedLabel = "2026년 9월 22일";

/** 렌더용 추가 요약 문단 (기존 summaryParagraphs 뒤에 붙임) — 중복·방어적 전문 부정 문구 금지 */
export const championExtraSummaryParagraphs: string[] = [
  "상속이라고 해도 필요한 절차는 모두 같지 않습니다. 명의이전(상속등기), 협의분할, 상속포기·한정승인, 대습·재상속은 준비서류와 기한이 서로 다릅니다. 이 페이지에서 먼저 가른 뒤 해당 안내로 이어가면 됩니다.",
  "부산에서 상속전문 법무사를 찾는 분들은 한 건의 등기만 처리하는지보다, 상황이 달라졌을 때 상속등기·포기·한정승인·특수 상속인을 함께 구분할 수 있는지를 확인하는 경우가 많습니다.",
];

/** whenNeeded 추가 항목 */
export const championExtraWhenNeeded: string[] = [
  "상속등기·포기·한정승인 중 무엇이 필요한지 아직 모르는 경우",
  "상속인끼리 재산 분배(협의분할)와 등기를 함께 봐야 하는 경우",
  "상속인이 해외·미성년이거나 연락이 되지 않는 경우",
  "상속 후 매도·담보를 앞두고 절차 순서를 확인해야 하는 경우",
  "오래된 명의·여러 필지·아파트와 토지가 섞인 경우",
];

/** 상황 → 절차 선택표 */
export const championSituationMap: string[] = [
  "부동산 명의이전만 필요 → 상속등기 안내로 이동",
  "상속인끼리 재산분배 합의 → 협의분할·상속재산분할 안내와 상속등기",
  "망인의 채무가 걱정됨 → 상속포기·한정승인 검토(3개월 기한)",
  "상속인이 먼저 사망 → 대습 여부·상속인 범위 재확인",
  "상속인이 해외 거주 → 위임·인증·협의 서류 확인",
  "상속인 연락두절 → 등기·승인 전 별도 절차 검토",
];

/** Champion 고유 FAQ — 비용·기간·서류만 반복하지 않음 */
export const championExtraFaqs: ServiceFaq[] = [
  {
    question: "상속 업무는 모두 같은 절차로 진행되나요?",
    answer:
      "아닙니다. 상속등기·협의분할·상속포기·한정승인은 서류·관할·기한이 다릅니다. 이 페이지에서 먼저 가른 뒤 해당 안내로 이어가면 됩니다.",
  },
  {
    question: "부동산이 있으면 무조건 상속등기부터 하면 되나요?",
    answer:
      "부동산이 있어도 채무가 불명확하면 등기보다 승인 방식(단순·한정·포기)을 먼저 확인하는 편이 안전합니다. 채무 조사가 끝난 뒤 등기 서류를 준비합니다.",
  },
  {
    question: "상담 전에 어떤 자료를 준비하면 되나요?",
    answer:
      "사망일(또는 안 날), 상속인 관계, 알고 있는 재산·채무, 부동산 주소·등기부만 있어도 1차 방향을 잡을 수 있습니다. 서류가 모두 없어도 상황만 남겨 주세요.",
  },
];

export const championExtraRelatedLinks: { href: string; label: string }[] = [
  {
    href: "/부산상속재산분할법무사",
    label: "상속재산분할·협의분할 안내",
  },
  {
    href: "/미성년상속인",
    label: "미성년 상속인 안내",
  },
  {
    href: "/해외거주상속인",
    label: "해외 거주 상속인 안내",
  },
  {
    href: "/연락두절상속인",
    label: "연락두절 상속인 안내",
  },
  {
    href: "/오래된상속토지정리",
    label: "오래된 상속토지 정리",
  },
  {
    href: "/부산상속후매매등기",
    label: "상속 후 매매등기 순서",
  },
];
