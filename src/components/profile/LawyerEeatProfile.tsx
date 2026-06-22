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

type EeatFact = {
  term: string;
  description: string;
  meta?: string;
  href?: string;
};

type LawyerEeatProfileProps = {
  variant?: "full" | "compact";
};

function EeatFactList({ items }: { items: EeatFact[] }) {
  return (
    <dl className="mt-4 space-y-3">
      {items.map((item) => (
        <div
          key={`${item.term}-${item.meta ?? ""}`}
          className="rounded-xl border border-beige-dark bg-white px-4 py-4 md:px-5"
        >
          <dt className="text-base font-semibold text-navy md:text-lg">
            {item.href ? (
              <Link
                href={item.href}
                className="underline-offset-4 hover:text-navy-light hover:underline"
              >
                {item.term}
              </Link>
            ) : (
              item.term
            )}
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
      ))}
    </dl>
  );
}

function EeatSection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className="section-anchor scroll-mt-[calc(var(--header-height)+1rem)]"
      aria-labelledby={`${id}-heading`}
    >
      <h3 id={`${id}-heading`} className="text-lg font-bold text-navy md:text-xl">
        {title}
      </h3>
      {children}
    </section>
  );
}

function sliceItems<T>(items: T[], compact: boolean, limit = 2): T[] {
  return compact ? items.slice(0, limit) : items;
}

export function LawyerEeatProfile({ variant = "full" }: LawyerEeatProfileProps) {
  const compact = variant === "compact";
  const pressArticles = getAllPressArticles();
  const naverBlog = getNaverBlogUrl();

  const pressItems: EeatFact[] = [
    ...sliceItems(pressArticles, compact, 3).map((article) => ({
      term: article.title,
      meta: `${article.source} · ${article.publishedAtDisplay}`,
      description: article.seoDescription ?? article.paragraphs[0] ?? "",
      href: getPressArticleHref(article.slug),
    })),
    {
      term: "법률 칼럼·실무 사례",
      meta: "다옴법무사사무소 공식 포스팅",
      description: "상속·부동산·법인·회생 관련 법률 정보와 실무 사례를 게시합니다.",
      href: "/blog",
    },
    {
      term: "네이버 블로그",
      meta: "안윤정 법무사",
      description: "부산 지역 법률 실무와 생활 법률 정보를 정기적으로 기고합니다.",
      href: naverBlog,
    },
  ];

  if (compact) {
    pressItems.splice(3);
  }

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
              실무경력·자격·수상·위원 위촉·강의·언론 활동·전문분야를 정리한 공식
              프로필입니다.
            </p>
          </div>
          {compact ? (
            <Link href="/about" className="btn-secondary shrink-0">
              전체 프로필 보기
            </Link>
          ) : null}
        </div>

        <div className={`space-y-8 ${compact ? "mt-10" : "mt-8"}`}>
          <EeatSection id="experience" title="실무경력">
            <EeatFactList
              items={sliceItems(lawyerExperience, compact).map((item) => ({
                term: item.title,
                meta: item.period,
                description: item.description,
              }))}
            />
          </EeatSection>

          <EeatSection id="credentials" title="자격사항">
            <EeatFactList
              items={sliceItems(getLawyerQualifications(), compact, 4).map(
                (item) => ({
                  term: item.name,
                  meta: item.category,
                  description: item.detail ?? item.name,
                }),
              )}
            />
          </EeatSection>

          <EeatSection id="awards" title="수상내역">
            <EeatFactList
              items={getLawyerAwards().map((item) => ({
                term: item.name,
                meta: [item.year, item.category].filter(Boolean).join(" · "),
                description: item.detail ?? "",
              }))}
            />
          </EeatSection>

          <EeatSection id="appointments" title="위원 위촉">
            <EeatFactList
              items={sliceItems(getLawyerAppointments(), compact).map((item) => ({
                term: item.title,
                meta: [item.organization, item.period].filter(Boolean).join(" · "),
                description: item.summary,
              }))}
            />
          </EeatSection>

          <EeatSection id="lectures" title="강의활동">
            <EeatFactList
              items={sliceItems(lawyerLectures, compact).map((item) => ({
                term: item.venue,
                meta: [item.topic, item.period, item.audience && `대상: ${item.audience}`]
                  .filter(Boolean)
                  .join(" · "),
                description: item.summary,
              }))}
            />
          </EeatSection>

          <EeatSection id="press" title="언론 및 기고">
            <EeatFactList items={pressItems} />
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
