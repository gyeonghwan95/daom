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
        intro="네이버 플레이스에 남겨 주신 방문자 후기는 공식 플레이스 페이지에서 전체 확인하실 수 있습니다. 상속·등기·회생 등 실제 의뢰인 후기를 네이버에서 바로 읽어보세요."
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

        <section
          id="review-guide"
          className="section-anchor scroll-mt-[calc(var(--header-height)+1rem)] mt-12 border-t border-beige-dark pt-10 md:mt-16 md:pt-12"
        >
          <h2 className="section-heading">후기 안내</h2>
          <p className="body-text mt-3 max-w-3xl text-navy/75">
            사이트에는 최신 후기 일부만 미리보기로 보여 드립니다. 전체 후기·사진
            후기·사업자 답글은 네이버 플레이스에서 확인하실 수 있습니다.
          </p>
        </section>
      </PageContentSection>
    </PageContainer>
  );
}
