"use client";

import Link from "next/link";
import { trackB2BEvent } from "@/lib/analytics/track-b2b";
import type { EngagementCard, PartnerCard } from "@/lib/b2b/types";

type PartnerTypeGridProps = {
  cards: PartnerCard[];
  sourcePage: string;
};

export function PartnerTypeGrid({ cards, sourcePage }: PartnerTypeGridProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {cards.map((card) => (
        <Link
          key={card.id}
          href={card.href}
          onClick={() =>
            trackB2BEvent("b2b_partner_select", {
              source_page: sourcePage,
              partner_type: card.id,
            })
          }
          className="group rounded-xl border border-beige-dark bg-white p-4 transition-colors hover:border-navy/30 hover:bg-beige/20 md:p-5"
        >
          <h3 className="text-base font-semibold text-navy group-hover:underline md:text-lg">
            {card.title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-navy/75">
            {card.description}
          </p>
        </Link>
      ))}
    </div>
  );
}

type EngagementTypeSelectorProps = {
  cards: EngagementCard[];
  sourcePage: string;
};

export function EngagementTypeSelector({
  cards,
  sourcePage,
}: EngagementTypeSelectorProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card) => (
        <Link
          key={card.id}
          href={card.href}
          onClick={() =>
            trackB2BEvent("b2b_service_select", {
              source_page: sourcePage,
              service_type: card.id,
            })
          }
          className="rounded-xl border border-beige-dark bg-beige/25 p-4 transition-colors hover:bg-beige/50 md:p-5"
        >
          <h3 className="text-sm font-semibold text-navy md:text-base">
            {card.title}
          </h3>
          <p className="mt-1.5 text-xs leading-relaxed text-navy/70 md:text-sm">
            {card.description}
          </p>
        </Link>
      ))}
    </div>
  );
}
