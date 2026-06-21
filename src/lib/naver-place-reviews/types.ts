export type NaverPlaceReview = {
  id: string;
  nickname: string;
  body: string;
  created: string;
  createdSortKey: string;
  visited?: string;
  visitCount?: number;
  rating?: number | null;
  reply?: string | null;
};

export type NaverPlaceReviewStats = {
  totalCount: number;
  avgRating: number;
  imageReviewCount: number;
};

export type NaverPlaceReviewsFeed = {
  placeId: string;
  placeName: string;
  reviewUrl: string;
  fetchedAt: string | null;
  stats: NaverPlaceReviewStats;
  items: NaverPlaceReview[];
};

export const DEFAULT_NAVER_PLACE_ID = "2035745096";

export const EMPTY_NAVER_PLACE_REVIEWS_FEED: NaverPlaceReviewsFeed = {
  placeId: DEFAULT_NAVER_PLACE_ID,
  placeName: "다옴법무사사무소",
  reviewUrl: `https://map.naver.com/p/entry/place/${DEFAULT_NAVER_PLACE_ID}?placePath=/review`,
  fetchedAt: null,
  stats: { totalCount: 0, avgRating: 0, imageReviewCount: 0 },
  items: [],
};
