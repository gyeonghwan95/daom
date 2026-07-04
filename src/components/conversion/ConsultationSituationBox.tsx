import { ContentSection, InfoCard } from "@/components/readability";

type ConsultationSituationBoxProps = {
  painPoints: string[];
};

export function ConsultationSituationBox({
  painPoints,
}: ConsultationSituationBoxProps) {
  return (
    <ContentSection id="conversion-situations" title="이런 상황이면 상담해보세요">
      <ul className="grid gap-3 sm:grid-cols-2">
        {painPoints.map((point) => (
          <li key={point}>
            <InfoCard variant="highlight">
              <p className="text-sm leading-relaxed text-navy/85 md:text-base">
                {point}
              </p>
            </InfoCard>
          </li>
        ))}
      </ul>
    </ContentSection>
  );
}
