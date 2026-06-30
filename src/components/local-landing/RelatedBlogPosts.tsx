import Link from "next/link";
import { getNaverBlogUrl } from "@/lib/contact";

type RelatedBlogPostsProps = {
  posts: { href: string; label: string }[];
};

export function RelatedBlogPosts({ posts }: RelatedBlogPostsProps) {
  const naverBlogUrl = getNaverBlogUrl();

  if (posts.length === 0) {
    return (
      <section
        id="related-blog"
        className="section-anchor scroll-mt-[calc(var(--header-height)+1rem)] card-surface p-5 md:p-8"
      >
        <h2 className="section-heading">법률 정보 더 보기</h2>
        <p className="mt-2 text-sm text-navy/65">
          더 많은 법률정보는 네이버 블로그에서 확인하실 수 있습니다.
        </p>
        <a
          href={naverBlogUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary mt-4 inline-flex min-h-11 items-center justify-center px-5"
        >
          네이버 블로그 바로가기
        </a>
      </section>
    );
  }

  return (
    <section
      id="related-blog"
      className="section-anchor scroll-mt-[calc(var(--header-height)+1rem)] card-surface p-5 md:p-8"
    >
      <h2 className="section-heading">관련 칼럼</h2>
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
        블로그 안내 보기 →
      </Link>
      <p className="mt-4 text-sm text-navy/65">
        더 많은 법률정보는{" "}
        <a
          href={naverBlogUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-navy-light underline-offset-4 hover:underline"
        >
          네이버 블로그
        </a>
        에서 확인하세요.
      </p>
    </section>
  );
}
