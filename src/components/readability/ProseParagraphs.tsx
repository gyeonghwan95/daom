type ProseParagraphsProps = {
  paragraphs: string[];
  className?: string;
};

export function ProseParagraphs({
  paragraphs,
  className = "",
}: ProseParagraphsProps) {
  if (paragraphs.length === 0) return null;

  return (
    <div className={`readability-prose max-w-3xl space-y-3 md:space-y-4 ${className}`.trim()}>
      {paragraphs.map((paragraph) => (
        <p key={paragraph.slice(0, 48)} className="body-text text-[0.9375rem] leading-relaxed md:text-base">
          {paragraph}
        </p>
      ))}
    </div>
  );
}
