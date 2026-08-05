import type { ReactNode } from "react";
import Link from "next/link";
import { getNaverBlogUrl } from "@/lib/contact";
import {
  getLawyerAppointments,
  getLawyerAwards,
  getLawyerQualifications,
  lawyerExperience,
  lawyerLectures,
  lawyerProfileMeta,
} from "@/lib/lawyer-profile";
import { getAllPressArticles, getPressArticleHref } from "@/lib/press-articles";
import {
  eeatAppointmentThumbs,
  eeatAwardThumbs,
  eeatExperienceThumbs,
  eeatLectureThumbs,
  eeatPressExtraThumbs,
  type EeatThumbImage,
} from "@/lib/lawyer-eeat-images";
import { EeatFactThumb } from "@/components/profile/EeatFactThumb";

type EeatFact = {
  term: string;
  description: string;
  meta?: string;
  href?: string;
  image?: EeatThumbImage;
};

type LawyerEeatProfileProps = {
  variant?: "full" | "compact";
};

function EeatFactTerm({ item }: { item: EeatFact }) {
  if (item.href) {
    return (
      <Link
        href={item.href}
        className="underline-offset-4 hover:text-navy-light hover:underline"
      >
        {item.term}
      </Link>
    );
  }
  return item.term;
}

function EeatFactList({ items }: { items: EeatFact[] }) {
  return (
    <dl className="eeat-fact-list mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
      {items.map((item) => (
        <div
          key={`${item.term}-${item.meta ?? ""}`}
          className="eeat-fact flex h-full items-center gap-3 rounded-xl border border-beige-dark bg-white px-3.5 py-3.5 md:gap-4 md:px-5 md:py-4"
        >
          <div className="min-w-0 flex-1">
            <dt className="text-base font-semibold leading-snug text-navy md:text-lg">
              <EeatFactTerm item={item} />
            </dt>
            {item.meta ? (
              <dd className="mt-1 text-xs font-medium text-navy-light md:text-sm">
                {item.meta}
              </dd>
            ) : null}
            <dd className="mt-2 text-sm leading-relaxed text-navy/75 md:text-base">
              {item.description}
            </dd>
          </div>
          <EeatFactThumb image={item.image} />
        </div>
      ))}
    </dl>
  );
}

/** 제목 100% → 하위 본문·이미지를 기존 비율(flex-1 : 썸네일)로 병렬 배치 */
function EeatStackedFactList({ items }: { items: EeatFact[] }) {
  return (
    <dl className="eeat-stacked-fact-list mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
      {items.map((item) => (
        <div
          key={`${item.term}-${item.meta ?? ""}`}
          className="eeat-stacked-fact flex h-full flex-col rounded-xl border border-beige-dark bg-white px-3.5 py-3.5 md:px-5 md:py-4"
        >
          <dt className="w-full text-base font-semibold leading-snug text-navy md:text-lg">
            <EeatFactTerm item={item} />
          </dt>
          <div className="eeat-stacked-fact__body mt-2 flex min-h-0 flex-1 items-center gap-3 md:gap-4">
            <div className="min-w-0 flex-1">
              {item.meta ? (
                <dd className="text-xs font-medium text-navy-light md:text-sm">
                  {item.meta}
                </dd>
              ) : null}
              <dd
                className={
                  item.meta
                    ? "mt-2 text-sm leading-relaxed text-navy/75 md:text-base"
                    : "text-sm leading-relaxed text-navy/75 md:text-base"
                }
              >
                {item.description}
              </dd>
            </div>
            <EeatFactThumb image={item.image} />
          </div>
        </div>
      ))}
    </dl>
  );
}

function EeatProfileFactList({
  items,
  stacked,
}: {
  items: EeatFact[];
  stacked: boolean;
}) {
  return stacked ? (
    <EeatStackedFactList items={items} />
  ) : (
    <EeatFactList items={items} />
  );
}

function EeatSection({
  id,
  title,
  children,
  moreHref,
  showMore = false,
}: {
  id: string;
  title: string;
  children: ReactNode;
  moreHref?: string;
  showMore?: boolean;
}) {
  const headingId = `${id}-heading`;
  const more = Boolean(showMore && moreHref);

  return (
    <section
      id={id}
      className="section-anchor scroll-mt-[calc(var(--header-height)+1rem)]"
      aria-labelledby={headingId}
    >
      <div className="eeat-section-head">
        <h3 id={headingId} className="eeat-section-title">
          {title}
        </h3>
        {more ? (
          <Link
            href={moreHref!}
            className="eeat-section-more"
            aria-label={`${title} 더보기`}
          >
            <span className="eeat-section-more__label">더보기</span>
            <span className="eeat-section-more__chevron" aria-hidden="true">
              ›
            </span>
          </Link>
        ) : null}
      </div>
      {children}
    </section>
  );
}

function sliceItems<T>(items: T[], compact: boolean, limit = 2): T[] {
  return compact ? items.slice(0, limit) : items;
}

function hasMoreItems(total: number, compact: boolean, limit = 2): boolean {
  return compact && total > limit;
}

export function LawyerEeatProfile({ variant = "full" }: LawyerEeatProfileProps) {
  const compact = variant === "compact";
  const pressArticles = getAllPressArticles();
  const naverBlog = getNaverBlogUrl();

  const pressFromArticles: EeatFact[] = pressArticles.map((article) => ({
    term: article.title,
    meta: [
      article.source,
      article.publishedAtDisplay,
      article.topic,
    ]
      .filter(Boolean)
      .join(" · "),
    description: article.seoDescription ?? article.paragraphs[0] ?? "",
    href: getPressArticleHref(article.slug),
    image: {
      src: article.image.src,
      alt: article.image.alt,
    },
  }));

  const pressExtras: EeatFact[] = [
    {
      term: "법률 칼럼·실무 사례",
      meta: "다옴법무사사무소 네이버 블로그",
      description: "상속·부동산·법인·회생 관련 법률 정보와 실무 사례를 게시합니다.",
      href: "/blog",
      image: eeatPressExtraThumbs["법률 칼럼·실무 사례"],
    },
    {
      term: "네이버 블로그",
      meta: "안윤정 법무사",
      description: "부산 지역 법률 실무와 생활 법률 정보를 정기적으로 기고합니다.",
      href: naverBlog,
      image: eeatPressExtraThumbs["네이버 블로그"],
    },
  ];

  // 메인(compact)에서는 등록된 언론 기사 전체를 노출하고, 소개 페이지에서는 기고까지 포함
  const pressItems: EeatFact[] = compact
    ? pressFromArticles
    : [...pressFromArticles, ...pressExtras];

  return (
    <section
      id="lawyer-eeat"
      className={
        compact
          ? "section-anchor scroll-mt-[calc(var(--header-height)+1rem)] w-full border-t border-beige-dark bg-cream/40 py-14 md:py-20"
          : "section-anchor scroll-mt-[calc(var(--header-height)+1rem)] card-surface p-5 md:p-8"
      }
      aria-labelledby="lawyer-eeat-heading"
      itemScope
      itemType="https://schema.org/Person"
    >
      <meta itemProp="name" content={lawyerProfileMeta.name} />
      <meta itemProp="jobTitle" content={lawyerProfileMeta.jobTitle} />
      <meta itemProp="worksFor" content={lawyerProfileMeta.organization} />
      <link itemProp="url" href={lawyerProfileMeta.canonicalUrl} />

      <div className={compact ? "mx-auto max-w-6xl px-4 sm:px-6 lg:px-8" : undefined}>
        <div className={compact ? "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between" : undefined}>
          <div>
            <p className="home-section-label text-navy-light">Expert Profile</p>
            <h2 id="lawyer-eeat-heading" className={compact ? "mt-2 text-2xl font-bold text-navy md:text-3xl" : "section-heading"}>
              대표 {lawyerProfileMeta.fullTitle}
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-navy/75 md:text-base">
              {lawyerProfileMeta.organization} 대표로 {lawyerProfileMeta.region}{" "}
              {lawyerProfileMeta.officeArea}에서 법무사 업무를 수행합니다. 아래는
              실무경력·자격·수상·위원 위촉·강의·언론 활동을 정리한 공식 프로필이며,
              일자별 위원회·강의 실적 표는 이어서 확인하실 수 있습니다.
            </p>
          </div>
          {compact ? (
            <Link href="/about" className="btn-secondary shrink-0">
              전체 프로필 보기
            </Link>
          ) : null}
        </div>

        <div className={`space-y-8 ${compact ? "mt-10" : "mt-8"}`}>
          <EeatSection
            id="experience"
            title="실무경력"
            moreHref="/about#experience"
            showMore={hasMoreItems(lawyerExperience.length, compact)}
          >
            <EeatProfileFactList
              stacked={!compact}
              items={sliceItems(lawyerExperience, compact).map((item) => ({
                term: item.title,
                meta: item.period,
                description: item.description,
                image: eeatExperienceThumbs[item.title],
              }))}
            />
          </EeatSection>

          <EeatSection
            id="credentials"
            title="자격사항"
            moreHref="/about#credentials"
            showMore={hasMoreItems(getLawyerQualifications().length, compact, 6)}
          >
            <EeatFactList
              items={sliceItems(getLawyerQualifications(), compact, 6).map(
                (item) => ({
                  term: item.name,
                  meta: [item.year, item.category].filter(Boolean).join(" · "),
                  description: item.detail ?? item.name,
                }),
              )}
            />
          </EeatSection>

          <EeatSection
            id="awards"
            title="수상내역"
            moreHref="/about#awards"
            showMore={hasMoreItems(getLawyerAwards().length, compact)}
          >
            <EeatFactList
              items={sliceItems(getLawyerAwards(), compact).map((item) => ({
                term: item.name,
                meta: [item.year, item.category].filter(Boolean).join(" · "),
                description: item.detail ?? "",
                image: eeatAwardThumbs[item.name],
              }))}
            />
          </EeatSection>

          <EeatSection
            id="appointments"
            title="위원 위촉"
            moreHref="/about#appointments"
            showMore={hasMoreItems(getLawyerAppointments().length, compact)}
          >
            <EeatProfileFactList
              stacked={!compact}
              items={sliceItems(getLawyerAppointments(), compact).map((item) => ({
                term: item.title,
                meta: [item.organization, item.period].filter(Boolean).join(" · "),
                description: item.summary,
                image: eeatAppointmentThumbs[item.title],
              }))}
            />
          </EeatSection>

          <EeatSection
            id="lectures"
            title="강의활동"
            moreHref="/강의이력"
            showMore={hasMoreItems(lawyerLectures.length, compact)}
          >
            <EeatProfileFactList
              stacked={!compact}
              items={sliceItems(lawyerLectures, compact).map((item) => ({
                term: item.venue,
                meta: [item.topic, item.period, item.audience && `대상: ${item.audience}`]
                  .filter(Boolean)
                  .join(" · "),
                description: item.summary,
                image: eeatLectureThumbs[item.venue],
              }))}
            />
          </EeatSection>

          <EeatSection
            id="press"
            title="언론 및 기고"
            moreHref="/media#press"
            showMore={compact}
          >
            <EeatProfileFactList stacked={!compact} items={pressItems} />
          </EeatSection>

          <EeatSection id="practice-areas" title="전문분야">
            <ul className="mt-4 flex flex-wrap gap-2">
              {lawyerProfileMeta.practiceAreas.map((area) => (
                <li
                  key={area}
                  className="rounded-full bg-beige px-3 py-1.5 text-sm font-medium text-navy"
                >
                  {area}
                </li>
              ))}
            </ul>
            {!compact ? (
              <p className="mt-4 text-sm leading-relaxed text-navy/65">
                상속·부동산·법인·회생 분야 등기 및 신청 절차를 직접 상담·진행합니다.
              </p>
            ) : null}
          </EeatSection>
        </div>
      </div>
    </section>
  );
}
