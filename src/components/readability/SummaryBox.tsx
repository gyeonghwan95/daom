type SummaryBoxProps = {
  title?: string;
  items: string[];
};

export function SummaryBox({
  title = "핵심 요약",
  items,
}: SummaryBoxProps) {
  if (items.length === 0) return null;

  return (
    <aside
      className="readability-summary"
      aria-label={title}
    >
      <p className="readability-summary__title">{title}</p>
      <ul className="readability-summary__list">
        {items.map((item) => (
          <li key={item} className="readability-summary__item">
            {item}
          </li>
        ))}
      </ul>
      <p className="readability-summary__note">
        아래 목차와 본문에서 절차·서류·주의사항을 더 자세히 확인하실 수 있습니다.
      </p>
    </aside>
  );
}
