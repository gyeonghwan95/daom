import { seoBrand } from "@/lib/seo/brand";
import { getCanonicalUrl } from "@/lib/seo/metadata";
import { getSocialProfileUrls, getAbsoluteAssetUrl } from "@/lib/seo/social";
import { formatPhoneForDisplay, getBusinessEmail } from "@/lib/business-info";
import { getContactInfo, getNaverReservationUrl } from "@/lib/contact";
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
import type { BreadcrumbItem } from "@/types/breadcrumb";
import type { FaqItem } from "@/lib/faq-data";
import type { ServiceFaq } from "@/types/service";
import type { ContentMeta } from "@/types/content-mdx";
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
  legalService: `${siteConfig.url}/#legalservice`,
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

const SERVICE_OFFERS: Array<{ name: string; path: string }> = [
  { name: "상속등기", path: "/부산상속등기" },
  { name: "상속포기", path: "/부산상속포기" },
  { name: "한정승인", path: "/부산한정승인" },
  { name: "부동산등기", path: "/부산부동산등기" },
  { name: "법인설립등기", path: "/부산법인등기" },
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
    email: contactEmail(),
    founder: { "@id": schemaIds.person },
    employee: { "@id": schemaIds.person },
    areaServed: {
      "@type": "AdministrativeArea",
      name: seoBrand.primaryRegion,
    },
    knowsAbout: seoBrand.services,
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
    worksFor: { "@id": schemaIds.organization },
    url: getCanonicalUrl("/about"),
    image: getAbsoluteAssetUrl(siteImages.about.profile.src),
    knowsAbout: seoBrand.services,
    areaServed: seoBrand.primaryRegion,
  });
}

export function buildLegalServiceSchema(): SchemaObject {
  return compact({
    "@context": "https://schema.org",
    "@type": "LegalService",
    "@id": schemaIds.legalService,
    name: seoBrand.siteName,
    description: seoBrand.defaultDescription,
    url: siteConfig.url,
    image: getAbsoluteAssetUrl(siteImages.home.hero.src),
    logo: getAbsoluteAssetUrl(siteImages.logo.src),
    telephone: telephone(),
    priceRange: "$$",
    areaServed: areaServedPlaces(),
    serviceType: seoBrand.services,
    knowsAbout: seoBrand.services,
    availableLanguage: "ko",
    hasOfferCatalog: serviceOfferCatalog(),
    provider: { "@id": schemaIds.person },
    parentOrganization: { "@id": schemaIds.organization },
  });
}

export function buildLocalBusinessSchema(): SchemaObject {
  const actions = businessPotentialActions();
  return compact({
    "@context": "https://schema.org",
    "@type": ["LegalService", "LocalBusiness"],
    "@id": schemaIds.localBusiness,
    name: seoBrand.siteName,
    description: seoBrand.defaultDescription,
    url: siteConfig.url,
    image: getAbsoluteAssetUrl(siteImages.home.hero.src),
    logo: getAbsoluteAssetUrl(siteImages.logo.src),
    telephone: telephone(),
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
}): SchemaObject {
  const canonical = getCanonicalUrl(input.path);
  const related = getInflowItemsForPath(input.path);
  const significant =
    related.length > 0
      ? related.map((item) => getCanonicalUrl(item.href))
      : input.path === "/"
        ? PREFETCH_CHAMPION_PATHS.map((path) => getCanonicalUrl(path))
        : [];

  return compact({
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${canonical}#webpage`,
    url: canonical,
    name: input.title,
    headline: input.h1 ?? input.title,
    description: input.description,
    inLanguage: "ko-KR",
    isPartOf: { "@id": schemaIds.website },
    about: { "@id": schemaIds.legalService },
    author: { "@id": schemaIds.person },
    reviewedBy: { "@id": schemaIds.person },
    publisher: { "@id": schemaIds.organization },
    primaryImageOfPage: input.image
      ? {
          "@type": "ImageObject",
          url: getAbsoluteAssetUrl(input.image),
        }
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
    alternateName: ["다옴법무사", "부산 다옴법무사"],
    url: siteConfig.url,
    description: seoBrand.defaultDescription,
    inLanguage: "ko-KR",
    publisher: { "@id": schemaIds.organization },
  });
}

export function buildBreadcrumbSchema(
  items: BreadcrumbItem[],
  currentPath: string,
): SchemaObject {
  const canonical = getCanonicalUrl(currentPath);

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

export function buildFaqPageSchema(faqs: FaqInput[], path?: string): SchemaObject {
  return compact({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    ...(path ? { "@id": `${getCanonicalUrl(path)}#faq` } : {}),
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
  const canonical = getCanonicalUrl(path);
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
