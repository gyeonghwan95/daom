import Link from "next/link";
import { PageContainer } from "@/components/layout/PageContainer";
import { PageContentSection } from "@/components/page/PageContentSection";
import { ServiceCard } from "@/components/cards/ServiceCard";
import { CaseCard } from "@/components/cards/CaseCard";
import { ServiceDetailContent } from "@/components/services/ServiceDetailContent";
import { getFeaturedDiagnosisLinks } from "@/lib/diagnosis/result-links";
import { RelatedLinks } from "@/components/page/RelatedLinks";
import { getAllServiceLinks, getAllTopicHubLinks, getMainLandingHubLinks, serviceHubLinks } from "@/lib/seo/internal-links";
import { SERVICE_HUB_SECTIONS } from "@/lib/hub/home-sections";
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
          ...getFeaturedDiagnosisLinks(),
          ...getMainLandingHubLinks().slice(0, 6),
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
          id="preservation-registration"
          className="section-anchor scroll-mt-[calc(var(--header-height)+1rem)]"
        >
          <h2 className="section-heading">신축건물 보존등기</h2>
          <p className="body-text mt-3 max-w-3xl">
            사용승인 후 처음 등기부를 만드는 보존등기 안내입니다. 건축주·건축사사무소·시행사·상가·오피스텔 소유자에게 링크로 전달하기 좋습니다.
          </p>
          <ul className="listing-card-grid mt-4">
            <li>
              <ServiceCard
                title="신축건물 보존등기"
                description="부산 신축건물·집합건물·상가·오피스텔 보존등기 절차와 건축주 준비서류 안내"
                href="/부산신축건물보존등기"
                image={getServiceImage("real-estate-registration")}
              />
            </li>
          </ul>
        </section>

        <section
          id="collaboration"
          className="section-anchor scroll-mt-[calc(var(--header-height)+1rem)]"
        >
          <h2 className="section-heading">협업·프로젝트</h2>
          <p className="body-text mt-3 max-w-3xl">
            복대리·부동산 협업·집단등기·기관업무는 일반 상담과 구분해 업무 범위부터
            확인합니다. 전문직·기업·기관 담당자용 안내입니다.
          </p>
          <ul className="listing-card-grid mt-4">
            <li>
              <ServiceCard
                title="협업 안내"
                description="법무사·중개사·건축·시행·기업·기관 협업의 중심 허브"
                href="/partners"
                image={getServiceImage("real-estate-registration")}
              />
            </li>
            <li>
              <ServiceCard
                title="부산 법무사 복대리"
                description="타지역 법무사·법무법인을 위한 부산 현지 등기 협업"
                href="/부산법무사복대리"
                image={getServiceImage("real-estate-registration")}
              />
            </li>
            <li>
              <ServiceCard
                title="집단·대량등기"
                description="여러 호실·필지 프로젝트의 일정·자료 검토 안내"
                href="/부산집단등기"
                image={getServiceImage("ownership-transfer")}
              />
            </li>
          </ul>
        </section>

        <section
          id="public-agency-registration"
          className="section-anchor scroll-mt-[calc(var(--header-height)+1rem)]"
        >
          <h2 className="section-heading">공공기관 등기업무</h2>
          <p className="body-text mt-3 max-w-3xl">
            공기업·지방공기업·출자·출연기관·공사·공단 담당자를 위한 법인등기·부동산등기·촉탁등기 안내입니다. 나라장터·조달청 검토 전 내부 검토용으로도 활용할 수 있습니다.
          </p>
          <ul className="listing-card-grid mt-4">
            <li>
              <ServiceCard
                title="공공기관 등기업무"
                description="공공기관·공기업 법인등기·부동산등기·촉탁등기 절차와 담당자 체크리스트"
                href="/공공기관등기업무"
                image={getServiceImage("corporate-registration")}
              />
            </li>
          </ul>
        </section>

        <section
          id="popular-first-visit"
          className="section-anchor scroll-mt-[calc(var(--header-height)+1rem)]"
        >
          <h2 className="section-heading">처음 방문자가 많이 찾는 업무</h2>
          <p className="body-text mt-3 max-w-3xl">
            추천·비용·상담 준비를 검색하신 분들을 위한 선택 기준·절차 안내 페이지입니다.
            특정 사무소를 대신 골라 주는 광고가 아니라, 상담 전 확인할 체크리스트로
            활용하실 수 있습니다.
          </p>
          <ul className="listing-card-grid mt-4">
            <li>
              <ServiceCard
                title="부산 법무사 추천 기준"
                description="상담 전 확인할 7가지 선택 기준·업무별 체크포인트"
                href="/부산법무사추천"
                image={getServiceImage("inheritance-registration")}
              />
            </li>
            <li>
              <ServiceCard
                title="부산 등기 법무사 선택"
                description="부동산·상속·법인등기별 확인 기준과 서류 안내"
                href="/부산등기법무사추천"
                image={getServiceImage("real-estate-registration")}
              />
            </li>
            <li>
              <ServiceCard
                title="부산 상속등기 상담"
                description="상속포기·한정승인·공동상속인 체크리스트"
                href="/부산상속등기전문"
                image={getServiceImage("inheritance-registration")}
              />
            </li>
            <li>
              <ServiceCard
                title="부산 부동산등기 상담"
                description="매매·말소·전세권·보존등기 절차 확인"
                href="/부산부동산등기전문"
                image={getServiceImage("ownership-transfer")}
              />
            </li>
            <li>
              <ServiceCard
                title="부산 법인등기 상담"
                description="설립·임원변경·본점이전·과태료 기한"
                href="/부산법인등기전문"
                image={getServiceImage("corporate-registration")}
              />
            </li>
            <li>
              <ServiceCard
                title="부산 법무사 상담 준비"
                description="전화·방문·카카오톡 상담 전 준비자료"
                href="/부산법무사상담"
                image={getServiceImage("personal-rehabilitation")}
              />
            </li>
          </ul>
        </section>

        <section
          id="cases"
          className="section-anchor scroll-mt-[calc(var(--header-height)+1rem)]"
        >
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="section-heading">업무 사례</h2>
              <p className="body-text mt-3 max-w-3xl">
                다옴법무사사무소 안윤정 법무사가 처리한 사례를 소개합니다. 개인정보
                보호를 위해 구체적 의뢰인 정보는 비공개하며, 사건 유형과 처리 과정
                위주로 안내합니다.
              </p>
            </div>
            <Link
              href="/cases"
              className="interactive-surface shrink-0 rounded-xl border border-navy/15 bg-white px-4 py-2.5 text-sm font-semibold text-navy hover:bg-beige/40"
            >
              사례 탐색기 →
            </Link>
          </div>
          <ul className="listing-card-grid mt-4">
            {cases.slice(0, 4).map((item) => (
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

        <section
          id="service-hubs"
          className="section-anchor scroll-mt-[calc(var(--header-height)+1rem)]"
        >
          <h2 className="section-heading">업무 허브</h2>
          <p className="body-text mt-3 max-w-3xl">
            상속·부동산·법인·개인회생 등 업무별 허브 페이지에서 비용·서류·기간·지역 안내로
            연결됩니다.
          </p>
          <div className="mt-6 space-y-8">
            {SERVICE_HUB_SECTIONS.map((section) => (
              <RelatedLinks
                key={section.title}
                title={section.title}
                links={section.links}
              />
            ))}
          </div>
        </section>

        <section
          id="diagnosis"
          className="section-anchor scroll-mt-[calc(var(--header-height)+1rem)]"
        >
          <h2 className="section-heading">업무별 자가진단</h2>
          <p className="body-text mt-3 max-w-3xl">
            상속·법인·부동산·회생·전세 등 업무별로 현재 상황을 점검할 수 있습니다.
            질문에 답하면 절차·서류·비용·기한 방향을 안내받을 수 있습니다.
          </p>
          <div className="mt-4">
            <RelatedLinks title="자가진단" links={getFeaturedDiagnosisLinks()} />
          </div>
        </section>

        <section
          id="topic-hubs"
          className="section-anchor scroll-mt-[calc(var(--header-height)+1rem)]"
        >
          <h2 className="section-heading">업무별 종합 안내</h2>
          <p className="body-text mt-3 max-w-3xl">
            상속·법인등기·부동산등기·개인회생·민사소송·임대차·창업 등 업무별로
            관련 절차·서류·비용·지역 안내를 모았습니다.
          </p>
          <div className="mt-4">
            <RelatedLinks title="토픽 허브" links={getAllTopicHubLinks()} />
          </div>
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
