import Link from "next/link";

type ArticleSummaryProps = {
  /** 페이지 결론 2~3문장 */
  conclusion: string;
  /** 가장 먼저 확인할 사항 (최대 5개) */
  checkItems?: string[];
  /** 상담이 필요한 대표 상황 (최대 3개) */
  consultTriggers?: string[];
  /** 선택: 예상 읽기 시간 */
  readingTimeLabel?: string;
  className?: string;
};

/**
 * 본문형 페이지 상단 핵심 요약 — 페이지당 1회만 사용.
 * “핵심 결론” 별도 섹션과 중복하지 않도록 결론을 여기에 통합한다.
 */
export function ArticleSummary({
  conclusion,
  checkItems = [],
  consultTriggers = [],
  readingTimeLabel = "약 3분 읽기",
  className = "",
}: ArticleSummaryProps) {
  const checks = checkItems.filter(Boolean).slice(0, 5);
  const triggers = consultTriggers.filter(Boolean).slice(0, 3);

  return (
    <aside
      className={`article-summary ${className}`.trim()}
      aria-label="핵심 요약"
    >
      <div className="article-summary__header">
        <p className="article-summary__label">핵심 요약</p>
        {readingTimeLabel ? (
          <span className="article-summary__meta">{readingTimeLabel}</span>
        ) : null}
      </div>

      <p className="article-summary__conclusion">{conclusion}</p>

      {checks.length > 0 ? (
        <div className="article-summary__block">
          <p className="article-summary__block-title">가장 먼저 확인할 사항</p>
          <ul className="article-summary__list">
            {checks.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {triggers.length > 0 ? (
        <div className="article-summary__block">
          <p className="article-summary__block-title">상담이 필요한 대표 상황</p>
          <ul className="article-summary__list">
            {triggers.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      ) : null}

      <p className="article-summary__note">
        아래 본문에서 절차·서류·주의사항을 이어서 확인하실 수 있습니다.{" "}
        <Link href="/contact" className="article-summary__link">
          상황만 간단히 남기기
        </Link>
      </p>
    </aside>
  );
}
