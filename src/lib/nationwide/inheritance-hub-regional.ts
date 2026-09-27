import type { PageData, PageSection } from "@/lib/pageData/types";

/**
 * /전국상속등기 전용 보강 — 지역별 대표 URL 큐레이션(8–15개, 앵커 다양화)과 과장 문구 정정.
 * pages.ts를 직접 고치지 않아 다른 /전국* 페이지 lastmod가 바뀌지 않는다.
 */
export const INHERITANCE_HUB_REGIONAL = {
  slug: "전국상속등기",
  metaTitle: "전국 상속등기 법무사｜지역이 달라도 한 곳에서 진행 | 다옴법무사사무소",
  metaDescription:
    "전국 상속등기 법무사 안내. 부동산 소재지와 상속인 거주지가 달라도 관할 특례를 검토해 부산 해운대 사무소 한 곳에서 진행합니다. 지역별 가정법원 차이와 방문이 필요한 경우를 함께 정리했습니다.",
  ogImage: {
    src: "/image/og/regional-inheritance-hub.jpg",
    alt: "다옴법무사사무소 안윤정 법무사",
    width: 1200,
    height: 630,
  },
} as const;

const REGIONAL_SECTION: PageSection = {
  id: "regional-inheritance",
  title: "지역별 상속등기 — 부동산 소재지와 상속인 거주지로 나눠 보기",
  body:
    "상속등기에서 먼저 볼 것은 두 가지입니다. 부동산이 어디에 있는지, 그리고 상속인이 어디에 사는지입니다. 상속·유증 등기는 2025년 1월 31일부터 부동산 관할이 아닌 등기소도 처리할 수 있게 되었지만(부동산등기법 제7조의3, 세부 절차는 대법원규칙), 상속포기·한정승인은 돌아가신 분의 마지막 주소지 가정법원에 신고해야 하므로 지역마다 법원이 다릅니다. 다옴법무사사무소는 부산 해운대구에 있는 사무소 한 곳이며, 아래 지역에 지점을 두고 있지 않습니다.",
  items: [
    "부산과 생활권이 붙은 지역(양산·김해·창원·거제): 방문과 비대면을 섞어 진행하기 쉽고, 가정법원은 울산가정법원·창원지방법원 등 부산 밖 법원일 수 있습니다.",
    "동남권 광역시(울산·대구): 상속인이 부산·수도권에 흩어진 경우 비대면 진행이 편하고, 상속인이 모두 현지에 있다면 현지 사무소가 나을 수도 있습니다.",
    "경북(포항·경주·경산·구미)과 서부·남부 경남(진주·통영·밀양): 원본 우편 전달로 진행하며, 해외·미성년 상속인이 있으면 추가 절차를 먼저 확인합니다.",
  ],
  links: [
    { href: "/업무사례/양산상속등기법무사", label: "양산 상속등기(울산가정법원 관할 확인)" },
    { href: "/업무사례/김해상속등기법무사", label: "부산 사는 상속인의 김해 부동산 정리" },
    { href: "/업무사례/창원상속등기법무사", label: "창원 여러 구 부동산 일괄 신청" },
    { href: "/업무사례/거제상속등기법무사", label: "경남 거제시 상속등기" },
    { href: "/업무사례/울산상속등기법무사", label: "울산 아파트·토지 상속등기" },
    { href: "/업무사례/대구상속등기법무사", label: "대구 부동산 비대면 상속등기" },
    { href: "/업무사례/포항상속등기법무사", label: "포항 상속등기 안내" },
    { href: "/업무사례/경주상속등기법무사", label: "경주 농지·임야 상속" },
    { href: "/업무사례/경산상속등기법무사", label: "경산 상속등기" },
    { href: "/업무사례/구미상속등기법무사", label: "구미 부동산과 부산 부모님 집 상속" },
    { href: "/업무사례/진주상속등기법무사", label: "진주 상속, 빚 확인 후 등기" },
    { href: "/업무사례/통영상속등기법무사", label: "통영 섬 지역 토지·주택 상속" },
    { href: "/업무사례/밀양상속등기법무사", label: "밀양 상속, 형제 서류 모으기" },
    { href: "/업무사례/서울상속등기법무사", label: "서울 부동산 상속등기" },
    { href: "/업무사례/지역별상속등기법무사", label: "지역별 상속등기 전체 목록" },
  ],
};

const FAQ_REPLACEMENTS: Record<string, string> = {
  "서울 부동산인데 부산 법무사에게 맡겨도 되나요?":
    "맡기실 수 있습니다. 상속을 원인으로 한 등기는 관할 특례가 적용될 수 있고, 상담과 서류 확인은 방문 없이 시작할 수 있습니다. 다만 해외·미성년 상속인이나 협의가 어려운 상속인이 있으면 추가 절차가 필요할 수 있어 수임 전에 알려드립니다. 취득세 신고는 등기와 별도로 상속개시일이 속한 달의 말일부터 6개월 안에 해야 합니다.",
};

const INTRO_FIRST =
  "부동산이 부산에 있지 않아도 상속등기를 상담하고 진행할 수 있습니다. 상속등기는 관할 특례가 적용되는 범위에서 부동산 소재지와 다른 지역의 등기소를 통한 신청까지 이어갈 수 있어, 전국에 흩어진 부동산도 한 사무소에서 서류부터 신청까지 진행하는 경우가 많습니다. 방문이 필요한 단계가 있는지는 사건마다 먼저 확인해 안내합니다.";

export function applyInheritanceHubRegional(page: PageData): PageData {
  if (page.slug !== INHERITANCE_HUB_REGIONAL.slug) return page;
  const sections = [...page.sections];
  const insertAt = sections.findIndex((s) => s.title === "부동산이 여러 지역에 있을 때");
  sections.splice(insertAt >= 0 ? insertAt : sections.length, 0, REGIONAL_SECTION);
  return {
    ...page,
    metaTitle: INHERITANCE_HUB_REGIONAL.metaTitle,
    metaDescription: INHERITANCE_HUB_REGIONAL.metaDescription,
    introParagraphs: [INTRO_FIRST, ...page.introParagraphs.slice(1)],
    faqs: page.faqs.map((faq) =>
      FAQ_REPLACEMENTS[faq.question] ? { ...faq, answer: FAQ_REPLACEMENTS[faq.question] } : faq,
    ),
    sections,
  };
}
