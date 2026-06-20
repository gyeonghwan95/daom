import { seoBrand } from "@/lib/seo/brand";
import { getCanonicalUrl } from "@/lib/seo/metadata";
import { getSocialProfileUrls, getAbsoluteAssetUrl } from "@/lib/seo/social";
import { getContactInfo, getPhoneHref } from "@/lib/contact";
import { getNaverMapSearchUrl } from "@/lib/office-location";
import { siteImages } from "@/lib/site-images";
import { siteConfig } from "@/lib/site";
import type { BreadcrumbItem } from "@/types/breadcrumb";
import type { FaqItem } from "@/lib/faq-data";
import type { ServiceFaq } from "@/types/service";
import type { ContentMeta } from "@/types/content-mdx";

type FaqInput = FaqItem | ServiceFaq;

const ORG_ID = `${siteConfig.url}/#organization`;

export function buildOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORG_ID,
    name: seoBrand.siteName,
    url: siteConfig.url,
    logo: getAbsoluteAssetUrl(siteImages.logo.src),
    image: getAbsoluteAssetUrl(siteImages.home.hero.src),
    description: seoBrand.defaultDescription,
    address: {
      "@type": "PostalAddress",
      streetAddress: seoBrand.address.streetAddress,
      addressLocality: seoBrand.address.addressLocality,
      addressRegion: seoBrand.address.addressRegion,
      addressCountry: seoBrand.address.addressCountry,
    },
    sameAs: getSocialProfileUrls(),
  };
}

export function buildWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteConfig.url}/#website`,
    name: seoBrand.siteName,
    alternateName: ["다옴법무사", "부산 다옴법무사"],
    url: siteConfig.url,
    description: seoBrand.defaultDescription,
    inLanguage: "ko-KR",
    publisher: { "@id": ORG_ID },
  };
}

export function buildPersonSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${siteConfig.url}/about#person`,
    name: seoBrand.representativeName,
    jobTitle: seoBrand.jobTitle,
    worksFor: { "@id": ORG_ID },
    url: getCanonicalUrl("/about"),
    image: getAbsoluteAssetUrl(siteImages.about.profile.src),
    knowsAbout: [...seoBrand.services, "부산 법무사", "상속등기", "개인회생"],
  };
}

export function buildLegalServiceSchema() {
  const { phone } = getContactInfo();

  return {
    "@context": "https://schema.org",
    "@type": "LegalService",
    "@id": `${siteConfig.url}/#legalservice`,
    name: seoBrand.siteName,
    description: seoBrand.defaultDescription,
    url: siteConfig.url,
    image: getAbsoluteAssetUrl(siteImages.home.hero.src),
    logo: getAbsoluteAssetUrl(siteImages.logo.src),
    telephone: phone ? getPhoneHref(phone).replace("tel:", "") : undefined,
    priceRange: "$$",
    areaServed: seoBrand.areaServed.map((area) => ({
      "@type": "Place",
      name: area,
    })),
    serviceType: seoBrand.services,
    knowsAbout: seoBrand.targetKeywords,
    parentOrganization: { "@id": ORG_ID },
    sameAs: getSocialProfileUrls(),
    employee: {
      "@type": "Person",
      name: seoBrand.representativeName,
      jobTitle: seoBrand.jobTitle,
      url: getCanonicalUrl("/about"),
    },
    provider: {
      "@type": "Person",
      name: seoBrand.representative,
      jobTitle: seoBrand.jobTitle,
    },
  };
}

export function buildLocalBusinessSchema() {
  const { phone } = getContactInfo();

  return {
    "@context": "https://schema.org",
    "@type": "LegalService",
    additionalType: "https://schema.org/LocalBusiness",
    "@id": `${siteConfig.url}/#localbusiness`,
    name: seoBrand.siteName,
    description: seoBrand.defaultDescription,
    url: siteConfig.url,
    image: getAbsoluteAssetUrl(siteImages.home.hero.src),
    logo: getAbsoluteAssetUrl(siteImages.logo.src),
    telephone: phone ? getPhoneHref(phone).replace("tel:", "") : undefined,
    hasMap: getNaverMapSearchUrl(),
    address: {
      "@type": "PostalAddress",
      streetAddress: seoBrand.address.streetAddress,
      addressLocality: seoBrand.address.addressLocality,
      addressRegion: seoBrand.address.addressRegion,
      addressCountry: seoBrand.address.addressCountry,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: seoBrand.geo.latitude,
      longitude: seoBrand.geo.longitude,
    },
    areaServed: seoBrand.areaServed,
    priceRange: "$$",
    founder: {
      "@type": "Person",
      name: seoBrand.representativeName,
      jobTitle: seoBrand.jobTitle,
    },
    sameAs: getSocialProfileUrls(),
  };
}

export function buildBreadcrumbSchema(
  items: BreadcrumbItem[],
  currentPath: string,
) {
  const canonical = getCanonicalUrl(currentPath);

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => {
      const isLast = index === items.length - 1;
      const itemUrl = item.href
        ? getCanonicalUrl(item.href)
        : isLast
          ? canonical
          : undefined;

      return {
        "@type": "ListItem",
        position: index + 1,
        name: item.label,
        ...(itemUrl ? { item: itemUrl } : {}),
      };
    }),
  };
}

export function buildFaqPageSchema(faqs: FaqInput[]) {
  return {
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
  };
}

export function buildSingleFaqSchema(faq: FaqInput) {
  return buildFaqPageSchema([faq]);
}

export function buildArticleSchema(meta: ContentMeta, imagePath?: string) {
  const image = getAbsoluteAssetUrl(
    imagePath ??
      (meta.contentType === "blog"
        ? siteImages.blog.defaultThumb.src
        : meta.contentType === "cases"
          ? siteImages.cases.defaultThumb.src
          : siteImages.seo.defaultOg.src),
  );

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: meta.title,
    description: meta.description,
    datePublished: meta.date,
    dateModified: meta.date,
    url: getCanonicalUrl(meta.href),
    image: [image],
    inLanguage: "ko-KR",
    author: {
      "@type": "Person",
      name: meta.author,
      jobTitle: seoBrand.jobTitle,
      url: getCanonicalUrl("/about"),
    },
    publisher: {
      "@type": "Organization",
      name: meta.office,
      logo: {
        "@type": "ImageObject",
        url: getAbsoluteAssetUrl(siteImages.logo.src),
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": getCanonicalUrl(meta.href),
    },
    ...(meta.area ? { contentLocation: { "@type": "Place", name: meta.area } } : {}),
  };
}

export function buildArticleListSchema(posts: ContentMeta[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: posts.map((post, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: post.title,
      url: getCanonicalUrl(post.href),
    })),
  };
}

export function buildServicePageSchema(serviceName: string, path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: serviceName,
    description: `${seoBrand.siteName} ${seoBrand.representative}의 ${serviceName} 전문 상담`,
    url: getCanonicalUrl(path),
    provider: {
      "@type": "LegalService",
      name: seoBrand.siteName,
      employee: {
        "@type": "Person",
        name: seoBrand.representative,
      },
    },
    areaServed: seoBrand.areaServed,
  };
}

export function buildGlobalSchemas() {
  return [
    buildOrganizationSchema(),
    buildWebSiteSchema(),
    buildLegalServiceSchema(),
    buildLocalBusinessSchema(),
  ];
}
