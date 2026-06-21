const HIGHLIGHT = "안윤정";

type PressHighlightTextProps = {
  text: string;
};

export function PressHighlightText({ text }: PressHighlightTextProps) {
  const parts = text.split(new RegExp(`(${HIGHLIGHT})`, "g"));

  return (
    <>
      {parts.map((part, index) =>
        part === HIGHLIGHT ? (
          <strong key={index} className="font-semibold text-navy">
            {part}
          </strong>
        ) : (
          <span key={index}>{part}</span>
        ),
      )}
    </>
  );
}
