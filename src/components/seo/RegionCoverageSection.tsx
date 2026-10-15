import Link from "next/link";
import { REGION_COVERAGE } from "@/data/seo/region-coverage";
import { AREA_LIFE_NOTES, getRegistryOffice } from "@/data/seo/registry-jurisdiction";
import { getNeighborhoodTable } from "@/data/seo/neighborhood-jurisdiction";

/**
 * 시·도 상속 페이지 하단: 그 시·도의 시·군·구 전체를 안내한다.
 * 전용 페이지가 있으면 링크, 없으면 이름만 둔다(지역명만 바꾼 페이지를 새로 만들지 않기 위해).
 * 법령: 부동산등기법 제7조의3, 가사소송법 제44조 제1항 제6호.
 * 2026-10-16: 지역마다 원래 관할 등기소를 표로 함께 보여 준다(등기소의 설치와 관할구역에 관한 규칙 별표, 2026. 7. 1. 시행).
 */
function RegionCoverageCore({ path }: { path: string }) {
  const coverage = REGION_COVERAGE[path];
  if (!coverage) {
    const life = AREA_LIFE_NOTES[path];
    if (!life) return null;
    return (
      <section id="region-coverage" className="readability-section section-anchor">
        <h2 className="section-heading">{life.title}</h2>
        <div className="readability-section__body mt-4 space-y-3">
          {life.notes.map((note) => (
            <p key={note}>{note}</p>
          ))}
          <p className="text-sm text-navy/70">
            상속·유증 등기는 관할 특례(부동산등기법 제7조의3)로 다른 등기소에서도 신청할 수 있어, 부산에서 서류를 받아 진행합니다.
          </p>
        </div>
      </section>
    );
  }
  const { sido, kind, areas } = coverage;
  return (
    <section id="region-coverage" className="readability-section section-anchor">
      <h2 className="section-heading">
        {sido} {kind} 어디든, 부산 방문 없이 진행합니다
      </h2>
      <div className="readability-section__body mt-5 space-y-4 md:mt-6">
        <p>
          {sido}의 아래 {areas.length}개 지역에 부동산이 있거나 고인이 살았어도 같은 방식으로 진행합니다.
          상속등기는 부동산 소재지 관할 등기소가 원칙이지만, 2025년 1월 31일부터 상속·유증 등기는 관할이
          아닌 등기소에서도 처리할 수 있습니다(부동산등기법 제7조의3). 상속포기·한정승인은 고인의 마지막
          주소지를 관할하는 가정법원에 신고합니다(가사소송법 제44조 제1항 제6호).
        </p>
        <div className="overflow-x-auto rounded-xl border border-beige-dark">
          <table className="w-full text-left text-sm">
            <caption className="sr-only">{`${sido} ${kind}별 원래 관할 등기소`}</caption>
            <thead className="bg-[var(--surface-muted)] text-navy/70">
              <tr>
                <th scope="col" className="px-3 py-2 font-semibold">
                  {kind}
                </th>
                <th scope="col" className="px-3 py-2 font-semibold">
                  원래 관할 등기소
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-beige-dark">
              {areas.map((area) => {
                const office = getRegistryOffice(sido, area.name);
                return (
                  <tr key={area.name} className="align-top">
                    <th scope="row" className="whitespace-nowrap px-3 py-2 font-medium text-navy">
                      {area.href ? (
                        <Link href={area.href} className="underline underline-offset-2">
                          {area.name}
                        </Link>
                      ) : (
                        area.name
                      )}
                    </th>
                    <td className="px-3 py-2 text-navy/80">{office ?? "부동산 주소로 확인"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {coverage.notes?.map((note) => (
          <p key={note} className="text-sm text-navy/80">
            {note}
          </p>
        ))}
        <p className="text-xs leading-relaxed text-navy/60">
          관할 등기소 출처: 등기소의 설치와 관할구역에 관한 규칙 별표(2026. 7. 1. 시행). 상속·유증 등기는 관할 특례로 다른
          등기소에서도 신청할 수 있어, 표의 등기소에 직접 가지 않아도 됩니다.
        </p>
        <p className="text-sm text-navy/70">
          전용 안내가 없는 지역도 고인의 마지막 주소와 부동산 소재지만 알려 주시면 신고처와 접수 등기소를 확인해
          서류를 사진·우편으로 먼저 준비합니다.
        </p>
      </div>
    </section>
  );
}

/** 동·생활권 이름 검색(예: 대치동 상속 법무사)에 답하는 소속·관할 표 — neighborhood-jurisdiction.ts */
function NeighborhoodJurisdiction({ path }: { path: string }) {
  const table = getNeighborhoodTable(path);
  if (!table) return null;
  return (
    <section id="neighborhood-jurisdiction" className="readability-section section-anchor">
      <h2 className="section-heading">{table.title}</h2>
      <div className="readability-section__body mt-5 space-y-3 md:mt-6">
        <div className="overflow-x-auto rounded-xl border border-beige-dark">
          <table className="w-full text-left text-sm">
            <caption className="sr-only">{table.title}</caption>
            <thead className="bg-[var(--surface-muted)] text-navy/70">
              <tr>
                <th scope="col" className="px-3 py-2 font-semibold">
                  동·생활권
                </th>
                <th scope="col" className="px-3 py-2 font-semibold">
                  소속
                </th>
                <th scope="col" className="px-3 py-2 font-semibold">
                  원래 관할 등기소
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-beige-dark">
              {table.rows.map((row) => (
                <tr key={row.name} className="align-top">
                  <th scope="row" className="px-3 py-2 font-medium text-navy">
                    {row.name}
                  </th>
                  <td className="px-3 py-2 text-navy/80">{row.belongs}</td>
                  <td className="px-3 py-2 text-navy/80">{row.registry}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {table.note ? <p className="text-sm text-navy/80">{table.note}</p> : null}
        <p className="text-xs leading-relaxed text-navy/60">
          상속·유증 등기는 관할 특례(부동산등기법 제7조의3)로 다른 등기소에서도 신청할 수 있어, 위 등기소에 직접 가지 않고
          부산에서 서류를 받아 진행합니다.
        </p>
      </div>
    </section>
  );
}

export function RegionCoverageSection({ path }: { path: string }) {
  return (
    <>
      <RegionCoverageCore path={path} />
      <NeighborhoodJurisdiction path={path} />
    </>
  );
}
