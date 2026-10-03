import Image from "next/image";
import Link from "next/link";
import { Fragment } from "react";
import { SeoContentCarousel } from "@/components/carousel/SeoContentCarousel";
import { SiteChromeAfterMain } from "@/components/layout/SiteChromeAfterMain";
import { LawyerTrustShowcase } from "@/components/trust/LawyerTrustShowcase";
import { RemoteServicePanel } from "@/components/nationwide/RemoteServicePanel";
import { BlockView } from "@/components/naver-recovery/NaverRecoveryTargetView";
import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { ContentSection } from "@/components/readability";
import { FAQAccordion } from "@/components/sections/FAQAccordion";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { JsonLd } from "@/components/seo/JsonLd";
import { getContactInfo, getPhoneHref } from "@/lib/contact";
import { encodePublicSrc } from "@/lib/encode-public-src";
import type { MetroRemoteSpec } from "@/lib/metro-remote/types";
import { buildWebPageSchema } from "@/lib/seo/json-ld";
import type { BreadcrumbItem } from "@/types/breadcrumb";

type MetroRemoteTargetViewProps = {
  spec: MetroRemoteSpec;
  breadcrumbs: BreadcrumbItem[];
};

/**
 * 수도권·충청 원거리 상속등기 대표 URL 전용 레이아웃.
 * H1 → 직접 답변 → 비대면 의뢰 패널·상담 버튼 → 기준 표 → 본문 → FAQ → 상담 → 작성자 → 다음 단계 캐러셀.
 * 패널 문구는 공용 템플릿(NationwideServiceNotice) 대신 페이지 스펙에서 받는다.
 */
export function MetroRemoteTargetView({ spec, breadcrumbs }: MetroRemoteTargetViewProps) {
  const { phone } = getContactInfo();
  const webPage = buildWebPageSchema({
    title: spec.metaTitle,
    description: spec.description,
    path: spec.path,
    h1: spec.h1,
    image: spec.ogImage.src,
    dateModified: spec.dateModified,
  });
  const carouselItems = spec.nextSteps.items.map((item) => ({
    id: item.href,
    title: item.title,
    href: item.href,
    image: encodePublicSrc(item.image),
    imageAlt: item.imageAlt,
  }));

  return (
    <>
      <div className="mx-auto w-full max-w-[860px] px-4 pt-6 md:px-6 md:pt-10">
        <Breadcrumb items={breadcrumbs} />
      </div>
      <main id="main-content" className="flex-1 overflow-x-hidden pb-10 md:pb-14">
        <div className="mx-auto w-full max-w-[860px] px-4 md:px-6">
          <BreadcrumbJsonLd items={breadcrumbs} currentPath={spec.path} />
          <JsonLd data={webPage} />
          <article className="content-stack break-keep">
            <header>
              <p className="readability-hero__eyebrow">{spec.kicker}</p>
              <h1 className="page-title">{spec.h1}</h1>
              <div className="readability-prose mt-4 space-y-3 md:mt-5">
                {spec.lead.map((text) => (
                  <p key={text.slice(0, 40)} className="body-text">
                    {text}
                  </p>
                ))}
              </div>
              <div className="mt-5">
                <RemoteServicePanel
                  badge={spec.remotePanel.badge}
                  title={spec.remotePanel.title}
                  titleAs="p"
                  lead={spec.remotePanel.lead}
                  points={spec.remotePanel.points}
                  footnote={spec.remotePanel.footnote}
                  ariaLabel={`${spec.region} 부동산 원거리 의뢰 안내`}
                />
                <Link
                  href={spec.remotePanel.ctaHref}
                  className="btn-primary mt-3 inline-flex min-h-12 w-full items-center justify-center px-6 sm:w-auto"
                >
                  {spec.remotePanel.ctaLabel}
                </Link>
              </div>
              {spec.glance ? (
                <div className="mt-5">
                  <BlockView block={spec.glance} />
                </div>
              ) : null}
            </header>

            {spec.sections.map((section, sectionIndex) => (
              <Fragment key={section.id}>
                <ContentSection id={section.id} title={section.title}>
                  <div className="space-y-4">
                    {section.blocks.map((block, index) => (
                      <BlockView key={`${section.id}-${index}`} block={block} />
                    ))}
                  </div>
                </ContentSection>
                {sectionIndex === 0 ? (
                  <figure className="mx-auto w-full max-w-md">
                    <div
                      className="relative w-full overflow-hidden rounded-2xl border border-beige-dark bg-beige/40"
                      style={{ aspectRatio: `${spec.image.width} / ${spec.image.height}` }}
                    >
                      <Image
                        src={encodePublicSrc(spec.image.src)}
                        alt={spec.image.alt}
                        fill
                        quality={72}
                        className="object-cover"
                        sizes="(max-width: 768px) 92vw, 28rem"
                      />
                    </div>
                    {spec.image.caption ? (
                      <figcaption className="mt-2 text-center text-xs leading-relaxed text-navy/60">
                        {spec.image.caption}
                      </figcaption>
                    ) : null}
                  </figure>
                ) : null}
              </Fragment>
            ))}

            <ContentSection id="faq" title={spec.faqTitle}>
              <FAQAccordion items={[...spec.faqs]} />
            </ContentSection>

            <section
              id="consultation"
              className="section-anchor rounded-2xl border border-navy/15 bg-cream/60 p-5 md:p-6"
            >
              <h2 className="section-heading">{spec.cta.title}</h2>
              <p className="body-text mt-3">{spec.cta.body}</p>
              <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                <Link
                  href={spec.cta.href}
                  className="btn-primary inline-flex min-h-12 items-center justify-center px-6"
                >
                  {spec.cta.label}
                </Link>
                <a
                  href={getPhoneHref(phone)}
                  className="btn-secondary inline-flex min-h-12 items-center justify-center px-6"
                >
                  전화 {phone}
                </a>
              </div>
            </section>

            <aside
              aria-label="작성자"
              className="rounded-xl border border-navy/10 bg-white/80 px-4 py-3 text-sm leading-relaxed text-navy/70"
            >
              <p>
                <span className="font-semibold text-navy/85">
                  {spec.author.role} {spec.author.name}
                </span>
                <span className="text-navy/60"> · {spec.author.officeNote}</span>
              </p>
              <p className="mt-1 text-xs text-navy/55">
                근거 {spec.author.sources.join(", ")} · 최종 수정 {spec.dateModified}
              </p>
            </aside>

            <SeoContentCarousel
              heading={spec.nextSteps.heading}
              description={spec.nextSteps.description}
              items={carouselItems}
              className="mt-2"
            />
          </article>
          <LawyerTrustShowcase />
        </div>
      </main>
      <SiteChromeAfterMain />
    </>
  );
}
