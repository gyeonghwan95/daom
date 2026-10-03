import Image from "next/image";
import Link from "next/link";
import { SiteChromeAfterMain } from "@/components/layout/SiteChromeAfterMain";
import { LawyerTrustShowcase } from "@/components/trust/LawyerTrustShowcase";
import { BlockView } from "@/components/naver-recovery/NaverRecoveryTargetView";
import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { ContentSection } from "@/components/readability";
import { FAQAccordion } from "@/components/sections/FAQAccordion";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { JsonLd } from "@/components/seo/JsonLd";
import { getContactInfo, getPhoneHref } from "@/lib/contact";
import { encodePublicSrc } from "@/lib/encode-public-src";
import { getPriorityBreadcrumbs } from "@/lib/priority-seo";
import type { PrioritySeoSpec } from "@/lib/priority-seo/types";
import { buildWebPageSchema } from "@/lib/seo/json-ld";

type PrioritySeoPageViewProps = {
  spec: PrioritySeoSpec;
};

/**
 * H1 → 직접 답변 → 먼저 확인할 것 → (작은 문의 버튼) → 본문 → FAQ → 관련 안내 → CTA.
 * 사진은 첫 본문 섹션 뒤에 둬서 첫 화면을 답변에 쓴다. 전화 버튼은 하단 CTA에만 둔다.
 */
export function PrioritySeoPageView({ spec }: PrioritySeoPageViewProps) {
  const { phone } = getContactInfo();
  const breadcrumbs = getPriorityBreadcrumbs(spec);
  const webPage = buildWebPageSchema({
    title: spec.metaTitle,
    description: spec.description,
    path: spec.path,
    h1: spec.h1,
    image: spec.ogImage.src,
    dateModified: spec.dateModified,
  });

  const figure = (
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
  );

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
              <p className="readability-hero__eyebrow">{spec.eyebrow}</p>
              <h1 className="page-title">{spec.h1}</h1>
              <div className="readability-prose mt-4 space-y-3 md:mt-5">
                {spec.lead.map((text) => (
                  <p key={text.slice(0, 40)} className="body-text">
                    {text}
                  </p>
                ))}
              </div>
              <div className="mt-5 rounded-xl border border-navy/10 bg-cream/50 px-4 py-3">
                <p className="text-sm font-semibold text-navy">{spec.checkFirst.title}</p>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed text-navy/80 md:text-base">
                  {spec.checkFirst.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              {spec.topCta ? (
                <div className="mt-4">
                  <Link
                    href={spec.topCta.href}
                    className="btn-secondary inline-flex min-h-11 items-center justify-center px-5 text-sm md:text-base"
                  >
                    {spec.topCta.label}
                  </Link>
                </div>
              ) : null}
            </header>

            {spec.sections.map((section, sectionIndex) => (
              <div key={section.id} className="content-stack">
                <ContentSection id={section.id} title={section.title}>
                  <div className="space-y-4">
                    {section.blocks.map((block, index) => (
                      <BlockView key={`${section.id}-${index}`} block={block} />
                    ))}
                  </div>
                </ContentSection>
                {sectionIndex === 0 ? figure : null}
              </div>
            ))}

            <ContentSection id="faq" title={spec.faqTitle}>
              <FAQAccordion items={[...spec.faqs]} />
            </ContentSection>

            <nav
              aria-label={spec.related.title}
              className="rounded-2xl border border-navy/10 bg-white/80 p-5 md:p-6"
            >
              <h2 className="section-heading">{spec.related.title}</h2>
              <ul className="mt-3 space-y-2">
                {spec.related.links.map((link) => (
                  <li key={link.href} className="text-[0.97rem] leading-relaxed md:text-base">
                    <Link
                      href={link.href}
                      className="font-medium text-navy underline underline-offset-2 hover:text-navy/80"
                    >
                      {link.label}
                    </Link>
                    <span className="text-navy/70"> — {link.note}</span>
                  </li>
                ))}
              </ul>
            </nav>

            <section
              id="consultation"
              className="section-anchor rounded-2xl border border-navy/15 bg-cream/60 p-5 md:p-6"
            >
              <h2 className="section-heading">{spec.cta.title}</h2>
              <p className="body-text mt-3">{spec.cta.body}</p>
              <ul className="mt-3 list-disc space-y-1 pl-5 text-sm leading-relaxed text-navy/80 md:text-base">
                {spec.cta.checklist.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
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

            <aside className="rounded-xl border border-navy/10 bg-white/80 px-4 py-3 text-sm leading-relaxed text-navy/70">
              <p>
                <span className="font-semibold text-navy/80">사무소 위치 · </span>
                {spec.officeNote}
              </p>
              <p className="mt-2 text-xs text-navy/55">
                {spec.reviewNote} 최종 수정 {spec.dateModified}.
              </p>
            </aside>
          </article>
          <LawyerTrustShowcase />
        </div>
      </main>
      <SiteChromeAfterMain />
    </>
  );
}
