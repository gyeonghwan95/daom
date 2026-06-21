import { parseNaverReviewDateLabel } from "@/lib/naver-place-reviews/parse-date";
import type {
  NaverPlaceReview,
  NaverPlaceReviewStats,
  NaverPlaceReviewsFeed,
} from "@/lib/naver-place-reviews/types";
import { DEFAULT_NAVER_PLACE_ID } from "@/lib/naver-place-reviews/types";

type ApolloRef = { __ref: string };

type ApolloState = Record<string, unknown>;

function readEnvPlaceId(): string {
  return (
    process.env.NEXT_PUBLIC_NAVER_PLACE_ID?.trim() ||
    process.env.NAVER_PLACE_ID?.trim() ||
    DEFAULT_NAVER_PLACE_ID
  );
}

function getReviewUrl(placeId: string): string {
  return `https://map.naver.com/p/entry/place/${placeId}?placePath=/review`;
}

function getMobileReviewPageUrl(placeId: string): string {
  return `https://m.place.naver.com/place/${placeId}/review/visitor?reviewSort=recent`;
}

function extractApolloState(html: string): ApolloState | null {
  const match = html.match(/window\.__APOLLO_STATE__\s*=\s*(\{[\s\S]*?\})\s*;/);
  if (!match) return null;

  try {
    return JSON.parse(match[1]) as ApolloState;
  } catch {
    return null;
  }
}

function resolveAuthorNickname(
  state: ApolloState,
  authorRef: ApolloRef | undefined,
): string {
  if (!authorRef?.__ref) return "네이버 방문자";
  const author = state[authorRef.__ref] as { nickname?: string } | undefined;
  return author?.nickname?.trim() || "네이버 방문자";
}

function parseReviewsFromApollo(
  state: ApolloState,
  placeId: string,
): { items: NaverPlaceReview[]; stats: NaverPlaceReviewStats } {
  const statsKey = `VisitorReviewStatsResult:${placeId}`;
  const statsRaw = state[statsKey] as
    | {
        review?: {
          totalCount?: number;
          avgRating?: number;
          imageReviewCount?: number;
        };
        visitorReviewsTotal?: number;
      }
    | undefined;

  const stats: NaverPlaceReviewStats = {
    totalCount:
      statsRaw?.visitorReviewsTotal ??
      statsRaw?.review?.totalCount ??
      0,
    avgRating: statsRaw?.review?.avgRating ?? 0,
    imageReviewCount: statsRaw?.review?.imageReviewCount ?? 0,
  };

  const items = Object.entries(state)
    .filter(([key]) => key.startsWith("VisitorReview:"))
    .map(([, value]) => {
      const review = value as {
        id?: string;
        reviewId?: string;
        rating?: number | null;
        author?: ApolloRef;
        body?: string;
        created?: string;
        visited?: string;
        visitCount?: number;
        reply?: { body?: string } | null;
      };

      const id = review.reviewId ?? review.id ?? "";
      const created = review.created?.trim() ?? "";
      const body = review.body?.trim() ?? "";
      if (!id || !body) return null;

      return {
        id,
        nickname: resolveAuthorNickname(state, review.author),
        body,
        created,
        createdSortKey: parseNaverReviewDateLabel(created) || created,
        visited: review.visited?.trim(),
        visitCount: review.visitCount,
        rating: review.rating ?? null,
        reply: review.reply?.body?.trim() ?? null,
      } as NaverPlaceReview;
    })
    .filter((item): item is NaverPlaceReview => item !== null)
    .sort((a, b) => b.createdSortKey.localeCompare(a.createdSortKey));

  return { items, stats };
}

export async function fetchNaverPlaceReviewsFeed(
  placeId = readEnvPlaceId(),
): Promise<NaverPlaceReviewsFeed> {
  const response = await fetch(getMobileReviewPageUrl(placeId), {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
      Accept: "text/html,application/xhtml+xml",
      "Accept-Language": "ko-KR,ko;q=0.9",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`네이버 플레이스 응답 오류 (${response.status})`);
  }

  const html = await response.text();
  const state = extractApolloState(html);
  if (!state) {
    throw new Error("네이버 플레이스 리뷰 데이터를 찾지 못했습니다.");
  }

  const { items, stats } = parseReviewsFromApollo(state, placeId);

  return {
    placeId,
    placeName: "다옴법무사사무소",
    reviewUrl: getReviewUrl(placeId),
    fetchedAt: new Date().toISOString(),
    stats,
    items,
  };
}
