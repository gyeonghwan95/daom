"use client";

import { useEffect } from "react";
import { JsonLd } from "@/components/seo/JsonLd";
import type { Diagnosis } from "@/data/diagnosis";
import type { DiagnosisEvaluation } from "@/lib/diagnosis/evaluate";
import {
  buildResultSeoMeta,
  buildResultWebPageJsonLd,
} from "@/lib/diagnosis/result-enrichment";
import { siteConfig } from "@/lib/site";

type DiagnosisResultSeoProps = {
  diagnosis: Diagnosis;
  evaluation: DiagnosisEvaluation;
};

export function DiagnosisResultSeo({
  diagnosis,
  evaluation,
}: DiagnosisResultSeoProps) {
  const pagePath = `/${diagnosis.slug}`;
  const pageUrl = `${siteConfig.url.replace(/\/$/, "")}${pagePath}`;

  useEffect(() => {
    const originalTitle = document.title;
    const metaElement = document.querySelector('meta[name="description"]');
    const originalDescription = metaElement?.getAttribute("content") ?? "";

    const { title, description } = buildResultSeoMeta(diagnosis, evaluation);
    document.title = title;
    if (metaElement) {
      metaElement.setAttribute("content", description);
    }

    return () => {
      document.title = originalTitle;
      if (metaElement) {
        metaElement.setAttribute("content", originalDescription);
      }
    };
  }, [diagnosis, evaluation]);

  const faqJsonLd =
    diagnosis.faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: diagnosis.faqs.slice(0, 3).map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: item.answer,
            },
          })),
        }
      : null;

  return (
    <>
      <JsonLd data={buildResultWebPageJsonLd(diagnosis, evaluation, pageUrl)} />
      {faqJsonLd ? <JsonLd data={faqJsonLd} /> : null}
    </>
  );
}
