const STEPS = [
  "남겨 주셨습니다.",
  "제가 내용을 확인합니다.",
  "필요한 절차와 비용만 나눠 안내합니다. 그다음에 맡기실지 정하시면 됩니다.",
] as const;

export function PostInquiryNextSteps({ className = "" }: { className?: string }) {
  return (
    <ol className={`mt-4 space-y-2 text-[0.95rem] leading-relaxed text-navy/85 ${className}`.trim()}>
      {STEPS.map((text, i) => (
        <li key={text} className="flex gap-2.5">
          <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-navy text-[0.7rem] font-bold text-white">
            {i + 1}
          </span>
          <span>{text}</span>
        </li>
      ))}
    </ol>
  );
}
