import { consultationCopy } from "@/lib/consultation";
import { officeLocation } from "@/lib/office-location";
import { getB2BPageContent } from "@/lib/b2b";
import type { LocalLandingConfig, LocalLandingPage } from "@/types/local-landing";

export function buildB2BCollaborationPage(
  config: LocalLandingConfig,
): LocalLandingPage | null {
  const key = config.keywordKey ?? config.slug;
  const content = getB2BPageContent(key);
  if (!content) return null;

  return {
    slug: config.slug,
    path: `/${config.slug}`,
    pageType: "b2b-collaboration",
    serviceSlug: config.serviceSlug,
    title: content.h1,
    h1: content.h1,
    metaTitle: content.metaTitle,
    description: content.metaDescription,
    summaryParagraphs: [content.heroIntro, ...content.heroParagraphs],
    primaryKeywords: content.primaryKeywords,
    regionLabel: config.regionLabel,
    regionKey: config.regionKey,
    neighborhoods: config.neighborhoods,
    problemStatement: content.heroIntro,
    whenNeeded: content.sections
      .filter((s) => s.kind === "bullets")
      .flatMap((s) => (s.kind === "bullets" ? s.items : []))
      .slice(0, 8),
    jurisdictionGuide: {
      title: "협업·상담 범위",
      jurisdictionNote:
        "부산 해운대·센텀 사무소를 기준으로 협업 가능 범위를 사건별로 확인합니다.",
      practicalNotes: [
        `사무소: ${officeLocation.fullAddress}`,
        "확인되지 않은 실적·무조건 처리를 안내하지 않습니다.",
      ],
    },
    consultationCase: {
      title: content.primaryCta.label,
      summary: content.bottomCtaText,
      href: content.primaryCta.href.startsWith("/")
        ? content.primaryCta.href.split("?")[0]
        : "/협업문의",
    },
    consultationCases: [
      {
        title: content.primaryCta.label,
        summary: content.bottomCtaText,
        href: "/협업문의",
      },
    ],
    legalIssues: content.heroParagraphs,
    precautions: [
      "초기 문의에 민감 원본서류를 보내지 마세요.",
      "가능 여부와 견적은 자료·일정 확인 후 안내합니다.",
    ],
    procedures:
      content.processSteps?.map((s) => `${s.step}. ${s.title}: ${s.description}`) ??
      content.sections
        .filter((s) => s.kind === "steps")
        .flatMap((s) =>
          s.kind === "steps" ? s.steps.map((step) => `${step.title}: ${step.body}`) : [],
        ),
    documents: [
      "업무 종류",
      "소재지(대략)",
      "예상 건수 구간",
      "희망 일정",
      "담당자 연락 방법",
    ],
    costGuide:
      "건수, 권리관계, 일정, 서류 상태, 후속 등기 여부를 확인한 뒤 견적 범위를 안내합니다.",
    faqs: content.faqs,
    lawyerOpinion: content.heroParagraphs[0] ?? content.heroIntro,
    directionsNote: `다옴법무사사무소는 ${officeLocation.fullAddress}에 있습니다.`,
    ctaDescription: content.bottomCtaText || consultationCopy.contact,
    relatedBlogHrefs: [],
    relatedServiceLinks: content.relatedLinks,
    relatedRegionLinks: [],
  };
}
