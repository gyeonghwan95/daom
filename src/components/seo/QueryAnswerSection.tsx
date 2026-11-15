import { getQueryAnswer } from "@/data/seo/query-answers-2026-11-15";

/**
 * 검색 질문에 바로 답하는 단락 — 결론 문장, 순서, 주의점, 근거.
 * 데이터가 있는 경로에서만 그려지고(서버 렌더링), 각 화면의 '자주 묻는 질문' 바로 앞에 둔다.
 * 데이터·작성 원칙: src/data/seo/query-answers-2026-11-15.ts
 */
export function QueryAnswerSection({ path }: { path: string }) {
  const answer = getQueryAnswer(path);
  if (!answer) return null;

  return (
    <section
      id="quick-answer"
      aria-labelledby="quick-answer-title"
      className="section-anchor rounded-2xl border border-navy/15 bg-white p-5 md:p-7"
    >
      <p className="text-xs font-semibold tracking-wide text-navy-light">바로 답해 드립니다</p>
      <h2 id="quick-answer-title" className="section-heading mt-1">
        {answer.heading}
      </h2>
      <p className="mt-3 text-[1.02rem] font-medium leading-relaxed text-navy">{answer.lead}</p>
      <ol className="mt-4 space-y-2.5">
        {answer.steps.map((step, index) => (
          <li key={step} className="flex gap-3 text-[0.97rem] leading-relaxed text-navy/85">
            <span
              aria-hidden
              className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-navy text-xs font-bold text-white"
            >
              {index + 1}
            </span>
            <span>{step}</span>
          </li>
        ))}
      </ol>
      {answer.caution ? (
        <p className="mt-4 rounded-xl bg-beige px-4 py-3 text-[0.95rem] leading-relaxed text-navy/80">
          <span className="font-semibold text-navy">놓치기 쉬운 점 · </span>
          {answer.caution}
        </p>
      ) : null}
      <p className="mt-3 text-xs leading-relaxed text-navy/55">
        근거: {answer.basis}. 작성·검토 안윤정 법무사(다옴법무사사무소), 2026-11-15 기준 일반 안내이며 개별 사건은 서류를 보고
        따로 안내합니다.
      </p>
    </section>
  );
}
