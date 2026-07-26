import { createHash } from "node:crypto";

/** Asia/Seoul은 서머타임이 없으므로 고정 +9h 오프셋으로 계산한다. */
const KST_OFFSET_MS = 9 * 60 * 60 * 1000;

export function nowKst(): Date {
  return new Date(Date.now() + KST_OFFSET_MS);
}

/** KST 기준 YYYY-MM-DD */
export function kstDateString(d: Date = nowKst()): string {
  return d.toISOString().slice(0, 10);
}

/** KST 기준 "YYYY-MM-DD HH:mm" */
export function kstDateTimeString(d: Date = nowKst()): string {
  return d.toISOString().slice(0, 16).replace("T", " ");
}

/** 나라장터 조회용 YYYYMMDDHHmm (KST) */
export function toG2bDateTime(d: Date): string {
  return d.toISOString().slice(0, 16).replace(/[-T:]/g, "");
}

/**
 * 나라장터 응답의 날짜 문자열을 "YYYY-MM-DD HH:mm" (KST 표기)로 정규화.
 * "2026-07-25 14:00", "202607251400", "2026/07/25 14:00" 등을 수용.
 * 해석 불가하면 undefined.
 */
export function parseNoticeDate(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const digits = value.replace(/\D/g, "");
  if (digits.length < 8) return undefined;
  const y = digits.slice(0, 4);
  const mo = digits.slice(4, 6);
  const da = digits.slice(6, 8);
  const hh = digits.length >= 10 ? digits.slice(8, 10) : "00";
  const mi = digits.length >= 12 ? digits.slice(10, 12) : "00";
  if (Number(mo) < 1 || Number(mo) > 12 || Number(da) < 1 || Number(da) > 31) {
    return undefined;
  }
  return `${y}-${mo}-${da} ${hh}:${mi}`;
}

/** "YYYY-MM-DD HH:mm" (KST 표기) → epoch ms */
export function kstStringToEpoch(s: string): number | undefined {
  const m = s.match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})/);
  if (!m) return undefined;
  return Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5]) - KST_OFFSET_MS;
}

/** 마감일까지 남은 일수 (KST 기준, 소수점 버림). 마감이 지났으면 음수. */
export function daysUntil(deadline: string | undefined, now: Date = new Date()): number | undefined {
  if (!deadline) return undefined;
  const epoch = kstStringToEpoch(deadline);
  if (epoch === undefined) return undefined;
  return Math.floor((epoch - now.getTime()) / (24 * 60 * 60 * 1000));
}

/**
 * 금액 파싱. 확인 불가면 undefined (0으로 채우지 않는다).
 */
export function parseAmount(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value) && value > 0) return value;
  if (typeof value !== "string") return undefined;
  const cleaned = value.replace(/[,\s원]/g, "");
  if (!/^\d+(\.\d+)?$/.test(cleaned)) return undefined;
  const n = Number(cleaned);
  return n > 0 ? n : undefined;
}

export function formatAmount(n: number | undefined): string {
  if (n === undefined) return "금액 미확인";
  if (n >= 100_000_000) {
    const eok = n / 100_000_000;
    return `${eok % 1 === 0 ? eok : eok.toFixed(1)}억원`;
  }
  if (n >= 10_000) return `${Math.round(n / 10_000).toLocaleString("ko-KR")}만원`;
  return `${n.toLocaleString("ko-KR")}원`;
}

export function sha256(input: string): string {
  return createHash("sha256").update(input, "utf8").digest("hex");
}

/** HTML 이메일 escaping — 공고 제목·기관명 등 외부 텍스트는 반드시 통과시킨다. */
export function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** 로그용 이메일 마스킹: ab****@domain */
export function maskEmail(email: string): string {
  const at = email.indexOf("@");
  if (at <= 0) return "***";
  const local = email.slice(0, at);
  return `${local.slice(0, 2)}****@${email.slice(at + 1)}`;
}

/** 로그용 키 마스킹 — API 키가 로그에 노출되지 않도록 한다. */
export function maskSecret(value: string): string {
  if (value.length <= 8) return "****";
  return `${value.slice(0, 4)}…${value.slice(-2)}`;
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
