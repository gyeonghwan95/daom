import { RemoteServicePanel } from "@/components/nationwide/RemoteServicePanel";
import { consultationInquiryCopy } from "@/lib/consultation-inquiry";

type NationwideServiceCardProps = {
  /** 업무 맥락 한 줄 제목 (없으면 기본 문구) */
  headline?: string;
  className?: string;
  /** @deprecated 히어로·하단 CTA와 중복되어 더 이상 채널 버튼을 쓰지 않습니다 */
  showChannelButtons?: boolean;
};

const POINTS = [
  "전국 어디서나 전화·카카오톡 상담",
  "서류는 사진·우편·전자 방식으로 전달",
  "관할·비용·준비서류 먼저 안내",
] as const;

/**
 * 전국·비대면 진행 안내 카드.
 * 페이지당 최대 1회 노출 권장.
 */
export function NationwideServiceCard({
  headline,
  className = "",
}: NationwideServiceCardProps) {
  return (
    <RemoteServicePanel
      badge="전국 의뢰 가능"
      title={
        headline ?? "부산에 방문하지 않아도 업무를 끝까지 진행할 수 있습니다"
      }
      lead={`거주지나 부동산·법인 소재지가 부산이 아니어도 상담부터 신청까지 진행할 수 있습니다. ${consultationInquiryCopy.oneMinuteShort}`}
      points={POINTS}
      footnote="신청은 사건별 법정 관할 법원·등기소에 하며, 방문이 필요한 절차는 수임 전에 안내합니다."
      className={className}
    />
  );
}
