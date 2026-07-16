import Link from "next/link";

type SearchEmptyStateProps = {
  query: string;
  onNavigate?: () => void;
};

export function SearchEmptyState({ query, onNavigate }: SearchEmptyStateProps) {
  return (
    <div className="px-1 py-4 text-sm text-navy/75">
      <p className="font-medium text-navy">
        ‘{query}’에 해당하는 페이지를 찾지 못했습니다.
      </p>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-navy/65">
        <li>검색어를 짧게 입력해보세요.</li>
        <li>업무명이나 지역명으로 검색해보세요.</li>
        <li>상담이 필요한 경우 문의 페이지를 이용할 수 있습니다.</li>
      </ul>
      <div className="mt-4 flex flex-wrap gap-2">
        <Link
          href="/services"
          onClick={onNavigate}
          className="rounded-lg border border-beige-dark bg-white px-3 py-2 text-xs font-medium text-navy no-underline hover:bg-beige"
        >
          전체 업무 보기
        </Link>
        <Link
          href="/자가진단"
          onClick={onNavigate}
          className="rounded-lg border border-beige-dark bg-white px-3 py-2 text-xs font-medium text-navy no-underline hover:bg-beige"
        >
          자가진단 보기
        </Link>
        <Link
          href="/contact"
          onClick={onNavigate}
          className="rounded-lg border border-beige-dark bg-navy px-3 py-2 text-xs font-medium text-white no-underline hover:bg-navy-light"
        >
          상담 문의하기
        </Link>
      </div>
    </div>
  );
}
