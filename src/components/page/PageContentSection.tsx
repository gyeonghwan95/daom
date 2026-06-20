import { CTASection } from "@/components/sections/CTASection";
import { PageCoverBanner } from "@/components/sections/PageCoverBanner";
import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { RelatedLinks } from "@/components/page/RelatedLinks";
import type { SiteImageAsset } from "@/lib/site-images";
import type { BreadcrumbItem } from "@/types/breadcrumb";
import type { RelatedLink } from "@/types/content";

type PageContentSectionProps = {
  h1: string;
  intro: string;
  breadcrumbs?: BreadcrumbItem[];
  currentPath?: string;
  coverImage?: SiteImageAsset;
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
  relatedLinks,
  relatedTitle,
  consultationDescription,
  showConsultationCTA = true,
  children,
}: PageContentSectionProps) {
  return (
    <article className="space-y-8 md:space-y-12">
      {breadcrumbs && breadcrumbs.length > 0 && (
        <>
          <Breadcrumb items={breadcrumbs} />
          {currentPath && (
            <BreadcrumbJsonLd items={breadcrumbs} currentPath={currentPath} />
          )}
        </>
      )}

      {coverImage && <PageCoverBanner image={coverImage} />}

      <header>
        <h1 className="page-title">{h1}</h1>
        <p className="body-text mt-4 max-w-3xl md:mt-5">{intro}</p>
      </header>

      {children}

      {showConsultationCTA && (
        <CTASection description={consultationDescription} />
      )}

      <RelatedLinks title={relatedTitle} links={relatedLinks} />
    </article>
  );
}
