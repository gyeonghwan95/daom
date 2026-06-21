import Link from "next/link";
import Image from "next/image";
import type { PressArticle } from "@/lib/press-articles";
import { getPressArticleHref } from "@/lib/press-articles";

type PressCardProps = {
  article: PressArticle;
};

export function PressCard({ article }: PressCardProps) {
  return (
    <Link
      href={getPressArticleHref(article.slug)}
      className="card-surface group block overflow-hidden p-0 transition-all duration-300 hover:-translate-y-1 hover:border-navy/20 hover:shadow-lg hover:shadow-navy/5"
    >
      <div className="relative aspect-[16/10] overflow-hidden border-b border-beige-dark bg-beige">
        <Image
          src={article.image.src}
          alt={article.image.alt}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, 400px"
        />
        <span className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-navy backdrop-blur-sm">
          {article.source}
        </span>
      </div>
      <div className="p-5 md:p-6">
        <h2 className="line-clamp-2 text-base font-semibold leading-snug text-navy group-hover:text-navy-light md:text-lg">
          {article.title}
        </h2>
        <p className="mt-2 text-sm text-navy/60">
          {article.publishedAtDisplay}
          {article.reporter ? ` · ${article.reporter}` : ""}
        </p>
        <span className="mt-3 inline-flex min-h-10 items-center text-sm font-medium text-navy-light">
          기사 보기 →
        </span>
      </div>
    </Link>
  );
}
