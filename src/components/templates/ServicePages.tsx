import { PageContainer } from "@/components/layout/PageContainer";
import { PageContentSection } from "@/components/page/PageContentSection";
import { ServiceCard } from "@/components/cards/ServiceCard";
import { CaseCard } from "@/components/cards/CaseCard";
import { ServiceDetailContent } from "@/components/services/ServiceDetailContent";
import { RelatedLinks } from "@/components/page/RelatedLinks";
import { getAllServiceLinks, serviceHubLinks } from "@/lib/seo/internal-links";
import { JsonLd } from "@/components/seo/JsonLd";
import { getAllContent } from "@/lib/content/loader";
import { createPageMetadata } from "@/lib/metadata";
import { buildSeoTitle } from "@/lib/seo/metadata";
import { buildArticleListSchema } from "@/lib/seo/json-ld";
import { serviceSeoMap, staticPageSeo } from "@/lib/seo/page-seo";
import { getCaseImage, getServiceImage } from "@/lib/site-images";
import { allServiceDetails } from "@/lib/services-data";
import type { ServiceDetail } from "@/types/service";

type ServiceDetailTemplateProps = {
  service: ServiceDetail;
};

export function ServiceDetailTemplate({ service }: ServiceDetailTemplateProps) {
  return (
    <PageContainer>
      <ServiceDetailContent service={service} />
    </PageContainer>
  );
}

export function ServicesIndexTemplate() {
  const cases = getAllContent("cases");

  return (
    <PageContainer>
      <JsonLd data={buildArticleListSchema(cases)} />
      <PageContentSection
        h1="업무안내"
        intro="다옴법무사사무소 안윤정 법무사는 상속등기, 부동산등기, 법인등기, 개인회생·파산 등 법무사 업무 전반을 수행합니다. 해운대·센텀·재송동을 중심으로 부산 전역의 의뢰인을 맞이하며, 사건별 맞춤 상담을 제공합니다."
        breadcrumbs={[
          { label: "홈", href: "/" },
          { label: "업무안내" },
        ]}
        currentPath="/services"
        relatedLinks={[
          { href: "/about", label: "법무사 소개" },
          { href: "/location", label: "오시는 길" },
          { href: "/faq", label: "자주 묻는 질문" },
          { href: "/contact", label: "상담 신청" },
        ]}
        relatedTitle="관련 페이지"
      >
        <section
          id="services-list"
          className="section-anchor scroll-mt-[calc(var(--header-height)+1rem)]"
        >
          <h2 className="section-heading">주요 업무 분야</h2>
          <ul className="listing-card-grid mt-4">
            {allServiceDetails.map((service) => (
              <li key={service.slug}>
                <ServiceCard
                  title={service.title}
                  description={service.description}
                  href={`/services/${service.slug}`}
                  image={getServiceImage(service.slug)}
                />
              </li>
            ))}
          </ul>
        </section>

        <section
          id="cases"
          className="section-anchor scroll-mt-[calc(var(--header-height)+1rem)]"
        >
          <h2 className="section-heading">업무 사례</h2>
          <p className="body-text mt-3 max-w-3xl">
            다옴법무사사무소 안윤정 법무사가 처리한 사례를 소개합니다. 개인정보
            보호를 위해 구체적 의뢰인 정보는 비공개하며, 사건 유형과 처리 과정
            위주로 안내합니다.
          </p>
          <ul className="listing-card-grid mt-4">
            {cases.map((item) => (
              <li key={item.slug}>
                <CaseCard
                  title={item.title}
                  summary={item.description}
                  category={item.category}
                  href={item.href}
                  image={getCaseImage(item.slug)}
                />
              </li>
            ))}
          </ul>
        </section>

        <div className="space-y-8">
          <RelatedLinks title="업무 분야" links={getAllServiceLinks()} />
          <RelatedLinks
            title="사무소 안내"
            links={serviceHubLinks}
          />
        </div>
      </PageContentSection>
    </PageContainer>
  );
}

export const servicesIndexMetadata = createPageMetadata(staticPageSeo.services);

export function getServicePageMetadata(service: ServiceDetail) {
  const seo = serviceSeoMap[service.slug];
  const primary = seo?.primaryKeyword ?? service.title;

  return createPageMetadata({
    title: buildSeoTitle(primary),
    description: service.description,
    path: `/services/${service.slug}`,
    keywords: seo?.keywords ?? [primary, "부산 법무사", "다옴법무사사무소"],
    ogImage: getServiceImage(service.slug).src,
  });
}
