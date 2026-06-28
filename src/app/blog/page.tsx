import type { Metadata } from "next";
import { NaverBlogSection } from "@/components/blog/NaverBlogSection";
import { PageContainer } from "@/components/layout/PageContainer";
import { BlogCard } from "@/components/cards/BlogCard";
import { PageContentSection } from "@/components/page/PageContentSection";
import { JsonLd } from "@/components/seo/JsonLd";
import { formatContentDate, getAllContent } from "@/lib/content/loader";
import { getNaverBlogUrl } from "@/lib/contact";
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
        h1="포스팅"
        breadcrumbs={[
          { label: "홈", href: "/" },
          { label: "포스팅" },
        ]}
        currentPath="/blog"
        intro="다옴법무사사무소 안윤정 법무사가 상속·등기·회생 등 실생활에 필요한 법률 정보를 정리합니다. 사이트 칼럼과 함께 네이버 블로그에서도 최신 글을 확인하실 수 있습니다. 구체적 사안은 상담을 통해 확인하시기 바랍니다."
        relatedLinks={[
          ...getMainLandingHubLinks().slice(0, 8),
          { href: getNaverBlogUrl(), label: "네이버 블로그" },
          { href: "/faq", label: "자주 묻는 질문" },
          { href: "/services", label: "업무안내" },
          { href: "/services#cases", label: "업무 사례" },
          { href: "/contact", label: "상담 신청" },
        ]}
      >
        <section
          id="site-columns"
          className="section-anchor scroll-mt-[calc(var(--header-height)+1rem)]"
        >
          <h2 className="section-heading">사이트 칼럼</h2>
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

        <NaverBlogSection />
      </PageContentSection>
    </PageContainer>
  );
}
