import Link from "next/link";

type RelatedBlogPostsProps = {
  posts: { href: string; label: string }[];
};

export function RelatedBlogPosts({ posts }: RelatedBlogPostsProps) {
  if (posts.length === 0) return null;

  return (
    <section
      id="related-blog"
      className="section-anchor scroll-mt-[calc(var(--header-height)+1rem)] card-surface p-5 md:p-8"
    >
      <h2 className="section-heading">관련 블로그 글</h2>
      <p className="mt-2 text-sm text-navy/65">
        같은 주제의 법률 정보를 더 읽어보실 수 있습니다.
      </p>
      <ul className="mt-4 space-y-2">
        {posts.map((post) => (
          <li key={post.href}>
            <Link
              href={post.href}
              className="inline-flex min-h-10 items-center text-base font-medium text-navy-light underline-offset-2 hover:underline"
            >
              {post.label} →
            </Link>
          </li>
        ))}
      </ul>
      <Link
        href="/blog"
        className="mt-4 inline-flex min-h-10 items-center text-sm font-semibold text-navy/70 hover:text-navy"
      >
        블로그 전체 보기 →
      </Link>
    </section>
  );
}
