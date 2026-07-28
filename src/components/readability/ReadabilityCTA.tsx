import Link from "next/link";

type ReadabilityCTAProps = {
  title: string;
  description: string;
  href?: string;
  buttonLabel?: string;
  /** 상담 신청서 업무 분야 자동 선택 (`/contact/inquiry?field=`) */
  inquiryField?: string;
  /** false면 '안윤정 법무사는 누구일까?' 보조 버튼 숨김 */
  showAboutLawyer?: boolean;
};

export function ReadabilityCTA({
  title,
  description,
  href,
  buttonLabel = "상담 내용 남기기",
  inquiryField,
  showAboutLawyer = true,
}: ReadabilityCTAProps) {
  const inquiryHref = inquiryField
    ? `/contact/inquiry?field=${encodeURIComponent(inquiryField)}`
    : "/contact/inquiry";
  const primaryHref = href ?? inquiryHref;

  return (
    <aside className="readability-cta">
      <h2 className="readability-cta__title">{title}</h2>
      <p className="readability-cta__description">{description}</p>
      <div className="readability-cta__actions">
        <Link
          href={primaryHref}
          className="btn-primary readability-cta__button"
          data-cta="contact"
        >
          {buttonLabel}
        </Link>
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
