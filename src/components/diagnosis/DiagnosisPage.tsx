"use client";

import { useState } from "react";
import type { Diagnosis } from "@/data/diagnosis";
import { DiagnosisForm } from "@/components/diagnosis/DiagnosisForm";
import { StickyMobileCTA } from "@/components/diagnosis/StickyMobileCTA";

import type { DiagnosisRecommendationGroups } from "@/lib/diagnosis/result-recommendations";

type DiagnosisPageProps = {
  diagnosis: Diagnosis;
  recommendationGroups: DiagnosisRecommendationGroups;
};

export function DiagnosisPage({
  diagnosis,
  recommendationGroups,
}: DiagnosisPageProps) {
  const [phase, setPhase] = useState<"questions" | "result">("questions");

  return (
    <div className={phase === "result" ? "pb-20 lg:pb-0" : "pb-4"}>
      <DiagnosisForm
        diagnosis={diagnosis}
        onPhaseChange={setPhase}
        recommendationGroups={recommendationGroups}
      />
      <StickyMobileCTA visible={phase === "result"} pageSlug={diagnosis.slug} />
    </div>
  );
}
