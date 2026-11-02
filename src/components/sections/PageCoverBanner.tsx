import { MediaFrame } from "@/components/media/MediaFrame";
import type { SiteImageAsset } from "@/lib/site-images";
import { getActualImageSize } from "@/lib/seo/share-image";

type PageCoverBannerProps = {
  image: SiteImageAsset;
  className?: string;
  priority?: boolean;
};

/**
 * 본문 시작 표지 이미지 — 원본 비율을 지킨다(PC는 넓은 틀 가운데, 양옆 흐린 배경).
 * 등록된 width·height가 실제 파일과 다른 이미지가 있어 크기 표의 실제 값을 먼저 쓴다.
 * 서버 컴포넌트 — 클라이언트 화면에는 서버에서 렌더해 넘긴다(크기 표를 번들에 싣지 않는다).
 */
export function PageCoverBanner({
  image,
  className = "",
  priority = false,
}: PageCoverBannerProps) {
  const size = getActualImageSize(image.src) ?? {
    width: image.width || 1200,
    height: image.height || 900,
  };
  return (
    <div className={`page-cover-banner ${className}`.trim()}>
      <MediaFrame
        src={image.src}
        alt={image.alt}
        width={size.width}
        height={size.height}
        priority={priority}
        quality={72}
      />
    </div>
  );
}
