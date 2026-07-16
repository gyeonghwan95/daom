export type TocItem = {
  id: string;
  label: string;
};

type PageTableOfContentsProps = {
  items: TocItem[];
  title?: string;
};

/**
 * 본문 「이 글에서 확인할 내용」.
 * - 모바일: 접이식 목차 표시
 * - lg 이상: 좌측 SectionNavigator「페이지 목차」가 동일 항목을 표시
 * - 숨김 링크는 좌측 목차 자동 수집용으로 DOM에 유지
 */
export function PageTableOfContents({
  items,
  title = "이 글에서 확인할 내용",
}: PageTableOfContentsProps) {
  if (items.length < 2) return null;

  return (
    <nav data-page-toc aria-label={title}>
      <div className="hidden" aria-hidden>
        <TocList items={items} />
      </div>
      <details className="readability-toc readability-toc__details lg:hidden">
        <summary className="readability-toc__summary">{title}</summary>
        <TocList items={items} />
      </details>
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
