/**
 * `/부산상속법무사` Champion 보강 모듈
 * - 「부산 상속전문 법무사」 검색의도는 허브에서 받되 공인 전문자격처럼 표방하지 않음
 * 검토일: busanInheritanceHubReviewedOn
 */
import type { ServiceFaq } from "@/types/service";

export const busanInheritanceHubReviewedOn = "2026-09-25";
export const busanInheritanceHubReviewedLabel = "2026년 9월 25일";

/** 렌더용 추가 요약 — topic.summaryParagraphs와 중복되지 않게 짧게만 */
export const championExtraSummaryParagraphs: string[] = [
  "상속등기·상속포기·한정승인은 서류·관할·기한이 다릅니다. 아래에서 갈래를 고른 뒤 해당 안내로 이어가면 됩니다.",
];

/** whenNeeded는 keyword-topics 본편만 사용 (중복 추가 금지) */
export const championExtraWhenNeeded: string[] = [];

/** Champion 고유 FAQ — topic FAQ와 겹치지 않게 */
export const championExtraFaqs: ServiceFaq[] = [
  {
    question: "상담 전에 어떤 자료를 준비하면 되나요?",
    answer:
      "사망일(또는 안 날), 상속인 관계, 알고 있는 재산·채무, 부동산 주소만 있어도 1차 방향을 잡을 수 있습니다. 서류가 모두 없어도 상황만 남겨 주세요.",
  },
];

export const championExtraRelatedLinks: { href: string; label: string }[] = [
  {
    href: "/부산상속재산분할법무사",
    label: "상속재산분할·협의분할 안내",
  },
  {
    href: "/부산상속후매매등기",
    label: "상속 후 매매등기 순서",
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
];
