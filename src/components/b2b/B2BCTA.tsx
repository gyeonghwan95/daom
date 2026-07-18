import Link from "next/link";

type B2BCTAProps = {
  title?: string;
  description: string;
  primary: { href: string; label: string };
  secondary?: { href: string; label: string };
};

export function B2BCTA({
  title = "다음 단계",
  description,
  primary,
  secondary,
}: B2BCTAProps) {
  return (
    <section className="rounded-xl border border-beige-dark bg-navy px-5 py-6 text-white md:px-8 md:py-8">
      <p className="text-xs font-semibold uppercase tracking-wide text-beige/80">
        기업·전문직
      </p>
      <h2 className="mt-2 text-xl font-semibold md:text-2xl">{title}</h2>
      <p className="mt-3 max-w-3xl text-sm leading-relaxed text-white/80 md:text-base">
        {description}
      </p>
      <div className="mt-5 flex flex-wrap gap-3">
        <Link
          href={primary.href}
          className="inline-flex min-h-12 items-center rounded-lg bg-beige px-5 font-semibold text-navy"
        >
          {primary.label}
        </Link>
        {secondary ? (
          secondary.href.startsWith("tel:") ? (
            <a
              href={secondary.href}
              className="inline-flex min-h-12 items-center rounded-lg border border-white/40 px-5 text-white"
            >
              {secondary.label}
            </a>
          ) : (
            <Link
              href={secondary.href}
              className="inline-flex min-h-12 items-center rounded-lg border border-white/40 px-5 text-white"
            >
              {secondary.label}
            </Link>
          )
        ) : null}
      </div>
    </section>
  );
}
