import type { LocalLandingPageType } from "@/types/local-landing";
import type { LocalLandingPage } from "@/types/local-landing";
import type { ServiceDetail } from "@/types/service";
import type { ContentMeta } from "@/types/content-mdx";
import type { PressArticle } from "@/lib/press-articles";
import type { TopicHubPage } from "@/lib/topic-hubs/types";
import type { NaverBlogPost } from "@/lib/naver-blog/types";
import { getServiceLabel } from "@/lib/content/loader";
import { faqs as faqEntries } from "@/lib/faq-data";
import {
  HOME_METADATA_DESCRIPTION,
  HOME_METADATA_TITLE,
} from "@/lib/seo/metadata";
import { staticPageSeo } from "@/lib/seo/page-seo";
import { getNaverBlogExternalPath } from "@/lib/naver-blog/urls";
import {
  getBlogPostImage,
  getCaseImage,
  getServiceImage,
  siteImages,
} from "@/lib/site-images";
import { buildMetaDescription, buildMetaTitle } from "./seo";
import { createPageData } from "./template-helpers";
import type { PageCategory, PageData, PageSection } from "./types";

export function mapLandingPageTypeToCategory(
  pageType: LocalLandingPageType,
): PageCategory {
  switch (pageType) {
    case "conversion":
      return "cost";
    case "court-registry":
      return "court";
    case "business-zone":
      return "businessDistrict";
    case "real-estate-dev":
      return "realEstate";
    case "region-hub":
    case "keyword-hub":
    case "neighborhood-hub":
    case "preservation-registration":
    case "public-agency-registration":
    case "selection-hub":
    case "search-intent":
    case "lecture":
    case "b2b-collaboration":
    case "business":
    case "service-region":
    default:
      return "local";
  }
}

function sectionsFromLocalLanding(page: LocalLandingPage): PageSection[] {
  if (
    page.pageType === "preservation-registration" ||
    page.pageType === "public-agency-registration" ||
    page.pageType === "selection-hub" ||
    page.pageType === "search-intent" ||
    page.pageType === "lecture" ||
    page.pageType === "business" ||
    page.pageType === "b2b-collaboration"
  ) {
    return [];
  }

  if (page.pageType === "keyword-hub") {
    const sections: PageSection[] = [];
    if (page.slug === "부산등기법무사") {
      sections.push({
        title: "신축건물 보존등기",
        body: "신축 건물·집합건물·상가·오피스텔은 사용승인 후 보존등기로 등기부를 처음 만드는 경우가 많습니다. 건축주·건축사사무소·시행사가 고객에게 안내하기 좋은 전용 페이지로 연결됩니다.",
        links: [
          {
            href: "/부산신축건물보존등기",
            label: "부산 신축건물 보존등기 절차·서류 안내",
          },
        ],
      });
      sections.push({
        title: "공공기관 등기업무",
        body: "공기업·지방공기업·출자·출연기관·공사·공단 담당자를 위한 법인등기·부동산등기·촉탁등기 안내입니다. 내부 결재와 등기 실무를 함께 검토할 때 참고할 수 있습니다.",
        links: [
          {
            href: "/공공기관등기업무",
            label: "공공기관 등기업무 종합 안내",
          },
        ],
      });
    }
    sections.push(
      {
        title: "이런 경우 필요한 등기입니다",
        body: `${page.regionLabel}에서 아래와 같은 상황이면 ${page.title} 절차를 검토해 보시면 좋습니다. 등기부·계약서를 함께 확인하면 필요 여부와 순서를 정하기 쉽습니다.`,
        items: page.whenNeeded,
      },
      {
        title: "비용이 달라지는 요소",
        body: page.costGuide,
        items: page.costFactors ?? page.precautions,
      },
      {
        title: "법무사 상담이 필요한 경우",
        body: `다음과 같은 상황에서는 혼자 진행하기보다 ${page.regionLabel} 등기 법무사와 상담하시는 것이 안전합니다. 기한·순서·서류 오류를 줄이는 데 도움이 됩니다.`,
        items: page.legalIssues,
      },
      {
        title: "관할·접근 안내",
        body: page.jurisdictionGuide.jurisdictionNote,
        items: page.jurisdictionGuide.practicalNotes,
      },
      {
        title: "법무사 의견",
        body: page.lawyerOpinion,
      },
    );
    return sections;
  }

  if (page.pageType === "neighborhood-hub") {
    return [
      {
        title: "지역 생활권 안내",
        body: page.neighborhoodLivingArea ?? page.problemStatement,
      },
      {
        title: "많이 발생하는 상담 유형",
        body: `${page.regionLabel} 생활권에서 아래와 같은 등기·송무 상담이 자주 이어집니다. 사건마다 필요 서류와 관할이 달라지므로 상담 시 확인합니다.`,
        items: page.whenNeeded,
      },
      {
        title: "관할·등기소 안내",
        body: page.jurisdictionGuide.jurisdictionNote,
        items: page.jurisdictionGuide.practicalNotes,
      },
      {
        title: "법무사 상담이 필요한 경우",
        body: `등기부 권리관계·가족 협의·채무·기한이 얽히면 ${page.regionLabel} 사건도 전문가 상담이 도움이 됩니다.`,
        items: page.legalIssues,
      },
      {
        title: "법무사 의견",
        body: page.lawyerOpinion,
      },
    ];
  }

  return [
    {
      title: "비용 안내",
      body: page.costGuide,
    },
    {
      title: "관할·접근 안내",
      body: page.jurisdictionGuide.jurisdictionNote,
      items: page.jurisdictionGuide.practicalNotes,
    },
    {
      title: "법무사 의견",
      body: page.lawyerOpinion,
    },
  ];
}

export function buildPageDataFromLocalLanding(
  page: LocalLandingPage,
): PageData {
  const category = mapLandingPageTypeToCategory(page.pageType);

  const metaTitle =
    page.metaTitle ??
    (page.pageType === "court-registry" && page.slug.endsWith("법무사")
      ? buildMetaTitle(`${page.slug.replace(/법무사$/, "")} 법무사 안내`)
      : buildMetaTitle(`${page.title} 안내`));

  const introParagraphs =
    page.summaryParagraphs && page.summaryParagraphs.length > 0
      ? page.summaryParagraphs
      : [
          page.description,
          `${page.regionLabel} ${page.neighborhoods.slice(0, 3).join("·")} 일대에서 상속등기·부동산등기·법인등기·개인회생 등을 상담합니다.`,
        ];

  const consultationPoints =
    page.pageType === "keyword-hub" ||
    page.pageType === "neighborhood-hub" ||
    page.pageType === "preservation-registration" ||
    page.pageType === "public-agency-registration" ||
    page.pageType === "selection-hub" ||
    page.pageType === "search-intent" ||
    page.pageType === "lecture"
      ? page.legalIssues.slice(0, 6)
      : [...page.legalIssues, ...page.precautions].slice(0, 6);

  const primaryKeywords =
    page.primaryKeywords && page.primaryKeywords.length > 0
      ? page.primaryKeywords
      : [
          page.regionLabel,
          "부산 법무사",
          "부산법무사",
          page.title.replace(page.regionLabel, "").trim(),
        ].filter(Boolean);

  const specialLandingFaqs =
    page.pageType === "preservation-registration" ||
    page.pageType === "public-agency-registration" ||
    page.pageType === "selection-hub" ||
    page.pageType === "search-intent" ||
    page.pageType === "lecture"
      ? page.faqs.map((f) => ({ question: f.question, answer: f.answer }))
      : page.faqs.slice(0, 3).map((f) => ({
          question: f.question,
          answer: f.answer,
        }));

  const extraSections = [...sectionsFromLocalLanding(page)];
  if (page.slug === "부산부동산등기") {
    extraSections.unshift({
      title: "공공기관 부동산등기·촉탁등기",
      body: "공유재산 취득·처분, 공공사업 보상, 기부채납, 도시개발·산업단지 관련 부동산 등기는 원인서류와 촉탁 가능 여부를 함께 검토합니다. 공공기관 담당자는 내부 결재·공문과 등기 실무를 맞춰 진행하는 것이 좋습니다.",
      links: [
        {
          href: "/공공기관등기업무",
          label: "공공기관 등기업무 안내",
        },
      ],
    });
    extraSections.unshift({
      title: "신축 소유권보존등기",
      body: "신축 건물·집합건물·상가·오피스텔은 사용승인 후 보존등기로 등기부를 처음 만드는 경우가 많습니다. 이후 매매·담보대출·분양·소유권이전의 기초가 되므로, 건축물대장과 소유권 서류를 사용승인 직후부터 정리하는 것이 좋습니다.",
      links: [
        {
          href: "/부산신축건물보존등기",
          label: "부산 신축건물 보존등기 안내",
        },
        {
          href: "/부산신축아파트소유권이전등기",
          label: "신축 아파트 소유권이전등기",
        },
      ],
    });
  }
  if (page.slug === "부산법인등기") {
    extraSections.unshift({
      title: "공공기관 법인등기",
      body: "공기업·지방공기업·출자·출연기관의 임원변경, 본점이전, 명칭·목적 변경, 해산·청산 등 법인등기는 내부 의결서와 정관을 함께 확인합니다. 등기기한과 과태료도 사전에 검토하는 것이 좋습니다.",
      links: [
        {
          href: "/공공기관등기업무",
          label: "공공기관 법인등기·등기업무 안내",
        },
        { href: "/부산임원변경등기", label: "부산 임원변경등기" },
      ],
    });
  }
  if (page.slug === "부산법무사") {
    extraSections.unshift({
      title: "부산 법무사 추천을 검색했다면 먼저 확인할 기준",
      body: "추천·잘하는 곳·후기 검색 전에 업무 범위·서류 안내·기한 설명·비용 구분을 확인하는 기준을 정리해 두었습니다. 특정 사무소를 대신 골라 주는 페이지가 아니라, 상담 전 스스로 비교할 체크리스트입니다.",
      links: [
        { href: "/부산법무사추천", label: "부산 법무사 추천 선택 기준" },
        { href: "/부산법무사비교", label: "부산 법무사 비교 기준" },
        { href: "/부산법무사상담", label: "부산 법무사 상담 준비" },
        { href: "/부산법무사후기", label: "후기를 볼 때 확인할 기준" },
      ],
    });
  }
  if (page.slug === "부산등기법무사") {
    extraSections.unshift({
      title: "등기 법무사 선택 기준",
      body: "부산 등기 법무사 추천을 검색하실 때 부동산·상속·법인·근저당 등 업무별로 확인할 점이 다릅니다. 등기부·계약서를 준비한 뒤 아래 선택 기준 페이지를 참고해 상담하시면 비교가 수월합니다.",
      links: [
        { href: "/부산등기법무사추천", label: "부산 등기 법무사 선택 기준" },
        { href: "/부산부동산등기전문", label: "부산 부동산등기 상담 확인사항" },
        { href: "/부산상속등기전문", label: "부산 상속등기 상담 확인사항" },
        { href: "/부산법인등기전문", label: "부산 법인등기 상담 확인사항" },
      ],
    });
  }
  if (page.slug === "부산개인회생" || page.slug === "부산개인파산") {
    extraSections.unshift({
      title: "회생·파산 관련 검색의도 안내",
      body: "개인회생·파산 법무사·상담·신청·면책·비용 등 세부 검색어는 검색의도 허브와 아래 페이지에서 이어서 확인하실 수 있습니다. 기존 URL은 그대로 유지됩니다.",
      links: [
        { href: "/search-guides#guide-rehab", label: "개인회생·파산 검색의도" },
        { href: "/부산개인회생법무사", label: "부산 개인회생 법무사" },
        { href: "/부산개인파산법무사", label: "부산 개인파산 법무사" },
        { href: "/개인회생체크리스트", label: "개인회생 체크리스트" },
        { href: "/왜개인회생비용이다를까", label: "왜 개인회생 비용이 다를까" },
      ],
    });
  }
  if (page.slug === "공공기관등기업무") {
    extraSections.unshift({
      title: "공공기관·촉탁등기 세부 키워드",
      body: "공공기관 법인등기·부동산등기·촉탁등기·지방공기업 등기 등 세부 검색어 안내를 추가했습니다. 종합 안내는 이 페이지를 기준으로 보시면 됩니다.",
      links: [
        { href: "/search-guides#guide-public", label: "공공기관 검색의도" },
        { href: "/촉탁등기", label: "촉탁등기" },
        { href: "/공공기관법인등기", label: "공공기관 법인등기" },
        { href: "/공공기관부동산등기", label: "공공기관 부동산등기" },
      ],
    });
  }
  if (page.slug === "부산신축건물보존등기") {
    extraSections.unshift({
      title: "건축주·보존등기 검색의도",
      body: "신축·건물·집합건물·오피스텔·상가 보존등기, 건축주 준비서류, 사용승인 후 등기 등 세부 키워드는 아래 검색의도 페이지에서 이어서 확인하세요.",
      links: [
        { href: "/search-guides#guide-builder", label: "건축주 검색의도" },
        { href: "/신축보존등기", label: "신축 보존등기" },
        { href: "/건축주준비서류", label: "건축주 준비서류" },
        { href: "/신축보존등기체크리스트", label: "신축 보존등기 체크리스트" },
      ],
    });
  }
  if (page.slug === "부산법무사비용" || page.slug === "부산법무사보수표") {
    extraSections.unshift({
      title: "수임료·보수·세금·공과금의 차이",
      body: "법무사 수임료(보수)와 취득세·등록면허세·국민주택채권·인지·등기신청수수료는 성격이 다릅니다. 견적을 받을 때는 무엇이 포함되고 무엇이 별도인지 항목별로 확인하세요. 보정·출장·복대리가 있으면 추가될 수 있습니다.",
      items: [
        "수임료·착수금·잔금(사건별 약정)",
        "등록면허세·취득세 등 세금",
        "국민주택채권·인지·증지",
        "등기신청수수료·송달료",
        "보정·출장·복대리 등 실비성 비용",
      ],
      links: [
        { href: "/부산법무사보수표", label: "부산 법무사 보수표 안내" },
        { href: "/부산법무사수임료", label: "수임료 키워드 안내" },
        { href: "/등기비용", label: "등기 비용 항목" },
        { href: "/왜상속등기비용이다를까", label: "왜 상속등기 비용이 다를까" },
        { href: "/contact", label: "견적 문의" },
      ],
    });
    extraSections.unshift({
      title: "견적을 받을 때 알려 주시면 좋은 정보",
      body: "사건 유형, 부동산·법인 정보, 명의·대출·말소 여부, 기한, 보유 서류를 알려 주시면 항목별 안내가 수월합니다. 근거 없는 고정 가격은 표시하지 않습니다.",
      links: [
        { href: "/법무사상담전준비", label: "상담 전 준비" },
        { href: "/자가진단", label: "업무별 자가진단" },
      ],
    });
  }
  if (page.slug === "부산개인회생" || page.slug === "개인회생파산") {
    extraSections.push({
      title: "개인회생·파산 검색의도 더 보기",
      body: "법무사·신청자격·보정권고·면책 등 세부 의도는 관련 안내 페이지와 자가진단에서 이어서 확인하세요. 인가·면책은 보장하지 않습니다.",
      links: [
        { href: "/부산개인회생법무사", label: "부산 개인회생 법무사" },
        { href: "/부산개인파산법무사", label: "부산 개인파산 법무사" },
        { href: "/개인회생체크리스트", label: "개인회생 체크리스트" },
        { href: "/개인회생자가진단", label: "개인회생 자가진단" },
        { href: "/개인파산자가진단", label: "개인파산 자가진단" },
      ],
    });
  }

  return createPageData({
    slug: page.slug,
    path: page.path,
    category,
    title: page.title,
    metaTitle,
    metaDescription: buildMetaDescription(page.description),
    h1: page.h1,
    intro: page.problemStatement,
    breadcrumbs:
      page.pageType === "lecture"
        ? page.slug === "법률강의"
          ? [{ label: "홈", href: "/" }, { label: page.title }]
          : [
              { label: "홈", href: "/" },
              { label: "법률 강의", href: "/법률강의" },
              { label: page.title },
            ]
        : page.pageType === "search-intent"
          ? [
              { label: "홈", href: "/" },
              { label: "검색의도 안내", href: "/search-guides" },
              { label: page.title },
            ]
          : page.pageType === "b2b-collaboration"
            ? page.slug === "partners"
              ? [
                  { label: "홈", href: "/" },
                  { label: "협업문의" },
                ]
              : page.slug === "협업문의"
                ? [
                    { label: "홈", href: "/" },
                    { label: "협업문의", href: "/partners" },
                    { label: "협업 문의서" },
                  ]
                : [
                    { label: "홈", href: "/" },
                    { label: "협업문의", href: "/partners" },
                    { label: page.title },
                  ]
            : [{ label: "홈", href: "/" }, { label: page.title }],
    introParagraphs,
    procedures: page.procedures,
    documents: page.documents,
    consultationPoints,
    faqs: specialLandingFaqs,
    includeFaqSchema:
      page.pageType === "preservation-registration" ||
      page.pageType === "public-agency-registration" ||
      page.pageType === "selection-hub" ||
      page.pageType === "search-intent" ||
      page.pageType === "lecture",
    consultationExample: {
      title: page.consultationCase.title,
      body: page.consultationCase.summary,
    },
    internalLinks: [
      ...page.relatedServiceLinks,
      ...page.relatedRegionLinks,
      ...page.relatedBlogHrefs,
      ...(page.consultationCase.href
        ? [{ href: page.consultationCase.href, label: "관련 사례 보기" }]
        : []),
    ],
    sections: extraSections,
    primaryKeywords,
    serviceSlug: page.serviceSlug,
    landingPageType: page.pageType,
    regionKey: page.regionKey,
    ogImage: getServiceImage(page.serviceSlug).src,
  });
}

export function buildPageDataFromTopicHub(page: TopicHubPage): PageData {
  const sections: PageSection[] = page.sections.map((section) => ({
    title: section.title,
    body: section.intro,
    links: section.links,
  }));

  return createPageData({
    slug: page.slug,
    path: page.path,
    category: "pillar",
    title: page.title,
    metaTitle: buildMetaTitle(page.title),
    metaDescription: buildMetaDescription(page.description),
    h1: page.h1,
    intro: page.intro,
    breadcrumbs: [
      { label: "홈", href: "/" },
      { label: "업무안내", href: "/services" },
      { label: page.title },
    ],
    introParagraphs: [page.ctaDescription],
    consultationPoints: page.sections.flatMap((s) => s.links.map((l) => l.label)).slice(0, 5),
    faqs: page.faqs.slice(0, 3).map((f) => ({
      question: f.question,
      answer: f.answer,
    })),
    consultationExample: {
      title: `${page.title.replace(" 종합 안내", "")} 상담 예시`,
      body: `부산 전역에서 ${page.title.replace(" 종합 안내", "")} 관련 문의가 이어지고 있습니다. 상속인 구성·채무·부동산 유무에 따라 필요한 절차가 달라지므로, 먼저 상황을 정리한 뒤 서류·비용·기한을 단계별로 안내드립니다.`,
    },
    internalLinks: [
      ...(page.jurisdictionHref
        ? [{ href: page.jurisdictionHref, label: "관할·법원 안내" }]
        : []),
      ...(page.costHref
        ? [{ href: page.costHref, label: "비용 안내" }]
        : []),
      ...(page.documentsHref
        ? [{ href: page.documentsHref, label: "필요 서류" }]
        : []),
      ...page.relatedHubLinks,
      ...page.sections.flatMap((s) => s.links).slice(0, 4),
    ],
    sections,
    primaryKeywords: [
      page.title.replace(" 종합 안내", ""),
      "부산 법무사",
      "해운대 법무사",
      "센텀 법무사",
    ],
    ogImage: getServiceImage(page.primaryServiceSlug).src,
    serviceSlug: page.primaryServiceSlug,
  });
}

const SERVICE_PAGE_SEO: Record<
  string,
  { metaTitle: string; h1: string }
> = {
  "inheritance-registration": {
    metaTitle: "전국 상속등기 법무사｜부산 방문 없이 타지역 부동산도 진행",
    h1: "전국 상속등기 상담",
  },
  "inheritance-renunciation": {
    metaTitle: "상속포기 절차·3개월 기한｜가정법원 신고·주의사항",
    h1: "상속포기 — 3개월 기한·채무 승계 차단",
  },
  "qualified-acceptance": {
    metaTitle: "한정승인 절차｜재산 범위 내 채무·재산목록",
    h1: "한정승인 — 재산 범위 내 채무만 책임질 때",
  },
  "real-estate-registration": {
    metaTitle: "부동산등기 절차·서류｜소유권·담보·말소",
    h1: "부동산등기 — 소유권·담보·말소 상담",
  },
  "ownership-transfer": {
    metaTitle: "소유권이전등기｜매매·잔금 후 명의이전 서류",
    h1: "소유권이전등기 — 매매·증여 명의변경",
  },
  "corporate-registration": {
    metaTitle: "법인등기｜설립·임원변경·본점이전 절차",
    h1: "법인등기 — 설립·임원·본점 변경 상담",
  },
  "company-establishment": {
    metaTitle: "법인설립등기 서류·절차｜정관·납입·인감",
    h1: "법인설립등기 — 준비서류와 설립 순서",
  },
  "director-change": {
    metaTitle: "임원변경등기 기한·과태료｜대표이사·이사 변경",
    h1: "임원변경등기 — 임기 만료·과태료 주의",
  },
  "personal-rehabilitation": {
    metaTitle: "개인회생 가능 여부｜소득·채무·변제계획 기준",
    h1: "개인회생 — 빚을 감당하기 어려울 때 판단 기준",
  },
  bankruptcy: {
    metaTitle: "개인파산·면책｜신청 자격·회생과의 선택",
    h1: "개인파산·면책 — 신청 자격과 절차",
  },
};

export function buildPageDataFromService(service: ServiceDetail): PageData {
  const seo = SERVICE_PAGE_SEO[service.slug] ?? {
    metaTitle: `${service.title} 절차·서류·비용｜부산 법무사`,
    h1: `부산 ${service.title} — 절차·서류 상담`,
  };

  return createPageData({
    slug: service.slug,
    path: `/services/${service.slug}`,
    category: "service",
    title: service.title,
    metaTitle: buildMetaTitle(seo.metaTitle),
    metaDescription: buildMetaDescription(service.description),
    h1: seo.h1,
    intro: service.intro,
    breadcrumbs: [
      { label: "홈", href: "/" },
      { label: "업무안내", href: "/services" },
      { label: service.title },
    ],
    introParagraphs: [service.whenNeeded, service.ourApproach],
    procedures: service.procedures,
    documents: service.documents,
    consultationPoints: service.commonIssues,
    faqs: service.faqs.slice(0, 3).map((f) => ({
      question: f.question,
      answer: f.answer,
    })),
    consultationExample: service.relatedCase
      ? {
          title: service.relatedCase.label,
          body: `${service.title} 사건과 유사한 상담이 있었습니다. 의뢰인 상황에 맞춰 절차·서류·비용을 단계별로 안내한 뒤 진행했습니다. 자세한 경과는 사례 페이지에서 확인하실 수 있습니다.`,
        }
      : undefined,
    internalLinks: [
      ...service.relatedLinks,
      ...(service.relatedCase
        ? [{ href: service.relatedCase.href, label: service.relatedCase.label }]
        : []),
      { href: "/services", label: "업무안내 목록" },
      { href: "/faq", label: "FAQ" },
    ],
    sections: [
      { title: "진행 방식", body: service.ourApproach },
    ],
    primaryKeywords: [
      `부산 ${service.title}`,
      "부산 법무사",
      "해운대 법무사",
      service.title,
    ],
    ogImage: getServiceImage(service.slug).src,
    includeFaqSchema: true,
    serviceSlug: service.slug,
  });
}

export function buildPageDataFromBlogMeta(meta: ContentMeta): PageData {
  return createPageData({
    slug: meta.slug,
    path: meta.href,
    category: "blog",
    title: meta.title,
    metaTitle: buildMetaTitle(meta.seoTitle ?? meta.title),
    metaDescription: buildMetaDescription(
      meta.seoDescription ?? meta.description,
    ),
    h1: meta.title,
    intro: meta.description,
    breadcrumbs: [
      { label: "홈", href: "/" },
      { label: "블로그", href: "/blog" },
      { label: meta.title },
    ],
    introParagraphs: [
      `${meta.area ?? "부산"} 지역 의뢰인을 위한 ${meta.category} 글입니다.`,
      "상속등기·부동산등기·법인등기·개인회생 등 실무 기준으로 정리했습니다.",
    ],
    consultationPoints: meta.tags.slice(0, 5),
    internalLinks: [
      ...(meta.relatedServices ?? []).map((slug) => ({
        href: `/services/${slug}`,
        label: getServiceLabel(slug),
      })),
      { href: "/blog", label: "블로그 안내" },
      { href: "/faq", label: "FAQ" },
      { href: "/contact", label: "상담 문의" },
    ],
    sections: [
      {
        title: meta.category,
        body: "아래 상세 안내에서 절차·주의사항·준비 포인트를 확인하실 수 있습니다.",
        items: meta.tags,
      },
    ],
    primaryKeywords: [...meta.tags, "부산 법무사", meta.category],
    ogImage: getBlogPostImage(meta.slug).src,
    openGraphType: "article",
    serviceSlug: meta.relatedServices?.[0],
  });
}

export function buildPageDataFromCaseMeta(meta: ContentMeta): PageData {
  return createPageData({
    slug: meta.slug,
    path: `/services/cases/${meta.slug}`,
    category: "case",
    title: meta.title,
    metaTitle: buildMetaTitle(meta.seoTitle ?? `부산 ${meta.title}`),
    metaDescription: buildMetaDescription(
      meta.seoDescription ?? meta.description,
    ),
    h1: meta.title,
    intro: meta.description,
    breadcrumbs: [
      { label: "홈", href: "/" },
      { label: "사례 탐색기", href: "/cases" },
      { label: meta.title },
    ],
    introParagraphs: [
      `${meta.area ?? "부산"}에서 진행한 ${meta.category} 유형 사례입니다.`,
    ],
    consultationExample: {
      title: meta.title,
      body: meta.description,
    },
    internalLinks: [
      ...(meta.relatedServices ?? []).map((slug) => ({
        href: `/services/${slug}`,
        label: getServiceLabel(slug),
      })),
      { href: "/cases", label: "사례 탐색기" },
      { href: "/services", label: "업무안내" },
      { href: "/contact", label: "상담 문의" },
    ],
    sections: [
      {
        title: "사례 배경",
        body: "상담 시 확인한 쟁점과 진행 경과를 바탕으로 정리했습니다. 동일한 상황이라도 세부 사항에 따라 절차가 달라질 수 있습니다.",
        items: meta.tags,
      },
    ],
    primaryKeywords: [...meta.tags, "부산 법무사", "상담 사례"],
    ogImage: getCaseImage(meta.slug).src,
    openGraphType: "article",
    serviceSlug: meta.relatedServices?.[0],
  });
}

export function buildPageDataFromFaqMeta(meta: ContentMeta): PageData {
  const faqEntry = faqEntries.find((f) => f.slug === meta.slug);

  return createPageData({
    slug: meta.slug,
    path: meta.href,
    category: "faq",
    title: meta.title,
    metaTitle: buildMetaTitle(meta.seoTitle ?? meta.title),
    metaDescription: buildMetaDescription(
      meta.seoDescription ?? meta.description,
    ),
    h1: meta.title,
    intro: meta.description,
    breadcrumbs: [
      { label: "홈", href: "/" },
      { label: "FAQ", href: "/faq" },
      { label: meta.title },
    ],
    faqs: faqEntry
      ? [{ question: faqEntry.question, answer: faqEntry.answer }]
      : [{ question: meta.title, answer: meta.description }],
    internalLinks: [
      ...(meta.relatedServices ?? []).map((slug) => ({
        href: `/services/${slug}`,
        label: getServiceLabel(slug),
      })),
      { href: "/faq", label: "FAQ 목록" },
      { href: "/blog", label: "블로그 안내" },
      { href: "/contact", label: "상담 문의" },
    ],
    sections: [
      {
        title: "답변 요약",
        body: meta.description,
        items: meta.tags,
      },
    ],
    primaryKeywords: [...meta.tags, "부산 법무사", "FAQ"],
    ogImage: siteImages.faq.cover.src,
    includeFaqSchema: true,
    openGraphType: "article",
    serviceSlug: meta.relatedServices?.[0],
  });
}

export function buildPageDataFromPress(article: PressArticle): PageData {
  const intro = article.paragraphs[0] ?? article.seoDescription ?? "";

  return createPageData({
    slug: article.slug,
    path: `/media/${article.slug}`,
    category: "media",
    title: article.title,
    metaTitle: buildMetaTitle(`${article.source} — ${article.title}`),
    metaDescription: buildMetaDescription(
      article.seoDescription ?? intro,
    ),
    h1: article.title,
    intro,
    breadcrumbs: [
      { label: "홈", href: "/" },
      { label: "언론·활동", href: "/media" },
      { label: article.title },
    ],
    introParagraphs: article.paragraphs.slice(1, 3),
    consultationExample: {
      title: `${article.source} 보도 관련 안내`,
      body: "언론 보도 내용은 당시 활동을 기록한 것이며, 개별 법률 사건 상담과는 별도입니다. 상속·등기·회생 등 구체적 문의는 상담 채널을 이용해 주세요.",
    },
    internalLinks: [
      { href: "/media", label: "언론·활동 목록" },
      { href: "/about", label: "법무사 소개" },
      { href: "/services", label: "업무안내" },
      { href: "/contact", label: "상담 문의" },
    ],
    sections: article.paragraphs.map((paragraph, index) => ({
      title: index === 0 ? "보도 내용" : `이어지는 내용`,
      body: paragraph,
    })),
    primaryKeywords: [
      article.source,
      "안윤정 법무사",
      "부산 법무사",
      "언론보도",
    ],
    ogImage: article.image.src,
    openGraphType: "article",
  });
}

export function buildPageDataFromNaverExternal(
  post: NaverBlogPost & { postId: string },
): PageData {
  const path = getNaverBlogExternalPath(post.postId);

  return createPageData({
    slug: post.postId,
    path,
    category: "external",
    title: post.title,
    metaTitle: buildMetaTitle(post.title),
    metaDescription: buildMetaDescription(
      post.description
        ? `${post.title}. ${post.description}`
        : post.title,
    ),
    h1: post.title,
    intro: post.description,
    breadcrumbs: [
      { label: "홈", href: "/" },
      { label: "블로그", href: "/blog" },
      { label: "네이버 블로그" },
      { label: post.title },
    ],
    internalLinks: [
      { href: "/blog", label: "블로그 안내" },
      { href: post.link, label: "네이버 블로그 원문" },
      { href: "/services", label: "업무안내" },
      { href: "/contact", label: "상담 문의" },
    ],
    sections: [
      {
        title: post.category ?? "법률 칼럼",
        body: "네이버 블로그에 게시된 글을 사이트에서 요약해 안내합니다. 아래 상세 안내와 원문을 함께 참고해 주세요.",
        links: [{ href: post.link, label: "네이버 블로그 원문 보기" }],
      },
    ],
    primaryKeywords: [
      post.category ?? "법률 칼럼",
      "부산 법무사",
      "네이버 블로그",
    ],
    ogImage: siteImages.blog.defaultThumb.src,
    openGraphType: "article",
  });
}

type StaticCoreKey = keyof typeof staticPageSeo;

const coreH1Map: Record<StaticCoreKey, string> = {
  about: "부산 법무사 소개",
  office: "해운대·센텀 법무사 사무소",
  services: "부산 등기·상속·회생 업무안내",
  cases: "부산 등기·상속 업무 사례",
  blog: "다옴법무사사무소 네이버 블로그",
  reviews: "고객후기",
  faq: "부산 법무사 FAQ",
  media: "언론·활동",
  contact: "부산 법무사 상담 문의",
  location: "오시는 길 · 센텀",
  searchGuides: "검색의도 SEO 안내",
};

export function buildCorePageData(
  key: StaticCoreKey,
  options?: { pathOverride?: string; slugOverride?: string },
): PageData {
  const seo = staticPageSeo[key];
  const path = options?.pathOverride ?? seo.path.split("#")[0];
  const slug = options?.slugOverride ?? key;

  return createPageData({
    slug,
    path,
    category: "core",
    title: seo.title.split("|")[0]?.trim() ?? key,
    metaTitle: seo.title,
    metaDescription: buildMetaDescription(seo.description),
    h1: coreH1Map[key],
    intro: seo.description,
    breadcrumbs: [{ label: "홈", href: "/" }, { label: coreH1Map[key] }],
    internalLinks: [
      { href: "/services", label: "업무안내" },
      { href: "/contact", label: "상담 문의" },
      { href: "/about", label: "법무사 소개" },
      { href: "/location", label: "오시는 길" },
    ],
    sections: [
      {
        title: coreH1Map[key],
        body: seo.description,
        items: [...seo.keywords],
      },
    ],
    primaryKeywords: [...seo.keywords],
  });
}

export function buildHomePageData(): PageData {
  return createPageData({
    slug: "home",
    path: "/",
    category: "core",
    title: "다옴법무사사무소",
    metaTitle: HOME_METADATA_TITLE,
    metaDescription: buildMetaDescription(HOME_METADATA_DESCRIPTION),
    h1: "부산 해운대구·센텀 법무사 상담",
    intro: HOME_METADATA_DESCRIPTION,
    breadcrumbs: [{ label: "홈" }],
    internalLinks: [
      { href: "/services", label: "업무안내" },
      { href: "/about", label: "법무사 소개" },
      { href: "/contact", label: "상담 문의" },
      { href: "/location", label: "오시는 길" },
    ],
    sections: [
      {
        title: "주요 업무",
        body: "상속등기·부동산등기·법인등기·개인회생·파산 등 부산 전역 사건을 상담합니다.",
        items: [
          "상속등기·상속포기·한정승인",
          "부동산등기·소유권이전등기",
          "법인설립·임원변경등기",
          "개인회생·파산",
        ],
      },
    ],
    primaryKeywords: [
      "부산 법무사",
      "부산법무사",
      "해운대 법무사",
      "센텀 법무사",
      "상속등기",
    ],
  });
}

export function buildLegacyRedirectPageData(
  slug: string,
  path: string,
  targetPath: string,
  title: string,
  intro: string,
): PageData {
  return createPageData({
    slug,
    path,
    category: "core",
    title,
    metaTitle: buildMetaTitle(title),
    metaDescription: buildMetaDescription(intro),
    h1: title,
    intro,
    breadcrumbs: [{ label: "홈", href: "/" }, { label: title }],
    internalLinks: [{ href: targetPath, label: "이동 대상 페이지" }],
    sections: [
      {
        title: "페이지 이동",
        body: intro,
        links: [{ href: targetPath, label: "바로 이동하기" }],
      },
    ],
    primaryKeywords: ["부산 법무사", "다옴법무사사무소"],
  });
}
