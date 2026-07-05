"use client";

import { useState } from "react";
import { NaverPlaceReviewsAdminPanel } from "@/components/reviews/NaverPlaceReviewsAdminPanel";
import { NaverPlaceReviewsLinkHub } from "@/components/reviews/NaverPlaceReviewsLinkHub";
import type { NaverPlaceReviewsFeed } from "@/lib/naver-place-reviews/types";

type NaverReviewsSectionClientProps = {
  initialFeed: NaverPlaceReviewsFeed;
};

export function NaverReviewsSectionClient({
  initialFeed,
}: NaverReviewsSectionClientProps) {
  const [feed, setFeed] = useState(initialFeed);

  return (
    <>
      <NaverPlaceReviewsLinkHub feed={feed} />
      <NaverPlaceReviewsAdminPanel
        initialFeed={initialFeed}
        onFeedUpdated={setFeed}
      />
    </>
  );
}
