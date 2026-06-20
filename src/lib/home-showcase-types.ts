export type ShowcaseImage = {
  src: string;
  alt: string;
  placeholder?: boolean;
};

export type HomeActivityItem = {
  id: string;
  category: string;
  title: string;
  subtitle: string;
  period: string;
  image: ShowcaseImage;
};

export type HomePressItem = {
  id: string;
  source: string;
  title: string;
  date: string;
  image: ShowcaseImage;
  url?: string;
};

export type HomeYoutubeVideo = {
  id: string;
  title: string;
  description: string;
  youtubeUrl: string;
  featured?: boolean;
};

export const homeShowcaseIntro = {
  activities: {
    label: "Activities",
    title: "대외활동",
    description:
      "기업·공공기관·지역사회와 함께한 법률 지원과 교육 활동입니다.",
  },
  press: {
    label: "Press",
    title: "언론·기사",
    description: "언론 보도와 기사 스크랩을 모았습니다.",
  },
  youtube: {
    label: "Media",
    title: "영상으로 만나는 법률 이야기",
    description:
      "강의·인터뷰·법률 정보 영상을 YouTube에서 확인하실 수 있습니다.",
  },
} as const;
