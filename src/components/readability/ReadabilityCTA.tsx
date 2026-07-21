import Link from "next/link";

type ReadabilityCTAProps = {
  title: string;
  description: string;
  href?: string;
  buttonLabel?: string;
  /** false면 '안윤정 법무사는 누구일까?' 보조 버튼 숨김 */
  showAboutLawyer?: boolean;
};

export function ReadabilityCTA({
  title,
  description,
  href = "/contact",
  buttonLabel = "상담 문의하기",
  showAboutLawyer = true,
}: ReadabilityCTAProps) {
  return (
    <aside className="readability-cta">
      <h2 className="readability-cta__title">{title}</h2>
      <p className="readability-cta__description">{description}</p>
      <div className="readability-cta__actions">
        <Link
          href={href}
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
