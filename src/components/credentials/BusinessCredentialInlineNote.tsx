type BusinessCredentialInlineNoteProps = {
  text: string;
  className?: string;
};

/** 본문·CTA 앞 한 줄. 카드/배너로 키우지 않음 */
export function BusinessCredentialInlineNote({
  text,
  className = "",
}: BusinessCredentialInlineNoteProps) {
  if (!text.trim()) return null;

  return (
    <aside
      aria-label="기업확인서 안내"
      className={`border-l-4 border-navy/25 bg-cream/50 px-4 py-3 text-sm leading-relaxed text-navy/75 md:text-[0.9375rem] ${className}`.trim()}
    >
      <p>{text}</p>
    </aside>
  );
}
