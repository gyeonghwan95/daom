import { officeHours } from "@/lib/office-location";

type OfficeHoursDetailProps = {
  variant?: "default" | "footer";
};

export function OfficeHoursDetail({ variant = "default" }: OfficeHoursDetailProps) {
  const isFooter = variant === "footer";
  const labelClass = isFooter ? "text-white/50" : "font-semibold text-navy";
  const valueClass = isFooter
    ? "mt-1 font-medium text-white/90"
    : "mt-1 text-navy/80";

  return (
    <dl className={isFooter ? "space-y-3 text-sm" : "grid gap-4 sm:grid-cols-2"}>
      <div>
        <dt className={labelClass}>평일</dt>
        {/* 제목이 이미 "평일"이라 값에서는 빼야 "평일 평일 09:00–18:00"으로 겹치지 않는다 */}
        <dd className={valueClass}>{officeHours.weekday.replace(/^평일\s*/, "")}</dd>
      </div>
      <div>
        <dt className={labelClass}>휴무일</dt>
        <dd className={valueClass}>{officeHours.closed}</dd>
      </div>
    </dl>
  );
}
