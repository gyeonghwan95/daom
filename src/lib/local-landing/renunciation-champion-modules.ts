/**
 * `/부산상속포기` SAFE 보강 모듈
 * Target: 부산 상속포기 법무사
 * - title/H1/meta 변경 없음
 * - 기존 문단·FAQ 삭제 없음 (추가만)
 * 검토일: 2026-08-10
 */
import type { ServiceFaq } from "@/types/service";

export const renunciationChampionExtraSummaryParagraphs: string[] = [
  "상속포기를 준비할 때는 ①상속 개시를 안 날부터의 3개월 기한 ②상속순위와 후순위 영향 ③배우자·자녀·손자녀 관계 ④포기 전 재산 처분·인출 여부 ⑤한정승인과 비교를 먼저 확인하는 것이 안전합니다.",
  "가정법원 신고 후에는 보정·심판 안내를 받게 될 수 있으며, 다른 상속인의 등기·협의와 일정이 겹칠 수 있습니다. 해운대·센텀 다옴법무사사무소 안윤정 법무사가 직접 상담합니다. 작성·검토: 안윤정 법무사(다옴법무사사무소). 최종확인일 2026년 8월 18일.",
];

export const renunciationChampionExtraWhenNeeded: string[] = [
  "상속채무가 명확히 재산보다 커 상속 자체를 받지 않기로 한 경우",
  "선순위 포기 후 후순위(형제·손자녀 등)에게 넘어가는 효과를 확인해야 하는 경우",
  "이미 일부 예금·물건을 처분했는지 단순승인 위험이 걱정되는 경우",
];

export const renunciationChampionTimeline: string[] = [
  "사망·인지 → ‘안 날’ 기록(기한 기산 기준)",
  "재산·채무 조회(안심상속 등) → 포기 vs 한정승인 vs 단순승인 비교",
  "가족 조율(배우자·자녀·후순위) → 신고 서류 준비",
  "가정법원 신고 → 보정 대응 → 심판·수리 확인",
  "다른 상속인의 등기·협의와 일정 정리",
];

export const renunciationChampionExtraFaqs: ServiceFaq[] = [
  {
    question: "3개월 기한의 ‘안 날’은 어떻게 보나요?",
    answer:
      "원칙적으로 상속 개시를 안 날부터 기산합니다. 사망일과 인지일이 다를 수 있어, 사실관계를 메모해 상담 시 함께 확인합니다.",
  },
  {
    question: "포기 전에 하면 안 되는 행위가 있나요?",
    answer:
      "상속재산을 처분·인출·사용하면 단순승인으로 볼 여지가 생길 수 있습니다. 이미 한 행위가 있으면 시기·용도를 먼저 정리하세요.",
  },
  {
    question: "관할 가정법원은 어디로 가나요?",
    answer:
      "피상속인의 최후 주소지 등을 기준으로 관할이 정해지는 경우가 많습니다. 상담에서 주소·가족관계 자료를 보고 확인합니다.",
  },
  {
    question: "심판 후에는 무엇을 하면 되나요?",
    answer:
      "수리·확정 여부를 확인하고, 다른 상속인의 등기·협의·채무 대응과 일정을 맞춥니다. 본인이 포기한 지분에 대한 상속등기는 하지 않습니다.",
  },
  {
    question: "상속포기 신고와 부동산 등기는 같은 곳에서 하나요?",
    answer:
      "아닙니다. 상속포기는 가정법원 신고이고, 부동산 명의이전은 등기소 접수입니다. 접수처가 달라 일정과 서류를 나눠 준비하는 것이 안전합니다.",
  },
];

export const renunciationChampionExtraRelatedLinks: {
  href: string;
  label: string;
}[] = [
  { href: "/부산한정승인", label: "한정승인 — 채무를 재산 한도로 제한" },
  { href: "/부산상속법무사", label: "상속 절차 선택(등기·포기·한정)" },
  { href: "/situations/상속포기-한정승인-선택", label: "포기·한정승인 상황 선택" },
  {
    href: "/tools/inheritance-renunciation-deadline",
    label: "상속포기 기한 확인 도구",
  },
];
