import Image from "next/image";
import Link from "next/link";
import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { SiteChromeAfterMain } from "@/components/layout/SiteChromeAfterMain";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { JsonLd } from "@/components/seo/JsonLd";
import { FAQAccordion } from "@/components/sections/FAQAccordion";
import { ContentSection } from "@/components/readability";
import { getContactInfo, getPhoneHref } from "@/lib/contact";
import { encodePublicSrc } from "@/lib/encode-public-src";
import { buildWebPageSchema } from "@/lib/seo/json-ld";
import type { NaverRecoveryTarget } from "@/lib/local-landing/naver-recovery-targets";
import type { PageData } from "@/lib/pageData/types";
import type {
  NrBlock,
  NrEvidenceStatus,
  NrInline,
} from "@/lib/naver-recovery/types";

type NaverRecoveryTargetViewProps = {
  page: PageData;
  target: NaverRecoveryTarget;
};

const STATUS_LABEL: Record<NrEvidenceStatus, string> = {
  VERIFIED_HANDLED: "처리 사례",
  VERIFIED_CONSULTED: "상담 사례",
  EXAMPLE: "설명용 예시",
};

/**
 * 대상 3개 URL 전용 레이아웃.
 * 상담 패널·섹션 내비게이터 없이 header → breadcrumb → main > article > H1 → 첫 답변 순서로 둔다.
 * 상담 CTA는 본문 끝에 한 번만 둔다.
 */
export function NaverRecoveryTargetView({ page, target }: NaverRecoveryTargetViewProps) {
  const { spec, owner } = target;
  const { phone } = getContactInfo();
  const webPage = buildWebPageSchema({
    title: owner.metaTitle,
    description: owner.description,
    path: page.path,
    h1: owner.h1,
    image: spec.ogImage.src,
    dateModified: spec.dateModified,
  });

  return (
    <>
      <div className="mx-auto w-full max-w-[860px] px-4 pt-6 md:px-6 md:pt-10">
        <Breadcrumb items={page.breadcrumbs} />
      </div>
      <main id="main-content" className="flex-1 overflow-x-hidden pb-10 md:pb-14">
        <div className="mx-auto w-full max-w-[860px] px-4 md:px-6">
          <BreadcrumbJsonLd items={page.breadcrumbs} currentPath={page.path} />
          <JsonLd data={webPage} />
          <article className="content-stack">
            <header>
              <p className="readability-hero__eyebrow">{spec.eyebrow}</p>
              <h1 className="page-title">{owner.h1}</h1>
              <div className="readability-prose mt-4 space-y-3 md:mt-5">
                {spec.lead.map((text) => (
                  <p key={text.slice(0, 40)} className="body-text">
                    {text}
                  </p>
                ))}
              </div>
              {spec.keyPoints ? (
                <div className="mt-5 rounded-xl border border-navy/10 bg-cream/50 px-4 py-3">
                  <p className="text-sm font-semibold text-navy">{spec.keyPoints.title}</p>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed text-navy/80 md:text-base">
                    {spec.keyPoints.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
              {spec.facts?.length ? (
                <dl className="mt-5 grid gap-2 sm:grid-cols-3">
                  {spec.facts.map((fact) => (
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
              ) : null}
              <figure className="mx-auto mt-6 w-full max-w-md">
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
            </header>

            {spec.sections.map((section) => (
              <ContentSection key={section.id} id={section.id} title={section.title}>
                <div className="space-y-4">
                  {section.blocks.map((block, index) => (
                    <BlockView key={`${section.id}-${index}`} block={block} />
                  ))}
                </div>
              </ContentSection>
            ))}

            <ContentSection id="faq" title="자주 묻는 질문">
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

            <aside className="rounded-xl border border-navy/10 bg-white/80 px-4 py-3 text-sm leading-relaxed text-navy/70">
              <p>
                <span className="font-semibold text-navy/80">다른 지역에 계신 경우 · </span>
                {spec.remoteNote}
              </p>
              <p className="mt-2 text-xs text-navy/55">
                {spec.reviewNote} 최종 수정 {spec.dateModified}.
              </p>
            </aside>
          </article>
        </div>
      </main>
      <SiteChromeAfterMain />
    </>
  );
}

export function InlineParts({ parts }: { parts: readonly NrInline[] }) {
  return (
    <>
      {parts.map((part, index) =>
        typeof part === "string" ? (
          <span key={index}>{part}</span>
        ) : (
          <Link
            key={index}
            href={part.href}
            className="font-medium text-navy underline underline-offset-2 hover:text-navy/80"
          >
            {part.label}
          </Link>
        ),
      )}
    </>
  );
}

export function BlockView({ block }: { block: NrBlock }) {
  switch (block.kind) {
    case "p":
      return (
        <p className="body-text">
          <InlineParts parts={block.parts} />
        </p>
      );
    case "list": {
      const ListTag = block.ordered ? "ol" : "ul";
      return (
        <ListTag
          className={`${block.ordered ? "list-decimal" : "list-disc"} space-y-2 pl-5 text-[0.97rem] leading-relaxed text-navy/85 md:text-base`}
        >
          {block.items.map((item, index) => (
            <li key={index}>
              <InlineParts parts={item} />
            </li>
          ))}
        </ListTag>
      );
    }
    case "table":
      return (
        <div className="overflow-x-auto rounded-xl border border-navy/10">
          <table className="w-full min-w-[32rem] border-collapse text-left text-sm md:text-[0.95rem]">
            <caption className="sr-only">{block.caption}</caption>
            <thead className="bg-cream/70 text-navy">
              <tr>
                {block.head.map((cell) => (
                  <th key={cell} scope="col" className="px-3 py-2 font-semibold">
                    {cell}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row) => (
                <tr key={row.join("|")} className="border-t border-navy/10 align-top">
                  {row.map((cell, index) =>
                    index === 0 ? (
                      <th key={index} scope="row" className="px-3 py-2 font-medium text-navy">
                        {cell}
                      </th>
                    ) : (
                      <td key={index} className="px-3 py-2 text-navy/80">
                        {cell}
                      </td>
                    ),
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case "cards":
      return (
        <div className="grid gap-3 sm:grid-cols-2">
          {block.items.map((card) => (
            <div key={card.title} className="rounded-xl border border-navy/10 bg-white/80 p-4">
              <h3 className="font-semibold text-navy">{card.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-navy/75">{card.body}</p>
              {card.link ? (
                <Link
                  href={card.link.href}
                  className="mt-2 inline-block text-sm font-medium text-navy underline underline-offset-2"
                >
                  {card.link.label}
                </Link>
              ) : null}
            </div>
          ))}
        </div>
      );
    case "records":
      return (
        <ul className="space-y-3">
          {block.items.map((record) => (
            <li key={record.title} className="rounded-xl border border-navy/10 bg-cream/40 p-4">
              <span className="text-[11px] font-semibold tracking-wide text-navy/55">
                {STATUS_LABEL[record.status]}
              </span>
              <h3 className="mt-0.5 font-semibold text-navy">{record.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-navy/75">{record.body}</p>
              <Link
                href={record.link.href}
                className="mt-2 inline-block text-sm font-medium text-navy underline underline-offset-2"
              >
                {record.link.label}
              </Link>
            </li>
          ))}
        </ul>
      );
    default:
      return null;
  }
}
