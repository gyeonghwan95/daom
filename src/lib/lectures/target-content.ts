import type { ServiceFaq } from "@/types/service";
import {
  commonDisclaimer,
  preparationDefault,
  processStepsDefault,
} from "@/lib/lectures/shared";
import type { LecturePageContent, LecturePageKind } from "@/lib/lectures/types";
import type { LectureTargetSpec } from "@/lib/lectures/target-types";

type TargetContentInput = {
  slug: string;
  kind: LecturePageKind;
  title: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  eyebrow: string;
  faqs: ServiceFaq[];
  primaryKeywords: string[];
  secondaryKeywords?: string[];
  spec: LectureTargetSpec;
};

/** target spec에서 공용 LecturePageContent(메타·FAQ schema·builder 입력)를 만든다. */
export function buildTargetContent(input: TargetContentInput): LecturePageContent {
  const { spec } = input;
  return {
    slug: input.slug,
    kind: input.kind,
    title: input.title,
    metaTitle: input.metaTitle,
    metaDescription: input.metaDescription,
    h1: input.h1,
    eyebrow: input.eyebrow,
    heroIntro: spec.lead,
    heroParagraphs: spec.approach.slice(0, 1),
    summaryItems: spec.quickFacts,
    topicCards: (spec.selectors ?? []).map((card) => ({
      title: card.title,
      description: card.description,
      href: card.href,
    })),
    audienceCards: [],
    institutionCards: [],
    formats: [],
    durationOptions: spec.curricula.map((item) => ({
      label: `${item.length} — ${item.title}`,
      outline: item.outline,
    })),
    modules: spec.situations.map((card) => card.title),
    processSteps: processStepsDefault,
    preparationChecklist: preparationDefault,
    materialExamples: [],
    faqs: input.faqs,
    relatedLectureLinks: spec.related.map(({ href, label }) => ({ href, label })),
    relatedServiceLinks: [],
    historyIds: [],
    ctaTitle: spec.ctaLabel,
    ctaText: spec.ctaNote,
    disclaimer: commonDisclaimer,
    showInquiryForm: true,
    primaryKeywords: input.primaryKeywords,
    secondaryKeywords: input.secondaryKeywords,
  };
}
