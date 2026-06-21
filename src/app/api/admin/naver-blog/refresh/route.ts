import { NextResponse } from "next/server";
import { isAdminConfigured } from "@/lib/admin/config";
import { getAdminSessionFromRequest } from "@/lib/admin/request";
import { fetchNaverBlogFeed } from "@/lib/naver-blog/rss";
import { writeNaverBlogFeedToDisk } from "@/lib/naver-blog/store";

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
    const feed = await fetchNaverBlogFeed();
    const { persisted, path } = writeNaverBlogFeedToDisk(feed);

    return NextResponse.json({
      ok: true,
      persisted,
      path,
      feed,
      message: `${feed.items.length}개의 네이버 블로그 글을 갱신했습니다.`,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "네이버 블로그 갱신에 실패했습니다.",
      },
      { status: 502 },
    );
  }
}
