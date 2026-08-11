import Link from "next/link";
import { InquiryNaverCtaPair } from "@/components/cta/InquiryNaverCtaPair";
import {
  getContactInfo,
  getDirectConsultationChannels,
  getPhoneHref,
} from "@/lib/contact";
import {
  CONTACT_INQUIRY_PATH,
  consultationInquiryCopy,
} from "@/lib/consultation-inquiry";

type NationwideServiceCardProps = {
  /** 업무 맥락 한 줄 제목 (없으면 기본 문구) */
  headline?: string;
  className?: string;
  /** 하단 채널 버튼 표시 */
  showChannelButtons?: boolean;
};

/**
 * 전국·비대면 진행 안내 카드.
 * 배지·제목·설명이 DOM에서 분리되어 “전 지역 업무 가능방문 없이”처럼 붙지 않는다.
 * 페이지당 최대 1회 노출 권장.
 */
export function NationwideServiceCard({
  headline,
  className = "",
  showChannelButtons = true,
}: NationwideServiceCardProps) {
  const title =
    headline ?? "부산에 방문하지 않아도 업무를 끝까지 진행할 수 있습니다";
  const contact = getContactInfo();
  const channels = getDirectConsultationChannels();
  const phoneChannel = channels.find((c) => c.id === "phone");
  const kakaoChannel = channels.find((c) => c.id === "kakao");
  const naverChannel = channels.find((c) => c.id === "naver");

  return (
    <aside
      className={`nationwide-service-card ${className}`.trim()}
      aria-label="전국 비대면 업무 안내"
    >
      <div className="nationwide-service-card__layout">
        <div className="nationwide-service-card__main">
          <span className="nationwide-service-card__badge">전국 업무 가능</span>
          <h2 className="nationwide-service-card__title">{title}</h2>
          <p className="nationwide-service-card__lead">
            거주지가 부산이 아니거나 부동산·법인이 다른 지역에 있어도
            상담부터 신청까지 원활히 진행할 수 있습니다.{" "}
            {consultationInquiryCopy.oneMinuteShort} 전화·카카오톡·네이버
            톡톡으로도 바로 시작할 수 있고, 서류는 사진·우편·전자 방식으로
            전달하면 됩니다.
          </p>
        </div>

        <ul className="nationwide-service-card__points" role="list">
          <li className="nationwide-service-card__point">
            <span className="nationwide-service-card__icon" aria-hidden>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                <path d="M12 2a7 7 0 0 1 7 7c0 5-7 13-7 13S5 14 5 9a7 7 0 0 1 7-7Z" />
                <circle cx="12" cy="9" r="2.25" />
              </svg>
            </span>
            <span>전국 어디서나 바로 상담 시작</span>
          </li>
          <li className="nationwide-service-card__point">
            <span className="nationwide-service-card__icon" aria-hidden>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                <path d="M4 7h16v12H4z" />
                <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
            </span>
            <span>방문 없이 서류 전달·진행 완료</span>
          </li>
          <li className="nationwide-service-card__point">
            <span className="nationwide-service-card__icon" aria-hidden>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                <path d="M9 5h11M9 12h11M9 19h11M4 5h.01M4 12h.01M4 19h.01" />
              </svg>
            </span>
            <span>관할·비용·준비서류 바로 안내</span>
          </li>
        </ul>
      </div>

      <div className="nationwide-service-card__actions">
        <InquiryNaverCtaPair
          placement="nationwide_card"
          layout="row"
          size="md"
          inquiry={
            <Link
              href={CONTACT_INQUIRY_PATH}
              className="btn-primary inline-flex min-h-12 items-center justify-center px-5"
            >
              {consultationInquiryCopy.ctaPrimary}
            </Link>
          }
        />
        {showChannelButtons ? (
          <div className="nationwide-service-card__channels">
            <a
              href={phoneChannel?.href ?? getPhoneHref(contact.phone)}
              className="nationwide-service-card__channel"
            >
              전화
            </a>
            {kakaoChannel ? (
              <a
                href={kakaoChannel.href}
                className="nationwide-service-card__channel"
                target="_blank"
                rel="noopener noreferrer"
              >
                카카오톡
              </a>
            ) : null}
            {naverChannel ? (
              <a
                href={naverChannel.href}
                className="nationwide-service-card__channel"
                target="_blank"
                rel="noopener noreferrer"
              >
                네이버 톡톡
              </a>
            ) : null}
          </div>
        ) : null}
      </div>
    </aside>
  );
}
