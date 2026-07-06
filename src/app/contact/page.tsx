import type { Metadata } from "next";
import Link from "next/link";
import { PageContainer } from "@/components/layout/PageContainer";
import { ContactSection } from "@/components/sections/ContactSection";
import { PageContentSection } from "@/components/page/PageContentSection";
import { createPageMetadata } from "@/lib/metadata";
import { siteImages } from "@/lib/site-images";
import { staticPageSeo } from "@/lib/seo/page-seo";
import { INQUIRY_RELAXED_NOTE } from "@/lib/service-conversion/copy";

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
        intro="상속·등기·회생 등 법률 문제로 고민이 있으시면 다옴법무사사무소 안윤정 법무사에게 연락해 주세요. 전화, 카카오톡, 네이버 톡톡 중 편한 방법으로 상담하실 수 있으며, 사무소 방문은 예약 후 이용해 주세요."
        introSideImage={siteImages.contact.top}
        relatedLinks={[
          { href: "/contact/inquiry", label: "상담 신청서 작성" },
          { href: "/location", label: "오시는 길" },
          { href: "/services", label: "업무안내" },
          { href: "/faq", label: "자주 묻는 질문" },
          { href: "/office", label: "사무소 소개" },
        ]}
        showConsultationCTA={false}
      >
        <ContactSection />
        <section className="mt-10 rounded-xl border border-beige-dark bg-beige/25 p-5 md:p-8">
          <h2 className="section-heading">방문상담 전 준비사항</h2>
          <p className="body-text mt-3 max-w-3xl text-navy/80">
            방문 상담은 네이버 예약 후 이용해 주세요. 사전에 아래 자료를 준비하시면
            상담이 더 구체적입니다. 자료가 없어도 전화·카카오톡으로 먼저 상황을
            남기실 수 있습니다.
          </p>
          <ul className="body-text mt-4 max-w-3xl list-disc space-y-2 pl-5 text-navy/80">
            <li>등기부등본·등기사항전부증명서(해당 시)</li>
            <li>가족관계증명서·계약서(상속·매매 해당 시)</li>
            <li>기한 메모(사망일·잔금일·임원 취임일 등)</li>
            <li>신분증·연락처</li>
          </ul>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/부산법무사상담"
              className="btn-secondary inline-flex min-h-12 items-center px-6"
            >
              상담 준비 안내 보기
            </Link>
            <Link
              href="/location"
              className="btn-secondary inline-flex min-h-12 items-center px-6"
            >
              오시는 길·주차 안내
            </Link>
          </div>
        </section>
        <section className="mt-10 rounded-xl border border-beige-dark bg-beige/25 p-5 md:p-8">
          <h2 className="section-heading">상담 신청서로 문의하기</h2>
          <p className="body-text mt-3 max-w-3xl text-navy/80">
            이름·연락처·상담 분야·현재 상황을 적어 보내 주시면 검토가 수월합니다.{" "}
            {INQUIRY_RELAXED_NOTE}
          </p>
          <Link
            href="/contact/inquiry"
            className="btn-primary mt-5 inline-flex min-h-12 items-center px-6"
          >
            상담 신청서 작성하기
          </Link>
        </section>
      </PageContentSection>
    </PageContainer>
  );
}
