import Link from "next/link";
import { SiteImage } from "@/components/media/SiteImage";
import type { SiteImageAsset } from "@/lib/site-images";

type CaseCardProps = {
  title: string;
  summary: string;
  category?: string;
  href?: string;
  image?: SiteImageAsset;
};

export function CaseCard({
  title,
  summary,
  category,
  href,
  image,
}: CaseCardProps) {
  const content = (
    <>
      {image && (
        <div className="relative aspect-[16/10] overflow-hidden border-b border-beige-dark">
          <SiteImage
            {...image}
            fill
            variant="thumbnail"
            sizes="(max-width: 640px) 100vw, 400px"
            className="h-full w-full"
          />
        </div>
      )}
      <div className={image ? "p-5 md:p-6" : ""}>
        {category && (
          <span className="inline-block rounded-md bg-beige px-2.5 py-1 text-sm font-semibold text-[var(--text-secondary)]">
            {category}
          </span>
        )}
        <h3 className={`text-base font-bold text-[var(--text-primary)] md:text-lg ${category ? "mt-3" : ""}`}>
          {title}
        </h3>
        <p className="mt-2 text-base leading-relaxed text-[var(--text-body)]">{summary}</p>
        {href && (
          <span className="mt-3 inline-flex min-h-10 items-center text-sm font-semibold text-navy">
            사례 보기 →
          </span>
        )}
      </div>
    </>
  );

  const cardClass = image
    ? "interactive-surface card-surface group block overflow-hidden p-0 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-navy/5"
    : "interactive-surface card-surface block p-5 hover:bg-beige/50 hover:shadow-lg hover:shadow-navy/5 md:p-6";

  if (href) {
    return (
      <Link href={href} className={cardClass}>
        {content}
      </Link>
    );
  }

  return <article className={cardClass}>{content}</article>;
}
