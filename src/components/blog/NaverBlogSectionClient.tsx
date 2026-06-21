"use client";

import { useState } from "react";
import { BlogCard } from "@/components/cards/BlogCard";
import { NaverBlogAdminRefresh } from "@/components/blog/NaverBlogAdminRefresh";
import {
  formatFeedFetchedAt,
  formatNaverBlogDate,
} from "@/lib/naver-blog/format";
import type { NaverBlogFeed } from "@/lib/naver-blog/types";

type NaverBlogSectionClientProps = {
  initialFeed: NaverBlogFeed;
  blogUrl: string;
};

export function NaverBlogSectionClient({
  initialFeed,
  blogUrl,
}: NaverBlogSectionClientProps) {
  const [feed, setFeed] = useState(initialFeed);
  const posts = feed.items;

  if (posts.length === 0) {
    return (
      <section
        id="naver-blog"
        className="section-anchor scroll-mt-[calc(var(--header-height)+1rem)] mt-12 border-t border-beige-dark pt-10 md:mt-16 md:pt-12"
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="home-section-label text-navy-light">Naver Blog</p>
            <h2 className="mt-2 text-xl font-bold text-navy md:text-2xl">
              네이버 블로그 최신 글
            </h2>
          </div>
          <a
            href={blogUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center text-sm font-semibold text-navy-light underline-offset-4 hover:text-navy hover:underline"
          >
            네이버 블로그 바로가기 →
          </a>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-navy/65">
          네이버 블로그 최신 글을 불러오지 못했습니다. 아래 링크에서 직접
          확인해 주세요.
        </p>
        <NaverBlogAdminRefresh
          initialFetchedAt={feed.fetchedAt}
          onFeedUpdated={setFeed}
        />
      </section>
    );
  }

  return (
    <section
      id="naver-blog"
      className="section-anchor scroll-mt-[calc(var(--header-height)+1rem)] mt-12 border-t border-beige-dark pt-10 md:mt-16 md:pt-12"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="home-section-label text-navy-light">Naver Blog</p>
          <h2 className="mt-2 text-xl font-bold text-navy md:text-2xl">
            네이버 블로그 최신 글
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-navy/65">
            네이버 블로그에 올라온 최신 글입니다. 자세한 내용은 네이버
            블로그에서 확인하실 수 있습니다.
          </p>
          {feed.fetchedAt ? (
            <p className="mt-1 text-xs text-navy/45">
              마지막 업데이트: {formatFeedFetchedAt(feed.fetchedAt)}
            </p>
          ) : null}
          <NaverBlogAdminRefresh
            initialFetchedAt={feed.fetchedAt}
            onFeedUpdated={setFeed}
          />
        </div>
        <a
          href={blogUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 shrink-0 items-center text-sm font-semibold text-navy-light underline-offset-4 hover:text-navy hover:underline"
        >
          네이버 블로그 전체 보기 →
        </a>
      </div>

      <ul className="listing-card-grid mt-8">
        {posts.map((post) => (
          <li key={post.link}>
            <BlogCard
              title={post.title}
              excerpt={post.description}
              href={post.link}
              external
              date={
                post.category
                  ? `${formatNaverBlogDate(post.pubDate)} · ${post.category}`
                  : formatNaverBlogDate(post.pubDate)
              }
            />
          </li>
        ))}
      </ul>

      <p className="mt-6 text-center text-sm text-navy/55 sm:text-left">
        더 많은 글은{" "}
        <a
          href={blogUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-navy-light underline-offset-4 hover:text-navy hover:underline"
        >
          네이버 블로그
        </a>
        에서 확인하세요.
      </p>
    </section>
  );
}
