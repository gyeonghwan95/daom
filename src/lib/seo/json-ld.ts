import { seoBrand } from "@/lib/seo/brand";
import { getCanonicalUrl } from "@/lib/seo/metadata";
import { getSocialProfileUrls, getAbsoluteAssetUrl } from "@/lib/seo/social";
import { formatPhoneForDisplay, getBusinessEmail } from "@/lib/business-info";
import { getContactInfo } from "@/lib/contact";
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
    provider: { "@id": schemaIds.person },
    parentOrganization: { "@id": schemaIds.organization },
  });
}

export function buildLocalBusinessSchema(): SchemaObject {
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

export function buildFaqPageSchema(faqs: FaqInput[]): SchemaObject {
  return compact({
    "@context": "https://schema.org",
    "@type": "FAQPage",
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
  return compact({
    "@context": "https://schema.org",
    "@type": "Service",
    name: serviceName,
    description: `${seoBrand.siteName} ${serviceName} 상담·절차 안내`,
    url: getCanonicalUrl(path),
    provider: { "@id": schemaIds.legalService },
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
      "@type": "WebPage",
      "@id": getCanonicalUrl(path),
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
