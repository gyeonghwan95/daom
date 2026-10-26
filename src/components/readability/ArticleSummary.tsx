import { splitLongParagraph } from "@/lib/readability/split-paragraph";
import Link from "next/link";
import { SummaryTriggerActions } from "@/components/readability/SummaryTriggerActions";

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
  // 일부 페이지(블로그 등)는 상황 문장 대신 '파산·개인회생·부산 법무사' 같은 주제어가 들어 있다 — 목록 대신 주제 줄로 보인다
  const isTopicWord = (t: string) => t.replace(/\s/g, "").length <= 7;
  const topicMode = triggers.filter(isTopicWord).length * 2 > triggers.length;

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

      {splitLongParagraph(conclusion).map((part) => (
        <p key={part.slice(0, 40)} className="article-summary__conclusion">
          {part}
        </p>
      ))}

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
        // 정보를 읽고 혼자 해결하려는 방문자에게 "정리하기 전에 이것부터 물어보라"는 지점을 보여 주고 바로 연결한다
        <div className="article-summary__triggers" data-summary-triggers>
          <p className="article-summary__triggers-title">혼자 정리하기 전에, 이 부분부터 물어보세요</p>
          <p className="article-summary__triggers-lead">
            {topicMode
              ? "지금 상황을 한두 줄로 알려 주시면 필요한 서류·순서와 예상 비용을 안내해 드립니다."
              : "아래 내용을 한두 줄로 알려 주시면 필요한 서류·순서와 예상 비용을 안내해 드립니다."}
          </p>
          {topicMode ? (
            <p className="article-summary__triggers-topics">
              <span>관련 주제</span> {triggers.join(" · ")}
            </p>
          ) : (
            <ul className="article-summary__triggers-list">
              {triggers.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          )}
          <SummaryTriggerActions />
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
