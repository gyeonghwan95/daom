import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageContainer } from "@/components/layout/PageContainer";
import { PageDataTemplate } from "@/components/page-data/PageDataTemplate";
import { pageDataToMetadata } from "@/lib/pageData/metadata";
import { resolveKoreanLandingPageData } from "@/lib/pageData/resolvers";
import { getKoreanSlugStaticParams } from "@/lib/seo/site-routes";
import { normalizeRouteSlug } from "@/lib/seo/slug";

type PageProps = {
  params: Promise<{ landingSlug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return getKoreanSlugStaticParams();
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { landingSlug } = await params;
  const page = resolveKoreanLandingPageData(normalizeRouteSlug(landingSlug));
  if (!page) return {};
  return pageDataToMetadata(page);
}

export default async function LocalLandingPage({ params }: PageProps) {
  const { landingSlug } = await params;
  const page = resolveKoreanLandingPageData(normalizeRouteSlug(landingSlug));
  if (!page) notFound();

  return (
    <PageContainer>
      <PageDataTemplate page={page} />
    </PageContainer>
  );
}
