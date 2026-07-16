import type { Metadata } from "next";
import { Suspense } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { PageContentSection } from "@/components/page/PageContentSection";
import { SearchPageClient } from "@/components/search/SearchPageClient";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = {
  ...createPageMetadata({
    title: "사이트 검색 | 다옴법무사사무소",
    description:
      "다옴법무사사무소 사이트 내 업무·지역·자가진단·FAQ·강의 페이지를 검색합니다.",
    path: "/search",
    noIndex: true,
  }),
  robots: {
    index: false,
    follow: true,
  },
};

export default function SearchPage() {
  return (
    <PageContainer>
      <PageContentSection
        h1="사이트 검색"
        breadcrumbs={[
          { label: "홈", href: "/" },
          { label: "검색" },
        ]}
        currentPath="/search"
        intro="업무명, 지역명, 강의·특강, 자가진단, FAQ 등 사이트 내부 콘텐츠를 검색합니다. 네이버 블로그 게시글은 검색 대상에 포함되지 않습니다."
        relatedLinks={[
          { href: "/services", label: "업무안내" },
          { href: "/자가진단", label: "자가진단" },
          { href: "/법률강의", label: "강의·특강" },
          { href: "/contact", label: "상담 문의" },
        ]}
      >
        <Suspense
          fallback={
            <p className="text-sm text-navy/65">검색 화면을 준비하는 중…</p>
          }
        >
          <SearchPageClient />
        </Suspense>
      </PageContentSection>
    </PageContainer>
  );
}
