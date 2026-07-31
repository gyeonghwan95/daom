"use client";

import { useSearchParams } from "next/navigation";
import { ConsultationInquiryForm } from "./ConsultationInquiryForm";

export function InquiryFormLoader() {
  const searchParams = useSearchParams();
  const field = searchParams.get("field") ?? undefined;
  const from = searchParams.get("from") ?? undefined;
  const region = searchParams.get("region") ?? undefined;
  const intent = searchParams.get("intent") ?? undefined;
  const docs = searchParams.get("docs") ?? undefined;
  const cost = searchParams.get("cost") ?? undefined;

  return (
    <ConsultationInquiryForm
      defaultField={field}
      nationwideMode={from === "nationwide" || Boolean(region)}
      defaultPropertyRegion={region}
      sourcePage={from}
      intentHint={intent}
      preparedDocsHint={docs}
      costGuideRequested={cost === "1" || cost === "true" || intent?.includes("비용")}
    />
  );
}
