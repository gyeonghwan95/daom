import { seoBrand } from "@/lib/seo/brand";
import { REAL_ESTATE_ANSWERS } from "@/data/seo/service-answers/real-estate";
import { INHERITANCE_ANSWERS } from "@/data/seo/service-answers/inheritance";
import { CORPORATE_ANSWERS } from "@/data/seo/service-answers/corporate";
import { COURT_FAMILY_ANSWERS } from "@/data/seo/service-answers/court-family";
import { EXTRA_ANSWERS } from "@/data/seo/service-answers/extra";
import { getEffectiveModified } from "@/lib/seo/lastmod-lookup";
import { BUSAN_LAWYER_CHAMPION_PATH, BUSAN_LAWYER_GUIDE_PATH, BUSAN_RENUNCIATION_CHAMPION_PATH } from "@/lib/seo/champion-query";
import { homeModifiedOn } from "@/lib/home-content";
import { busanLawyerHubReviewedOn } from "@/lib/local-landing/busan-lawyer-hub-content";
import { busanInheritanceHubReviewedOn } from "@/lib/local-landing/inheritance-champion-modules";
import { busanRenunciationHubReviewedOn } from "@/lib/local-landing/renunciation-hub-identity";
import { getCanonicalUrl } from "@/lib/seo/metadata";
import { resolveCanonicalPath } from "@/lib/seo/index-policy";
import { getSocialProfileUrls, getAbsoluteAssetUrl } from "@/lib/seo/social";
import { resolveShareImage } from "@/lib/seo/share-image";
import { getPageOgThumbnail } from "@/data/seo/page-og-thumbnails";
import { formatPhoneForDisplay, getBusinessEmail } from "@/lib/business-info";
import {
  getContactInfo,
  getFaxNumber,
  getNaverReservationUrl,
} from "@/lib/contact";
import {
  getInflowItemsForPath,
  PREFETCH_CHAMPION_PATHS,
} from "@/lib/seo/inflow-policy";
import {
  getNaverPlaceUrl,
  officeHours,
  officeCoordinates,
} from "@/lib/office-location";
import { siteImages } from "@/lib/site-images";
import { siteConfig } from "@/lib/site";
import { siteSitelinkItems } from "@/lib/navigation";

function getResolvedCanonicalUrl(path: string): string {
  return getCanonicalUrl(resolveCanonicalPath(path));
}
import type { BreadcrumbItem } from "@/types/breadcrumb";
import type { FaqItem } from "@/lib/faq-data";
import type { ServiceFaq } from "@/types/service";
import type { ContentMeta } from "@/types/content-mdx";
import repeatedFaqMarkup from "@/data/seo/faq-markup-repeated.json";
import {
  lawyerActivities,
  lawyerCredentials,
  lawyerLectures,
  lawyerProfileMeta,
} from "@/lib/lawyer-profile";

type FaqInput = FaqItem | ServiceFaq;
type SchemaObject = Record<string, unknown>;

export const schemaIds = {
  organization: `${siteConfig.url}/#organization`,
  person: `${siteConfig.url}/#person`,
  // LegalService와 LocalBusiness가 같은 사무소인데 @id가 둘이라 AI·지식그래프가 업체를 둘로 볼 수 있었다.
  // 같은 @id로 합쳐, 두 노드의 속성이 한 업체로 병합되게 한다(2026-11-28).
  legalService: `${siteConfig.url}/#localbusiness`,
  localBusiness: `${siteConfig.url}/#localbusiness`,
  website: `${siteConfig.url}/#website`,
} as const;

function compact<T extends SchemaObject>(obj: T): T {
  return JSON.parse(JSON.stringify(obj)) as T;
}

function postalAddress() {
  return {
    "@type": "PostalAddress",
    streetAddress: seoBrand.address.streetAddress,
    addressLocality: seoBrand.address.addressLocality,
    addressRegion: seoBrand.address.addressRegion,
    postalCode: seoBrand.address.postalCode,
    addressCountry: seoBrand.address.addressCountry,
  };
}

function geoCoordinates() {
  return {
    "@type": "GeoCoordinates",
    latitude: officeCoordinates.lat,
    longitude: officeCoordinates.lng,
  };
}

function openingHoursSpecification() {
  return officeHours.specifications.map((spec) => ({
    "@type": "OpeningHoursSpecification",
    dayOfWeek: [...spec.dayOfWeek],
    opens: spec.opens,
    closes: spec.closes,
  }));
}

function telephone(): string | undefined {
  const { phone } = getContactInfo();
  return phone ? formatPhoneForDisplay(phone) : undefined;
}

function faxNumberValue(): string | undefined {
  const fax = getFaxNumber();
  return fax ? formatPhoneForDisplay(fax) : undefined;
}

function contactEmail(): string {
  return getBusinessEmail();
}

function telephoneUri(): string | undefined {
  const { phone } = getContactInfo();
  if (!phone) return undefined;
  const digits = phone.replace(/\D/g, "");
  if (!digits) return undefined;
  const e164 = digits.startsWith("0") ? `+82${digits.slice(1)}` : `+${digits}`;
  return `tel:${e164}`;
}

function businessPotentialActions(): SchemaObject[] {
  const actions: SchemaObject[] = [];
  const tel = telephoneUri();
  if (tel) {
    actions.push({
      "@type": "CommunicateAction",
      name: "전화 상담",
      target: tel,
    });
  }
  const reservation = getNaverReservationUrl();
  if (reservation) {
    actions.push({
      "@type": "ReserveAction",
      name: "방문 상담 예약",
      target: {
        "@type": "EntryPoint",
        urlTemplate: reservation,
        actionPlatform: [
          "http://schema.org/DesktopWebPlatform",
          "http://schema.org/MobileWebPlatform",
        ],
      },
    });
  }
  return actions;
}


/**
 * 사무소가 실제로 맡는 업무 — 전역 knowsAbout(모든 페이지). AI가 "이 사무소가 아는 분야"로 읽는다(2026-11-25).
 * serviceType(대표 8개)은 그대로 두고 knowsAbout만 넓힌다. 짧은 목록이라 페이지 용량 부담이 작다.
 */
const KNOWS_ABOUT = [
  "상속등기", "상속포기", "한정승인", "유증등기", "상속재산분할협의",
  "소유권이전등기", "매매등기", "증여등기", "근저당권 설정·말소등기", "전세권·임차권등기", "신탁등기", "소유권보존등기",
  "법인설립등기", "임원변경등기", "본점이전등기", "유상증자·감자등기", "법인 해산·청산등기",
  "개인회생 신청서류", "개인파산·면책 신청서류",
  "지급명령 신청", "가압류·가처분 신청", "강제집행·채권압류 신청서류", "공탁",
  "성년후견 청구", "개명허가 신청", "가족관계등록부 정정",
];

const SERVICE_OFFERS: Array<{ name: string; path: string }> = [
  { name: "상속등기", path: "/부산상속등기" },
  { name: "상속포기", path: "/부산상속포기" },
  { name: "한정승인", path: "/부산한정승인" },
  { name: "부동산등기", path: "/부산부동산등기" },
  { name: "법인설립등기", path: "/부산법인설립등기" },
  { name: "임원변경등기", path: "/부산임원변경등기" },
  { name: "개인회생", path: "/부산개인회생" },
  { name: "개인파산", path: "/부산개인파산" },
];

function serviceOfferCatalog(): SchemaObject {
  return {
    "@type": "OfferCatalog",
    name: "법무사 업무 안내",
    itemListElement: SERVICE_OFFERS.map((offer) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: offer.name,
        url: getCanonicalUrl(offer.path),
        provider: { "@id": schemaIds.legalService },
      },
    })),
  };
}

function areaServedPlaces() {
  return seoBrand.areaServed.map((area) => ({
    "@type": "AdministrativeArea",
    name: area,
  }));
}

export function buildOrganizationSchema(): SchemaObject {
  return compact({
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": schemaIds.organization,
    name: seoBrand.siteName,
    url: siteConfig.url,
    logo: {
      "@type": "ImageObject",
      url: getAbsoluteAssetUrl(siteImages.logo.src),
    },
    image: getAbsoluteAssetUrl(siteImages.home.hero.src),
    description: seoBrand.defaultDescription,
    address: postalAddress(),
    telephone: telephone(),
    faxNumber: faxNumberValue(),
    email: contactEmail(),
    founder: { "@id": schemaIds.person },
    employee: { "@id": schemaIds.person },
    areaServed: {
      "@type": "AdministrativeArea",
      name: seoBrand.primaryRegion,
    },
    knowsAbout: KNOWS_ABOUT,
    sameAs: getSocialProfileUrls(),
  });
}

export function buildPersonSchema(): SchemaObject {
  return compact({
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": schemaIds.person,
    name: seoBrand.representativeName,
    jobTitle: seoBrand.jobTitle,
    description: `${seoBrand.representative} · ${seoBrand.siteName}. 상속등기·부동산등기·법인등기·개인회생을 직접 상담하고 진행합니다.`,
    worksFor: { "@id": schemaIds.organization },
    url: getCanonicalUrl("/about"),
    image: getAbsoluteAssetUrl(siteImages.about.profile.src),
    knowsAbout: KNOWS_ABOUT,
    areaServed: seoBrand.primaryRegion,
  });
}

export function buildLegalServiceSchema(): SchemaObject {
  return compact({
    "@context": "https://schema.org",
    "@type": "LegalService",
    "@id": schemaIds.legalService,
    name: seoBrand.siteName,
    alternateName: ["다옴법무사", "부산 다옴법무사사무소", "다옴법무사사무소 안윤정 법무사"],
    description: seoBrand.defaultDescription,
    url: siteConfig.url,
    mainEntityOfPage: getCanonicalUrl(BUSAN_LAWYER_CHAMPION_PATH),
    hasMap: getNaverPlaceUrl(),
    image: getAbsoluteAssetUrl(siteImages.home.hero.src),
    logo: getAbsoluteAssetUrl(siteImages.logo.src),
    telephone: telephone(),
    faxNumber: faxNumberValue(),
    email: contactEmail(),
    address: postalAddress(),
    geo: geoCoordinates(),
    openingHoursSpecification: openingHoursSpecification(),
    priceRange: "$$",
    areaServed: areaServedPlaces(),
    serviceType: seoBrand.services,
    knowsAbout: KNOWS_ABOUT,
    availableLanguage: "ko",
    hasOfferCatalog: serviceOfferCatalog(),
    provider: { "@id": schemaIds.person },
    parentOrganization: { "@id": schemaIds.organization },
    sameAs: getSocialProfileUrls(),
  });
}

export function buildLocalBusinessSchema(): SchemaObject {
  const actions = businessPotentialActions();
  return compact({
    "@context": "https://schema.org",
    "@type": ["LegalService", "LocalBusiness"],
    "@id": schemaIds.localBusiness,
    name: seoBrand.siteName,
    alternateName: ["다옴법무사", "부산 다옴법무사사무소", "다옴법무사사무소 안윤정 법무사"],
    description: seoBrand.defaultDescription,
    url: siteConfig.url,
    image: getAbsoluteAssetUrl(siteImages.home.hero.src),
    logo: getAbsoluteAssetUrl(siteImages.logo.src),
    telephone: telephone(),
    faxNumber: faxNumberValue(),
    email: contactEmail(),
    openingHours: officeHours.openingHoursText,
    openingHoursSpecification: openingHoursSpecification(),
    hasMap: getNaverPlaceUrl(),
    address: postalAddress(),
    geo: geoCoordinates(),
    areaServed: {
      "@type": "City",
      name: seoBrand.primaryRegion,
    },
    priceRange: "$$",
    founder: { "@id": schemaIds.person },
    parentOrganization: { "@id": schemaIds.organization },
    sameAs: getSocialProfileUrls(),
    ...(actions.length > 0 ? { potentialAction: actions } : {}),
  });
}

export function buildWebPageSchema(input: {
  title: string;
  description: string;
  path: string;
  h1?: string;
  image?: string;
  dateModified?: string;
  keywords?: string;
  aboutName?: string;
  /** 기본 LegalService. 전문가 허브는 화면에 있는 인물(Person)을 about으로 둔다. */
  aboutId?: string;
}): SchemaObject {
  const canonical = getResolvedCanonicalUrl(input.path);
  const related = getInflowItemsForPath(input.path);
  const significant =
    related.length > 0
      ? related.map((item) => getCanonicalUrl(item.href))
      : input.path === "/"
        ? PREFETCH_CHAMPION_PATHS.map((path) => getCanonicalUrl(path))
        : [];
  const reviewedOn =
    input.path === "/"
      ? homeModifiedOn
      : input.path === BUSAN_LAWYER_GUIDE_PATH
        ? busanLawyerHubReviewedOn
        : input.path === BUSAN_RENUNCIATION_CHAMPION_PATH
          ? busanRenunciationHubReviewedOn
          : input.path === "/부산상속법무사"
            ? busanInheritanceHubReviewedOn
            : undefined;
  const about = input.aboutName
    ? [
        { "@id": input.aboutId ?? schemaIds.legalService },
        { "@type": "Thing", name: input.aboutName },
      ]
    : { "@id": input.aboutId ?? schemaIds.legalService };

  return compact({
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${canonical}#webpage`,
    url: canonical,
    name: input.title,
    headline: input.h1 ?? input.title,
    description: input.description,
    keywords: input.keywords,
    inLanguage: "ko-KR",
    isPartOf: { "@id": schemaIds.website },
    about,
    author: { "@id": schemaIds.person },
    reviewedBy: { "@id": schemaIds.person },
    publisher: { "@id": schemaIds.organization },
    dateModified: getEffectiveModified(input.path, input.dateModified ?? reviewedOn),
    // og:image와 같은 실제 파일(필요하면 1200px OG 파생본)과 크기를 쓴다 — 페이지별 1:1 썸네일이 있으면 그것
    primaryImageOfPage: (getPageOgThumbnail(input.path)?.src ?? input.image)
      ? (() => {
          const share = resolveShareImage(getPageOgThumbnail(input.path)?.src ?? input.image!);
          return {
            "@type": "ImageObject",
            url: share.url,
            width: share.width,
            height: share.height,
          };
        })()
      : undefined,
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", ".page-title", ".home-hero__title-text"],
    },
    ...(significant.length > 0 ? { significantLink: significant } : {}),
  });
}

export function buildWebSiteSchema(): SchemaObject {
  return compact({
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": schemaIds.website,
    name: seoBrand.siteName,
    alternateName: ["다옴법무사", "부산 다옴법무사사무소", "다옴법무사사무소 안윤정 법무사"],
    url: siteConfig.url,
    description: seoBrand.defaultDescription,
    inLanguage: "ko-KR",
    publisher: { "@id": schemaIds.organization },
    hasPart: siteSitelinkItems.map((item, index) => ({
      "@type": "SiteNavigationElement",
      "@id": `${siteConfig.url}/#nav-${index + 1}`,
      position: index + 1,
      name: item.label,
      url: getCanonicalUrl(item.href),
    })),
  });
}

export function buildBreadcrumbSchema(
  items: BreadcrumbItem[],
  currentPath: string,
): SchemaObject {
  const canonical = getResolvedCanonicalUrl(currentPath);

  return compact({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => {
      const isLast = index === items.length - 1;
      const itemUrl = item.href
        ? getCanonicalUrl(item.href)
        : isLast
          ? canonical
          : undefined;

      return compact({
        "@type": "ListItem",
        position: index + 1,
        name: item.label,
        ...(itemUrl ? { item: itemUrl } : {}),
      });
    }),
  });
}

/** 여러 페이지에 똑같이 반복되는 FAQ는 화면에만 두고 FAQPage 구조화 데이터에서는 뺀다(스팸성 반복 마크업 방지, 2026-11-28). */
const REPEATED_FAQ_KEYS: ReadonlySet<string> = new Set(repeatedFaqMarkup.keys);
const normalizeFaqText = (s: string) => s.replace(/\s+/g, " ").trim();
const FAQ_KEY_SEPARATOR = String.fromCharCode(0);
function isRepeatedFaq(faq: FaqInput): boolean {
  return REPEATED_FAQ_KEYS.has(`${normalizeFaqText(faq.question)}${FAQ_KEY_SEPARATOR}${normalizeFaqText(faq.answer)}`);
}

export function buildFaqPageSchema(faqs: FaqInput[], path?: string): SchemaObject {
  faqs = faqs.filter((faq) => !isRepeatedFaq(faq));
  return compact({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    ...(path ? { "@id": `${getResolvedCanonicalUrl(path)}#faq` } : {}),
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  });
}

export function buildSingleFaqSchema(faq: FaqInput): SchemaObject {
  return buildFaqPageSchema([faq]);
}

export function buildArticleSchema(meta: ContentMeta, imagePath?: string): SchemaObject {
  const image = getAbsoluteAssetUrl(
    imagePath ??
      (meta.contentType === "blog"
        ? siteImages.blog.defaultThumb.src
        : meta.contentType === "cases"
          ? siteImages.cases.defaultThumb.src
          : siteImages.seo.defaultOg.src),
  );

  return compact({
    "@context": "https://schema.org",
    "@type": "Article",
    headline: meta.title,
    description: meta.description,
    datePublished: meta.date,
    dateModified: meta.date,
    url: getCanonicalUrl(meta.href),
    image: [image],
    inLanguage: "ko-KR",
    author: { "@id": schemaIds.person },
    publisher: { "@id": schemaIds.organization },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": getCanonicalUrl(meta.href),
    },
    ...(meta.area
      ? { contentLocation: { "@type": "Place", name: meta.area } }
      : {}),
  });
}

export function buildArticleListSchema(posts: ContentMeta[]): SchemaObject {
  return compact({
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: posts.map((post, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: post.title,
      url: getCanonicalUrl(post.href),
    })),
  });
}

export function buildServicePageSchema(serviceName: string, path: string): SchemaObject {
  const canonical = getResolvedCanonicalUrl(path);
  return compact({
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${canonical}#service`,
    name: serviceName,
    description: `${seoBrand.siteName} ${serviceName} 상담·절차 안내`,
    url: canonical,
    provider: { "@id": schemaIds.legalService },
    isPartOf: { "@id": schemaIds.website },
    mainEntityOfPage: { "@id": `${canonical}#webpage` },
    areaServed: {
      "@type": "City",
      name: seoBrand.primaryRegion,
    },
  });
}

export function buildLandingPageArticleSchema(
  title: string,
  description: string,
  path: string,
): SchemaObject {
  return compact({
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    url: getCanonicalUrl(path),
    image: [getAbsoluteAssetUrl(siteImages.seo.defaultOg.src)],
    inLanguage: "ko-KR",
    author: { "@id": schemaIds.person },
    publisher: { "@id": schemaIds.organization },
    mainEntityOfPage: {
      "@id": `${getCanonicalUrl(path)}#webpage`,
    },
    about: { "@id": schemaIds.legalService },
  });
}

type PressArticleInput = {
  slug: string;
  source: string;
  title: string;
  publishedAt: string;
  paragraphs: string[];
  image: { src: string; alt?: string };
  seoDescription?: string;
  originalUrl?: string;
};

export function buildNewsArticleSchema(article: PressArticleInput): SchemaObject {
  const url = getCanonicalUrl(`/media/${article.slug}`);

  return compact({
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.seoDescription ?? article.paragraphs[0],
    datePublished: article.publishedAt,
    dateModified: article.publishedAt,
    url,
    image: [getAbsoluteAssetUrl(article.image.src)],
    inLanguage: "ko-KR",
    author: { "@id": schemaIds.person },
    publisher: { "@id": schemaIds.organization },
    articleSection: article.source,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    ...(article.originalUrl
      ? { isBasedOn: article.originalUrl, sameAs: [article.originalUrl] }
      : {}),
  });
}

type ExternalBlogPostInput = {
  title: string;
  description: string;
  pubDate: string;
  link: string;
  category?: string;
};

export function buildExternalBlogArticleSchema(
  post: ExternalBlogPostInput,
  path: string,
): SchemaObject {
  const url = getCanonicalUrl(path);

  return compact({
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.pubDate,
    dateModified: post.pubDate,
    url,
    image: [getAbsoluteAssetUrl(siteImages.blog.defaultThumb.src)],
    inLanguage: "ko-KR",
    author: { "@id": schemaIds.person },
    publisher: { "@id": schemaIds.organization },
    articleSection: post.category ?? "네이버 블로그",
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    isBasedOn: {
      "@type": "BlogPosting",
      url: post.link,
    },
  });
}

/** /about 전용 — ProfilePage + 상세 Person (AI·검색 인용) */
export function buildLawyerAboutSchemas(): SchemaObject[] {
  const aboutUrl = getCanonicalUrl("/about");

  const personDetail = compact({
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": schemaIds.person,
    name: lawyerProfileMeta.name,
    jobTitle: lawyerProfileMeta.jobTitle,
    worksFor: { "@id": schemaIds.organization },
    url: aboutUrl,
    image: getAbsoluteAssetUrl(siteImages.about.profile.src),
    knowsAbout: [...lawyerProfileMeta.practiceAreas],
    hasCredential: lawyerCredentials.map((credential) => ({
      "@type": "EducationalOccupationalCredential",
      name: credential.name,
      credentialCategory: credential.category,
      description: [credential.detail, credential.year].filter(Boolean).join(" · "),
    })),
    award: lawyerCredentials
      .filter((credential) => credential.category === "수상")
      .map((credential) => credential.name),
    memberOf: lawyerActivities.map((activity) => ({
      "@type": "Organization",
      name: activity.organization,
      description: `${activity.title} (${activity.period ?? ""})`.trim(),
    })),
    subjectOf: lawyerLectures.map((lecture) => ({
      "@type": "EducationEvent",
      name: lecture.topic,
      location: {
        "@type": "Place",
        name: lecture.venue,
      },
      description: lecture.summary,
    })),
  });

  const profilePage = compact({
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${aboutUrl}#profilepage`,
    url: aboutUrl,
    name: `${lawyerProfileMeta.fullTitle} 소개`,
    description: `${lawyerProfileMeta.organization} 대표 ${lawyerProfileMeta.fullTitle}의 자격·활동·강의 프로필`,
    inLanguage: "ko-KR",
    mainEntity: { "@id": schemaIds.person },
  });

  return [profilePage, personDetail];
}

/** 홈·전역: Organization, Person, LegalService, LocalBusiness, WebSite */
export function buildGlobalSchemas(): SchemaObject[] {
  return [
    buildOrganizationSchema(),
    buildPersonSchema(),
    buildLegalServiceSchema(),
    buildLocalBusinessSchema(),
    buildWebSiteSchema(),
  ];
}

/**
 * 업무 전체 목록(분야별) — 홈·/services·/about에서만 낸다(전역에 넣으면 1,600여 쪽 용량이 커짐).
 * 같은 @id(LegalService)에 hasOfferCatalog를 덧붙여, AI가 업무와 담당 페이지를 한 번에 읽게 한다.
 */
export function buildFullServiceCatalogSchema(): SchemaObject {
  // extra.ts에는 등기권리증(부동산)과 법정상속분·상속순위(상속)가 섞여 있어 경로로 나눈다
  const extraEntries = Object.entries(EXTRA_ANSWERS);
  const extraRealEstate = Object.fromEntries(extraEntries.filter(([p]) => p.includes("등기권리증")));
  const extraInheritance = Object.fromEntries(extraEntries.filter(([p]) => !p.includes("등기권리증")));
  const groups: Array<{ name: string; entries: Record<string, { name: string }> }> = [
    { name: "부동산등기", entries: { ...REAL_ESTATE_ANSWERS, ...extraRealEstate } },
    { name: "상속", entries: { ...INHERITANCE_ANSWERS, ...extraInheritance } },
    { name: "법인등기", entries: CORPORATE_ANSWERS },
    { name: "법원 서류·가족관계·회생파산", entries: COURT_FAMILY_ANSWERS },
  ];
  return {
    "@context": "https://schema.org",
    "@type": "LegalService",
    "@id": schemaIds.legalService,
    name: seoBrand.siteName,
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: `${seoBrand.siteName} 업무 전체`,
      itemListElement: groups.map((g) => ({
        "@type": "OfferCatalog",
        name: g.name,
        itemListElement: Object.entries(g.entries).map(([path, a]) => ({
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: a.name,
            url: getCanonicalUrl(path),
          },
        })),
      })),
    },
  };
}
