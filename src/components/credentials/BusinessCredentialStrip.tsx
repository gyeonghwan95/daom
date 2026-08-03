import Link from "next/link";
import type { BusinessCredentialRecord } from "@/lib/business-credentials";
import { formatCredentialExpiry } from "@/lib/business-credentials";

type BusinessCredentialStripProps = {
  credentials: BusinessCredentialRecord[];
  label: string;
  support: string;
  linkHref?: string;
  linkLabel?: string;
  className?: string;
};

function DocIcon() {
  return (
    <svg
      className="h-4 w-4 shrink-0 text-navy/55"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M7 3.5h7.5L19 8v12.5a1 1 0 01-1 1H7a1 1 0 01-1-1V4.5a1 1 0 011-1z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M14.5 3.5V8H19M9 12h6M9 15.5h6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function BusinessCredentialStrip({
  credentials,
  label,
  support,
  linkHref = "/about",
  linkLabel = "사무소 소개",
  className = "",
}: BusinessCredentialStripProps) {
  if (credentials.length === 0) return null;

  return (
    <section
      aria-label="기업확인서 보유 안내"
      className={`border-t border-beige-dark bg-cream/40 ${className}`.trim()}
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-5 sm:px-6 md:flex-row md:items-center md:justify-between md:gap-6 md:py-6">
        <div className="min-w-0 space-y-2">
          <p className="text-sm font-semibold text-navy md:text-base">{label}</p>
          <p className="text-sm leading-relaxed text-navy/70">{support}</p>
          <ul className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-navy/65 sm:text-sm">
            {credentials.map((item) => (
              <li key={item.id} className="inline-flex items-center gap-1.5">
                <DocIcon />
                <span>
                  <span className="font-medium text-navy/80">{item.shortLabel}</span>
                  <span className="sr-only"> {item.officialName} 보유</span>
                  {item.showExpiryPublicly && item.validUntil ? (
                    <span className="text-navy/45">
                      {" "}
                      · 유효 {formatCredentialExpiry(item.validUntil)}
                    </span>
                  ) : (
                    <span className="text-navy/45"> · 현재 유효</span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </div>
        {linkHref ? (
          <Link
            href={linkHref}
            className="shrink-0 text-sm font-medium text-navy underline-offset-2 hover:underline"
          >
            {linkLabel}
          </Link>
        ) : null}
      </div>
    </section>
  );
}
