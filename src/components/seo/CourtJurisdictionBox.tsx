import type { CourtKind } from "@/lib/seo/keyword-headings";

/**
 * 부산 법원 관할 안내 — 법원에 내는 서류를 다루는 담당 페이지 상단에 둔다.
 * 부산지방법원 본원·동부지원·서부지원의 구·군 관할(서부지원 2020년 개원 이후 기준).
 */
const CIVIL_ROWS = [
  { court: "부산지방법원 본원", area: "중구·서구·동구·영도구·부산진구·동래구·연제구·금정구" },
  { court: "부산지방법원 동부지원", area: "해운대구·남구·수영구·기장군" },
  { court: "부산지방법원 서부지원", area: "강서구·사하구·사상구·북구" },
];

const COPY: Record<CourtKind, { title: string; lead: string; rows: { court: string; area: string }[] }> = {
  civil: {
    title: "부산 관할 법원",
    lead: "상대방 주소나 압류할 재산이 있는 구·군에 따라 접수할 법원이 갈립니다. 세 곳 모두 서류를 작성해 제출할 수 있습니다.",
    rows: CIVIL_ROWS,
  },
  family: {
    title: "부산 관할 법원",
    lead: "가사비송 사건은 부산 전역이 부산가정법원 관할입니다.",
    rows: [{ court: "부산가정법원", area: "부산광역시 16개 구·군 전체" }],
  },
  rehab: {
    title: "부산 관할 법원",
    lead: "부산에 주소가 있는 개인의 개인회생·파산은 부산회생법원에 신청합니다.",
    rows: [{ court: "부산회생법원", area: "부산광역시 16개 구·군 전체(개인회생·개인파산)" }],
  },
};

export function CourtJurisdictionBox({ kind }: { kind: CourtKind }) {
  const c = COPY[kind];
  return (
    <aside
      aria-label={c.title}
      data-court-jurisdiction={kind}
      className="rounded-2xl border border-beige-dark bg-white px-4 py-4 sm:px-5"
    >
      <p className="text-sm font-semibold text-navy">{c.title}</p>
      <p className="mt-1 text-sm leading-relaxed text-navy/75">{c.lead}</p>
      <dl className="mt-3 grid gap-2 text-sm">
        {c.rows.map((r) => (
          <div key={r.court} className="grid gap-0.5 sm:grid-cols-[11rem_1fr] sm:gap-3">
            <dt className="font-medium text-navy">{r.court}</dt>
            <dd className="text-navy/75">{r.area}</dd>
          </div>
        ))}
      </dl>
    </aside>
  );
}
