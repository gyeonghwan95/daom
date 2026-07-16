import { ChecklistBox, ContentSection } from "@/components/readability";

type ConsultationSituationBoxProps = {
  painPoints: string[];
};

export function ConsultationSituationBox({
  painPoints,
}: ConsultationSituationBoxProps) {
  return (
    <ContentSection id="conversion-situations" title="이런 상황이면 상담해보세요">
      <ChecklistBox items={painPoints} />
    </ContentSection>
  );
}
