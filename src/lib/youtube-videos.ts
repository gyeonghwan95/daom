export type YoutubeVideo = {
  id: string;
  title: string;
  description: string;
  youtubeUrl: string;
  featured?: boolean;
};

/** 사이트 전역 YouTube 영상 — URL·제목 수정은 이 파일에서 */
export const youtubeVideos: YoutubeVideo[] = [
  {
    id: "office-intro",
    title: "부산 법무사 사무소 안내 - 현장에서 답을 찾는 법무사 안윤정",
    description:
      "다옴법무사사무소를 영상으로 미리 둘러보고, 현장에서 답을 찾는 법무사의 상담 철학을 확인해 보세요.",
    youtubeUrl: "https://www.youtube.com/watch?v=ij7Thm8d4To&t=33s",
    featured: true,
  },
  {
    id: "interview-1",
    title:
      "하루 5시간씩 드라마를 보고도 합격한 수험생 [제 30회 법무사 안윤정 합격 인터뷰 1편]",
    description:
      "박문각 합격 인터뷰 — 현실적인 수험 생활과 법무사 시험 합격까지의 여정.",
    youtubeUrl: "https://www.youtube.com/watch?v=y01GzBKWXWU",
  },
  {
    id: "interview-2",
    title: "만점의 공부법 [제 30회 법무사 안윤정 합격 인터뷰 2편]",
    description:
      "박문각 합격 인터뷰 — 효율적인 공부법과 시험 대비 노하우를 공유합니다.",
    youtubeUrl: "https://www.youtube.com/watch?v=A7g1VISK61o",
  },
];

export const trendHotIssueVideo: YoutubeVideo = {
  id: "sentv-trend-hot-issue",
  title: "서울경제TV ‘조영구의 트렌드 핫이슈’ 출연 — 부산 법무사 안윤정",
  description:
    "상속·법인·부동산 실무와 세 가지 상담 원칙, 생활법률 교육과 정책 자문 활동을 소개한 방송입니다.",
  youtubeUrl: "https://youtu.be/EfShKaEBrck",
};

/** 언론·활동 페이지 — 방송 출연 영상을 맨 앞에 */
export const mediaPageYoutubeVideos: YoutubeVideo[] = [
  trendHotIssueVideo,
  ...youtubeVideos,
];

export function getFeaturedYoutubeVideo(): YoutubeVideo {
  return youtubeVideos.find((v) => v.featured) ?? youtubeVideos[0];
}

export function getYoutubeVideoById(id: string): YoutubeVideo | undefined {
  return youtubeVideos.find((v) => v.id === id);
}

/** @deprecated homeYoutubeVideos — youtubeVideos 사용 */
export const homeYoutubeVideos = youtubeVideos;
