import Link from "next/link";
import { InquiryStartButton } from "@/components/consultation/InquiryStartButton";
import { InquiryNaverCtaPair } from "@/components/cta/InquiryNaverCtaPair";
import { NaverBlogMorePostsButton } from "@/components/cta/NaverBlogMorePostsButton";
import { consultationInquiryCopy } from "@/lib/consultation-inquiry";

type ReadabilityCTAProps = {
  title: string;
  description: string;
  href?: string;
  buttonLabel?: string;
  /** 상담 신청서 업무 분야 자동 선택 (`/contact/inquiry?field=`) */
  inquiryField?: string;
  /** 유입 페이지 slug (`from=`) */
  fromPage?: string;
  /** 확인하고 싶은 내용 (`intent=`) */
  intent?: string;
  /** false면 '안윤정 법무사는 누구일까?' 보조 버튼 숨김 */
  showAboutLawyer?: boolean;
  /** '안윤정 법무사는 누구일까?' 오른쪽에 네이버 블로그 더보기 버튼 */
  showNaverBlogCta?: boolean;
  /** false면 네이버 예약 페어 숨김 (강의·B2B 등) */
  showNaverReservation?: boolean;
};

export function ReadabilityCTA({
  title,
  description,
  href,
  buttonLabel = consultationInquiryCopy.ctaPrimary,
  inquiryField,
  fromPage,
  intent,
  showAboutLawyer = true,
  showNaverBlogCta = false,
  showNaverReservation = true,
}: ReadabilityCTAProps) {
  const params = new URLSearchParams();
  if (inquiryField) params.set("field", inquiryField);
  if (fromPage) params.set("from", fromPage);
  if (intent) params.set("intent", intent);
  const qs = params.toString();
  const inquiryHref = qs ? `/contact/inquiry?${qs}` : "/contact/inquiry";
  const primaryHref = href ?? inquiryHref;
  const isConsult =
    primaryHref.startsWith("/contact") || primaryHref.includes("inquiry");

  return (
    <aside className="readability-cta">
      <h2 className="readability-cta__title">{title}</h2>
      <p className="readability-cta__description">{description}</p>
      {/*
        간편문의 · 네이버예약 · 안윤정 법무사는 누구일까? 를 한 줄에 둔다(모든 페이지 공통, 2026-11-15).
        페어 래퍼는 CSS에서 display:contents라 세 버튼이 같은 줄의 형제가 된다. 블로그 버튼은 PC에서 자리가 되면 같은 줄 끝, 아니면 다음 줄.
      */}
      <div className="readability-cta__actions">
        <div className="readability-cta__row">
        <InquiryNaverCtaPair
          placement="readability_cta"
          layout="row"
          size="md"
          className="readability-cta__pair"
          showNaver={showNaverReservation && isConsult}
          inquiry={
            isConsult ? (
              <InquiryStartButton
                source="cta"
                note={intent}
                fallbackHref={primaryHref}
                className="btn-primary readability-cta__button"
              >
                {buttonLabel}
              </InquiryStartButton>
            ) : (
              <Link
                href={primaryHref}
                className="btn-primary readability-cta__button"
                data-cta="contact"
              >
                {buttonLabel}
              </Link>
            )
          }
        />
        {showAboutLawyer ? (
          <Link
            href="/about"
            className="btn-secondary readability-cta__button readability-cta__about gap-1.5"
            data-cta="about-lawyer"
          >
            안윤정 법무사는 누구일까?
          </Link>
        ) : null}
        </div>
        {showNaverBlogCta ? (
          <NaverBlogMorePostsButton className="btn-secondary readability-cta__button gap-1.5" />
        ) : null}
      </div>
    </aside>
  );
}
