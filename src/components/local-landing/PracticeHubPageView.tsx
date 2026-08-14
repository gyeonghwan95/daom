import Link from "next/link";
import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { CTASection } from "@/components/sections/CTASection";
import { PageCoverBanner } from "@/components/sections/PageCoverBanner";
import { PageHero } from "@/components/readability";
import { ArticleVisualSlot } from "@/components/media/ArticleVisual";
import { CollabInquiryForm } from "@/components/local-landing/CollabInquiryForm";
import { getCoverImageForPageData } from "@/lib/pageData/cover-image";
import type { PageData } from "@/lib/pageData/types";
import { consultationInquiryCopy } from "@/lib/consultation-inquiry";

export type PracticeHubCard = {
  href: string;
  title: string;
  description: string;
};

type PracticeHubPageViewProps = {
  page: PageData;
  intro: string;
  cards: PracticeHubCard[];
  note?: string;
};

export function PracticeHubPageView({
  page,
  intro,
  cards,
  note,
}: PracticeHubPageViewProps) {
  const cover = getCoverImageForPageData(page);

  return (
    <article className="content-stack">
      <Breadcrumb items={page.breadcrumbs} />
      <BreadcrumbJsonLd items={page.breadcrumbs} currentPath={page.path} />
      <PageCoverBanner image={cover} />

      <PageHero
        h1={page.h1}
        intro={intro}
        ctaLabel={consultationInquiryCopy.ctaShort}
        showDiagnosisCta={false}
        showAboutLawyerCta
      >
        {note ? <p className="mt-3 text-sm text-navy/65">{note}</p> : null}
      </PageHero>

      <ArticleVisualSlot
        path={page.path}
        slot="after-intro"
        category={page.category}
        serviceSlug={page.serviceSlug}
      />

      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <li key={card.href}>
            <Link
              href={card.href}
              className="interactive-surface flex h-full min-h-[7rem] flex-col rounded-2xl border border-beige-dark bg-white px-4 py-4 no-underline hover:border-navy/20 hover:bg-beige/30"
            >
              <span className="font-semibold text-navy">{card.title}</span>
              <span className="mt-2 text-sm leading-relaxed text-navy/70">
                {card.description}
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <CTASection
        pageType="faq"
        title="상담·협업 문의"
        description="관할·일정·서류 현황을 알려 주시면 다음 절차를 안내해 드립니다."
        pageSlug={page.slug}
      />

      {page.slug === "법무사협업" ? <CollabInquiryForm /> : null}
    </article>
  );
}
