import { VisitNoticeBanner } from "@/components/contact/VisitNoticeBanner";
import { ConsultationButtons } from "@/components/consultation/ConsultationButtons";
import { NaverIcon } from "@/components/consultation/ConsultationIcons";
import { ConsultationFeeNotice } from "@/components/consultation/ConsultationFeeNotice";
import { consultationCopy, getInquiryForms } from "@/lib/consultation";
import { getDirectConsultationChannels, getNaverReservationUrl } from "@/lib/contact";

export function ContactBox() {
  const channels = getDirectConsultationChannels();
  const inquiryForms = getInquiryForms();
  const naverReservationUrl = getNaverReservationUrl();

  return (
    <div className="space-y-6">
      <VisitNoticeBanner />

      <section className="card-surface overflow-hidden bg-beige p-5 sm:p-6 md:p-8">
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

      <section className="card-surface overflow-hidden">
        <div className="border-b border-beige-dark bg-beige/40 px-5 py-4 sm:px-6 md:px-8">
          <h2 className="section-heading">온라인 문의 · 예약</h2>
        </div>

        <div className="space-y-5 p-5 sm:p-6 md:p-8">
          <p className="text-sm leading-relaxed text-navy/75 sm:text-base">
            {consultationCopy.inquiryNotice}
          </p>

          <a
            href={naverReservationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#03C75A] px-5 text-sm font-semibold text-white transition-opacity hover:opacity-90 sm:text-base"
          >
            <NaverIcon className="h-5 w-5 shrink-0" />
            네이버 예약 이동 →
          </a>

          {inquiryForms.length > 0 && (
            <div className="space-y-2 border-t border-beige-dark pt-5">
              <p className="text-sm font-medium text-navy/70">기타 문의 양식</p>
              <ul className="space-y-2">
                {inquiryForms.map((form) => (
                  <li key={form.provider}>
                    <a
                      href={form.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-12 w-full items-center justify-center rounded-xl border-2 border-beige-muted bg-white px-4 text-sm font-semibold text-navy transition-colors hover:border-navy-light hover:bg-beige sm:w-auto sm:px-6 sm:text-base"
                    >
                      {form.label} →
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
