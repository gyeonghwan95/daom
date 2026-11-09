"use client";

import { useState } from "react";
import { NaverPlaceReviewsAdminPanel } from "@/components/reviews/NaverPlaceReviewsAdminPanel";
import { NaverPlaceReviewsLinkHub } from "@/components/reviews/NaverPlaceReviewsLinkHub";
import { toPreviewFeed } from "@/lib/naver-place-reviews/preview";
import type { NaverPlaceReviewsPreviewFeed } from "@/lib/naver-place-reviews/types";

type NaverReviewsSectionClientProps = {
  initialFeed: NaverPlaceReviewsPreviewFeed;
};

export function NaverReviewsSectionClient({
  initialFeed,
}: NaverReviewsSectionClientProps) {
  const [feed, setFeed] = useState(initialFeed);

  return (
    <>
      <NaverPlaceReviewsLinkHub feed={feed} />
      <NaverPlaceReviewsAdminPanel
        initialFetchedAt={initialFeed.fetchedAt}
        onFeedUpdated={(next) => setFeed(toPreviewFeed(next))}
      />
    </>
  );
}
