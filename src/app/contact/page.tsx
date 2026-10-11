import type { Metadata } from "next";
import Link from "next/link";
import { PageContainer } from "@/components/layout/PageContainer";
import { ContactSection } from "@/components/sections/ContactSection";
import { NationwideServiceCard } from "@/components/nationwide/NationwideServiceCard";
import { ArticleVisualSlot } from "@/components/media/ArticleVisual";
import { PageContentSection } from "@/components/page/PageContentSection";
import { BusinessCredentialSlot } from "@/components/credentials/BusinessCredentialSlot";
import { InquiryNaverCtaPair } from "@/components/cta/InquiryNaverCtaPair";
import { createPageMetadata } from "@/lib/metadata";
import { siteImages } from "@/lib/site-images";
import { staticPageSeo } from "@/lib/seo/page-seo";
import { INQUIRY_RELAXED_NOTE } from "@/lib/service-conversion/copy";
import {
  CONTACT_INQUIRY_PATH,
  consultationInquiryCopy,
} from "@/lib/consultation-inquiry";

export const metadata: Metadata = createPageMetadata(staticPageSeo.contact);

export default function ContactPage() {
  return (
    <PageContainer>
      <PageContentSection
        h1="상담 문의"
        breadcrumbs={[
          { label: "홈", href: "/" },
          { label: "상담 문의" },
        ]}
        currentPath="/contact"
        intro={`상속·등기·회생 등 법률 문제로 고민이 있으시면 다옴법무사사무소 안윤정 법무사에게 연락해 주세요. 전화, 카카오톡, 네이버 톡톡 중 편한 방법으로 상담하실 수 있으며, ${consultationInquiryCopy.oneMinuteShort} 사무소 방문은 예약 후 이용해 주세요.`}
        introSideImage={siteImages.contact.top}
        relatedLinks={[
          { href: CONTACT_INQUIRY_PATH, label: consultationInquiryCopy.ctaShort },
          { href: "/location", label: "오시는 길" },
          { href: "/services", label: "업무안내" },
          { href: "/faq", label: "자주 묻는 질문" },
          { href: "/office", label: "사무소 소개" },
        ]}
        showConsultationCTA={false}
      >
        <NationwideServiceCard />
        <BusinessCredentialSlot path="/contact" slug="contact" />
        <ArticleVisualSlot path="/contact" slot="before-cta" />
        <ContactSection />
        <section
          id="inquiry-process"
          className="mt-10 scroll-mt-[calc(var(--header-height)+1rem)]"
          aria-labelledby="inquiry-process-heading"
        >
          <h2 id="inquiry-process-heading" className="section-heading">
            문의하신 뒤에는 이렇게 진행됩니다
          </h2>
          <ol className="mt-4 grid gap-3 md:grid-cols-4">
            {[
              ["상황 확인", "남겨 주신 내용으로 어떤 업무인지, 기한이 있는지 먼저 확인합니다."],
              ["범위·비용·준비사항 안내", "맡길 수 있는 업무 범위와 법무사 보수·공과금, 준비할 서류를 설명드립니다."],
              ["맡기기로 하시면 진행", "안내를 들으신 뒤 위임에 동의하시면 그때부터 서류 작성·신청을 진행합니다. 문의만으로 진행되지는 않습니다."],
              ["접수·진행·완료 안내", "접수, 보정 등 진행 상황과 완료 결과를 알려 드립니다."],
            ].map(([title, body], i) => (
              <li key={title} className="rounded-xl border border-beige-dark bg-white p-4">
                <span className="text-xs font-bold text-navy-light">{i + 1}단계</span>
                <p className="mt-1 font-semibold text-navy">{title}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-navy/75">{body}</p>
              </li>
            ))}
          </ol>
        </section>
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
            {consultationInquiryCopy.oneMinute} 이름·연락처·상담 분야·현재 상황을
            적어 보내 주시면 검토가 수월합니다. {INQUIRY_RELAXED_NOTE}
          </p>
          <div className="mt-5">
            <InquiryNaverCtaPair
              placement="contact_page"
              layout="row"
              size="md"
              inquiry={
                <Link
                  href={CONTACT_INQUIRY_PATH}
                  className="btn-primary inline-flex min-h-12 items-center px-6"
                >
                  {consultationInquiryCopy.ctaPrimary}
                </Link>
              }
            />
          </div>
        </section>
      </PageContentSection>
    </PageContainer>
  );
}
