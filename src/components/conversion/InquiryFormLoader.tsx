"use client";

import { useSearchParams } from "next/navigation";
import { ConsultationInquiryForm } from "./ConsultationInquiryForm";

export function InquiryFormLoader() {
  const searchParams = useSearchParams();
  const field = searchParams.get("field") ?? undefined;

  return <ConsultationInquiryForm defaultField={field} />;
}
