import type { Metadata } from "next";
import { LegalDocumentView } from "@/components/legal/LegalDocumentView";
import {
  getTermsOfUseDocument,
  LEGAL_PATHS,
} from "@/lib/legal";
import { createPageMetadata } from "@/lib/metadata";
import { buildSeoTitle } from "@/lib/seo/metadata";

const document = getTermsOfUseDocument();

/** ASCII 별칭 — 정적 export에서 한글 폴더 라우트의 InvalidCharacterError 회피 */
export const metadata: Metadata = createPageMetadata({
  title: buildSeoTitle(document.title),
  description: document.metaDescription,
  path: document.path,
  keywords: document.keywords,
});

export default function TermsAliasPage() {
  return (
    <LegalDocumentView
      document={document}
      counterpart={{ href: LEGAL_PATHS.privacy, label: "개인정보처리방침" }}
    />
  );
}
