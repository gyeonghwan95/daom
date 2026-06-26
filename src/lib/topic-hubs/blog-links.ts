import type { TopicHubLink } from "@/lib/topic-hubs/types";

/** 네이버 블로그 글 제목·카테고리 기반 관련 링크 */
export function getBlogPostRelatedLinks(
  title: string,
  category?: string,
): TopicHubLink[] {
  const text = `${title} ${category ?? ""}`;
  const links: TopicHubLink[] = [];

  const rules: { pattern: RegExp; links: TopicHubLink[] }[] = [
    {
      pattern: /상속|유증|한정승인|상속포기/,
      links: [
        { href: "/상속", label: "부산 상속등기·포기·한정승인 허브" },
        { href: "/services/inheritance-registration", label: "부산 상속등기 절차 보기" },
        { href: "/부산상속등기", label: "부산 상속등기 지역 상담" },
      ],
    },
    {
      pattern: /법인|설립|임원|창업|스타트업/,
      links: [
        { href: "/법인등기", label: "부산 법인등기 종합 허브" },
        { href: "/창업법무", label: "센텀 창업·스타트업 법무 안내" },
        { href: "/센텀법인설립등기", label: "센텀 법인설립등기 상담" },
      ],
    },
    {
      pattern: /부동산|소유권|매매|등기|오피스텔|아파트/,
      links: [
        { href: "/부동산등기", label: "부산 부동산등기 허브" },
        { href: "/services/ownership-transfer", label: "부산 소유권이전등기 안내" },
        { href: "/부산부동산등기", label: "부산 부동산등기 지역 상담" },
      ],
    },
    {
      pattern: /회생|파산|채무/,
      links: [
        { href: "/개인회생파산", label: "부산 개인회생·파산 허브" },
        { href: "/부산개인회생", label: "부산회생법원 개인회생 상담" },
        { href: "/부산회생법원법무사", label: "부산회생법원 접수 안내" },
      ],
    },
    {
      pattern: /전세|임대|보증금|임차/,
      links: [
        { href: "/임대차전세", label: "부산 전세보증금·임차권 허브" },
        { href: "/faq/jeonse-registration-faq", label: "임차권등기명령 서류 확인" },
      ],
    },
    {
      pattern: /지급명령|소송|민사|채권/,
      links: [
        { href: "/민사소송", label: "부산 민사·소송서류 허브" },
        { href: "/공탁채권회수", label: "부산 채권회수·공탁 안내" },
      ],
    },
  ];

  for (const rule of rules) {
    if (rule.pattern.test(text)) {
      links.push(...rule.links);
    }
  }

  if (links.length === 0) {
    links.push(
      { href: "/services", label: "부산 법무사 업무안내 보기" },
      { href: "/부산법무사", label: "부산 법무사 지역 상담" },
    );
  }

  const seen = new Set<string>();
  return links.filter((link) => {
    if (seen.has(link.href)) return false;
    seen.add(link.href);
    return true;
  }).slice(0, 6);
}
