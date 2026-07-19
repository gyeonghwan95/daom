"use client";

import { useSearchParams } from "next/navigation";
import { ConsultationInquiryForm } from "./ConsultationInquiryForm";

export function InquiryFormLoader() {
  const searchParams = useSearchParams();
  const field = searchParams.get("field") ?? undefined;
  const from = searchParams.get("from") ?? undefined;
  const region = searchParams.get("region") ?? undefined;

  return (
    <ConsultationInquiryForm
      defaultField={field}
      nationwideMode={from === "nationwide" || Boolean(region)}
      defaultPropertyRegion={region}
    />
  );
}
