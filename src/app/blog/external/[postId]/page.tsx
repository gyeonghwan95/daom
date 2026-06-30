import type { Metadata } from "next";
import Link from "next/link";
import { PageContainer } from "@/components/layout/PageContainer";
import { getNaverBlogUrl } from "@/lib/contact";
import { createPageMetadata } from "@/lib/metadata";
import { getNaverBlogExternalPostIds } from "@/lib/naver-blog/urls.server";

export const dynamicParams = false;

export function generateStaticParams() {
  return getNaverBlogExternalPostIds().map((postId) => ({ postId }));
}

export const metadata: Metadata = {
  ...createPageMetadata({
    title: "네이버 블로그 안내",
    description:
      "다옴법무사사무소 공식 네이버 블로그로 이동합니다. 최신 법률정보와 상담 사례를 확인하실 수 있습니다.",
    path: "/blog",
    noIndex: true,
  }),
  robots: {
    index: false,
    follow: true,
  },
};

export default function NaverBlogExternalRedirectPage() {
  const blogUrl = getNaverBlogUrl();

  return (
    <PageContainer>
      <div className="mx-auto max-w-xl py-16 text-center md:py-20">
        <h1 className="text-xl font-bold text-navy md:text-2xl">
          네이버 블로그 안내
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-navy/70 sm:text-base">
          이 페이지는 공식 네이버 블로그로 안내합니다. 최신 글은 아래 링크에서
          확인하실 수 있습니다.
        </p>
        <a
          href={blogUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary mt-8 inline-flex min-h-12 items-center justify-center px-6"
        >
          네이버 블로그 바로가기
        </a>
        <p className="mt-6">
          <Link
            href="/blog"
            className="text-sm font-medium text-navy-light underline-offset-4 hover:underline"
          >
            블로그 안내 페이지로 돌아가기
          </Link>
        </p>
      </div>
    </PageContainer>
  );
}
