import Link from "next/link";
import { getServiceAnswer, SERVICE_RELATED } from "@/data/seo/service-answers";
import { BusanRegistryTable } from "@/components/seo/BusanRegistryTable";

/** 부산 등기소 관할 표를 붙이는 핵심 부동산 페이지(소유권이전·근저당말소는 본문에 이미 있음) */
const REGISTRY_TABLE_PATHS = new Set([
  "/부산부동산등기",
  "/부산매매등기법무사",
  "/부산가족간매매등기",
  "/부산증여등기",
  "/부산신축건물보존등기",
  "/부산근저당설정등기",
  "/부산잔금대출근저당",
]);

/**
 * 업무 페이지 H1 바로 아래 "핵심 답변" — 검색 AI(네이버 AI 브리핑·ChatGPT·Perplexity 등)가
 * 이 페이지의 답으로 먼저 읽는 자리에 결론·한눈 표·법무사 업무 범위를 둔다.
 * 데이터가 없는 페이지에서는 아무것도 그리지 않는다(다른 페이지 화면은 그대로).
 */
export function ServiceAnswerCard({ path }: { path?: string }) {
  const a = path ? getServiceAnswer(path) : undefined;
  if (!a) return null;
  let key = path ?? "";
  try {
    key = decodeURIComponent(key);
  } catch {
    /* 그대로 */
  }
  const related = SERVICE_RELATED[key.replace(/\/$/, "")] ?? [];
  return (
    <section
      aria-label={`${a.name} 핵심 답변`}
      data-service-answer
      className="mt-4 rounded-2xl border border-beige-dark bg-white px-4 py-4 sm:px-5 md:mt-5"
    >
      {/* 라벨은 문단이 아니게 — H1 다음 첫 문단이 곧 답변 문장이 되도록 */}
      <div className="text-xs font-semibold tracking-wide text-navy/60">핵심 답변</div>
      <p className="mt-1.5 text-[0.95rem] leading-relaxed text-navy sm:text-base">{a.answer}</p>
      <table className="mt-3 w-full border-collapse text-left text-sm">
        <caption className="sr-only">{a.name} 한눈에 보기</caption>
        <tbody>
          {a.facts.map(([label, value]) => (
            <tr key={label} className="border-t border-beige-dark/70 align-top">
              <th scope="row" className="w-[6.5rem] py-2 pr-3 font-medium text-navy sm:w-32">
                {label}
              </th>
              <td className="py-2 leading-relaxed text-navy/80">{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {REGISTRY_TABLE_PATHS.has(key.replace(/\/$/, "")) ? <BusanRegistryTable /> : null}
      <p className="mt-3 border-t border-beige-dark/70 pt-2.5 text-sm leading-relaxed text-navy/75">
        {/* 사무소 이름과 업무를 한 문장에 묶어, AI가 "이 사무소는 이 업무를 이렇게 한다"로 읽게 한다(2026-11-24) */}
        <span className="font-medium text-navy">다옴법무사사무소(안윤정 법무사)에서 하는 일 </span>
        {a.scope}
      </p>
      {related.length > 0 ? (
        <p className="mt-2 text-sm leading-relaxed text-navy/75">
          <span className="font-medium text-navy">함께 보는 업무 </span>
          {related.map(([href, label], i) => (
            <span key={href}>
              {i > 0 ? " · " : null}
              <Link href={href} className="underline decoration-navy/30 underline-offset-2 hover:text-navy">
                {label}
              </Link>
            </span>
          ))}
        </p>
      ) : null}
    </section>
  );
}
