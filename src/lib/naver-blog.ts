import { getNaverBlogUrl } from "@/lib/contact";
import { readNaverBlogFeedFromDisk } from "@/lib/naver-blog/store";
import type { NaverBlogFeed, NaverBlogPost } from "@/lib/naver-blog/types";
import { extractNaverBlogId } from "@/lib/naver-blog/rss";

export type { NaverBlogFeed, NaverBlogPost };
export { formatFeedFetchedAt, formatNaverBlogDate } from "@/lib/naver-blog/format";

export function getNaverBlogFeed(): NaverBlogFeed {
  return readNaverBlogFeedFromDisk();
}

export function getNaverBlogPosts(): NaverBlogPost[] {
  return getNaverBlogFeed().items;
}

export function getNaverBlogRssUrl(): string {
  const blogUrl = getNaverBlogUrl();
  const blogId = extractNaverBlogId(blogUrl);
  return `https://rss.blog.naver.com/${blogId}.xml`;
}

export {
  extractNaverPostId,
  getNaverBlogExternalPath,
  getNaverBlogExternalPostIds,
  getNaverBlogInternalHref,
  getNaverBlogPostByPostId,
} from "@/lib/naver-blog/urls";
