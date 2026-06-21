import type { Metadata } from "next";
import { AdminPageClient } from "@/components/admin/AdminPageClient";
import { PageContainer } from "@/components/layout/PageContainer";
import { getNaverBlogFeed } from "@/lib/naver-blog";
import { getNaverPlaceReviewsFeed } from "@/lib/naver-place-reviews";

export const metadata: Metadata = {
  title: "관리자",
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

export default function AdminPage() {
  const blogFeed = getNaverBlogFeed();
  const reviewsFeed = getNaverPlaceReviewsFeed();

  return (
    <PageContainer>
      <div className="mx-auto max-w-2xl py-10 md:py-14">
        <p className="home-section-label text-navy-light">Admin</p>
        <h1 className="mt-2 text-2xl font-bold text-navy md:text-3xl">
          관리자
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-navy/70">
          네이버 블로그 RSS 갱신 등 사이트 운영 기능에 접근합니다. 이 페이지는
          검색엔진에 노출되지 않습니다.
        </p>
        <div className="mt-8">
          <AdminPageClient
            blogFetchedAt={blogFeed.fetchedAt}
            reviewsFetchedAt={reviewsFeed.fetchedAt}
          />
        </div>
      </div>
    </PageContainer>
  );
}
