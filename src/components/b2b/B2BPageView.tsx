import Link from "next/link";
import { Suspense } from "react";
import { B2BHero } from "@/components/b2b/B2BHero";
import { B2BSections } from "@/components/b2b/B2BSections";
import { B2BCTA } from "@/components/b2b/B2BCTA";
import { CollaborationDirectory } from "@/components/b2b/CollaborationDirectory";
import {
  CollaborationPrinciples,
  ProjectProcessTimeline,
} from "@/components/b2b/CollaborationPrinciples";
import { PartnerTypeGrid } from "@/components/b2b/PartnerTypeGrid";
import { ProjectBriefForm } from "@/components/b2b/ProjectBriefForm";
import { SharePrintBar } from "@/components/b2b/SharePrintBar";
import { WorkPurposeGrid } from "@/components/b2b/WorkPurposeGrid";
import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { RelatedContentGrid } from "@/components/readability";
import { FAQAccordion } from "@/components/sections/FAQAccordion";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  COLLABORATION_PRINCIPLES,
  PARTNER_CARDS,
  PROJECT_PROCESS_STEPS,
  getB2BPageContent,
} from "@/lib/b2b";
import { collaborationCategoryLabels } from "@/lib/b2b/collaboration-registry";
import { buildJsonLdForPageData } from "@/lib/pageData/json-ld";
import type { PageData } from "@/lib/pageData/types";

type B2BPageViewProps = {
  page: PageData;
};

const DETAIL_AUDIENCE: Record<string, string[]> = {
  부산법무사복대리: ["타지역 법무사", "법무법인", "변호사사무실", "원거리 의뢰"],
  부산부동산협력법무사: [
    "공인중개사",
    "중개사무소",
    "분양사무실",
    "법인 거래 지원",
  ],
  부산부동산등기복대리: ["타지역 법무사", "부동산등기 담당", "현지 접수 협업"],
  부산법인등기복대리: ["타지역 법무사", "법인등기 담당", "본점이전·임원변경"],
  부산잔금등기협업: ["공인중개사", "매매 담당", "잔금일 조율"],
  부산시행사등기: ["시행사", "분양대행", "프로젝트 담당"],
  부산건축사등기협업: ["건축사사무소", "건축주 안내", "사용승인 이후"],
  부산법인등기아웃소싱: ["기업 담당자", "반복 법인변경", "아웃소싱 검토"],
};

export function B2BPageView({ page }: B2BPageViewProps) {
  const content = getB2BPageContent(page.slug);
  if (!content) return null;

  const isHub = page.slug === "partners";
  const isInquiry = page.slug === "협업문의";

  const faqSchemaPage: PageData = {
    ...page,
    faqs: content.faqs,
    includeFaqSchema: true,
  };

  const audienceLabels = isHub
    ? [
        "법무사·법무법인",
        "공인중개사",
        "건축사",
        "시행·건설",
        "기업·기관",
        "전문직",
      ]
    : (DETAIL_AUDIENCE[page.slug] ?? []);

  const categoryLabel =
    page.slug.includes("복대리") ||
    page.slug.includes("접수") ||
    page.slug.includes("보정") ||
    page.slug.includes("현지") ||
    page.slug.includes("원거리")
      ? collaborationCategoryLabels.delegation
      : page.slug.includes("잔금") || page.slug.includes("부동산협력")
        ? collaborationCategoryLabels["real-estate"]
        : page.slug.includes("시행") ||
            page.slug.includes("건설") ||
            page.slug.includes("분양") ||
            page.slug.includes("건축사") ||
            page.slug.includes("집단")
          ? collaborationCategoryLabels.construction
          : page.slug.includes("아웃소싱") || page.slug.includes("공공")
            ? collaborationCategoryLabels["corporate-public"]
            : null;

  return (
    <article className="b2b-page space-y-8 md:space-y-12">
      <Breadcrumb items={page.breadcrumbs} />
      <BreadcrumbJsonLd items={page.breadcrumbs} currentPath={page.path} />
      <JsonLd data={buildJsonLdForPageData(faqSchemaPage)} />

      {categoryLabel && !isHub && !isInquiry ? (
        <p className="text-xs font-semibold tracking-wide text-navy/50">
          {categoryLabel}
        </p>
      ) : null}

      <B2BHero
        eyebrow={content.eyebrow}
        h1={content.h1}
        intro={content.heroIntro}
        primaryCta={content.primaryCta}
        secondaryCta={content.secondaryCta}
        audienceLabels={audienceLabels}
        trustItems={content.trustItems}
        hideInquiryBadge={isHub}
      />

      <SharePrintBar
        title={content.metaTitle}
        sourcePage={page.slug}
        printLabel={isHub ? "협업문의 안내 인쇄" : "인쇄"}
      />

      <div className="max-w-3xl space-y-3">
        {content.heroParagraphs.map((p) => (
          <p key={p.slice(0, 32)} className="body-text text-navy/80">
            {p}
          </p>
        ))}
      </div>

      {isHub ? (
        <>
          <section
            id="partner-types"
            className="scroll-mt-[calc(var(--header-height)+1rem)]"
          >
            <h2 className="section-heading">방문자 유형 선택</h2>
            <p className="body-text mt-2 max-w-3xl text-navy/75">
              문의자 유형을 고르면 관련 상세 안내 또는 문의서로 연결됩니다.
            </p>
            <div className="mt-5">
              <PartnerTypeGrid cards={PARTNER_CARDS} sourcePage={page.slug} />
            </div>
          </section>

          <section
            id="work-purposes"
            className="scroll-mt-[calc(var(--header-height)+1rem)]"
          >
            <h2 className="section-heading">업무 목적 선택</h2>
            <p className="body-text mt-2 max-w-3xl text-navy/75">
              필요한 업무 목적을 선택하면 맞는 상세 페이지 또는 문의서로
              이동합니다.
            </p>
            <div className="mt-5">
              <WorkPurposeGrid />
            </div>
          </section>

          <section
            id="all-services"
            className="scroll-mt-[calc(var(--header-height)+1rem)]"
          >
            <h2 className="section-heading">전체 협업업무 디렉터리</h2>
            <p className="body-text mt-2 max-w-3xl text-navy/75">
              분야별로 대표 안내를 모았습니다. 제목과 한 줄 설명을 함께
              확인하세요.
            </p>
            <div className="mt-5">
              <CollaborationDirectory />
            </div>
          </section>

          <section id="principles">
            <h2 className="section-heading">협업 원칙</h2>
            <div className="mt-5">
              <CollaborationPrinciples items={COLLABORATION_PRINCIPLES} />
            </div>
          </section>

          <section id="process">
            <h2 className="section-heading">일반적인 협업 흐름</h2>
            <p className="body-text mt-2 max-w-3xl text-navy/75">
              실제 모든 사건이 같은 절차로 처리된다고 단정하지 않습니다. 관할·서류·일정에
              따라 조정됩니다.
            </p>
            <div className="mt-5">
              <ProjectProcessTimeline steps={PROJECT_PROCESS_STEPS} />
            </div>
          </section>

          <section
            id="print-guide"
            className="b2b-print-guide hidden print:block"
          >
            <h2 className="section-heading">협업문의 안내 요약</h2>
            <p className="mt-2 text-sm">다옴법무사사무소 · 부산 해운대구·센텀</p>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm">
              <li>복대리·현지 업무</li>
              <li>부동산·건축 협업</li>
              <li>집단·대량등기</li>
              <li>기업·공공기관 등기</li>
            </ul>
            <p className="mt-3 text-sm">
              문의: 협업 문의서 · 협업문의 종합안내
            </p>
          </section>
        </>
      ) : null}

      <B2BSections sections={content.sections} />

      {!isHub && !isInquiry ? (
        <section id="principles">
          <h2 className="section-heading">협업 원칙</h2>
          <div className="mt-5">
            <CollaborationPrinciples items={COLLABORATION_PRINCIPLES} />
          </div>
        </section>
      ) : null}

      {isInquiry ? (
        <Suspense
          fallback={
            <div className="card-surface p-5 text-sm text-navy/70 md:p-8">
              문의 양식을 불러오는 중…
            </div>
          }
        >
          <ProjectBriefForm sourcePage={page.slug} />
        </Suspense>
      ) : null}

      <section id="faq">
        <h2 className="section-heading">자주 묻는 질문</h2>
        <div className="mt-4">
          <FAQAccordion items={content.faqs} />
        </div>
      </section>

      <B2BCTA
        description={content.bottomCtaText}
        primary={
          isHub
            ? { href: "/협업문의", label: "협업 문의서 작성" }
            : content.primaryCta
        }
        secondary={
          isInquiry
            ? { href: "/contact", label: "개인 상담 안내 보기" }
            : isHub
              ? { href: "#all-services", label: "전체 협업업무 보기" }
              : { href: "/partners", label: "협업문의 전체 안내" }
        }
      />

      <section id="related">
        <h2 className="section-heading">관련 안내</h2>
        <div className="mt-4">
          <RelatedContentGrid links={content.relatedLinks} />
        </div>
      </section>
      {!isInquiry ? (
        <p className="text-center text-sm text-navy/60">
          개인 의뢰 상담은{" "}
          <Link href="/contact" className="underline">
            상담 안내
          </Link>
          를 이용해 주세요.
        </p>
      ) : null}
    </article>
  );
}
