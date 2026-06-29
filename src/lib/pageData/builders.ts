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
    case "service-region":
    default:
      return "local";
  }
}

function sectionsFromLocalLanding(page: LocalLandingPage): PageSection[] {
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
    page.pageType === "court-registry" && page.slug.endsWith("법무사")
      ? buildMetaTitle(`${page.slug.replace(/법무사$/, "")} 법무사 안내`)
      : buildMetaTitle(`${page.title} 안내`);

  return createPageData({
    slug: page.slug,
    path: page.path,
    category,
    title: page.title,
    metaTitle,
    metaDescription: buildMetaDescription(page.description),
    h1: page.h1,
    intro: page.problemStatement,
    breadcrumbs: [
      { label: "홈", href: "/" },
      { label: page.title },
    ],
    introParagraphs: [
      page.description,
      `${page.regionLabel} ${page.neighborhoods.slice(0, 3).join("·")} 일대에서 상속등기·부동산등기·법인등기·개인회생 등을 상담합니다.`,
    ],
    procedures: page.procedures,
    documents: page.documents,
    consultationPoints: [...page.legalIssues, ...page.precautions].slice(0, 6),
    faqs: page.faqs.slice(0, 3).map((f) => ({
      question: f.question,
      answer: f.answer,
    })),
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
    sections: sectionsFromLocalLanding(page),
    primaryKeywords: [
      page.regionLabel,
      "부산 법무사",
      "부산법무사",
      page.title.replace(page.regionLabel, "").trim(),
    ].filter(Boolean),
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

export function buildPageDataFromService(service: ServiceDetail): PageData {
  return createPageData({
    slug: service.slug,
    path: `/services/${service.slug}`,
    category: "service",
    title: service.title,
    metaTitle: buildMetaTitle(`${service.title} 업무 안내`),
    metaDescription: buildMetaDescription(service.description),
    h1: `부산 ${service.title} 상담`,
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
      { label: "포스팅", href: "/blog" },
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
      { href: "/blog", label: "포스팅 목록" },
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
      { href: "/blog", label: "정보 포스팅" },
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
      { label: "포스팅", href: "/blog" },
      { label: "네이버 블로그" },
      { label: post.title },
    ],
    internalLinks: [
      { href: "/blog", label: "포스팅 목록" },
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
  blog: "부산 법률 정보 포스팅",
  reviews: "고객후기",
  faq: "부산 법무사 FAQ",
  media: "언론·활동",
  contact: "부산 법무사 상담 문의",
  location: "오시는 길 · 센텀",
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
    h1: "부산 해운대·센텀 법무사 상담",
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
