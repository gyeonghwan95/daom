import type { Metadata } from "next";
import { SearchGuidesHubView } from "@/components/local-landing/SearchGuidesHubView";
import { createPageMetadata } from "@/lib/metadata";
import { staticPageSeo } from "@/lib/seo/page-seo";

export const metadata: Metadata = createPageMetadata(staticPageSeo.searchGuides);

export default function SearchGuidesPage() {
  return <SearchGuidesHubView />;
}
