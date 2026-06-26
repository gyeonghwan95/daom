import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageContainer } from "@/components/layout/PageContainer";
import { LocalLandingContent } from "@/components/local-landing/LocalLandingContent";
import { TopicHubContent } from "@/components/topic-hubs/TopicHubContent";
import {
  getAllLocalLandingSlugs,
  getLocalLandingBySlug,
} from "@/lib/local-landing";
import { createPageMetadata } from "@/lib/metadata";
import { buildSeoTitle } from "@/lib/seo/metadata";
import { getServiceImage } from "@/lib/site-images";
import { getAllTopicHubSlugs, getTopicHubBySlug } from "@/lib/topic-hubs";

type PageProps = {
  params: Promise<{ landingSlug: string }>;
};

export function generateStaticParams() {
  return [
    ...getAllLocalLandingSlugs().map((landingSlug) => ({ landingSlug })),
    ...getAllTopicHubSlugs().map((landingSlug) => ({ landingSlug })),
  ];
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { landingSlug } = await params;

  const hub = getTopicHubBySlug(landingSlug);
  if (hub) {
    return createPageMetadata({
      title: buildSeoTitle(hub.title),
      description: hub.description,
      path: hub.path,
      keywords: [
        hub.title,
        "부산 법무사",
        "다옴법무사사무소",
        "안윤정 법무사",
      ],
      ogImage: getServiceImage(hub.primaryServiceSlug).src,
    });
  }

  const page = getLocalLandingBySlug(landingSlug);
  if (!page) return {};

  return createPageMetadata({
    title: buildSeoTitle(page.title),
    description: page.description,
    path: page.path,
    keywords: [
      page.title,
      `${page.regionLabel} 법무사`,
      "부산 법무사",
      "다옴법무사사무소",
      "안윤정 법무사",
    ],
    ogImage: getServiceImage(page.serviceSlug).src,
  });
}

export default async function LocalLandingPage({ params }: PageProps) {
  const { landingSlug } = await params;

  const hub = getTopicHubBySlug(landingSlug);
  if (hub) {
    return (
      <PageContainer>
        <TopicHubContent page={hub} />
      </PageContainer>
    );
  }

  const page = getLocalLandingBySlug(landingSlug);
  if (!page) notFound();

  return (
    <PageContainer>
      <LocalLandingContent page={page} />
    </PageContainer>
  );
}
