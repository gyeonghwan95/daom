import type { Metadata } from "next";
import {
  ServicesIndexTemplate,
  servicesIndexMetadata,
} from "@/components/templates/ServicePages";

export const metadata: Metadata = servicesIndexMetadata;

export default function ServicesPage() {
  return <ServicesIndexTemplate />;
}
