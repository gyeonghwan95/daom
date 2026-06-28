import Link from "next/link";
import { SiteImage } from "@/components/media/SiteImage";
import type { SiteImageAsset } from "@/lib/site-images";

type BlogCardProps = {
  title: string;
  excerpt: string;
  href: string;
  date?: string;
  image?: SiteImageAsset;
  external?: boolean;
};

export function BlogCard({
  title,
  excerpt,
  href,
  date,
  image,
  external = false,
}: BlogCardProps) {
  const className =
    "interactive-surface card-surface group block overflow-hidden p-0 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-navy/5";

  const content = (
    <>
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
        <h3 className="mt-1 text-base font-semibold text-navy md:text-lg">
          {title}
        </h3>
        <p className="mt-2 text-base leading-relaxed text-navy/75">{excerpt}</p>
        <span className="mt-3 inline-flex min-h-10 items-center text-sm font-medium text-navy-light">
          {external ? "네이버 블로그에서 보기 →" : "읽어보기 →"}
        </span>
      </div>
    </>
  );

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {content}
    </Link>
  );
}
