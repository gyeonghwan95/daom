import Link from "next/link";
import { SiteImage } from "@/components/media/SiteImage";
import type { CaseRecord } from "@/lib/cases/types";
import { getCaseImage } from "@/lib/site-images";

type CaseExplorerCardProps = {
  record: CaseRecord;
};

export function CaseExplorerCard({ record }: CaseExplorerCardProps) {
  const image = getCaseImage(record.slug);

  return (
    <Link
      href={record.href}
      className="interactive-surface card-surface group block overflow-hidden p-0 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-navy/5"
    >
      <div className="relative aspect-[16/10] overflow-hidden border-b border-beige-dark">
        <SiteImage
          {...image}
          fill
          variant="thumbnail"
          sizes="(max-width: 640px) 100vw, 400px"
          className="h-full w-full"
        />
      </div>
      <div className="p-5 md:p-6">
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-navy px-2.5 py-1 text-xs font-semibold text-white">
            {record.caseCategory}
          </span>
          <span className="rounded-full bg-beige px-2.5 py-1 text-xs font-medium text-navy-light">
            {record.region}
          </span>
        </div>
        {record.situationTags.length > 0 ? (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {record.situationTags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-md border border-navy/10 bg-cream/60 px-2 py-0.5 text-[0.7rem] font-medium text-navy/65"
              >
                {tag}
              </span>
            ))}
          </div>
        ) : null}
        <h3 className="mt-3 text-base font-semibold text-navy group-hover:text-navy-dark md:text-lg">
          {record.title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-navy/75">{record.description}</p>
        <span className="mt-3 inline-flex min-h-10 items-center text-sm font-medium text-navy-light">
          사례 보기 →
        </span>
      </div>
    </Link>
  );
}
