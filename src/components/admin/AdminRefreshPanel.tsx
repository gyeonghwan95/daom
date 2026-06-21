"use client";

import { useState } from "react";
import { formatFeedFetchedAt } from "@/lib/naver-blog/format";
import { formatReviewsFetchedAt } from "@/lib/naver-place-reviews/format";

type AdminRefreshPanelProps = {
  blogFetchedAt: string | null;
  reviewsFetchedAt: string | null;
};

export function AdminRefreshPanel({
  blogFetchedAt: initialBlogFetchedAt,
  reviewsFetchedAt: initialReviewsFetchedAt,
}: AdminRefreshPanelProps) {
  const [blogRefreshing, setBlogRefreshing] = useState(false);
  const [reviewsRefreshing, setReviewsRefreshing] = useState(false);
  const [blogMessage, setBlogMessage] = useState("");
  const [blogError, setBlogError] = useState("");
  const [reviewsMessage, setReviewsMessage] = useState("");
  const [reviewsError, setReviewsError] = useState("");
  const [blogFetchedAt, setBlogFetchedAt] = useState(initialBlogFetchedAt);
  const [reviewsFetchedAt, setReviewsFetchedAt] = useState(
    initialReviewsFetchedAt,
  );

  async function handleBlogRefresh() {
    setBlogRefreshing(true);
    setBlogMessage("");
    setBlogError("");

    try {
      const response = await fetch("/api/admin/naver-blog/refresh", {
        method: "POST",
        credentials: "include",
      });

      const data = (await response.json()) as {
        error?: string;
        message?: string;
        feed?: { fetchedAt: string };
      };

      if (!response.ok) {
        setBlogError(data.error ?? "갱신에 실패했습니다.");
        return;
      }

      if (data.feed?.fetchedAt) {
        setBlogFetchedAt(data.feed.fetchedAt);
      }

      setBlogMessage(data.message ?? "네이버 블로그 글을 갱신했습니다.");
    } catch {
      setBlogError("갱신 요청 중 오류가 발생했습니다.");
    } finally {
      setBlogRefreshing(false);
    }
  }

  async function handleReviewsRefresh() {
    setReviewsRefreshing(true);
    setReviewsMessage("");
    setReviewsError("");

    try {
      const response = await fetch("/api/admin/naver-reviews/refresh", {
        method: "POST",
        credentials: "include",
      });

      const data = (await response.json()) as {
        error?: string;
        message?: string;
        feed?: { fetchedAt: string };
      };

      if (!response.ok) {
        setReviewsError(data.error ?? "갱신에 실패했습니다.");
        return;
      }

      if (data.feed?.fetchedAt) {
        setReviewsFetchedAt(data.feed.fetchedAt);
      }

      setReviewsMessage(data.message ?? "네이버 방문자 리뷰를 갱신했습니다.");
    } catch {
      setReviewsError("네트워크 오류로 갱신에 실패했습니다.");
    } finally {
      setReviewsRefreshing(false);
    }
  }

  const blogFetchedLabel = formatFeedFetchedAt(blogFetchedAt);
  const reviewsFetchedLabel = formatReviewsFetchedAt(reviewsFetchedAt);

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-navy/10 bg-white px-4 py-4">
        <h2 className="text-base font-semibold text-navy">네이버 블로그</h2>
        <p className="mt-2 text-sm leading-relaxed text-navy/70">
          포스팅 페이지에 표시되는 네이버 블로그 RSS를 즉시 갱신합니다.
        </p>
        {blogFetchedLabel ? (
          <p className="mt-1 text-xs text-navy/50">
            마지막 갱신: {blogFetchedLabel}
          </p>
        ) : null}
        <button
          type="button"
          onClick={handleBlogRefresh}
          disabled={blogRefreshing}
          className="mt-4 inline-flex min-h-10 cursor-pointer items-center rounded-lg bg-navy px-4 text-sm font-semibold text-white transition-colors hover:bg-navy-dark disabled:cursor-not-allowed disabled:opacity-60"
        >
          {blogRefreshing ? "갱신 중…" : "네이버 블로그 갱신"}
        </button>
        {blogMessage ? (
          <p className="mt-2 text-sm text-emerald-700" role="status">
            {blogMessage}
          </p>
        ) : null}
        {blogError ? (
          <p className="mt-2 text-sm text-red-600" role="alert">
            {blogError}
          </p>
        ) : null}
      </div>

      <div className="rounded-lg border border-navy/10 bg-white px-4 py-4">
        <h2 className="text-base font-semibold text-navy">네이버 플레이스 리뷰</h2>
        <p className="mt-2 text-sm leading-relaxed text-navy/70">
          고객후기 페이지에 표시되는 네이버 방문자 리뷰를 즉시 갱신합니다.
        </p>
        {reviewsFetchedLabel ? (
          <p className="mt-1 text-xs text-navy/50">
            마지막 갱신: {reviewsFetchedLabel}
          </p>
        ) : null}
        <button
          type="button"
          onClick={handleReviewsRefresh}
          disabled={reviewsRefreshing}
          className="mt-4 inline-flex min-h-10 cursor-pointer items-center rounded-lg bg-navy px-4 text-sm font-semibold text-white transition-colors hover:bg-navy-dark disabled:cursor-not-allowed disabled:opacity-60"
        >
          {reviewsRefreshing ? "갱신 중…" : "네이버 리뷰 갱신"}
        </button>
        {reviewsMessage ? (
          <p className="mt-2 text-sm text-emerald-700" role="status">
            {reviewsMessage}
          </p>
        ) : null}
        {reviewsError ? (
          <p className="mt-2 text-sm text-red-600" role="alert">
            {reviewsError}
          </p>
        ) : null}
      </div>
    </div>
  );
}
