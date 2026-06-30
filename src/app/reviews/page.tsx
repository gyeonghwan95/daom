import type { Metadata } from "next";
import { PageContainer } from "@/components/layout/PageContainer";
import { NaverReviewsSection } from "@/components/reviews/NaverReviewsSection";
import { PageContentSection } from "@/components/page/PageContentSection";
import { createPageMetadata } from "@/lib/metadata";
import { staticPageSeo } from "@/lib/seo/page-seo";

export const metadata: Metadata = createPageMetadata(staticPageSeo.reviews);

export default function ReviewsPage() {
  return (
    <PageContainer>
      <PageContentSection
        h1="고객후기"
        breadcrumbs={[
          { label: "홈", href: "/" },
          { label: "고객후기" },
        ]}
        currentPath="/reviews"
        intro="네이버 플레이스에 남겨 주신 방문자 리뷰를 모았습니다. 상속·등기·회생 등 법률 상담과 업무 진행에 대한 실제 의뢰인 후기를 확인하실 수 있습니다."
        relatedLinks={[
          { href: "/contact", label: "상담 신청" },
          { href: "/services", label: "업무안내" },
          { href: "/media", label: "언론·활동" },
          { href: "/blog", label: "블로그" },
        ]}
        showConsultationCTA
      >
        <section
          id="reviews"
          className="section-anchor scroll-mt-[calc(var(--header-height)+1rem)]"
        >
          <NaverReviewsSection />
        </section>
      </PageContentSection>
    </PageContainer>
  );
}
