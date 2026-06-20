import Link from "next/link";
import { VisitNoticeBanner } from "@/components/contact/VisitNoticeBanner";
import { CopyAddressButton } from "@/components/contact/CopyAddressButton";
import { ConsultationButtons } from "@/components/consultation/ConsultationButtons";
import { ConsultationFeeNotice } from "@/components/consultation/ConsultationFeeNotice";
import { consultationCopy, getInquiryForms } from "@/lib/consultation";
import {
  getContactInfo,
  getDirectConsultationChannels,
  getPhoneHref,
} from "@/lib/contact";
import {
  getNaverMapSearchUrl,
  officeLocation,
} from "@/lib/office-location";
import { siteConfig } from "@/lib/site";

export function ContactBox() {
  const { phone, kakao, naverTalk } = getContactInfo();
  const channels = getDirectConsultationChannels();
  const inquiryForms = getInquiryForms();

  return (
    <div className="space-y-6">
      <VisitNoticeBanner />

      <section className="card-surface bg-beige p-5 sm:p-6 md:p-8">
        <h2 className="section-heading">빠른 상담</h2>
        <p className="mt-3 text-sm leading-relaxed text-navy/75 sm:text-base">
          {consultationCopy.default}
        </p>
        <p className="mt-2 text-sm font-medium text-navy/80">
          전화 · 카카오톡 · 네이버 톡톡 중 편한 방법을 선택해 주세요.
        </p>
        <div className="mt-5">
          <ConsultationButtons channels={channels} theme="light" layout="grid" />
        </div>
        <ConsultationFeeNotice className="mt-4" />
      </section>

      <section className="card-surface p-5 sm:p-6 md:p-8">
        <h2 className="section-heading">연락처</h2>
        <dl className="mt-4 space-y-4 text-base text-navy/80">
          <div>
            <dt className="font-semibold text-navy">사무소명</dt>
            <dd className="mt-1">{siteConfig.name}</dd>
          </div>
          <div>
            <dt className="font-semibold text-navy">담당 법무사</dt>
            <dd className="mt-1">{siteConfig.representative}</dd>
          </div>
          <div>
            <dt className="font-semibold text-navy">전화 상담</dt>
            <dd className="mt-1">
              <a
                href={getPhoneHref(phone)}
                className="inline-flex min-h-12 items-center text-lg font-semibold text-navy-light underline-offset-2 hover:underline"
              >
                {phone}
              </a>
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-navy">카카오톡 상담</dt>
            <dd className="mt-1">
              <a
                href={kakao}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 items-center font-medium text-navy-light underline-offset-2 hover:underline"
              >
                카카오톡 채팅 열기 →
              </a>
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-navy">네이버 톡톡 상담</dt>
            <dd className="mt-1">
              <a
                href={naverTalk}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 items-center font-medium text-navy-light underline-offset-2 hover:underline"
              >
                네이버 톡톡 채팅 열기 →
              </a>
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-navy">사무소 주소</dt>
            <dd className="mt-1 leading-relaxed">{officeLocation.fullAddress}</dd>
            <dd className="mt-1 text-sm text-navy/65">{officeLocation.accessSummary}</dd>
            <dd className="mt-3 flex flex-wrap gap-2">
              <CopyAddressButton />
              <a
                href={getNaverMapSearchUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-10 items-center rounded-lg border border-navy/15 bg-white px-3 text-sm font-medium text-navy transition-colors hover:border-navy/30 hover:bg-beige/40"
              >
                네이버 지도
              </a>
              <Link
                href="/location"
                className="inline-flex min-h-10 items-center rounded-lg border border-navy/15 bg-white px-3 text-sm font-medium text-navy transition-colors hover:border-navy/30 hover:bg-beige/40"
              >
                오시는 길
              </Link>
            </dd>
          </div>
        </dl>
      </section>

      <section className="card-surface border-dashed border-navy/15 p-5 sm:p-6 md:p-8">
        <h2 className="section-heading">온라인 문의 양식</h2>
        <p className="mt-3 text-sm leading-relaxed text-navy/75 sm:text-base">
          {consultationCopy.inquiryNotice}
        </p>

        {inquiryForms.length > 0 ? (
          <ul className="mt-4 space-y-2">
            {inquiryForms.map((form) => (
              <li key={form.provider}>
                <a
                  href={form.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-12 w-full items-center justify-center rounded-xl border-2 border-beige-muted bg-white px-4 text-sm font-semibold text-navy hover:border-navy-light hover:bg-beige sm:w-auto sm:px-6 sm:text-base"
                >
                  {form.label} →
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-navy/60">
            문의 양식 URL은 .env.local에 NEXT_PUBLIC_INQUIRY_FORM_GOOGLE,
            NEXT_PUBLIC_INQUIRY_FORM_TALLY, NEXT_PUBLIC_INQUIRY_FORM_NAVER 중
            하나 이상을 설정하면 연결됩니다. 사이트에는 문의 내용을 저장하지
            않습니다.
          </p>
        )}
      </section>
    </div>
  );
}
