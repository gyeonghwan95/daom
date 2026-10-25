/**
 * `/부산상속법무사` Champion 보강 모듈
 * - 역할: 등기·승인 방식 중 무엇을 볼지 가르는 입구. 전문·포기 절차 상세는 각 URL.
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
    question: "등기소와 가정법원은 같은 신청인가요?",
    answer:
      "아닙니다. 부동산 명의이전은 등기소, 승인·포기 신고는 가정법원입니다. 접수처를 먼저 가른 뒤 해당 안내로 이동합니다.",
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
