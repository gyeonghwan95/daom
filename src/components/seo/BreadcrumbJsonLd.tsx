import { JsonLd } from "@/components/seo/JsonLd";
import { buildBreadcrumbSchema } from "@/lib/seo/json-ld";
import type { BreadcrumbItem } from "@/types/breadcrumb";

type BreadcrumbJsonLdProps = {
  items: BreadcrumbItem[];
  currentPath: string;
};

export function BreadcrumbJsonLd({ items, currentPath }: BreadcrumbJsonLdProps) {
  if (items.length === 0) return null;
  return (
    <JsonLd data={buildBreadcrumbSchema(items, currentPath)} />
  );
}
