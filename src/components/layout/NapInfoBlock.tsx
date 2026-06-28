import { getMailtoHref, getNapInfo } from "@/lib/business-info";
import { OfficeHoursDetail } from "@/components/contact/OfficeHoursDetail";
import { getPhoneHref } from "@/lib/contact";

type NapInfoBlockProps = {
  variant?: "footer" | "contact";
  showOpeningHours?: boolean;
  showBusinessRegistration?: boolean;
};

export function NapInfoBlock({
  variant = "contact",
  showOpeningHours = true,
  showBusinessRegistration = false,
}: NapInfoBlockProps) {
  const nap = getNapInfo();
  const isFooter = variant === "footer";

  const labelClass = isFooter ? "text-white/50" : "font-semibold text-navy";
  const valueClass = isFooter
    ? "mt-1 font-medium text-white/90"
    : "mt-1 text-navy/80";
  const linkClass = isFooter
    ? "font-medium text-white/90 transition-colors duration-200 hover:text-white"
    : "font-medium text-navy-light underline-offset-2 transition-colors duration-200 hover:text-navy hover:underline";

  return (
    <dl
      className={
        isFooter
          ? "mt-4 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-3"
          : "grid gap-x-4 gap-y-5 sm:grid-cols-2"
      }
    >
      <div>
        <dt className={labelClass}>상호명</dt>
        <dd className={valueClass}>{nap.tradeName}</dd>
      </div>
      <div>
        <dt className={labelClass}>대표자</dt>
        <dd className={valueClass}>{nap.representative}</dd>
      </div>
      <div className={isFooter ? "sm:col-span-2" : "sm:col-span-2"}>
        <dt className={labelClass}>주소</dt>
        <dd className={`${valueClass} leading-relaxed`}>{nap.address}</dd>
      </div>
      <div>
        <dt className={labelClass}>전화번호</dt>
        <dd className={isFooter ? "mt-1" : valueClass}>
          {nap.phone ? (
            <a href={getPhoneHref(nap.phone)} className={linkClass}>
              {nap.phone}
            </a>
          ) : (
            "문의 시 안내"
          )}
        </dd>
      </div>
      <div>
        <dt className={labelClass}>이메일</dt>
        <dd className={isFooter ? "mt-1" : valueClass}>
          <a href={getMailtoHref(nap.email)} className={linkClass}>
            {nap.email}
          </a>
        </dd>
      </div>
      <div>
        <dt className={labelClass}>홈페이지</dt>
        <dd className={isFooter ? "mt-1" : valueClass}>
          <a
            href={nap.websiteUrl}
            className={`${linkClass} break-all`}
          >
            {nap.websiteUrl.replace(/^https?:\/\//, "")}
          </a>
        </dd>
      </div>
      {showOpeningHours ? (
        <div
          className={
            isFooter
              ? "sm:col-span-2 lg:col-span-3"
              : "sm:col-span-2 border-t border-beige-dark pt-5"
          }
        >
          <dt className={labelClass}>운영시간</dt>
          <dd className={isFooter ? "mt-3" : "mt-3"}>
            <OfficeHoursDetail variant={isFooter ? "footer" : "default"} />
            <span
              className={
                isFooter ? "mt-3 block text-white/60" : "mt-3 block text-navy/60"
              }
            >
              {nap.openingHoursNote}
            </span>
          </dd>
        </div>
      ) : null}
      {showBusinessRegistration ? (
        <div className={isFooter ? "sm:col-span-2 lg:col-span-3" : "sm:col-span-2"}>
          <dt className={labelClass}>사업자등록번호</dt>
          <dd className={valueClass}>{nap.businessRegistrationNumber}</dd>
        </div>
      ) : null}
    </dl>
  );
}
