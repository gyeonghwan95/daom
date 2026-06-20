import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MdxArticleLayout } from "@/components/content/MdxArticleLayout";
import { JsonLd } from "@/components/seo/JsonLd";
import { getCompiledContent, getContentSlugs } from "@/lib/content/loader";
import { createPageMetadata } from "@/lib/metadata";
import { resolveContentSeoTitle } from "@/lib/seo/metadata";
import { buildArticleSchema } from "@/lib/seo/json-ld";
import { getBlogPostImage } from "@/lib/site-images";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getContentSlugs("blog").map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getCompiledContent("blog", slug);
  if (!post) return {};

  const { meta } = post;
  return createPageMetadata({
    title: resolveContentSeoTitle(meta.title, meta.seoTitle),
    description: meta.seoDescription ?? meta.description,
    path: `/blog/${meta.slug}`,
    keywords: [...meta.tags, meta.category, "부산 법무사"],
    ogImage: getBlogPostImage(meta.slug).src,
    openGraphType: "article",
    publishedTime: meta.date,
    authors: [meta.author],
  });
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;
  const post = await getCompiledContent("blog", slug);
  if (!post) notFound();

  const { meta, content } = post;
  const image = getBlogPostImage(meta.slug).src;

  return (
    <MdxArticleLayout meta={meta} listLabel="블로그" listHref="/blog">
      <JsonLd data={buildArticleSchema(meta, image)} />
      {content}
    </MdxArticleLayout>
  );
}
