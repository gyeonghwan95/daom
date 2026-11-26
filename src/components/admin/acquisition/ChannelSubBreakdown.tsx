"use client";

import {
  channelColor,
  channelLabel,
  conversionRate,
  deltaCount,
  engagementRate,
  formatCount,
  formatRate,
  type ReferrerGroupRow,
} from "@/lib/admin/acquisition-view";

const MIN_RATE_BASE = 5;

function DeltaText({
  current,
  previous,
}: {
  current: number;
  previous: number;
}) {
  const d = deltaCount(current, previous);
  return <span className={`admin-acq-delta admin-acq-delta--${d.direction}`}>{d.text}</span>;
}

export function ChannelSubBreakdown({
  channelId,
  groups,
  empty,
}: {
  channelId: string;
  groups: ReferrerGroupRow[];
  empty?: string;
}) {
  const total = groups.reduce((sum, g) => sum + g.sessions, 0);
  if (!groups.length) {
    return (
      <p className="admin-acq-empty">
        {empty ?? `${channelLabel(channelId)} 세부 유입처가 아직 없습니다.`}
      </p>
    );
  }

  return (
    <div className="admin-acq-subpanel">
      <div className="admin-acq-subpanel__head">
        <span className="admin-acq-channel">
          <i style={{ background: channelColor(channelId) }} aria-hidden />
          <strong>{channelLabel(channelId)} 세부</strong>
        </span>
        <span className="admin-acq-hint" style={{ margin: 0 }}>
          같은 이름의 모바일·PC 유입처를 합쳤습니다 · {formatCount(total)}세션
        </span>
      </div>
      <div className="admin-acq-subbars" role="list">
        {groups.slice(0, 8).map((g) => {
          const pct = total ? (g.sessions / total) * 100 : 0;
          return (
            <div key={`${g.channel}-${g.label}`} className="admin-acq-subbar" role="listitem">
              <div className="admin-acq-subbar__meta">
                <strong>{g.label}</strong>
                <span>
                  {formatCount(g.sessions)}
                  <small>{pct ? ` · ${pct.toFixed(pct < 10 ? 1 : 0)}%` : ""}</small>
                </span>
              </div>
              <div className="admin-acq-subbar__track" aria-hidden>
                <span
                  style={{
                    width: `${Math.max(pct, g.sessions ? 2 : 0)}%`,
                    background: channelColor(channelId),
                  }}
                />
              </div>
              <div className="admin-acq-subbar__stats">
                <DeltaText current={g.sessions} previous={g.prevSessions} />
                <span title="참여율">참여 {formatRate(engagementRate({ eng: g.eng, s: g.sessions }, MIN_RATE_BASE), 0)}</span>
                <span title="상담 연결률">
                  연결 <strong>{formatRate(conversionRate({ cv: g.cv, s: g.sessions }, MIN_RATE_BASE))}</strong>
                </span>
                {g.hosts.length > 1 ? (
                  <span className="admin-acq-subbar__hosts" title={g.hosts.join(", ")}>
                    {g.hosts.length}개 호스트
                  </span>
                ) : (
                  <span className="admin-acq-subbar__hosts">{g.hosts[0]}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function PortalAiGrid({
  panels,
}: {
  panels: Array<{ channelId: string; groups: ReferrerGroupRow[] }>;
}) {
  const visible = panels.filter((p) => p.groups.length > 0);
  if (!visible.length) return null;
  return (
    <div className="admin-acq-detail-grid">
      {visible.map((p) => (
        <ChannelSubBreakdown key={p.channelId} channelId={p.channelId} groups={p.groups} />
      ))}
    </div>
  );
}
