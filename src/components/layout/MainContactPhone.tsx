import { getContactInfo, getPhoneHref } from "@/lib/contact";
import { seoBrand } from "@/lib/seo/brand";

/** 모든 공개 일반 페이지의 본문에서 바로 확인할 수 있는 공식 상담 번호. */
export function MainContactPhone() {
  const { phone } = getContactInfo();
  if (!phone) return null;

  return (
    <p className="mt-10 border-t border-beige-dark pt-5 text-sm leading-relaxed text-navy/75 sm:text-base">
      <span className="font-medium text-navy">
        {seoBrand.siteName} · {seoBrand.representative} 상담 전화
      </span>{" "}
      <a
        href={getPhoneHref(phone)}
        className="font-semibold text-navy underline decoration-navy/30 underline-offset-4 hover:decoration-navy"
      >
        {phone}
      </a>
    </p>
  );
}
