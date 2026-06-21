"use client";

import { useState } from "react";
import { CustomerReviewCard } from "@/components/cards/CustomerReviewCard";
import { useAdminSession } from "@/components/admin/useAdminSession";
import { GridPagination } from "@/components/profile/GridPagination";
import {
  reviewPaginatedGridOptions,
  usePaginatedGrid,
} from "@/hooks/usePaginatedGrid";
import type { NaverPlaceReviewsFeed } from "@/lib/naver-place-reviews/types";
import { formatReviewsFetchedAt } from "@/lib/naver-place-reviews/format";

type NaverReviewsSectionClientProps = {
  initialFeed: NaverPlaceReviewsFeed;
};

export function NaverReviewsSectionClient({
  initialFeed,
}: NaverReviewsSectionClientProps) {
  const { loading, authenticated, configured } = useAdminSession();
  const [feed, setFeed] = useState(initialFeed);
  const [refreshing, setRefreshing] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fetchedLabel = formatReviewsFetchedAt(feed.fetchedAt);
  const reviews = [...feed.items].sort((a, b) =>
    b.createdSortKey.localeCompare(a.createdSortKey),
  );

  const { page, setPage, totalPages, showPagination, visibleItems, gridClassName } =
    usePaginatedGrid(reviews.length, reviewPaginatedGridOptions);

  const visibleReviews = reviews.slice(visibleItems.start, visibleItems.end);

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
      }
      setMessage(data.message ?? "네이버 방문자 리뷰를 갱신했습니다.");
    } catch {
      setError("네트워크 오류로 갱신에 실패했습니다.");
    } finally {
      setRefreshing(false);
    }
  }

  return (
    <div className="space-y-6">
      <section className="card-surface bg-beige/50 p-5 md:p-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-navy">네이버 플레이스 방문자 리뷰</p>
            <p className="mt-2 text-sm text-navy/70">
              총 <strong>{feed.stats.totalCount}</strong>건
              {feed.stats.imageReviewCount > 0 && (
                <> · 사진 리뷰 {feed.stats.imageReviewCount}건</>
              )}
            </p>
            {fetchedLabel && (
              <p className="mt-1 text-xs text-navy/50">마지막 갱신: {fetchedLabel}</p>
            )}
          </div>
          <a
            href={feed.reviewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-10 items-center rounded-lg border border-navy/15 bg-white px-4 text-sm font-medium text-navy transition-colors hover:border-navy/30 hover:bg-beige/40"
          >
            네이버에서 더 보기 →
          </a>
        </div>
      </section>

      {!loading && configured && authenticated && (
        <section className="rounded-lg border border-dashed border-navy/15 bg-white px-4 py-4">
          <p className="text-sm text-navy/70">
            관리자 모드 · 네이버 플레이스 최신 방문자 리뷰를 즉시 가져옵니다.
          </p>
          <button
            type="button"
            onClick={handleRefresh}
            disabled={refreshing}
            className="mt-3 inline-flex min-h-10 cursor-pointer items-center rounded-lg bg-navy px-4 text-sm font-semibold text-white transition-colors hover:bg-navy-dark disabled:opacity-60"
          >
            {refreshing ? "갱신 중…" : "네이버 리뷰 갱신"}
          </button>
          {message && (
            <p className="mt-2 text-sm text-emerald-700">{message}</p>
          )}
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </section>
      )}

      {reviews.length > 0 ? (
        <div>
          <ul className={gridClassName}>
            {visibleReviews.map((review) => (
              <li key={review.id}>
                <CustomerReviewCard review={review} />
              </li>
            ))}
          </ul>

          {showPagination && (
            <GridPagination
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          )}
        </div>
      ) : (
        <div className="card-surface p-6 text-sm leading-relaxed text-navy/70">
          <p>아직 표시할 리뷰가 없습니다.</p>
          <p className="mt-2">
            빌드 시 자동으로 네이버 플레이스 리뷰를 가져오거나, 관리자로 로그인한
            뒤 「네이버 리뷰 갱신」 버튼을 눌러 주세요.
          </p>
        </div>
      )}
    </div>
  );
}
