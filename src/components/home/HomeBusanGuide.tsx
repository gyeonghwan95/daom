import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { BUSAN_REGISTRY_OFFICES } from "@/lib/geo/busan-registry";

/**
 * 홈 — 부산에서 법무사를 찾는 분이 가장 먼저 묻는 두 가지(어디서 처리하나, 비용은 어떻게 정해지나)를
 * 정적 HTML 표·목록으로 답한다. 관할은 src/lib/geo/busan-registry.ts(공식 출처 기록)만 쓰고,
 * 법원 관할은 사이트에 이미 확인된 문장 범위만 적는다. 금액은 쓰지 않는다(비용 페이지로 연결).
 */
const REGISTRY_ORDER = ["deunggiguk", "dongbu", "nambusan", "seobu", "bukbusan"] as const;

const COURTS = [
  {
    work: "상속포기·한정승인",
    where: "고인의 마지막 주소지(상속개시지) 관할 가정법원 — 부산이면 부산가정법원",
    href: "/부산가정법원상속",
  },
  {
    work: "개인회생·파산",
    where: "채무자 주소지 관할 법원 — 부산 거주자는 부산회생법원 관할인 경우가 많습니다",
    href: "/부산회생법원법무사",
  },
  {
    work: "법인등기(상업등기)",
    where: "법인 본점이 부산이면 부산지방법원 등기국 관할인 경우가 많습니다",
    href: "/부산법인등기",
  },
] as const;

const COSTS = [
  {
    title: "법무사 수임료",
    body: "서류 작성, 등기소·법원 접수, 보정 대응 등 법무사가 하는 일에 대한 보수입니다. 사건 난이도와 서류 수에 따라 달라집니다.",
  },
  {
    title: "공과금·실비",
    body: "등록면허세·취득세·국민주택채권(등기), 인지대·송달료(법원 신청), 증명서 발급비처럼 기관에 내는 돈입니다. 법령·고시 기준으로 계산되어 사무소에 따라 크게 달라지지 않습니다.",
  },
] as const;

/**
 * '부산 법무사' 검색 결과 상단은 법원·시청 무료 법률상담 안내다. 같은 질문(어디서 법무사 상담을 받나)에
 * 공공 창구와 사무소 의뢰를 나란히 사실대로 보여 준다. 일정·장소는 2026-10-18 각 기관 페이지에서 확인한 범위만 쓴다.
 */
const CONSULT_PLACES = [
  {
    place: "부산법원종합청사 무료 법무사 상담",
    when: "평일 10:00–12:00 법무사(13:00–15:00 변호사). 연제구 법원로 31, 2층 211·212호(일부 안내는 213호 포함). 번호표 순서, 전화 예약 없음. 고등·가정·회생 공식 안내가 같은 장소를 가리킵니다",
    fit: "절차를 짧게 물어보고 싶을 때",
    href: "https://busan.scourt.go.kr/bsgodung/civil/civil_03/lawadvice_01/index.html",
    linkLabel: "부산고등법원 법률상담안내",
  },
  {
    place: "부산시청 시민 무료법률상담실",
    when: "시청 1층. 부산에 주소·거소가 있는 시민. 화·목 10:00–12:00, 14:00–16:00. 사전예약 필수(법무담당관실 051-888-2297 등은 예약 전용, 그 번호로 상담하지 않음)",
    fit: "생활법률 전반을 예약해 상담받고 싶을 때",
    href: "https://www.busan.go.kr/depart/freelegaladvice",
    linkLabel: "부산광역시 무료 법률상담",
  },
  {
    place: "부산지방법무사회",
    when: "연제구 법원남로 9번길 6-1 법무사회관. 등록 법무사 단체 소식·연락처 안내. 개별 사건을 맡기는 창구는 아닙니다",
    fit: "법무사 단체와 등록 여부를 확인할 때",
    href: "https://bsajar.kabl.kr/index.do",
    linkLabel: "부산지방법무사회",
  },
] as const;

const FIRST_CHECK = [
  {
    work: "상속",
    need: "사망일, 상속인 구성, 부동산·빚 유무",
    href: "/부산상속법무사",
    label: "상속 절차 안내",
  },
  {
    work: "부동산등기",
    need: "매매·증여 여부, 잔금일, 등기부",
    href: "/부산부동산등기",
    label: "부동산등기 안내",
  },
  {
    work: "법인 신설",
    need: "상호 후보, 본점, 자본금·임원 구성",
    href: "/부산법인설립등기",
    label: "법인설립 안내",
  },
  {
    work: "법인 변경",
    need: "등기사항증명서, 바꿀 임원·본점·목적",
    href: "/부산법인등기",
    label: "법인등기 안내",
  },
  {
    work: "개인회생·파산",
    need: "주소지, 소득과 빚의 개요",
    href: "/개인회생파산",
    label: "회생·파산 안내",
  },
] as const;

export function HomeBusanGuide() {
  return (
    <section id="busan-guide" className="w-full bg-white py-14 md:py-24">
      <Container className="max-w-5xl">
        <p className="home-section-label text-navy-light">Busan guide</p>
        <h2 className="section-heading mt-2">부산 법무사, 공공 상담과 사무소 의뢰는 다릅니다</h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-navy/75 md:text-base">
          네이버에서 부산 법무사를 검색하면 법원·시청 무료 법률상담이 먼저 보입니다. 짧은 질문은 그 창구로도 충분하고, 서류 작성과
          등기소·법원 접수까지 맡길 때는 법무사 사무소가 필요합니다. 사무소는 부산 해운대구 센텀에 있습니다. 관할 등기소와 비용 항목은 아래 표에서 확인하세요.
        </p>

        <div className="mt-8">
          <h3 className="text-lg font-bold text-navy">부산에서 법무사 상담을 받을 수 있는 곳</h3>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-navy/75">
            짧은 질문은 공공 상담 창구로도 충분합니다. 서류 작성과 등기소·법원 접수, 보정 대응까지 맡기려면 사건을 처음부터 끝까지 진행할
            법무사 사무소가 필요합니다.
          </p>
          <div className="mt-4 rounded-xl border border-beige-dark">
            <table className="block w-full text-left text-sm md:table">
              <caption className="sr-only">부산 법무사 상담 창구 비교</caption>
              <thead className="hidden bg-[var(--surface-muted)] text-navy/70 md:table-header-group">
                <tr>
                  <th scope="col" className="px-3 py-2 font-semibold">창구</th>
                  <th scope="col" className="px-3 py-2 font-semibold">이용 방법</th>
                  <th scope="col" className="px-3 py-2 font-semibold">이럴 때</th>
                </tr>
              </thead>
              <tbody className="block divide-y divide-beige-dark md:table-row-group">
                {CONSULT_PLACES.map((p) => (
                  <tr key={p.place} className="block px-4 py-3 align-top md:table-row md:p-0">
                    <th scope="row" className="block font-semibold text-navy md:table-cell md:px-3 md:py-2.5">
                      <a href={p.href} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">
                        {p.place}
                      </a>
                    </th>
                    <td className="mt-1 block text-navy/85 md:mt-0 md:table-cell md:px-3 md:py-2.5">{p.when}</td>
                    <td className="mt-1 block text-navy/85 md:mt-0 md:table-cell md:px-3 md:py-2.5">
                      <span className="font-medium text-navy md:hidden">이럴 때 · </span>
                      {p.fit}
                    </td>
                  </tr>
                ))}
                <tr className="block bg-[var(--surface-muted)]/50 px-4 py-3 align-top md:table-row md:p-0">
                  <th scope="row" className="block font-semibold text-navy md:table-cell md:px-3 md:py-2.5">
                    <Link href="/부산법무사상담" className="underline underline-offset-2">
                      다옴법무사사무소
                    </Link>
                  </th>
                  <td className="mt-1 block text-navy/85 md:mt-0 md:table-cell md:px-3 md:py-2.5">
                    해운대구 센텀동로 200. 전화·카카오톡으로 먼저 상황을 남기고, 방문은 평일 09:00–18:00 예약 후 이용
                  </td>
                  <td className="mt-1 block text-navy/85 md:mt-0 md:table-cell md:px-3 md:py-2.5">
                    <span className="font-medium text-navy md:hidden">이럴 때 · </span>
                    상담 뒤 서류 작성·접수·보정까지 안윤정 법무사에게 맡길 때
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-navy/60">
            출처: {CONSULT_PLACES.map((p) => p.linkLabel).join(", ")} · 부산가정법원·부산회생법원 법률상담안내(2026년 10월 18일 확인).
            일정은 기관 사정으로 바뀔 수 있으니 방문 전 각 기관에 확인하세요. 공공기관 채용·입찰 공고는 사무소를 찾는 안내가 아닙니다.
          </p>
        </div>

        <div className="mt-10">
          <h3 className="text-lg font-bold text-navy">맡길 때 먼저 알려 주시면 되는 것</h3>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-navy/75">
            공공 상담은 짧은 확인에 맞춰져 있습니다. 서류를 작성하고 접수·보정까지 맡기려면 아래만 있어도 1차 안내가 가능합니다.
            업무명을 몰라도 됩니다.
          </p>
          <ul className="mt-4 divide-y divide-beige-dark rounded-xl border border-beige-dark">
            {FIRST_CHECK.map((row) => (
              <li key={row.work} className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-baseline sm:justify-between">
                <div>
                  <p className="font-semibold text-navy">{row.work}</p>
                  <p className="text-sm text-navy/75">{row.need}</p>
                </div>
                <Link href={row.href} className="text-sm font-medium text-navy-light underline underline-offset-4">
                  {row.label}
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-sm leading-relaxed text-navy/75">
            문의 뒤에는 상황을 확인하고, 업무 범위·준비서류·보수와 공과금을 나눈 뒤, 맡기시면 작성·접수·보정을 진행합니다.
            확정 금액이나 결과를 미리 약속하지 않습니다.
          </p>
        </div>

        <p className="mt-12 max-w-3xl text-sm leading-relaxed text-navy/75 md:text-base">
          법무사가 대신 접수하는 기관은 업무 종류와 부동산·주소 소재지로 정해집니다. 아래는 부산 기준이며, 정확한 접수처는 등기부와
          주소를 보고 상담 때 다시 확인합니다.
        </p>

        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <div>
            <h3 className="text-lg font-bold text-navy">부동산등기 관할 (매매·증여·상속 등)</h3>
            <div className="mt-3 overflow-x-auto rounded-xl border border-beige-dark">
              <table className="w-full min-w-[22rem] text-left text-sm">
                <caption className="sr-only">부산 구·군별 부동산등기 관할 등기소</caption>
                <thead className="bg-[var(--surface-muted)] text-navy/70">
                  <tr>
                    <th scope="col" className="px-3 py-2 font-semibold">구·군</th>
                    <th scope="col" className="px-3 py-2 font-semibold">관할 등기소</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-beige-dark">
                  {REGISTRY_ORDER.map((id) => {
                    const office = BUSAN_REGISTRY_OFFICES[id];
                    return (
                      <tr key={id} className="align-top">
                        <td className="px-3 py-2.5 text-navy/85">{office.districts.join("·")}</td>
                        <td className="px-3 py-2.5 font-medium text-navy">
                          {id === "deunggiguk" ? (
                            <Link href="/부산지방법원등기국" className="underline underline-offset-2">
                              {office.name}
                            </Link>
                          ) : (
                            office.name
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-navy/60">
              2021년부터 부산진·중부산·금정등기소 사무는 부산지방법원 등기국으로 통합되었습니다. 출처: 등기정보광장, 부산지방법원 동부·서부지원 안내.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold text-navy">법원·법인 관련 업무</h3>
            <ul className="mt-3 divide-y divide-beige-dark rounded-xl border border-beige-dark">
              {COURTS.map((c) => (
                <li key={c.work} className="px-4 py-3">
                  <Link href={c.href} className="font-semibold text-navy underline-offset-2 hover:underline">
                    {c.work}
                  </Link>
                  <p className="mt-1 text-sm leading-relaxed text-navy/75">{c.where}</p>
                </li>
              ))}
            </ul>

            <h3 className="mt-8 text-lg font-bold text-navy">비용은 두 가지로 나뉩니다</h3>
            <dl className="mt-3 space-y-3">
              {COSTS.map((c) => (
                <div key={c.title} className="rounded-xl border border-beige-dark px-4 py-3">
                  <dt className="font-semibold text-navy">{c.title}</dt>
                  <dd className="mt-1 text-sm leading-relaxed text-navy/75">{c.body}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-3 text-sm text-navy/75">
              견적을 비교하실 때는 총액보다 두 항목을 나눠 보시는 것이 정확합니다.{" "}
              <Link href="/부산법무사비용" className="font-semibold text-navy underline underline-offset-2">
                부산 법무사 비용 안내
              </Link>
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
