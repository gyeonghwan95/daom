import { getContactInfo, getPhoneHref } from "@/lib/contact";
import { seoBrand } from "@/lib/seo/brand";
import { CostInquiryNote, NaverVisitLinks } from "@/components/cta/CostInquiryNote";
import { PageTrustNote } from "@/components/trust/PageTrustNote";
import { PeerPageLinks } from "@/components/internal-links/PeerPageLinks";
import { SpecialistGuideLinks } from "@/components/internal-links/SpecialistGuideLinks";
import { getPeerPagePath } from "@/lib/internal-links/peer-context";

/** 모든 공개 일반 페이지의 본문 끝: 비용 문의 안내(말미) + 공식 상담 번호. 모바일은 하단 고정 바와 겹치는 번호 줄만 PC에서 두고, 네이버 예약·지도 버튼은 모든 화면에 둔다. */
export function MainContactPhone() {
  const { phone } = getContactInfo();
  if (!phone) return null;

  return (
    <>
      <SpecialistGuideLinks path={getPeerPagePath()} />
      <PeerPageLinks path={getPeerPagePath()} />
      <PageTrustNote />
      <div className="mt-10 border-t border-beige-dark pt-6">
        {/* 말미 비용 문의 안내 — 모든 본문형 페이지의 본문 끝 */}
        <CostInquiryNote variant="outro" />
        <p className="mt-5 text-sm leading-relaxed text-navy/75 max-lg:hidden sm:text-base">
          <span className="font-medium text-navy">
            {seoBrand.siteName} · {seoBrand.representative} 상담 전화
          </span>{" "}
          <a
            href={getPhoneHref(phone)}
            className="whitespace-nowrap font-semibold text-navy underline decoration-navy/30 underline-offset-4 hover:decoration-navy"
          >
            {phone}
          </a>
        </p>
        <NaverVisitLinks className="mt-4 lg:mt-3" />
        </div>
    </>
  );
}
