import type { Metadata } from "next";
import { PageContainer } from "@/components/layout/PageContainer";
import { StaticRedirect } from "@/components/seo/StaticRedirect";
import { getPressArticleSlugs } from "@/lib/press-articles";
import { normalizeRouteSlug } from "@/lib/seo/slug";

export const metadata: Metadata = {
  title: "언론보도 상세 이동 | 다옴법무사사무소",
  description: "다옴법무사사무소 언론보도 상세 페이지로 이동합니다.",
  robots: { index: false, follow: true },
};

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getPressArticleSlugs().map((slug) => ({ slug }));
}

export default async function LegacyPressDetailPage({ params }: Props) {
  const { slug } = await params;
  const normalized = normalizeRouteSlug(slug);

  return (
    <PageContainer>
      <StaticRedirect
        targetPath={`/media/${normalized}`}
        message="언론보도 상세 페이지로 이동합니다."
      />
    </PageContainer>
  );
}
