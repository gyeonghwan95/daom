import Link from "next/link";
import { ChecklistBox } from "@/components/readability";

export type RemoteCostChecklistVariant =
  | "inheritance"
  | "corporate"
  | "real-estate"
  | "civil";

export type RemoteCostChecklistProps = {
  variant?: RemoteCostChecklistVariant;
  fromPage?: string;
  inquiryField?: string;
  lead?: string;
  className?: string;
};

const ITEMS: Record<RemoteCostChecklistVariant, string[]> = {
  inheritance: [
    "사망일",
    "피상속인 최후 주소지",
    "상속인 수와 관계",
    "부동산 종류와 개수·소재지",
    "협의분할 여부",
    "채무·포기·한정승인 검토 여부",
    "해외·미성년·연락두절 상속인 여부",
    "준비된 서류",
  ],
  corporate: [
    "법인 등기사항증명서",
    "법인 유형",
    "변경하려는 사항",
    "임원 수",
    "본점 주소",
    "관할 변경 여부",
    "정관·주주명부·의사록 준비 여부",
  ],
  "real-estate": [
    "부동산 주소",
    "부동산 종류",
    "거래 또는 변경 원인",
    "당사자 수",
    "근저당·전세권·가압류 여부",
    "해외 거주 당사자 여부",
  ],
  civil: [
    "청구금액",
    "상대방 정보",
    "계약서·계좌이체·메시지 등 증거",
    "상대방 주소 확인 여부",
    "기존 내용증명 또는 독촉 여부",
  ],
};

const FIELD_BY_VARIANT: Record<RemoteCostChecklistVariant, string> = {
  inheritance: "inheritance-registration",
  corporate: "corporate-registration",
  "real-estate": "real-estate-registration",
  civil: "payment-order",
};

/**
 * 비용 확인에 필요한 정보만 안내 — 정액 공시·즉시 확정을 하지 않는다.
 */
export function RemoteCostChecklist({
  variant = "inheritance",
  fromPage,
  inquiryField,
  lead = "사건의 종류, 당사자 수, 부동산 개수, 관할, 해외서류 여부 등에 따라 비용이 달라질 수 있으므로 기본 자료를 확인한 뒤 법무사 보수와 공과금을 구분해 안내합니다.",
  className = "",
}: RemoteCostChecklistProps) {
  const field = inquiryField ?? FIELD_BY_VARIANT[variant];
  const qs = new URLSearchParams();
  qs.set("field", field);
  qs.set("cost", "1");
  qs.set("intent", "비용 확인에 필요한 자료 안내");
  if (fromPage) qs.set("from", fromPage);
  const href = `/contact/inquiry?${qs.toString()}`;

  return (
    <section
      id="remote-cost-checklist"
      className={`rounded-xl border border-beige-dark bg-white p-5 sm:p-6 ${className}`}
      aria-labelledby="remote-cost-checklist-title"
    >
      <p className="text-xs font-semibold tracking-wide text-navy/70">
        비용 확인에 필요한 정보
      </p>
      <h2
        id="remote-cost-checklist-title"
        className="mt-2 text-lg font-bold text-[var(--text-primary)] sm:text-xl"
      >
        견적을 내기 전에 먼저 알려주시면 좋은 항목
      </h2>
      <p className="mt-3 max-w-3xl text-sm leading-relaxed text-navy/80 sm:text-base">
        {lead}
      </p>
      <div className="mt-5">
        <ChecklistBox items={ITEMS[variant]} />
      </div>
      <div className="mt-5 flex flex-col gap-2 sm:flex-row">
        <Link
          href={href}
          className="btn-primary inline-flex min-h-11 flex-1 items-center justify-center px-4 text-sm"
        >
          예상 비용 확인에 필요한 자료 안내받기
        </Link>
        <Link
          href={`${href}&intent=${encodeURIComponent("당사자 수와 주소 남기기")}`}
          className="btn-secondary inline-flex min-h-11 flex-1 items-center justify-center px-4 text-sm"
        >
          당사자 수와 주소 남기기
        </Link>
      </div>
    </section>
  );
}
