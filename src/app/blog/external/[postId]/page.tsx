import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NaverBlogExternalLayout } from "@/components/blog/NaverBlogExternalLayout";
import { JsonLd } from "@/components/seo/JsonLd";
import { createPageMetadata } from "@/lib/metadata";
import { buildSeoTitle } from "@/lib/seo/metadata";
import { buildExternalBlogArticleSchema } from "@/lib/seo/json-ld";
import { getNaverBlogExternalPath } from "@/lib/naver-blog/urls";
import {
  getNaverBlogExternalPostIds,
  getNaverBlogPostByPostId,
} from "@/lib/naver-blog/urls.server";

type Props = {
  params: Promise<{ postId: string }>;
};

export function generateStaticParams() {
  return getNaverBlogExternalPostIds().map((postId) => ({ postId }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { postId } = await params;
  const post = getNaverBlogPostByPostId(postId);
  if (!post) return {};

  return createPageMetadata({
    title: buildSeoTitle(post.title),
    description: post.description,
    path: getNaverBlogExternalPath(postId),
    keywords: [post.category ?? "법률 칼럼", "네이버 블로그", "부산 법무사"],
    openGraphType: "article",
    publishedTime: post.pubDate,
  });
}

export default async function NaverBlogExternalPage({ params }: Props) {
  const { postId } = await params;
  const post = getNaverBlogPostByPostId(postId);
  if (!post) notFound();

  return (
    <>
      <JsonLd
        data={buildExternalBlogArticleSchema(
          post,
          getNaverBlogExternalPath(postId),
        )}
      />
      <NaverBlogExternalLayout post={post} />
    </>
  );
}
