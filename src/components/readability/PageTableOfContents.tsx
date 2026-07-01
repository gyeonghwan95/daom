export type TocItem = {
  id: string;
  label: string;
};

type PageTableOfContentsProps = {
  items: TocItem[];
  title?: string;
};

export function PageTableOfContents({
  items,
  title = "이 글에서 확인할 내용",
}: PageTableOfContentsProps) {
  if (items.length < 2) return null;

  return (
    <nav className="readability-toc" aria-label={title}>
      <details className="readability-toc__details lg:hidden">
        <summary className="readability-toc__summary">{title}</summary>
        <TocList items={items} />
      </details>
      <div className="hidden lg:block">
        <p className="readability-toc__title">{title}</p>
        <TocList items={items} />
      </div>
    </nav>
  );
}

function TocList({ items }: { items: TocItem[] }) {
  return (
    <ol className="readability-toc__list">
      {items.map((item) => (
        <li key={item.id}>
          <a href={`#${item.id}`} className="readability-toc__link">
            {item.label}
          </a>
        </li>
      ))}
    </ol>
  );
}
