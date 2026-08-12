import type { Metadata } from "next";
import { NoticeDetailPageView } from "@/components/notices/NoticeDetailPageView";
import { createPageMetadata } from "@/lib/metadata";

/**
 * ASCII alias — 정식 URL은 `/공지사항/보기`.
 * 단기 공지 상세는 noindex.
 */
export const metadata: Metadata = {
  ...createPageMetadata({
    title: "공지사항 상세 | 다옴법무사사무소",
    description: "다옴법무사사무소 공지사항 상세 안내입니다.",
    path: "/공지사항/보기",
  }),
  robots: { index: false, follow: true },
};

export default function NoticeDetailAliasPage() {
  return <NoticeDetailPageView />;
}
