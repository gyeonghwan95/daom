import Link from "next/link";
import { InquiryNaverCtaPair } from "@/components/cta/InquiryNaverCtaPair";

type ReadabilityCTAProps = {
  title: string;
  description: string;
  href?: string;
  buttonLabel?: string;
  /** 상담 신청서 업무 분야 자동 선택 (`/contact/inquiry?field=`) */
  inquiryField?: string;
  /** 유입 페이지 slug (`from=`) */
  fromPage?: string;
  /** 확인하고 싶은 내용 (`intent=`) */
  intent?: string;
  /** false면 '안윤정 법무사는 누구일까?' 보조 버튼 숨김 */
  showAboutLawyer?: boolean;
  /** false면 네이버 예약 페어 숨김 (강의·B2B 등) */
  showNaverReservation?: boolean;
};

export function ReadabilityCTA({
  title,
  description,
  href,
  buttonLabel = "1분만에 상담 신청하기",
  inquiryField,
  fromPage,
  intent,
  showAboutLawyer = true,
  showNaverReservation = true,
}: ReadabilityCTAProps) {
  const params = new URLSearchParams();
  if (inquiryField) params.set("field", inquiryField);
  if (fromPage) params.set("from", fromPage);
  if (intent) params.set("intent", intent);
  const qs = params.toString();
  const inquiryHref = qs ? `/contact/inquiry?${qs}` : "/contact/inquiry";
  const primaryHref = href ?? inquiryHref;
  const isConsult =
    primaryHref.startsWith("/contact") || primaryHref.includes("inquiry");

  return (
    <aside className="readability-cta">
      <h2 className="readability-cta__title">{title}</h2>
      <p className="readability-cta__description">{description}</p>
      <div className="readability-cta__actions flex-col items-stretch sm:items-start">
        <InquiryNaverCtaPair
          placement="readability_cta"
          layout="row"
          size="md"
          showNaver={showNaverReservation && isConsult}
          inquiry={
            <Link
              href={primaryHref}
              className="btn-primary readability-cta__button"
              data-cta="contact"
            >
              {buttonLabel}
            </Link>
          }
        />
        {showAboutLawyer ? (
          <Link
            href="/about"
            className="btn-secondary readability-cta__button"
            data-cta="about-lawyer"
          >
            안윤정 법무사는 누구일까?
          </Link>
        ) : null}
      </div>
    </aside>
  );
}
