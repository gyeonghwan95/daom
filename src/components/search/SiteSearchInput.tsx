"use client";

import { SearchCloseIcon, SearchIcon } from "./SearchIcons";

type SiteSearchInputProps = {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  inputRef?: React.RefObject<HTMLInputElement | null>;
  listboxId?: string;
  activeDescendant?: string;
  placeholder?: string;
};

export function SiteSearchInput({
  value,
  onChange,
  onClear,
  onKeyDown,
  inputRef,
  listboxId,
  activeDescendant,
  placeholder = "업무·지역·강의 검색",
}: SiteSearchInputProps) {
  return (
    <div className="relative flex min-w-0 flex-1 items-center">
      <span className="pointer-events-none absolute left-3 text-navy/45">
        <SearchIcon size={18} />
      </span>
      <input
        ref={inputRef}
        type="search"
        inputMode="search"
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
        aria-label="사이트 전체 검색"
        aria-autocomplete="list"
        aria-controls={listboxId}
        aria-activedescendant={activeDescendant || undefined}
        placeholder={placeholder}
        className="w-full rounded-lg border border-beige-dark bg-white py-2.5 pl-10 pr-10 text-sm text-navy placeholder:text-navy/40 focus:border-navy/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-navy/25 lg:text-[15px]"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={onKeyDown}
      />
      {value ? (
        <button
          type="button"
          className="absolute right-1.5 inline-flex min-h-9 min-w-9 items-center justify-center rounded-md text-navy/55 hover:bg-beige hover:text-navy focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy"
          aria-label="입력 내용 지우기"
          onClick={onClear}
        >
          <SearchCloseIcon size={16} />
        </button>
      ) : null}
    </div>
  );
}
