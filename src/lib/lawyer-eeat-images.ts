/**
 * 소개(EEAT) 카드 썸네일 매핑.
 *
 * 표시 우선순위:
 * 1) public/image/소개-*.jpg 드롭인 파일 (있으면 즉시 표시)
 * 2) 기존 사이트 이미지(fallbackSrc)
 * 3) 둘 다 없으면 플레이스홀더
 *
 * 교체·추가: public/image/ 에 EEAT_DROP_IN_FILENAMES 이름으로 넣으면 됩니다.
 */

import { encodePublicSrc } from "@/lib/encode-public-src";
import { imagePaths } from "@/lib/site-images";

export type EeatThumbImage = {
  /** 드롭인 경로(percent-encoded). 파일이 있으면 이 경로를 씁니다. */
  src: string;
  alt: string;
  /** 드롭인이 없을 때 쓸 기존 이미지 */
  fallbackSrc?: string;
};

function enc(src: string): string {
  return encodePublicSrc(src);
}

function thumb(
  dropInFilename: string,
  alt: string,
  fallbackPath?: string,
): EeatThumbImage {
  return {
    src: enc(`/image/${dropInFilename}`),
    alt,
    fallbackSrc: fallbackPath ? enc(fallbackPath) : undefined,
  };
}

/** 실무경력 — title 키 */
export const eeatExperienceThumbs: Record<string, EeatThumbImage> = {
  "다옴법무사사무소 대표 법무사": thumb(
    "소개-경력-대표법무사.jpg",
    "다옴법무사사무소 대표 법무사",
    imagePaths.officeNameBadge,
  ),
  "지역 기업 법률지원": thumb(
    "소개-경력-기업법률지원.jpg",
    "명례일반산업단지 기업 법률지원 MOU",
    imagePaths.activityMou,
  ),
  "공공·청년 법률 지원": thumb(
    "소개-경력-공공청년지원.jpg",
    "LH·부산창경 공공·청년 법률 지원",
    imagePaths.activityLhCollab,
  ),
  "정책·위원 활동": thumb(
    "소개-경력-정책위원.jpg",
    "정책·위원 위촉 활동",
    imagePaths.appointmentCertificate,
  ),
  "부산교육대학교 소프트웨어교육사업단 연구원": thumb(
    "소개-경력-공공청년지원.jpg",
    "부산교육대학교 소프트웨어교육사업단",
    imagePaths.activityYouthSpace,
  ),
  "동서대학교 교수학습개발센터 연구원": thumb(
    "소개-경력-공공청년지원.jpg",
    "동서대학교 교수학습개발센터",
    imagePaths.thumbMajorBook,
  ),
};

/** 수상내역 — name 키 */
export const eeatAwardThumbs: Record<string, EeatThumbImage> = {
  "대한법무사협회장 표창": thumb(
    "소개-수상-법무사협회표창.jpg",
    "대한법무사협회장 표창",
    imagePaths.activityBarAssociationAward,
  ),
};

/** 위원 위촉 — title 키 */
export const eeatAppointmentThumbs: Record<string, EeatThumbImage> = {
  "민주평화통일자문회의 자문위원": thumb(
    "소개-위원-민주평통.jpg",
    "민주평화통일자문회의 자문위원",
    imagePaths.activityPeaceUnification,
  ),
  "부산광역시 청년정책조정위원회 전문가 자문위원": thumb(
    "소개-위원-청년정책조정.jpg",
    "부산광역시 청년정책조정위원회",
    imagePaths.activityBusanYouthPolicy,
  ),
  "기획예산처 1기 청년자문단 자문위원": thumb(
    "소개-위원-청년자문단.jpg",
    "기획예산처 청년자문단",
    imagePaths.activityYouthBudgetAdvisory,
  ),
  "해운대구구정 정책자문위원회 자문위원": thumb(
    "소개-위원-해운대정책.jpg",
    "해운대구구정 정책자문위원회",
    imagePaths.activityHaeundaePolicy,
  ),
};

/** 강의활동 — venue 키 */
export const eeatLectureThumbs: Record<string, EeatThumbImage> = {
  부산광역시립시민도서관: thumb(
    "소개-강의-시민도서관.jpg",
    "부산 시민도서관 법률 특강",
    imagePaths.lectureCitizenLibraryWeek1,
  ),
  "부산광역시 자립지원전담기관": thumb(
    "소개-강의-자립지원전담.jpg",
    "자립지원전담기관 전세사기 예방 특강",
    imagePaths.lectureBusanSelfSupportJeonse,
  ),
  "해운대 청년 JOB성장카페": thumb(
    "소개-강의-해운대청년.jpg",
    "해운대 청년채움공간 법률 강의",
    imagePaths.activityYouthSpace,
  ),
  해운대청년채움공간: thumb(
    "소개-강의-해운대청년.jpg",
    "해운대청년채움공간 법률 강의",
    imagePaths.activityYouthSpace,
  ),
  "부산청년 JOB카페": thumb(
    "소개-강의-해운대청년.jpg",
    "부산청년 JOB카페 법률 특강",
    imagePaths.activityYouthSpace,
  ),
  창원청년비전센터: thumb(
    "소개-강의-창원청년비전.jpg",
    "창원청년비전센터 법률 특강",
    imagePaths.lectureChangwonYouthVision,
  ),
  양산제일고등학교: thumb(
    "소개-강의-양산제일고.jpg",
    "양산제일고 법무사 진로특강",
    imagePaths.lectureYangsanHighSchool,
  ),
  "LH · 부산창조경제혁신센터": thumb(
    "소개-강의-LH창경.jpg",
    "LH·부산창경 법률 강의",
    imagePaths.activityLhCollab,
  ),
  "학교·기관·주민센터 등": thumb(
    "소개-강의-찾아가는교육.jpg",
    "찾아가는 생활 법률 교육",
    imagePaths.lectureLawEssential,
  ),
};

/** 언론·기고 추가 항목 — term 키 */
export const eeatPressExtraThumbs: Record<string, EeatThumbImage> = {
  "법률 칼럼·실무 사례": thumb(
    "소개-언론-법률칼럼.jpg",
    "법률 칼럼·실무 사례",
    imagePaths.stockLegalDocuments,
  ),
  "네이버 블로그": thumb(
    "소개-언론-네이버블로그.jpg",
    "네이버 블로그",
    imagePaths.homeTrust,
  ),
  "부산 MBC NEWS 전문가 출연": thumb(
    "소개-언론-법률칼럼.jpg",
    "부산 MBC NEWS 전문가 출연",
    imagePaths.stockLegalConsultation,
  ),
};

export const EEAT_DROP_IN_FILENAMES = [
  "소개-경력-대표법무사.jpg",
  "소개-경력-기업법률지원.jpg",
  "소개-경력-공공청년지원.jpg",
  "소개-경력-정책위원.jpg",
  "소개-수상-법무사협회표창.jpg",
  "소개-위원-민주평통.jpg",
  "소개-위원-청년정책조정.jpg",
  "소개-위원-청년자문단.jpg",
  "소개-위원-해운대정책.jpg",
  "소개-강의-시민도서관.jpg",
  "소개-강의-자립지원전담.jpg",
  "소개-강의-해운대청년.jpg",
  "소개-강의-창원청년비전.jpg",
  "소개-강의-양산제일고.jpg",
  "소개-강의-LH창경.jpg",
  "소개-강의-찾아가는교육.jpg",
  "소개-언론-법률칼럼.jpg",
  "소개-언론-네이버블로그.jpg",
] as const;
