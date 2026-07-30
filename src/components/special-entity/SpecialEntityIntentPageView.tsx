import Link from "next/link";
import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { JsonLd } from "@/components/seo/JsonLd";
import { FAQAccordion } from "@/components/sections/FAQAccordion";
import { CTASection } from "@/components/sections/CTASection";
import {
  ArticleSummary,
  ChecklistBox,
  ContentSection,
  PageHero,
  PageTableOfContents,
  RelatedContentGrid,
  StepTimeline,
  WarningBox,
} from "@/components/readability";
import { ArticleVisualSlot } from "@/components/media/ArticleVisual";
import { NationwideServiceCard } from "@/components/nationwide/NationwideServiceCard";
import { getSpecialEntityContent } from "@/lib/special-entity-intent/content";
import { shouldShowNationwideRegionChip } from "@/lib/nationwide/show-region-chip";
import { buildJsonLdForPageData } from "@/lib/pageData/json-ld";
import type { PageData } from "@/lib/pageData/types";
import { siteImages } from "@/lib/site-images";

type SpecialEntityIntentPageViewProps = {
  page: PageData;
};

function buildSpecialBody(
  content: NonNullable<ReturnType<typeof getSpecialEntityContent>>,
) {
  const paragraphs = [content.conclusion, ...content.heroParagraphs];

  if (content.whoNeedsThis.length) {
    paragraphs.push(
      `이런 단체·기관에서 자주 확인합니다. ${content.whoNeedsThis.slice(0, 3).join(" ")}`,
    );
  }

  if (content.whenAndDeadline.length) {
    paragraphs.push(
      `절차가 필요한 시점과 기한을 먼저 보면 판단이 쉽습니다. ${content.whenAndDeadline.slice(0, 3).join(" ")}`,
    );
  }

  if (content.decisionBodies.length) {
    paragraphs.push(
      `결의·인가 주체를 확인하지 않으면 서류가 어긋나기 쉽습니다. ${content.decisionBodies.slice(0, 3).join(" ")}`,
    );
  }

  if (content.commonConfusions.length || content.diyErrors.length) {
    paragraphs.push(
      [
        content.commonConfusions[0]
          ? `비슷해 보이지만 다른 경우도 있습니다. ${content.commonConfusions.slice(0, 2).join(" ")}`
          : null,
        content.diyErrors[0]
          ? `준비가 덜 된 상태에서 직접 진행하면 ${content.diyErrors.slice(0, 2).join(", ")} 같은 실수가 생기기 쉽습니다.`
          : null,
      ]
        .filter(Boolean)
        .join(" "),
    );
  }

  if (content.procedures.length) {
    paragraphs.push(
      `실제 진행은 보통 ${content.procedures.join(" → ")} 순서로 이어집니다. 사안마다 주무관청·결의·관할이 달라질 수 있어, 단정하지 않고 현황부터 확인하는 편이 안전합니다.`,
    );
  }

  if (content.documents.length) {
    paragraphs.push(
      `상담·접수 전에 자주 확인하는 서류로는 ${content.documents.slice(0, 5).join(", ")} 등이 있습니다. 사건마다 추가·생략이 있을 수 있어 목록만으로 단정하지 않습니다.`,
    );
  }

  if (content.penaltyRisks.length || content.costFactors.length) {
    paragraphs.push(
      [
        content.penaltyRisks[0]
          ? `지연하거나 누락하면 ${content.penaltyRisks.slice(0, 2).join(", ")} 위험이 있습니다.`
          : null,
        content.costFactors[0]
          ? `기간·비용에 영향을 주는 요소로는 ${content.costFactors.slice(0, 3).join(", ")} 등을 함께 봅니다.`
          : null,
        "혼자 처리할 수 있는 단순 변경인지, 허가·결의·등기를 함께 맞춰야 하는 사안인지는 서류 상태를 보고 구분합니다.",
      ]
        .filter(Boolean)
        .join(" "),
    );
  }

  if (content.anonymousCase) {
    paragraphs.push(`실제 상담에서는 이런 흐름이 있었습니다. ${content.anonymousCase}`);
  }

  if (content.faqs.length > 0) {
    const faqBits = content.faqs
      .slice(0, 2)
      .map((f) => `${f.question} ${f.answer}`)
      .join(" ");
    paragraphs.push(`자주 묻는 질문도 본문과 함께 확인하면 좋습니다. ${faqBits}`);
  }

  return paragraphs.filter((p) => p.trim().length > 0);
}

export function SpecialEntityIntentPageView({
  page,
}: SpecialEntityIntentPageViewProps) {
  const content = getSpecialEntityContent(page.slug);
  if (!content) return null;

  const isHub = content.kind === "hub";
  const isComparison = content.kind === "comparison";
  const profile = content.legalProfile;
  const bodyParagraphs = buildSpecialBody(content);
  const showNationwide =
    isHub ||
    content.slug.startsWith("부산") ||
    content.slug.startsWith("경남") ||
    content.slug.startsWith("창원") ||
    shouldShowNationwideRegionChip(page.path, page.slug, page.serviceSlug);

  const tocItems = [
    { id: "article-body", label: "본문 안내" },
    ...(profile ? [{ id: "legal", label: "법적 근거·설립 방식" }] : []),
    ...(isComparison && content.comparisonPoints
      ? [{ id: "compare", label: "비교 요약" }]
      : []),
    ...(isHub ? [{ id: "clusters", label: "업무별 안내" }] : []),
    { id: "documents", label: "준비서류" },
    { id: "process", label: "진행 절차" },
    { id: "cost", label: "비용 요인" },
    ...(content.anonymousCase ? [{ id: "case", label: "상담 사례" }] : []),
    { id: "related", label: "관련 페이지" },
    { id: "faq", label: "FAQ" },
  ];

  const faqSchemaPage: PageData = {
    ...page,
    faqs: content.faqs,
    includeFaqSchema: true,
  };

  const contactHref = `/contact?from=${encodeURIComponent(content.slug)}&topic=${encodeURIComponent(content.title)}`;

  return (
    <article className="content-stack">
      <Breadcrumb items={page.breadcrumbs} />
      <BreadcrumbJsonLd items={page.breadcrumbs} currentPath={page.path} />
      <JsonLd data={buildJsonLdForPageData(faqSchemaPage)} />

      <PageHero
        h1={content.h1}
        eyebrow={content.eyebrow}
        intro={content.heroIntro}
        keywords={[
          content.primaryKeyword,
          ...content.secondaryKeywords.slice(0, 4),
        ]}
        ctaLabel={content.ctaTitle}
        ctaHref={contactHref}
        secondaryCta={{
          href: "/특수비영리법인등기",
          label: "특수·비영리법인 허브",
        }}
        showDiagnosisCta={false}
        showAboutLawyerCta={false}
        showNationwideChip={showNationwide}
        sideImage={siteImages.home.trust}
      />

      {showNationwide ? (
        <NationwideServiceCard headline="부산 외 지역 단체·법인도 비대면으로 등기 상담이 가능합니다" />
      ) : null}

      <p className="text-sm font-medium text-navy">{content.officeLine}</p>

      <WarningBox title="업무범위 안내">
        <p>{content.scopeNotice}</p>
      </WarningBox>

      <ArticleSummary
        conclusion={content.conclusion}
        checkItems={content.whenAndDeadline.slice(0, 3)}
        consultTriggers={content.whoNeedsThis.slice(0, 3)}
      />

      <ArticleVisualSlot
        path={page.path}
        slot="after-intro"
        category={page.category}
        serviceSlug={page.serviceSlug ?? "corporate-registration"}
      />

      <PageTableOfContents items={tocItems} />

      <ContentSection id="article-body" title="자세히 알아보기">
        <div className="article-body">
          {bodyParagraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 40)}>{paragraph}</p>
          ))}
        </div>
      </ContentSection>

      {profile ? (
        <ContentSection id="legal" title="법적 근거·설립 방식">
          <div className="rounded-2xl border border-beige-dark bg-cream/20 p-5 text-sm text-navy/85">
            <dl className="grid gap-3 sm:grid-cols-2">
              <div>
                <dt className="font-semibold text-navy">법인 명칭</dt>
                <dd>{profile.entityName}</dd>
              </div>
              <div>
                <dt className="font-semibold text-navy">근거 법률</dt>
                <dd>{profile.legalBasis.join(", ")}</dd>
              </div>
              <div>
                <dt className="font-semibold text-navy">설립 방식</dt>
                <dd>{profile.establishmentMethod}</dd>
              </div>
              <div>
                <dt className="font-semibold text-navy">관할 주무관청·등기소</dt>
                <dd>{profile.competentAuthority.join(" / ")}</dd>
              </div>
              <div>
                <dt className="font-semibold text-navy">설립등기 기한</dt>
                <dd>{profile.registrationDeadline}</dd>
              </div>
              <div>
                <dt className="font-semibold text-navy">최종 법령 검토일</dt>
                <dd>{profile.lastLegalReview}</dd>
              </div>
            </dl>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <p className="font-semibold text-navy">설립 전 선행 절차</p>
                <ChecklistBox items={profile.preRegistrationSteps} />
              </div>
              <div>
                <p className="font-semibold text-navy">등기사항(주요)</p>
                <ChecklistBox items={profile.registrableMatters} />
              </div>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <p className="font-semibold text-navy">법무사 지원 가능 범위</p>
                <ChecklistBox items={profile.lawyerScope} />
              </div>
              <div>
                <p className="font-semibold text-navy">별도 전문가 확인 영역</p>
                <ChecklistBox items={profile.excludedScope} />
              </div>
            </div>
            {profile.regionalNotes?.length ? (
              <p className="mt-4 text-xs text-navy/70">
                지역 참고: {profile.regionalNotes.join(" ")}
              </p>
            ) : null}
          </div>
        </ContentSection>
      ) : null}

      {isComparison && content.comparisonPoints ? (
        <ContentSection id="compare" title="비교 요약">
          {content.comparisonSummary ? (
            <ChecklistBox items={content.comparisonSummary} />
          ) : null}
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[520px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-beige-dark bg-cream/40">
                  <th className="p-3 text-left font-semibold text-navy">구분</th>
                  <th className="p-3 text-left font-semibold text-navy">
                    {content.comparisonPoints[0]?.optionA.includes("(")
                      ? content.comparisonPoints[0].optionA.split("(")[1]?.replace(")", "") ?? "A"
                      : "A"}
                  </th>
                  <th className="p-3 text-left font-semibold text-navy">
                    {content.comparisonPoints[0]?.optionB.includes("(")
                      ? content.comparisonPoints[0].optionB.split("(")[1]?.replace(")", "") ?? "B"
                      : "B"}
                  </th>
                </tr>
              </thead>
              <tbody>
                {content.comparisonPoints.map((row) => (
                  <tr key={row.aspect} className="border-b border-beige-dark/60">
                    <td className="p-3 font-medium text-navy">{row.aspect}</td>
                    <td className="p-3 text-navy/80">{row.optionA}</td>
                    <td className="p-3 text-navy/80">{row.optionB}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ContentSection>
      ) : null}

      {isHub && content.topicClusters ? (
        <ContentSection id="clusters" title="검색 의도별 안내">
          <div className="grid gap-6">
            {content.topicClusters.map((cluster) => (
              <div
                key={cluster.title}
                className="rounded-2xl border border-beige-dark bg-white p-5"
              >
                <h3 className="text-lg font-semibold text-navy">{cluster.title}</h3>
                <p className="mt-1 text-sm text-navy/70">{cluster.intro}</p>
                <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                  {cluster.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="block rounded-xl border border-beige-dark/80 bg-cream/30 p-3 no-underline hover:bg-cream/60"
                      >
                        <span className="font-medium text-navy">{link.label}</span>
                        <p className="mt-1 text-xs text-navy/65">{link.description}</p>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </ContentSection>
      ) : null}

      <ContentSection id="documents" title="준비서류">
        <ChecklistBox items={content.documents} />
      </ContentSection>

      <ArticleVisualSlot
        path={page.path}
        slot="before-procedures"
        category={page.category}
        serviceSlug={page.serviceSlug ?? "corporate-registration"}
      />

      <ContentSection id="process" title="진행 절차">
        <StepTimeline steps={content.procedures} />
      </ContentSection>

      <ContentSection id="cost" title="기간·비용에 영향을 주는 요소">
        <ChecklistBox items={content.costFactors} />
      </ContentSection>

      {content.anonymousCase ? (
        <ContentSection id="case" title="익명 상담 사례(요약)">
          <p className="text-[1.015rem] leading-[1.85] text-navy/80">
            {content.anonymousCase}
          </p>
        </ContentSection>
      ) : null}

      <ContentSection id="related" title="관련 업무 페이지">
        <RelatedContentGrid links={content.relatedLinks} />
      </ContentSection>

      <ContentSection id="faq" title="자주 묻는 질문">
        <FAQAccordion items={content.faqs} />
      </ContentSection>

      <CTASection
        title="현재 상황에 필요한 절차부터 확인해보세요"
        description={content.ctaText}
        pageSlug={content.slug}
        serviceSlug="corporate-registration"
      />
    </article>
  );
}
