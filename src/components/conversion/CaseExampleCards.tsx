import { ContentSection, InfoCard } from "@/components/readability";
import { CASE_EXAMPLES_INTRO } from "@/lib/service-conversion/copy";
import type { ServiceConversionCaseExample } from "@/lib/service-conversion/types";

type CaseExampleCardsProps = {
  examples: ServiceConversionCaseExample[];
};

export function CaseExampleCards({ examples }: CaseExampleCardsProps) {
  return (
    <ContentSection id="conversion-cases" title="실제 상담 유형 예시">
      <p className="body-text max-w-3xl text-navy/70">
        {CASE_EXAMPLES_INTRO}
      </p>
      <ul className="mt-4 grid gap-4 md:grid-cols-2">
        {examples.map((example) => (
          <li key={example.title}>
            <InfoCard variant="highlight">
              <h3 className="font-semibold text-navy">{example.title}</h3>
              <p className="body-text mt-2 text-sm md:text-base">
                {example.body}
              </p>
            </InfoCard>
          </li>
        ))}
      </ul>
    </ContentSection>
  );
}
