import Link from "next/link";
import { LawyerConsultationGuide } from "@/components/consultation/LawyerConsultationGuide";
import { DiagnosisFAQ } from "@/components/diagnosis/DiagnosisFAQ";
import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageCoverBanner } from "@/components/sections/PageCoverBanner";
import { getAllBusanDistricts } from "@/lib/busan-legal-map";
import { getCoverImageForPageData } from "@/lib/pageData/cover-image";
import { buildJsonLdForPageData } from "@/lib/pageData/json-ld";
import type { PageData } from "@/lib/pageData/types";
import { BusanDistrictCard } from "./BusanDistrictCard";

type BusanLegalMapViewProps = {
  page: PageData;
};

export function BusanLegalMapView({ page }: BusanLegalMapViewProps) {
  const cover = getCoverImageForPageData(page);
  const districts = getAllBusanDistricts();

  return (
    <article className="space-y-8 md:space-y-12">
      <Breadcrumb items={page.breadcrumbs} />
      <BreadcrumbJsonLd items={page.breadcrumbs} currentPath={page.path} />
      <JsonLd data={buildJsonLdForPageData(page)} />

      <PageCoverBanner image={cover} />

      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-navy-light">
          Busan Legal Map
        </p>
        <h1 className="page-title mt-2">{page.h1}</h1>
        <p className="body-text mt-4 max-w-3xl md:mt-5">{page.intro}</p>
      </header>

      <section className="rounded-2xl border border-beige-dark bg-beige/25 p-5 sm:p-6">
        <h2 className="text-base font-semibold text-navy sm:text-lg">이 지도로 할 수 있는 것</h2>
        <ul className="mt-3 space-y-2 text-sm leading-relaxed text-navy/75">
          <li>· 거주·부동산·법인 소재 구·군에 맞는 상담 주제를 빠르게 찾을 수 있습니다.</li>
          <li>· 지역별 상속·등기·법인·전세·채무 안내 페이지와 상황별 문제로 연결됩니다.</li>
          <li>· 해운대·센텀 사무소에서 부산 전역 사건을 상담할 수 있습니다.</li>
        </ul>
        <div className="mt-4 flex flex-wrap gap-2">
          {[
            { href: "/부산법무사", label: "부산 법무사" },
            { href: "/situations", label: "상황별 법률문제" },
            { href: "/tools", label: "법률 계산기" },
            { href: "/cases", label: "사례 탐색기" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="interactive-surface rounded-lg border border-navy/10 bg-white px-3 py-2 text-sm font-semibold text-navy hover:bg-beige/50"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </section>

      <section id="district-map">
        <h2 className="section-heading">부산 16개 구·군</h2>
        <p className="mt-2 text-sm text-navy/65">
          카드에서 지역 허브·업무 안내·상황별 문제로 이동할 수 있습니다.
        </p>
        <ul className="mt-5 grid gap-5 lg:grid-cols-2">
          {districts.map((district) => (
            <li key={district.id}>
              <BusanDistrictCard district={district} />
            </li>
          ))}
        </ul>
      </section>

      <DiagnosisFAQ items={page.faqs} />

      <div id="consultation">
        <LawyerConsultationGuide
          pageType="hub"
          title={page.ctaTitle}
          description={page.ctaText}
          showSecondaryLinks
          pageSlug="busan-legal-map"
        />
      </div>
    </article>
  );
}
