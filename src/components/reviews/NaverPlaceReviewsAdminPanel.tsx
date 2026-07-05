"use client";

import { useState } from "react";
import { useAdminSession } from "@/components/admin/useAdminSession";
import type { NaverPlaceReviewsFeed } from "@/lib/naver-place-reviews/types";
import { formatReviewsFetchedAt } from "@/lib/naver-place-reviews/format";

type NaverPlaceReviewsAdminPanelProps = {
  initialFeed: NaverPlaceReviewsFeed;
  onFeedUpdated?: (feed: NaverPlaceReviewsFeed) => void;
};

export function NaverPlaceReviewsAdminPanel({
  initialFeed,
  onFeedUpdated,
}: NaverPlaceReviewsAdminPanelProps) {
  const { loading, authenticated, configured } = useAdminSession();
  const [feed, setFeed] = useState(initialFeed);
  const [refreshing, setRefreshing] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  if (loading || !configured || !authenticated) {
    return null;
  }

  const fetchedLabel = formatReviewsFetchedAt(feed.fetchedAt);

  async function handleRefresh() {
    setRefreshing(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch("/api/admin/naver-reviews/refresh", {
        method: "POST",
        credentials: "include",
      });

      const data = (await response.json()) as {
        error?: string;
        message?: string;
        feed?: NaverPlaceReviewsFeed;
      };

      if (!response.ok) {
        setError(data.error ?? "갱신에 실패했습니다.");
        return;
      }

      if (data.feed) {
        setFeed(data.feed);
        onFeedUpdated?.(data.feed);
      }
      setMessage(data.message ?? "네이버 방문자 리뷰를 갱신했습니다.");
    } catch {
      setError("네트워크 오류로 갱신에 실패했습니다.");
    } finally {
      setRefreshing(false);
    }
  }

  return (
    <section className="mt-6 rounded-lg border border-dashed border-navy/15 bg-white px-4 py-4">
      <p className="text-sm text-navy/70">
        관리자 모드 · 네이버 플레이스 최신 방문자 리뷰를 즉시 가져옵니다.
        {fetchedLabel ? ` (마지막 갱신: ${fetchedLabel})` : ""}
      </p>
      <button
        type="button"
        onClick={handleRefresh}
        disabled={refreshing}
        className="mt-3 inline-flex min-h-10 cursor-pointer items-center rounded-lg bg-navy px-4 text-sm font-semibold text-white transition-colors hover:bg-navy-dark disabled:opacity-60"
      >
        {refreshing ? "갱신 중…" : "네이버 리뷰 갱신"}
      </button>
      {message ? <p className="mt-2 text-sm text-emerald-700">{message}</p> : null}
      {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
    </section>
  );
}
