/**
 * 업무 페이지 끝 신뢰 블록에 붙이는 「같은 업무 방문자 후기 한 줄」.
 * 후기 본문은 고치지 않고 앞부분만 자른다(잘랐으면 말줄임표).
 */
import type { NaverPlaceReview } from "@/lib/naver-place-reviews/types";

export type ReviewTopic = "inheritance" | "lease" | "realEstate" | "general";

export type ReviewQuote = {
  id: string;
  topic: ReviewTopic;
  excerpt: string;
};

const MAX_EXCERPT = 110;

function reviewTopic(body: string): ReviewTopic {
  if (/상속/.test(body)) return "inheritance";
  if (/전세|임대차|보증금/.test(body)) return "lease";
  if (/매매|부동산|소유권/.test(body)) return "realEstate";
  return "general";
}

/** 문장 끝(. ! ?)에서 자르고(말줄임 없음), 없으면 마지막 띄어쓰기에서 자르고 말줄임표를 붙인다. */
export function excerptReview(body: string, max = MAX_EXCERPT): string {
  const text = body.replace(/\s+/g, " ").trim();
  if (text.length <= max) return text;
  const head = text.slice(0, max);
  let cut = -1;
  for (const m of head.matchAll(/(?<![.!?])[.!?](?=\s)/g)) {
    if (m.index !== undefined && m.index >= 50) cut = m.index + 1;
  }
  if (cut > 0) return text.slice(0, cut).trim();
  const space = head.lastIndexOf(" ");
  return `${head.slice(0, space > 50 ? space : max).trim()}…`;
}

export function buildReviewQuotes(reviews: NaverPlaceReview[]): ReviewQuote[] {
  return reviews
    .filter((r) => r.body && r.body.replace(/\s+/g, "").length >= 30)
    .map((r) => ({
      id: r.id,
      topic: reviewTopic(r.body),
      excerpt: excerptReview(r.body),
    }))
    // 앞부분이 길 찾기 이야기뿐인 후기는 업무 페이지 인용으로 맞지 않아 뺀다(후기 전체는 플레이스에서 그대로 보임).
    .filter((q) => !/못\s?찾|헤[매메]/.test(q.excerpt));
}

export function pathTopic(pathname: string): ReviewTopic {
  let path = pathname;
  try {
    path = decodeURIComponent(pathname);
  } catch {
    /* keep raw */
  }
  if (/상속|한정승인|후견|inheritance/.test(path)) return "inheritance";
  if (/전세|임대차|임차권|보증금|lease|jeonse/.test(path)) return "lease";
  if (/매매|소유권|부동산|재개발|재건축|증여|근저당|real-estate/.test(path)) {
    return "realEstate";
  }
  return "general";
}

function hash(text: string): number {
  let h = 0;
  for (let i = 0; i < text.length; i++) h = (h * 31 + text.charCodeAt(i)) | 0;
  return Math.abs(h);
}

/** 경로 업무와 같은 주제 후기를 고르고, 없으면 일반 후기 → 전체 순으로 고른다(경로마다 고정). */
export function pickReviewQuote(
  quotes: ReviewQuote[],
  pathname: string,
): ReviewQuote | null {
  if (quotes.length === 0) return null;
  const topic = pathTopic(pathname);
  const sameTopic = quotes.filter((q) => q.topic === topic);
  const general = quotes.filter((q) => q.topic === "general");
  const pool = sameTopic.length ? sameTopic : general.length ? general : quotes;
  return pool[hash(pathname) % pool.length] ?? null;
}
