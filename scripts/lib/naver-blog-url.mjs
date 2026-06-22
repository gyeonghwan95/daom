/** @param {string} link */
export function extractNaverPostId(link) {
  const match = link.match(/blog\.naver\.com\/[^/]+\/(\d+)/);
  return match?.[1] ?? null;
}

/** @param {string} postId */
export function getNaverBlogExternalPath(postId) {
  return `/blog/external/${postId}`;
}
