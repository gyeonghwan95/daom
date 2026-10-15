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

export function HomeBusanGuide() {
  return (
    <section id="busan-guide" className="w-full bg-white py-14 md:py-24">
      <Container className="max-w-5xl">
        <p className="home-section-label text-navy-light">Busan guide</p>
        <h2 className="section-heading mt-2">부산에서 내 사건은 어디서 처리하고, 비용은 어떻게 정해지나요</h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-navy/75 md:text-base">
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
