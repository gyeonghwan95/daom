import Link from "next/link";

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
  return (
    <Link
      href={href}
      className={`inline-flex min-h-11 shrink-0 cursor-pointer items-center text-sm font-semibold underline-offset-4 transition-colors hover:underline ${
        dark ? "text-white/75 hover:text-white" : "text-navy-light hover:text-navy"
      }`}
    >
      {label} →
    </Link>
  );
}
