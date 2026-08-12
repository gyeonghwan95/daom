import { PageContainer } from "@/components/layout/PageContainer";
import { PageContentSection } from "@/components/page/PageContentSection";
import { PublicNoticeList } from "@/components/notices/PublicNoticeList";
import { siteImages } from "@/lib/site-images";

/** Shared body for `/공지사항` and `/notices` */
export function NoticesPageView() {
  return (
    <PageContainer>
      <PageContentSection
        h1="공지사항"
        breadcrumbs={[
          { label: "홈", href: "/" },
          { label: "공지사항" },
        ]}
        currentPath="/공지사항"
        coverImage={siteImages.office.exterior}
        intro="다옴법무사사무소의 운영 안내, 휴무·일정 변경 등 공지사항을 확인하실 수 있습니다."
        relatedLinks={[
          { href: "/faq", label: "FAQ" },
          { href: "/contact", label: "상담 신청" },
          { href: "/office", label: "사무소 안내" },
          { href: "/location", label: "오시는 길" },
        ]}
      >
        <section className="section-anchor mt-2">
          <PublicNoticeList />
        </section>
      </PageContentSection>
    </PageContainer>
  );
}
