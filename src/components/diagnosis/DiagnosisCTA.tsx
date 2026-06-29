"use client";

import { PageConversionCTA } from "@/components/consultation/PageConversionCTA";

type DiagnosisCTAProps = {
  title?: string;
  description?: string;
  compact?: boolean;
  className?: string;
  pageSlug?: string;
  variant?: "mid" | "bottom";
  pageType?: "diagnosis-result" | "default";
};

export function DiagnosisCTA({
  title,
  description,
  compact = false,
  className = "",
  pageSlug = "자가진단",
  variant = "bottom",
  pageType = "diagnosis-result",
}: DiagnosisCTAProps) {
  return (
    <PageConversionCTA
      pageType={pageType}
      variant={variant}
      title={title}
      description={description}
      pageSlug={pageSlug}
      showFeeNotice={!compact && variant === "bottom"}
      showSecondaryLinks={variant === "bottom"}
      className={className}
    />
  );
}
