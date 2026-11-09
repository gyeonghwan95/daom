import { ChecklistBox, ContentSection } from "@/components/readability";
import { consultationReassurance } from "@/lib/consultation-copy";

type CostGuideBoxProps = {
  guideText: string;
  factors: string[];
  title?: string;
};

export function CostGuideBox({
  guideText,
  factors,
  title = "이런 경우 비용이 달라집니다",
}: CostGuideBoxProps) {
  return (
    <ContentSection id="conversion-cost" title={title}>
      <p className="body-text max-w-3xl font-medium text-navy/90">
        {consultationReassurance.cost}
      </p>
      <p className="body-text mt-3 max-w-3xl text-navy/80">{guideText}</p>
      <div className="mt-4">
        <ChecklistBox items={factors} />
      </div>
    </ContentSection>
  );
}
