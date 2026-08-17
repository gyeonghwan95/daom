import Image from "next/image";
import Link from "next/link";
import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { JsonLd } from "@/components/seo/JsonLd";
import { FAQAccordion } from "@/components/sections/FAQAccordion";
import { PageCoverBanner } from "@/components/sections/PageCoverBanner";
import {
  ConsultationCTA,
  ContentSection,
  InfoCard,
  PageHero,
  PageTableOfContents,
  ProseParagraphs,
  RelatedContentGrid,
} from "@/components/readability";
import { getDirectConsultationChannels } from "@/lib/contact";
import {
  registryHubCases,
  registryHubFaqs,
  registryHubHeroParagraphs,
  registryHubIntake,
  registryHubInternalLinks,
  registryHubMidCtas,
  registryHubProcess,
  registryHubSituations,
  registryHubTopic,
  registryHubWorkAreas,
  registryHubEyebrow,
} from "@/lib/local-landing/registry-hub-content";
import { getCoverImageForPageData } from "@/lib/pageData/cover-image";
import { buildJsonLdForPageData } from "@/lib/pageData/json-ld";
import { siteImages } from "@/lib/site-images";
import type { PageData } from "@/lib/pageData/types";

type RegistryHubPageViewProps = {
  page: PageData;
};

const INQUIRY_HREF =
  "/contact/inquiry?from=부산등기법무사&intent=등기업무 확인";

export function RegistryHubPageView({ page }: RegistryHubPageViewProps) {
  const cover = {
    ...getCoverImageForPageData(page),
    alt: "부동산 소유권이전등기 서류 확인",
  };
  const portrait = {
    ...siteImages.about.portrait,
    alt: "부산 등기업무 상담을 진행하는 안윤정 법무사",
  };
  const channels = getDirectConsultationChannels();
  const phone = channels.find((c) => c.id === "phone");
  const kakao = channels.find((c) => c.id === "kakao");

  const faqSchemaPage: PageData = {
    ...page,
    faqs: registryHubFaqs.map((f) => ({
      question: f.question,
      answer: f.answer,
    })),
    includeFaqSchema: true,
  };

  const tocItems = [
    { id: "situations", label: "어떤 등기가 필요하신가요?" },
    { id: "work-areas", label: "많이 맡기는 업무" },
    { id: "process", label: "어떻게 진행하나요" },
    { id: "intake", label: "상담 전 알려주시면 되는 것" },
    { id: "cases", label: "등기 사례" },
    { id: "lawyer", label: "누가 검토하나요" },
    { id: "jurisdiction", label: "부산 등기업무와 관할" },
    { id: "cost", label: "비용이 달라지는 이유" },
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
        h1={registryHubTopic.h1}
        eyebrow={registryHubEyebrow}
        introParagraphs={registryHubHeroParagraphs}
        keywords={[]}
        ctaLabel=""
        showDiagnosisCta={false}
        showAboutLawyerCta={false}
        showNaverReservation={false}
      >
        <ul className="mt-4 list-disc space-y-1 pl-5 text-sm leading-relaxed text-navy/80 md:text-base">
          <li>아파트 매매 잔금일 소유권이전</li>
          <li>부모님 부동산 상속</li>
          <li>가족 간 증여</li>
          <li>대출에 따른 근저당 설정·말소</li>
          <li>회사 설립 또는 임원변경</li>
          <li>신축건물 보존등기</li>
        </ul>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href={INQUIRY_HREF}
            className="btn-primary inline-flex min-h-12 items-center justify-center px-6"
          >
            내 등기업무 확인하기
          </Link>
          {phone?.configured ? (
            <a
              href={phone.href}
              className="btn-secondary inline-flex min-h-12 items-center justify-center px-6"
            >
              전화 상담
            </a>
          ) : null}
          {kakao?.configured ? (
            <a
              href={kakao.href}
              className="btn-secondary inline-flex min-h-12 items-center justify-center px-6"
              target={kakao.external ? "_blank" : undefined}
              rel={kakao.external ? "noopener noreferrer" : undefined}
            >
              카카오톡 문의
            </a>
          ) : null}
        </div>
      </PageHero>

      <PageTableOfContents items={tocItems} />

      <ContentSection id="situations" title="어떤 등기가 필요하신가요?">
        <p className="body-text mb-5 max-w-3xl">
          지금 상황에 가까운 항목을 고르시면 해당 등기 안내로 이어집니다.
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {registryHubSituations.map((card) => (
            <InfoCard key={card.title} variant="highlight">
              <h3 className="text-base font-semibold text-navy md:text-lg">
                {card.title}
              </h3>
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

      <ContentSection
        id="work-areas"
        title="부산 등기 법무사에게 많이 맡기는 업무"
      >
        <div className="grid gap-4 md:grid-cols-3">
          {registryHubWorkAreas.map((area) => (
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

      <ContentSection id="process" title="어떻게 진행하나요">
        <div className="grid gap-4 md:grid-cols-2">
          {registryHubProcess.map((step) => (
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

      <ContentSection id="intake" title="등기 상담 전 이것만 알려주시면 됩니다">
        <p className="body-text mb-5 max-w-3xl">
          처음부터 모든 서류를 준비할 필요는 없습니다. 아래 항목만 알려 주셔도
          필요한 등기와 다음 자료를 구분할 수 있습니다.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {registryHubIntake.map((group) => (
            <InfoCard key={group.title} variant="plain">
              <h3 className="text-base font-semibold text-navy">{group.title}</h3>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-navy/80">
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </InfoCard>
          ))}
        </div>
      </ContentSection>

      <div className="grid gap-4 md:grid-cols-3">
        {registryHubMidCtas.map((cta) => (
          <ConsultationCTA
            key={cta.title}
            title={cta.title}
            description={cta.body}
            href={cta.href}
            buttonLabel={cta.buttonLabel}
            fromPage="부산등기법무사"
            showAboutLawyer={false}
            showNaverReservation={false}
          />
        ))}
      </div>

      <ContentSection id="cases" title="상담·업무 사례">
        <p className="body-text mb-5 max-w-3xl">
          사이트에 공개된 실제 등기 사례입니다. 개별 사건의 결과나 완료 시점을
          보장하지는 않습니다.
        </p>
        <div className="grid gap-4 md:grid-cols-3">
          {registryHubCases.map((item) => (
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
                {item.registration}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-navy/85">
                <span className="font-medium text-navy">서류. </span>
                {item.documents}
              </p>
              <p className="mt-3">
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

      <ContentSection id="lawyer" title="누가 이 등기를 검토하나요">
        <div className="grid items-start gap-6 md:grid-cols-[200px_1fr]">
          <div className="relative aspect-[3/4] max-w-[200px] overflow-hidden rounded-xl border border-beige-dark">
            <Image
              src={portrait.src}
              alt={portrait.alt}
              width={portrait.width}
              height={portrait.height}
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-navy">안윤정 법무사</h3>
            <ProseParagraphs
              paragraphs={[
                "다옴법무사사무소 대표 법무사입니다. 부동산·상속·법인등기 상담과 진행을 직접 맡습니다.",
                "등기 종류만 듣고 서류를 먼저 나열하기보다, 등기부와 현재 상황을 보고 지금 필요한 등기부터 구분합니다. 대한법무사협회장 표창 수상 이력과 공공·정책 활동은 소개 페이지에서 이어서 확인하실 수 있습니다.",
              ]}
            />
            <p className="mt-4">
              <Link
                href="/about"
                className="text-sm font-medium text-navy underline-offset-2 hover:underline"
              >
                안윤정 법무사 소개
              </Link>
            </p>
          </div>
        </div>
      </ContentSection>

      <ContentSection id="jurisdiction" title="부산 등기업무와 관할">
        <ProseParagraphs
          paragraphs={[
            "다옴법무사사무소는 해운대·센텀에 있습니다. 부동산 소재지나 법인 본점이 부산 어디에 있든 상담은 가능하며, 실제 접수는 관할 등기소를 확인한 뒤 진행합니다.",
            "등기소 위치나 근처 법무사를 찾는 검색과, 등기업무 자체를 맡길 법무사를 찾는 검색은 목적이 다릅니다. 관할·방문 동선이 궁금하시면 아래 안내를, 업무 종류와 서류가 궁금하시면 이 페이지의 업무 안내를 보시면 됩니다.",
          ]}
        />
        <ul className="mt-4 flex flex-wrap gap-3">
          <li>
            <Link
              href="/부산지방법원등기국"
              className="text-sm font-medium text-navy underline-offset-2 hover:underline"
            >
              부산지방법원 등기국
            </Link>
          </li>
          <li>
            <Link
              href="/남부산등기소법무사"
              className="text-sm font-medium text-navy underline-offset-2 hover:underline"
            >
              남부산등기소
            </Link>
          </li>
          <li>
            <Link
              href="/부산진등기소법무사"
              className="text-sm font-medium text-navy underline-offset-2 hover:underline"
            >
              부산진등기소
            </Link>
          </li>
          <li>
            <Link
              href="/등기소근처법무사"
              className="text-sm font-medium text-navy underline-offset-2 hover:underline"
            >
              등기소 근처 법무사
            </Link>
          </li>
        </ul>
      </ContentSection>

      <ContentSection id="cost" title="등기비용은 어떻게 정해지나요">
        <ProseParagraphs
          paragraphs={[
            registryHubTopic.costGuide,
            "견적은 등기부나 계약 조건을 본 뒤에 구체화됩니다. 비용 항목을 먼저 보고 싶으시면 등기비용 안내를 참고하세요.",
          ]}
        />
        <p className="mt-3">
          <Link
            href="/등기비용"
            className="text-sm font-medium text-navy underline-offset-2 hover:underline"
          >
            등기비용 항목 보기
          </Link>
        </p>
      </ContentSection>

      <ContentSection id="faq" title="자주 묻는 질문">
        <FAQAccordion items={registryHubFaqs} />
      </ContentSection>

      <ContentSection id="related" title="등기 종류별 안내">
        <RelatedContentGrid links={registryHubInternalLinks} columns={2} />
      </ContentSection>

      <div id="consultation">
        <ConsultationCTA
          title="어떤 등기인지 정확히 몰라도 괜찮습니다"
          description="등기부, 계약서 또는 현재 상황을 확인하면 먼저 해야 할 등기와 준비서류를 구분할 수 있습니다. 안윤정 법무사가 직접 확인합니다."
          href="/contact/inquiry?from=부산등기법무사"
          buttonLabel="1분 상담 문의"
          fromPage="부산등기법무사"
        />
      </div>
    </article>
  );
}
