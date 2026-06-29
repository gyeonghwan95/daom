import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { CONTENT_BASE_PATH, CONTENT_DEFAULTS } from "@/lib/content/constants";
import { normalizeRouteSlug } from "@/lib/seo/slug";
import type { ContentMeta, ContentType } from "@/types/content-mdx";

const CONTENT_ROOT = path.join(process.cwd(), "src/content");

function getContentDir(type: ContentType): string {
  return path.join(CONTENT_ROOT, type);
}

function toStringArray(value: unknown): string[] {
  if (!value) return [];
  if (Array.isArray(value)) return value.map(String);
  return [String(value)];
}

function normalizeFrontmatter(
  data: Record<string, unknown>,
  type: ContentType,
  fileSlug: string,
): ContentMeta {
  const slug = String(data.slug ?? fileSlug);
  const basePath = CONTENT_BASE_PATH[type];

  return {
    contentType: type,
    href: `${basePath}/${slug}`,
    slug,
    title: String(data.title ?? slug),
    description: String(data.description ?? ""),
    date: String(data.date ?? new Date().toISOString().slice(0, 10)),
    category: String(data.category ?? "일반"),
    tags: toStringArray(data.tags),
    author: String(data.author ?? CONTENT_DEFAULTS.author),
    office: String(data.office ?? CONTENT_DEFAULTS.office),
    relatedServices: toStringArray(data.relatedServices),
    relatedSituations: toStringArray(data.relatedSituations),
    relatedFaqs: toStringArray(data.relatedFaqs),
    relatedCases: toStringArray(data.relatedCases),
    relatedTools: toStringArray(data.relatedTools),
    relatedGlossary: toStringArray(data.relatedGlossary),
    relatedDiagnosis: toStringArray(data.relatedDiagnosis),
    relatedBlogs: toStringArray(data.relatedBlogs),
    area: data.area ? String(data.area) : undefined,
    caseCategory: data.caseCategory ? String(data.caseCategory) : undefined,
    situationTags: toStringArray(data.situationTags),
    region: data.region ? String(data.region) : undefined,
    seoTitle: data.seoTitle ? String(data.seoTitle) : undefined,
    seoDescription: data.seoDescription ? String(data.seoDescription) : undefined,
    searchIntent: data.searchIntent ? String(data.searchIntent) : undefined,
  };
}

function resolveContentSlug(type: ContentType, slug: string): string | null {
  const key = normalizeRouteSlug(slug);
  return (
    getContentSlugs(type).find((item) => normalizeRouteSlug(item) === key) ??
    null
  );
}

function readMdxFile(type: ContentType, slug: string) {
  const resolved = resolveContentSlug(type, slug) ?? slug;
  const filePath = path.join(getContentDir(type), `${resolved}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  return {
    meta: normalizeFrontmatter(data as Record<string, unknown>, type, resolved),
    body: content,
  };
}

export function getContentSlugs(type: ContentType): string[] {
  const dir = getContentDir(type);
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".mdx") && !file.startsWith("_"))
    .map((file) => file.replace(/\.mdx$/, ""));
}

export function getContentMeta(type: ContentType, slug: string): ContentMeta | null {
  const file = readMdxFile(type, slug);
  return file?.meta ?? null;
}

export function getAllContent(type: ContentType): ContentMeta[] {
  return getContentSlugs(type)
    .map((slug) => getContentMeta(type, slug))
    .filter((meta): meta is ContentMeta => meta !== null)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getCompiledContent(
  type: "blog" | "cases" | "faq",
  slug: string,
) {
  const file = readMdxFile(type, slug);
  if (!file) return null;

  const [{ compileMDX }, { mdxComponents }] = await Promise.all([
    import("next-mdx-remote/rsc"),
    import("@/components/mdx/MDXComponents"),
  ]);

  const { content } = await compileMDX({
    source: file.body,
    components: mdxComponents,
    options: { parseFrontmatter: false },
  });

  return { meta: file.meta, content };
}

export function formatContentDate(date: string): string {
  return new Date(date).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function mdxBodyToPlainText(body: string): string {
  return body
    .replace(/^#+\s+/gm, "")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .trim();
}

export type FaqContentItem = {
  question: string;
  answer: string;
  slug: string;
  href: string;
};

export function getFaqItems(): FaqContentItem[] {
  return getContentSlugs("faq")
    .map((slug) => {
      const file = readMdxFile("faq", slug);
      if (!file) return null;

      const { meta, body } = file;
      const plainBody = mdxBodyToPlainText(body);
      const answer = plainBody
        ? `${meta.description}\n\n${plainBody}`
        : meta.description;

      return {
        question: meta.title,
        answer,
        slug: meta.slug,
        href: meta.href,
      };
    })
    .filter((item): item is FaqContentItem => item !== null);
}

export function getServiceLabel(slug: string): string {
  const labels: Record<string, string> = {
    "inheritance-registration": "상속등기",
    "inheritance-renunciation": "상속포기",
    "qualified-acceptance": "한정승인",
    "real-estate-registration": "부동산등기",
    "ownership-transfer": "소유권이전등기",
    "corporate-registration": "법인등기",
    "company-establishment": "법인설립등기",
    "director-change": "임원변경등기",
    "personal-rehabilitation": "개인회생",
    bankruptcy: "파산",
  };
  return labels[slug] ?? slug;
}
