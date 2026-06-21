import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PressArticleLayout } from "@/components/press/PressArticleLayout";
import { createPageMetadata } from "@/lib/metadata";
import { buildSeoTitle } from "@/lib/seo/metadata";
import {
  getPressArticle,
  getPressArticleSlugs,
} from "@/lib/press-articles";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getPressArticleSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getPressArticle(slug);
  if (!article) return {};

  return createPageMetadata({
    title: buildSeoTitle(`${article.source} — ${article.title}`),
    description: article.seoDescription ?? article.paragraphs[0],
    path: `/media/${article.slug}`,
    keywords: [article.source, "안윤정 법무사", "부산 법무사", "언론보도", "언론·활동"],
    ogImage: article.image.src,
    openGraphType: "article",
    publishedTime: article.publishedAt,
  });
}

export default async function MediaPressArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getPressArticle(slug);
  if (!article) notFound();

  return <PressArticleLayout article={article} />;
}
