import type { Metadata } from "next";
import { LawyerProfileNav } from "@/components/profile/LawyerProfileNav";
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
        intro="상속·등기·전세 문제로 직접 맡겨 본 분들이 네이버 플레이스에 남긴 후기입니다. 비용을 어떻게 설명했는지, 얼마나 빨리 진행됐는지 의뢰인의 말로 확인해 보세요."
        relatedLinks={[
          { href: "/contact", label: "상담 신청" },
          { href: "/services", label: "업무안내" },
          { href: "/media", label: "언론·활동" },
          { href: "/blog", label: "블로그" },
        ]}
        showConsultationCTA
      >
        <LawyerProfileNav className="mb-6" />
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
            후기는 네이버 플레이스에서 가져와 고치지 않고 싣습니다. 새 후기가 올라오면
            다음 갱신 때 함께 반영되며, 사진 후기와 사무소 답글은 네이버 플레이스에서 볼 수
            있습니다.
          </p>
        </section>
      </PageContentSection>
    </PageContainer>
  );
}
