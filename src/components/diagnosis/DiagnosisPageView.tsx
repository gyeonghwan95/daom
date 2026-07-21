import { DiagnosisPage } from "@/components/diagnosis/DiagnosisPage";
import { DiagnosisFAQ } from "@/components/diagnosis/DiagnosisFAQ";
import { DiagnosisRelatedLinks } from "@/components/diagnosis/DiagnosisRelatedLinks";
import { DiagnosisSeoProse } from "@/components/diagnosis/DiagnosisSeoProse";
import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageCoverBanner } from "@/components/sections/PageCoverBanner";
import { RelatedRecommendations } from "@/components/internal-links/RelatedRecommendations";
import {
  ChecklistBox,
  ConsultationCTA,
  ContentSection,
  InfoCard,
  PageHero,
  PageTableOfContents,
  StepTimeline,
  SummaryBox,
  WarningBox,
} from "@/components/readability";
import { recommendationFromDiagnosis } from "@/lib/internal-links";
import { getDiagnosisResultRecommendations } from "@/lib/diagnosis/result-recommendations";
import type { Diagnosis } from "@/data/diagnosis";
import { getDiagnosisCtaCopy } from "@/lib/diagnosis/builder";
import { getCoverImageForPageData } from "@/lib/pageData/cover-image";
import { buildJsonLdForPageData } from "@/lib/pageData/json-ld";
import type { PageData } from "@/lib/pageData/types";

type DiagnosisPageViewProps = {
  page: PageData;
  diagnosis: Diagnosis;
};

export function DiagnosisPageView({ page, diagnosis }: DiagnosisPageViewProps) {
  const cover = getCoverImageForPageData(page);
  const cta = getDiagnosisCtaCopy(diagnosis);
  const busanTypes =
    diagnosis.busanConsultationTypes ?? diagnosis.targetUsers;
  const resultExplanation = diagnosis.resultExplanation ?? [];
  const conceptParagraphs = diagnosis.conceptParagraphs ?? [];
  const recommendationGroups = getDiagnosisResultRecommendations(diagnosis);

  const summaryBullets = [
    diagnosis.intro[0] ?? page.intro,
    resultExplanation[0] ?? null,
    diagnosis.requiredDocuments[0]
      ? `준비 서류: ${diagnosis.requiredDocuments[0]}`
      : null,
    diagnosis.processSteps[0]
      ? `절차: ${diagnosis.processSteps[0]}`
      : null,
    diagnosis.deadlineWarnings[0] ?? null,
  ].filter((item): item is string => Boolean(item)).slice(0, 5);

  const tocItems = [
    { id: "diagnosis", label: "자가진단 시작하기" },
    ...(resultExplanation.length > 0
      ? [{ id: "result-guide", label: "자가진단 결과 안내" }]
      : []),
    ...(conceptParagraphs.length > 0
      ? [{ id: "concept", label: `${diagnosis.serviceName} 기본 개념` }]
      : []),
    ...(busanTypes.length > 0
      ? [{ id: "busan-cases", label: "부산에서 많이 발생하는 상담 유형" }]
      : []),
    { id: "documents", label: "필요서류 체크리스트" },
    { id: "procedures", label: "절차 안내" },
    { id: "cost-factors", label: "비용이 달라지는 이유" },
    { id: "deadlines", label: "기간·기한·과태료 주의사항" },
    { id: "consultation-example", label: "실제 부산 상담 예시" },
    { id: "faq", label: "자주 묻는 질문" },
    { id: "related", label: "관련 페이지" },
    { id: "consultation", label: "상담 문의" },
  ];

  return (
    <article className="content-stack">
      <Breadcrumb items={page.breadcrumbs} />
      <BreadcrumbJsonLd items={page.breadcrumbs} currentPath={page.path} />
      <JsonLd data={buildJsonLdForPageData(page)} />

      <PageCoverBanner image={cover} />

      <PageHero
        h1={page.h1}
        intro={diagnosis.intro[0] ?? page.intro}
        keywords={page.primaryKeywords}
        ctaLabel="자가진단 후 상담하기"
      />

      <SummaryBox items={summaryBullets} />

      <PageTableOfContents items={tocItems} />

      <ContentSection id="diagnosis" title="자가진단 시작하기">
        <DiagnosisPage
          diagnosis={diagnosis}
          recommendationGroups={recommendationGroups}
        />
      </ContentSection>

      {resultExplanation.length > 0 ? (
        <ContentSection id="result-guide" title="자가진단 결과 안내">
          <DiagnosisSeoProse paragraphs={resultExplanation} />
        </ContentSection>
      ) : null}

      {conceptParagraphs.length > 0 ? (
        <ContentSection id="concept" title={`${diagnosis.serviceName} 기본 개념`}>
          <DiagnosisSeoProse paragraphs={conceptParagraphs} />
        </ContentSection>
      ) : null}

      {busanTypes.length > 0 ? (
        <ContentSection id="busan-cases" title="부산에서 많이 발생하는 상담 유형">
          <ChecklistBox items={busanTypes} />
        </ContentSection>
      ) : null}

      <ContentSection id="documents" title="필요서류 체크리스트">
        <ChecklistBox
          items={diagnosis.requiredDocuments}
          note="상담 전에 서류를 먼저 확인해 두시면 검토가 수월합니다."
        />
      </ContentSection>

      <ConsultationCTA
        title="자가진단 전에 서류를 먼저 확인해 보세요"
        description="아래 체크리스트를 보신 뒤 자가진단을 시작하거나, 편한 방법으로 상담해 보세요."
        buttonLabel="상담 문의하기"
      />

      <ContentSection id="procedures" title="절차 안내">
        <StepTimeline steps={diagnosis.processSteps} />
      </ContentSection>

      <ContentSection id="cost-factors" title="비용이 달라지는 이유">
        <ChecklistBox items={diagnosis.costFactors} />
      </ContentSection>

      <ContentSection id="deadlines" title="기간·기한·과태료 주의사항">
        <div className="space-y-3">
          {diagnosis.deadlineWarnings.map((item) => (
            <WarningBox key={item} title="기한·주의사항">
              <p>{item}</p>
            </WarningBox>
          ))}
        </div>
        <WarningBox title="안내">
          <p>
            기한과 과태료는 사안·관할·신고 시점에 따라 달라질 수 있습니다.
            확정 판단은 상담을 통해 확인해 보시는 것이 좋습니다.
          </p>
        </WarningBox>
      </ContentSection>

      <ContentSection id="consultation-example" title="실제 부산 상담 예시">
        <InfoCard variant="highlight">
          <h3 className="text-lg font-semibold text-navy">
            {diagnosis.caseExample.title}
          </h3>
          <p className="body-text mt-3 leading-relaxed">
            {diagnosis.caseExample.body}
          </p>
        </InfoCard>
      </ContentSection>

      <DiagnosisFAQ items={diagnosis.faqs} />

      <DiagnosisRelatedLinks links={page.internalLinks} />

      <RelatedRecommendations source={recommendationFromDiagnosis(diagnosis)} />

      <div id="consultation">
        <ConsultationCTA
          title="내 상황에 맞는 서류와 절차를 확인하고 상담하기"
          description={cta.text}
          buttonLabel="상담 문의하기"
        />
      </div>
    </article>
  );
}

export { DiagnosisHubView } from "@/components/diagnosis/DiagnosisHubView";
