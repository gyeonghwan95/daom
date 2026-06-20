import Link from "next/link";
import { SiteImage } from "@/components/media/SiteImage";
import type { SiteImageAsset } from "@/lib/site-images";

type BlogCardProps = {
  title: string;
  excerpt: string;
  href: string;
  date?: string;
  image?: SiteImageAsset;
};

export function BlogCard({ title, excerpt, href, date, image }: BlogCardProps) {
  return (
    <Link
      href={href}
      className="card-surface group block overflow-hidden p-0 transition-all duration-300 hover:-translate-y-1 hover:border-navy/20 hover:shadow-lg hover:shadow-navy/5"
    >
      {image && (
        <div className="relative aspect-[16/10] overflow-hidden border-b border-beige-dark">
          <SiteImage
            {...image}
            fill
            sizes="(max-width: 640px) 100vw, 400px"
            className="h-full w-full transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      )}
      <div className="p-5 md:p-6">
        {date && (
          <span className="text-sm font-medium text-navy-light">{date}</span>
        )}
        <h2 className="mt-1 text-base font-semibold text-navy md:text-lg">
          {title}
        </h2>
        <p className="mt-2 text-base leading-relaxed text-navy/75">{excerpt}</p>
        <span className="mt-3 inline-flex min-h-10 items-center text-sm font-medium text-navy-light">
          읽어보기 →
        </span>
      </div>
    </Link>
  );
}
