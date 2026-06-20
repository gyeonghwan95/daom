import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MdxArticleLayout } from "@/components/content/MdxArticleLayout";
import { JsonLd } from "@/components/seo/JsonLd";
import { getCompiledContent, getContentSlugs } from "@/lib/content/loader";
import { createPageMetadata } from "@/lib/metadata";
import { resolveContentSeoTitle } from "@/lib/seo/metadata";
import { buildSingleFaqSchema } from "@/lib/seo/json-ld";
import { faqs } from "@/lib/faq-data";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getContentSlugs("faq").map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = await getCompiledContent("faq", slug);
  if (!item) return {};

  const { meta } = item;
  return createPageMetadata({
    title: resolveContentSeoTitle(meta.title, meta.seoTitle),
    description: meta.seoDescription ?? meta.description,
    path: meta.href,
    keywords: [...meta.tags, meta.category, "부산 법무사", "FAQ"],
    openGraphType: "article",
    publishedTime: meta.date,
    authors: [meta.author],
  });
}

export default async function FaqDetailPage({ params }: Props) {
  const { slug } = await params;
  const item = await getCompiledContent("faq", slug);
  if (!item) notFound();

  const { meta, content } = item;
  const faqEntry = faqs.find((f) => f.slug === slug);

  return (
    <MdxArticleLayout meta={meta} listLabel="FAQ" listHref="/faq">
      <JsonLd
        data={buildSingleFaqSchema(
          faqEntry ?? { question: meta.title, answer: meta.description, slug, href: meta.href },
        )}
      />
      {content}
    </MdxArticleLayout>
  );
}
