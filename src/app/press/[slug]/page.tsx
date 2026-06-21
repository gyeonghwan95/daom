import { redirect } from "next/navigation";
import { getPressArticleSlugs } from "@/lib/press-articles";

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
