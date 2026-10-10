import { splitLongParagraph } from "@/lib/readability/split-paragraph";
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
    <div className={`readability-prose space-y-4 ${className}`.trim()}>
      {paragraphs.flatMap((paragraph) => splitLongParagraph(paragraph)).map((paragraph) => (
        <p key={paragraph.slice(0, 48)} className="body-text">
          {paragraph}
        </p>
      ))}
    </div>
  );
}
