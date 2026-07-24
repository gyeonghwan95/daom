import Link from "next/link";

type NationwideRemoteBannerProps = {
  /** 업무 맥락에 맞춘 한 줄 강조 (없으면 기본 문구) */
  headline?: string;
  className?: string;
};

/**
 * 전국·비대면 수임 페이지 첫 화면에 고정 노출.
 * chip만으로는 놓치기 쉬워, 방문 없이 가능하다는 점을 즉시 인지시키고 상담으로 유도한다.
 */
export function NationwideRemoteBanner({
  headline,
  className = "",
}: NationwideRemoteBannerProps) {
  const title =
    headline ?? "부산에 직접 방문하지 않아도 전국에서 진행할 수 있습니다";

  return (
    <aside
      className={`nationwide-remote-banner ${className}`.trim()}
      aria-label="전국 비대면 진행 안내"
    >
      <div className="nationwide-remote-banner__badges">
        <span className="nationwide-remote-banner__badge">전 지역 업무 가능</span>
        <span className="nationwide-remote-banner__badge nationwide-remote-banner__badge--accent">
          방문 없이 · 비대면
        </span>
      </div>
      <h2 className="nationwide-remote-banner__title">{title}</h2>
      <p className="nationwide-remote-banner__lead">
        전화·카카오톡·네이버 톡톡으로 상담하고, 서류는 사진·우편·전자로 받아
        진행하는 경우가 많습니다. 거주지가 부산이 아니어도, 부동산·법인이
        다른 지역에 있어도 먼저 가능 여부를 안내해 드립니다.
      </p>
      <ul className="nationwide-remote-banner__points">
        <li>전국 어디든 상담 접수 가능</li>
        <li>방문 없이 서류 전달·진행 검토</li>
        <li>관할·비용·서류는 사건별로 사전 안내</li>
      </ul>
      <div className="nationwide-remote-banner__actions">
        <Link
          href="/contact"
          className="btn-primary inline-flex min-h-12 items-center justify-center px-5"
        >
          비대면 상담 문의하기
        </Link>
        <Link
          href="/전국업무"
          className="btn-secondary inline-flex min-h-12 items-center justify-center px-5"
        >
          전국 업무 안내 보기
        </Link>
      </div>
    </aside>
  );
}
