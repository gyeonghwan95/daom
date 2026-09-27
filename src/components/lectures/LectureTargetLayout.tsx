import Image from "next/image";
import Link from "next/link";
import { FAQAccordion } from "@/components/sections/FAQAccordion";
import { LectureInquiryForm } from "@/components/lectures/LectureInquiryForm";
import {
  ContentSection,
  ProseParagraphs,
  RelatedContentGrid,
  WarningBox,
} from "@/components/readability";
import { getLectureHistoryByIds } from "@/data/lectures/history";
import { getPublicEvidenceForGroup } from "@/data/lectures/lecture-evidence-registry";
import { encodePublicSrc } from "@/lib/encode-public-src";
import type { LecturePageContent } from "@/lib/lectures/types";
import type {
  LectureTargetCard,
  LectureTargetSpec,
} from "@/lib/lectures/target-types";

type LectureTargetLayoutProps = {
  content: LecturePageContent;
  spec: LectureTargetSpec;
};

const INQUIRY_ANCHOR = "lecture-request";

export function LectureTargetLayout({ content, spec }: LectureTargetLayoutProps) {
  const evidence = getPublicEvidenceForGroup(spec.group);
  const historyById = new Map(
    getLectureHistoryByIds(
      evidence.flatMap((item) => (item.historyId ? [item.historyId] : [])),
    ).map((entry) => [entry.id, entry] as const),
  );
  const [heroPhoto, ...morePhotos] = spec.photos;

  return (
    <>
      <header className="readability-hero">
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,16rem)] lg:items-start lg:gap-7">
          <div className="min-w-0">
            <p className="readability-hero__eyebrow">{content.eyebrow}</p>
            <h1 className="page-title">{content.h1}</h1>
            <div className="mt-4 md:mt-5">
              <ProseParagraphs paragraphs={[spec.lead]} />
            </div>
            <dl className="mt-4 grid gap-2 sm:grid-cols-3">
              {spec.quickFacts.map((fact) => (
                <div
                  key={fact.label}
                  className="rounded-xl border border-navy/10 bg-cream/50 px-3 py-2"
                >
                  <dt className="text-xs font-semibold text-navy/55">{fact.label}</dt>
                  <dd className="mt-0.5 text-sm font-medium text-navy">{fact.value}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
              <a
                href={`#${INQUIRY_ANCHOR}`}
                className="btn-primary inline-flex min-h-12 items-center justify-center px-6"
              >
                {spec.ctaLabel}
              </a>
              <a
                href="#curricula"
                className="btn-secondary inline-flex min-h-12 items-center justify-center px-6"
              >
                시간별 구성 예시 보기
              </a>
            </div>
          </div>
          {heroPhoto ? (
            <figure className="mx-auto w-full max-w-sm lg:max-w-none">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-beige-dark bg-beige/40">
                <Image
                  src={encodePublicSrc(heroPhoto.src)}
                  alt={heroPhoto.alt}
                  fill
                  priority
                  quality={72}
                  className="object-cover"
                  sizes="(max-width: 1024px) 24rem, 16rem"
                />
              </div>
              <figcaption className="mt-2 text-xs leading-relaxed text-navy/60">
                {heroPhoto.caption}
              </figcaption>
            </figure>
          ) : null}
        </div>
      </header>

      <ContentSection id="situation" title={spec.situationTitle}>
        <CardGrid cards={spec.situations} />
      </ContentSection>

      {spec.selectors?.length ? (
        <ContentSection id="selector" title={spec.selectorTitle ?? "목적별 구성 선택"}>
          {spec.selectorIntro ? (
            <p className="mb-4 max-w-3xl text-sm leading-relaxed text-navy/75 md:text-base">
              {spec.selectorIntro}
            </p>
          ) : null}
          <CardGrid cards={spec.selectors} />
        </ContentSection>
      ) : null}

      <ContentSection id="curricula" title="시간별 샘플 커리큘럼">
        <p className="mb-4 max-w-3xl text-sm leading-relaxed text-navy/75 md:text-base">
          {spec.curriculumIntro}
        </p>
        <div className="grid gap-3 md:grid-cols-2">
          {spec.curricula.map((item) => (
            <div
              key={item.length}
              className="rounded-xl border border-navy/10 bg-white/80 p-4"
            >
              <p className="text-xs font-semibold tracking-wide text-navy/55">
                {item.length}
              </p>
              <p className="mt-1 font-semibold text-navy">{item.title}</p>
              <p className="mt-1 text-sm text-navy/65">{item.fit}</p>
              <ol className="mt-2 list-decimal space-y-0.5 pl-5 text-sm text-navy/80">
                {item.outline.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </ContentSection>

      <ContentSection id="evidence" title="확인된 강의 근거">
        <p className="mb-4 max-w-3xl text-sm leading-relaxed text-navy/75 md:text-base">
          {spec.evidenceIntro}
        </p>
        <ul className="grid gap-2 sm:grid-cols-2">
          {evidence.map((item) => {
            const history = item.historyId ? historyById.get(item.historyId) : undefined;
            const badge =
              item.status === "PARTIAL"
                ? "강의 외 협업"
                : item.applicability === "DIRECT"
                  ? "같은 대상·주제"
                  : "관련 대상 강의";
            const body = (
              <>
                <span className="text-[11px] font-semibold text-navy/55">
                  {badge}
                  {item.date ? ` · ${item.date}` : ""}
                </span>
                <span className="mt-0.5 block font-semibold text-navy">
                  {item.institution} {item.label}
                </span>
                <span className="mt-0.5 block text-sm text-navy/70">{item.publicNote}</span>
              </>
            );
            return (
              <li key={item.id}>
                {history ? (
                  <Link
                    href={`/강의이력/${history.slug}`}
                    className="block rounded-xl border border-navy/10 bg-cream/40 p-3 transition hover:border-navy/25"
                  >
                    {body}
                  </Link>
                ) : (
                  <div className="rounded-xl border border-navy/10 bg-cream/40 p-3">
                    {body}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
        {spec.evidenceGap ? (
          <p className="mt-3 rounded-lg border border-beige-dark bg-white px-4 py-3 text-sm leading-relaxed text-navy/75">
            {spec.evidenceGap}
          </p>
        ) : null}
        {morePhotos.length ? (
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {morePhotos.map((photo) => (
              <figure key={photo.src}>
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-beige-dark bg-beige/40">
                  <Image
                    src={encodePublicSrc(photo.src)}
                    alt={photo.alt}
                    fill
                    quality={70}
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 22rem"
                  />
                </div>
                <figcaption className="mt-1.5 text-xs text-navy/60">{photo.caption}</figcaption>
              </figure>
            ))}
          </div>
        ) : null}
      </ContentSection>

      <ContentSection id="approach" title={spec.approachTitle}>
        <ProseParagraphs paragraphs={spec.approach} />
        <div className="mt-4 rounded-xl border border-navy/10 bg-white/80 p-4">
          <p className="text-sm font-semibold text-navy">다루지 않는 범위</p>
          <ul className="mt-2 list-disc space-y-0.5 pl-5 text-sm text-navy/75">
            {spec.scopeExclusions.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>
      </ContentSection>

      <ContentSection id="fee" title="강사료가 달라지는 요소">
        <ul className="grid gap-2 sm:grid-cols-2">
          {spec.feeFactors.map((line) => (
            <li
              key={line}
              className="rounded-lg border border-navy/10 bg-cream/40 px-3 py-2 text-sm text-navy/80"
            >
              {line}
            </li>
          ))}
        </ul>
        <p className="mt-3 text-sm font-medium text-navy">
          기관 강사료 기준이 있다면 알려주세요. 고정 단가를 먼저 제시하지 않고, 기준표에
          맞춰 가능한 구성을 회신합니다.
        </p>
      </ContentSection>

      <ContentSection id="profile" title="강사 프로필·강의계획서">
        <ul className="list-disc space-y-1 pl-5 text-sm leading-relaxed text-navy/80 md:text-base">
          {spec.profileGuide.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
        <p className="mt-3 text-sm text-navy/70">
          자격·경력 전체는{" "}
          <Link
            href="/강사소개"
            className="font-medium text-navy underline-offset-2 hover:underline"
          >
            강사 프로필
          </Link>
          , 기관별 출강 기록은{" "}
          <Link
            href="/강의이력"
            className="font-medium text-navy underline-offset-2 hover:underline"
          >
            강의 이력
          </Link>
          에서 볼 수 있습니다.
        </p>
      </ContentSection>

      <ContentSection id={INQUIRY_ANCHOR} title={spec.ctaLabel}>
        <p className="mb-4 text-sm text-navy/75">{spec.ctaNote}</p>
        <LectureInquiryForm
          variant="target"
          heading={spec.ctaLabel}
          defaultTopic={spec.inquiryTopic}
          defaultAudience={spec.inquiryAudience}
        />
      </ContentSection>

      <ContentSection id="faq" title="자주 묻는 질문">
        <FAQAccordion items={content.faqs} />
      </ContentSection>

      <ContentSection id="related" title="함께 보는 강의 안내">
        <RelatedContentGrid links={spec.related} variant="cards" />
      </ContentSection>

      {content.disclaimer ? (
        <WarningBox title="안내 범위">
          <p>{content.disclaimer}</p>
        </WarningBox>
      ) : null}
    </>
  );
}

function CardGrid({ cards }: { cards: LectureTargetCard[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {cards.map((card) => (
        <div key={card.title} className="rounded-xl border border-navy/10 bg-white/80 p-4">
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
          <p className="mt-1 text-sm leading-relaxed text-navy/75">{card.description}</p>
          {card.bullets?.length ? (
            <ul className="mt-2 list-disc space-y-0.5 pl-5 text-sm text-navy/70">
              {card.bullets.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          ) : null}
        </div>
      ))}
    </div>
  );
}
