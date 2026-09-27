import { RemoteServicePanel } from "@/components/nationwide/RemoteServicePanel";
import {
  getNationwideNotice,
  type NationwideServiceType,
} from "@/lib/nationwide";

type NationwideServiceNoticeProps = {
  type: NationwideServiceType;
  /** 기본 "전국 의뢰 가능" 대신 쓸 배지 (예: "군포 부동산 전국 의뢰 가능") */
  badge?: string;
  /** 사무소 위치 고지 등 항상 보여야 하는 짧은 문구 */
  footnote?: string;
  /** 본문에 관할 설명이 이미 있는 페이지는 접이식 세부 안내를 생략 */
  showDetails?: boolean;
  ctaLabel?: string;
  ctaHref?: string;
  className?: string;
};

export function NationwideServiceNotice({
  type,
  badge,
  footnote,
  showDetails = true,
  ctaLabel,
  ctaHref,
  className = "",
}: NationwideServiceNoticeProps) {
  const notice = getNationwideNotice(type, { ctaLabel, ctaHref });

  return (
    <RemoteServicePanel
      badge={badge ?? notice.badge}
      title={notice.title}
      lead={notice.summary}
      footnote={footnote}
      details={
        showDetails
          ? {
              paragraphs: notice.paragraphs,
              steps: notice.steps,
              caution: notice.caution,
            }
          : undefined
      }
      ariaLabel="전국 의뢰 안내"
      className={className}
    />
  );
}
