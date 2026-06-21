"use client";

import Link from "next/link";
import { ShowcaseImageCard } from "@/components/home/ShowcaseImageCard";
import { InfiniteMarquee } from "@/components/motion/InfiniteMarquee";
import {
  lawyerExternalActivities,
  lawyerExternalActivitiesIntro,
} from "@/lib/lawyer-activities";

export function AboutExternalActivitiesMarquee() {
  return (
    <section
      id="external"
      className="section-anchor scroll-mt-[calc(var(--header-height)+1rem)] card-surface overflow-hidden p-5 md:p-8"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0 max-w-2xl">
          <h2 className="section-heading">{lawyerExternalActivitiesIntro.title}</h2>
          <p className="mt-3 text-base leading-relaxed text-navy/75">
            {lawyerExternalActivitiesIntro.subtitle}
          </p>
        </div>
        <Link
          href="/media"
          className="shrink-0 text-sm font-semibold text-navy-light underline-offset-4 transition-colors hover:text-navy hover:underline"
        >
          대외활동 더보기 →
        </Link>
      </div>

      <div className="relative mt-6 -mx-5 overflow-hidden md:-mx-8">
        <InfiniteMarquee speed={50} direction="left" className="px-5 md:px-8">
          {lawyerExternalActivities.map((item) => (
            <ShowcaseImageCard
              key={item.id}
              variant="activity"
              image={{
                src: item.image.src,
                alt: item.image.alt,
                placeholder: item.image.placeholder,
              }}
              category={item.category}
              title={item.title}
              subtitle={item.subtitle}
              meta={item.period}
            />
          ))}
        </InfiniteMarquee>
      </div>
    </section>
  );
}
