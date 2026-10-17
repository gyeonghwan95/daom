import type { Metadata } from "next";
import { PageContainer } from "@/components/layout/PageContainer";
import { AboutPageView } from "@/components/profile/AboutPageView";
import { JsonLd } from "@/components/seo/JsonLd";
import { createPageMetadata } from "@/lib/metadata";
import { buildLawyerAboutSchemas } from "@/lib/seo/json-ld";
import { staticPageSeo } from "@/lib/seo/page-seo";

export const metadata: Metadata = createPageMetadata(staticPageSeo.about);

export default function AboutPage() {
  return (
    <PageContainer>
      <JsonLd data={buildLawyerAboutSchemas()} />
      <AboutPageView />
    </PageContainer>
  );
}
