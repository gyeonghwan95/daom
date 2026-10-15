import { getPageGallery, galleryImageSrc } from "@/data/seo/page-gallery-cards";
import { encodePublicSrc } from "@/lib/encode-public-src";
import { optimizedSrcSet } from "@/lib/image-variants";

/**
 * 대표 페이지 본문 갤러리 — 1:1 이미지 4장(실제 사무소·법무사 사진 + 가운데 제목).
 * 검색 수집기가 원본 JPG를 바로 읽도록 img src는 원본, 브라우저는 <source>의 WebP 파생본을 쓴다.
 * 이미지 속 문구는 alt·figcaption에 같은 뜻으로 넣는다. 등록되지 않은 경로는 아무것도 그리지 않는다.
 */
export function PageGallery({ path, className = "" }: { path: string; className?: string }) {
  const gallery = getPageGallery(path);
  if (!gallery) return null;
  return (
    <section aria-labelledby="page-gallery-title" className={`my-8 md:my-10 ${className}`.trim()}>
      <h2 id="page-gallery-title" className="text-lg font-bold text-navy md:text-xl">
        한눈에 보는 {gallery.topic}
      </h2>
      <ul className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        {gallery.items.map((item) => {
          const src = encodePublicSrc(galleryImageSrc(item.file));
          const srcSet = optimizedSrcSet(galleryImageSrc(item.file));
          return (
            <li key={item.file}>
              <figure className="overflow-hidden rounded-xl border border-beige-dark bg-white shadow-sm">
                <picture>
                  {srcSet ? (
                    <source type="image/webp" srcSet={srcSet} sizes="(max-width: 768px) 50vw, 270px" />
                  ) : null}
                  <img
                    src={src}
                    alt={`${item.title} - ${gallery.topic}: ${item.sub}`}
                    width={1200}
                    height={1200}
                    loading="lazy"
                    decoding="async"
                    className="block aspect-square h-auto w-full"
                  />
                </picture>
                <figcaption className="border-t border-beige-dark bg-cream/80 px-3 py-2 text-xs leading-snug text-navy/80 md:text-sm">
                  <strong className="block font-semibold text-navy">{item.title}</strong>
                  {item.sub}
                </figcaption>
              </figure>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
