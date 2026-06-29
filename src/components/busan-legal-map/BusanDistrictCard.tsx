import Link from "next/link";
import { LawyerConsultationGuide } from "@/components/consultation/LawyerConsultationGuide";
import type { BusanDistrictDef } from "@/lib/busan-legal-map/types";

type BusanDistrictCardProps = {
  district: BusanDistrictDef;
};

export function BusanDistrictCard({ district }: BusanDistrictCardProps) {
  return (
    <article className="interactive-surface flex h-full flex-col rounded-2xl border border-navy/10 bg-gradient-to-br from-white via-cream/25 to-beige/35 p-5 shadow-[0_4px_24px_rgba(26,39,68,0.05)] sm:p-6">
      <header>
        <div className="flex flex-wrap items-start justify-between gap-2">
          <h2 className="text-lg font-semibold text-navy sm:text-xl">{district.label}</h2>
          <Link
            href={district.hubPath}
            className="rounded-full bg-navy px-3 py-1 text-xs font-semibold text-white hover:bg-navy-dark"
          >
            지역 허브 →
          </Link>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-navy/70">{district.context}</p>
      </header>

      <div className="mt-4">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-navy-light">
          가까운 생활권
        </p>
        <p className="mt-1.5 text-sm text-navy/75">{district.neighborhoods.join(" · ")}</p>
      </div>

      <div className="mt-4">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-navy-light">
          많이 찾는 업무
        </p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {district.commonServices.map((service) => (
            <span
              key={service}
              className="rounded-md border border-navy/10 bg-white px-2.5 py-1 text-xs font-medium text-navy/75"
            >
              {service}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-navy-light">
          관련 키워드
        </p>
        <p className="mt-1.5 text-sm leading-relaxed text-navy/65">
          {district.keywords.join(", ")}
        </p>
      </div>

      <div className="mt-5 flex-1 space-y-4">
        <div>
          <p className="mb-2 text-sm font-semibold text-navy">관련 서비스·지역 안내</p>
          <ul className="grid gap-1.5 sm:grid-cols-2">
            {district.serviceLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block rounded-lg border border-beige-dark bg-white/80 px-3 py-2 text-sm font-medium text-navy hover:bg-beige/40"
                >
                  {link.label} →
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="mb-2 text-sm font-semibold text-navy">관련 상황별 문제</p>
          <ul className="grid gap-1.5">
            {district.situationLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block rounded-lg border border-beige-dark bg-cream/50 px-3 py-2 text-sm text-navy/80 hover:bg-beige/40"
                >
                  {link.label} →
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-5 border-t border-beige-dark pt-4">
        <Link
          href="/contact"
          className="interactive-surface flex min-h-11 w-full items-center justify-center rounded-xl bg-navy px-4 text-sm font-semibold text-white hover:bg-navy-dark"
        >
          {district.label} 상담 문의
        </Link>
      </div>
    </article>
  );
}
