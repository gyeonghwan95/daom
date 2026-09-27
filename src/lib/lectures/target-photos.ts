import { imagePaths } from "@/lib/site-images";
import type { LectureTargetPhoto } from "@/lib/lectures/target-types";

/** 실제 강의 현장 사진만 사용한다. 생성 이미지·합성 이미지는 넣지 않는다. */
export const targetPhotos = {
  citizenWeek1: {
    src: imagePaths.lectureCitizenLibraryWeek1,
    alt: "부산광역시립시민도서관 생활법률 특강 1회차에서 등기부등본 보는 법을 설명하는 안윤정 법무사",
    caption: "부산광역시립시민도서관 생활법률 특강 1회차 · 전·월세계약 (2026.06) 실제 현장",
    width: 966,
    height: 725,
  },
  citizenWeek2: {
    src: imagePaths.lectureCitizenLibraryWeek2,
    alt: "부산광역시립시민도서관 생활법률 특강 2회차 생활 분쟁 예방 강의 현장",
    caption: "부산광역시립시민도서관 생활법률 특강 2회차 · 생활 분쟁 예방 (2026.06) 실제 현장",
    width: 966,
    height: 609,
  },
  citizenWeek3: {
    src: imagePaths.lectureCitizenLibraryWeek3,
    alt: "부산광역시립시민도서관 생활법률 특강 3회차 디지털·형사 예방 강의 현장",
    caption: "부산광역시립시민도서관 생활법률 특강 3회차 · 디지털·형사 예방 (2026.06) 실제 현장",
    width: 966,
    height: 747,
  },
  youthSpace: {
    src: imagePaths.activityYouthSpace,
    alt: "해운대청년채움공간에서 청년 대상으로 강의하는 안윤정 법무사",
    caption:
      "해운대청년채움공간 청년 대상 출강 현장. 기업 사내 강연 사진은 기관 동의가 확인된 경우에만 게시합니다.",
    width: 966,
    height: 543,
  },
  haeundaeJobCafe: {
    src: imagePaths.lectureHaeundaeSuyeongDongnae,
    alt: "해운대 청년 JOB성장카페에서 청년 대상 전세계약·등기부 강의를 하는 안윤정 법무사",
    caption:
      "해운대 청년 JOB성장카페 청년 대상 전세계약·등기부 강의 현장. 대학교 내부 강의 사진이 아닙니다.",
    width: 966,
    height: 725,
  },
  moneyDispute: {
    src: imagePaths.lectureMoneyPropertyDispute,
    alt: "해운대·수영·동래 청년 대상 돈·부동산·관계 분쟁 예방 특강 현장",
    caption: "해운대·수영·동래 청년 대상 돈·부동산·관계 분쟁 예방 특강 (2026.01) 실제 현장",
    width: 966,
    height: 725,
  },
  yangsan: {
    src: imagePaths.lectureYangsanHighSchool,
    alt: "양산제일고등학교 학생들에게 법무사 진로특강을 하는 안윤정 법무사",
    caption: "양산제일고등학교 법무사 진로특강 (2026.05.21) 실제 현장",
    width: 966,
    height: 725,
  },
  mistakeCrime: {
    src: imagePaths.lectureMistakeCrime,
    alt: "청년 대상 ‘실수로 범죄가 되는 순간들’ 생활법률 강의 현장",
    caption:
      "청년 대상 ‘실수로 범죄가 되는 순간들’ 강의 (2025.08) 실제 현장. 고등학교 내부 사진이 아닙니다.",
    width: 966,
    height: 724,
  },
  selfSupportJeonse: {
    src: imagePaths.lectureBusanSelfSupportJeonse,
    alt: "부산광역시 자립지원전담기관 전세사기 예방 특강 현장",
    caption: "부산광역시 자립지원전담기관 전세사기 예방 특강 (2026.05.22) 실제 현장",
    width: 966,
    height: 725,
  },
  changwon: {
    src: imagePaths.lectureChangwonYouthVision,
    alt: "창원청년비전센터 청년 생활법률 특강 현장",
    caption: "창원청년비전센터 청년 생활법률 특강 (2026.07.02) 실제 현장",
    width: 966,
    height: 544,
  },
} satisfies Record<string, LectureTargetPhoto>;
