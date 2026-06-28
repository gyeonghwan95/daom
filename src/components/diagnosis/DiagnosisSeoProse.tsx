type DiagnosisSeoProseProps = {
  paragraphs: string[];
};

export function DiagnosisSeoProse({ paragraphs }: DiagnosisSeoProseProps) {
  return (
    <div className="max-w-3xl space-y-4">
      {paragraphs.map((paragraph) => (
        <p key={paragraph.slice(0, 48)} className="body-text leading-relaxed">
          {paragraph}
        </p>
      ))}
    </div>
  );
}
