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
  /** 본문 섹션 제목 (기본: 기사 본문) */
  bodyHeading?: string;
  /** 소제목이 있는 긴 본문 — paragraphs 뒤에 이어서 표시 */
  sections?: { heading: string; paragraphs: string[] }[];
  /** 대표 이미지 대신 재생할 자체 호스팅 영상 (poster는 image 사용) */
  video?: { src: string; title: string };
  gallery?: readonly SiteImageAsset[];
  relatedLinks?: { href: string; label: string }[];
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
    slug: "sentv-trend-hot-issue-ahn-yoonjung",
    source: "서울경제TV",
    title: "‘조영구의 트렌드 핫이슈’ 출연 — 의뢰인 곁에서 함께하는 법무사 안윤정",
    publishedAt: "2026-09",
    publishedAtDisplay: "2026.09",
    topic: "조영구의 트렌드 핫이슈",
    image: siteImages.press.trendHotIssue2609,
    originalUrl: "https://youtu.be/EfShKaEBrck",
    seoDescription:
      "서울경제TV ‘조영구의 트렌드 핫이슈’ 출연. 부산 해운대 다옴법무사사무소 안윤정 법무사가 상속·법인·부동산 실무, 세 가지 상담 원칙, 생활법률 교육과 정책 자문 활동을 소개했습니다.",
    paragraphs: [
      "다옴법무사사무소 안윤정 법무사가 서울경제TV ‘조영구의 트렌드 핫이슈’에 출연했습니다. 방송은 “복잡한 법률 내용은 쉽게, 필요한 해결 방향은 정확하게”라는 문구로 시작해, 상속 문제부터 기업의 법인 업무, 부동산과 민사 문제까지 시민과 기업이 실제 생활에서 만나는 법률문제를 함께 다뤘습니다.",
      "안 법무사는 부산 해운대구 센텀에서 상속, 부동산등기, 법인등기, 민사 업무를 맡고 있으며, 그중에서도 상속과 기업 법인 업무를 주력으로 하고 있다고 소개했습니다. 방송 출연을 단순한 홍보보다, 법무사로서 어떤 원칙으로 의뢰인을 만나는지 분명하게 말할 수 있는 기회로 삼았다고 밝혔습니다.",
    ],
    bodyHeading: "출연 내용",
    sections: [
      {
        heading: "상속에서 법인·부동산까지, 먼저 사실관계를 듣습니다",
        paragraphs: [
          "부모님이 돌아가신 직후에는 마음을 추스를 시간도 부족한데, 상속등기·상속재산·채무·상속포기·한정승인 같은 낯선 단어를 한꺼번에 마주하게 됩니다. 인터넷에 정보는 많지만 내 가족관계에 그대로 적용되는지 판단하기는 쉽지 않습니다.",
          "법인 업무도 마찬가지입니다. 대표이사 변경, 임원 임기, 본점이전, 목적 추가는 겉으로 간단해 보여도 정관과 등기사항, 주주·임원 구조를 함께 확인해야 하는 경우가 있습니다. 그래서 안 법무사는 신청서부터 쓰기보다 사건의 사실관계를 먼저 듣는다고 말했습니다. 비슷해 보이는 사건도 실제 필요한 절차는 다를 수 있기 때문입니다.",
        ],
      },
      {
        heading: "방송에서 밝힌 세 가지 상담 원칙",
        paragraphs: [
          "첫째, 어려운 법률 내용을 쉽게 설명합니다. “어떤 의뢰인이 오셔도 어렵게 생각하지 않으시도록 항상 쉽게 풀어 드리자는 원칙이 있습니다.” 왜 이 서류가 필요한지, 절차가 어디까지 왔는지, 다음에 무엇을 해야 하는지까지 설명해야 의뢰인의 불안도 줄어든다는 설명입니다.",
          "둘째, 충분히 이야기할 수 있는 분위기를 만듭니다. 상속에서는 가족 관계가, 부동산 거래에서는 잔금 일정과 대출 여부가, 법인등기에서는 실제 의사결정 과정이 절차를 좌우할 수 있습니다. “이것까지 말해야 하나” 싶은 작은 사실이 중요한 변수가 되는 경우가 있어, 편하게 털어놓을 수 있는 상담을 중요하게 여긴다고 했습니다.",
          "셋째, 처음부터 끝까지 진행 상황을 함께 확인합니다. 안 법무사는 “업계에서 조금 젊은 편에 속하다 보니, 중간 상황이든 후속 처리든 빠르게 연락드리는 것을 의뢰인들이 많이 선호하신다”며, 상담부터 서류 준비·신청·보완·완료까지 의뢰인이 현재 단계를 알 수 있도록 안내한다고 말했습니다.",
        ],
      },
      {
        heading: "결국 중요한 것은 ‘접수 전 검토’",
        paragraphs: [
          "상속등기에서 상속인의 범위를 잘못 판단하면 협의를 처음부터 다시 해야 할 수 있고, 이미 사망한 상속인이 있으면 대습상속이나 재상속 관계까지 검토해야 합니다. 부동산등기는 근저당권·가압류·주소변경·소유관계를, 법인등기는 임기·정관·주주총회나 이사회 결의 여부를 사건마다 따로 확인해야 합니다.",
          "다옴법무사사무소는 접수한 뒤 고치는 것보다 접수하기 전에 문제를 찾는 것을 우선합니다. 법무사 자격과 함께 공인중개사 자격도 갖추고 있어, 매매·증여·소유권이전등기 문의에서는 등기 자체뿐 아니라 계약과 잔금, 담보권 정리 등 거래 흐름에서 미리 확인할 부분도 함께 살펴봅니다.",
        ],
      },
      {
        heading: "상담실의 문제를 법률교육과 정책으로",
        paragraphs: [
          "방송에서는 안 법무사가 여러 기관에서 진행하는 생활법률 교육도 소개됐습니다. 전월세 계약과 전세사기 예방, 생활 속 분쟁, 개인정보 보호, 예비·초기 창업자를 위한 창업 법률이 주요 주제입니다. 강의가 끝나면 “이런 법은 정말 몰랐다”, “다음 달 전세 계약 때 꼭 유의해야겠다”는 이야기를 듣게 되고, 그럴 때 직업적 사명감을 느낀다고 했습니다.",
          "상담을 하다 보면 서로 다른 사람들이 같은 원인으로 반복해서 어려움을 겪는 모습을 보게 됩니다. 안 법무사는 이런 피해를 왜 시민이 모두 떠안아야 하는지 고민하며 현장 사례를 정책 아이디어로 정리해 왔고, 현재 기획예산처 1기 청년자문단과 부산광역시 청년정책조정위원회 전문가 위원 등으로 활동하고 있습니다.",
        ],
      },
      {
        heading: "어려운 일이 생겼을 때 가장 먼저 떠오르는 법무사",
        paragraphs: [
          "“발생한 문제는 법률로 해결하고, 법률교육으로 피해를 예방하며, 반복되는 문제는 정책과 제도의 변화로 이끌 수 있는 법무사가 되고 싶습니다.” 안 법무사는 방송을 마무리하며, 의뢰인이 어려움을 겪을 때 처음부터 끝까지 공감하며 이야기를 들어주고 어려운 내용을 쉽게 설명해 주는 법무사로 기억되고 싶다고 말했습니다.",
          "상속등기, 부동산등기, 법인등기 또는 생활 속 법률문제로 무엇부터 해야 할지 막막하다면, 결과를 먼저 장담하기보다 서류와 사실관계를 확인한 뒤 필요한 절차를 설명하는 상담부터 받아 보시길 권합니다.",
        ],
      },
    ],
    video: {
      src: "/video/조영구의트렌드핫이슈.mp4",
      title: "서울경제TV 조영구의 트렌드 핫이슈 — 안윤정 법무사 출연 영상",
    },
    gallery: siteImages.press.trendHotIssueGallery,
    relatedLinks: [
      { href: "/부산법무사", label: "부산 법무사 안윤정" },
      { href: "/부산상속등기", label: "부산 상속등기" },
      { href: "/전세사기예방교육", label: "전세사기 예방교육" },
      { href: "/법률강의", label: "법률 강의·특강" },
    ],
  },
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
