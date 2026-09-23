import Image from "next/image";
import Link from "next/link";
import type { RelatedCardItem } from "@/lib/seo/page-visuals";
import type { TextPosition } from "@/data/seo/page-visuals";

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

type ContentThumbnailCardProps = {
  item: RelatedCardItem;
  priority?: boolean;
};

function overlayClass(pos?: TextPosition): string {
  switch (pos) {
    case "right":
      return "items-center justify-end bg-gradient-to-l from-navy/55 via-navy/25 to-transparent pr-[11%] pl-[28%] text-right";
    case "top":
    case "center-high":
      return "items-start justify-center bg-gradient-to-b from-navy/55 via-navy/20 to-transparent pt-[12%] pb-[40%] text-center";
    case "bottom":
    case "center-low":
      return "items-end justify-center bg-gradient-to-t from-navy/60 via-navy/25 to-transparent pb-[12%] pt-[40%] text-center";
    case "left":
    default:
      return "items-center justify-start bg-gradient-to-r from-navy/55 via-navy/25 to-transparent pl-[11%] pr-[28%] text-left";
  }
}

/**
 * 1:1 카드 — 사진은 bake 없이, headline은 HTML overlay.
 */
export function ContentThumbnailCard({
  item,
  priority = false,
}: ContentThumbnailCardProps) {
  const categoryKo =
    (item.category && CATEGORY_LABEL_KO[item.category]) || undefined;
  const lines = (item.headline ?? item.title).split(/\n/).filter(Boolean);

  return (
    <li className="w-[78%] min-w-[78%] snap-start sm:w-[42%] sm:min-w-[42%] lg:w-[28%] lg:min-w-[28%] xl:w-[23%] xl:min-w-[23%]">
      <Link
        href={item.href}
        data-related-content="card"
        data-target-page={item.href}
        data-category={item.category ?? ""}
        className="group block h-full overflow-hidden rounded-[14px] border border-[var(--border,#e5e0d8)] bg-white shadow-[0_1px_2px_rgba(21,42,69,0.04)] transition-[transform,box-shadow] duration-200 hover:shadow-[0_6px_18px_rgba(21,42,69,0.08)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--navy,#1e3a5f)] motion-safe:hover:scale-[1.02] motion-reduce:transition-none motion-reduce:hover:scale-100"
      >
        <article className="relative">
          <div className="relative aspect-square w-full overflow-hidden bg-[#f0ebe3]">
            <Image
              src={item.image}
              alt=""
              width={720}
              height={720}
              sizes="(max-width: 640px) 78vw, (max-width: 1024px) 42vw, 23vw"
              loading={priority ? "eager" : "lazy"}
              decoding="async"
              className="h-full w-full object-cover"
            />
            <div
              className={`pointer-events-none absolute inset-0 flex ${overlayClass(item.textPosition)}`}
              aria-hidden="true"
            >
              <span className="max-w-[12rem] text-[1.05rem] font-extrabold leading-snug tracking-tight text-white drop-shadow-sm sm:text-[1.15rem]">
                {lines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </span>
            </div>
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
        </article>
      </Link>
    </li>
  );
}
