import Link from "next/link";
import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { JsonLd } from "@/components/seo/JsonLd";
import { FAQAccordion } from "@/components/sections/FAQAccordion";
import { PageCoverBanner } from "@/components/sections/PageCoverBanner";
import {
  ChecklistBox,
  ConsultationCTA,
  ContentSection,
  InfoCard,
  PageHero,
  PageTableOfContents,
  ProseParagraphs,
  RelatedContentGrid,
  StepTimeline,
  SummaryBox,
  WarningBox,
} from "@/components/readability";
import { ArticleVisualSlot } from "@/components/media/ArticleVisual";
import { BusinessCredentialSlot } from "@/components/credentials/BusinessCredentialSlot";
import type { AgencyTaskCard } from "@/lib/local-landing/public-agency-registration-content";
import { getPublicAgencyRegistrationContent } from "@/lib/local-landing/public-agency-registration-content";
import { PublicAgencyB2BSections } from "@/components/b2b/PublicAgencyB2BSections";
import { getCoverImageForPageData } from "@/lib/pageData/cover-image";
import { buildJsonLdForPageData } from "@/lib/pageData/json-ld";
import type { PageData } from "@/lib/pageData/types";

type PublicAgencyRegistrationPageViewProps = {
  page: PageData;
};

function TaskCard({ task }: { task: AgencyTaskCard }) {
  return (
    <InfoCard variant="highlight">
      <h3 className="text-base font-semibold text-navy md:text-lg">{task.title}</h3>
      <dl className="mt-3 space-y-2 text-sm leading-relaxed text-navy/85 md:text-base">
        <div>
          <dt className="font-medium text-navy">언제 필요한지</dt>
          <dd className="mt-0.5">{task.whenNeeded}</dd>
        </div>
        <div>
          <dt className="font-medium text-navy">확인할 내부문서</dt>
          <dd className="mt-0.5">{task.internalDocs}</dd>
        </div>
        <div>
          <dt className="font-medium text-navy">주의할 점</dt>
          <dd className="mt-0.5">{task.caution}</dd>
        </div>
      </dl>
      {task.links.length > 0 ? (
        <ul className="mt-3 flex flex-wrap gap-2">
          {task.links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-sm font-medium text-navy-light underline hover:text-navy"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </InfoCard>
  );
}

export function PublicAgencyRegistrationPageView({
  page,
}: PublicAgencyRegistrationPageViewProps) {
  const content = getPublicAgencyRegistrationContent();
  const cover = getCoverImageForPageData(page);

  const faqSchemaPage: PageData = {
    ...page,
    faqs: content.faqs,
    includeFaqSchema: true,
  };

  const tocItems = [
    { id: "summary", label: "핵심 요약" },
    { id: "role-intents", label: "어떤 업무인가요" },
    { id: "what-is", label: "등기업무란" },
    { id: "institutions", label: "대상 기관" },
    { id: "corporate", label: "법인등기" },
    { id: "real-estate", label: "부동산등기" },
    { id: "comparison", label: "촉탁·일반 비교" },
    { id: "scope", label: "업무범위 구분" },
    { id: "pre-check", label: "담당자 1분 체크" },
    { id: "documents", label: "준비 서류" },
    { id: "procedures", label: "진행 절차" },
    { id: "inquiry-flow", label: "문의·수행 흐름" },
    { id: "problems", label: "자주 생기는 문제" },
    { id: "quote", label: "견적 전 확인" },
    { id: "procurement", label: "용역·수행범위" },
    { id: "busan", label: "부산 상담" },
    { id: "faq", label: "자주 묻는 질문" },
    { id: "related", label: "관련 페이지" },
    { id: "consultation", label: "업무 문의" },
  ];

  return (
    <article className="content-stack">
      <Breadcrumb items={page.breadcrumbs} />
      <BreadcrumbJsonLd items={page.breadcrumbs} currentPath={page.path} />
      <JsonLd data={buildJsonLdForPageData(faqSchemaPage)} />

      <PageCoverBanner image={cover} />

      <PageHero
        h1={content.h1}
        eyebrow={content.eyebrow}
        introParagraphs={content.heroParagraphs}
        keywords={content.primaryKeywords}
        ctaHref="/협업문의?partner=public&service=public"
        ctaLabel="공공기관·단체 업무 문의"
        secondaryCta={{
          href: "#role-intents",
          label: "어떤 업무인지 확인하기",
        }}
        showDiagnosisCta={false}
      />

      <div id="summary">
        <SummaryBox items={content.summaryBullets} />
      </div>

      <BusinessCredentialSlot
        fixed={{ variant: "panel", copyGroup: "partnership" }}
        panelTitle="공공·기업 협업을 위한 기업확인서류 보유"
        panelBody="다옴법무사사무소는 여성기업·중소기업·창업기업 확인서를 보유하고 있습니다. 공공기관·출연기관과의 계약 및 증빙 절차에서 확인서류가 필요한 경우 유효한 서류를 제출할 수 있습니다. 계약상 혜택·가점 여부는 각 공고와 적용 법령에 따라 달라질 수 있어 별도 확인이 필요합니다."
      />

      <ArticleVisualSlot
        path={page.path}
        slot="after-intro"
        category={page.category}
        serviceSlug={page.serviceSlug}
      />

      <PageTableOfContents items={tocItems} />

      <ContentSection id="role-intents" title="어떤 업무를 찾고 계신가요?">
        <p className="body-text mb-4 max-w-3xl">{content.roleIntentIntro}</p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {content.roleIntentCards.map((card) => (
            <InfoCard key={card.id} variant="highlight">
              <h3 className="text-base font-semibold text-navy md:text-lg">
                {card.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-navy/85 md:text-base">
                {card.description}
              </p>
              <p className="mt-3">
                <Link
                  href={card.href}
                  className="text-sm font-medium text-navy-light underline hover:text-navy"
                >
                  {card.ctaLabel}
                </Link>
              </p>
            </InfoCard>
          ))}
        </div>
      </ContentSection>

      <ContentSection id="what-is" title="공공기관 등기업무란?">
        <ProseParagraphs paragraphs={content.whatIsParagraphs} />
      </ContentSection>

      <ContentSection id="institutions" title="대상 기관">
        <div className="grid gap-3 sm:grid-cols-2">
          {content.institutionTypes.map((card) => (
            <InfoCard key={card.title} variant="highlight">
              <h3 className="text-base font-semibold text-navy md:text-lg">
                {card.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-navy/85 md:text-base">
                {card.description}
              </p>
              <p className="mt-3 text-xs text-navy/65 md:text-sm">
                등기 예시: {card.examples.join(" · ")}
              </p>
            </InfoCard>
          ))}
        </div>
      </ContentSection>

      <ContentSection id="corporate" title="공공기관 법인등기">
        <p className="body-text mb-4 max-w-3xl">
          공기업·지방공기업·출연기관 등에서 자주 발생하는 법인등기 유형입니다.
          내부 의결과 정관을 함께 확인합니다.
        </p>
        <div className="grid gap-3 lg:grid-cols-2">
          {content.corporateTasks.map((task) => (
            <TaskCard key={task.title} task={task} />
          ))}
        </div>
      </ContentSection>

      <ContentSection id="real-estate" title="공공기관 부동산등기">
        <p className="body-text mb-4 max-w-3xl">
          공유재산, 공공사업, 보상, 신축 시설 등과 관련된 부동산 등기입니다.
          원인서류·관할·촉탁 가능성·세금을 함께 검토합니다.
        </p>
        <div className="grid gap-3 lg:grid-cols-2">
          {content.realEstateTasks.map((task) => (
            <TaskCard key={task.title} task={task} />
          ))}
        </div>
      </ContentSection>

      <ContentSection
        id="comparison"
        title="촉탁등기와 일반 등기신청 차이"
      >
        <div className="overflow-x-auto rounded-xl border border-beige-dark">
          <table className="min-w-full text-left text-sm md:text-base">
            <thead className="bg-beige/60 text-navy">
              <tr>
                <th className="px-4 py-3 font-semibold md:px-6">항목</th>
                <th className="px-4 py-3 font-semibold md:px-6">촉탁등기</th>
                <th className="px-4 py-3 font-semibold md:px-6">일반 등기신청</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-beige-dark bg-white">
              {content.comparisonRows.map((row) => (
                <tr key={row.label}>
                  <th className="px-4 py-3 font-medium text-navy md:px-6">
                    {row.label}
                  </th>
                  <td className="px-4 py-3 leading-relaxed text-navy/85 md:px-6">
                    {row.commissioned}
                  </td>
                  <td className="px-4 py-3 leading-relaxed text-navy/85 md:px-6">
                    {row.general}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <WarningBox title="촉탁등기 안내">
          <p>{content.comparisonNote}</p>
        </WarningBox>
      </ContentSection>

      <ContentSection id="scope" title="법무사가 지원 가능한 범위">
        <p className="body-text mb-4 max-w-3xl">{content.scopeIntro}</p>
        <div className="overflow-x-auto rounded-xl border border-beige-dark">
          <table className="min-w-full text-left text-sm md:text-base">
            <thead className="bg-beige/60 text-navy">
              <tr>
                <th className="px-4 py-3 font-semibold md:px-6">업무</th>
                <th className="px-4 py-3 font-semibold md:px-6">구분</th>
                <th className="px-4 py-3 font-semibold md:px-6">안내</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-beige-dark bg-white">
              {content.scopeRows.map((row) => (
                <tr key={row.topic}>
                  <th className="px-4 py-3 font-medium text-navy md:px-6">
                    {row.topic}
                  </th>
                  <td className="px-4 py-3 font-medium text-navy/85 md:px-6">
                    {row.classification}
                  </td>
                  <td className="px-4 py-3 leading-relaxed text-navy/85 md:px-6">
                    {row.note}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ContentSection>

      <ContentSection
        id="pre-check"
        title="기관에서 법무사를 찾기 전에 확인할 사항"
      >
        <p className="body-text mb-4 max-w-3xl">{content.staffMinuteIntro}</p>
        <ChecklistBox items={content.staffMinuteChecklist} />
        <p className="mt-4 text-sm text-navy/70 md:text-base">
          추가로 내부에서 확인하면 좋은 항목입니다.
        </p>
        <ChecklistBox items={content.preChecklist} />
      </ContentSection>

      <ContentSection id="documents" title="준비서류">
        <p className="body-text mb-4 max-w-3xl">
          기관별·업무별로 필요서류가 달라질 수 있습니다. 아래는 공통적으로
          확인하는 항목입니다.
        </p>
        <ChecklistBox items={content.documents} note={content.documentsNote} />
      </ContentSection>

      <ArticleVisualSlot
        path={page.path}
        slot="before-procedures"
        category={page.category}
        serviceSlug={page.serviceSlug}
      />

      <ContentSection id="procedures" title="공공기관 등기 진행 절차">
        <StepTimeline steps={content.procedures} />
      </ContentSection>

      <ContentSection id="inquiry-flow" title="문의부터 결과 안내까지의 흐름">
        <p className="body-text mb-4 max-w-3xl">{content.inquiryProcessIntro}</p>
        <StepTimeline steps={content.inquiryProcessSteps} />
      </ContentSection>

      <ContentSection id="problems" title="공공기관 등기에서 자주 생기는 문제">
        <div className="grid gap-3 sm:grid-cols-2">
          {content.commonProblems.map((problem) => (
            <WarningBox key={problem} title="주의 사항">
              <p>{problem}</p>
            </WarningBox>
          ))}
        </div>
      </ContentSection>

      <ContentSection id="quote" title="기관 업무 견적을 위해 먼저 확인할 정보">
        <p className="body-text mb-4 max-w-3xl">{content.quoteIntro}</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {content.quoteCheckItems.map((item) => (
            <InfoCard key={item.label} variant="highlight">
              <h3 className="text-base font-semibold text-navy md:text-lg">
                {item.label}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-navy/85 md:text-base">
                {item.hint}
              </p>
            </InfoCard>
          ))}
        </div>
      </ContentSection>

      <ContentSection id="procurement" title={content.procurementTitle}>
        <ProseParagraphs paragraphs={content.procurementParagraphs} />
      </ContentSection>

      <ContentSection id="busan" title={content.busanTitle}>
        <ProseParagraphs paragraphs={content.busanParagraphs} />
      </ContentSection>

      <PublicAgencyB2BSections />

      <ContentSection id="faq" title="자주 묻는 질문">
        <FAQAccordion items={content.faqs} />
      </ContentSection>

      <ContentSection id="related" title="관련 내부 링크">
        <RelatedContentGrid links={content.internalLinks} />
      </ContentSection>

      <div id="consultation">
        <ConsultationCTA
          title="공공기관·단체 업무 문의"
          description={content.bottomCtaText}
          buttonLabel="공공기관·단체 업무 문의"
          href="/협업문의?partner=public&service=public"
          showNaverReservation={false}
          showAboutLawyer={false}
        />
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/협업문의?partner=public&service=public" className="btn-primary inline-flex min-h-12 items-center px-6">
            등기업무 협의
          </Link>
          <Link
            href="/협업문의?partner=public&service=quote"
            className="btn-secondary inline-flex min-h-12 items-center px-6"
          >
            업무범위 및 견적 문의
          </Link>
          <Link
            href="/공공기관법률교육"
            className="btn-secondary inline-flex min-h-12 items-center px-6"
          >
            법률교육·특강 문의
          </Link>
        </div>
      </div>
    </article>
  );
}
