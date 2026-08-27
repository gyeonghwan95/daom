"use client";

import type { Diagnosis } from "@/data/diagnosis";
import { DiagnosisForm } from "@/components/diagnosis/DiagnosisForm";
import type { DiagnosisRecommendationGroups } from "@/lib/diagnosis/result-recommendations";

type DiagnosisPageProps = {
  diagnosis: Diagnosis;
  recommendationGroups: DiagnosisRecommendationGroups;
};

export function DiagnosisPage({
  diagnosis,
  recommendationGroups,
}: DiagnosisPageProps) {
  return (
    <div className="pb-4">
      <DiagnosisForm
        diagnosis={diagnosis}
        recommendationGroups={recommendationGroups}
      />
    </div>
  );
}
