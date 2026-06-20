import { JsonLd } from "@/components/seo/JsonLd";
import { buildGlobalSchemas } from "@/lib/seo/json-ld";

export function GlobalJsonLd() {
  return <JsonLd data={buildGlobalSchemas()} />;
}
