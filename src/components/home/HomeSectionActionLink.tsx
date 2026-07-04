import Link from "next/link";

function isExternalHref(href: string): boolean {
  return href.startsWith("http://") || href.startsWith("https://");
}

type HomeSectionActionLinkProps = {
  href: string;
  label: string;
  dark?: boolean;
  variant?: "text" | "button";
};

export function HomeSectionActionLink({
  href,
  label,
  dark = false,
  variant = "text",
}: HomeSectionActionLinkProps) {
  const textClassName = `inline-flex min-h-11 shrink-0 cursor-pointer items-center text-sm font-semibold underline-offset-4 transition-colors hover:underline ${
    dark ? "text-white/75 hover:text-white" : "text-navy-light hover:text-navy"
  }`;

  const buttonClassName = dark
    ? "inline-flex min-h-10 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-white/30 bg-white/10 px-4 text-sm font-semibold text-white transition-all duration-200 hover:border-white/50 hover:bg-white/15 active:scale-[0.99]"
    : "btn-secondary min-h-10 shrink-0 px-4 text-sm";

  const className = variant === "button" ? buttonClassName : textClassName;
  const children = variant === "button" ? label : `${label} →`;

  if (isExternalHref(href)) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}
