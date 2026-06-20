import type { Metadata } from "next";
import { PageContainer } from "@/components/layout/PageContainer";
import { SiteImage } from "@/components/media/SiteImage";
import { YoutubeVideoSection } from "@/components/media/YoutubeVideoSection";
import { ActivitySectionBlock } from "@/components/profile/ActivitySectionBlock";
import { PageContentSection } from "@/components/page/PageContentSection";
import { createPageMetadata } from "@/lib/metadata";
import { lawyerActivitySections } from "@/lib/lawyer-activities";
import { siteImages } from "@/lib/site-images";
import { youtubeVideos } from "@/lib/youtube-videos";
import { staticPageSeo } from "@/lib/seo/page-seo";

export const metadata: Metadata = createPageMetadata(staticPageSeo.media);

export default function MediaPage() {
  return (
    <PageContainer>
      <PageContentSection
        h1="언론·활동"
        breadcrumbs={[
          { label: "홈", href: "/" },
          { label: "언론·활동" },
        ]}
        currentPath="/media"
        coverImage={siteImages.media.community}
        intro="안윤정 법무사의 대외 활동을 소개합니다. 기업·공공기관과의 법률 지원 협력, 정책 자문 참여, 생활 법률 강의 등 법률 전문가로서 지역과 사회에 기여하는 활동을 이어가고 있습니다."
        relatedLinks={[
          { href: "/about", label: "법무사 소개" },
          { href: "/office", label: "사무소 소개" },
          { href: "/blog", label: "블로그" },
          { href: "/contact", label: "상담 신청" },
        ]}
      >
        <div className="space-y-8">
          <section className="card-surface p-5 md:p-8">
            <h2 className="section-heading">영상</h2>
            <p className="mt-2 text-sm text-navy/65">
              사무소 안내와 박문각 합격 인터뷰 영상입니다.
            </p>
            <div className="mt-6">
              <YoutubeVideoSection videos={youtubeVideos} variant="light" />
            </div>
          </section>

          {lawyerActivitySections.map((section, index) => (
            <ActivitySectionBlock
              key={section.id}
              section={section}
              imagePosition={index % 2 === 0 ? "left" : "right"}
            />
          ))}

          <section className="card-surface p-5 md:p-8">
            <h2 className="section-heading">활동 사진</h2>
            <p className="mt-2 text-sm text-navy/65">
              강의·상담·대외 활동 현장입니다.
            </p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {siteImages.media.gallery.map((image) => (
                <SiteImage
                  key={image.src}
                  {...image}
                  className="overflow-hidden rounded-xl border border-beige-dark"
                />
              ))}
            </div>
          </section>
        </div>
      </PageContentSection>
    </PageContainer>
  );
}
