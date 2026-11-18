/**
 * 순위가 약한 "부산 ○○ 법무사" 담당 페이지에만 쓰는 소제목 검색어.
 * 일반 소제목(준비서류·절차·자주 묻는 질문)을 "부산 가압류 준비서류"처럼 바꾸고,
 * 절차를 HowTo 구조화 데이터로 내보낸다. 이미 1위인 페이지는 넣지 않는다(2026-11-18 측정 기준).
 * 상속 묶음(/부산상속포기 등)은 별도 회복 관찰 중이라 제외.
 */
export const KEYWORD_HEADINGS: Record<string, string> = {
  부산가압류신청: "부산 가압류",
  부산강제집행법무사: "부산 강제집행",
  부산채권압류추심명령: "부산 채권압류·채권추심",
  부산유언검인: "부산 유언검인",
  부산소액소송: "부산 소액소송",
  부산개명허가: "부산 개명허가",
  부산경매낙찰등기: "부산 경매 낙찰등기",
  부산증여등기: "부산 증여등기",
  부산전세보증금반환법무사: "부산 전세보증금 반환",
  부산개인파산법무사: "부산 개인파산",
  부산파산법무사: "부산 파산",
  부산회생법무사: "부산 회생",
  부산개인회생법무사: "부산 개인회생",
  부산콘도회원권등기: "부산 콘도회원권 등기",
  부산비법인사단부동산등기: "부산 비법인사단 부동산 등기",
  부산동산채권담보등기: "부산 동산담보등기",
};

export function getKeywordHeading(slug: string): string | null {
  return KEYWORD_HEADINGS[slug] ?? null;
}

/** 절차 단계를 HowTo 구조화 데이터로 — 본문에 보이는 단계와 같은 문장만 쓴다 */
export function buildHowToJsonLd(name: string, url: string, steps: string[]) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name,
    url,
    step: steps.map((text, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: text.length > 60 ? `${text.slice(0, 57)}…` : text,
      text,
    })),
  };
}

/** 상단 관할 안내 — 법원 사건 담당 페이지에만 */
export type CourtKind = "civil" | "family" | "rehab";
export const COURT_KIND: Record<string, CourtKind> = {
  부산가압류신청: "civil",
  부산강제집행법무사: "civil",
  부산채권압류추심명령: "civil",
  부산소액소송: "civil",
  부산유언검인: "family",
  부산개명허가: "family",
  부산개인파산법무사: "rehab",
  부산파산법무사: "rehab",
  부산회생법무사: "rehab",
  부산개인회생법무사: "rehab",
};
