import type { Metadata } from "next";
import { PageContainer } from "@/components/layout/PageContainer";
import { SiteImage } from "@/components/media/SiteImage";
import { ContactBox } from "@/components/sections/ContactBox";
import { PageContentSection } from "@/components/page/PageContentSection";
import { createPageMetadata } from "@/lib/metadata";
import { siteImages } from "@/lib/site-images";
import { staticPageSeo } from "@/lib/seo/page-seo";

export const metadata: Metadata = createPageMetadata(staticPageSeo.contact);

export default function ContactPage() {
  return (
    <PageContainer>
      <PageContentSection
        h1="상담 문의"
        breadcrumbs={[
          { label: "홈", href: "/" },
          { label: "상담" },
        ]}
        currentPath="/contact"
        coverImage={siteImages.contact.consult}
        intro="상속·등기·회생 등 법률 문제로 고민이 있으시면 다옴법무사사무소 안윤정 법무사에게 연락해 주세요. 전화, 카카오톡, 네이버 톡톡 중 편한 방법으로 상담하실 수 있으며, 사무소 방문은 예약 후 이용해 주세요."
        relatedLinks={[
          { href: "/location", label: "오시는 길" },
          { href: "/services", label: "업무안내" },
          { href: "/faq", label: "자주 묻는 질문" },
          { href: "/office", label: "사무소 소개" },
        ]}
        showConsultationCTA={false}
      >
        <div className="grid gap-8 lg:grid-cols-5 lg:gap-10">
          <div className="lg:col-span-3">
            <ContactBox />
          </div>
          <aside className="hidden lg:col-span-2 lg:block">
            <div className="sticky top-24 space-y-4">
              <SiteImage
                {...siteImages.contact.consult}
                className="overflow-hidden rounded-2xl border border-beige-dark shadow-sm"
              />
              <SiteImage
                {...siteImages.office.exterior}
                className="overflow-hidden rounded-2xl border border-beige-dark shadow-sm"
              />
            </div>
          </aside>
        </div>
      </PageContentSection>
    </PageContainer>
  );
}
