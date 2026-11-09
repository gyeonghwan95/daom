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
        feed?: { fetchedAt: string; items?: unknown[] };
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
    <div className="admin-panel admin-refresh-panel">
      <h2 className="admin-section__title">네이버 플레이스 리뷰</h2>
      <p className="admin-prose">
        고객후기 페이지에 보이는 방문자 후기 미리보기를 지금 다시 가져옵니다. Node
        서버에서만 동작하며, 정적 배포에서는 빌드 때 갱신됩니다.
      </p>
      {reviewsFetchedLabel ? (
        <p className="admin-page-header__meta">마지막 갱신: {reviewsFetchedLabel}</p>
      ) : (
        <p className="admin-page-header__meta">아직 이 화면에서 갱신한 기록이 없습니다.</p>
      )}
      <button
        type="button"
        onClick={handleReviewsRefresh}
        disabled={reviewsRefreshing}
        className="admin-btn admin-btn--primary"
      >
        {reviewsRefreshing ? "갱신 중…" : "네이버 리뷰 갱신"}
      </button>
      {reviewsMessage ? (
        <p className="admin-alert admin-alert--info" role="status">
          {reviewsMessage}
        </p>
      ) : null}
      {reviewsError ? (
        <p className="admin-alert admin-alert--critical" role="alert">
          {reviewsError}
        </p>
      ) : null}
    </div>
  );
}
