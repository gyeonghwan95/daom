import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageContainer } from "@/components/layout/PageContainer";
import { PageDataTemplate } from "@/components/page-data/PageDataTemplate";
import { JsonLd } from "@/components/seo/JsonLd";
import { pageDataToMetadata } from "@/lib/pageData/metadata";
import { resolveExternalBlogPageData } from "@/lib/pageData/resolvers";
import { buildExternalBlogArticleSchema } from "@/lib/seo/json-ld";
import { getNaverBlogExternalPath } from "@/lib/naver-blog/urls";
import {
  getNaverBlogExternalPostIds,
  getNaverBlogPostByPostId,
} from "@/lib/naver-blog/urls.server";
import { normalizeRouteSlug } from "@/lib/seo/slug";

type Props = {
  params: Promise<{ postId: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return getNaverBlogExternalPostIds().map((postId) => ({ postId }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { postId } = await params;
  const page = resolveExternalBlogPageData(normalizeRouteSlug(postId));
  if (!page) return {};
  return pageDataToMetadata(page);
}

export default async function NaverBlogExternalPage({ params }: Props) {
  const { postId } = await params;
  const normalized = normalizeRouteSlug(postId);
  const page = resolveExternalBlogPageData(normalized);
  const post = getNaverBlogPostByPostId(normalized);
  if (!page || !post) notFound();

  return (
    <PageContainer>
      <JsonLd
        data={buildExternalBlogArticleSchema(
          post,
          getNaverBlogExternalPath(normalized),
        )}
      />
      <PageDataTemplate page={page} />
    </PageContainer>
  );
}
