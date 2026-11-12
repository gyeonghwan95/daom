import Link from "next/link";
import { getAllCaseRecords } from "@/lib/cases";
import type { CaseRecord } from "@/lib/cases/types";
import { consultationReplySla } from "@/lib/consultation-copy";
import {
  GROUP_CASE_CATEGORIES,
  GROUP_DELIVERABLE,
  GROUP_FIRST_CHECK,
  GROUP_PERIOD_LINK,
  getCoreLandingGroup,
} from "@/lib/seo/core-landing-groups";

const MAX_CASES = 3;

function pickCases(group: NonNullable<ReturnType<typeof getCoreLandingGroup>>): CaseRecord[] {
  const order = GROUP_CASE_CATEGORIES[group];
  const all = getAllCaseRecords();
  const rank = (c: CaseRecord) => {
    const i = order.indexOf(c.category);
    return i === -1 ? Number.POSITIVE_INFINITY : i;
  };
  return all
    .filter((c) => Number.isFinite(rank(c)))
    .sort((a, b) => rank(a) - rank(b) || b.date.localeCompare(a.date))
    .slice(0, MAX_CASES);
}

/**
 * 핵심 랜딩에 더하는 「비슷한 상황의 상담 사례」.
 * 부산 사무소 사례만 쓰므로 다른 지역 사례가 섞이지 않는다. 사례는 개인정보를 뺀 참고용이고, 결과를 약속하지 않는다.
 */
export function CoreLandingCases({ path }: { path: string }) {
  const group = getCoreLandingGroup(path);
  if (!group) return null;
  const cases = pickCases(group);
  if (cases.length === 0) return null;

  return (
    <section
      id="core-cases"
      aria-labelledby="core-cases-title"
      className="section-anchor h-full rounded-2xl border border-navy/10 bg-white/80 p-5 md:p-6"
    >
      <h2 id="core-cases-title" className="section-heading">
        비슷한 상황의 상담 사례
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-navy/70">
        개인정보를 뺀 참고용 사례입니다. 서류·기한·가족관계에 따라 절차가 달라질 수 있어 내 사건은 상담으로 확인하세요.
      </p>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
        {cases.map((item) => (
          <li key={item.slug} className="rounded-xl border border-beige-dark bg-cream/50 p-4">
            <p className="text-xs font-medium text-navy/60">
              {item.category} · {item.region}
            </p>
            <Link
              href={item.href}
              className="mt-1 block text-[0.97rem] font-semibold leading-snug text-navy underline-offset-2 hover:underline"
            >
              {item.title}
            </Link>
            <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-navy/70">{item.description}</p>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-sm">
        <Link href="/cases" className="font-medium text-navy underline underline-offset-2">
          상담 사례 더 보기
        </Link>
      </p>
    </section>
  );
}

/**
 * 맡기신 뒤 어떻게 진행되는지 — 기간을 약속하지 않고 순서와 연락 기준만 적는다.
 * 사무소는 안윤정 법무사가 직접 진행한다는 기존 안내와 같은 말을 쓴다.
 */
export function CoreLandingProcess({ path }: { path: string }) {
  const group = getCoreLandingGroup(path);
  if (!group) return null;
  const period = GROUP_PERIOD_LINK[group];

  const steps = [
    {
      title: "문의 접수",
      body: `${consultationReplySla.line} 서류가 없어도, 상황 한두 줄만으로도 시작할 수 있습니다.`,
    },
    {
      title: "상황·서류 확인",
      body: `안윤정 법무사가 ${GROUP_FIRST_CHECK[group]} 필요한 서류와 범위, 보수와 세금·수수료를 나누어 안내합니다. 이 단계에서는 맡기지 않으셔도 됩니다.`,
    },
    {
      title: "맡기신 뒤 직접 진행",
      body: "서류 작성과 접수를 안윤정 법무사가 처음부터 직접 진행합니다. 보정이나 추가 확인이 필요하면 그때그때 알려 드립니다.",
    },
    {
      title: "완료 확인",
      body: GROUP_DELIVERABLE[group],
    },
  ];

  return (
    <section
      id="core-process"
      aria-labelledby="core-process-title"
      className="section-anchor h-full rounded-2xl border border-navy/10 bg-cream/60 p-5 md:p-6"
    >
      <h2 id="core-process-title" className="section-heading">
        맡기신 뒤 이렇게 진행합니다
      </h2>
      <ol className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
        {steps.map((step, index) => (
          <li key={step.title} className="rounded-xl bg-white/80 p-4">
            <p className="text-xs font-semibold text-navy/60">{index + 1}단계</p>
            <p className="mt-1 text-[0.97rem] font-semibold text-navy">{step.title}</p>
            <p className="mt-2 text-sm leading-relaxed text-navy/75">{step.body}</p>
          </li>
        ))}
      </ol>
      <p className="mt-4 text-sm leading-relaxed text-navy/70">
        걸리는 기간은 상속인 수·서류·관할에 따라 달라 상담에서 일정으로 안내합니다.
        {period ? (
          <>
            {" "}
            <Link href={period.href} className="font-medium text-navy underline underline-offset-2">
              {period.label}
            </Link>
          </>
        ) : null}
      </p>
    </section>
  );
}

/**
 * PC(lg 이상)에서는 사례와 진행 순서를 나란히 두어 한눈에 비교하게 하고, 모바일·태블릿은 위아래로 쌓는다.
 * 핵심 랜딩이 아닌 페이지에서는 아무것도 그리지 않는다.
 */
export function CoreLandingEvidence({ path }: { path: string }) {
  if (!getCoreLandingGroup(path)) return null;
  return (
    <div className="grid gap-4 lg:grid-cols-2 lg:items-start" data-core-evidence="">
      <CoreLandingCases path={path} />
      <CoreLandingProcess path={path} />
    </div>
  );
}
