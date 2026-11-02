import Link from "next/link";
import { getPageHeroThumbnail } from "@/data/seo/page-og-thumbnails";
import { MediaFrame } from "@/components/media/MediaFrame";
import { shouldShowLeadNationwideNote } from "@/lib/nationwide/show-region-chip";
import { PAGE_THUMB_SIZE } from "@/lib/seo/page-thumbnail-size";

/** 본문 시작 4:3 썸네일이 있는 페이지 — 기존 표지 배너·1:1 대표 이미지·히어로 옆 사진을 겹쳐 두지 않는 데 쓴다 */
export function hasPageLeadThumbnail(path: string): boolean {
  return Boolean(getPageHeroThumbnail(path));
}

type PageLeadThumbnailProps = {
  path: string;
  /** 있으면 그대로 쓰고, 없으면 경로로 전국 가능 업무인지 판정한다 */
  nationwide?: boolean;
  slug?: string;
  serviceSlug?: string;
};

/**
 * 페이지 시작 대표 썸네일(4:3, 가운데 훅 문구).
 * 전국·비대면 가능 페이지에만 지역 무관 비용 문의 한 줄을 둔다.
 * 서버 컴포넌트 — 1,500여 페이지 맵은 브라우저 번들에 넣지 않는다(next.config.ts alias).
 */
export function PageLeadThumbnail({
  path,
  nationwide,
  slug,
  serviceSlug,
}: PageLeadThumbnailProps) {
  const hero = getPageHeroThumbnail(path);
  if (!hero) return null;
  const showNote =
    nationwide ?? shouldShowLeadNationwideNote(path, slug, serviceSlug);
  return (
    <div className="page-lead-thumbnail mb-7 w-full md:mb-9">
      {/* 문구가 구워진 4:3 원본 — 어떤 화면에서도 자르지 않는다 */}
      <MediaFrame
        src={hero.src}
        alt={hero.alt}
        width={PAGE_THUMB_SIZE.width}
        height={PAGE_THUMB_SIZE.height}
        priority
      />
      {showNote ? (
        <p className="mt-4 break-keep text-[0.95rem] leading-relaxed text-navy/80 md:text-base">
          <strong className="font-semibold text-navy">부산이 아니어도 괜찮습니다.</strong>{" "}
          대부분의 업무는 방문 없이 전국 어디서나 진행합니다. 맡길지 정하기 전에{" "}
          <Link
            href="/contact/inquiry"
            prefetch={false}
            data-cta="lead-cost-inquiry"
            className="font-semibold text-navy underline decoration-[#c9a86a] decoration-2 underline-offset-[5px] transition-colors hover:decoration-navy"
          >
            비용만 먼저 편하게 물어보세요
          </Link>
          .
        </p>
      ) : null}
    </div>
  );
}
