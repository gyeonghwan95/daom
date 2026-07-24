import type { BreadcrumbItem } from "@/types/breadcrumb";
import type { LocalLandingPageType } from "@/types/local-landing";
import type { SeoLandingPageType } from "@/lib/seo-landing/types";
import { getStandardContactLinks } from "./contact-links";
import { STANDARD_CTA_TEXT, STANDARD_CTA_TITLE } from "./constants";
import { capHubLinks, getHubNavigationLinks, isCoreHubSlug } from "@/lib/hub";
import { getThematicInternalLinks } from "./internal-links";
import type {
  PageCategory,
  PageConsultationExample,
  PageData,
  PageFaqItem,
  PageRelatedLink,
  PageSection,
} from "./types";

const DEFAULT_PROCEDURES = [
  "현재 상황과 목표를 전화·메시지·방문(예약)으로 확인합니다.",
  "관할 법원·등기소와 필요 서류를 사건별로 정리해 안내합니다.",
  "서류 작성·보정이 필요하면 단계별로 검토합니다.",
  "접수 후 진행 상황을 공유하고 완료·후속 조치까지 확인합니다.",
];

const DEFAULT_DOCUMENTS = [
  "신분증·인감증명서(사건에 따라 주민등록등본 등)",
  "등기부등본·계약서·협의서 등 사건 관련 핵심 서류",
  "가족관계증명서·재산 목록(상속·가사 해당 시)",
  "기타 상담 시 추가로 요청드리는 서류",
];

export function splitIntroParagraphs(
  intro: string,
  extras: string[] = [],
): string[] {
  const blocks = intro
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  if (blocks.length >= 2) {
    return [...blocks, ...extras].slice(0, 3);
  }

  if (intro.length > 220) {
    const sentences = intro.match(/[^.!?]+[.!?]+[\s]*/g) ?? [intro];
    const midpoint = Math.ceil(sentences.length / 2);
    const first = sentences.slice(0, midpoint).join("").trim();
    const second = sentences.slice(midpoint).join("").trim();
    const result = [first, second, ...extras].filter(Boolean);
    return result.length >= 2 ? result.slice(0, 3) : [intro, ...extras].slice(0, 3);
  }

  const fallback =
    extras[0] ??
    "부산 해운대구·센텀에 위치한 다옴법무사사무소 안윤정 법무사가 절차·서류·비용을 항목별로 설명드립니다. 막막할수록 지금 무엇부터 해야 하는지부터 정리하는 것이 우선이라고 생각합니다.";
  return [intro, fallback, ...extras.slice(1)].filter(Boolean).slice(0, 3);
}

export function capInternalLinks(
  links: PageRelatedLink[],
  options: { min?: number; max?: number } = {},
): PageRelatedLink[] {
  return capHubLinks(links, options);
}

export function defaultFaqs(title: string, region = "부산"): PageFaqItem[] {
  return [
    {
      question: `${title} 상담은 어디서 받을 수 있나요?`,
      answer: `다옴법무사사무소는 해운대구 센텀에 있으며, ${region} 전역 사건을 전화·카카오톡·네이버 톡톡·방문(예약)으로 상담합니다.`,
    },
    {
      question: "비용은 어떻게 안내되나요?",
      answer:
        "사건 복잡도·부동산 가액·상속인 수·채무 규모 등에 따라 달라집니다. 서류를 확인한 뒤 법무사 수임료와 등기·법원 비용을 구분해 설명드립니다.",
    },
    {
      question: "방문 없이도 진행할 수 있나요?",
      answer:
        "가능한 사건은 서류를 우편·전자·카카오톡으로 받아 원격으로 진행합니다. 다만 상속·회생 등은 초기 상황 설명을 위해 상담을 권합니다.",
    },
  ];
}

export function defaultConsultationExample(title: string): PageConsultationExample {
  return {
    title: `${title} 상담 예시`,
    body: `최근 ${title} 관련으로 문의하신 의뢰인께는 먼저 가족관계·재산·채무 여부를 확인했습니다. 급한 기한이 있으면 우선순위를 정리하고, 준비 서류 목록과 예상 일정·비용 범위를 단계별로 안내드렸습니다. 서류가 모이면 접수까지 이어서 진행했습니다.`,
  };
}

function textLength(page: PageData): number {
  return [
    page.intro,
    ...page.introParagraphs,
    ...page.procedures,
    ...page.documents,
    ...page.consultationPoints,
    page.consultationExample.body,
    ...page.faqs.flatMap((f) => [f.question, f.answer]),
    ...page.sections.flatMap((s) => [
      s.title,
      s.body,
      ...(s.items ?? []),
    ]),
  ].join("").length;
}

export function ensureMinContent(page: PageData, min = 2000): PageData {
  if (textLength(page) >= min) return page;

  const supplement = {
    title: "상담 시 확인하는 내용",
    body: `${page.title} 사건은 서류·관할·기한에 따라 진행 순서가 달라집니다. 다옴법무사사무소는 부산 해운대구·센텀에서 상속등기·부동산등기·법인등기·개인회생·파산 등을 다루며, 의뢰인 상황에 맞춰 절차와 비용을 알기 쉽게 설명합니다. 불확실한 부분은 추측으로 단정하지 않고, 확인된 사실을 바탕으로 안내드립니다. 전화·카카오톡·네이버 톡톡으로 간단히 상황을 남겨 주시면 필요한 준비부터 차분히 정리해 드리겠습니다.`,
  };

  return {
    ...page,
    sections: [...page.sections, supplement],
    introParagraphs: splitIntroParagraphs(page.intro, [
      page.introParagraphs[1] ??
        "관할 등기소·법원과 제출 서류를 미리 정리하면 기한을 놓치거나 불필요한 보정을 줄일 수 있습니다.",
    ]),
  };
}

export type CreatePageDataInput = {
  slug: string;
  path: string;
  category: PageCategory;
  title: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;
  breadcrumbs: BreadcrumbItem[];
  introParagraphs?: string[];
  procedures?: string[];
  documents?: string[];
  consultationPoints?: string[];
  faqs?: PageFaqItem[];
  consultationExample?: PageConsultationExample;
  internalLinks?: PageRelatedLink[];
  sections?: PageSection[];
  primaryKeywords: string[];
  ogImage?: string;
  ctaTitle?: string;
  ctaText?: string;
  includeFaqSchema?: boolean;
  openGraphType?: "website" | "article";
  serviceSlug?: string;
  landingPageType?: LocalLandingPageType;
  regionKey?: string;
  seoLandingType?: SeoLandingPageType;
  intentSuffix?: string;
};

export function createPageData(input: CreatePageDataInput): PageData {
  const isHub = isCoreHubSlug(input.slug);
  const thematicLinks = getThematicInternalLinks({
    slug: input.slug,
    path: input.path,
    category: input.category,
    serviceSlug: input.serviceSlug,
    landingPageType: input.landingPageType,
    regionKey: input.regionKey,
  });
  const hubLinks = getHubNavigationLinks({
    slug: input.slug,
    path: input.path,
    category: input.category,
    title: input.title,
    serviceSlug: input.serviceSlug,
    landingPageType: input.landingPageType,
    regionKey: input.regionKey,
    seoLandingType: input.seoLandingType,
    intentSuffix: input.intentSuffix,
  });

  const internalLinks = capHubLinks(
    [...(input.internalLinks ?? []), ...hubLinks, ...thematicLinks],
    { min: isHub ? 20 : 8, max: isHub ? 28 : 16 },
  );
  const faqs =
    input.faqs && input.faqs.length > 0
      ? [
          ...input.faqs,
          ...defaultFaqs(input.title),
        ]
          .filter(
            (faq, index, arr) =>
              arr.findIndex((f) => f.question === faq.question) === index,
          )
          .slice(0, 3)
      : defaultFaqs(input.title);

  const page: PageData = {
    slug: input.slug,
    path: input.path,
    category: input.category,
    title: input.title,
    metaTitle: input.metaTitle,
    metaDescription: input.metaDescription,
    h1: input.h1,
    intro: input.intro,
    breadcrumbs: input.breadcrumbs,
    introParagraphs: splitIntroParagraphs(
      input.intro,
      input.introParagraphs ?? [],
    ),
    procedures:
      input.procedures && input.procedures.length > 0
        ? input.procedures
        : DEFAULT_PROCEDURES,
    documents:
      input.documents && input.documents.length > 0
        ? input.documents
        : DEFAULT_DOCUMENTS,
    consultationPoints: input.consultationPoints ?? [],
    faqs,
    consultationExample:
      input.consultationExample ?? defaultConsultationExample(input.title),
    sections: input.sections ?? [],
    primaryKeywords: input.primaryKeywords,
    internalLinks,
    relatedLinks: [...internalLinks, ...getStandardContactLinks()],
    ctaTitle: input.ctaTitle ?? STANDARD_CTA_TITLE,
    ctaText: input.ctaText ?? STANDARD_CTA_TEXT,
    ogImage: input.ogImage,
    includeFaqSchema: input.includeFaqSchema ?? input.category === "faq",
    openGraphType: input.openGraphType,
    serviceSlug: input.serviceSlug,
  };

  return ensureMinContent(page);
}
