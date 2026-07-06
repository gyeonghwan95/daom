#!/usr/bin/env node
/**
 * 네이버 플레이스 방문자 리뷰 → public/data/naver-place-reviews.json
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const PUBLIC_DATA_PATH = path.join(ROOT, "public/data/naver-place-reviews.json");

function readExistingFeed() {
  if (!fs.existsSync(PUBLIC_DATA_PATH)) return null;
  try {
    return JSON.parse(fs.readFileSync(PUBLIC_DATA_PATH, "utf8"));
  } catch {
    return null;
  }
}

const DEFAULT_PLACE_ID =
  process.env.NEXT_PUBLIC_NAVER_PLACE_ID?.trim() ||
  process.env.NAVER_PLACE_ID?.trim() ||
  "2035745096";

function parseNaverReviewDateLabel(label) {
  const trimmed = String(label ?? "").trim();
  const parts = trimmed.split(".");
  if (parts.length < 2) return "";

  const first = Number.parseInt(parts[0], 10);
  const second = Number.parseInt(parts[1], 10);
  const third = Number.parseInt(parts[2] ?? "", 10);

  let year;
  let month;
  let day;

  if (first > 12) {
    year = first < 100 ? 2000 + first : first;
    month = second;
    day = Number.isNaN(third) ? 1 : third;
  } else {
    year = new Date().getFullYear();
    month = first;
    day = second;
  }

  if (Number.isNaN(year) || Number.isNaN(month) || Number.isNaN(day)) return "";

  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function extractApolloState(html) {
  const match = html.match(/window\.__APOLLO_STATE__\s*=\s*(\{[\s\S]*?\})\s*;/);
  if (!match) return null;
  try {
    return JSON.parse(match[1]);
  } catch {
    return null;
  }
}

function resolveAuthorNickname(state, authorRef) {
  if (!authorRef?.__ref) return "네이버 방문자";
  const author = state[authorRef.__ref];
  return author?.nickname?.trim() || "네이버 방문자";
}

function parseReviewsFromApollo(state, placeId) {
  const statsRaw = state[`VisitorReviewStatsResult:${placeId}`];
  const stats = {
    totalCount:
      statsRaw?.visitorReviewsTotal ?? statsRaw?.review?.totalCount ?? 0,
    avgRating: statsRaw?.review?.avgRating ?? 0,
    imageReviewCount: statsRaw?.review?.imageReviewCount ?? 0,
  };

  const items = Object.entries(state)
    .filter(([key]) => key.startsWith("VisitorReview:"))
    .map(([, review]) => {
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
      };
    })
    .filter(Boolean)
    .sort((a, b) => b.createdSortKey.localeCompare(a.createdSortKey));

  return { items, stats };
}

async function fetchFeed(placeId) {
  const url = `https://m.place.naver.com/place/${placeId}/review/visitor?reviewSort=recent`;
  const response = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
      Accept: "text/html,application/xhtml+xml",
      "Accept-Language": "ko-KR,ko;q=0.9",
    },
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
    reviewUrl: `https://map.naver.com/p/entry/place/${placeId}?placePath=/review`,
    fetchedAt: new Date().toISOString(),
    stats,
    items,
  };
}

async function main() {
  const placeId = DEFAULT_PLACE_ID;
  const fallback = readExistingFeed();

  try {
    const feed = await fetchFeed(placeId);
    fs.mkdirSync(path.dirname(PUBLIC_DATA_PATH), { recursive: true });
    fs.writeFileSync(
      PUBLIC_DATA_PATH,
      `${JSON.stringify(feed, null, 2)}\n`,
      "utf8",
    );
    console.log(
      `Fetched ${feed.items.length} Naver place reviews (total ${feed.stats.totalCount}) → ${PUBLIC_DATA_PATH}`,
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (fallback?.items?.length) {
      console.warn(
        `Naver place reviews fetch failed (${message}). Keeping previous data (${fallback.items.length} reviews).`,
      );
      return;
    }
    console.error(message);
    process.exit(1);
  }
}

main();
