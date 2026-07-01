type KeywordBadgesProps = {
  keywords: string[];
  max?: number;
};

export function KeywordBadges({ keywords, max = 6 }: KeywordBadgesProps) {
  const items = keywords.filter(Boolean).slice(0, max);
  if (items.length === 0) return null;

  return (
    <ul className="readability-badges flex flex-wrap gap-2" aria-label="주요 키워드">
      {items.map((keyword) => (
        <li key={keyword}>
          <span className="readability-badges__item">{keyword}</span>
        </li>
      ))}
    </ul>
  );
}
