import { imagePaths } from "@/lib/site-images";
import type { LectureHistoryEntry } from "@/lib/lectures/types";

/**
 * 검증된 강의·특강 실적만 기재합니다.
 * 출처: lawyer-profile / lawyer-lectures / lawyer-activities / 현장 사진 / RSS(원문 링크만).
 * 네이버 본문·제목을 복제하지 않으며, 미확인 날짜·인원·시간은 비워 둡니다.
 */
export const lectureHistory: LectureHistoryEntry[] = [
  {
    id: "citizen-library-life-law",
    slug: "busan-citizen-library-life-law",
    title: "부산광역시립시민도서관 생활법률 특강",
    shortTitle: "시민도서관 생활법률 특강",
    institution: "부산광역시립시민도서관",
    institutionType: "library",
    date: "2025~2026",
    year: 2026,
    city: "부산",
    audience: "시민·성인 수강생",
    audiences: ["시민", "성인 수강생"],
    topics: [
      "전·월세계약",
      "전세사기 예방",
      "가족·금전·관계 분쟁",
      "생활 속 범죄 예방",
      "명예훼손·모욕",
      "개인정보보호",
      "온라인 범죄 예방",
    ],
    lectureCategory: ["생활법률", "전세사기·주거", "디지털 법률", "기관 맞춤형"],
    format: "성인 대상 야간 정기 특강(주차별 시리즈)",
    formatKind: "multi-session",
    summary:
      "부산광역시립시민도서관에서 진행한 성인 야간 생활법률 특강입니다. 전·월세계약, 생활 속 분쟁, 디지털·형사 예방 주제를 회차로 나누어 사례 중심으로 안내했습니다.",
    objectives: [
      "일상에서 마주치는 계약·분쟁 상황을 스스로 점검할 수 있게 돕습니다.",
      "전·월세·디지털·생활 범죄 예방의 확인 포인트를 정리합니다.",
    ],
    curriculum: [
      "전·월세계약의 기본 확인사항",
      "전세사기 예방과 서류 점검",
      "가족·금전·관계 문제의 예방과 대응 방향",
      "명예훼손·모욕·개인정보·온라인 범죄 예방",
    ],
    highlights: [
      "야간 성인 수강생 대상 연속 특강",
      "생활법률·주거·디지털 주제를 회차로 구성",
    ],
    imageSrc: imagePaths.lectureFourWeekComplete,
    images: [
      {
        src: imagePaths.lectureCitizenLibraryWeek1,
        alt: "부산광역시립시민도서관 생활법률 특강 1회차 현장",
      },
      {
        src: imagePaths.lectureCitizenLibraryWeek2,
        alt: "부산광역시립시민도서관 생활법률 특강 2회차 현장",
      },
      {
        src: imagePaths.lectureCitizenLibraryWeek3,
        alt: "부산광역시립시민도서관 생활법률 특강 3회차 현장",
      },
      {
        src: imagePaths.lectureCitizenLibraryWeek4,
        alt: "부산광역시립시민도서관 생활법률 특강 4회차 현장",
      },
    ],
    blogUrl: "https://blog.naver.com/law-yoon-91/224328590968",
    relatedLecturePages: [
      "/법률강의",
      "/전세사기예방교육",
      "/디지털법률교육",
      "/청년생활법률특강",
    ],
    featured: true,
    verified: true,
    verificationNote: "현장 사진·프로젝트 이력·블로그 원문 링크 확인",
    sourceNote:
      "lawyer-lectures 2026-06-07·2026-04-12; 시민도서관 1~4주차 이미지; RSS 224328590968",
  },
  {
    id: "self-support-jeonse-prevention",
    slug: "busan-self-support-jeonse-prevention",
    title: "부산광역시 자립지원전담기관 전세사기 예방 특강",
    shortTitle: "자립지원전담기관 전세사기 예방",
    institution: "부산광역시 자립지원전담기관",
    institutionType: "welfare",
    date: "2026-05-22",
    year: 2026,
    city: "부산",
    district: "연제구",
    audience: "청년·자립준비청년",
    audiences: ["자립준비청년", "청년"],
    topics: ["전세사기 예방", "전·월세 계약", "보증금 보호", "등기부등본 확인"],
    lectureCategory: ["전세사기·주거", "청년", "기관 맞춤형"],
    format: "청년·자립준비청년 대상 오프라인 특강",
    formatKind: "special-lecture",
    summary:
      "부산광역시 자립지원전담기관에서 자립준비청년을 대상으로 전·월세 계약과 전세사기 예방을 안내한 특강입니다. 첫 보금자리를 마련할 때 확인해야 할 계약·등기부 포인트를 중심으로 구성했습니다.",
    objectives: [
      "주거 계약 전 확인 순서를 정리합니다.",
      "등기부등본·확정일자 등 기본 점검을 안내합니다.",
    ],
    imageSrc: imagePaths.lectureBusanSelfSupportJeonse,
    images: [
      {
        src: imagePaths.lectureBusanSelfSupportJeonse,
        alt: "부산광역시 자립지원전담기관 전세사기 예방교육 강의 현장",
      },
    ],
    relatedLecturePages: [
      "/전세사기예방교육",
      "/청년생활법률특강",
      "/법률강의",
    ],
    featured: true,
    verified: true,
    verificationNote: "현장 사진·공식 프로필(2026.05.22) 확인",
    sourceNote: "프로필 PDF 2026.05.22; lawyer-track-record",
  },
  {
    id: "self-support-daily-dispute-survival",
    slug: "busan-self-support-daily-dispute-survival",
    title: "부산광역시 자립지원전담기관 일상분쟁 생존법 특강",
    shortTitle: "자립지원전담기관 일상분쟁 생존법",
    institution: "부산광역시 자립지원전담기관",
    institutionType: "welfare",
    date: "2026-07-24",
    year: 2026,
    city: "부산",
    audience: "청년·자립준비청년",
    audiences: ["자립준비청년", "청년"],
    topics: ["일상분쟁", "생활법률", "계약", "분쟁 예방"],
    lectureCategory: ["생활법률", "청년", "기관 맞춤형"],
    format: "청년·자립준비청년 대상 오프라인 특강",
    formatKind: "special-lecture",
    summary:
      "일상에서 자주 마주치는 분쟁 상황을 예방·대응 관점에서 정리한 특강입니다. 계약·금전·관계 이슈의 확인 포인트를 사례 중심으로 안내했습니다.",
    relatedLecturePages: ["/청년생활법률특강", "/법률강의"],
    featured: true,
    verified: true,
    verificationNote: "공식 프로필(2026.07.24) 확인",
    sourceNote: "프로필 PDF 2026.07.24; lawyer-track-record",
  },
  {
    id: "haeundae-startup-law-2026-07",
    slug: "haeundae-youth-space-startup-law-2026-07",
    title: "해운대청년채움공간 창업법률 특강",
    shortTitle: "해운대청년채움공간 창업법률",
    institution: "해운대청년채움공간",
    institutionType: "youth-center",
    date: "2026-07-16",
    year: 2026,
    city: "부산",
    district: "해운대구",
    audience: "청년·예비창업자",
    audiences: ["청년", "예비창업자"],
    topics: ["창업법률", "계약", "법인", "분쟁 예방"],
    lectureCategory: ["창업·기업", "청년", "기관 맞춤형"],
    format: "청년·예비창업자 대상 오프라인 특강",
    formatKind: "special-lecture",
    summary:
      "해운대청년채움공간에서 창업 과정에서 확인해야 할 계약·법인·분쟁 예방 포인트를 안내한 특강입니다.",
    imageSrc: imagePaths.activityYouthSpace,
    relatedLecturePages: ["/창업법률교육", "/청년생활법률특강", "/법률강의"],
    featured: true,
    verified: true,
    verificationNote: "공식 프로필(2026.07.16) 확인",
    sourceNote: "프로필 PDF 2026.07.16; lawyer-track-record",
  },
  {
    id: "changwon-youth-vision-center",
    slug: "changwon-youth-vision-center",
    title: "창원청년비전센터 청년 생활법률 특강",
    shortTitle: "창원청년비전센터 생활법률",
    institution: "창원청년비전센터",
    institutionType: "youth-center",
    date: "2026-07-02",
    year: 2026,
    city: "창원",
    audience: "청년",
    audiences: ["청년"],
    topics: [
      "청년 생활법률",
      "전월세 계약",
      "금전분쟁",
      "계약",
      "온라인 법률문제",
      "일상 분쟁 예방",
    ],
    lectureCategory: ["청년", "생활법률", "디지털 법률"],
    format: "청년 대상 생활법률 특강",
    formatKind: "special-lecture",
    summary:
      "창원청년비전센터에서 청년을 대상으로 진행한 생활법률 특강입니다. 주거·계약·금전·온라인 상황에서 자주 마주치는 확인 포인트를 사례 중심으로 안내했습니다.",
    imageSrc: imagePaths.lectureChangwonYouthVision,
    images: [
      {
        src: imagePaths.lectureChangwonYouthVision,
        alt: "창원청년비전센터 청년 생활법률 교육 현장",
      },
    ],
    relatedLecturePages: [
      "/청년생활법률특강",
      "/법률강의",
      "/디지털법률교육",
    ],
    featured: true,
    verified: true,
    verificationNote: "현장 사진·공식 프로필(2026.07.02) 확인",
    sourceNote: "프로필 PDF 2026.07.02; public/image/강의-창원청년비전센터.jpg",
  },
  {
    id: "yangsan-high-school-career-talk",
    slug: "yangsan-jeil-high-career-talk",
    title: "양산제일고 법무사 진로특강",
    shortTitle: "양산제일고 진로특강",
    institution: "양산제일고",
    institutionType: "school",
    date: "2026-05-21",
    year: 2026,
    city: "양산",
    audience: "고등학생",
    audiences: ["고등학생"],
    topics: ["법무사 업무", "법률전문직 진로", "법무사 시험", "직업 소개"],
    lectureCategory: ["학교·진로"],
    format: "고등학교 진로특강",
    formatKind: "career-talk",
    summary:
      "양산제일고 학생들을 대상으로 법무사 업무와 자격 준비 과정, 실제 업무 경험을 나눈 진로특강입니다.",
    objectives: [
      "법률전문직으로서 법무사 업무를 소개합니다.",
      "진로 탐색에 도움이 되는 현실적인 준비 과정을 안내합니다.",
    ],
    imageSrc: imagePaths.lectureYangsanHighSchool,
    images: [
      {
        src: imagePaths.lectureYangsanHighSchool,
        alt: "양산제일고등학교 법무사 진로특강 현장",
      },
    ],
    relatedLecturePages: [
      "/법무사진로특강",
      "/학교법률교육",
      "/법률강의",
    ],
    featured: true,
    verified: true,
    verificationNote: "현장 사진·공식 프로필(2026.05.21) 확인",
    sourceNote: "프로필 PDF 2026.05.21",
  },
  {
    id: "haeundae-youth-job-growth-cafe",
    slug: "haeundae-youth-job-growth-cafe",
    title: "해운대 청년 JOB성장카페 청년 맞춤 법률 강의",
    shortTitle: "해운대 청년 JOB성장카페 강의",
    institution: "해운대 청년 JOB성장카페",
    institutionType: "youth-center",
    date: "2025~2026",
    year: 2026,
    city: "부산",
    district: "해운대구",
    venue: "해운대 청년채움공간 연계",
    audience: "청년·사회초년생",
    audiences: ["청년", "사회초년생"],
    topics: [
      "전세사기 예방",
      "전월세 계약",
      "등기부 확인",
      "돈·부동산·관계 분쟁",
      "취업 관련 생활법률",
    ],
    lectureCategory: ["청년", "전세사기·주거", "생활법률", "기관 맞춤형"],
    format: "해운대 청년채움공간 연계 강의",
    formatKind: "special-lecture",
    summary:
      "해운대 청년채움공간(청년 JOB성장카페)과 연계해 청년의 취업·주거 상황에 맞춘 생활법률을 안내한 강의입니다. 해운대·수영·동래 청년을 대상으로 전세계약·등기부 확인과 분쟁 예방을 다루었습니다.",
    imageSrc: imagePaths.lectureHaeundaeSuyeongDongnae,
    images: [
      {
        src: imagePaths.lectureHaeundaeSuyeongDongnae,
        alt: "해운대 청년 대상 전세사기 예방·등기부 확인 강의 현장",
      },
      {
        src: imagePaths.activityYouthSpace,
        alt: "해운대 청년채움공간 연계 법률 강의 현장",
      },
      {
        src: imagePaths.lectureMoneyPropertyDispute,
        alt: "청년 대상 돈·부동산·관계 분쟁 예방 강의 현장",
      },
    ],
    relatedLecturePages: [
      "/전세사기예방교육",
      "/청년생활법률특강",
      "/법률강의",
    ],
    featured: true,
    verified: true,
    verificationNote: "현장 사진·프로젝트 활동 기록 확인",
    sourceNote:
      "lawyer-lectures 2026-01-25·2026-01-30; lawyer-activities 해운대 청년채움공간",
  },
  {
    id: "lh-busan-changjo-collab",
    slug: "lh-busan-ccei-life-law",
    title: "LH·부산창조경제혁신센터 청년·시민 생활법률 프로그램",
    shortTitle: "LH·창경 생활법률 프로그램",
    institution: "LH · 부산창조경제혁신센터",
    institutionType: "startup-support",
    date: "2025",
    year: 2025,
    city: "부산",
    audience: "청년·시민",
    audiences: ["청년", "시민"],
    topics: ["생활법률 상담", "청년 정책 연계 교육"],
    lectureCategory: ["청년", "기관 맞춤형", "창업·기업"],
    format: "공공기관 협업 프로그램 내 강의·상담",
    formatKind: "seminar",
    summary:
      "LH(한국토지주택공사)·부산창조경제혁신센터와 협업한 프로그램에서 청년·시민을 대상으로 생활법률 강의·상담을 진행했습니다.",
    relatedLecturePages: [
      "/법률강의",
      "/청년생활법률특강",
      "/창업법률교육",
      "/공공기관법률교육",
    ],
    featured: false,
    verified: true,
    verificationNote: "프로젝트 활동·프로필 기록으로 확인",
    sourceNote: "lawyer-profile lawyerLectures[3]; lawyer-activities lh",
  },
  {
    id: "youth-jeonse-prevention-series",
    slug: "youth-jeonse-prevention-series",
    title: "청년 전세사기 예방 오프라인 강의 시리즈",
    shortTitle: "청년 전세사기 예방 시리즈",
    institution: "부산 지역 청년·기관 대상 출강",
    institutionType: "other",
    date: "2025~2026",
    year: 2025,
    city: "부산",
    audience: "청년",
    audiences: ["청년"],
    topics: ["전세사기 예방", "등기부등본 확인", "확정일자"],
    lectureCategory: ["전세사기·주거", "청년"],
    format: "오프라인 강의(복수 회차)",
    formatKind: "multi-session",
    summary:
      "청년을 대상으로 전세사기 예방 주제의 오프라인 강의를 여러 회차로 진행했습니다. 등기부등본 확인·확정일자 등 실전 체크포인트를 중심으로 구성했습니다.",
    imageSrc: imagePaths.lectureJeonseVaccination,
    images: [
      {
        src: imagePaths.lectureJeonseVaccination,
        alt: "청년 전세사기 예방 오프라인 강의 현장",
      },
      {
        src: imagePaths.lectureJeonseLegalEducation,
        alt: "전세사기 예방 법률 교육 특강 현장",
      },
      {
        src: imagePaths.lectureYouthMostSoughtJeonse,
        alt: "청년 전세사기 예방 강의 현장",
      },
      {
        src: imagePaths.lectureYouthJeonsePrevention,
        alt: "부산 청년 전세사기 예방특강 현장",
      },
    ],
    relatedLecturePages: ["/전세사기예방교육", "/청년생활법률특강", "/법률강의"],
    featured: true,
    verified: true,
    verificationNote: "회차별 현장 사진·프로젝트 이력 확인",
    sourceNote:
      "lawyer-lectures 2025-08-20·2025-09-01·2025-09-26·2026-01-15",
  },
  {
    id: "youth-digital-law-guide",
    slug: "youth-digital-law-guide",
    title: "청년 디지털 법률 가이드 강의",
    shortTitle: "디지털 법률 가이드",
    institution: "부산 지역 청년·기관 대상 출강",
    institutionType: "other",
    date: "2025-08-31",
    year: 2025,
    city: "부산",
    audience: "청년",
    audiences: ["청년"],
    topics: ["온라인 사기", "명예훼손", "모욕", "개인정보", "디지털 법률 리스크"],
    lectureCategory: ["디지털 법률", "청년"],
    format: "오프라인 강의",
    formatKind: "lecture",
    summary:
      "온라인에서 마주치는 법적 위험을 다룬 청년 대상 디지털 법률 가이드 강의입니다. 명예훼손·모욕·개인정보·온라인 사기 예방을 사례로 안내했습니다.",
    imageSrc: imagePaths.lectureOnlineSurvival,
    images: [
      {
        src: imagePaths.lectureOnlineSurvival,
        alt: "청년 대상 디지털·온라인 법률 가이드 강의 현장",
      },
    ],
    relatedLecturePages: [
      "/디지털법률교육",
      "/청년생활법률특강",
      "/법률강의",
    ],
    featured: false,
    verified: true,
    verificationNote: "현장 사진·프로젝트 이력 확인",
    sourceNote: "lawyer-lectures 2025-08-31",
  },
  {
    id: "youth-mistake-crime-lecture",
    slug: "youth-mistake-crime-lecture",
    title: "청년 대상 생활 속 형사 리스크 예방 강의",
    shortTitle: "실수로 범죄가 되는 순간들",
    institution: "부산 지역 청년·기관 대상 출강",
    institutionType: "other",
    date: "2025-08-01",
    year: 2025,
    city: "부산",
    audience: "청년",
    audiences: ["청년"],
    topics: [
      "생활 속 범죄",
      "온라인 행동과 법적 책임",
      "명예훼손",
      "모욕",
      "개인정보",
      "형사 리스크 예방",
    ],
    lectureCategory: ["디지털 법률", "청년", "생활법률"],
    format: "오프라인 강의",
    formatKind: "special-lecture",
    summary:
      "청년들이 일상에서 모르고 저지를 수 있는 형사 리스크를 사례로 짚어본 강의입니다. 온라인·일상 행동과 법적 책임의 경계를 예방 관점에서 안내했습니다.",
    imageSrc: imagePaths.lectureMistakeCrime,
    images: [
      {
        src: imagePaths.lectureMistakeCrime,
        alt: "청년 대상 생활 속 형사 리스크 예방 강의 현장",
      },
    ],
    relatedLecturePages: [
      "/디지털법률교육",
      "/청년생활법률특강",
      "/법률강의",
    ],
    featured: false,
    verified: true,
    verificationNote: "현장 사진·프로젝트 이력 확인",
    sourceNote: "lawyer-lectures 2025-08-01",
  },
  {
    id: "youth-law-essential-lecture",
    slug: "youth-life-law-basics",
    title: "청년 대상 생활법률 기초 강의",
    shortTitle: "생활법률 기초",
    institution: "부산 지역 청년·기관 대상 출강",
    institutionType: "other",
    date: "2025-07-26",
    year: 2025,
    city: "부산",
    audience: "청년",
    audiences: ["청년"],
    topics: ["생활법률 기초", "일상 속 법", "계약", "분쟁 예방"],
    lectureCategory: ["생활법률", "청년"],
    format: "오프라인 강의",
    formatKind: "lecture",
    summary:
      "일상 곳곳에 스며 있는 법률 문제를 기초부터 짚어본 청년 대상 강의입니다.",
    imageSrc: imagePaths.lectureLawEssential,
    images: [
      {
        src: imagePaths.lectureLawEssential,
        alt: "청년 대상 생활법률 기초 강의 현장",
      },
    ],
    relatedLecturePages: ["/청년생활법률특강", "/법률강의"],
    featured: false,
    verified: true,
    verificationNote: "현장 사진·프로젝트 이력 확인",
    sourceNote: "lawyer-lectures 2025-07-26",
  },
  {
    id: "housing-contract-practical-guide",
    slug: "youth-housing-contract-guide",
    title: "청년 주거계약 실전 가이드 강의",
    shortTitle: "주거계약 실전 가이드",
    institution: "부산 지역 청년·기관 대상 출강",
    institutionType: "other",
    date: "2025-07-02",
    year: 2025,
    city: "부산",
    audience: "청년",
    audiences: ["청년"],
    topics: ["주거계약 실무", "전·월세 계약 체크리스트"],
    lectureCategory: ["전세사기·주거", "청년"],
    format: "오프라인 강의",
    formatKind: "lecture",
    summary:
      "청년을 위한 주거계약 실전 가이드 강의로, 계약 전후 확인해야 할 실무 체크포인트를 안내했습니다.",
    imageSrc: imagePaths.lectureHousingContractGuide,
    images: [
      {
        src: imagePaths.lectureHousingContractGuide,
        alt: "청년 주거계약 실전 가이드 강의 현장",
      },
    ],
    relatedLecturePages: [
      "/전세사기예방교육",
      "/청년생활법률특강",
      "/법률강의",
    ],
    featured: false,
    verified: true,
    verificationNote: "현장 사진·프로젝트 이력 확인",
    sourceNote: "lawyer-lectures 2025-07-02",
  },
  {
    id: "citizen-library-week-1",
    slug: "busan-citizen-library-week-1",
    title: "시민도서관 생활법률 1회차 · 전·월세계약",
    shortTitle: "시민도서관 1회차 · 전·월세계약",
    institution: "부산광역시립시민도서관",
    institutionType: "library",
    date: "2026-06",
    year: 2026,
    city: "부산",
    audience: "시민·성인 수강생",
    audiences: ["시민", "성인 수강생"],
    topics: ["전·월세계약", "계약 체크리스트"],
    lectureCategory: ["생활법률", "전세사기·주거"],
    format: "성인 야간 특강 1회차",
    formatKind: "lecture",
    summary:
      "부산광역시립시민도서관 생활법률 시리즈 1회차로, 전·월세계약에서 꼭 확인할 서류를 사례로 안내했습니다.",
    imageSrc: imagePaths.lectureCitizenLibraryWeek1,
    images: [
      {
        src: imagePaths.lectureCitizenLibraryWeek1,
        alt: "부산광역시립시민도서관 생활법률 특강 1회차 현장",
      },
    ],
    relatedLecturePages: ["/법률강의", "/전세사기예방교육"],
    featured: false,
    verified: true,
    verificationNote: "시민도서관 1주차 현장 사진 확인",
    sourceNote: "lectureCitizenLibraryWeek1; lawyer-lectures 2026-06-07",
  },
  {
    id: "citizen-library-week-2",
    slug: "busan-citizen-library-week-2",
    title: "시민도서관 생활법률 2회차 · 생활 분쟁 예방",
    shortTitle: "시민도서관 2회차 · 분쟁 예방",
    institution: "부산광역시립시민도서관",
    institutionType: "library",
    date: "2026-06",
    year: 2026,
    city: "부산",
    audience: "시민·성인 수강생",
    audiences: ["시민", "성인 수강생"],
    topics: ["가족·금전·관계 분쟁", "생활 분쟁 예방"],
    lectureCategory: ["생활법률"],
    format: "성인 야간 특강 2회차",
    formatKind: "lecture",
    summary:
      "일상에서 자주 생기는 금전·관계 분쟁을 예방 관점에서 정리한 시민도서관 2회차 특강입니다.",
    imageSrc: imagePaths.lectureCitizenLibraryWeek2,
    images: [
      {
        src: imagePaths.lectureCitizenLibraryWeek2,
        alt: "부산광역시립시민도서관 생활법률 특강 2회차 현장",
      },
    ],
    relatedLecturePages: ["/법률강의", "/청년생활법률특강"],
    featured: false,
    verified: true,
    verificationNote: "시민도서관 2주차 현장 사진 확인",
    sourceNote: "lectureCitizenLibraryWeek2",
  },
  {
    id: "citizen-library-week-3",
    slug: "busan-citizen-library-week-3",
    title: "시민도서관 생활법률 3회차 · 디지털·형사 예방",
    shortTitle: "시민도서관 3회차 · 디지털 예방",
    institution: "부산광역시립시민도서관",
    institutionType: "library",
    date: "2026-06",
    year: 2026,
    city: "부산",
    audience: "시민·성인 수강생",
    audiences: ["시민", "성인 수강생"],
    topics: ["명예훼손·모욕", "개인정보보호", "온라인 범죄 예방"],
    lectureCategory: ["생활법률", "디지털 법률"],
    format: "성인 야간 특강 3회차",
    formatKind: "lecture",
    summary:
      "온라인·일상에서 쉽게 놓치는 명예훼손·개인정보·형사 리스크를 예방 중심으로 안내한 3회차입니다.",
    imageSrc: imagePaths.lectureCitizenLibraryWeek3,
    images: [
      {
        src: imagePaths.lectureCitizenLibraryWeek3,
        alt: "부산광역시립시민도서관 생활법률 특강 3회차 현장",
      },
    ],
    relatedLecturePages: ["/디지털법률교육", "/법률강의"],
    featured: false,
    verified: true,
    verificationNote: "시민도서관 3주차 현장 사진 확인",
    sourceNote: "lectureCitizenLibraryWeek3",
  },
  {
    id: "citizen-library-week-4",
    slug: "busan-citizen-library-week-4",
    title: "시민도서관 생활법률 4회차 · 종합 정리",
    shortTitle: "시민도서관 4회차 · 종합 정리",
    institution: "부산광역시립시민도서관",
    institutionType: "library",
    date: "2026-06",
    year: 2026,
    city: "부산",
    audience: "시민·성인 수강생",
    audiences: ["시민", "성인 수강생"],
    topics: ["전세사기 예방", "생활법률 종합", "체크리스트"],
    lectureCategory: ["생활법률", "전세사기·주거", "기관 맞춤형"],
    format: "성인 야간 특강 4회차",
    formatKind: "lecture",
    summary:
      "4주 과정의 핵심 체크리스트를 다시 정리하며, 현장에서 바로 적용할 순서를 복습한 마무리 회차입니다.",
    imageSrc: imagePaths.lectureCitizenLibraryWeek4,
    images: [
      {
        src: imagePaths.lectureCitizenLibraryWeek4,
        alt: "부산광역시립시민도서관 생활법률 특강 4회차 현장",
      },
    ],
    relatedLecturePages: ["/법률강의", "/전세사기예방교육"],
    featured: false,
    verified: true,
    verificationNote: "시민도서관 4주차 현장 사진 확인",
    sourceNote: "lectureCitizenLibraryWeek4; lectureFourWeekComplete",
  },
  {
    id: "youth-money-property-dispute",
    slug: "youth-money-property-dispute",
    title: "청년 돈·부동산·관계 분쟁 예방 특강",
    shortTitle: "돈·부동산·관계 분쟁 예방",
    institution: "해운대·수영·동래 청년 대상 출강",
    institutionType: "youth-center",
    date: "2026-01-30",
    year: 2026,
    city: "부산",
    district: "해운대구",
    audience: "청년·사회초년생",
    audiences: ["청년", "사회초년생"],
    topics: ["금전분쟁", "부동산 분쟁", "관계 분쟁 예방"],
    lectureCategory: ["청년", "생활법률"],
    format: "청년 대상 오프라인 특강",
    formatKind: "special-lecture",
    summary:
      "청년의 일상에서 자주 생기는 금전·부동산·관계 분쟁을 예방 관점으로 정리한 특강입니다.",
    imageSrc: imagePaths.lectureMoneyPropertyDispute,
    images: [
      {
        src: imagePaths.lectureMoneyPropertyDispute,
        alt: "청년 대상 돈·부동산·관계 분쟁 예방 강의 현장",
      },
    ],
    relatedLecturePages: ["/청년생활법률특강", "/법률강의"],
    featured: true,
    verified: true,
    verificationNote: "현장 사진·프로젝트 이력 확인",
    sourceNote: "lawyer-lectures 2026-01-30",
  },
  {
    id: "youth-jeonse-legal-education",
    slug: "youth-jeonse-legal-education",
    title: "청년 전세사기 예방 법률교육 · 등기부·확정일자",
    shortTitle: "전세사기 예방 · 등기부·확정일자",
    institution: "부산 지역 청년·기관 대상 출강",
    institutionType: "other",
    date: "2026-01-15",
    year: 2026,
    city: "부산",
    audience: "청년",
    audiences: ["청년"],
    topics: ["전세사기 예방", "등기부등본", "확정일자"],
    lectureCategory: ["전세사기·주거", "청년"],
    format: "오프라인 특강",
    formatKind: "special-lecture",
    summary:
      "등기부등본·확정일자 등 전세 계약 전 확인 순서를 중심으로 구성한 청년 전세사기 예방 법률교육입니다.",
    imageSrc: imagePaths.lectureJeonseLegalEducation,
    images: [
      {
        src: imagePaths.lectureJeonseLegalEducation,
        alt: "전세사기 예방 법률 교육 특강 현장",
      },
    ],
    relatedLecturePages: ["/전세사기예방교육", "/청년생활법률특강"],
    featured: true,
    verified: true,
    verificationNote: "현장 사진·프로젝트 이력 확인",
    sourceNote: "lawyer-lectures 2026-01-15",
  },
  {
    id: "youth-jeonse-most-sought",
    slug: "youth-jeonse-most-sought",
    title: "청년 전세사기 예방 강의 · 자주 묻는 질문 중심",
    shortTitle: "청년 전세사기 예방 · FAQ 중심",
    institution: "부산 지역 청년·기관 대상 출강",
    institutionType: "other",
    date: "2025-09-26",
    year: 2025,
    city: "부산",
    audience: "청년",
    audiences: ["청년"],
    topics: ["전세사기 예방", "보증금 보호", "계약 점검"],
    lectureCategory: ["전세사기·주거", "청년"],
    format: "오프라인 강의",
    formatKind: "lecture",
    summary:
      "청년들이 가장 많이 묻는 전세 계약·보증금 보호 질문을 모아 예방 체크리스트로 안내한 강의입니다.",
    imageSrc: imagePaths.lectureYouthMostSoughtJeonse,
    images: [
      {
        src: imagePaths.lectureYouthMostSoughtJeonse,
        alt: "청년 전세사기 예방 강의 현장",
      },
    ],
    relatedLecturePages: ["/전세사기예방교육", "/청년생활법률특강"],
    featured: false,
    verified: true,
    verificationNote: "현장 사진·프로젝트 이력 확인",
    sourceNote: "lawyer-lectures 2025-09-26",
  },
  {
    id: "youth-jeonse-offline-session",
    slug: "youth-jeonse-offline-session",
    title: "청년 전세사기 예방특강 오프라인 성료",
    shortTitle: "청년 전세사기 예방특강",
    institution: "부산 지역 청년·기관 대상 출강",
    institutionType: "other",
    date: "2025-09-01",
    year: 2025,
    city: "부산",
    audience: "청년",
    audiences: ["청년"],
    topics: ["전세사기 예방", "계약 실무"],
    lectureCategory: ["전세사기·주거", "청년"],
    format: "오프라인 특강",
    formatKind: "special-lecture",
    summary:
      "부산 청년 대상 전세사기 예방특강을 오프라인으로 진행하며, 계약 전후 확인 순서를 실전적으로 안내했습니다.",
    imageSrc: imagePaths.lectureYouthJeonsePrevention,
    images: [
      {
        src: imagePaths.lectureYouthJeonsePrevention,
        alt: "부산 청년 전세사기 예방특강 현장",
      },
    ],
    relatedLecturePages: ["/전세사기예방교육", "/청년생활법률특강", "/법률강의"],
    featured: false,
    verified: true,
    verificationNote: "현장 사진·프로젝트 이력 확인",
    sourceNote: "lawyer-lectures 2025-09-01",
  },
  {
    id: "youth-jeonse-vaccination",
    slug: "youth-jeonse-vaccination",
    title: "청년 전세사기 예방접종 특강",
    shortTitle: "전세사기 예방접종 특강",
    institution: "부산 지역 청년·기관 대상 출강",
    institutionType: "other",
    date: "2025-08-20",
    year: 2025,
    city: "부산",
    audience: "청년",
    audiences: ["청년"],
    topics: ["전세사기 예방", "사전 점검"],
    lectureCategory: ["전세사기·주거", "청년"],
    format: "오프라인 특강",
    formatKind: "special-lecture",
    summary:
      "계약 전 ‘예방접종’처럼 확인해야 할 항목을 짧게 정리한 청년 전세사기 예방 특강입니다.",
    imageSrc: imagePaths.lectureJeonseVaccination,
    images: [
      {
        src: imagePaths.lectureJeonseVaccination,
        alt: "청년 전세사기 예방 오프라인 강의 현장",
      },
    ],
    relatedLecturePages: ["/전세사기예방교육", "/청년생활법률특강"],
    featured: false,
    verified: true,
    verificationNote: "현장 사진·프로젝트 이력 확인",
    sourceNote: "lawyer-lectures 2025-08-20",
  },
];

export function getVerifiedLectureHistory(): LectureHistoryEntry[] {
  return lectureHistory.filter((entry) => entry.verified);
}

export function getLectureHistoryById(
  id: string,
): LectureHistoryEntry | undefined {
  return lectureHistory.find((entry) => entry.id === id);
}

export function getLectureHistoryBySlug(
  slug: string,
): LectureHistoryEntry | undefined {
  return getVerifiedLectureHistory().find((entry) => entry.slug === slug);
}

export function getAllLectureHistorySlugs(): string[] {
  return getVerifiedLectureHistory().map((entry) => entry.slug);
}

export function getFeaturedLectureHistory(): LectureHistoryEntry[] {
  return getVerifiedLectureHistory().filter((entry) => entry.featured);
}

export function getLectureHistoryByIds(ids: string[]): LectureHistoryEntry[] {
  return ids
    .map((id) => getLectureHistoryById(id))
    .filter((entry): entry is LectureHistoryEntry => Boolean(entry))
    .filter((entry) => entry.verified);
}

export function getRecentLectureHistory(limit = 3): LectureHistoryEntry[] {
  return [...getVerifiedLectureHistory()]
    .sort((a, b) => compareLectureHistoryDate(b, a))
    .slice(0, limit);
}

export function getRelatedLectureHistoryForPage(
  pagePath: string,
  limit = 3,
): LectureHistoryEntry[] {
  const normalized = pagePath.startsWith("/") ? pagePath : `/${pagePath}`;
  return getVerifiedLectureHistory()
    .filter((entry) =>
      (entry.relatedLecturePages ?? []).some(
        (href) => href === normalized || href.startsWith(`${normalized}#`),
      ),
    )
    .sort((a, b) => Number(b.featured) - Number(a.featured))
    .slice(0, limit);
}

function compareLectureHistoryDate(
  a: LectureHistoryEntry,
  b: LectureHistoryEntry,
): number {
  const aKey = a.date?.replace(/~/g, "-") ?? String(a.year ?? 0);
  const bKey = b.date?.replace(/~/g, "-") ?? String(b.year ?? 0);
  return aKey.localeCompare(bKey);
}
