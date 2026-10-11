/** 데스크톱 주 메뉴 트리거 공통 스타일(일반 드롭다운·협업 메가메뉴·단일 링크). */
export function NavChevron({ open }: { open: boolean }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className={[
        "ml-1 shrink-0 text-navy/40 transition-transform duration-200 motion-reduce:transition-none",
        open ? "rotate-180" : "",
      ].join(" ")}
    >
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function desktopLinkClass(active: boolean) {
  return [
    "inline-flex min-h-10 items-center whitespace-nowrap rounded-lg px-2 text-[0.875rem] transition-colors duration-200 xl:min-h-11 xl:px-3 xl:text-[0.9375rem]",
    active
      ? "bg-beige font-semibold text-navy shadow-sm ring-1 ring-inset ring-navy/10"
      : "font-medium text-navy/75 hover:bg-beige/70 hover:text-navy",
  ].join(" ");
}
