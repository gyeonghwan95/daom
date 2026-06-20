import { PageContainer } from "@/components/layout/PageContainer";
import { ServiceCard } from "@/components/cards/ServiceCard";
import { ServiceDetailContent } from "@/components/services/ServiceDetailContent";
import { PageContentSection } from "@/components/page/PageContentSection";
import { createPageMetadata } from "@/lib/metadata";
import { buildSeoTitle } from "@/lib/seo/metadata";
import { serviceSeoMap, staticPageSeo } from "@/lib/seo/page-seo";
import { getServiceImage, siteImages } from "@/lib/site-images";
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
  return (
    <PageContainer>
      <PageContentSection
        h1="업무안내"
        intro="다옴법무사사무소 안윤정 법무사는 상속등기, 부동산등기, 법인등기, 개인회생·파산 등 법무사 업무 전반을 수행합니다. 해운대·센텀·재송동을 중심으로 부산 전역의 의뢰인을 맞이하며, 사건별 맞춤 상담을 제공합니다."
        breadcrumbs={[
          { label: "홈", href: "/" },
          { label: "업무안내" },
        ]}
        currentPath="/services"
        coverImage={siteImages.services.cover}
        relatedLinks={[
          { href: "/about", label: "법무사 소개" },
          { href: "/location", label: "오시는 길" },
          { href: "/faq", label: "자주 묻는 질문" },
          { href: "/contact", label: "상담 신청" },
        ]}
        relatedTitle="관련 페이지"
      >
        <section>
          <h2 className="section-heading">주요 업무 분야</h2>
          <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
      </PageContentSection>
    </PageContainer>
  );
}

export const servicesIndexMetadata = createPageMetadata(staticPageSeo.services);

export function getServicePageMetadata(service: ServiceDetail) {
  const seo = serviceSeoMap[service.slug];
  const primary = seo?.primaryKeyword ?? service.title;

  return createPageMetadata({
    title: buildSeoTitle(`${primary} | ${service.title} 안내`),
    description: service.description,
    path: `/services/${service.slug}`,
    keywords: seo?.keywords ?? [primary, "부산 법무사", "다옴법무사사무소"],
    ogImage: getServiceImage(service.slug).src,
  });
}
