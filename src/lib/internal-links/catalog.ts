import "server-only";

import {
  normalizeCaseCategory,
  normalizeCaseRegion,
  normalizeSituationTags,
} from "@/lib/cases/normalize";
import { getAllContent } from "@/lib/content/loader";
import { allDiagnoses } from "@/data/diagnosis-registry";
import { getAllGlossaryTerms } from "@/lib/glossary";
import { getAllSituationPages } from "@/lib/situations";
import { getAllToolDefinitions } from "@/lib/tools";
import { allServiceDetails } from "@/lib/services-data";
import type { PageRelatedLink } from "@/lib/pageData/types";
import {
  collectServiceSlugs,
  getGlossaryDomain,
  getServiceDomain,
} from "./domains";
import type { LinkCatalogItem, LinkContentKind } from "./types";

let cachedCatalog: LinkCatalogItem[] | null = null;

function slugFromHref(href: string, kind: LinkContentKind): string | null {
  const path = href.split("?")[0].split("#")[0];
  switch (kind) {
    case "service":
      return path.match(/^\/services\/([^/]+)$/)?.[1] ?? null;
    case "situation":
      return path.match(/^\/situations\/([^/]+)$/)?.[1] ?? null;
    case "faq":
      return path.match(/^\/faq\/([^/]+)$/)?.[1] ?? null;
    case "case":
      return path.match(/^\/services\/cases\/([^/]+)$/)?.[1] ?? null;
    case "blog":
      return path.match(/^\/blog\/([^/]+)$/)?.[1] ?? null;
    case "glossary":
      return path.match(/^\/glossary\/([^/]+)$/)?.[1] ?? null;
    case "tool":
      return path.match(/^\/tools\/([^/]+)$/)?.[1] ?? null;
    case "diagnosis":
      return path.replace(/^\//, "") || null;
    default:
      return null;
  }
}

function slugsFromLinks(
  links: PageRelatedLink[],
  kind: LinkContentKind,
): string[] {
  return [
    ...new Set(
      links
        .map((link) => slugFromHref(link.href, kind))
        .filter((slug): slug is string => Boolean(slug)),
    ),
  ];
}

function item(
  kind: LinkContentKind,
  slug: string,
  href: string,
  label: string,
  relations: Partial<LinkCatalogItem> = {},
): LinkCatalogItem {
  const serviceSlug = relations.serviceSlug;
  const relatedServices = [
    ...new Set(relations.relatedServices ?? []),
  ];
  const domain =
    relations.category ??
    getServiceDomain(serviceSlug) ??
    (relatedServices[0] ? getServiceDomain(relatedServices[0]) : undefined);

  return {
    kind,
    slug,
    href,
    label,
    tags: relations.tags ?? [],
    category: domain ?? relations.category,
    region: relations.region,
    serviceSlug,
    relatedServices,
    relatedSituations: [...new Set(relations.relatedSituations ?? [])],
    relatedFaqs: [...new Set(relations.relatedFaqs ?? [])],
    relatedCases: [...new Set(relations.relatedCases ?? [])],
    relatedTools: [...new Set(relations.relatedTools ?? [])],
    relatedGlossary: [...new Set(relations.relatedGlossary ?? [])],
    relatedDiagnosis: [...new Set(relations.relatedDiagnosis ?? [])],
    relatedBlogs: [...new Set(relations.relatedBlogs ?? [])],
  };
}

function buildCatalog(): LinkCatalogItem[] {
  const catalog: LinkCatalogItem[] = [];

  for (const service of allServiceDetails) {
    const relatedCases = service.relatedCase
      ? [slugFromHref(service.relatedCase.href, "case")].filter(
          (slug): slug is string => Boolean(slug),
        )
      : [];

    catalog.push(
      item("service", service.slug, `/services/${service.slug}`, service.title, {
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
      }),
    );
  }

  for (const situation of getAllSituationPages()) {
    catalog.push(
      item("situation", situation.slug, situation.path, situation.cardTitle, {
        category: getServiceDomain(situation.serviceSlug),
        serviceSlug: situation.serviceSlug,
        relatedServices: [
          ...(situation.relatedServices ?? []),
          ...slugsFromLinks(situation.serviceLinks, "service"),
        ],
        relatedDiagnosis: [
          ...(situation.relatedDiagnosis ?? []),
          ...slugsFromLinks(situation.diagnosisLinks, "diagnosis"),
        ],
        relatedFaqs: [
          ...(situation.relatedFaqs ?? []),
          ...slugsFromLinks(situation.faqLinks, "faq"),
        ],
        relatedSituations: situation.relatedSituations,
        relatedCases: situation.relatedCases,
        relatedTools: situation.relatedTools,
        relatedGlossary: situation.relatedGlossary,
        relatedBlogs: situation.relatedBlogs,
        tags: situation.tags ?? situation.situationChecklist.slice(0, 4),
      }),
    );
  }

  for (const tool of getAllToolDefinitions()) {
    catalog.push(
      item("tool", tool.slug, tool.path, tool.cardTitle, {
        category: getServiceDomain(tool.serviceSlug),
        serviceSlug: tool.serviceSlug,
        relatedServices: [
          ...(tool.relatedServices ?? []),
          ...slugsFromLinks(tool.serviceLinks, "service"),
        ],
        relatedDiagnosis: [
          ...(tool.relatedDiagnosis ?? []),
          ...slugsFromLinks(tool.diagnosisLinks, "diagnosis"),
        ],
        relatedSituations: tool.relatedSituations,
        relatedFaqs: tool.relatedFaqs,
        relatedCases: tool.relatedCases,
        relatedGlossary: tool.relatedGlossary,
        relatedBlogs: tool.relatedBlogs,
        relatedTools: tool.relatedTools,
        tags: tool.tags ?? tool.primaryKeywords.slice(0, 5),
      }),
    );
  }

  for (const term of getAllGlossaryTerms()) {
    catalog.push(
      item("glossary", term.slug, term.path, term.term, {
        category: getGlossaryDomain(term.category),
        relatedServices: [
          ...(term.relatedServices ?? []),
          ...slugsFromLinks(term.serviceLinks, "service"),
        ],
        relatedDiagnosis: [
          ...(term.relatedDiagnosis ?? []),
          ...slugsFromLinks(term.diagnosisLinks, "diagnosis"),
        ],
        relatedFaqs: [
          ...(term.relatedFaqs ?? []),
          ...slugsFromLinks(term.faqLinks, "faq"),
        ],
        relatedCases: [
          ...(term.relatedCases ?? []),
          ...slugsFromLinks(term.caseLinks, "case"),
        ],
        relatedSituations: term.relatedSituations,
        relatedTools: term.relatedTools,
        relatedGlossary: term.relatedGlossary,
        relatedBlogs: term.relatedBlogs,
        tags: term.tags ?? [term.term, term.cardDescription.slice(0, 24)],
      }),
    );
  }

  for (const diagnosis of allDiagnoses) {
    if (diagnosis.slug === "자가진단") continue;

    catalog.push(
      item("diagnosis", diagnosis.slug, `/${diagnosis.slug}`, diagnosis.serviceName, {
        category: getServiceDomain(diagnosis.serviceSlug),
        serviceSlug: diagnosis.serviceSlug,
        relatedServices: diagnosis.serviceSlug ? [diagnosis.serviceSlug] : [],
        relatedFaqs: [
          ...(diagnosis.relatedFaqs ?? []),
          ...slugsFromLinks(
            diagnosis.relatedLinks.filter((link) => link.href.startsWith("/faq")),
            "faq",
          ),
        ],
        relatedCases: [
          ...(diagnosis.relatedCases ?? []),
          ...slugsFromLinks(
            diagnosis.relatedLinks.filter((link) =>
              link.href.startsWith("/services/cases/"),
            ),
            "case",
          ),
        ],
        relatedBlogs: [
          ...(diagnosis.relatedBlogs ?? []),
          ...slugsFromLinks(
            diagnosis.relatedLinks.filter((link) => link.href.startsWith("/blog/")),
            "blog",
          ),
        ],
        relatedSituations: diagnosis.relatedSituations,
        relatedTools: diagnosis.relatedTools,
        relatedGlossary: diagnosis.relatedGlossary,
        relatedDiagnosis: diagnosis.relatedDiagnosis,
        tags: diagnosis.tags ?? diagnosis.targetUsers?.slice(0, 4),
      }),
    );
  }

  for (const meta of getAllContent("blog")) {
    catalog.push(
      item("blog", meta.slug, meta.href, meta.title, {
        category: meta.category,
        region: meta.area,
        relatedServices: meta.relatedServices,
        relatedSituations: meta.relatedSituations,
        relatedFaqs: meta.relatedFaqs,
        relatedCases: meta.relatedCases,
        relatedTools: meta.relatedTools,
        relatedGlossary: meta.relatedGlossary,
        relatedDiagnosis: meta.relatedDiagnosis,
        relatedBlogs: meta.relatedBlogs,
        tags: meta.tags,
      }),
    );
  }

  for (const meta of getAllContent("faq")) {
    catalog.push(
      item("faq", meta.slug, meta.href, meta.title, {
        category: meta.category,
        region: meta.area,
        relatedServices: meta.relatedServices,
        relatedSituations: meta.relatedSituations,
        relatedFaqs: meta.relatedFaqs,
        relatedCases: meta.relatedCases,
        relatedTools: meta.relatedTools,
        relatedGlossary: meta.relatedGlossary,
        relatedDiagnosis: meta.relatedDiagnosis,
        relatedBlogs: meta.relatedBlogs,
        tags: meta.tags,
      }),
    );
  }

  for (const meta of getAllContent("cases")) {
    catalog.push(
      item("case", meta.slug, meta.href, meta.title, {
        category: normalizeCaseCategory(meta),
        region: normalizeCaseRegion(meta),
        relatedServices: meta.relatedServices,
        relatedFaqs: meta.relatedFaqs,
        relatedSituations: meta.relatedSituations,
        relatedCases: meta.relatedCases,
        relatedTools: meta.relatedTools,
        relatedGlossary: meta.relatedGlossary,
        relatedDiagnosis: meta.relatedDiagnosis,
        relatedBlogs: meta.relatedBlogs,
        tags: [...meta.tags, ...normalizeSituationTags(meta)],
      }),
    );
  }

  return catalog;
}

export function getLinkCatalog(): LinkCatalogItem[] {
  if (!cachedCatalog) {
    cachedCatalog = buildCatalog();
  }
  return cachedCatalog;
}

export function getCatalogItem(
  kind: LinkContentKind,
  slug: string,
): LinkCatalogItem | undefined {
  const key = slug.normalize("NFC");
  return getLinkCatalog().find(
    (entry) => entry.kind === kind && entry.slug.normalize("NFC") === key,
  );
}

export function getCatalogDomains(): string[] {
  return [
    ...new Set(
      getLinkCatalog()
        .map((entry) => entry.category)
        .filter((category): category is string => Boolean(category)),
    ),
  ];
}

export function collectSourceDomains(source: {
  category?: string;
  serviceSlug?: string;
  relatedServices?: string[];
}): string[] {
  const domains = new Set<string>();
  if (source.category) domains.add(source.category);
  const domain = getServiceDomain(source.serviceSlug);
  if (domain) domains.add(domain);
  for (const slug of source.relatedServices ?? []) {
    const relatedDomain = getServiceDomain(slug);
    if (relatedDomain) domains.add(relatedDomain);
  }
  return [...domains];
}

export function collectSourceServiceSlugs(source: {
  serviceSlug?: string;
  relatedServices?: string[];
}): string[] {
  return collectServiceSlugs(source.serviceSlug, source.relatedServices);
}
