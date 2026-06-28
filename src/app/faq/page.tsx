import type { Metadata } from "next";
import { PageContainer } from "@/components/layout/PageContainer";
import { FaqHubGroups } from "@/components/faq/FaqHubGroups";
import { PageContentSection } from "@/components/page/PageContentSection";
import { JsonLd } from "@/components/seo/JsonLd";
import { faqs } from "@/lib/faq-data";
import { createPageMetadata } from "@/lib/metadata";
import { buildFaqPageSchema } from "@/lib/seo/json-ld";
import { getMainLandingHubLinks } from "@/lib/seo/internal-links";
import { siteImages } from "@/lib/site-images";
import { staticPageSeo } from "@/lib/seo/page-seo";

export const metadata: Metadata = createPageMetadata(staticPageSeo.faq);

export default function FaqPage() {
  return (
    <PageContainer>
      <JsonLd data={buildFaqPageSchema(faqs)} />
      <PageContentSection
        h1="자주 묻는 질문"
        breadcrumbs={[
          { label: "홈", href: "/" },
          { label: "FAQ" },
        ]}
        currentPath="/faq"
        coverImage={siteImages.faq.cover}
        intro="다옴법무사사무소를 찾아주시는 분들이 자주 묻는 질문을 모았습니다. 아래 내용으로도 궁금증이 해소되지 않으면 안윤정 법무사에게 직접 문의해 주세요."
        relatedLinks={[
          ...getMainLandingHubLinks().slice(0, 8),
          { href: "/services", label: "업무안내" },
          { href: "/contact", label: "상담 신청" },
          { href: "/blog", label: "포스팅" },
          { href: "/location", label: "오시는 길" },
        ]}
      >
        <section
          id="faq-list"
          className="section-anchor scroll-mt-[calc(var(--header-height)+1rem)]"
        >
          <h2 className="section-heading">비용·서류·기간·기한 FAQ</h2>
          <p className="body-text mt-3 max-w-3xl">
            비용, 준비서류, 소요 기간, 법정 기한 관련 질문을 주제별로 모았습니다.
          </p>
          <div className="mt-6">
            <FaqHubGroups items={faqs} />
          </div>
        </section>
      </PageContentSection>
    </PageContainer>
  );
}
