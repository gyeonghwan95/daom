import { reviewTopicLabel } from "@/lib/naver-place-reviews/topic-label";
import type {
  NaverPlaceReviewsFeed,
  NaverPlaceReviewsPreviewFeed,
} from "@/lib/naver-place-reviews/types";

export const PLACE_REVIEW_PREVIEW_MAX = 150;

/** 후기 원문과 같지 않게 150자 이내로 자르고 말줄임표를 붙인다. */
export function previewPlaceReview(
  body: string,
  max = PLACE_REVIEW_PREVIEW_MAX,
): string {
  const text = body.replace(/\s+/g, " ").trim();
  if (!text) return "";

  let head = text.slice(0, Math.min(max, text.length));
  if (head.length >= text.length) {
    const space = head.lastIndexOf(" ");
    head =
      space > 40
        ? head.slice(0, space)
        : head.slice(0, Math.max(1, head.length - 1));
  } else {
    const space = head.lastIndexOf(" ");
    if (space > 40) head = head.slice(0, space);
  }

  return `${head.trim()}...`;
}

export function toPreviewFeed(
  feed: NaverPlaceReviewsFeed,
): NaverPlaceReviewsPreviewFeed {
  return {
    reviewUrl: feed.reviewUrl,
    fetchedAt: feed.fetchedAt,
    items: [...feed.items]
      .filter((r) => r.body && r.body.trim().length > 0)
      .sort((a, b) => b.createdSortKey.localeCompare(a.createdSortKey))
      .map((r) => ({
        id: r.id,
        nickname: r.nickname,
        topic: reviewTopicLabel(r.body),
        excerpt: previewPlaceReview(r.body),
        createdSortKey: r.createdSortKey,
      })),
  };
}
