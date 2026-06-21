import { redirect } from "next/navigation";
import { getContentSlugs } from "@/lib/content/loader";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getContentSlugs("cases").map((slug) => ({ slug }));
}

export default async function LegacyCaseDetailPage({ params }: Props) {
  const { slug } = await params;
  redirect(`/services/cases/${slug}`);
}
