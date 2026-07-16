import { ChecklistBox, ContentSection } from "@/components/readability";

type CostGuideBoxProps = {
  guideText: string;
  factors: string[];
};

export function CostGuideBox({ guideText, factors }: CostGuideBoxProps) {
  return (
    <ContentSection id="conversion-cost" title="이런 경우 비용이 달라집니다">
      <p className="body-text max-w-3xl text-navy/80">{guideText}</p>
      <div className="mt-4">
        <ChecklistBox items={factors} />
      </div>
    </ContentSection>
  );
}
