/**
 * 클라이언트 컴포넌트에서도 쓰는 네이버 플레이스 후기 요약(빌드 시점 JSON — prebuild의 fetch-naver-place-reviews가 갱신).
 * 서두 결정 카드·히어로 신뢰 띠에서 "후기 n건"과 페이지 주제에 맞는 짧은 인용 한 줄을 보여 준다.
 * 후기 본문은 고치지 않고 앞부분만 자른다.
 */
import feedJson from "../../../public/data/naver-place-reviews.json";
import {
  excerptReview,
  pickReviewQuote,
  type ReviewQuote,
} from "@/lib/naver-place-reviews/topic-quote";
import type { NaverPlaceReviewsFeed } from "@/lib/naver-place-reviews/types";

const feed = feedJson as NaverPlaceReviewsFeed;

export const REVIEW_TOTAL: number = feed.stats?.totalCount || feed.items?.length || 0;

export const REVIEW_PAGE_URL: string = feed.reviewUrl;

function topicOf(body: string): ReviewQuote["topic"] {
  if (/상속/.test(body)) return "inheritance";
  if (/전세|임대차|보증금/.test(body)) return "lease";
  if (/매매|부동산|소유권|증여/.test(body)) return "realEstate";
  return "general";
}

/** 짧은 인용(한두 줄) — 길 찾기·주차로 시작하는 후기는 뺀다 */
// 길찾기·주차 이야기로 끝나는 인용은 결정 카드에 맞지 않는다("…처음에 장소를…"처럼 잘리는 경우 포함)
const SHORT_QUOTES: ReviewQuote[] = (feed.items ?? [])
  .filter((r) => r.body && r.body.replace(/\s+/g, "").length >= 30)
  .map((r) => ({ id: r.id, topic: topicOf(r.body), excerpt: excerptReview(r.body, 62) }))
  .filter((q) => !/못\s?찾|헤[매메]|주차|장소/.test(q.excerpt));

/** 경로 업무와 같은 주제의 후기 한 줄(경로마다 고정) */
export function pickShortReviewQuote(pathname: string): ReviewQuote | null {
  return pickReviewQuote(SHORT_QUOTES, pathname);
}
