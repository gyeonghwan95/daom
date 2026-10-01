import Link from "next/link";
import Image from "next/image";
import type { PressArticle } from "@/lib/press-articles";
import { getPressArticleHref } from "@/lib/press-articles";

type PressCardProps = {
  article: PressArticle;
};

export function PressCard({ article }: PressCardProps) {
  const metaExtra = article.topic ?? article.reporter;

  return (
    <Link
      href={getPressArticleHref(article.slug)}
      className="card-surface group flex h-full flex-col overflow-hidden p-0 transition-all duration-300 hover:-translate-y-1 hover:border-navy/20 hover:shadow-lg hover:shadow-navy/5"
    >
      <div className="relative aspect-[16/10] overflow-hidden border-b border-beige-dark bg-beige">
        <Image
          src={article.image.src}
          alt={article.image.alt}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 767px) 50vw, (max-width: 1279px) 33vw, 25vw"
        />
        <span className="absolute bottom-2 left-2 max-w-[calc(100%-1rem)] truncate rounded-full bg-white/90 px-2 py-0.5 text-[0.6875rem] font-semibold text-navy backdrop-blur-sm sm:bottom-3 sm:left-3 sm:px-3 sm:py-1 sm:text-xs">
          {article.source}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-3 sm:p-4 md:p-5">
        <h3 className="line-clamp-3 text-sm font-semibold leading-snug text-navy group-hover:text-navy-light md:text-base">
          {article.title}
        </h3>
        <p className="mt-1.5 line-clamp-2 text-xs text-navy/60 md:text-sm">
          {article.publishedAtDisplay}
          {metaExtra ? ` · ${metaExtra}` : ""}
        </p>
        <span className="mt-auto inline-flex min-h-9 items-end pt-2 text-xs font-medium text-navy-light md:text-sm">
          기사 보기 →
        </span>
      </div>
    </Link>
  );
}
