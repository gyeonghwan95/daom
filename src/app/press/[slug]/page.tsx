import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getPressArticleSlugs } from "@/lib/press-articles";

export const metadata: Metadata = {
  robots: { index: false, follow: true },
};

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getPressArticleSlugs().map((slug) => ({ slug }));
}

export default async function LegacyPressDetailPage({ params }: Props) {
  const { slug } = await params;
  redirect(`/media/${slug}`);
}
