import { imagePaths } from "@/lib/site-images";
import { getVerifiedLectureHistory } from "@/data/lectures/history";

export type SpeakerGalleryItem = {
  id: string;
  src: string;
  title: string;
  institution: string;
  alt: string;
};

export type SpeakerHistoryLine = {
  id: string;
  title: string;
  institution: string;
  href?: string;
};

/**
 * public/image/강의-* 파일을 강의 제목·기관과 매칭한 갤러리.
 * 현장 사진이 많아 보이도록 회차·주제별로 나열합니다.
 */
export const speakerLectureGallery: SpeakerGalleryItem[] = [
  {
    id: "self-support",
    src: imagePaths.lectureBusanSelfSupportJeonse,
    title: "전세사기 예방 특강",
    institution: "부산광역시 자립지원전담기관",
    alt: "부산광역시 자립지원전담기관 전세사기 예방교육 현장",
  },
  {
    id: "citizen-w1",
    src: imagePaths.lectureCitizenLibraryWeek1,
    title: "생활법률 특강 1회차",
    institution: "부산광역시립시민도서관",
    alt: "부산광역시립시민도서관 생활법률 특강 1회차 현장",
  },
  {
    id: "citizen-w2",
    src: imagePaths.lectureCitizenLibraryWeek2,
    title: "생활법률 특강 2회차",
    institution: "부산광역시립시민도서관",
    alt: "부산광역시립시민도서관 생활법률 특강 2회차 현장",
  },
  {
    id: "citizen-w3",
    src: imagePaths.lectureCitizenLibraryWeek3,
    title: "생활법률 특강 3회차",
    institution: "부산광역시립시민도서관",
    alt: "부산광역시립시민도서관 생활법률 특강 3회차 현장",
  },
  {
    id: "citizen-w4",
    src: imagePaths.lectureCitizenLibraryWeek4,
    title: "생활법률 특강 4회차",
    institution: "부산광역시립시민도서관",
    alt: "부산광역시립시민도서관 생활법률 특강 4회차 현장",
  },
  {
    id: "four-week",
    src: imagePaths.lectureFourWeekComplete,
    title: "전세사기·생활분쟁 예방 4주 과정",
    institution: "부산광역시립시민도서관",
    alt: "생활법률 4주 특강 현장",
  },
  {
    id: "changwon",
    src: imagePaths.lectureChangwonYouthVision,
    title: "청년 생활법률 특강",
    institution: "창원청년비전센터",
    alt: "창원청년비전센터 청년 생활법률 교육 현장",
  },
  {
    id: "yangsan",
    src: imagePaths.lectureYangsanHighSchool,
    title: "법무사 진로특강",
    institution: "양산제일고",
    alt: "양산제일고등학교 법무사 진로특강 현장",
  },
  {
    id: "haeundae",
    src: imagePaths.lectureHaeundaeSuyeongDongnae,
    title: "전세계약·등기부 확인 특강",
    institution: "해운대 청년 JOB성장카페",
    alt: "해운대 청년 대상 전세사기 예방 강의 현장",
  },
  {
    id: "money-dispute",
    src: imagePaths.lectureMoneyPropertyDispute,
    title: "돈·부동산·관계 분쟁 예방",
    institution: "청년·기관 출강",
    alt: "청년 대상 돈·부동산·관계 분쟁 예방 강의 현장",
  },
  {
    id: "jeonse-legal",
    src: imagePaths.lectureJeonseLegalEducation,
    title: "전세사기 예방 법률교육",
    institution: "청년·기관 출강",
    alt: "전세사기 예방 법률 교육 특강 현장",
  },
  {
    id: "youth-sought",
    src: imagePaths.lectureYouthMostSoughtJeonse,
    title: "청년 전세사기 예방 강의",
    institution: "청년·기관 출강",
    alt: "청년 전세사기 예방 강의 현장",
  },
  {
    id: "youth-jeonse",
    src: imagePaths.lectureYouthJeonsePrevention,
    title: "청년 전세사기 예방특강",
    institution: "청년·기관 출강",
    alt: "부산 청년 전세사기 예방특강 현장",
  },
  {
    id: "online",
    src: imagePaths.lectureOnlineSurvival,
    title: "디지털 법률 가이드",
    institution: "청년·기관 출강",
    alt: "청년 대상 디지털·온라인 법률 가이드 강의 현장",
  },
  {
    id: "vaccine",
    src: imagePaths.lectureJeonseVaccination,
    title: "전세사기 예방접종 특강",
    institution: "청년·기관 출강",
    alt: "청년 전세사기 예방 오프라인 강의 현장",
  },
  {
    id: "mistake",
    src: imagePaths.lectureMistakeCrime,
    title: "실수로 범죄가 되는 순간들",
    institution: "청년·기관 출강",
    alt: "청년 대상 생활 속 형사 리스크 예방 강의 현장",
  },
  {
    id: "law-essential",
    src: imagePaths.lectureLawEssential,
    title: "법 없이도 살 수 없어요",
    institution: "청년·기관 출강",
    alt: "청년 대상 생활법률 기초 강의 현장",
  },
  {
    id: "housing",
    src: imagePaths.lectureHousingContractGuide,
    title: "주거계약 실전 가이드",
    institution: "청년·기관 출강",
    alt: "청년 주거계약 실전 가이드 강의 현장",
  },
];

/** 강사소개용 간단 이력(제목 — 기관) */
export function getSpeakerHistoryLines(): SpeakerHistoryLine[] {
  return getVerifiedLectureHistory().map((entry) => ({
    id: entry.id,
    title: entry.shortTitle ?? entry.title,
    institution: entry.institution,
    href: `/강의이력/${entry.slug}`,
  }));
}
