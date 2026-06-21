import { NextResponse } from "next/server";
import { isAdminConfigured } from "@/lib/admin/config";
import { getAdminSessionFromRequest } from "@/lib/admin/request";
import { fetchNaverPlaceReviewsFeed } from "@/lib/naver-place-reviews/fetch";
import { writeNaverPlaceReviewsToDisk } from "@/lib/naver-place-reviews/store";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!isAdminConfigured()) {
    return NextResponse.json(
      { error: "관리자 기능이 설정되지 않았습니다." },
      { status: 503 },
    );
  }

  if (!getAdminSessionFromRequest(request)) {
    return NextResponse.json({ error: "관리자 인증이 필요합니다." }, { status: 401 });
  }

  try {
    const feed = await fetchNaverPlaceReviewsFeed();
    const { persisted, path } = writeNaverPlaceReviewsToDisk(feed);

    return NextResponse.json({
      ok: true,
      persisted,
      path,
      feed,
      message: `${feed.items.length}개의 네이버 방문자 리뷰를 갱신했습니다.`,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "네이버 플레이스 리뷰 갱신에 실패했습니다.",
      },
      { status: 502 },
    );
  }
}
