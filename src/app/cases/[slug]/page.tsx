import type { Metadata } from "next";
import { PageContainer } from "@/components/layout/PageContainer";
import { StaticRedirect } from "@/components/seo/StaticRedirect";
import { getContentSlugs } from "@/lib/content/loader";
import { normalizeRouteSlug } from "@/lib/seo/slug";
import { LEGACY_CASE_SLUGS } from "@/lib/cases/legacy-slugs";

export const metadata: Metadata = {
  title: "사례 상세 이동 | 다옴법무사사무소",
  description: "다옴법무사사무소 사례 상세 페이지로 이동합니다.",
  robots: { index: false, follow: true },
};

type Props = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return getContentSlugs("cases")
    .filter((slug) => LEGACY_CASE_SLUGS.has(slug))
    .map((slug) => ({ slug }));
}

export default async function LegacyCaseDetailPage({ params }: Props) {
  const { slug } = await params;
  const normalized = normalizeRouteSlug(slug);

  return (
    <PageContainer>
      <StaticRedirect
        targetPath={`/services/cases/${normalized}`}
        message="사례 상세 페이지로 이동합니다."
      />
    </PageContainer>
  );
}
