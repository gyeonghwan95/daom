import Link from "next/link";

function isExternalHref(href: string): boolean {
  return href.startsWith("http://") || href.startsWith("https://");
}

type HomeSectionActionLinkProps = {
  href: string;
  label: string;
  dark?: boolean;
};

export function HomeSectionActionLink({
  href,
  label,
  dark = false,
}: HomeSectionActionLinkProps) {
  const className = `inline-flex min-h-11 shrink-0 cursor-pointer items-center text-sm font-semibold underline-offset-4 transition-colors hover:underline ${
    dark ? "text-white/75 hover:text-white" : "text-navy-light hover:text-navy"
  }`;

  if (isExternalHref(href)) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {label} →
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {label} →
    </Link>
  );
}
