import { encodePublicSrc } from "@/lib/encode-public-src";
import { imagePaths, siteImages, type SiteImageAsset } from "@/lib/site-images";

export const HOME_HERO_SLIDE_MS = 4000;
export const HOME_HERO_VIDEO_MAX_MS = 8000;

type HomeHeroImageItem = {
  id: string;
  kind: "image";
  title: string;
  alt: string;
  src: string;
  width: number;
  height: number;
};

type HomeHeroFileVideoItem = {
  id: string;
  kind: "video";
  source: "file";
  title: string;
  alt: string;
  src: string;
  poster: string;
  startSeconds?: number;
  endSeconds?: number;
};

export type HomeHeroMediaItem = HomeHeroImageItem | HomeHeroFileVideoItem;

function fromImage(
  image: SiteImageAsset,
  index: number,
  title: string,
): HomeHeroImageItem {
  return {
    id: `image-${index}-${image.src}`,
    kind: "image",
    title,
    alt: image.alt,
    src: image.src,
    width: image.width,
    height: image.height,
  };
}

function fromFileVideo({
  src,
  title,
  alt,
  poster,
}: {
  src: string;
  title: string;
  alt: string;
  poster: string;
}): HomeHeroFileVideoItem {
  return {
    id: `file-${src}`,
    kind: "video",
    source: "file",
    title,
    alt,
    src: encodePublicSrc(src),
    poster: encodePublicSrc(poster),
  };
}

const stageImages = siteImages.home.heroStageSlides;

/** 재생목록·현재 재생 제목 — 1줄에 들어가게 짧게 */
const STAGE_TITLES = [
  "상담 협의",
  "위촉장",
  "사무소 정면",
  "전세사기 특강",
  "부산등기국",
  "전화 상담",
  "사무소 내부",
  "사무소 전경",
  "사무소 명패",
] as const;

/**
 * 사진 원본 순서는 heroStageSlides 고정. 리스트에서는 사무소 정면을 빼고,
 * 법무사 소개 영상을 맨 앞에 둔다.
 */
export const homeHeroMediaPlaylist: readonly HomeHeroMediaItem[] = [
  fromFileVideo({
    src: "/video/법무사소개.mp4",
    title: "법무사 소개",
    alt: "안윤정 법무사 소개 영상",
    poster: imagePaths.thumbPortraitFront,
  }),
  fromImage(stageImages[0], 0, STAGE_TITLES[0]),
  fromFileVideo({
    src: "/video/사무소소개.mp4",
    title: "사무소 소개",
    alt: "다옴법무사사무소 소개 영상",
    poster: imagePaths.stockLegalOffice,
  }),
  fromImage(stageImages[1], 1, STAGE_TITLES[1]),
  fromFileVideo({
    src: "/video/MBC뉴스인터뷰.mp4",
    title: "MBC 인터뷰",
    alt: "부산 MBC NEWS 전문가 출연",
    poster: imagePaths.pressMbcInterview,
  }),
  fromImage(stageImages[3], 3, STAGE_TITLES[3]),
  fromFileVideo({
    src: "/video/강의진행.mp4",
    title: "강의 진행",
    alt: "법률 강의 진행 영상",
    poster: imagePaths.activityYouthSpace,
  }),
  fromImage(stageImages[4], 4, STAGE_TITLES[4]),
  fromImage(stageImages[5], 5, STAGE_TITLES[5]),
  fromImage(stageImages[6], 6, STAGE_TITLES[6]),
  fromImage(stageImages[7], 7, STAGE_TITLES[7]),
  fromImage(stageImages[8], 8, STAGE_TITLES[8]),
];
