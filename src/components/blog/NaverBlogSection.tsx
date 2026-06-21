import { NaverBlogSectionClient } from "@/components/blog/NaverBlogSectionClient";
import { getNaverBlogUrl } from "@/lib/contact";
import { getNaverBlogFeed } from "@/lib/naver-blog";

export function NaverBlogSection() {
  const feed = getNaverBlogFeed();
  const blogUrl = getNaverBlogUrl();

  return <NaverBlogSectionClient initialFeed={feed} blogUrl={blogUrl} />;
}
