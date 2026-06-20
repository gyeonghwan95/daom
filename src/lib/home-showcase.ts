import type {
  HomeActivityItem,
  HomePressItem,
  ShowcaseImage,
} from "@/lib/home-showcase-types";
import { siteImages } from "@/lib/site-images";

export type {
  HomeActivityItem,
  HomePressItem,
  ShowcaseImage,
} from "@/lib/home-showcase-types";

export { homeShowcaseIntro } from "@/lib/home-showcase-types";

function toShowcase(asset: (typeof siteImages.home.activities)[number]): ShowcaseImage {
  return {
    src: asset.src,
    alt: asset.alt,
    placeholder: asset.placeholder,
  };
}

const activityMeta: Omit<HomeActivityItem, "image">[] = [
  {
    id: "mou",
    category: "기업 협력",
    title: "명례일반산업단지 MOU",
    subtitle: "83개 기업 법률지원 협약 체결·자문",
    period: "2024",
  },
  {
    id: "lh",
    category: "공공기관",
    title: "LH · 부산창경 협업",
    subtitle: "청년·시민 법률 지원 프로그램",
    period: "2025",
  },
  {
    id: "youth",
    category: "청년 지원",
    title: "해운대 청년채움공간",
    subtitle: "청년 JOB성장카페 법률 상담·강의",
    period: "2025",
  },
  {
    id: "award",
    category: "수상",
    title: "대한법무사협회장 표창",
    subtitle: "법무 업무 성실 수행·지역 기여",
    period: "2026.05",
  },
  {
    id: "policy",
    category: "정책 자문",
    title: "부산시 청년정책조정위",
    subtitle: "전문가 위원 활동",
    period: "2026 ~",
  },
  {
    id: "lecture",
    category: "법률 강의",
    title: "찾아가는 생활 법률 교육",
    subtitle: "학교·기관·주민센터 맞춤 강의",
    period: "2025",
  },
  {
    id: "intl",
    category: "국제 교류",
    title: "나가사키 사법서사회",
    subtitle: "부산법무사회 자매결연 행사",
    period: "2025",
  },
];

const pressMeta: Omit<HomePressItem, "image">[] = [
  {
    id: "press-1",
    source: "부산일보",
    title: "해운대 법무사, 지역 청년 대상 생활 법률 특강 개최",
    date: "2025.11",
    url: "#",
  },
  {
    id: "press-2",
    source: "법률신문",
    title: "기업 MOU 통해 중소기업 법률 지원 확대",
    date: "2025.09",
    url: "#",
  },
  {
    id: "press-3",
    source: "대한법무사협회",
    title: "협회장 표창 수상 — 안윤정 법무사",
    date: "2026.05",
    url: "#",
  },
  {
    id: "press-4",
    source: "박문각",
    title: "합격 인터뷰 — 효율적인 법률 공부법",
    date: "2024",
    url: "https://www.youtube.com/watch?v=y01GzBKWXWU",
  },
  {
    id: "press-5",
    source: "부산경제",
    title: "센텀·해운대 기업 대상 법인등기·계약 실무 안내",
    date: "2025.07",
    url: "#",
  },
  {
    id: "press-6",
    source: "LH 부산",
    title: "주거·임대 관련 법률 Q&A 프로그램 참여",
    date: "2025.04",
    url: "#",
  },
];

export const homeActivityItems: HomeActivityItem[] = activityMeta.map(
  (item, index) => ({
    ...item,
    image: toShowcase(
      siteImages.home.activities[index] ?? siteImages.home.activities[0],
    ),
  }),
);

export const homePressItems: HomePressItem[] = pressMeta.map((item, index) => ({
  ...item,
  image: toShowcase(siteImages.home.press[index] ?? siteImages.home.press[0]),
}));

/** @deprecated youtube-videos.ts의 youtubeVideos 사용 */
export { homeYoutubeVideos, youtubeVideos } from "@/lib/youtube-videos";
