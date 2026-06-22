import { getBusinessInfo } from "@/lib/business-info";
import { getPhoneHref } from "@/lib/contact";

export function FooterBusinessInfo() {
  const info = getBusinessInfo();

  return (
    <div className="mt-10 border-t border-white/15 pt-8">
      <p className="text-sm font-semibold text-beige">사업자 정보</p>
      <dl className="mt-4 grid gap-3 text-sm text-white/75 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <dt className="text-white/50">상호</dt>
          <dd className="mt-1 font-medium text-white/90">{info.tradeName}</dd>
        </div>
        <div>
          <dt className="text-white/50">대표자</dt>
          <dd className="mt-1 font-medium text-white/90">
            {info.representative} ({info.representativeTitle})
          </dd>
        </div>
        <div>
          <dt className="text-white/50">주소</dt>
          <dd className="mt-1 leading-relaxed">{info.address}</dd>
        </div>
        <div>
          <dt className="text-white/50">전화번호</dt>
          <dd className="mt-1">
            {info.phone ? (
              <a
                href={getPhoneHref(info.phone)}
                className="font-medium text-white/90 hover:text-white"
              >
                {info.phone}
              </a>
            ) : (
              "문의 시 안내"
            )}
          </dd>
        </div>
        <div className="sm:col-span-2 lg:col-span-2">
          <dt className="text-white/50">사업자등록번호</dt>
          <dd className="mt-1 font-medium text-white/90">
            {info.businessRegistrationNumber}
          </dd>
        </div>
      </dl>
      <p className="mt-4 text-xs leading-relaxed text-white/50">{info.legalNotice}</p>
    </div>
  );
}
