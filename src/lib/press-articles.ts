import type { SiteImageAsset } from "@/lib/site-images";
import { siteImages } from "@/lib/site-images";

export type PressArticle = {
  slug: string;
  source: string;
  title: string;
  /** ISO 8601 — 최신순 정렬용 */
  publishedAt: string;
  publishedAtDisplay: string;
  reporter?: string;
  paragraphs: string[];
  image: SiteImageAsset;
  seoDescription?: string;
};

const pressArticles: PressArticle[] = [
  {
    slug: "busan-ilbo-bar-association-64th-general-assembly",
    source: "부산일보",
    title: "부산지방법무사회 제64회 정기총회 개최",
    publishedAt: "2026-06-08T14:53:00",
    publishedAtDisplay: "2026-06-08 14:53",
    reporter: "김동주 기자",
    image: siteImages.press.busanIlbo260608,
    seoDescription:
      "부산지방법무사회 제64회 정기총회 개최. 안윤정 법무사 대한법무사협회 표창 수상.",
    paragraphs: [
      "부산지방법무사회(회장 김치곤)는 최근 부산 농심호텔에서 제64회 정기총회를 개최했다. 이날 총회에는 김문관 부산지방법원장, 김남순 부산지방검찰청 검사장, 성익경 부산회생법원장, 이강천 대한법무사협회장 등 내빈과 회원 450여 명이 참석했다.",
      "총회에서는 무료법률상담 등 공익활동에 기여한 유공자에 대한 시상도 진행됐다. 부산지방법무사회 강정춘 회원이 부산지방법원장 공로패를, 곽보영 연제구 거제1동 공무원이 부산지방법원장 표창장을 받았다. 조황제 회원은 부산지방검찰청 검사장 공로패를, 박재근 회원은 부산회생법원장 공로패, 안윤정 회원은 대한법무사협회 표창패를 각각 수상했다. 이와 함께 김치곤 회장은 부산지방법원 김현우 법원사무관 등 6명에게 감사패를, 김상진 법무사사무원 등 4명에게 모범사무원 표창장을 수여했다.",
      "김치곤 회장은 “여러 가지로 어려운 상황이지만 국민과 가장 가까운 법률전문가로서 전세사기 등으로 어려운 처지에 놓인 시민들을 위한 공익봉사 등 법무사의 공익적 책무를 다하며 시민들에게 사랑과 신뢰를 계속 받을 수 있도록 끊임없이 노력하자”고 당부했다.",
      "이어 열린 본회의에서는 2025회계연도 각 회계별 결산 승인과 2026회계연도 예산안, 회칙 일부개정안, 임원선임 규칙 일부개정안, 재무규칙 제정안 등을 모두 원안대로 의결했다.",
    ],
  },
  {
    slug: "kukje-sinmun-bar-association-64th-general-assembly",
    source: "국제신문",
    title: "부산지방법무사회 정기총회 “공익 법률서비스 확대 강화”",
    publishedAt: "2026-06-03T23:26:00",
    publishedAtDisplay: "2026-06-03 23:26",
    reporter: "임훈 기자",
    image: siteImages.press.kukjeSinmun260603,
    seoDescription:
      "부산지방법무사회 제64회 정기총회. 공익 법률서비스 확대 강화. 안윤정 법무사 대한법무사협회 표창.",
    paragraphs: [
      "부산지방법무사회는 지난달 28일 동래구 농심호텔에서 제64회 정기총회(사진)를 열고 공익 법률서비스 확대와 조직 운영 내실화를 다짐했다.",
      "이날 총회에는 김문관 부산지방법원장, 김남순 부산지방검찰청 검사장, 성익경 부산회생법원장, 이강천 대한법무사협회장 등 주요 법조계 인사와 회원 450여 명이 참석했다. 총회는 공익활동과 지역사회 봉사에 기여한 회원과 관계자에 대한 시상식과 2025회계연도 결산 승인, 2026회계연도 예산안, 회칙 일부 개정안, 임원선임 규칙 개정안, 재무규칙 제정안 등을 처리한 본회의 순으로 진행했다.",
      "시상식에서는 무료 법률상담 등 공익활동에 힘쓴 공로로 강정춘 법무사가 부산지방법원장 공로패, 곽보영 연제구 거제1동 공무원은 부산지방법원장 표창을 받았다. 조황제 법무사는 부산지방검찰청 검사장 공로패, 박재근 법무사는 부산회생법원장 공로패, 안윤정 법무사는 대한법무사협회 표창을 각각 받았다. 김치곤 부산지방법무사회 회장은 부산지방법원 김현우 법원사무관 등 6명에게 감사패, 김상진 법무사사무원 등 4명에게 모범사무원 표창장을 전달했다.",
      "김 회장은 개회사에서 “어려운 사회·경제 여건 속에서도 법무사는 국민과 가장 가까운 법률전문가로서 공익적 책무를 다해야 한다”며 “전세사기 피해자 등 법률적 도움이 필요한 시민을 위한 봉사활동을 확대하고 시민의 사랑과 신뢰를 받는 법무사상을 만들어 가자”고 말했다.",
    ],
  },
  {
    slug: "beopryul-sinmun-bar-association-64th-general-assembly",
    source: "법률신문",
    title: "부산지방법무사회, 제64회 정기총회 개최",
    publishedAt: "2026-06-02T20:53:00",
    publishedAtDisplay: "2026.06.02 20:53",
    image: siteImages.press.beopryulSinmun260602,
    seoDescription:
      "부산지방법무사회 제64회 정기총회 개최. 안윤정 법무사 대한법무사협회 표창패 수상.",
    paragraphs: [
      "부산지방법무사회(회장 김치곤)는 5월 28일 부산 온천동 농심호텔에서 제64회 정기총회를 열고 예결산안 승인 및 유공자에 대한 시상 등을 진행했다.",
      "이날 총회에는 김문관(사법연수원 23기) 부산지방법원장, 김남순(30기) 부산지방검찰청 검사장, 성익경(26기) 부산회생법원장, 이강천 대한법무사협회장 등 450여 명이 참석했다.",
      "시상식에서 강정춘 법무사는 부산지방법원장 공로패, 곽보영 공무원은 부산지방법원장 표창장, 조황제 법무사는 부산지방검찰청 검사장 공로패, 박재근 법무사는 부산회생법원장 공로패, 안윤정 법무사는 대한법무사협회 표창패를 수상했다.",
      "김치곤 회장은 부산지법 김현우 법원사무관 외 5명에게 감사패를, 김상진 법무사사무원 외 3명에게 모범사무원 표창장을 수여했다.",
    ],
  },
];

export function getAllPressArticles(): PressArticle[] {
  return [...pressArticles].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
}

export function getPressArticle(slug: string): PressArticle | undefined {
  return pressArticles.find((article) => article.slug === slug);
}

export function getPressArticleSlugs(): string[] {
  return pressArticles.map((article) => article.slug);
}

export function getPressArticleHref(slug: string): string {
  return `/media/${slug}`;
}
