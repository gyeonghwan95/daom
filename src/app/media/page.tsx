import type { Metadata } from "next";
import Link from "next/link";
import { PageContainer } from "@/components/layout/PageContainer";
import { PaginatedPressGrid } from "@/components/profile/PaginatedPressGrid";
import { YoutubeVideoSection } from "@/components/media/YoutubeVideoSection";
import { ActivitySectionBlock } from "@/components/profile/ActivitySectionBlock";
import { LecturesSection } from "@/components/profile/LecturesSection";
import { PageContentSection } from "@/components/page/PageContentSection";
import { createPageMetadata } from "@/lib/metadata";
import { lawyerActivitySections } from "@/lib/lawyer-activities";
import { getAllPressArticles, getPressArticleHref } from "@/lib/press-articles";
import {
  mediaPageYoutubeVideos,
  trendHotIssueVideo,
} from "@/lib/youtube-videos";
import { staticPageSeo } from "@/lib/seo/page-seo";

export const metadata: Metadata = createPageMetadata(staticPageSeo.media);

export default function MediaPage() {
  const articles = getAllPressArticles();

  return (
    <PageContainer>
      <PageContentSection
        h1="언론·활동"
        breadcrumbs={[
          { label: "홈", href: "/" },
          { label: "언론·활동" },
        ]}
        currentPath="/media"
        intro="안윤정 법무사의 대외 활동과 언론 보도를 소개합니다. 기업·공공기관과의 법률 지원 협력, 정책 자문 참여, 생활 법률 강의, 방송 출연과 언론 기사 등 법률 전문가로서 지역과 사회에 기여하는 활동을 이어가고 있습니다."
        relatedLinks={[
          { href: "/about", label: "법무사 소개" },
          { href: "/부산법률전문가", label: "안윤정 법무사 활동 전체 보기" },
          { href: "/법률강의", label: "법률 강의·특강" },
          { href: "/전세사기예방교육", label: "전세사기 예방교육" },
          { href: "/강의문의", label: "강의 문의" },
          { href: "/office", label: "사무소 소개" },
          { href: "/blog", label: "블로그" },
          { href: "/contact", label: "상담 신청" },
        ]}
      >
        <div className="space-y-8">
          <section
            id="media-video"
            className="section-anchor scroll-mt-[calc(var(--header-height)+1rem)] card-surface p-5 md:p-8"
          >
            <h2 className="section-heading">영상</h2>
            <p className="mt-2 text-sm text-navy/65">
              서울경제TV ‘조영구의 트렌드 핫이슈’ 출연 영상과 사무소 안내, 박문각 합격 인터뷰 영상입니다.
            </p>
            <div className="mt-6">
              <YoutubeVideoSection
                videos={mediaPageYoutubeVideos}
                featuredId={trendHotIssueVideo.id}
                layout="grid"
                variant="light"
              />
            </div>
            <p className="mt-6 text-center">
              <Link
                href={getPressArticleHref("sentv-trend-hot-issue-ahn-yoonjung")}
                className="inline-flex min-h-10 items-center text-sm font-semibold text-navy-light underline-offset-4 hover:underline"
              >
                방송 출연 내용 자세히 보기 →
              </Link>
            </p>
          </section>

          {lawyerActivitySections
            .filter((section) => section.id !== "education")
            .flatMap((section, index) => {
              const blocks = [
                <ActivitySectionBlock
                  key={section.id}
                  section={section}
                  imagePosition={index % 2 === 0 ? "left" : "right"}
                  paginated={section.id === "external"}
                />,
              ];

              if (section.id === "external") {
                blocks.push(<LecturesSection key="lectures" />);
              }

              return blocks;
            })}

          <section
            id="press"
            className="section-anchor scroll-mt-[calc(var(--header-height)+1rem)] card-surface p-5 md:p-8"
          >
            <h2 className="section-heading">언론보도</h2>
            <p className="mt-2 text-sm text-navy/65">
              다옴법무사사무소 안윤정 법무사 관련 언론 보도와 기사입니다.
            </p>
            <div className="mt-6">
              <PaginatedPressGrid articles={articles} />
            </div>
          </section>
        </div>
      </PageContentSection>
    </PageContainer>
  );
}
