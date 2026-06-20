import type { Metadata } from "next";
import { PageContainer } from "@/components/layout/PageContainer";
import { BlogCard } from "@/components/cards/BlogCard";
import { PageContentSection } from "@/components/page/PageContentSection";
import { JsonLd } from "@/components/seo/JsonLd";
import { formatContentDate, getAllContent } from "@/lib/content/loader";
import { createPageMetadata } from "@/lib/metadata";
import { buildArticleListSchema } from "@/lib/seo/json-ld";
import { staticPageSeo } from "@/lib/seo/page-seo";
import { getBlogPostImage, siteImages } from "@/lib/site-images";

export const metadata: Metadata = createPageMetadata(staticPageSeo.blog);

export default function BlogPage() {
  const posts = getAllContent("blog");

  return (
    <PageContainer>
      <JsonLd data={buildArticleListSchema(posts)} />
      <PageContentSection
        h1="법률 정보 블로그"
        breadcrumbs={[
          { label: "홈", href: "/" },
          { label: "블로그" },
        ]}
        currentPath="/blog"
        coverImage={siteImages.blog.cover}
        intro="다옴법무사사무소 안윤정 법무사가 상속·등기·회생 등 실생활에 필요한 법률 정보를 정리합니다. 복잡한 절차를 이해하기 쉽게 풀어 쓰며, 구체적 사안은 상담을 통해 확인하시기 바랍니다."
        relatedLinks={[
          { href: "/faq", label: "자주 묻는 질문" },
          { href: "/services", label: "업무안내" },
          { href: "/cases", label: "업무 사례" },
          { href: "/contact", label: "상담 신청" },
        ]}
      >
        <ul className="grid gap-4 sm:grid-cols-2">
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
      </PageContentSection>
    </PageContainer>
  );
}
