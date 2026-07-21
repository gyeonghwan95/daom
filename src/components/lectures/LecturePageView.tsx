import Link from "next/link";
import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { JsonLd } from "@/components/seo/JsonLd";
import { FAQAccordion } from "@/components/sections/FAQAccordion";
import { CTASection } from "@/components/sections/CTASection";
import { LectureInquiryForm } from "@/components/lectures/LectureInquiryForm";
import { LectureInlineCta } from "@/components/lectures/LectureInlineCta";
import { TopicRecommendationForm } from "@/components/lectures/TopicRecommendationForm";
import { FeaturedLectureHistory } from "@/components/lectures/history/FeaturedLectureHistory";
import { RelatedLectureHistory } from "@/components/lectures/history/RelatedLectureHistory";
import { SpeakerHistoryList } from "@/components/lectures/SpeakerHistoryList";
import { SpeakerLectureGallery } from "@/components/lectures/SpeakerLectureGallery";
import { SpeakerProfileSection } from "@/components/lectures/SpeakerProfileSection";
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

      {content.kind === "speaker" ? (
        <SpeakerLayout content={content} />
      ) : content.kind === "inquiry" ? (
        <InquiryLayout content={content} />
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

function SpeakerLayout({ content }: { content: LecturePageContent }) {
  return (
    <>
      <PageHero
        h1={content.h1}
        eyebrow={content.eyebrow}
        intro={content.heroIntro}
        keywords={(content.primaryKeywords ?? []).slice(0, 3)}
        ctaLabel="강의 일정 문의하기"
        ctaHref="/강의문의"
        secondaryCta={{ href: "/강의이력", label: "출강 이력 보기" }}
        showDiagnosisCta={false}
        sideImage={siteImages.about.portrait}
      />

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

      <SpeakerHistoryList title="주요 출강 이력" limit={8} />

      <LectureInlineCta
        title="기관 교육에 맞는지 먼저 확인해 보세요"
        text="대상·주제·희망 일정만 남겨 주시면, 맞춤 구성과 가능 여부를 회신합니다."
        secondaryLabel="강의 주제 둘러보기"
        secondaryHref="/법률강의"
      />

      <ContentSection id="credentials" title="자격·경력">
        <SpeakerProfileSection
          showPrint={content.showPrintProfile}
          variant="credentials"
        />
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
  return (
    <>
      <PageHero
        h1={content.h1}
        eyebrow={content.eyebrow}
        intro={content.heroIntro}
        keywords={(content.primaryKeywords ?? []).slice(0, 3)}
        ctaLabel="강사 섭외 문의"
        ctaHref="/강의문의"
        secondaryCta={{ href: "/강사소개", label: "강사 프로필" }}
        showDiagnosisCta={false}
      />

      <SummaryGrid items={content.summaryItems} />

      <SpeakerLectureGallery compact dualRow={false} />

      <SpeakerHistoryList title="확인된 출강 이력" limit={6} />

      <LectureInlineCta
        title="교육 목적에 맞는 강사인지 바로 확인해 보세요"
        text="기관 유형·대상·목표만 남겨 주시면 구성안을 안내합니다."
      />

      {content.topicCards.length ? (
        <ContentSection id="topics" title="주로 요청받는 주제">
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {content.topicCards.map((card) => (
              <TopicLinkCard key={card.title} card={card} />
            ))}
          </div>
        </ContentSection>
      ) : null}

      <ContentSection id="credentials" title="강사 한눈에 보기">
        <SpeakerProfileSection showPrint={false} variant="credentials" />
        <p className="mt-3 text-sm text-navy/65">
          자격·경력·현장 사진을 더 보려면{" "}
          <Link
            href="/강사소개"
            className="font-medium text-navy underline-offset-2 hover:underline"
          >
            강사 소개
          </Link>
          를 확인하세요.
        </p>
      </ContentSection>

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
        <FAQAccordion items={content.faqs.slice(0, 5)} />
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

      {content.showRecommendTool ? (
        <ContentSection id="recommend" title="주제 추천">
          <TopicRecommendationForm />
        </ContentSection>
      ) : null}

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

function InquiryLayout({ content }: { content: LecturePageContent }) {
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

      <ProseParagraphs paragraphs={content.heroParagraphs.slice(0, 2)} />
      <SummaryGrid items={content.summaryItems.slice(0, 4)} />

      {history.length ? (
        <ContentSection id="history" title="이 주제의 실제 강의">
          <RelatedLectureHistory
            items={history}
            title="확인된 출강 이력"
            description="기관명·일정이 확인된 관련 강의입니다."
          />
        </ContentSection>
      ) : null}

      <LectureInlineCta
        title="이 주제로 출강이 가능합니다"
        text="대상·인원·희망 일정만 남겨 주시면 맞춤 구성을 안내합니다."
      />

      {content.modules.length ? (
        <ContentSection id="modules" title="강의에서 다루는 내용">
          <SummaryBox items={content.modules.slice(0, 6)} />
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
            {content.audienceCards.slice(0, 4).map((card) => (
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
        <FAQAccordion items={content.faqs.slice(0, 5)} />
      </ContentSection>

      <RelatedLinks content={content} />
      <DisclaimerNote text={content.disclaimer} />
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
      <RelatedContentGrid links={links.slice(0, 8)} />
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
