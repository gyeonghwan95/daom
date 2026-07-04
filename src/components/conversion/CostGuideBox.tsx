import { ContentSection, InfoCard } from "@/components/readability";

type CostGuideBoxProps = {
  guideText: string;
  factors: string[];
};

export function CostGuideBox({ guideText, factors }: CostGuideBoxProps) {
  return (
    <ContentSection id="conversion-cost" title="이런 경우 비용이 달라집니다">
      <p className="body-text max-w-3xl text-navy/80">{guideText}</p>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {factors.map((factor) => (
          <li key={factor}>
            <InfoCard>
              <p className="text-sm leading-relaxed text-navy/85 md:text-base">
                {factor}
              </p>
            </InfoCard>
          </li>
        ))}
      </ul>
    </ContentSection>
  );
}
