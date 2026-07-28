import { NationwideServiceCard } from "@/components/nationwide/NationwideServiceCard";

type NationwideRemoteBannerProps = {
  /** 업무 맥락에 맞춘 한 줄 강조 (없으면 기본 문구) */
  headline?: string;
  className?: string;
};

/**
 * 하위 호환 래퍼 — 신규 UI는 NationwideServiceCard를 사용한다.
 */
export function NationwideRemoteBanner({
  headline,
  className = "",
}: NationwideRemoteBannerProps) {
  return (
    <NationwideServiceCard headline={headline} className={className} />
  );
}
