import type { BusinessCredentialRecord } from "@/lib/business-credentials";
import { formatCredentialExpiry } from "@/lib/business-credentials";

type ExpiryDisplay = "date-or-valid" | "consult" | "none";

type BusinessCredentialTrustPanelProps = {
  credentials: BusinessCredentialRecord[];
  title: string;
  body: string;
  /** 검색어(인증)와 공식 문서명 구분 안내 — 페이지당 최대 1회 */
  showSearchNameNote?: boolean;
  /**
   * date-or-valid: 검증된 유효기간 또는 ‘현재 유효’
   * consult: 유효기간·제출은 상담 시 안내 (미검증 메타용)
   * none: 유효기간 줄 생략
   */
  expiryDisplay?: ExpiryDisplay;
  className?: string;
};

function DocIcon() {
  return (
    <svg
      className="mt-0.5 h-5 w-5 shrink-0 text-navy/50"
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

function expiryLine(
  item: BusinessCredentialRecord,
  mode: ExpiryDisplay,
): string | null {
  if (mode === "none") return null;
  if (mode === "consult") {
    return "유효기간·제출은 협업·계약 상담 시 안내";
  }
  if (item.showExpiryPublicly && item.validUntil) {
    return `유효기간: ${formatCredentialExpiry(item.validUntil)}`;
  }
  return "현재 유효";
}

export function BusinessCredentialTrustPanel({
  credentials,
  title,
  body,
  showSearchNameNote = false,
  expiryDisplay = "date-or-valid",
  className = "",
}: BusinessCredentialTrustPanelProps) {
  if (credentials.length === 0) return null;

  return (
    <section
      id="business-credentials"
      aria-labelledby="business-credentials-heading"
      className={`section-anchor scroll-mt-[calc(var(--header-height)+1rem)] rounded-2xl border border-beige-dark bg-cream/30 p-5 sm:p-6 md:p-8 ${className}`.trim()}
    >
      <h2
        id="business-credentials-heading"
        className="section-heading text-xl md:text-2xl"
      >
        {title}
      </h2>
      <p className="body-text mt-3 max-w-3xl text-navy/80">{body}</p>

      {showSearchNameNote ? (
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-navy/60">
          일반적으로 여성기업 인증, 중소기업 인증, 창업기업 인증이라고도
          검색하지만 공식 문서명은 각각 여성기업확인서, 중소기업확인서,
          창업기업확인서입니다.
        </p>
      ) : null}

      <ul className="mt-6 grid gap-3 sm:grid-cols-3">
        {credentials.map((item) => {
          const expiry = expiryLine(item, expiryDisplay);
          return (
            <li
              key={item.id}
              className="flex min-h-[7.5rem] gap-3 rounded-xl border border-beige-dark/80 bg-white p-4"
            >
              <DocIcon />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-navy">
                  {item.shortLabel}
                </p>
                <p className="mt-1 text-sm text-navy/75">
                  {item.officialName} 보유
                </p>
                {expiry ? (
                  <p className="mt-2 text-xs text-navy/55">{expiry}</p>
                ) : null}
                <p className="mt-2 text-xs leading-relaxed text-navy/50">
                  {item.description}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
