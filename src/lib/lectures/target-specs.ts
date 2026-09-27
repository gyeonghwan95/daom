import {
  busanHubContent,
  busanHubSpec,
  enterpriseContent,
  enterpriseSpec,
  universityContent,
  universitySpec,
} from "@/lib/lectures/content-speaker-reset-b1";
import {
  careerContent,
  careerSpec,
  highSchoolContent,
  highSchoolSpec,
} from "@/lib/lectures/content-speaker-reset-b2";
import {
  jeonseContent,
  jeonseSpec,
  lifeLawContent,
  lifeLawSpec,
  speakerContent,
  speakerSpec,
} from "@/lib/lectures/content-speaker-reset-b3";
import { normalizeRouteSlug } from "@/lib/seo/slug";
import type { LecturePageContent } from "@/lib/lectures/types";
import type { LectureTargetSpec } from "@/lib/lectures/target-types";

export const lectureTargetSpecs: LectureTargetSpec[] = [
  busanHubSpec,
  enterpriseSpec,
  universitySpec,
  careerSpec,
  highSchoolSpec,
  jeonseSpec,
  lifeLawSpec,
  speakerSpec,
];

/** content.ts의 기존 target 객체를 대체하는 페이지 콘텐츠 */
export const lectureTargetContents: Record<string, LecturePageContent> = {
  법률강의: lifeLawContent,
  부산법률강사: busanHubContent,
  전세사기예방교육: jeonseContent,
  기업법률교육: enterpriseContent,
  강사소개: speakerContent,
  학교법률교육: highSchoolContent,
  법무사진로특강: careerContent,
};

/** 기존에 없던 신규 target 페이지 */
export const newLectureTargetContents: LecturePageContent[] = [universityContent];

const specBySlug = new Map(
  lectureTargetSpecs.map((spec) => [spec.path.slice(1), spec] as const),
);

export function getLectureTargetSpec(slugOrPath: string): LectureTargetSpec | undefined {
  const slug = normalizeRouteSlug(slugOrPath.replace(/^\//, ""));
  return specBySlug.get(slug);
}

export function getLectureTargetOgImage(path: string) {
  const photo = getLectureTargetSpec(path)?.photos[0];
  if (!photo) return undefined;
  return {
    src: photo.src,
    alt: photo.alt,
    width: photo.width,
    height: photo.height,
  };
}
