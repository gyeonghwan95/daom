import Link from "next/link";
import {
  corporateChangeChecklist,
  corporateChangeSituationCards,
  corporateGrowthStageMap,
  corporateLegalDocsCta,
  corporateLegalHeroCta,
  corporateLegalInquiryHref,
  corporateScopeRows,
  corporateSixAreaNav,
} from "@/lib/local-landing/corporate-legal-operations-modules";

function CardGrid({
  id,
  title,
  intro,
  items,
}: {
  id: string;
  title: string;
  intro: string;
  items: { title: string; description: string; href: string; task: string }[];
}) {
  return (
    <section id={id} className="space-y-3">
      <div>
        <h2 className="text-lg font-semibold text-navy md:text-xl">{title}</h2>
        <p className="mt-1 max-w-3xl text-sm leading-relaxed text-navy/75 md:text-base">
          {intro}
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <Link
            key={item.title}
            href={item.href}
            className="block rounded-xl border border-navy/10 bg-white p-4 transition hover:border-navy/25 hover:bg-cream/40"
          >
            <p className="font-semibold text-navy">{item.title}</p>
            <p className="mt-1 text-sm leading-relaxed text-navy/75">
              {item.description}
            </p>
            <p className="mt-2 text-xs text-navy/55">{item.task}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

/** SSR — `/부산법인법무사` ArticleSummary 뒤에만 삽입. 첫 문단·H1 앞 금지. */
export function CorporateLegalOperationsModules() {
  return (
    <div className="space-y-10">
      <CardGrid
        id="corporate-six-areas"
        title="회사 운영에서 자주 확인하는 여섯 가지"
        intro="다옴법무사사무소는 기업·법인 운영 중 필요한 등기와 법원서류 등 법무사 업무를 안내합니다. 아래에서 지금 상황에 가까운 안내로 이동하면 됩니다."
        items={corporateSixAreaNav}
      />

      <CardGrid
        id="corporate-change-chooser"
        title="회사에 이런 변화가 생겼다면 무엇을 확인해야 할까요?"
        intro="인사·주소·업종·투자·정리는 회사 안에서는 일상처럼 보이지만, 등기부에 반영해야 하는 경우가 있습니다. 해당 상세 안내에서 서류와 기한을 확인하세요."
        items={corporateChangeSituationCards}
      />

      <section id="corporate-stage-map" className="space-y-3">
        <div>
          <h2 className="text-lg font-semibold text-navy md:text-xl">
            회사 성장단계로 보기
          </h2>
          <p className="mt-1 max-w-3xl text-sm leading-relaxed text-navy/75 md:text-base">
            설립 이후에도 운영·성장·정리 단계에서 등기 항목이 달라집니다. 세부
            절차는 각 페이지에서 이어집니다.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {corporateGrowthStageMap.map((column) => (
            <div
              key={column.stage}
              className="rounded-xl border border-navy/10 bg-white p-4"
            >
              <p className="font-semibold text-navy">{column.stage}</p>
              <ul className="mt-3 space-y-2">
                {column.items.map((item) => (
                  <li key={item.href + item.label}>
                    <Link
                      href={item.href}
                      className="text-sm text-navy/80 underline-offset-2 hover:underline"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section id="corporate-change-checklist" className="space-y-3">
        <div>
          <h2 className="text-lg font-semibold text-navy md:text-xl">
            회사의 주요 변경사항 체크리스트
          </h2>
          <p className="mt-1 max-w-3xl text-sm leading-relaxed text-navy/75 md:text-base">
            경영지원·총무·회계 담당자가 등기 필요 여부를 먼저 가릴 때 쓰는
            확인 목록입니다. 해당하면 유형별 안내로 이어집니다.
          </p>
        </div>
        <ul className="grid gap-2 sm:grid-cols-2">
          {corporateChangeChecklist.map((row) => (
            <li key={row.item}>
              <Link
                href={row.href}
                className="block rounded-lg border border-navy/10 bg-white px-4 py-3 text-sm text-navy hover:border-navy/25"
              >
                {row.item}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section id="corporate-scope" className="space-y-3">
        <div>
          <h2 className="text-lg font-semibold text-navy md:text-xl">
            이 사이트에서 안내하는 기업·법인 법무 업무
          </h2>
          <p className="mt-1 max-w-3xl text-sm leading-relaxed text-navy/75 md:text-base">
            모든 기업 법률문제나 분쟁 전반을 맡는 안내가 아닙니다. 안윤정
            법무사(다옴법무사사무소)가 수행할 수 있는 등기·서류 실무를
            중심으로 합니다.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[36rem] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-navy/15">
                <th className="py-2 pr-3 font-semibold text-navy">영역</th>
                <th className="py-2 pr-3 font-semibold text-navy">구분</th>
                <th className="py-2 font-semibold text-navy">안내 범위</th>
              </tr>
            </thead>
            <tbody>
              {corporateScopeRows.map((row) => (
                <tr key={row.area} className="border-b border-navy/10">
                  <td className="py-2 pr-3 align-top text-navy">
                    {row.href ? (
                      <Link href={row.href} className="underline-offset-2 hover:underline">
                        {row.area}
                      </Link>
                    ) : (
                      row.area
                    )}
                  </td>
                  <td className="py-2 pr-3 align-top text-navy/70">{row.level}</td>
                  <td className="py-2 align-top text-navy/80">{row.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="flex flex-wrap gap-3 text-sm">
          <Link
            href={corporateLegalInquiryHref}
            className="font-medium text-navy underline-offset-2 hover:underline"
          >
            {corporateLegalHeroCta}
          </Link>
          <Link
            href={`${corporateLegalInquiryHref}&docs=1`}
            className="font-medium text-navy underline-offset-2 hover:underline"
          >
            {corporateLegalDocsCta}
          </Link>
        </p>
      </section>
    </div>
  );
}
