import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildFullServiceCatalogSchema } from "@/lib/seo/json-ld";
import {
  ServicesIndexTemplate,
  servicesIndexMetadata,
} from "@/components/templates/ServicePages";

export const metadata: Metadata = servicesIndexMetadata;

export default function ServicesPage() {
  return (
    <>
      <JsonLd data={buildFullServiceCatalogSchema()} />
      <ServicesIndexTemplate />
    </>
  );
}
