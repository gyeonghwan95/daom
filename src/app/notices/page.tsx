import type { Metadata } from "next";
import { NoticesPageView } from "@/components/notices/NoticesPageView";
import { createPageMetadata } from "@/lib/metadata";
import { staticPageSeo } from "@/lib/seo/page-seo";

/**
 * ASCII alias — 정적 export에서 한글 폴더 InvalidCharacterError 회피.
 * 정식 URL은 `/공지사항` ([landingSlug]).
 */
export const metadata: Metadata = createPageMetadata(staticPageSeo.notices);

export default function NoticesAliasPage() {
  return <NoticesPageView />;
}
