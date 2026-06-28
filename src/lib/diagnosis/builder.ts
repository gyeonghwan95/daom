import {
  DIAGNOSIS_CTA_TEXT,
  DIAGNOSIS_CTA_TITLE,
  type Diagnosis,
  type DiagnosisPageConfig,
} from "@/data/diagnosis";
import { buildMetaDescription, buildMetaTitle } from "@/lib/pageData/seo";
import { createPageData } from "@/lib/pageData/template-helpers";
import type { PageData } from "@/lib/pageData/types";
import { getServiceImage, siteImages } from "@/lib/site-images";

export function buildPageDataFromDiagnosis(
  config: Diagnosis | DiagnosisPageConfig,
): PageData {
  const hubLabel = config.isHub
    ? "업무별 자가진단"
    : `${config.serviceName} 자가진단`;

  return createPageData({
    slug: config.slug,
    path: "path" in config && config.path ? config.path : `/${config.slug}`,
    category: "diagnosis",
    title: config.metaTitle.replace(/\s*\|.*$/, "").trim(),
    metaTitle: buildMetaTitle(config.metaTitle),
    metaDescription: buildMetaDescription(config.metaDescription),
    h1: config.h1,
    intro: config.intro[0] ?? "",
    breadcrumbs: config.isHub
      ? [
          { label: "홈", href: "/" },
          { label: hubLabel },
        ]
      : [
          { label: "홈", href: "/" },
          { label: "업무별 자가진단", href: "/자가진단" },
          { label: hubLabel },
        ],
    introParagraphs: config.intro,
    procedures: config.processSteps,
    documents: config.requiredDocuments,
    consultationPoints: config.costFactors,
    faqs: config.faqs,
    consultationExample: config.caseExample,
    internalLinks: config.relatedLinks,
    sections: [
      ...(config.resultExplanation?.length
        ? [
            {
              title: "자가진단 결과 안내",
              body: config.resultExplanation[0] ?? "",
              items: config.resultExplanation.slice(1),
            },
          ]
        : []),
      ...(config.conceptParagraphs?.length
        ? [
            {
              title: `${config.serviceName} 기본 개념`,
              body: config.conceptParagraphs[0] ?? "",
              items: config.conceptParagraphs.slice(1),
            },
          ]
        : []),
      {
        title: "기간·기한·과태료 주의사항",
        body: `${config.serviceName} 관련 절차는 기한과 과태료 리스크를 함께 검토해야 합니다.`,
        items: config.deadlineWarnings,
      },
      ...(config.isHub
        ? []
        : [
            {
              title: "부산에서 많이 발생하는 상담 유형",
              body: "부산·해운대·센텀·재송동·반여동에서 아래와 비슷한 상황으로 법무사 상담을 요청하시는 경우가 많습니다.",
              items:
                config.busanConsultationTypes ?? config.targetUsers,
            },
          ]),
    ],
    primaryKeywords: config.primaryKeywords,
    serviceSlug: config.serviceSlug,
    ctaTitle: config.ctaTitle,
    ctaText: config.ctaText,
    ogImage: config.serviceSlug
      ? getServiceImage(config.serviceSlug).src
      : siteImages.seo.defaultOg.src,
    includeFaqSchema: true,
  });
}

export function getDiagnosisCtaCopy(diagnosis?: Diagnosis) {
  return {
    title: diagnosis?.ctaTitle ?? DIAGNOSIS_CTA_TITLE,
    text: diagnosis?.ctaText ?? DIAGNOSIS_CTA_TEXT,
  };
}
