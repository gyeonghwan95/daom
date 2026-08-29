import type { SiteImageAsset } from "@/lib/site-images";
import { siteImages } from "@/lib/site-images";
import { normalizeRouteSlug } from "@/lib/seo/slug";

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
  /** 목록·카드에 날짜 옆에 표시할 주제 (예: 고유가 피해지원금 제도) */
  topic?: string;
  /** 언론사 원문 URL */
  originalUrl?: string;
};

function isYoutubeUrl(url: string): boolean {
  return /youtu\.be\/|youtube\.com\//i.test(url);
}

function isNaverBlogUrl(url: string): boolean {
  return /blog\.naver\.com/i.test(url);
}

/** 원문 링크 표시 문구 */
export function getPressOriginalLinkLabel(
  article: Pick<PressArticle, "source" | "originalUrl">,
  variant: "short" | "cta" | "inline" = "short",
): string {
  const url = article.originalUrl ?? "";
  if (isYoutubeUrl(url)) {
    if (variant === "cta") return "방송 영상 보기 →";
    if (variant === "inline") return "방송 영상";
    return "방송 영상 보기";
  }
  if (isNaverBlogUrl(url)) {
    if (variant === "cta") return "관련 블로그 글 보기 →";
    if (variant === "inline") return "관련 블로그 글";
    return "관련 블로그 글 보기";
  }
  if (variant === "cta") return `${article.source} 원문 기사 보기 →`;
  if (variant === "inline") return `${article.source} 원문 기사`;
  return `${article.source} 원문 보기`;
}

const pressArticles: PressArticle[] = [
  {
    slug: "kukinews-youth-budget-unboxing-2027",
    source: "쿠키뉴스",
    title: "젊은 실무자가 설명하고 청년이 묻고…43조 청년예산 ‘언박싱’",
    publishedAt: "2026-08-28T06:00:07",
    publishedAtDisplay: "2026-08-28 06:00",
    reporter: "황인성 기자",
    topic: "청년예산 언박싱 2027",
    image: siteImages.press.kukinewsYouthBudget260828,
    originalUrl: "https://www.kukinews.com/article/view/kuk202608280152",
    seoDescription:
      "쿠키뉴스 보도. 청년예산 언박싱 2027 — 기획예산처 청년자문단 안윤정 법무사, ‘청년 계약 안전망’ 제안.",
    paragraphs: [
      "정부가 내년도 예산안 제출을 앞두고 청년정책 예산을 국민에게 직접 설명하는 ‘청년예산 언박싱 2027’을 열었다. 28일 오후 청와대 본관에서 열린 행사에는 이재명 대통령과 김민석 국무총리, 관계 부처 장관, 청년자문단과 민간 전문가 등 62명이 참석했다. 정부가 이날 발표한 청년 성장단계별 재정투자는 올해 28조2000억원에서 내년 43조3000억원으로 늘어난다.",
      "정책 발표 이후 청년자문단원들은 현장 경험을 바탕으로 보완책을 제시했다. 부산에서 법무사로 활동하는 기획예산처 청년자문단원 안윤정 법무사는 전월세·주택 매매·창업 등 일정 금액 이상의 계약을 체결하기 전에 전문가의 점검을 받도록 하는 ‘청년 계약 안전망’을 제안했다.",
      "안 법무사는 “계약 전에 한 번만 확인했어도 막을 수 있었던 피해가 많다”며 “피해 발생 후 구제하는 것뿐 아니라 계약 전 예방을 통해 청년의 자산과 국가 재정을 보호해야 한다”고 설명했다. 계약서 검토·등기·창업 절차 등 실무에서 반복적으로 확인되는 피해 유형을 예방 단계로 끌어올리자는 취지다.",
      "다옴법무사사무소 안윤정 법무사는 기획예산처 1기 청년자문단 활동과 함께, 청년·시민을 대상으로 한 생활법률 강의와 전세사기 예방 안내 등 현장 중심의 법률 지원을 이어가고 있다. 보도 원문은 쿠키뉴스에서 확인할 수 있다.",
    ],
  },
  {
    slug: "weeklypeople-youth-judicial-scrivener-ahn",
    source: "주간인물",
    title: "지역 법조계에 활력이 되는 청년 법무사! - 안윤정 다옴법무사사무소 대표 법무사",
    publishedAt: "2026-08-04T00:00:00",
    publishedAtDisplay: "2026-08-04",
    reporter: "박미희 기자",
    image: siteImages.press.weeklyPeople260804,
    originalUrl: "http://www.weeklypeople.co.kr/news/view.php?no=6075",
    seoDescription:
      "주간인물 인터뷰. 안윤정 다옴법무사사무소 대표 법무사 — 대한법무사협회 표창, 해운대 센텀 청년채움공간 개소, 생활법률 강연·정책 자문 활동.",
    paragraphs: [
      "최근 안윤정 법무사가 대한법무사협회 표창을 수상했다. 부산 해운대구 센텀동로에서 다옴법무사사무소를 운영하는 안 법무사는 열린 법무사 사무실을 표방하며, 전세사기 예방 안내를 비롯한 생활 법률 강연과 무료 법률 상담으로 법률 사각지대에 있는 이웃을 돕고 있다.",
      "부산광역시 청년정책조정위원회 전문가 위원, 해운대구정정책자문위원단 자문위원, 기획예산처 1기 청년자문단 등 다양한 활동을 통해 현장의 목소리를 정책에 전하고 있다. 주간인물은 지역 법조계에 활력이 되는 청년 법무사, 안윤정 법무사의 이야기를 담았다.",
      "안 법무사는 비법대 출신으로 2년 6개월 만에 제30회 법무사 시험에 합격했다. 통상 법원 앞에 밀집한 법무사 사무실과 달리, 해운대구 센텀동로 청년채움공간에 사무소를 개소해 창업자·상속·부동산·법인·회생 등 생활 법률 상담의 문턱을 낮추고 있다. 상담부터 서류 준비·접수까지 직접 진행하는 방식을 강조한다.",
      "부산광역시립시민도서관·부산광역시 자립지원전담기관 등에서 전·월세 계약과 전세사기 예방, 생활 속 분쟁을 주제로 강연하고 있으며, 2025년에는 명례일반산업단지 기업들과 법률 지원 MOU를 체결해 등기·계약·분쟁 예방 자문을 수행했다. 민주평화통일자문회의 자문위원 등 대외 활동도 이어가며, 의뢰인 현장과 정책 사이의 공백을 줄이는 데 기여하겠다는 뜻을 밝혔다.",
    ],
  },
  {
    slug: "busan-mbc-news-fuel-price-relief-expert",
    source: "부산 MBC NEWS",
    title: "부산 MBC NEWS 전문가 출연",
    publishedAt: "2026-06-24T00:00:00",
    publishedAtDisplay: "2026.06.24",
    topic: "고유가 피해지원금 제도",
    image: siteImages.press.mbcInterview260624,
    originalUrl: "https://youtu.be/QNJ1Wn9gcxs",
    seoDescription:
      "부산 MBC NEWS 고유가 피해지원금 제도 관련 전문가 촬영. 안윤정 법무사 출연.",
    paragraphs: [
      "안윤정 법무사가 부산 MBC NEWS 고유가 피해지원금 제도 관련 전문가 촬영에 참여했습니다. 고유가 피해지원금과 관련해 실무 현장에서 확인되는 상담 사례와 제도 이용 시 유의점을 전달했습니다.",
      "방송 출연은 제도 안내를 넘어, 일상에서 법률 문제로 어려움을 겪는 시민이 상담을 통해 절차를 이해하고 다음 단계를 준비할 수 있도록 돕는 법무사의 역할을 강조하는 계기가 됐습니다.",
      "고유가 피해지원금·생활 법률 문의는 상담을 통해 개별 상황에 맞는 서류와 신청 절차를 확인하시면 됩니다. 관련 영상은 YouTube에서 확인하실 수 있습니다.",
    ],
  },
  {
    slug: "busan-ilbo-bar-association-64th-general-assembly",
    source: "부산일보",
    title: "부산지방법무사회 제64회 정기총회 개최",
    publishedAt: "2026-06-08T14:53:00",
    publishedAtDisplay: "2026-06-08 14:53",
    reporter: "김동주 기자",
    image: siteImages.press.busanIlbo260608,
    originalUrl:
      "https://www.busan.com/view/busan/view.php?code=2026060813093104520",
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
    originalUrl:
      "https://www.kookje.co.kr/news2011/asp/newsbody.asp?code=2100&key=20260604.22017000978",
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
    reporter: "안재명 기자",
    image: siteImages.press.beopryulSinmun260602,
    originalUrl: "https://www.lawtimes.co.kr/news/articleView.html?idxno=221506",
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
  const key = normalizeRouteSlug(slug);
  return pressArticles.find((article) => normalizeRouteSlug(article.slug) === key);
}

export function getPressArticleSlugs(): string[] {
  return pressArticles.map((article) => article.slug);
}

export function getPressArticleHref(slug: string): string {
  return `/media/${slug}`;
}
