import type { StationSectionContent } from "@/data/seo/station-section-content";
import type { BusanRailStation } from "@/data/geo/busan-rail-stations";
import Link from "next/link";

type Props = {
  station: BusanRailStation;
  content: StationSectionContent;
};

/**
 * 역세권 안내 블록 — SSR HTML에 포함.
 * 숨김 키워드·역명 나열 금지. 실제 안내 문장만.
 */
export function StationServiceSection({ station, content }: Props) {
  const id = station.stationSectionId ?? `station-${station.id}`;
  return (
    <section
      id={id}
      className="section-anchor scroll-mt-[calc(var(--header-height)+1rem)] border-t border-beige-dark/80 pt-8"
    >
      <p className="text-xs font-medium uppercase tracking-wide text-navy/45">
        {station.lines.join(" · ")}
        {station.transfer ? " · 환승" : ""}
        {station.district ? ` · ${station.district}` : ""}
      </p>
      <h2 className="section-heading mt-2">{content.heading}</h2>
      <div className="readability-prose mt-4 space-y-3 text-[0.9375rem] leading-relaxed text-navy/85">
        <p>{content.intro}</p>
        <p>{content.localContext}</p>
        <p>{content.nextStep}</p>
      </div>
      {content.checklist && content.checklist.length > 0 ? (
        <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-navy/80">
          {content.checklist.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : null}
      {content.faq ? (
        <div className="mt-5 rounded-xl border border-beige-dark bg-beige/30 px-4 py-3 text-sm">
          <p className="font-semibold text-navy">{content.faq.question}</p>
          <p className="mt-1 text-navy/75">{content.faq.answer}</p>
        </div>
      ) : null}
      <ul className="mt-5 flex flex-wrap gap-2">
        {content.serviceLinks.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="inline-flex min-h-10 items-center rounded-lg border border-beige-dark bg-white px-3 py-2 text-sm font-medium text-navy hover:border-navy/25"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
