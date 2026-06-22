import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getContentSlugs } from "@/lib/content/loader";

export const metadata: Metadata = {
  robots: { index: false, follow: true },
};

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
