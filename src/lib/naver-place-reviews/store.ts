import fs from "node:fs";
import path from "node:path";
import {
  EMPTY_NAVER_PLACE_REVIEWS_FEED,
  type NaverPlaceReviewsFeed,
} from "@/lib/naver-place-reviews/types";

const PUBLIC_DATA_PATH = path.join(
  process.cwd(),
  "public/data/naver-place-reviews.json",
);

function normalizeFeed(raw: unknown): NaverPlaceReviewsFeed {
  if (!raw || typeof raw !== "object") return EMPTY_NAVER_PLACE_REVIEWS_FEED;
  const data = raw as Partial<NaverPlaceReviewsFeed>;

  return {
    placeId: data.placeId ?? EMPTY_NAVER_PLACE_REVIEWS_FEED.placeId,
    placeName: data.placeName ?? EMPTY_NAVER_PLACE_REVIEWS_FEED.placeName,
    reviewUrl: data.reviewUrl ?? EMPTY_NAVER_PLACE_REVIEWS_FEED.reviewUrl,
    fetchedAt: data.fetchedAt ?? null,
    stats: {
      totalCount: data.stats?.totalCount ?? 0,
      avgRating: data.stats?.avgRating ?? 0,
      imageReviewCount: data.stats?.imageReviewCount ?? 0,
    },
    items: Array.isArray(data.items) ? data.items : [],
  };
}

export function readNaverPlaceReviewsFromDisk(): NaverPlaceReviewsFeed {
  if (!fs.existsSync(PUBLIC_DATA_PATH)) {
    return EMPTY_NAVER_PLACE_REVIEWS_FEED;
  }

  try {
    return normalizeFeed(JSON.parse(fs.readFileSync(PUBLIC_DATA_PATH, "utf8")));
  } catch {
    return EMPTY_NAVER_PLACE_REVIEWS_FEED;
  }
}

export function writeNaverPlaceReviewsToDisk(feed: NaverPlaceReviewsFeed): {
  persisted: boolean;
  path: string;
} {
  const payload = `${JSON.stringify(feed, null, 2)}\n`;
  fs.mkdirSync(path.dirname(PUBLIC_DATA_PATH), { recursive: true });
  fs.writeFileSync(PUBLIC_DATA_PATH, payload, "utf8");

  return { persisted: true, path: PUBLIC_DATA_PATH };
}
