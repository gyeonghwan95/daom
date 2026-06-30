import type { Metadata } from "next";
import { NaverBlogLinkHub } from "@/components/blog/NaverBlogLinkHub";
import { PageContainer } from "@/components/layout/PageContainer";
import { BlogCard } from "@/components/cards/BlogCard";
import { PageContentSection } from "@/components/page/PageContentSection";
import { JsonLd } from "@/components/seo/JsonLd";
import { formatContentDate, getAllContent } from "@/lib/content/loader";
import { createPageMetadata } from "@/lib/metadata";
import { buildArticleListSchema } from "@/lib/seo/json-ld";
import { getMainLandingHubLinks } from "@/lib/seo/internal-links";
import { staticPageSeo } from "@/lib/seo/page-seo";
import { getBlogPostImage } from "@/lib/site-images";

export const metadata: Metadata = createPageMetadata(staticPageSeo.blog);

export default function BlogPage() {
  const posts = getAllContent("blog");

  return (
    <PageContainer>
      <JsonLd data={buildArticleListSchema(posts)} />
      <PageContentSection
        h1="다옴법무사사무소 네이버 블로그"
        breadcrumbs={[
          { label: "홈", href: "/" },
          { label: "블로그" },
        ]}
        currentPath="/blog"
        intro="다옴법무사사무소의 최신 법률정보와 실제 상담 사례, 강의 소식은 네이버 블로그에서 확인하실 수 있습니다. 아래 버튼을 눌러 공식 블로그로 이동해 주세요."
        relatedLinks={[
          ...getMainLandingHubLinks().slice(0, 8),
          { href: "/faq", label: "자주 묻는 질문" },
          { href: "/services", label: "업무안내" },
          { href: "/services#cases", label: "업무 사례" },
          { href: "/contact", label: "상담 신청" },
        ]}
      >
        <NaverBlogLinkHub />

        <section
          id="site-columns"
          className="section-anchor scroll-mt-[calc(var(--header-height)+1rem)] mt-12 border-t border-beige-dark pt-10 md:mt-16 md:pt-12"
        >
          <h2 className="section-heading">사이트 칼럼</h2>
          <p className="mt-2 text-sm leading-relaxed text-navy/65 sm:text-base">
            다옴법무사사무소가 직접 작성한 법률 안내 글입니다.
          </p>
          <ul className="listing-card-grid mt-6">
            {posts.map((post) => (
              <li key={post.slug}>
                <BlogCard
                  title={post.title}
                  excerpt={post.description}
                  href={post.href}
                  date={`${formatContentDate(post.date)} · ${post.category}`}
                  image={getBlogPostImage(post.slug)}
                />
              </li>
            ))}
          </ul>
        </section>
      </PageContentSection>
    </PageContainer>
  );
}
