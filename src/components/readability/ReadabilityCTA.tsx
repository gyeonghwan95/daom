import Link from "next/link";

type ReadabilityCTAProps = {
  title: string;
  description: string;
  href?: string;
  buttonLabel?: string;
};

export function ReadabilityCTA({
  title,
  description,
  href = "/contact",
  buttonLabel = "내 상황에 맞게 상담하기",
}: ReadabilityCTAProps) {
  return (
    <aside className="readability-cta">
      <h2 className="readability-cta__title">{title}</h2>
      <p className="readability-cta__description">{description}</p>
      <Link
        href={href}
        className="btn-primary readability-cta__button"
        data-cta="contact"
      >
        {buttonLabel}
      </Link>
    </aside>
  );
}
