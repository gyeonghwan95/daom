import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { getAllContent, getContentMeta, getContentSlugs } from "@/lib/content/loader";
import type { ContentMeta } from "@/types/content-mdx";
import {
  normalizeCaseCategory,
  normalizeCaseRegion,
  normalizeSituationTags,
} from "./normalize";
import { parseCaseSections } from "./parse-sections";
import type { CaseRecord } from "./types";

const CASES_DIR = path.join(process.cwd(), "src/content/cases");

function readCaseBody(slug: string): string | null {
  const filePath = path.join(CASES_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf8");
  return matter(raw).content;
}

function toCaseRecord(meta: ContentMeta): CaseRecord | null {
  const body = readCaseBody(meta.slug);
  if (!body) return null;

  const sections = parseCaseSections(body);

  return {
    slug: meta.slug,
    href: meta.href,
    title: meta.title,
    description: meta.description,
    date: meta.date,
    category: meta.category,
    caseCategory: normalizeCaseCategory(meta),
    situationTags: normalizeSituationTags(meta),
    region: normalizeCaseRegion(meta),
    tags: meta.tags,
    relatedServices: meta.relatedServices ?? [],
    relatedFaqs: meta.relatedFaqs ?? [],
    relatedSituations: meta.relatedSituations,
    relatedCases: meta.relatedCases,
    relatedTools: meta.relatedTools,
    relatedGlossary: meta.relatedGlossary,
    relatedDiagnosis: meta.relatedDiagnosis,
    relatedBlogs: meta.relatedBlogs,
    area: meta.area,
    sections,
  };
}

export function getAllCaseRecords(): CaseRecord[] {
  return getAllContent("cases")
    .map((meta) => toCaseRecord(meta))
    .filter((record): record is CaseRecord => record !== null);
}

export function getCaseRecord(slug: string): CaseRecord | null {
  const meta = getContentMeta("cases", slug);
  if (!meta) return null;
  return toCaseRecord(meta);
}

export function getCaseSlugs(): string[] {
  return getContentSlugs("cases");
}

export { filterCaseRecords } from "./filter";
export type { CaseFilters, CaseRecord } from "./types";
export { CASE_DISCLAIMER, CASE_CATEGORIES, CASE_REGIONS, CASE_SITUATION_TAGS } from "./types";
