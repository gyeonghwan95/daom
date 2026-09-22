import Image from "next/image";
import Link from "next/link";
import type { ThumbnailCardItem } from "@/lib/seo/page-thumbnails";

const CATEGORY_LABEL_KO: Record<string, string> = {
  inheritance: "상속",
  realestate: "부동산",
  corporate: "법인",
  rehabilitation: "회생·파산",
  lease: "임대차",
  lecture: "강의",
  local: "지역",
  office: "사무소",
  services: "업무",
  civil: "민사",
};

type ThumbnailCardProps = {
  item: ThumbnailCardItem;
  priority?: boolean;
};

/**
 * 1:1 에디토리얼 썸네일 카드.
 * 이미지 내부 headline이 있으므로 하단에는 짧은 pageTitle만 노출.
 * 접근성·SEO용 실제 링크 텍스트는 title로 유지.
 */
export function ThumbnailCard({ item, priority = false }: ThumbnailCardProps) {
  const categoryKo =
    (item.category && CATEGORY_LABEL_KO[item.category]) || undefined;

  return (
    <li className="w-[78%] min-w-[78%] snap-start sm:w-[42%] sm:min-w-[42%] lg:w-[28%] lg:min-w-[28%] xl:w-[23%] xl:min-w-[23%]">
      <Link
        href={item.href}
        data-thumbnail-carousel="card"
        data-target-page={item.href}
        data-category={item.category ?? ""}
        className="group block h-full overflow-hidden rounded-[14px] border border-[var(--border,#e5e0d8)] bg-white shadow-[0_1px_2px_rgba(21,42,69,0.04)] transition-[transform,box-shadow] duration-200 hover:shadow-[0_6px_18px_rgba(21,42,69,0.08)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--navy,#1e3a5f)] motion-safe:hover:scale-[1.02] motion-reduce:transition-none motion-reduce:hover:scale-100"
      >
        <div className="relative aspect-square w-full overflow-hidden bg-[#f0ebe3]">
          <Image
            src={item.image}
            alt=""
            width={600}
            height={600}
            sizes="(max-width: 640px) 78vw, (max-width: 1024px) 42vw, 23vw"
            loading={priority ? "eager" : "lazy"}
            decoding="async"
            className="h-full w-full object-cover"
          />
        </div>
        <span className="sr-only">{item.title}</span>
        <div className="px-3 py-2.5">
          {categoryKo ? (
            <p className="text-[11px] font-medium tracking-wide text-navy/45">
              {categoryKo}
            </p>
          ) : null}
          <p
            aria-hidden="true"
            className="line-clamp-2 text-sm font-semibold leading-snug text-[var(--navy,#1e3a5f)]"
          >
            {item.title}
          </p>
        </div>
      </Link>
    </li>
  );
}
