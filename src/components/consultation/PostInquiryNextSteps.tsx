"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const STEPS = [
  "남겨 주셨습니다.",
  "제가 내용을 확인합니다.",
  "필요한 절차와 비용만 나눠 안내합니다. 그다음에 맡기실지 정하시면 됩니다.",
] as const;

/**
 * 상속포기·한정승인 문의는 기다리는 동안 가장 불안한 것이 '남은 날짜'다.
 * 회신 전에도 스스로 기한을 확인할 수 있도록 기간 계산 안내로 바로 잇는다(밤·주말 문의 이탈 방지).
 */
const DEADLINE_PATH = /상속포기|한정승인|사망후3개월|단순승인|상속채무/;

export function PostInquiryNextSteps({
  className = "",
  field,
}: {
  className?: string;
  /** 상담 분야 값(inquiry-fields). 상속포기·한정승인이면 기한 계산 안내를 붙인다. */
  field?: string;
}) {
  const pathname = usePathname() ?? "";
  let decoded = pathname;
  try {
    decoded = decodeURIComponent(pathname);
  } catch {
    /* keep raw */
  }
  const deadlineTip = field === "inheritance-renunciation" || DEADLINE_PATH.test(decoded);

  return (
    <>
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
      {deadlineTip ? (
        <p className="mt-4 rounded-xl bg-beige px-4 py-3 text-sm leading-relaxed text-navy/80">
          연락드리기 전에 남은 날짜가 궁금하시면{" "}
          <Link href="/상속포기기간" className="font-semibold text-navy underline underline-offset-4">
            상속포기 3개월 기간 계산표
          </Link>
          에서 먼저 확인해 보세요. 그동안 고인 예금을 찾거나 재산을 처분하지는 마세요.
        </p>
      ) : null}
    </>
  );
}
