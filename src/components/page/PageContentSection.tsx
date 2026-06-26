import { CTASection } from "@/components/sections/CTASection";
import { PageCoverBanner } from "@/components/sections/PageCoverBanner";
import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { RelatedLinks } from "@/components/page/RelatedLinks";
import { SiteImage } from "@/components/media/SiteImage";
import type { SiteImageAsset } from "@/lib/site-images";
import type { BreadcrumbItem } from "@/types/breadcrumb";
import type { RelatedLink } from "@/types/content";

type PageContentSectionProps = {
  h1: string;
  intro: string;
  breadcrumbs?: BreadcrumbItem[];
  currentPath?: string;
  coverImage?: SiteImageAsset;
  introSideImage?: SiteImageAsset;
  relatedLinks: RelatedLink[];
  relatedTitle?: string;
  consultationDescription?: string;
  showConsultationCTA?: boolean;
  children?: React.ReactNode;
};

export function PageContentSection({
  h1,
  intro,
  breadcrumbs,
  currentPath,
  coverImage,
  introSideImage,
  relatedLinks,
  relatedTitle,
  consultationDescription,
  showConsultationCTA = true,
  children,
}: PageContentSectionProps) {
  return (
    <article className="space-y-6 md:space-y-10">
      {breadcrumbs && breadcrumbs.length > 0 && (
        <>
          <Breadcrumb items={breadcrumbs} />
          {currentPath && (
            <BreadcrumbJsonLd items={breadcrumbs} currentPath={currentPath} />
          )}
        </>
      )}

      {coverImage && <PageCoverBanner image={coverImage} priority />}

      <header>
        {introSideImage ? (
          <div className="grid gap-6 lg:grid-cols-[1fr_minmax(0,18rem)] lg:items-start lg:gap-8 xl:grid-cols-[1fr_minmax(0,20rem)]">
            <div>
              <h1 className="page-title">{h1}</h1>
              <p className="body-text mt-4 text-[0.9375rem] leading-relaxed md:mt-5 md:text-base">
                {intro}
              </p>
            </div>
            <div className="w-full max-w-xs justify-self-center sm:max-w-sm lg:max-w-none lg:justify-self-end">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-beige-dark bg-beige/30 shadow-sm sm:rounded-2xl">
                <SiteImage
                  {...introSideImage}
                  fill
                  sizes="(max-width: 640px) 90vw, (max-width: 1024px) 40vw, 20rem"
                  priority
                />
              </div>
            </div>
          </div>
        ) : (
          <>
            <h1 className="page-title">{h1}</h1>
            <p className="body-text mt-4 max-w-3xl md:mt-5">{intro}</p>
          </>
        )}
      </header>

      {children}

      {showConsultationCTA && (
        <div id="consultation" className="section-anchor scroll-mt-[calc(var(--header-height)+1rem)]">
          <CTASection description={consultationDescription} />
        </div>
      )}

      <RelatedLinks title={relatedTitle} links={relatedLinks} />
    </article>
  );
}
