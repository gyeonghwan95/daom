import type { Metadata } from "next";
import { LegalDocumentView } from "@/components/legal/LegalDocumentView";
import {
  getPrivacyPolicyDocument,
  LEGAL_PATHS,
} from "@/lib/legal";
import { createPageMetadata } from "@/lib/metadata";
import { buildSeoTitle } from "@/lib/seo/metadata";

const document = getPrivacyPolicyDocument();

export const metadata: Metadata = createPageMetadata({
  title: buildSeoTitle(document.title),
  description: document.metaDescription,
  path: document.path,
  keywords: document.keywords,
});

export default function PrivacyPolicyPage() {
  return (
    <LegalDocumentView
      document={document}
      counterpart={{ href: LEGAL_PATHS.terms, label: "이용약관" }}
    />
  );
}
