import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  ServiceDetailTemplate,
  getServicePageMetadata,
} from "@/components/templates/ServicePages";
import { getAllServiceSlugs, getServiceBySlug } from "@/lib/services-data";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllServiceSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return {};
  return getServicePageMetadata(service);
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) notFound();
  return <ServiceDetailTemplate service={service} />;
}
