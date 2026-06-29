import {
  SEO_INTENT_ARTICLE_AUTHOR,
  SEO_INTENT_ARTICLE_OFFICE,
  type SeoIntentArticle,
} from "@/data/seo-intent-articles/types";

const SERVICE_LABELS: Record<string, string> = {
  "inheritance-registration": "상속등기",
  "inheritance-renunciation": "상속포기",
  "qualified-acceptance": "한정승인",
  "real-estate-registration": "부동산등기",
  "ownership-transfer": "소유권이전등기",
  "corporate-registration": "법인등기",
  "company-establishment": "법인설립",
  "director-change": "임원변경등기",
  "personal-rehabilitation": "개인회생",
  bankruptcy: "개인파산",
};

function yamlString(value: string): string {
  return JSON.stringify(value);
}

function yamlList(items: string[] | undefined): string {
  if (!items?.length) return "[]";
  return `\n${items.map((item) => `  - ${item}`).join("\n")}`;
}

function paragraphs(lines: string[]): string {
  return lines.map((line) => line.trim()).filter(Boolean).join("\n\n");
}

function bulletList(lines: string[]): string {
  return lines.map((line) => `- ${line.trim()}`).join("\n");
}

function formatFaq(faq: SeoIntentArticle["sections"]["faq"]): string {
  return faq
    .map(
      (item) =>
        `**Q. ${item.question}**  \n${item.answer}`,
    )
    .join("\n\n");
}

function formatRelatedServices(slugs: string[]): string {
  return slugs
    .map((slug) => {
      const label = SERVICE_LABELS[slug] ?? slug;
      return `- [${label}](/services/${slug})`;
    })
    .join("\n");
}

export function buildSeoIntentArticleMdx(article: SeoIntentArticle): string {
  const frontmatter = [
    "---",
    `title: ${yamlString(article.title)}`,
    `description: ${yamlString(article.description)}`,
    `date: ${yamlString(article.date)}`,
    `category: ${yamlString(article.category)}`,
    `tags:${yamlList(article.tags)}`,
    `slug: ${article.slug}`,
    `author: ${yamlString(SEO_INTENT_ARTICLE_AUTHOR)}`,
    `office: ${yamlString(SEO_INTENT_ARTICLE_OFFICE)}`,
    `searchIntent: ${article.searchIntent}`,
    `relatedServices:${yamlList(article.relatedServices)}`,
    `relatedFaqs:${yamlList(article.relatedFaqs)}`,
    `relatedDiagnosis:${yamlList(article.relatedDiagnosis)}`,
    article.relatedSituations?.length
      ? `relatedSituations:${yamlList(article.relatedSituations)}`
      : null,
    article.relatedTools?.length
      ? `relatedTools:${yamlList(article.relatedTools)}`
      : null,
    article.relatedGlossary?.length
      ? `relatedGlossary:${yamlList(article.relatedGlossary)}`
      : null,
    `area: ${yamlString(article.area)}`,
    article.region ? `region: ${yamlString(article.region)}` : null,
    `seoTitle: ${yamlString(article.seoTitle)}`,
    `seoDescription: ${yamlString(article.seoDescription)}`,
    "---",
  ]
    .filter(Boolean)
    .join("\n");

  const body = [
    "## 문제 상황",
    "",
    paragraphs(article.sections.problem),
    "",
    "## 핵심 정리",
    "",
    bulletList(article.sections.summary),
    "",
    "## 절차",
    "",
    bulletList(article.sections.procedure),
    "",
    "## 준비 서류",
    "",
    bulletList(article.sections.documents),
    "",
    "## 주의사항",
    "",
    bulletList(article.sections.caution),
    "",
    "## 자주 묻는 질문",
    "",
    formatFaq(article.sections.faq),
    "",
    "## 관련 업무",
    "",
    formatRelatedServices(article.relatedServices),
    "",
    "## 상담 안내",
    "",
    `**${article.cta.title}**`,
    "",
    article.cta.description,
    "",
    "[상담 문의](/contact)",
  ].join("\n");

  return `${frontmatter}\n\n${body}\n`;
}
