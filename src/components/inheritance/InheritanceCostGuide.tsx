import Link from "next/link";
import { ChecklistBox } from "@/components/readability";

export type InheritanceCostGuideProps = {
  fromPage?: string;
  /** 페이지 맥락에 맞춘 한 줄 안내 (선택) */
  lead?: string;
  className?: string;
};

const NEEDED_INFO = [
  "사망일",
  "피상속인 최후 주소지",
  "상속인 수와 관계",
  "부동산 종류와 개수·소재지",
  "협의분할 여부",
  "해외·미성년·연락두절 상속인 여부",
  "상속포기·한정승인 필요 여부",
  "확인된 채무",
  "준비된 서류",
] as const;

const COST_PARTS = [
  "법무사 보수",
  "등록면허세·취득세 등 사건별 세금",
  "등기신청수수료",
  "국민주택채권 등 해당되는 공과금",
  "증명서 발급·우편·번역·공증 등 부대비용",
  "복잡한 가족관계나 추가 절차에 따른 비용",
] as const;

/**
 * 상속 비용 안내 — 임의 정액을 표시하지 않고 확인에 필요한 정보·구성만 안내.
 */
export function InheritanceCostGuide({
  fromPage,
  lead = "상속인 구성과 부동산 수, 협의 방식에 따라 비용이 달라지므로 기본 자료를 확인한 뒤 보수와 공과금을 구분해 안내합니다.",
  className = "",
}: InheritanceCostGuideProps) {
  const qs = new URLSearchParams();
  qs.set("field", "inheritance-registration");
  qs.set("intent", "상속 비용 구성 확인");
  qs.set("cost", "1");
  if (fromPage) qs.set("from", fromPage);
  const inquiryHref = `/contact/inquiry?${qs.toString()}`;

  return (
    <section
      id="inheritance-cost-guide"
      className={`space-y-4 ${className}`}
      aria-labelledby="inheritance-cost-title"
    >
      <h2
        id="inheritance-cost-title"
        className="text-lg font-bold text-[var(--text-primary)] sm:text-xl"
      >
        예상 비용 확인에 필요한 정보
      </h2>
      <p className="max-w-3xl text-sm leading-relaxed text-navy/80 sm:text-base">
        {lead}
      </p>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <h3 className="text-base font-semibold text-navy">알려 주시면 좋은 정보</h3>
          <div className="mt-3">
            <ChecklistBox items={[...NEEDED_INFO]} />
          </div>
        </div>
        <div>
          <h3 className="text-base font-semibold text-navy">비용 구성 구분</h3>
          <div className="mt-3">
            <ChecklistBox items={[...COST_PARTS]} />
          </div>
        </div>
      </div>

      <p className="text-sm leading-relaxed text-navy/75">
        사망일과 부동산 주소만 먼저 보내도 비용 확인에 필요한 항목을 안내받을 수
        있습니다. 근거 없는 고정 단가나 ‘최저’ 금액으로 비교하도록 유도하지
        않습니다.
      </p>

      <Link
        href={inquiryHref}
        className="btn-primary inline-flex min-h-11 items-center justify-center px-5 text-sm"
      >
        준비서류와 비용 문의하기
      </Link>
    </section>
  );
}
