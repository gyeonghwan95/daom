type SearchHighlightProps = {
  text: string;
  query: string;
};

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function SearchHighlight({ text, query }: SearchHighlightProps) {
  const tokens = query
    .trim()
    .split(/\s+/)
    .filter((token) => token.length > 0);

  if (tokens.length === 0) return <>{text}</>;

  const pattern = new RegExp(`(${tokens.map(escapeRegExp).join("|")})`, "gi");
  const parts = text.split(pattern);

  return (
    <>
      {parts.map((part, index) => {
        const isMatch = tokens.some(
          (token) => part.toLowerCase() === token.toLowerCase(),
        );
        if (!isMatch) return <span key={`${part}-${index}`}>{part}</span>;
        return (
          <mark
            key={`${part}-${index}`}
            className="rounded-[2px] bg-beige px-0.5 font-semibold text-navy"
          >
            {part}
          </mark>
        );
      })}
    </>
  );
}
