import type { ReactNode } from "react";

type HomeSectionAnchorProps = {
  id: string;
  children: ReactNode;
  className?: string;
};

/** 홈 섹션 앵커 — 스크롤 이동 시 헤더 높이 보정 */
export function HomeSectionAnchor({
  id,
  children,
  className = "",
}: HomeSectionAnchorProps) {
  return (
    <div id={id} className={`home-section-anchor ${className}`.trim()}>
      {children}
    </div>
  );
}
