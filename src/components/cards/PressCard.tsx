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
      className="card-surface group block overflow-hidden p-0 transition-all duration-300 hover:-translate-y-1 hover:border-navy/20 hover:shadow-lg hover:shadow-navy/5"
    >
      <div className="relative aspect-[16/9] overflow-hidden border-b border-beige-dark bg-beige md:aspect-[3/2]">
        <Image
          src={article.image.src}
          alt={article.image.alt}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, 50vw"
        />
        <span className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-navy backdrop-blur-sm md:text-sm">
          {article.source}
        </span>
      </div>
      <div className="p-5 md:p-7">
        <h3 className="line-clamp-2 text-lg font-semibold leading-snug text-navy group-hover:text-navy-light md:text-xl">
          {article.title}
        </h3>
        <p className="mt-2 text-sm text-navy/60 md:text-base">
          {article.publishedAtDisplay}
          {metaExtra ? ` · ${metaExtra}` : ""}
        </p>
        <span className="mt-4 inline-flex min-h-10 items-center text-sm font-medium text-navy-light md:text-base">
          기사 보기 →
        </span>
      </div>
    </Link>
  );
}
