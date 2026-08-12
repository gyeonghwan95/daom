import { Suspense } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { PageContentSection } from "@/components/page/PageContentSection";
import { PublicNoticeDetail } from "@/components/notices/PublicNoticeDetail";
import { siteImages } from "@/lib/site-images";

/** Shared body for `/공지사항/보기` and `/notices/view` */
export function NoticeDetailPageView() {
  return (
    <PageContainer>
      <PageContentSection
        h1="공지사항"
        breadcrumbs={[
          { label: "홈", href: "/" },
          { label: "공지사항", href: "/공지사항" },
          { label: "상세" },
        ]}
        currentPath="/공지사항/보기"
        coverImage={siteImages.office.exterior}
        intro="선택하신 공지의 상세 내용입니다."
        relatedLinks={[
          { href: "/공지사항", label: "공지 목록" },
          { href: "/contact", label: "상담 신청" },
        ]}
      >
        <Suspense fallback={<p className="body-text text-navy/60">불러오는 중…</p>}>
          <PublicNoticeDetail />
        </Suspense>
      </PageContentSection>
    </PageContainer>
  );
}
