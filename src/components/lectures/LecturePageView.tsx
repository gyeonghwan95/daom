import Link from "next/link";
import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { JsonLd } from "@/components/seo/JsonLd";
import { FAQAccordion } from "@/components/sections/FAQAccordion";
import { CTASection } from "@/components/sections/CTASection";
import { LectureInquiryForm } from "@/components/lectures/LectureInquiryForm";
import { LectureInlineCta } from "@/components/lectures/LectureInlineCta";
import { TopicRecommendationForm } from "@/components/lectures/TopicRecommendationForm";
import { LectureTopicFinder } from "@/components/lectures/LectureTopicFinder";
import { LectureFormatGuide } from "@/components/lectures/LectureFormatGuide";
import { SpeakerProfile } from "@/components/lectures/SpeakerProfile";
import { VerifiedLectureHistory } from "@/components/lectures/VerifiedLectureHistory";
import { FeaturedLectureHistory } from "@/components/lectures/history/FeaturedLectureHistory";
import { RelatedLectureHistory } from "@/components/lectures/history/RelatedLectureHistory";
import { LectureHistoryGrid } from "@/components/lectures/history/LectureHistoryGrid";
import { LectureTrackRecordSummaryView } from "@/components/lectures/history/LectureTrackRecordSummary";
import { SpeakerHistoryList } from "@/components/lectures/SpeakerHistoryList";
import { SpeakerLectureGallery } from "@/components/lectures/SpeakerLectureGallery";
import { SpeakerProfileSection } from "@/components/lectures/SpeakerProfileSection";
import { ArticleVisualSlot } from "@/components/media/ArticleVisual";
import { BusinessCredentialSlot } from "@/components/credentials/BusinessCredentialSlot";
import {
  ContentSection,
  PageHero,
  ProseParagraphs,
  RelatedContentGrid,
  StepTimeline,
  SummaryBox,
  WarningBox,
} from "@/components/readability";
import {
  getFeaturedLectureHistory,
  getLectureHistoryByIds,
  getRecentLectureHistory,
  getRelatedLectureHistoryForPage,
} from "@/data/lectures/history";
import { getLectureContent } from "@/lib/lectures/content";
import { buildLectureTrackRecordSummary } from "@/lib/lectures/history-helpers";
import { buildJsonLdForPageData } from "@/lib/pageData/json-ld";
import { siteImages } from "@/lib/site-images";
import type { PageData } from "@/lib/pageData/types";
import type { LecturePageContent } from "@/lib/lectures/types";

type LecturePageViewProps = {
  page: PageData;
};

export function LecturePageView({ page }: LecturePageViewProps) {
  const content = getLectureContent(page.slug);
  if (!content) return null;

  const relatedHistory = getRelatedLectureHistoryForPage(page.path, 3);
  const fallbackHistory = getLectureHistoryByIds(content.historyIds).slice(0, 3);
  const history =
    relatedHistory.length > 0 ? relatedHistory : fallbackHistory;

  const faqSchemaPage: PageData = {
    ...page,
    faqs: content.faqs,
    includeFaqSchema: true,
  };

  return (
    <article className="lecture-page content-stack">
      <Breadcrumb items={page.breadcrumbs} />
      <BreadcrumbJsonLd items={page.breadcrumbs} currentPath={page.path} />
      <JsonLd data={buildJsonLdForPageData(faqSchemaPage)} />

      <BusinessCredentialSlot path={page.path} slug={page.slug} />

      {content.kind === "speaker" ? (
        <SpeakerLayout content={content} page={page} />
      ) : content.kind === "inquiry" ? (
        <InquiryLayout content={content} page={page} />
      ) : content.kind === "hiring" ? (
        <HiringLayout content={content} page={page} />
      ) : content.kind === "hub" ? (
        <HubLayout content={content} page={page} />
      ) : (
        <TopicLayout content={content} page={page} history={history} />
      )}
    </article>
  );
}

function SpeakerLayout({
  content,
  page,
}: {
  content: LecturePageContent;
  page: PageData;
}) {
  const trackSummary = buildLectureTrackRecordSummary();
  const featuredHistory = getFeaturedLectureHistory().slice(0, 6);

  return (
    <>
      <PageHero
        h1={content.h1}
        eyebrow={content.eyebrow}
        intro={content.heroIntro}
        keywords={(content.primaryKeywords ?? []).slice(0, 3)}
        ctaLabel="30초 강의 문의"
        ctaHref="#inquiry"
        secondaryCta={{ href: "/강의이력", label: "확인된 출강 이력" }}
        showDiagnosisCta={false}
        sideImage={siteImages.about.portrait}
      />

      <LectureTrackRecordSummaryView summary={trackSummary} compact />

      <SpeakerLectureGallery compact dualRow />

      <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {content.summaryItems.map((item) => (
          <div
            key={item.label}
            className="rounded-xl border border-navy/10 bg-cream/50 px-4 py-3"
          >
            <dt className="text-xs font-semibold tracking-wide text-navy/55">
              {item.label}
            </dt>
            <dd className="mt-1 text-sm font-medium text-navy">{item.value}</dd>
          </div>
        ))}
      </dl>

      <ProseParagraphs paragraphs={content.heroParagraphs.slice(0, 2)} />

      <ContentSection id="speaker-summary" title="강사 한눈에 보기">
        <SpeakerProfile showPrint={Boolean(content.showPrintProfile)} />
      </ContentSection>

      <ArticleVisualSlot
        path={page.path}
        slot="after-intro"
        category={page.category}
        serviceSlug="lecture"
      />

      {featuredHistory.length ? (
        <section className="space-y-4">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-navy md:text-xl">
                대표 출강 · 확인된 현장
              </h2>
              <p className="mt-1 text-sm text-navy/70">
                기관·주제·현장이 확인된 대표 출강입니다.
              </p>
            </div>
            <Link
              href="/강의이력"
              className="text-sm font-medium text-navy underline-offset-2 hover:underline"
            >
              전체 이력 보기
            </Link>
          </div>
          <LectureHistoryGrid items={featuredHistory} />
        </section>
      ) : null}

      <SpeakerHistoryList title="주요 출강 이력" limit={14} />

      <LectureInlineCta
        title="강의 가능 일정·맞춤 제안을 문의하세요"
        text="주제·대상·희망 일정만 남겨 주시면 가능 여부와 구성안을 안내드립니다."
        primaryLabel="이메일로 문의하기"
        primaryHref="#inquiry"
        secondaryLabel="강의 주제 둘러보기"
        secondaryHref="/법률강의"
      />

      <ContentSection id="credentials" title="자격·경력 상세">
        <SpeakerProfileSection showPrint={false} variant="credentials" />
      </ContentSection>

      {content.topicCards.length ? (
        <ContentSection id="topics" title="출강 가능 주제">
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {content.topicCards.map((card) => (
              <TopicLinkCard key={card.title} card={card} />
            ))}
          </div>
          <p className="mt-3 text-sm text-navy/65">
            주제별 상세 구성은{" "}
            <Link
              href="/법률강의"
              className="font-medium text-navy underline-offset-2 hover:underline"
            >
              법률 강의 안내
            </Link>
            에서 확인할 수 있습니다.
          </p>
        </ContentSection>
      ) : null}

      <ContentSection id="inquiry" title="강의 문의">
        <p className="mb-4 text-sm text-navy/75">{content.ctaText}</p>
        <LectureInquiryForm />
      </ContentSection>

      <ContentSection id="faq" title="자주 묻는 질문">
        <FAQAccordion items={content.faqs.slice(0, 5)} />
      </ContentSection>

      <RelatedLinks content={content} />
      <DisclaimerNote text={content.disclaimer} />
    </>
  );
}

function HiringLayout({
  content,
  page,
}: {
  content: LecturePageContent;
  page: PageData;
}) {
  const trackSummary = buildLectureTrackRecordSummary();

  return (
    <>
      <PageHero
        h1={content.h1}
        eyebrow={content.eyebrow}
        intro={content.heroIntro}
        keywords={(content.primaryKeywords ?? []).slice(0, 3)}
        ctaLabel="30초 섭외 문의"
        ctaHref="#inquiry"
        secondaryCta={{ href: "/강사소개", label: "강사 프로필" }}
        showDiagnosisCta={false}
      />

      <LectureTrackRecordSummaryView summary={trackSummary} compact />

      <SummaryGrid items={content.summaryItems} />

      <ProseParagraphs paragraphs={content.heroParagraphs} />

      {content.bodySections?.length ? (
        <BodySections sections={content.bodySections} />
      ) : null}

      <ArticleVisualSlot
        path={page.path}
        slot="after-intro"
        category={page.category}
        serviceSlug="lecture"
      />

      <ContentSection id="speaker-profile" title="강사 프로필">
        <SpeakerProfile
          showPrint={Boolean(content.showPrintProfile)}
          focusNote="부산을 중심으로 공공기관·기업·청년기관·도서관·복지기관의 출강 문의를 받고 있습니다."
        />
      </ContentSection>

      <SpeakerLectureGallery compact dualRow />

      <ContentSection id="verified-history" title="확인된 출강 이력">
        <VerifiedLectureHistory
          historyIds={content.historyIds}
          limit={6}
          title="기관 담당자가 참고할 수 있는 실제 출강"
          description="날짜·기관·주제가 확인된 강의만 표시합니다."
        />
      </ContentSection>

      <SpeakerHistoryList title="출강 이력 목록" limit={12} />

      <LectureInlineCta
        title="강의 가능 일정·맞춤 제안을 문의하세요"
        text="주제·대상·희망 일정만 남겨 주시면 가능 여부와 구성안을 안내드립니다."
        primaryLabel="강의문의 남기기"
        primaryHref="#inquiry"
      />

      {content.audienceCards.length ? (
        <ContentSection id="audience" title="이런 기관·대상에 맞습니다">
          <div className="grid gap-3 sm:grid-cols-2">
            {content.audienceCards.map((card) => (
              <div
                key={card.title}
                className="rounded-xl border border-navy/10 p-4"
              >
                <p className="font-semibold text-navy">{card.title}</p>
                <p className="mt-1 text-sm text-navy/70">{card.description}</p>
              </div>
            ))}
          </div>
        </ContentSection>
      ) : null}

      {content.topicCards.length ? (
        <ContentSection id="topics" title="주로 요청받는 주제">
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {content.topicCards.map((card) => (
              <TopicLinkCard key={card.title} card={card} />
            ))}
          </div>
        </ContentSection>
      ) : null}

      {content.durationOptions.length ? (
        <ContentSection id="durations" title="강의시간별 구성 요약">
          <div className="grid gap-3 sm:grid-cols-2">
            {content.durationOptions.map((item) => (
              <div
                key={item.label}
                className="rounded-xl border border-navy/10 p-4"
              >
                <p className="font-semibold text-navy">{item.label}</p>
                <ul className="mt-2 list-disc space-y-0.5 pl-5 text-sm text-navy/75">
                  {item.outline.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </ContentSection>
      ) : null}

      <OptionalTools content={content} />

      {content.showInquiryForm ? (
        <ContentSection id="inquiry" title={content.ctaTitle}>
          <p className="mb-4 text-sm text-navy/75">{content.ctaText}</p>
          <LectureInquiryForm />
        </ContentSection>
      ) : (
        <CTASection
          title={content.ctaTitle}
          description={content.ctaText}
          pageSlug={page.slug}
        />
      )}

      <ContentSection id="faq" title="자주 묻는 질문">
        <FAQAccordion items={content.faqs.slice(0, 8)} />
      </ContentSection>

      <RelatedLinks content={content} />
      <DisclaimerNote text={content.disclaimer} />
    </>
  );
}

function HubLayout({
  content,
  page,
}: {
  content: LecturePageContent;
  page: PageData;
}) {
  return (
    <>
      <PageHero
        h1={content.h1}
        eyebrow={content.eyebrow}
        intro={content.heroIntro}
        keywords={(content.primaryKeywords ?? []).slice(0, 4)}
        ctaLabel="강의 일정 문의하기"
        ctaHref="/강의문의"
        secondaryCta={{ href: "/강사소개", label: "강사 소개" }}
        showDiagnosisCta={false}
      />

      <ProseParagraphs paragraphs={content.heroParagraphs.slice(0, 2)} />
      <SummaryGrid items={content.summaryItems.slice(0, 4)} />

      <ArticleVisualSlot
        path={page.path}
        slot="after-intro"
        category={page.category}
        serviceSlug="lecture"
      />

      {content.topicCards.length ? (
        <ContentSection id="topics" title="주요 강의 주제">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {content.topicCards.map((card) => (
              <TopicLinkCard key={card.title} card={card} detailed />
            ))}
          </div>
        </ContentSection>
      ) : null}

      <LectureInlineCta
        title="주제만 정하셨다면, 일정부터 남겨 주세요"
        text="기관·대상·희망일만 있어도 가능 여부와 구성안을 안내할 수 있습니다."
        secondaryLabel="강사 프로필 보기"
        secondaryHref="/강사소개"
      />

      <ContentSection id="history" title="확인된 강의 이력">
        <FeaturedLectureHistory
          summary={buildLectureTrackRecordSummary()}
          featured={getFeaturedLectureHistory()}
          recent={getRecentLectureHistory(3)}
        />
      </ContentSection>

      {content.audienceCards.length ? (
        <ContentSection id="audience" title="이런 기관·대상에 맞습니다">
          <div className="grid gap-3 sm:grid-cols-2">
            {content.audienceCards.slice(0, 6).map((card) => (
              <div
                key={card.title}
                className="rounded-xl border border-navy/10 p-4"
              >
                <p className="font-semibold text-navy">{card.title}</p>
                <p className="mt-1 text-sm text-navy/70">{card.description}</p>
              </div>
            ))}
          </div>
        </ContentSection>
      ) : null}

      {content.institutionCards.length ? (
        <ContentSection id="institutions" title="기관·단체별 맞춤 안내">
          <div className="grid gap-3 sm:grid-cols-2">
            {content.institutionCards.map((card) => (
              <div
                key={card.title}
                className="rounded-xl border border-navy/10 bg-cream/40 p-4"
              >
                <p className="font-semibold text-navy">{card.title}</p>
                {card.topics?.length ? (
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-navy/75">
                    {card.topics.map((topic) => (
                      <li key={topic}>{topic}</li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ))}
          </div>
          <p className="mt-3 text-sm text-navy/65">
            도서관·기관·법무사 강의 전용 안내는{" "}
            <Link
              href="/부산도서관법률특강"
              className="font-medium text-navy underline-offset-2 hover:underline"
            >
              도서관 법률특강
            </Link>
            ,{" "}
            <Link
              href="/부산기관법률특강"
              className="font-medium text-navy underline-offset-2 hover:underline"
            >
              기관 법률특강
            </Link>
            ,{" "}
            <Link
              href="/부산법무사강의"
              className="font-medium text-navy underline-offset-2 hover:underline"
            >
              부산 법무사 강의
            </Link>
            에서 이어집니다.
          </p>
        </ContentSection>
      ) : null}

      {content.processSteps.length ? (
        <ContentSection id="process" title="문의부터 진행까지">
          <StepTimeline steps={content.processSteps.slice(0, 4)} />
        </ContentSection>
      ) : null}

      <OptionalTools content={content} />

      {content.showInquiryForm ? (
        <ContentSection id="inquiry" title={content.ctaTitle}>
          <p className="mb-4 text-sm text-navy/75">{content.ctaText}</p>
          <LectureInquiryForm />
        </ContentSection>
      ) : (
        <CTASection
          title={content.ctaTitle}
          description={content.ctaText}
          pageSlug={page.slug}
        />
      )}

      <ContentSection id="faq" title="자주 묻는 질문">
        <FAQAccordion items={content.faqs.slice(0, 6)} />
      </ContentSection>

      <RelatedLinks content={content} />
      <DisclaimerNote text={content.disclaimer} />
    </>
  );
}

function InquiryLayout({
  content,
  page,
}: {
  content: LecturePageContent;
  page: PageData;
}) {
  return (
    <>
      <PageHero
        h1={content.h1}
        eyebrow={content.eyebrow}
        intro={content.heroIntro}
        keywords={(content.primaryKeywords ?? []).slice(0, 3)}
        ctaLabel=""
        showDiagnosisCta={false}
      />

      <SummaryGrid items={content.summaryItems} />

      <ArticleVisualSlot
        path={page.path}
        slot="after-intro"
        category={page.category}
        serviceSlug="lecture"
      />

      <ContentSection id="inquiry" title={content.ctaTitle}>
        <p className="mb-4 text-sm text-navy/75">{content.ctaText}</p>
        <LectureInquiryForm />
      </ContentSection>

      {content.preparationChecklist.length ? (
        <ContentSection id="prepare" title="남겨 주시면 좋은 정보">
          <SummaryBox items={content.preparationChecklist.slice(0, 5)} />
        </ContentSection>
      ) : null}

      {content.topicCards.length ? (
        <ContentSection id="topics" title="자주 문의하는 주제">
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {content.topicCards.map((card) => (
              <TopicLinkCard key={card.title} card={card} />
            ))}
          </div>
        </ContentSection>
      ) : null}

      <ContentSection id="faq" title="자주 묻는 질문">
        <FAQAccordion items={content.faqs.slice(0, 5)} />
      </ContentSection>

      <RelatedLinks content={content} />
      <DisclaimerNote text={content.disclaimer} />
    </>
  );
}

function TopicLayout({
  content,
  page,
  history,
}: {
  content: LecturePageContent;
  page: PageData;
  history: ReturnType<typeof getRelatedLectureHistoryForPage>;
}) {
  return (
    <>
      <PageHero
        h1={content.h1}
        eyebrow={content.eyebrow}
        intro={content.heroIntro}
        keywords={(content.primaryKeywords ?? []).slice(0, 4)}
        ctaLabel="이 주제 문의하기"
        ctaHref="/강의문의"
        secondaryCta={{ href: "/강사소개", label: "강사 소개" }}
        showDiagnosisCta={false}
      />

      <ProseParagraphs paragraphs={content.heroParagraphs.slice(0, 3)} />
      <SummaryGrid items={content.summaryItems.slice(0, 4)} />

      {content.bodySections?.length ? (
        <BodySections sections={content.bodySections} />
      ) : null}

      <ArticleVisualSlot
        path={page.path}
        slot="after-intro"
        category={page.category}
        serviceSlug="lecture"
      />

      {history.length ? (
        <ContentSection id="history" title="이 주제의 실제 강의">
          <RelatedLectureHistory
            items={history}
            title="확인된 출강 이력"
            description="기관명·일정이 확인된 관련 강의입니다."
          />
        </ContentSection>
      ) : content.historyIds.length ? (
        <ContentSection id="history" title="관련 출강 이력">
          <VerifiedLectureHistory historyIds={content.historyIds} limit={4} />
        </ContentSection>
      ) : null}

      <LectureInlineCta
        title="강의 가능 일정·맞춤 제안을 문의하세요"
        text="주제·대상·희망 일정만 남겨 주시면 가능 여부와 구성안을 안내드립니다."
      />

      {content.modules.length ? (
        <ContentSection id="modules" title="강의에서 다루는 내용">
          <SummaryBox items={content.modules.slice(0, 8)} />
        </ContentSection>
      ) : null}

      {content.topicCards.length ? (
        <ContentSection id="topics" title="세부 주제">
          <div className="grid gap-2 sm:grid-cols-2">
            {content.topicCards.slice(0, 6).map((card) => (
              <TopicLinkCard key={card.title} card={card} detailed />
            ))}
          </div>
        </ContentSection>
      ) : null}

      {content.audienceCards.length ? (
        <ContentSection id="audience" title="추천 대상">
          <div className="grid gap-3 sm:grid-cols-2">
            {content.audienceCards.slice(0, 6).map((card) => (
              <div
                key={card.title}
                className="rounded-xl border border-navy/10 p-4"
              >
                <p className="font-semibold text-navy">{card.title}</p>
                <p className="mt-1 text-sm text-navy/70">{card.description}</p>
              </div>
            ))}
          </div>
        </ContentSection>
      ) : null}

      {content.formats.length ? (
        <ContentSection id="formats" title="가능한 형식">
          <div className="grid gap-3 sm:grid-cols-2">
            {content.formats.slice(0, 4).map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-navy/10 p-4"
              >
                <p className="font-semibold text-navy">{item.title}</p>
                <p className="mt-1 text-sm text-navy/70">{item.description}</p>
              </div>
            ))}
          </div>
        </ContentSection>
      ) : null}

      <OptionalTools content={content} />

      {content.showInquiryForm ? (
        <ContentSection id="inquiry" title={content.ctaTitle}>
          <p className="mb-4 text-sm text-navy/75">{content.ctaText}</p>
          <LectureInquiryForm />
        </ContentSection>
      ) : (
        <CTASection
          title={content.ctaTitle}
          description={content.ctaText}
          pageSlug={page.slug}
        />
      )}

      <ContentSection id="faq" title="자주 묻는 질문">
        <FAQAccordion items={content.faqs.slice(0, 6)} />
      </ContentSection>

      <RelatedLinks content={content} />
      <DisclaimerNote text={content.disclaimer} />
    </>
  );
}

function BodySections({
  sections,
}: {
  sections: NonNullable<LecturePageContent["bodySections"]>;
}) {
  if (!sections.length) return null;
  return (
    <>
      {sections.map((section, index) => (
        <ContentSection
          key={section.title}
          id={`body-${index + 1}`}
          title={section.title}
        >
          <ProseParagraphs paragraphs={section.paragraphs} />
        </ContentSection>
      ))}
    </>
  );
}

function OptionalTools({ content }: { content: LecturePageContent }) {
  return (
    <>
      {content.showFormatGuide ? (
        <ContentSection id="format-guide" title="교육시간별 강의 구성">
          <LectureFormatGuide />
        </ContentSection>
      ) : null}
      {content.showTopicFinder ? (
        <ContentSection id="topic-finder" title="우리 기관에 맞는 주제 찾기">
          <LectureTopicFinder />
        </ContentSection>
      ) : null}
      {content.showRecommendTool ? (
        <ContentSection id="recommend" title="주제 추천">
          <TopicRecommendationForm />
        </ContentSection>
      ) : null}
    </>
  );
}

function SummaryGrid({
  items,
}: {
  items: LecturePageContent["summaryItems"];
}) {
  if (!items.length) return null;
  return (
    <dl className="grid gap-3 sm:grid-cols-2">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-xl border border-navy/10 bg-cream/50 p-4"
        >
          <dt className="text-xs font-semibold tracking-wide text-navy/55">
            {item.label}
          </dt>
          <dd className="mt-1 text-sm font-medium text-navy">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

function TopicLinkCard({
  card,
  detailed = false,
}: {
  card: LecturePageContent["topicCards"][number];
  detailed?: boolean;
}) {
  const className = detailed
    ? "rounded-2xl border border-beige-dark bg-white/80 p-4"
    : "rounded-xl border border-beige-dark bg-white/80 px-4 py-3";

  return (
    <div className={className}>
      {card.href ? (
        <Link
          href={card.href}
          className="font-semibold text-navy underline-offset-2 hover:underline"
        >
          {card.title}
        </Link>
      ) : (
        <p className="font-semibold text-navy">{card.title}</p>
      )}
      {card.description ? (
        <p className="mt-1 text-sm text-navy/70">{card.description}</p>
      ) : null}
    </div>
  );
}

function RelatedLinks({ content }: { content: LecturePageContent }) {
  const links = [
    ...content.relatedLectureLinks,
    ...content.relatedServiceLinks,
  ];
  if (!links.length) return null;
  return (
    <ContentSection id="related" title="관련 안내">
      <RelatedContentGrid links={links.slice(0, 12)} />
    </ContentSection>
  );
}

function DisclaimerNote({ text }: { text?: string }) {
  if (!text) return null;
  return (
    <WarningBox title="안내 범위">
      <p>{text}</p>
    </WarningBox>
  );
}
