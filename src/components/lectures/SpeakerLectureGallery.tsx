import Image from "next/image";
import Link from "next/link";
import { InfiniteMarquee } from "@/components/motion/InfiniteMarquee";
import {
  speakerLectureGallery,
  type SpeakerGalleryItem,
} from "@/lib/lectures/speaker-media";

type SpeakerLectureGalleryProps = {
  /** 상단 임팩트용으로 제목 없이 사진만 */
  compact?: boolean;
  dualRow?: boolean;
};

export function SpeakerLectureGallery({
  compact = false,
  dualRow = true,
}: SpeakerLectureGalleryProps) {
  const gallery = [
    ...speakerLectureGallery,
    ...speakerLectureGallery.slice(0, 6),
  ];
  const reverse = [...gallery].reverse();

  return (
    <div className="space-y-3">
      {!compact ? (
        <div className="flex flex-wrap items-end justify-between gap-2 px-1">
          <div>
            <p className="text-sm font-semibold text-navy md:text-base">
              실제 강의 현장
            </p>
            <p className="mt-1 text-sm text-navy/65">
              도서관·청년기관·학교 등 확인된 출강 사진입니다.
            </p>
          </div>
          <Link
            href="/media#lectures"
            className="text-sm font-medium text-navy underline-offset-2 hover:underline"
          >
            사진 더 보기
          </Link>
        </div>
      ) : null}
      <div className="-mx-4 space-y-3 overflow-hidden md:mx-0">
        <InfiniteMarquee speed={62} direction="left" className="px-4 md:px-0">
          {gallery.map((item, index) => (
            <LecturePhotoCard
              key={`row-a-${item.id}-${index}`}
              item={item}
              compact={compact}
            />
          ))}
        </InfiniteMarquee>
        {dualRow ? (
          <InfiniteMarquee
            speed={72}
            direction="right"
            className="px-4 md:px-0"
          >
            {reverse.map((item, index) => (
              <LecturePhotoCard
                key={`row-b-${item.id}-${index}`}
                item={item}
                compact={compact}
              />
            ))}
          </InfiniteMarquee>
        ) : null}
      </div>
    </div>
  );
}

function LecturePhotoCard({
  item,
  compact,
}: {
  item: SpeakerGalleryItem;
  compact?: boolean;
}) {
  return (
    <figure
      className={`shrink-0 overflow-hidden rounded-2xl border border-beige-dark bg-white shadow-sm ${
        compact ? "w-[11rem] sm:w-[13rem]" : "w-[14rem] sm:w-[16rem]"
      }`}
    >
      <div className="relative aspect-[4/3] bg-beige">
        <Image
          src={item.src}
          alt={item.alt}
          fill
          className="object-cover"
          sizes="256px"
        />
      </div>
      {!compact ? (
        <figcaption className="space-y-0.5 px-3 py-2.5">
          <p className="truncate text-sm font-medium text-navy">{item.title}</p>
          <p className="truncate text-xs text-navy/55">{item.institution}</p>
        </figcaption>
      ) : null}
    </figure>
  );
}
