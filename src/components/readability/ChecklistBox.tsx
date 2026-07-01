type ChecklistBoxProps = {
  items: string[];
  note?: string;
};

export function ChecklistBox({ items, note }: ChecklistBoxProps) {
  if (items.length === 0) return null;

  return (
    <div className="readability-checklist">
      <ul className="readability-checklist__list">
        {items.map((item) => (
          <li key={item} className="readability-checklist__item">
            <span className="readability-checklist__mark" aria-hidden>
              ✓
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
      {note ? (
        <p className="readability-checklist__note">{note}</p>
      ) : null}
    </div>
  );
}
