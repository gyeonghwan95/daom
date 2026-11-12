"use client";

import { useConsultationAvailability } from "@/hooks/useConsultationAvailability";
import { isConsultationPhoneOffered } from "@/lib/consultation-availability";
import { getNapInfo } from "@/lib/business-info";
import { getPhoneHref } from "@/lib/contact";

/**
 * 연락 페이지 첫 화면의 상호·대표·주소·전화·사업자 요약.
 * 전화번호는 정보로 항상 보이되, 누르면 걸리는 링크는 상담 가능 시간에만 켠다(닫힘이면 평일 09:00–18:00 안내).
 * 높이는 처음부터 고정해 시간 확정 뒤에도 레이아웃이 움직이지 않는다.
 */
export function ContactNapStrip() {
  const nap = getNapInfo();
  const { isOpen, isResolved } = useConsultationAvailability();
  const callable = isConsultationPhoneOffered(isResolved, isOpen);

  return (
    <section
      aria-label="사무소 정보 요약"
      className="mb-8 rounded-xl border border-beige-dark bg-white p-4 md:p-5"
    >
      <dl className="grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <dt className="font-semibold text-navy">상호 · 대표</dt>
          <dd className="mt-1 text-navy/80">
            {nap.tradeName} · {nap.representative} 법무사
          </dd>
        </div>
        <div className="sm:col-span-1 lg:col-span-1">
          <dt className="font-semibold text-navy">주소</dt>
          <dd className="mt-1 leading-relaxed text-navy/80">{nap.address}</dd>
        </div>
        <div>
          <dt className="font-semibold text-navy">전화</dt>
          <dd className="mt-1 min-h-[2.75rem] text-navy/80">
            {callable ? (
              <a href={getPhoneHref(nap.phone)} className="font-medium text-navy underline underline-offset-2">
                {nap.phone}
              </a>
            ) : (
              <span className="font-medium text-navy">{nap.phone}</span>
            )}
            <span className="block text-xs text-navy/60">{nap.openingHoursSummary}</span>
          </dd>
        </div>
        <div>
          <dt className="font-semibold text-navy">사업자등록번호</dt>
          <dd className="mt-1 text-navy/80">{nap.businessRegistrationNumber}</dd>
        </div>
      </dl>
    </section>
  );
}
