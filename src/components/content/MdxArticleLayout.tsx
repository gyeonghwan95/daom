import { PageContainer } from "@/components/layout/PageContainer";
import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { CTASection } from "@/components/sections/CTASection";
import { PageCoverBanner } from "@/components/sections/PageCoverBanner";
import { RelatedLinks } from "@/components/page/RelatedLinks";
import { consultationCopy } from "@/lib/consultation";
import {
  formatContentDate,
  getServiceLabel,
} from "@/lib/content/loader";
import {
  getBlogPostImage,
  getCaseImage,
  siteImages,
  type SiteImageAsset,
} from "@/lib/site-images";
import type { ContentMeta } from "@/types/content-mdx";

type MdxArticleLayoutProps = {
  meta: ContentMeta;
  listLabel: string;
  listHref: string;
  children: React.ReactNode;
};

function getArticleCover(meta: ContentMeta): SiteImageAsset {
  if (meta.contentType === "blog") return getBlogPostImage(meta.slug);
  if (meta.contentType === "cases") return getCaseImage(meta.slug);
  if (meta.contentType === "faq") return siteImages.faq.cover;
  return getBlogPostImage(meta.slug);
}

export function MdxArticleLayout({
  meta,
  listLabel,
  listHref,
  children,
}: MdxArticleLayoutProps) {
  const relatedServiceLinks =
    meta.relatedServices?.map((slug) => ({
      href: `/services/${slug}`,
      label: getServiceLabel(slug),
    })) ?? [];

  const relatedLinks = [
    ...relatedServiceLinks,
    { href: "/contact", label: "상담 신청" },
    { href: listHref, label: `${listLabel} 목록` },
  ];

  return (
    <PageContainer>
      <article className="mx-auto max-w-3xl">
        <Breadcrumb
          items={[
            { label: "홈", href: "/" },
            { label: listLabel, href: listHref },
            { label: meta.title },
          ]}
        />
        <BreadcrumbJsonLd
          items={[
            { label: "홈", href: "/" },
            { label: listLabel, href: listHref },
            { label: meta.title },
          ]}
          currentPath={meta.href}
        />

        <div className="mt-6">
          <PageCoverBanner image={getArticleCover(meta)} priority />
        </div>

        <header className="mt-8 border-b border-beige-dark pb-8">
          <div className="flex flex-wrap gap-2 text-sm text-navy-light">
            <span className="rounded-full bg-beige px-3 py-1 font-medium">
              {meta.category}
            </span>
            {meta.area && (
              <span className="rounded-full bg-cream px-3 py-1">{meta.area}</span>
            )}
            {meta.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-cream px-3 py-1">
                {tag}
              </span>
            ))}
          </div>
          <h1 className="page-title mt-4">{meta.title}</h1>
          <p className="mt-3 text-base leading-relaxed text-navy/75 md:text-lg">
            {meta.description}
          </p>
          <p className="mt-4 text-sm text-navy/60 md:text-base">
            {formatContentDate(meta.date)} · {meta.author} · {meta.office}
          </p>
        </header>

        <section
          id="content"
          className="section-anchor scroll-mt-[calc(var(--header-height)+1rem)] py-8 md:py-10"
          aria-labelledby="article-content-heading"
        >
          <h2 id="article-content-heading" className="section-heading">
            상세 안내
          </h2>
          <div className="mt-6">{children}</div>
        </section>

        <div
          id="consultation"
          className="section-anchor scroll-mt-[calc(var(--header-height)+1rem)]"
        >
          <CTASection description={consultationCopy.default} />
        </div>

        {relatedLinks.length > 0 && (
          <div className="pb-8">
            <RelatedLinks title="관련 업무" links={relatedLinks} />
          </div>
        )}
      </article>
    </PageContainer>
  );
}
