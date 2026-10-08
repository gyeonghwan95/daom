import Image from "next/image";

/** public/image/비대면업무안내.png 원본(1448×1086)을 WebP로 변환한 파생본 */
const REMOTE_GUIDE_IMAGE = {
  src: "/image/remote-service-guide.webp",
  alt: "비대면 업무 안내 그림. 방문 없이 전화·메시지·서류 전달로 진행하는 순서를 보여 줍니다.",
} as const;

export type RemoteServicePanelDetails = {
  summaryLabel?: string;
  paragraphs?: string[];
  steps?: readonly string[];
  caution?: string;
};

type RemoteServicePanelProps = {
  badge: string;
  title: string;
  /** 기존 페이지의 제목 구조를 바꾸지 않아야 할 때 "p" */
  titleAs?: "h2" | "p";
  lead: string;
  /** 짧은 요점 칩 — 최대 3개 권장 */
  points?: readonly string[];
  /** 사무소 위치·관할 고지 등 항상 보여야 하는 짧은 문구 */
  footnote?: string;
  /** 접힌 상태로 제공하는 세부 안내 — 첫 화면 높이를 줄이기 위해 기본 닫힘 */
  details?: RemoteServicePanelDetails;
  ariaLabel?: string;
  className?: string;
};

/**
 * 전국·비대면 의뢰 안내 패널.
 * 페이지당 1회만 노출한다. 긴 설명은 details 안에 두어 본문을 밀어내지 않는다.
 */
export function RemoteServicePanel({
  badge,
  title,
  titleAs: TitleTag = "h2",
  lead,
  points,
  footnote,
  details,
  ariaLabel = "전국 비대면 의뢰 안내",
  className = "",
}: RemoteServicePanelProps) {
  const hasDetails = Boolean(
    details &&
      (details.paragraphs?.length || details.steps?.length || details.caution),
  );

  return (
    <aside
      className={`remote-panel ${className}`.trim()}
      aria-label={ariaLabel}
    >
      <div className="remote-panel__layout">
        <div className="remote-panel__body">
          <span className="remote-panel__badge">{badge}</span>
          <TitleTag className="remote-panel__title">{title}</TitleTag>
          <p className="remote-panel__lead">{lead}</p>

          {points?.length ? (
            <ul className="remote-panel__points" role="list">
              {points.map((point) => (
                <li key={point} className="remote-panel__point">
                  <svg
                    viewBox="0 0 20 20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden
                  >
                    <path d="m5 10.5 3 3 7-7" />
                  </svg>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          ) : null}

          {footnote ? (
            <p className="remote-panel__footnote">{footnote}</p>
          ) : null}

          {hasDetails && details ? (
            <details className="remote-panel__details">
              <summary className="remote-panel__summary">
                {details.summaryLabel ?? "진행 순서·관할 확인 사항 보기"}
              </summary>
              <div className="remote-panel__details-body">
                {details.paragraphs?.map((p) => (
                  <p key={p.slice(0, 24)}>{p}</p>
                ))}
                {details.steps?.length ? (
                  <ol className="remote-panel__steps">
                    {details.steps.map((step, index) => (
                      <li key={step} className="remote-panel__step">
                        <span className="remote-panel__step-no">
                          {index + 1}단계
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                ) : null}
                {details.caution ? (
                  <p className="remote-panel__caution">{details.caution}</p>
                ) : null}
              </div>
            </details>
          ) : null}
        </div>

        <figure className="remote-panel__media">
          <Image
            src={REMOTE_GUIDE_IMAGE.src}
            alt={REMOTE_GUIDE_IMAGE.alt}
            fill
            quality={75}
            className="remote-panel__image"
            sizes="(max-width: 960px) 100vw, 900px"
          />
        </figure>
      </div>
    </aside>
  );
}
