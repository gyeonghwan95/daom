"use client";

import { LawyerConsultationGuide } from "@/components/consultation/LawyerConsultationGuide";

type DiagnosisCTAProps = {
  title?: string;
  description?: string;
  compact?: boolean;
  className?: string;
  pageSlug?: string;
};

export function DiagnosisCTA({
  title = "법무사 상담 안내",
  description = "진단 결과는 일반적인 안내입니다. 서류와 사실관계 확인이 필요합니다.",
  compact = false,
  className = "",
  pageSlug = "자가진단",
}: DiagnosisCTAProps) {
  return (
    <LawyerConsultationGuide
      title={title}
      description={description}
      showFeeNotice={!compact}
      showSecondaryLinks
      compact={compact}
      className={className}
      pageSlug={pageSlug}
    />
  );
}
