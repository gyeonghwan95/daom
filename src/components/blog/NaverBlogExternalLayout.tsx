import { PageContainer } from "@/components/layout/PageContainer";
import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { RelatedLinks } from "@/components/page/RelatedLinks";
import { formatNaverBlogDate } from "@/lib/naver-blog/format";
import type { NaverBlogPost } from "@/lib/naver-blog/types";
import { getNaverBlogExternalPath } from "@/lib/naver-blog/urls";

type NaverBlogExternalLayoutProps = {
  post: NaverBlogPost & { postId: string };
};

export function NaverBlogExternalLayout({ post }: NaverBlogExternalLayoutProps) {
  const path = getNaverBlogExternalPath(post.postId);
  const breadcrumbs = [
    { label: "홈", href: "/" },
    { label: "포스팅", href: "/blog" },
    { label: post.title },
  ];

  return (
    <PageContainer>
      <article className="mx-auto max-w-3xl">
        <Breadcrumb items={breadcrumbs} />
        <BreadcrumbJsonLd items={breadcrumbs} currentPath={path} />

        <header className="mt-6 border-b border-beige-dark pb-8">
          <span className="inline-block rounded-full bg-beige px-3 py-1 text-sm font-medium text-navy-light">
            네이버 블로그
          </span>
          <h1 className="page-title mt-4">{post.title}</h1>
          <p className="mt-4 text-sm text-navy/60 md:text-base">
            {formatNaverBlogDate(post.pubDate)}
            {post.category ? ` · ${post.category}` : ""}
          </p>
        </header>

        {post.description ? (
          <section
            id="summary"
            className="section-anchor scroll-mt-[calc(var(--header-height)+1rem)] mt-8"
            aria-labelledby="naver-blog-summary-heading"
          >
            <h2 id="naver-blog-summary-heading" className="section-heading">
              글 요약
            </h2>
            <p className="body-text mt-4 text-base leading-relaxed text-navy/85 md:text-lg">
              {post.description}
            </p>
          </section>
        ) : null}

        <div className="mt-10 rounded-xl border border-beige-dark bg-beige/40 p-6 md:p-8">
          <p className="text-sm leading-relaxed text-navy/75 md:text-base">
            이 글은 네이버 블로그에 게시된 콘텐츠입니다. 전체 내용과 이미지는
            네이버 블로그에서 확인하실 수 있습니다.
          </p>
          <a
            href={post.link}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary mt-6 inline-flex min-h-11 items-center justify-center"
          >
            네이버블로그 원문 보기
          </a>
        </div>

        <RelatedLinks
          links={[
            { href: "/blog", label: "포스팅 목록" },
            { href: "/contact", label: "상담 신청" },
          ]}
        />
      </article>
    </PageContainer>
  );
}
