import Link from "next/link";
import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { JsonLd } from "@/components/seo/JsonLd";
import { FAQAccordion } from "@/components/sections/FAQAccordion";
import { CTASection } from "@/components/sections/CTASection";
import { BusinessInquiryForm } from "@/components/business/BusinessInquiryForm";
import {
  ContentSection,
  PageHero,
  PageTableOfContents,
  ProseParagraphs,
  RelatedContentGrid,
  StepTimeline,
  SummaryBox,
  WarningBox,
} from "@/components/readability";
import { getBusinessContent } from "@/lib/business/content";
import { buildJsonLdForPageData } from "@/lib/pageData/json-ld";
import type { PageData } from "@/lib/pageData/types";
import type { BusinessScopeLevel } from "@/lib/business/types";

const SCOPE_LABELS: Record<BusinessScopeLevel, string> = {
  "direct-support": "직접 지원",
  "procedure-guide": "관련 절차 안내",
  "expert-review": "별도 전문가 검토",
};

type BusinessPageViewProps = {
  page: PageData;
};

export function BusinessPageView({ page }: BusinessPageViewProps) {
  const content = getBusinessContent(page.slug);
  if (!content) return null;

  const tocItems = [
    { id: "summary", label: "핵심 요약" },
    content.situations.length ? { id: "situations", label: "이런 상황" } : null,
    content.stageCards.length ? { id: "stages", label: "단계별 실무" } : null,
    { id: "support", label: "지원 업무" },
    { id: "scope", label: "업무범위" },
    content.recurringChecks?.length
      ? { id: "recurring", label: "정기 점검" }
      : null,
    content.companyTypeCards?.length
      ? { id: "company-types", label: "기업 유형" }
      : null,
    content.documents.length ? { id: "documents", label: "준비서류" } : null,
    content.procedures.length ? { id: "process", label: "진행 절차" } : null,
    content.commonMistakes.length ? { id: "mistakes", label: "실수 주의" } : null,
    content.lectureLinks?.length ? { id: "lectures", label: "법률교육" } : null,
    { id: "faq", label: "FAQ" },
    content.showInquiryForm ? { id: "inquiry", label: "업무 문의" } : null,
  ].filter(Boolean) as { id: string; label: string }[];

  const faqSchemaPage: PageData = {
    ...page,
    faqs: content.faqs,
    includeFaqSchema: true,
  };

  return (
    <article className="space-y-8 md:space-y-12">
      <Breadcrumb items={page.breadcrumbs} />
      <BreadcrumbJsonLd items={page.breadcrumbs} currentPath={page.path} />
      <JsonLd data={buildJsonLdForPageData(faqSchemaPage)} />

      <PageHero
        h1={content.h1}
        eyebrow={content.eyebrow}
        intro={content.heroIntro}
        keywords={content.primaryKeywords}
        ctaLabel="기업 업무 문의"
        ctaHref="/기업업무문의"
      />

      <div className="flex flex-wrap gap-2">
        <Link href="/기업업무문의" className="btn-primary">
          기업 업무 문의하기
        </Link>
        <Link href="/부산법인등기" className="btn-secondary">
          법인등기 변경사항 확인
        </Link>
        <Link href="/기업업무문의" className="btn-secondary">
          기업 서류 검토 요청
        </Link>
      </div>

      <ProseParagraphs paragraphs={content.heroParagraphs} />

      {content.scopeNotice ? (
        <WarningBox title="업무범위 안내">
          <p>{content.scopeNotice}</p>
        </WarningBox>
      ) : null}

      {tocItems.length >= 3 ? (
        <PageTableOfContents items={tocItems} />
      ) : null}

      <ContentSection id="summary" title="기업 담당자를 위한 핵심 요약">
        <dl className="grid gap-3 sm:grid-cols-2">
          {content.summaryItems.map((item) => (
            <div
              key={item.label}
              className="rounded-xl border border-beige-dark bg-cream/40 px-4 py-3"
            >
              <dt className="text-xs text-navy/55">{item.label}</dt>
              <dd className="mt-1 text-sm font-medium text-navy">{item.value}</dd>
            </div>
          ))}
        </dl>
      </ContentSection>

      {content.situations.length ? (
        <ContentSection id="situations" title="이런 상황에서 확인하세요">
          <SummaryBox items={content.situations} />
        </ContentSection>
      ) : null}

      {content.stageCards.length ? (
        <ContentSection id="stages" title="기업 운영 단계별 법률실무">
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {content.stageCards.map((card) => (
              <li
                key={card.title}
                className="rounded-2xl border border-beige-dark bg-white p-4"
              >
                {card.href ? (
                  <Link
                    href={card.href}
                    className="block no-underline hover:opacity-90"
                  >
                    <h3 className="font-semibold text-navy">{card.title}</h3>
                    <p className="mt-1 text-sm text-navy/70">{card.description}</p>
                  </Link>
                ) : (
                  <>
                    <h3 className="font-semibold text-navy">{card.title}</h3>
                    <p className="mt-1 text-sm text-navy/70">{card.description}</p>
                  </>
                )}
              </li>
            ))}
          </ul>
        </ContentSection>
      ) : null}

      <ContentSection id="support" title="법무사가 지원할 수 있는 기업 업무">
        <SummaryBox items={content.supportItems} />
      </ContentSection>

      <ContentSection id="scope" title="업무범위 구분 안내">
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-beige-dark bg-cream/50">
                <th className="px-3 py-2 font-semibold text-navy">항목</th>
                <th className="px-3 py-2 font-semibold text-navy">구분</th>
                <th className="px-3 py-2 font-semibold text-navy">안내</th>
              </tr>
            </thead>
            <tbody>
              {content.scopeRows.map((row) => (
                <tr key={row.label} className="border-b border-beige-dark/70">
                  <td className="px-3 py-2 text-navy">{row.label}</td>
                  <td className="px-3 py-2 font-medium text-navy">
                    {SCOPE_LABELS[row.level]}
                  </td>
                  <td className="px-3 py-2 text-navy/70">{row.note ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ContentSection>

      {content.recurringChecks?.length ? (
        <ContentSection id="recurring" title="정기 점검 가능 업무">
          <p className="mb-3 text-sm text-navy/70">
            상시 고문 계약이 아니라, 사건별로 임원 임기·본점·목적·지점 등
            변경사항을 점검·안내할 수 있습니다. 과태료 금액을 자동 확정하지
            않습니다.
          </p>
          <SummaryBox items={content.recurringChecks} />
        </ContentSection>
      ) : null}

      {content.companyTypeCards?.length ? (
        <ContentSection id="company-types" title="기업 유형별 안내">
          <ul className="grid gap-3 sm:grid-cols-2">
            {content.companyTypeCards.map((card) => (
              <li
                key={card.title}
                className="rounded-2xl border border-beige-dark p-4"
              >
                <h3 className="font-semibold text-navy">{card.title}</h3>
                <p className="mt-1 text-sm text-navy/70">{card.description}</p>
                {card.href ? (
                  <Link
                    href={card.href}
                    className="mt-2 inline-flex text-sm font-medium text-navy underline-offset-2 hover:underline"
                  >
                    관련 안내 보기
                  </Link>
                ) : null}
              </li>
            ))}
          </ul>
        </ContentSection>
      ) : null}

      {content.documents.length ? (
        <ContentSection id="documents" title="준비서류">
          <SummaryBox items={content.documents} />
        </ContentSection>
      ) : null}

      {content.procedures.length ? (
        <ContentSection id="process" title="진행 절차">
          <StepTimeline steps={content.procedures} />
        </ContentSection>
      ) : null}

      {content.costFactors.length ? (
        <ContentSection id="cost" title="비용이 달라지는 요소">
          <SummaryBox items={content.costFactors} />
        </ContentSection>
      ) : null}

      {content.deadlineNotes.length ? (
        <ContentSection id="deadlines" title="기한과 과태료 주의사항">
          <SummaryBox items={content.deadlineNotes} />
        </ContentSection>
      ) : null}

      {content.commonMistakes.length ? (
        <ContentSection id="mistakes" title="자주 발생하는 실수">
          <SummaryBox items={content.commonMistakes} />
        </ContentSection>
      ) : null}

      {content.lectureLinks?.length ? (
        <ContentSection id="lectures" title="관련 기업 법률교육">
          <p className="mb-3 text-sm text-navy/70">
            사건별 업무 의뢰뿐 아니라 임직원 대상 법률실무 교육이 필요한 경우
            관련 강의 내용을 확인할 수 있습니다.
          </p>
          <RelatedContentGrid links={content.lectureLinks} />
        </ContentSection>
      ) : null}

      <ContentSection id="faq" title="자주 묻는 질문">
        <FAQAccordion items={content.faqs} />
      </ContentSection>

      <ContentSection id="related" title="관련 서비스">
        <RelatedContentGrid links={content.relatedLinks} />
      </ContentSection>

      {content.showInquiryForm ? (
        <ContentSection id="inquiry" title={content.ctaTitle}>
          <p className="mb-4 text-sm text-navy/70">{content.ctaText}</p>
          <BusinessInquiryForm />
        </ContentSection>
      ) : (
        <CTASection
          title={content.ctaTitle}
          description={content.ctaText}
          pageSlug={content.slug}
          serviceSlug="corporate-registration"
        />
      )}
    </article>
  );
}
