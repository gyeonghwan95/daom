/**
 * 데일리 브리핑 이메일 — HTML + plain text 렌더링, Resend 발송.
 *
 * - 외부 텍스트(공고 제목·기관명·파일명)는 전부 escapeHtml을 거친다 (XSS 방지).
 * - 외부 이미지를 사용하지 않는다.
 * - RESEND_API_KEY는 환경변수로만 받고 로그에 출력하지 않는다.
 */

import { getManualLinkSources } from "../config/sources";
import { RECOMMENDATION_LABELS } from "./score";
import type { BriefingData, Opportunity, OpportunityChange } from "./types";
import { daysUntil, escapeHtml, formatAmount, maskEmail } from "./util";

export function buildSubject(data: BriefingData): string {
  const { priorityCount, candidateTotal, changedCount } = {
    priorityCount: data.summary.priorityCount,
    candidateTotal: data.summary.candidateTotal,
    changedCount: data.summary.changedCount,
  };
  if (candidateTotal === 0) {
    const changed = changedCount > 0 ? ` · 변경 ${changedCount}건` : "";
    return `[다옴 입찰브리핑] 신규 적합 공고 없음${changed}`;
  }
  const priority = priorityCount > 0 ? `오늘 우선 검토 ${priorityCount}건 · ` : "";
  return `[다옴 입찰브리핑] ${priority}신규 기회 ${candidateTotal}건`;
}

function deadlineLabel(opp: Opportunity): string {
  if (!opp.applicationDeadline) return "마감 미확인";
  const d = daysUntil(opp.applicationDeadline);
  if (d === undefined) return opp.applicationDeadline;
  if (d < 0) return `${opp.applicationDeadline} (마감 지남)`;
  return `${opp.applicationDeadline} (D-${d})`;
}

// ── plain text ──

function textItem(opp: Opportunity, index: number): string {
  const lines = [
    `${index}. [${opp.totalScore}점·${RECOMMENDATION_LABELS[opp.recommendation]}] ${opp.title}`,
    `   기관: ${opp.organization}${opp.demandOrganization && opp.demandOrganization !== opp.organization ? ` (수요기관: ${opp.demandOrganization})` : ""}`,
    `   마감: ${deadlineLabel(opp)} / 금액: ${formatAmount(opp.estimatedAmount)}${opp.regionRequirements.length ? ` / 지역: ${opp.regionRequirements.join(", ")}` : ""}`,
  ];
  if (opp.scoreReasons.length) lines.push(`   이유: ${opp.scoreReasons.join(" · ")}`);
  if (opp.risks.length) lines.push(`   주의: ${opp.risks.join(" · ")}`);
  lines.push(`   원문: ${opp.originalUrl}`);
  return lines.join("\n");
}

function textSection(title: string, items: Opportunity[]): string {
  if (items.length === 0) return "";
  return [
    "",
    `── ${title} (${items.length}건) ──`,
    ...items.map((opp, i) => textItem(opp, i + 1)),
  ].join("\n\n");
}

export function renderText(data: BriefingData): string {
  const s = data.summary;
  const parts: string[] = [
    "다옴법무사사무소 업무기회 데일리 브리핑",
    `수집 기준시각: ${data.generatedAtKst} (KST)`,
    `수집 기간: ${data.collectionWindow.from} ~ ${data.collectionWindow.to}`,
    "",
    "[오늘의 요약]",
    `- 신규 수집: ${s.fetchedTotal}건 / 관련 후보: ${s.candidateTotal}건 / 우선 검토: ${s.priorityCount}건`,
    `- 마감 임박(7일 이내): ${s.deadlineSoonCount}건 / 정정·취소·변경: ${s.changedCount}건`,
    s.failedSources.length
      ? `- 수집 실패 소스: ${s.failedSources.join(", ")}`
      : "- 모든 소스 정상 수집",
  ];

  parts.push(textSection("오늘 우선 검토", data.priorityItems));
  parts.push(textSection("직접 입찰 후보", data.directBidItems));
  parts.push(textSection("등기 수임 잠재정보", data.registrationLeads));
  parts.push(textSection("복대리·협업 후보", data.collaborationItems));
  parts.push(textSection("법률 강의·전문가 모집", data.lectureItems));
  parts.push(textSection("경매·공매·시장 참고정보", data.marketSignals));

  if (data.changedItems.length) {
    parts.push("", `── 정정·취소·마감 연장 (${data.changedItems.length}건) ──`);
    for (const change of data.changedItems) {
      parts.push(
        `- ${change.title} (${change.organization})`,
        `  변경: ${change.changes.join(" / ")}`,
        `  원문: ${change.originalUrl}`,
      );
    }
  }

  const manual = getManualLinkSources();
  if (manual.length) {
    parts.push("", "── 수동 확인 링크 (자동수집 미지원 소스) ──");
    for (const src of manual) {
      parts.push(`- ${src.name}: ${src.baseUrl}`);
    }
  }

  parts.push("", "── 수집 상태 ──");
  for (const run of data.runs) {
    parts.push(
      `- ${run.sourceId}: ${run.status} (수집 ${run.fetchedCount}건, 신규 ${run.newCount}건, ${run.durationMs}ms)${run.errorMessage ? ` — ${run.errorMessage}` : ""}`,
    );
  }

  parts.push(
    "",
    "※ 본 브리핑은 후보를 알려주는 참고자료입니다.",
    "※ 참가자격·지역제한·마감일은 반드시 공고 원문에서 확인하세요.",
    "※ 법무사 업무범위를 벗어난 공고는 '협업 필요'로 분류되며 단독 수임 대상이 아닙니다.",
  );

  return parts.filter((p) => p !== "").join("\n").replace(/\n{3,}/g, "\n\n");
}

// ── HTML ──

const STYLE = {
  card: "border:1px solid #e2e8f0;border-radius:10px;padding:14px 16px;margin:0 0 12px;background:#ffffff;",
  badge:
    "display:inline-block;padding:3px 10px;border-radius:999px;font-size:12px;font-weight:700;line-height:1.4;",
  muted: "color:#64748b;font-size:13px;line-height:1.55;",
  h2: "font-size:15px;margin:28px 0 12px;color:#0f172a;border-bottom:2px solid #0f766e;padding-bottom:8px;font-weight:800;",
  link: "color:#0f766e;font-weight:600;font-size:13px;text-decoration:none;",
};

function badgeColor(score: number): string {
  if (score >= 85) return "background:#fee2e2;color:#b91c1c;";
  if (score >= 70) return "background:#ffedd5;color:#c2410c;";
  if (score >= 55) return "background:#fef9c3;color:#a16207;";
  return "background:#e2e8f0;color:#475569;";
}

function htmlItem(opp: Opportunity): string {
  const risks = opp.risks.length
    ? `<div style="${STYLE.muted}margin-top:4px;">⚠ ${opp.risks.map(escapeHtml).join(" · ")}</div>`
    : "";
  const reasons = opp.scoreReasons.length
    ? `<div style="${STYLE.muted}margin-top:4px;">${opp.scoreReasons.map(escapeHtml).join(" · ")}</div>`
    : "";
  const region = opp.regionRequirements.length
    ? ` · 지역: ${escapeHtml(opp.regionRequirements.join(", "))}`
    : "";
  const attachments = opp.attachmentNames.length
    ? `<div style="${STYLE.muted}margin-top:4px;">첨부: ${opp.attachmentNames.map(escapeHtml).join(", ")}</div>`
    : "";
  return `<div style="${STYLE.card}">
  <div>
    <span style="${STYLE.badge}${badgeColor(opp.totalScore)}">${opp.totalScore}점 · ${escapeHtml(RECOMMENDATION_LABELS[opp.recommendation])}</span>
  </div>
  <div style="font-size:15px;font-weight:700;margin:6px 0 2px;color:#0f172a;">${escapeHtml(opp.title)}</div>
  <div style="${STYLE.muted}">${escapeHtml(opp.organization)} · 마감: ${escapeHtml(deadlineLabel(opp))} · ${escapeHtml(formatAmount(opp.estimatedAmount))}${region}</div>
  ${reasons}${risks}${attachments}
  <div style="margin-top:8px;">
    <a href="${escapeHtml(opp.originalUrl)}" style="${STYLE.link}">공고 원문 보기 →</a>
  </div>
</div>`;
}

function htmlSection(title: string, items: Opportunity[]): string {
  if (items.length === 0) return "";
  return `<h2 style="${STYLE.h2}">${escapeHtml(title)} (${items.length}건)</h2>${items.map(htmlItem).join("")}`;
}

function htmlChanges(changes: OpportunityChange[]): string {
  if (changes.length === 0) return "";
  const rows = changes
    .map(
      (c) => `<div style="${STYLE.card}">
  <div style="font-weight:700;font-size:14px;">${escapeHtml(c.title)}</div>
  <div style="${STYLE.muted}">${escapeHtml(c.organization)}</div>
  <div style="font-size:13px;color:#b45309;margin-top:4px;">${c.changes.map(escapeHtml).join(" / ")}</div>
  <a href="${escapeHtml(c.originalUrl)}" style="${STYLE.link}">원문 확인 →</a>
</div>`,
    )
    .join("");
  return `<h2 style="${STYLE.h2}">정정·취소·마감 연장 (${changes.length}건)</h2>${rows}`;
}

export function renderHtml(data: BriefingData): string {
  const s = data.summary;
  const failedHtml = s.failedSources.length
    ? `<li style="color:#b91c1c;">수집 실패 소스: ${s.failedSources.map(escapeHtml).join(", ")}</li>`
    : `<li>모든 소스 정상 수집</li>`;

  const manual = getManualLinkSources()
    .map(
      (src) =>
        `<li><a href="${escapeHtml(src.baseUrl)}" style="${STYLE.link}">${escapeHtml(src.name)}</a> — ${escapeHtml(src.collectionMethod)}</li>`,
    )
    .join("");

  const runsHtml = data.runs
    .map(
      (run) =>
        `<li>${escapeHtml(run.sourceId)}: <strong>${run.status}</strong> — 수집 ${run.fetchedCount}건 · 신규 ${run.newCount}건 · 갱신 ${run.updatedCount}건${run.errorMessage ? ` · <span style="color:#b91c1c;">${escapeHtml(run.errorMessage)}</span>` : ""}</li>`,
    )
    .join("");

  return `<!doctype html>
<html lang="ko">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>다옴 업무기회 데일리 브리핑</title></head>
<body style="margin:0;padding:0;background:#f1f5f9;">
<div style="max-width:640px;margin:0 auto;padding:24px 16px;font-family:'Apple SD Gothic Neo','Malgun Gothic',sans-serif;">
  <div style="background:#0f766e;color:#fff;border-radius:12px 12px 0 0;padding:22px 24px;">
    <div style="font-size:11px;letter-spacing:0.08em;text-transform:uppercase;opacity:.75;">다옴법무사사무소</div>
    <div style="font-size:20px;font-weight:800;margin-top:6px;">업무기회 데일리 브리핑</div>
    <div style="font-size:13px;opacity:.85;margin-top:8px;">수집 기준시각: ${escapeHtml(data.generatedAtKst)} (KST)</div>
    <div style="font-size:12px;opacity:.75;margin-top:4px;">조회기간 ${escapeHtml(data.collectionWindow.from)} ~ ${escapeHtml(data.collectionWindow.to)}</div>
  </div>
  <div style="background:#ffffff;border-radius:0 0 12px 12px;padding:20px 24px;border:1px solid #e2e8f0;border-top:0;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 8px;border-collapse:separate;border-spacing:8px 0;">
      <tr>
        <td style="width:33%;background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:12px 10px;text-align:center;">
          <div style="font-size:11px;color:#64748b;">신규 수집</div>
          <div style="font-size:22px;font-weight:800;color:#0f172a;margin-top:4px;">${s.fetchedTotal}</div>
        </td>
        <td style="width:33%;background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:12px 10px;text-align:center;">
          <div style="font-size:11px;color:#64748b;">관련 후보</div>
          <div style="font-size:22px;font-weight:800;color:#0f172a;margin-top:4px;">${s.candidateTotal}</div>
        </td>
        <td style="width:33%;background:#fef2f2;border:1px solid #fecaca;border-radius:10px;padding:12px 10px;text-align:center;">
          <div style="font-size:11px;color:#b91c1c;">우선 검토</div>
          <div style="font-size:22px;font-weight:800;color:#b91c1c;margin-top:4px;">${s.priorityCount}</div>
        </td>
      </tr>
    </table>
    <ul style="font-size:14px;color:#334155;padding-left:18px;margin:12px 0 0;line-height:1.9;">
      <li>마감 임박(7일 이내) ${s.deadlineSoonCount}건 · 정정·취소·변경 ${s.changedCount}건</li>
      ${failedHtml}
    </ul>
    ${htmlSection("오늘 우선 검토", data.priorityItems)}
    ${htmlSection("직접 입찰 후보", data.directBidItems)}
    ${htmlSection("등기 수임 잠재정보", data.registrationLeads)}
    ${htmlSection("복대리·협업 후보", data.collaborationItems)}
    ${htmlSection("법률 강의·전문가 모집", data.lectureItems)}
    ${htmlSection("경매·공매·시장 참고정보", data.marketSignals)}
    ${htmlChanges(data.changedItems)}
    <h2 style="${STYLE.h2}">수동 확인 링크</h2>
    <ul style="font-size:13px;color:#475569;padding-left:18px;line-height:1.9;">${manual}</ul>
    <h2 style="${STYLE.h2}">수집 상태</h2>
    <ul style="font-size:13px;color:#475569;padding-left:18px;line-height:1.9;">${runsHtml}</ul>
    <div style="margin-top:20px;padding:12px 14px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;font-size:12px;color:#64748b;line-height:1.8;">
      본 브리핑은 후보를 알려주는 참고자료입니다. 참가자격·지역제한·마감일은 반드시 공고 원문에서 확인하세요.
      법무사 업무범위를 벗어난 공고는 “협업 필요”로 분류되며 단독 수임 대상이 아닙니다.
    </div>
  </div>
</div>
</body>
</html>`;
}

// ── 발송 ──

export type EmailResult = { sent: boolean; detail: string };

export async function sendBriefingEmail(data: BriefingData): Promise<EmailResult> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.BID_EMAIL_FROM?.trim() || process.env.INQUIRY_FROM_EMAIL?.trim();
  const to = process.env.BID_EMAIL_TO?.trim() || process.env.INQUIRY_TO_EMAIL?.trim();

  if (!apiKey || !from || !to) {
    return {
      sent: false,
      detail:
        "이메일 미발송 — RESEND_API_KEY / BID_EMAIL_FROM / BID_EMAIL_TO 환경변수를 설정하세요.",
    };
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: to.split(",").map((t) => t.trim()),
      subject: buildSubject(data),
      html: renderHtml(data),
      text: renderText(data),
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    return {
      sent: false,
      detail: `Resend 발송 실패 (HTTP ${res.status}): ${body.slice(0, 200)}`,
    };
  }
  return { sent: true, detail: `발송 완료 → ${maskEmail(to.split(",")[0])}` };
}
