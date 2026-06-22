import { readNaverBlogFeedFromDisk } from "@/lib/naver-blog/store";
import type { NaverBlogPost } from "@/lib/naver-blog/types";
import { extractNaverPostId } from "@/lib/naver-blog/urls";

export function getNaverBlogPostByPostId(
  postId: string,
): (NaverBlogPost & { postId: string }) | null {
  const feed = readNaverBlogFeedFromDisk();

  for (const post of feed.items) {
    const id = extractNaverPostId(post.link);
    if (id === postId) {
      return { ...post, postId: id };
    }
  }

  return null;
}

export function getNaverBlogExternalPostIds(): string[] {
  const feed = readNaverBlogFeedFromDisk();
  const ids = feed.items
    .map((post) => extractNaverPostId(post.link))
    .filter((id): id is string => Boolean(id));

  return [...new Set(ids)];
}
