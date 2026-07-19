import Link from "next/link";
import { NationwideServiceNotice } from "@/components/nationwide/NationwideServiceNotice";
import { PageDataTemplate } from "@/components/page-data/PageDataTemplate";
import { nationwideServiceCards } from "@/lib/nationwide";
import type { PageData } from "@/lib/pageData/types";
import type { NationwideServiceType } from "@/lib/nationwide";

type NationwidePageViewProps = {
  page: PageData;
  noticeType: NationwideServiceType;
  ctaLabel?: string;
  showServiceCards?: boolean;
};

export function NationwidePageView({
  page,
  noticeType,
  ctaLabel,
  showServiceCards = false,
}: NationwidePageViewProps) {
  return (
    <PageDataTemplate
      page={page}
      heroAddon={
        <NationwideServiceNotice type={noticeType} ctaLabel={ctaLabel} />
      }
    >
      {showServiceCards ? (
        <section className="space-y-4" aria-label="전국 업무 카드">
          <h2 className="section-heading">업무별 전국 처리 유형</h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {nationwideServiceCards.map((card) => (
              <li key={card.id}>
                <Link
                  href={card.href}
                  className="flex h-full flex-col rounded-xl border border-beige-dark bg-white p-4 no-underline shadow-sm transition-colors hover:bg-beige/30"
                >
                  <span className="text-base font-semibold text-navy">
                    {card.name}
                  </span>
                  <span className="mt-1 text-xs font-medium text-navy/55">
                    {card.typeLabel} · {card.visitLabel}
                  </span>
                  <span className="mt-2 text-sm leading-relaxed text-navy/75">
                    {card.summary}
                  </span>
                  <span className="mt-3 text-xs leading-relaxed text-navy/60">
                    신청 관할: {card.jurisdictionNote}
                  </span>
                  <span className="mt-2 text-xs text-navy/55">
                    준비서류 예: {card.documents.slice(0, 2).join(", ")}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </PageDataTemplate>
  );
}
