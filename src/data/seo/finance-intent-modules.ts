/**
 * Finance / registration situation modules — additive sections for finance champions.
 * No bank partnership language; natural loan+registration context only.
 */
import type { PageSection } from "@/lib/pageData/types";

export type FinanceSituationCard = {
  situation: string;
  body: string;
  href: string;
  label: string;
};

export const FINANCE_SITUATION_CARDS: FinanceSituationCard[] = [
  {
    situation: "잔금대출이 있는 아파트 매매",
    body: "잔금 실행·소유권이전·매도인 근저당 말소·매수인 신규 근저당 설정 순서를 은행과 맞춰야 합니다.",
    href: "/부산잔금대출근저당",
    label: "잔금대출·근저당 연동 안내",
  },
  {
    situation: "매도인 대출이 아직 남아 있음",
    body: "잔금으로 상환·말소하는 구조가 흔합니다. 말소 서류와 이전등기 일정을 함께 확인합니다.",
    href: "/부산근저당말소등기",
    label: "근저당 말소등기",
  },
  {
    situation: "대출을 모두 갚았는데 근저당이 남아 있음",
    body: "대출 상환만으로 등기부上的 근저당은 자동 소멸하지 않습니다. 말소등기 접수가 필요합니다.",
    href: "/방문없이준비하는근저당말소",
    label: "근저당 말소 준비",
  },
  {
    situation: "공동명의로 매수·담보대출",
    body: "소유자·채무자·담보제공자 표시와 은행 서류가 달라질 수 있습니다. 잔금 전 등기부를 확인합니다.",
    href: "/부산소유권이전등기",
    label: "소유권이전등기",
  },
];

export function buildFinanceSituationSection(): PageSection {
  return {
    title: "이런 상황이라면 — 잔금·대출·등기",
    body: "‘부산 은행 법무사’·‘부산 은행 등기’처럼 검색하시는 경우, 특정 은행 지정 관계가 아니라 잔금·대출·소유권이전·근저당 설정·말소가 겹치는 실무 상황을 찾으시는 경우가 많습니다. 아래에서 가까운 상황을 고른 뒤 해당 안내로 이어가면 됩니다.",
    items: FINANCE_SITUATION_CARDS.map((c) => `${c.situation} — ${c.body}`),
    links: FINANCE_SITUATION_CARDS.map((c) => ({
      href: c.href,
      label: c.label,
    })),
  };
}

export function buildLoanClosingDaySection(): PageSection {
  return {
    title: "은행 대출이 포함된 부동산 잔금을 준비하는 경우",
    body: "부산에서 은행 대출이 포함된 매매 잔금을 준비할 때는 매수인 잔금, 매도인 기존 담보 말소, 소유권이전, 신규 근저당 설정, 취득세·채권·등기 수수료 일정을 함께 봅니다. 특정 은행과의 제휴·지정 관계를 표현하지 않으며, 실무상 필요한 등기·서류 흐름만 안내합니다.",
    items: [
      "잔금일·은행 실행 시간·등기소 접수 마감을 같은 달력으로 맞춥니다.",
      "매도인 말소서류와 매수인 설정 서류를 혼동하지 않습니다.",
      "취득세 신고와 등기 접수 순서를 확인합니다.",
    ],
    links: [
      { href: "/부산잔금대출근저당", label: "잔금대출·근저당 종합" },
      { href: "/부산근저당설정등기", label: "근저당 설정등기" },
      { href: "/부산근저당말소등기", label: "근저당 말소등기" },
    ],
  };
}

export const FINANCE_CHAMPION_SLUGS = new Set([
  "부산잔금일법무사",
  "부산잔금대출근저당",
  "부산근저당말소등기",
  "부산근저당설정등기",
  "부산소유권이전등기",
  "부산부동산등기",
]);

export function getFinanceSectionsForSlug(slug: string): PageSection[] {
  if (!FINANCE_CHAMPION_SLUGS.has(slug)) return [];
  const sections: PageSection[] = [buildFinanceSituationSection()];
  if (slug === "부산잔금일법무사" || slug === "부산잔금대출근저당") {
    sections.unshift(buildLoanClosingDaySection());
  }
  return sections;
}
