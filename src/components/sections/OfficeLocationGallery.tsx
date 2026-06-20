import Image from "next/image";
import { officeLocation } from "@/lib/office-location";
import { siteImages } from "@/lib/site-images";

export function OfficeLocationGallery({
  showParking = true,
  showDirections = true,
}: {
  showParking?: boolean;
  showDirections?: boolean;
}) {
  const { map, direction01, direction02, parking } = siteImages.office;

  return (
    <div className="space-y-8">
      <figure>
        <h2 className="section-heading">위치 지도</h2>
        <p className="mt-2 text-sm text-navy/65">
          {officeLocation.fullAddress} · {officeLocation.accessSummary}
        </p>
        <div className="relative mt-4 overflow-hidden rounded-xl border border-beige-dark bg-white">
          <Image
            src={map.src}
            alt={map.alt}
            width={map.width}
            height={map.height}
            className="h-auto w-full"
            sizes="(max-width: 768px) 100vw, 720px"
            priority
          />
          {map.placeholder && (
            <span className="absolute left-3 top-3 rounded-full bg-navy/75 px-2.5 py-1 text-[10px] font-semibold text-white">
              임시
            </span>
          )}
        </div>
      </figure>

      {showDirections && (
        <figure>
          <h2 className="section-heading">사무소 찾아오시는 길</h2>
          <p className="mt-2 text-sm text-navy/65">
            건물 입구와 사무소 위치를 단계별로 안내합니다.
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {[direction01, direction02].map((image) => (
              <div
                key={image.src}
                className="relative overflow-hidden rounded-xl border border-beige-dark bg-white"
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={image.width}
                  height={image.height}
                  className="h-auto w-full"
                  sizes="(max-width: 640px) 100vw, 360px"
                />
                {image.placeholder && (
                  <span className="absolute left-3 top-3 rounded-full bg-navy/75 px-2.5 py-1 text-[10px] font-semibold text-white">
                    임시
                  </span>
                )}
              </div>
            ))}
          </div>
        </figure>
      )}

      {showParking && (
        <figure>
          <h2 className="section-heading">주차 안내</h2>
          <p className="mt-2 text-sm text-navy/65">
            방문 전 주차 위치를 확인해 주세요. 자세한 안내가 필요하시면 전화로 문의해 주세요.
          </p>
          <div className="relative mt-4 overflow-hidden rounded-xl border border-beige-dark bg-white">
            <Image
              src={parking.src}
              alt={parking.alt}
              width={parking.width}
              height={parking.height}
              className="h-auto w-full"
              sizes="(max-width: 768px) 100vw, 720px"
            />
            {parking.placeholder && (
              <span className="absolute left-3 top-3 rounded-full bg-navy/75 px-2.5 py-1 text-[10px] font-semibold text-white">
                임시
              </span>
            )}
          </div>
        </figure>
      )}
    </div>
  );
}
