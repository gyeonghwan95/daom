import type { NaverBlogPost } from "@/lib/naver-blog/types";

export function extractNaverPostId(link: string): string | null {
  const match = link.match(/blog\.naver\.com\/[^/]+\/(\d+)/);
  return match?.[1] ?? null;
}

export function getNaverBlogExternalPath(postId: string): string {
  return `/blog/external/${postId}`;
}

export function getNaverBlogInternalHref(post: NaverBlogPost): string | null {
  const postId = extractNaverPostId(post.link);
  return postId ? getNaverBlogExternalPath(postId) : null;
}
