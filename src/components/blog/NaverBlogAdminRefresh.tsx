"use client";

import { useState } from "react";
import { useAdminSession } from "@/components/admin/useAdminSession";
import type { NaverBlogFeed } from "@/lib/naver-blog/types";
import { formatFeedFetchedAt } from "@/lib/naver-blog/format";

type NaverBlogAdminRefreshProps = {
  initialFetchedAt: string | null;
  onFeedUpdated: (feed: NaverBlogFeed) => void;
};

export function NaverBlogAdminRefresh({
  initialFetchedAt,
  onFeedUpdated,
}: NaverBlogAdminRefreshProps) {
  const { loading, authenticated, configured } = useAdminSession();
  const [refreshing, setRefreshing] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [fetchedAt, setFetchedAt] = useState(initialFetchedAt);

  if (loading || !configured || !authenticated) {
    return null;
  }

  async function handleRefresh() {
    setRefreshing(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch("/api/admin/naver-blog/refresh", {
        method: "POST",
        credentials: "include",
      });

      const data = (await response.json()) as {
        error?: string;
        message?: string;
        feed?: NaverBlogFeed;
      };

      if (!response.ok) {
        setError(data.error ?? "갱신에 실패했습니다.");
        return;
      }

      if (data.feed) {
        onFeedUpdated(data.feed);
        setFetchedAt(data.feed.fetchedAt);
      }

      setMessage(data.message ?? "네이버 블로그 글을 갱신했습니다.");
    } catch {
      setError("갱신 요청 중 오류가 발생했습니다.");
    } finally {
      setRefreshing(false);
    }
  }

  return (
    <div className="mt-3 rounded-lg border border-amber-200/80 bg-amber-50/70 px-4 py-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-amber-900/70">
            Admin
          </p>
          <p className="mt-1 text-sm text-navy/75">
            관리자 모드 · 네이버 블로그 RSS를 즉시 갱신합니다.
          </p>
          {fetchedAt ? (
            <p className="mt-1 text-xs text-navy/50">
              마지막 갱신: {formatFeedFetchedAt(fetchedAt)}
            </p>
          ) : null}
        </div>
        <button
          type="button"
          onClick={handleRefresh}
          disabled={refreshing}
          className="inline-flex min-h-10 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-navy/15 bg-white px-4 text-sm font-semibold text-navy transition hover:border-navy/30 hover:bg-beige/40 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {refreshing ? "갱신 중…" : "네이버 블로그 갱신"}
        </button>
      </div>

      {message ? (
        <p className="mt-2 text-sm text-emerald-800" role="status">
          {message}
        </p>
      ) : null}
      {error ? (
        <p className="mt-2 text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
