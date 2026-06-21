import { siteImages, type SiteImageAsset } from "@/lib/site-images";

export type LawyerLecture = {
  date: string;
  title: string;
  image: SiteImageAsset;
};

export const lawyerLecturesIntro = {
  title: "강의·강연",
  subtitle:
    "법무사·교사 자격을 바탕으로 일상의 법을 쉽게 풀어드리는 강의와 강연입니다.",
} as const;

const lectureEntries = [
  {
    date: "2026-06-20",
    title:
      "언제나 부산광역시자립지원전담기관 전세사기 예방 특강｜청년들의 첫 보금자리를 지키는 법",
  },
  {
    date: "2026-06-07",
    title:
      "부산 법무사가 알려주는 전·월세계약의 모든 것｜부산시민도서관 무료 법률특강 1주차를 마치며",
  },
  {
    date: "2026-05-24",
    title: "부산 법무사 진로특강 후기｜양산제일고 학생들에게 전한 진로 이야기",
  },
  {
    date: "2026-04-12",
    title:
      "부산 법무사의 무료 법률강의 추천｜전세사기·생활분쟁 예방법 4주 완성",
  },
  {
    date: "2026-01-30",
    title:
      "부산 청년을 위한 생활법률 특강 후기｜돈·부동산·관계 분쟁 미리 막는 방법",
  },
  {
    date: "2026-01-25",
    title:
      "부산 전세사기 예방 특강 후기｜해운대 수영동래 청년 전세계약·등기부등본부터 복...",
  },
  {
    date: "2026-01-15",
    title: "부산 전세사기 피해는 법률 교육 특강｜등기부등본? 확정일자는 어떻게?",
  },
  {
    date: "2025-09-26",
    title: "부산 전세사기 청년들이 가장 많이 찾은 예방 강의 후기",
  },
  {
    date: "2025-09-01",
    title:
      "[법률강의] 부산 법무사의 청년 전세사기 예방특강 오프라인 강의 성료",
  },
  {
    date: "2025-08-31",
    title:
      "[법률강의] 온라인 세상에서 살아남기 - 부산 청년 디지털 법률 가이드 후기",
  },
  {
    date: "2025-08-20",
    title:
      "[법률강의] 청년 전세사기 예방집중 - 부산 법무사가 진행하는 무료 강의 안내",
  },
  {
    date: "2025-08-01",
    title:
      "[법률 강의] 청년을 위한 '실수로 범죄가 되는 순간들' 오프라인 강의 성료",
  },
  {
    date: "2025-07-26",
    title:
      "[법률 강의] 청년을 위한 '법 없이도 살 수 없어요' 오프라인 강의 성료",
  },
  {
    date: "2025-07-02",
    title:
      "[법률 강의] 청년을 위한 '주거계약 실전 가이드' 오프라인 강의 성료",
  },
] as const;

function lectureMockImage(index: number, title: string): SiteImageAsset {
  const slots = siteImages.home.activities;
  const base =
    slots[index % slots.length] ??
    siteImages.media.education;
  return {
    ...base,
    alt: `${title} (목업 이미지)`,
  };
}

export const lawyerLectures: LawyerLecture[] = lectureEntries.map(
  (entry, index) => ({
    ...entry,
    image: lectureMockImage(index, entry.title),
  }),
);

export function formatLectureDate(date: string): string {
  const [year, month, day] = date.split("-");
  return `${year}.${month}.${day}`;
}
