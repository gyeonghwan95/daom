import Link from "next/link";
import { durationOptionsDefault } from "@/lib/lectures/shared";

type LectureFormatGuideProps = {
  /** 페이지에서 강조할 시간대 라벨 */
  highlightLabels?: string[];
  showCta?: boolean;
};

const FORMAT_DETAILS = [
  {
    label: "60분",
    title: "60분 핵심형",
    suitable: [
      "점심시간 특강",
      "오리엔테이션",
      "단일 핵심주제",
      "다수 인원 대상",
    ],
    outline: [
      "상황 제시",
      "핵심 기준",
      "실제 사례",
      "반드시 기억할 체크리스트",
      "짧은 질의응답",
    ],
  },
  {
    label: "90분",
    title: "90~120분 사례형",
    suitable: ["직원교육", "청년·시민교육", "생활법률", "창업 실무"],
    outline: [
      "핵심 개념",
      "실제 상황",
      "자료 보는 방법",
      "선택 기준",
      "질의응답",
    ],
  },
  {
    label: "120분",
    title: "120분 심화 사례형",
    suitable: ["기관 맞춤 특강", "전세·계약 실습", "질문 비중이 큰 교육"],
    outline: [
      "도입·목표",
      "이론 요약",
      "사례 토론",
      "조별·개인 활동",
      "정리·질답",
    ],
  },
  {
    label: "3~4시간",
    title: "3~4시간 참여형",
    suitable: [
      "창업교육",
      "종사자 실무교육",
      "청년 자립교육",
      "집중 워크숍",
    ],
    outline: [
      "여러 세부 주제",
      "사례 토론",
      "계약서·등기부·증거자료 확인",
      "질문 정리",
      "실무 체크리스트",
    ],
  },
] as const;

/**
 * 교육시간별 구성 가이드 — 실제 제공 가능한 시간대만 표시.
 */
export function LectureFormatGuide({
  highlightLabels,
  showCta = true,
}: LectureFormatGuideProps) {
  const highlights = new Set(highlightLabels ?? []);

  return (
    <div className="lecture-format-guide space-y-4">
      <p className="text-sm leading-relaxed text-navy/75 md:text-base">
        같은 주제라도 시간에 따라 다룰 수 있는 깊이가 다릅니다. 너무 많은
        주제를 한 번에 넣기보다, 대상과 목적에 맞춰 범위를 정하는 편이
        교육 효과가 안정적입니다. 아래는 실제로 협의 가능한 구성 예시입니다.
      </p>
      <div className="grid gap-4 md:grid-cols-2">
        {FORMAT_DETAILS.map((format) => {
          const active =
            highlights.size === 0 ||
            [...highlights].some(
              (h) => format.label.includes(h) || format.title.includes(h),
            );
          const fromShared = durationOptionsDefault.find((d) =>
            d.label.startsWith(format.label.slice(0, 2)),
          );
          return (
            <article
              key={format.label}
              className={`rounded-2xl border p-4 md:p-5 ${
                active
                  ? "border-navy/20 bg-white"
                  : "border-beige-dark bg-cream/30 opacity-90"
              }`}
            >
              <h3 className="text-base font-semibold text-navy md:text-lg">
                {format.title}
              </h3>
              <p className="mt-2 text-xs font-semibold tracking-wide text-navy/55">
                적합한 경우
              </p>
              <ul className="mt-1 list-disc space-y-0.5 pl-5 text-sm text-navy/75">
                {format.suitable.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <p className="mt-3 text-xs font-semibold tracking-wide text-navy/55">
                구성 예시
              </p>
              <ol className="mt-1 list-decimal space-y-0.5 pl-5 text-sm text-navy/75">
                {(fromShared?.outline ?? format.outline).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ol>
            </article>
          );
        })}
      </div>
      {showCta ? (
        <p className="text-sm text-navy/70">
          시간대별 상세 안내는{" "}
          <Link
            href="/강의시간별구성"
            className="font-medium text-navy underline-offset-2 hover:underline"
          >
            1시간·2시간·4시간 특강 구성
          </Link>
          에서, 일정 문의는{" "}
          <Link
            href="/강의문의"
            className="font-medium text-navy underline-offset-2 hover:underline"
          >
            강의문의
          </Link>
          로 남겨 주세요.
        </p>
      ) : null}
    </div>
  );
}
