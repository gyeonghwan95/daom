/**
 * `/부산상속포기` SAFE 보강 모듈
 * Target: 부산 상속포기 법무사
 * 검토일은 renunciation-hub-identity.ts에서 관리한다.
 */
import type { ServiceFaq } from "@/types/service";
import { busanRenunciationHubReviewedLabel } from "./renunciation-hub-identity";

/** 첫화면 answer-first 뒤에만 붙는 짧은 보강 (사무소 홍보를 앞세우지 않음) */
export const renunciationChampionExtraSummaryParagraphs: string[] = [
  "핵심만 정리하면 ①안 날부터 3개월 ②배우자·자녀·후순위 ③처분·인출 여부 ④한정승인 비교입니다. 가정법원 신고와 부동산 등기는 접수처가 다릅니다.",
];

export const renunciationChampionExtraWhenNeeded: string[] = [];

export const renunciationChampionTimeline: string[] = [
  "사망·인지 → ‘안 날’ 기록(기한 기산 기준)",
  "재산·채무 조회 → 포기 vs 한정승인 vs 단순승인 비교",
  "가족 조율(배우자·자녀·후순위) → 신고 서류 준비",
  "가정법원 신고 → 보정 대응 → 심판·수리 확인",
  "다른 상속인의 등기·협의와 일정 정리",
];

export const renunciationChampionExtraFaqs: ServiceFaq[] = [
  {
    question: "손자녀까지 포기해야 하나요?",
    answer:
      "항상 그런 것은 아닙니다. 배우자·자녀가 공동상속인인 상태에서 자녀만 전부 포기하면 배우자가 단독상속인이 되는 경우가 있어, 곧바로 손자녀·부모·형제에게 넘어간다고 단정하지 않습니다. 가족관계증명서로 순위를 확인합니다.",
  },
  {
    question: "미성년 자녀가 있으면 부모만 포기하면 되나요?",
    answer:
      "미성년 상속인의 포기는 특별대리인 등 추가 절차가 필요할 수 있습니다. 부모가 자신의 상속분만 포기해도 자녀 몫은 남습니다.",
  },
  {
    question: "상속포기 신고와 부동산 등기는 같은 곳에서 하나요?",
    answer:
      "아닙니다. 상속포기는 가정법원 신고이고, 부동산 명의이전은 등기소 접수입니다. 접수처가 달라 일정과 서류를 나눠 준비합니다.",
  },
];

export const renunciationChampionExtraRelatedLinks: {
  href: string;
  label: string;
}[] = [
  { href: "/부산한정승인", label: "한정승인 — 채무를 재산 한도로 제한" },
  { href: "/특별한정승인", label: "특별한정승인 안내" },
  { href: "/부산상속법무사", label: "상속 절차 선택(등기·포기·한정)" },
  {
    href: "/tools/inheritance-renunciation-deadline",
    label: "상속포기 기한 확인 도구",
  },
];

export const renunciationTrustFooter = `작성·검토: 안윤정 법무사(다옴법무사사무소). 최종확인일 ${busanRenunciationHubReviewedLabel}.`;
