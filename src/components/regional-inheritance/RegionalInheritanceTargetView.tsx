import Image from "next/image";
import Link from "next/link";
import { SiteChromeAfterMain } from "@/components/layout/SiteChromeAfterMain";
import { BlockView } from "@/components/naver-recovery/NaverRecoveryTargetView";
import { NationwideServiceNotice } from "@/components/nationwide/NationwideServiceNotice";
import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { ContentSection } from "@/components/readability";
import { FAQAccordion } from "@/components/sections/FAQAccordion";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { JsonLd } from "@/components/seo/JsonLd";
import { getContactInfo, getPhoneHref } from "@/lib/contact";
import { encodePublicSrc } from "@/lib/encode-public-src";
import type { RegionalInheritanceTarget } from "@/lib/regional-inheritance/types";
import { buildWebPageSchema } from "@/lib/seo/json-ld";
import type { BreadcrumbItem } from "@/types/breadcrumb";

type RegionalInheritanceTargetViewProps = {
  target: RegionalInheritanceTarget;
  breadcrumbs: BreadcrumbItem[];
};

/**
 * 타지역 상속등기 대표 URL 전용 레이아웃.
 * 지역 탐색기 없이 H1 → 직접 답변 → 본문 → FAQ → 전국 의뢰 패널 → 지역 CTA 순서로 둔다.
 * 전국 의뢰 패널은 본문 위로 올리지 않는다.
 */
export function RegionalInheritanceTargetView({
  target,
  breadcrumbs,
}: RegionalInheritanceTargetViewProps) {
  const { phone } = getContactInfo();
  const webPage = buildWebPageSchema({
    title: target.metaTitle,
    description: target.description,
    path: target.path,
    h1: target.h1,
    image: target.ogImage.src,
    dateModified: target.dateModified,
  });

  return (
    <>
      <div className="mx-auto w-full max-w-[860px] px-4 pt-6 md:px-6 md:pt-10">
        <Breadcrumb items={breadcrumbs} />
      </div>
      <main id="main-content" className="flex-1 overflow-x-hidden pb-10 md:pb-14">
        <div className="mx-auto w-full max-w-[860px] px-4 md:px-6">
          <BreadcrumbJsonLd items={breadcrumbs} currentPath={target.path} />
          <JsonLd data={webPage} />
          <article className="content-stack">
            <header>
              <p className="readability-hero__eyebrow">{target.eyebrow}</p>
              <h1 className="page-title">{target.h1}</h1>
              <div className="readability-prose mt-4 space-y-3 md:mt-5">
                {target.lead.map((text) => (
                  <p key={text.slice(0, 40)} className="body-text">
                    {text}
                  </p>
                ))}
              </div>
              <dl className="mt-5 grid gap-2 sm:grid-cols-3">
                {target.facts.map((fact) => (
                  <div
                    key={fact.label}
                    className="rounded-xl border border-navy/10 bg-cream/50 px-3 py-2"
                  >
                    <dt className="text-xs font-semibold text-navy/55">{fact.label}</dt>
                    <dd className="mt-0.5 text-sm font-medium leading-snug text-navy">
                      {fact.value}
                    </dd>
                  </div>
                ))}
              </dl>
              <figure className="mx-auto mt-6 w-full max-w-md">
                <div
                  className="relative w-full overflow-hidden rounded-2xl border border-beige-dark bg-beige/40"
                  style={{ aspectRatio: `${target.image.width} / ${target.image.height}` }}
                >
                  <Image
                    src={encodePublicSrc(target.image.src)}
                    alt={target.image.alt}
                    fill
                    quality={72}
                    className="object-cover"
                    sizes="(max-width: 768px) 92vw, 28rem"
                  />
                </div>
                {target.image.caption ? (
                  <figcaption className="mt-2 text-center text-xs leading-relaxed text-navy/60">
                    {target.image.caption}
                  </figcaption>
                ) : null}
              </figure>
            </header>

            {target.sections.map((section) => (
              <ContentSection key={section.id} id={section.id} title={section.title}>
                <div className="space-y-4">
                  {section.blocks.map((block, index) => (
                    <BlockView key={`${section.id}-${index}`} block={block} />
                  ))}
                </div>
              </ContentSection>
            ))}

            <ContentSection id="faq" title={`${target.region} 상속등기 자주 묻는 질문`}>
              <FAQAccordion items={[...target.faqs]} />
            </ContentSection>

            <NationwideServiceNotice
              type="jurisdiction-exception"
              badge={`${target.region} 부동산 전국 의뢰 가능`}
              showDetails={false}
            />

            <section
              id="consultation"
              className="section-anchor rounded-2xl border border-navy/15 bg-cream/60 p-5 md:p-6"
            >
              <h2 className="section-heading">{target.cta.title}</h2>
              <p className="body-text mt-3">{target.cta.body}</p>
              <ul className="mt-3 list-disc space-y-1 pl-5 text-sm leading-relaxed text-navy/80 md:text-base">
                {target.cta.checklist.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                <Link
                  href={target.cta.href}
                  className="btn-primary inline-flex min-h-12 items-center justify-center px-6"
                >
                  {target.cta.label}
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
                {target.officeNote}
              </p>
              <p className="mt-2 text-xs text-navy/55">
                {target.reviewNote} 최종 수정 {target.dateModified}.
              </p>
            </aside>
          </article>
        </div>
      </main>
      <SiteChromeAfterMain />
    </>
  );
}
