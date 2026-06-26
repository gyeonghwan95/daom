import { InlineConsultationCTA } from "@/components/consultation/InlineConsultationCTA";
import Link from "next/link";
import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageCoverBanner } from "@/components/sections/PageCoverBanner";
import { CTASection } from "@/components/sections/CTASection";
import { FAQAccordion } from "@/components/sections/FAQAccordion";
import { ServiceInternalLinks } from "@/components/services/ServiceInternalLinks";
import { RelatedLinks } from "@/components/page/RelatedLinks";
import { buildFaqPageSchema, buildServicePageSchema } from "@/lib/seo/json-ld";
import { consultationCopy } from "@/lib/consultation";
import { getTopicHubLinkForService } from "@/lib/seo/internal-links";
import { getServiceImage } from "@/lib/site-images";
import type { ServiceDetail } from "@/types/service";

type ServiceDetailContentProps = {
  service: ServiceDetail;
};

function ContentBlock({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className="section-anchor scroll-mt-[calc(var(--header-height)+1rem)]"
    >
      <h2 className="section-heading">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export function ServiceDetailContent({ service }: ServiceDetailContentProps) {
  const path = `/services/${service.slug}`;
  const hubLink = getTopicHubLinkForService(service.slug);

  return (
    <article className="space-y-8 md:space-y-12">
      <Breadcrumb
        items={[
          { label: "홈", href: "/" },
          { label: "업무안내", href: "/services" },
          { label: service.title },
        ]}
      />
      <BreadcrumbJsonLd
        items={[
          { label: "홈", href: "/" },
          { label: "업무안내", href: "/services" },
          { label: service.title },
        ]}
        currentPath={path}
      />
      <JsonLd
        data={[
          buildServicePageSchema(service.title, path),
          buildFaqPageSchema(service.faqs),
        ]}
      />

      <PageCoverBanner image={getServiceImage(service.slug)} />

      <header>
        <h1 className="page-title">{service.title}</h1>
        <p className="body-text mt-4 max-w-3xl md:mt-5">{service.intro}</p>
      </header>

      {hubLink ? (
        <RelatedLinks title="업무 종합 허브" links={[hubLink]} />
      ) : null}

      <ContentBlock id="when-needed" title="어떤 경우에 필요한가요">
        <p className="text-base leading-relaxed text-navy/80 md:text-lg">
          {service.whenNeeded}
        </p>
      </ContentBlock>

      <ContentBlock id="procedures" title="절차">
        <ol className="space-y-3">
          {service.procedures.map((step, index) => (
            <li
              key={step}
              className="flex gap-4 rounded-lg border border-beige-dark bg-cream px-4 py-3 md:px-5 md:py-4"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-navy text-sm font-medium text-white">
                {index + 1}
              </span>
              <span className="text-base leading-relaxed text-navy/80 md:pt-1">
                {step}
              </span>
            </li>
          ))}
        </ol>
      </ContentBlock>

      <ContentBlock id="documents" title="준비 서류">
        <ul className="grid gap-2 sm:grid-cols-2">
          {service.documents.map((doc) => (
            <li
              key={doc}
              className="flex items-start gap-2 rounded-lg bg-beige px-4 py-3 text-base text-navy/80"
            >
              <span className="mt-1 text-navy-light" aria-hidden="true">
                ·
              </span>
              {doc}
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm text-navy/60">
          사건마다 추가 서류가 필요할 수 있습니다. 상담 시 정확한 목록을
          안내해 드립니다.
        </p>
      </ContentBlock>

      <InlineConsultationCTA
        description="준비 서류가 막막하시면 다옴법무사사무소 안윤정 법무사에게 현재 상황을 알려주세요. 필요한 서류와 순서를 차분히 안내해 드립니다."
      />

      <ContentBlock id="common-issues" title="자주 발생하는 문제">
        <ul className="space-y-3">
          {service.commonIssues.map((issue) => (
            <li
              key={issue}
              className="card-surface px-4 py-3 text-base leading-relaxed text-navy/80 md:px-5 md:py-4"
            >
              {issue}
            </li>
          ))}
        </ul>
      </ContentBlock>

      <ContentBlock id="our-approach" title="다옴법무사사무소의 진행 방식">
        <div className="card-surface bg-beige p-6 md:p-8">
          <p className="text-base leading-relaxed text-navy/80 md:text-lg">
            {service.ourApproach}
          </p>
        </div>
      </ContentBlock>

      <ContentBlock id="service-faq" title="자주 묻는 질문">
        <FAQAccordion items={service.faqs} />
      </ContentBlock>

      {service.relatedCase && (
        <section
          id="related-case"
          className="section-anchor scroll-mt-[calc(var(--header-height)+1rem)] card-surface border-navy/10 bg-cream p-5 md:p-6"
        >
          <h2 className="text-base font-semibold text-navy md:text-lg">
            관련 사례
          </h2>
          <p className="mt-2 text-base text-navy/75">
            비슷한 유형의 사건 처리 경험이 있습니다. 구체적 상황은 상담을
            통해 확인해 주세요.
          </p>
          <Link
            href={service.relatedCase.href}
            className="mt-4 inline-flex min-h-12 items-center text-base font-medium text-navy-light underline-offset-2 hover:underline"
          >
            {service.relatedCase.label} →
          </Link>
        </section>
      )}

      <div
        id="consultation"
        className="section-anchor scroll-mt-[calc(var(--header-height)+1rem)]"
      >
        <CTASection description={consultationCopy.default} />
      </div>

      <ServiceInternalLinks currentSlug={service.slug} />
    </article>
  );
}
