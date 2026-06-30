"use client";

import { useState } from "react";
import { formatReviewsFetchedAt } from "@/lib/naver-place-reviews/format";

type AdminRefreshPanelProps = {
  reviewsFetchedAt: string | null;
};

export function AdminRefreshPanel({
  reviewsFetchedAt: initialReviewsFetchedAt,
}: AdminRefreshPanelProps) {
  const [reviewsRefreshing, setReviewsRefreshing] = useState(false);
  const [reviewsMessage, setReviewsMessage] = useState("");
  const [reviewsError, setReviewsError] = useState("");
  const [reviewsFetchedAt, setReviewsFetchedAt] = useState(
    initialReviewsFetchedAt,
  );

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

  const reviewsFetchedLabel = formatReviewsFetchedAt(reviewsFetchedAt);

  return (
    <div className="space-y-4">
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
