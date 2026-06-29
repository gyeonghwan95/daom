import type { CaseRecord } from "@/lib/cases/types";
import type { ContentMeta } from "@/types/content-mdx";
import type { ServiceDetail } from "@/types/service";
import type { Diagnosis } from "@/data/diagnosis";
import type { GlossaryTerm } from "@/lib/glossary/types";
import type { SituationPage } from "@/lib/situations/types";
import type { ToolDefinition } from "@/lib/tools/types";
import { getServiceDomain } from "./domains";
import type { LinkContentKind, RecommendationSource } from "./types";

function base(
  kind: LinkContentKind,
  slug: string,
  path: string,
  data: Partial<RecommendationSource> = {},
): RecommendationSource {
  return { kind, slug, path, ...data };
}

export function recommendationFromContentMeta(
  meta: ContentMeta,
  kind: Extract<LinkContentKind, "blog" | "faq" | "case">,
): RecommendationSource {
  const path =
    kind === "case" ? `/services/cases/${meta.slug}` : meta.href;

  return base(kind, meta.slug, path, {
    tags: meta.tags,
    category: meta.category,
    region: meta.region ?? meta.area,
    relatedServices: meta.relatedServices,
    relatedSituations: meta.relatedSituations,
    relatedFaqs: meta.relatedFaqs,
    relatedCases: meta.relatedCases,
    relatedTools: meta.relatedTools,
    relatedGlossary: meta.relatedGlossary,
    relatedDiagnosis: meta.relatedDiagnosis,
    relatedBlogs: meta.relatedBlogs,
    serviceSlug: meta.relatedServices?.[0],
  });
}

export function recommendationFromService(service: ServiceDetail): RecommendationSource {
  const relatedCases = service.relatedCase
    ? [service.relatedCase.href.replace(/^\/services\/cases\//, "")]
    : service.relatedCases;

  return base("service", service.slug, `/services/${service.slug}`, {
    category: service.category ?? getServiceDomain(service.slug),
    serviceSlug: service.slug,
    relatedServices: [service.slug, ...(service.relatedServices ?? [])],
    relatedCases,
    relatedSituations: service.relatedSituations,
    relatedFaqs: service.relatedFaqs,
    relatedTools: service.relatedTools,
    relatedGlossary: service.relatedGlossary,
    relatedDiagnosis: service.relatedDiagnosis,
    relatedBlogs: service.relatedBlogs,
    tags: service.tags,
  });
}

export function recommendationFromCaseRecord(record: CaseRecord): RecommendationSource {
  return base("case", record.slug, record.href, {
    tags: [...record.tags, ...record.situationTags],
    category: record.caseCategory,
    region: record.region,
    relatedServices: record.relatedServices,
    relatedFaqs: record.relatedFaqs,
    relatedSituations: record.relatedSituations,
    relatedCases: record.relatedCases,
    relatedTools: record.relatedTools,
    relatedGlossary: record.relatedGlossary,
    relatedDiagnosis: record.relatedDiagnosis,
    relatedBlogs: record.relatedBlogs,
    serviceSlug: record.relatedServices[0],
  });
}

export function recommendationFromSituation(situation: SituationPage): RecommendationSource {
  return base("situation", situation.slug, situation.path, {
    category: getServiceDomain(situation.serviceSlug),
    serviceSlug: situation.serviceSlug,
    relatedServices: situation.relatedServices,
    relatedSituations: situation.relatedSituations,
    relatedFaqs: situation.relatedFaqs,
    relatedCases: situation.relatedCases,
    relatedTools: situation.relatedTools,
    relatedGlossary: situation.relatedGlossary,
    relatedDiagnosis: situation.relatedDiagnosis,
    relatedBlogs: situation.relatedBlogs,
    tags: situation.tags,
  });
}

export function recommendationFromTool(tool: ToolDefinition): RecommendationSource {
  return base("tool", tool.slug, tool.path, {
    category: getServiceDomain(tool.serviceSlug),
    serviceSlug: tool.serviceSlug,
    relatedServices: tool.relatedServices,
    relatedSituations: tool.relatedSituations,
    relatedFaqs: tool.relatedFaqs,
    relatedCases: tool.relatedCases,
    relatedTools: tool.relatedTools,
    relatedGlossary: tool.relatedGlossary,
    relatedDiagnosis: tool.relatedDiagnosis,
    relatedBlogs: tool.relatedBlogs,
    tags: tool.tags ?? tool.primaryKeywords,
  });
}

export function recommendationFromGlossaryTerm(term: GlossaryTerm): RecommendationSource {
  return base("glossary", term.slug, term.path, {
    category: term.category,
    relatedServices: term.relatedServices,
    relatedSituations: term.relatedSituations,
    relatedFaqs: term.relatedFaqs,
    relatedCases: term.relatedCases,
    relatedTools: term.relatedTools,
    relatedGlossary: term.relatedGlossary,
    relatedDiagnosis: term.relatedDiagnosis,
    relatedBlogs: term.relatedBlogs,
    tags: term.tags ?? [term.term],
  });
}

export function recommendationFromDiagnosis(diagnosis: Diagnosis): RecommendationSource {
  return base("diagnosis", diagnosis.slug, `/${diagnosis.slug}`, {
    category: getServiceDomain(diagnosis.serviceSlug),
    serviceSlug: diagnosis.serviceSlug,
    relatedServices: diagnosis.serviceSlug ? [diagnosis.serviceSlug] : [],
    relatedSituations: diagnosis.relatedSituations,
    relatedFaqs: diagnosis.relatedFaqs,
    relatedCases: diagnosis.relatedCases,
    relatedTools: diagnosis.relatedTools,
    relatedGlossary: diagnosis.relatedGlossary,
    relatedDiagnosis: diagnosis.relatedDiagnosis,
    relatedBlogs: diagnosis.relatedBlogs,
    tags: diagnosis.tags ?? diagnosis.targetUsers,
  });
}
