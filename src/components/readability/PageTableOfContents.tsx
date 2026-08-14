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
 * - lg 이상: 좌측 SectionNavigator가 동일 링크를 수집 (details는 lg:hidden이어도 DOM 1회 유지)
 */
export function PageTableOfContents({
  items,
  title = "이 글에서 확인할 내용",
}: PageTableOfContentsProps) {
  if (items.length < 2) return null;

  return (
    <nav data-page-toc aria-label={title}>
      {/*
        모바일: details 목차. 데스크톱: CSS로 숨기지만 DOM은 1회만 유지.
        좌측 SectionNavigator는 이 링크를 querySelector로 수집한다.
        동일 목록을 hidden+details로 두 번 넣지 않는다 (DOM_RENDER_DUPLICATION).
      */}
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
