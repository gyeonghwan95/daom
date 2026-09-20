import Link from "next/link";
import { ChecklistBox } from "@/components/readability";

export type InheritanceCostGuideProps = {
  fromPage?: string;
  /** 페이지 맥락에 맞춘 한 줄 안내 (선택) */
  lead?: string;
  className?: string;
};

const NEEDED_INFO_REGISTRY = [
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

const COST_PARTS_REGISTRY = [
  "법무사 보수",
  "등록면허세·취득세 등 사건별 세금",
  "등기신청수수료",
  "국민주택채권 등 해당되는 공과금",
  "증명서 발급·우편·번역·공증 등 부대비용",
  "복잡한 가족관계나 추가 절차에 따른 비용",
] as const;

const NEEDED_INFO_RENUNCIATION = [
  "사망일(또는 인지일)",
  "포기하려는 상속인 수와 관계",
  "미성년·해외 상속인 여부",
  "특별대리 필요 여부",
  "이미 한 처분·인출 여부",
  "한정승인·등기 병행 여부",
] as const;

const COST_PARTS_RENUNCIATION = [
  "법무사 보수",
  "가정법원 납부 실비",
  "증명서 발급·송달·우편",
  "신청인 수·공동 신고 여부",
  "미성년·해외·특별대리 등 추가 업무",
] as const;

/**
 * 상속 비용 안내 — 임의 정액을 표시하지 않고 확인에 필요한 정보·구성만 안내.
 */
export function InheritanceCostGuide({
  fromPage,
  lead,
  className = "",
}: InheritanceCostGuideProps) {
  const isRenunciation = fromPage === "부산상속포기";
  const needed = isRenunciation ? NEEDED_INFO_RENUNCIATION : NEEDED_INFO_REGISTRY;
  const costParts = isRenunciation ? COST_PARTS_RENUNCIATION : COST_PARTS_REGISTRY;
  const resolvedLead =
    lead ??
    (isRenunciation
      ? "상속포기 비용은 가정법원 실비와 신청인 구성에 따른 보수 중심입니다. 취득세·등기신청수수료 견적 구조와는 다릅니다."
      : "상속인 구성과 부동산 수, 협의 방식에 따라 비용이 달라지므로 기본 자료를 확인한 뒤 보수와 공과금을 구분해 안내합니다.");
  const qs = new URLSearchParams();
  qs.set("field", isRenunciation ? "inheritance-renunciation" : "inheritance-registration");
  qs.set("intent", isRenunciation ? "상속포기 비용 구성 확인" : "상속 비용 구성 확인");
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
        {resolvedLead}
      </p>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <h3 className="text-base font-semibold text-navy">알려 주시면 좋은 정보</h3>
          <div className="mt-3">
            <ChecklistBox items={[...needed]} />
          </div>
        </div>
        <div>
          <h3 className="text-base font-semibold text-navy">비용 구성 구분</h3>
          <div className="mt-3">
            <ChecklistBox items={[...costParts]} />
          </div>
        </div>
      </div>

      <p className="text-sm leading-relaxed text-navy/75">
        {isRenunciation
          ? "사망일과 포기하려는 인원만 먼저 알려 주셔도 법원 실비와 보수 항목을 나눠 안내받을 수 있습니다. 확정 금액은 서류 확인 후입니다."
          : "사망일과 부동산 주소만 먼저 보내도 비용 확인에 필요한 항목을 안내받을 수 있습니다. 근거 없는 고정 단가나 ‘최저’ 금액으로 비교하도록 유도하지 않습니다."}
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
