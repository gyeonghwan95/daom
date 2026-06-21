export type NaverBlogPost = {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  category?: string;
};

export type NaverBlogFeed = {
  blogUrl: string;
  blogId: string;
  rssUrl?: string;
  fetchedAt: string | null;
  items: NaverBlogPost[];
};

export const EMPTY_NAVER_BLOG_FEED: NaverBlogFeed = {
  blogUrl: "https://blog.naver.com/law-yoon-91",
  blogId: "law-yoon-91",
  fetchedAt: null,
  items: [],
};
