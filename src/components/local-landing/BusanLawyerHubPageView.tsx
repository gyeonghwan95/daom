import Link from "next/link";
import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { JsonLd } from "@/components/seo/JsonLd";
import { FAQAccordion } from "@/components/sections/FAQAccordion";
import { PageCoverBanner } from "@/components/sections/PageCoverBanner";
import { ArticleVisualSlot } from "@/components/media/ArticleVisual";
import { HubLawyerPortrait } from "@/components/local-landing/HubLawyerPortrait";
import {
  ChecklistBox,
  ConsultationCTA,
  ContentSection,
  InfoCard,
  PageHero,
  PageTableOfContents,
  ProseParagraphs,
  RelatedContentGrid,
} from "@/components/readability";
import {
  busanLawyerHubCases,
  busanLawyerHubCostGuide,
  busanLawyerHubDistrictLinks,
  busanLawyerHubEyebrow,
  busanLawyerHubFaqs,
  busanLawyerHubH1,
  busanLawyerHubHeroParagraphs,
  busanLawyerHubIntake,
  busanLawyerHubInternalLinks,
  busanLawyerHubNap,
  busanLawyerHubProcess,
  busanLawyerHubReviewedLabel,
  busanLawyerHubSituations,
  busanLawyerHubWorkAreas,
} from "@/lib/local-landing/busan-lawyer-hub-content";
import { consultationInquiryCopy } from "@/lib/consultation-inquiry";
import { buildJsonLdForPageData } from "@/lib/pageData/json-ld";
import { siteImages } from "@/lib/site-images";
import type { PageData } from "@/lib/pageData/types";

type BusanLawyerHubPageViewProps = {
  page: PageData;
};

const INQUIRY_HREF =
  "/contact/inquiry?from=부산법무사&intent=업무 가능 여부 확인";

export function BusanLawyerHubPageView({ page }: BusanLawyerHubPageViewProps) {
  const cover = {
    ...siteImages.office.exterior,
    alt: "해운대·센텀 다옴법무사사무소 전경",
  };

  const faqSchemaPage: PageData = {
    ...page,
    faqs: busanLawyerHubFaqs.map((f) => ({
      question: f.question,
      answer: f.answer,
    })),
    includeFaqSchema: true,
  };

  const tocItems = [
    { id: "situations", label: "어떤 절차가 필요하신가요?" },
    { id: "work-areas", label: "많이 맡기는 업무" },
    { id: "lawyer-vs-attorney", label: "법무사와 변호사" },
    { id: "process", label: "어떻게 진행하나요" },
    { id: "intake", label: "상담 전 알려주시면 되는 것" },
    { id: "office", label: "사무소 위치" },
    { id: "cases", label: "상담 사례" },
    { id: "lawyer", label: "누가 상담하나요" },
    { id: "cost", label: "비용이 달라지는 이유" },
    { id: "districts", label: "구·군 생활권 안내" },
    { id: "faq", label: "자주 묻는 질문" },
    { id: "related", label: "관련 안내" },
    { id: "consultation", label: "상담 문의" },
  ];

  return (
    <article className="content-stack">
      <Breadcrumb items={page.breadcrumbs} />
      <BreadcrumbJsonLd items={page.breadcrumbs} currentPath={page.path} />
      <JsonLd data={buildJsonLdForPageData(faqSchemaPage)} />

      <PageCoverBanner image={cover} />

      <PageHero
        h1={busanLawyerHubH1}
        eyebrow={busanLawyerHubEyebrow}
        introParagraphs={busanLawyerHubHeroParagraphs}
        keywords={[]}
        ctaLabel={consultationInquiryCopy.ctaShort}
        ctaHref={INQUIRY_HREF}
        showDiagnosisCta={false}
        showAboutLawyerCta
        showNaverReservation
      >
        <div className="mt-4 md:mt-5">
          <ChecklistBox
            items={[
              "부모님 부동산 상속·상속포기·한정승인",
              "아파트 매매 잔금일 소유권이전",
              "법인 설립·임원변경",
              "개인회생·파산 신청 서류",
            ]}
          />
        </div>
      </PageHero>

      <ArticleVisualSlot
        path={page.path}
        slot="after-intro"
        category={page.category}
        serviceSlug={page.serviceSlug}
      />

      <PageTableOfContents items={tocItems} />

      <ContentSection id="situations" title="어떤 절차가 필요하신가요?">
        <p className="body-text mb-5">
          지금 상황에 가까운 항목을 고르시면 해당 안내로 이어집니다.
        </p>
        <div className="grid items-stretch gap-3 sm:grid-cols-2">
          {busanLawyerHubSituations.map((card) => (
            <InfoCard key={card.title} variant="highlight">
              <h3 className="text-base font-semibold text-navy md:text-lg">
                {card.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-navy/80">
                {card.body}
              </p>
              <ul className="mt-3 space-y-2">
                {card.links.map((link) => (
                  <li key={link.href + link.label}>
                    <Link
                      href={link.href}
                      className="text-sm font-medium text-navy underline-offset-2 hover:underline md:text-base"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </InfoCard>
          ))}
        </div>
      </ContentSection>

      <ContentSection id="work-areas" title="부산 법무사에게 많이 맡기는 업무">
        <div className="grid items-stretch gap-4 sm:grid-cols-2">
          {busanLawyerHubWorkAreas.map((area) => (
            <InfoCard key={area.title}>
              <h3 className="text-base font-semibold text-navy md:text-lg">
                {area.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-navy/80">
                {area.items.join(" · ")}
              </p>
              <ul className="mt-3 space-y-2">
                {area.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm font-medium text-navy underline-offset-2 hover:underline"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </InfoCard>
          ))}
        </div>
      </ContentSection>

      <ContentSection id="lawyer-vs-attorney" title="법무사와 변호사는 다릅니다">
        <ProseParagraphs
          paragraphs={[
            "네이버에서 ‘부산 법무사’를 검색하면 변호사 사무소나 로펌이 함께 보이기도 합니다. 소송·형사 변론이 필요하면 변호사가 맞고, 등기·상속 서류·법인변경·개인회생 신청 서류라면 법무사 업무입니다.",
            "다옴법무사사무소는 법무사 사무소입니다. 사건 성격이 소송 쪽으로 보이면 그 범위는 분명히 말씀드리고, 법무사가 진행할 수 있는 절차부터 정리합니다.",
          ]}
        />
      </ContentSection>

      <ArticleVisualSlot
        path={page.path}
        slot="before-procedures"
        category={page.category}
        serviceSlug={page.serviceSlug}
      />

      <ContentSection id="process" title="어떻게 진행하나요">
        <div className="grid items-stretch gap-4 md:grid-cols-2">
          {busanLawyerHubProcess.map((step) => (
            <InfoCard key={step.title}>
              <h3 className="text-base font-semibold text-navy md:text-lg">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-navy/85 md:text-base">
                {step.body}
              </p>
            </InfoCard>
          ))}
        </div>
      </ContentSection>

      <ContentSection id="intake" title="상담 전 이것만 알려주시면 됩니다">
        <p className="body-text mb-5">
          처음부터 모든 서류를 준비할 필요는 없습니다. 아래 항목만 알려 주셔도
          필요한 절차와 다음 자료를 구분할 수 있습니다.
        </p>
        <div className="grid items-stretch gap-3 sm:grid-cols-2">
          {busanLawyerHubIntake.map((group) => (
            <InfoCard key={group.title} title={group.title}>
              <ul className="list-disc space-y-1 pl-5 text-sm text-navy/80">
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </InfoCard>
          ))}
        </div>
      </ContentSection>

      <ContentSection id="office" title="해운대·센텀 사무소에서 상담합니다">
        <ProseParagraphs
          paragraphs={[
            `${busanLawyerHubNap.officeName}는 ${busanLawyerHubNap.address}에 있습니다. ${busanLawyerHubNap.access}. 부산지방법원 바로 앞은 아니지만, 부동산·법인 본점이 부산 어디에 있든 상담은 가능합니다.`,
            "법원·등기소와 공식 제휴 관계는 아닙니다. 관할·접수·서류는 실무 기준으로 안내합니다.",
            `주소·전화·상담 시간·업무 범위는 ${busanLawyerHubReviewedLabel} 기준으로 이 페이지에서 확인할 수 있습니다.`,
          ]}
        />
        <div className="mt-5 grid items-stretch gap-3 sm:grid-cols-2">
          <InfoCard title="주소">
            <p className="text-sm leading-relaxed text-navy/80">
              {busanLawyerHubNap.address}
            </p>
          </InfoCard>
          <InfoCard title="상담 시간">
            <p className="text-sm leading-relaxed text-navy/80">
              {busanLawyerHubNap.hours} (점심 {busanLawyerHubNap.lunch} /{" "}
              {busanLawyerHubNap.closed} 휴무)
            </p>
          </InfoCard>
          <InfoCard title="전화">
            <p className="text-sm leading-relaxed text-navy/80">
              {busanLawyerHubNap.phone}
            </p>
          </InfoCard>
          <InfoCard title="방문">
            <p className="text-sm leading-relaxed text-navy/80">
              {busanLawyerHubNap.visit}{" "}
              <Link
                href="/location"
                className="font-medium text-navy underline-offset-2 hover:underline"
              >
                오시는 길
              </Link>
            </p>
          </InfoCard>
        </div>
      </ContentSection>

      <ContentSection id="cases" title="상담·업무 사례">
        <p className="body-text mb-5">
          사이트에 공개된 실제 사례입니다. 개별 사건의 결과나 완료 시점을
          보장하지는 않습니다.
        </p>
        <div className="grid items-stretch gap-4 md:grid-cols-3">
          {busanLawyerHubCases.map((item) => (
            <InfoCard key={item.href}>
              <h3 className="text-base font-semibold text-navy md:text-lg">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-navy/85">
                <span className="font-medium text-navy">상황. </span>
                {item.situation}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-navy/85">
                <span className="font-medium text-navy">확인. </span>
                {item.checked}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-navy/85">
                <span className="font-medium text-navy">진행. </span>
                {item.next}
              </p>
              <p className="mt-auto pt-3">
                <Link
                  href={item.href}
                  className="text-sm font-medium text-navy underline-offset-2 hover:underline"
                >
                  사례 자세히 보기
                </Link>
              </p>
            </InfoCard>
          ))}
        </div>
      </ContentSection>

      <ContentSection id="lawyer" title="누가 상담하나요">
        <HubLawyerPortrait
          alt="부산에서 법무사 상담을 진행하는 안윤정 법무사"
          showHomeOfficeLink
          paragraphs={[
            "다옴법무사사무소 대표 법무사입니다. 상속등기·부동산등기·법인등기·개인회생 상담과 진행을 직접 맡습니다.",
            "검색으로 찾은 정보가 실제 절차와 맞는지 먼저 짚고, 지금 할 일과 나중 할 일을 나눕니다. 대한법무사협회장 표창 수상 이력과 공공·정책 활동은 소개 페이지에서 이어서 확인하실 수 있습니다.",
          ]}
        />
      </ContentSection>

      <ContentSection id="cost" title="비용은 어떻게 정해지나요">
        <ProseParagraphs
          paragraphs={[
            busanLawyerHubCostGuide,
            "견적은 등기부나 가족관계, 정관·의사록을 본 뒤에 구체화됩니다. 항목을 먼저 보고 싶으시면 비용 안내를 참고하세요.",
          ]}
        />
        <p className="mt-3">
          <Link
            href="/부산법무사비용"
            className="text-sm font-medium text-navy underline-offset-2 hover:underline"
          >
            부산 법무사 비용 보기
          </Link>
        </p>
      </ContentSection>

      <ContentSection id="districts" title="구·군 생활권 안내">
        <ProseParagraphs
          paragraphs={[
            "연제구·사직동처럼 구·동 이름으로 찾으셔도 사건은 해운대 센텀에서 상담합니다. 아래 구·군 안내에서 동 생활권과 관할을 이어서 확인하시면 됩니다.",
          ]}
        />
        <RelatedContentGrid links={busanLawyerHubDistrictLinks} columns={2} />
      </ContentSection>

      <ContentSection id="faq" title="자주 묻는 질문">
        <FAQAccordion items={busanLawyerHubFaqs} />
      </ContentSection>

      <ContentSection id="related" title="업무별 안내">
        <RelatedContentGrid links={busanLawyerHubInternalLinks} columns={2} />
      </ContentSection>

      <div id="consultation">
        <ConsultationCTA
          title="업무명을 몰라도 괜찮습니다"
          description="현재 상황과 준비된 자료만 남겨 주세요. 안윤정 법무사가 필요한 절차부터 확인합니다."
          href="/contact/inquiry?from=부산법무사"
          buttonLabel="1분 상담 문의"
          fromPage="부산법무사"
        />
      </div>
    </article>
  );
}
