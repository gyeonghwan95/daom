import { buildSeoTitle } from "@/lib/seo/seo-title";

const TITLE_WITH_BRAND_MAX = 38;
const TITLE_MAX = 40;

/** 구분자(｜ | — ·)나 공백에서 max자 안쪽으로 자른다. 단어 중간에서 끊거나 "…"를 붙이지 않는다. */
function cutAtBoundary(text: string, max: number): string {
  if (text.length <= max) return text;
  const head = text.slice(0, max + 1);
  for (const sep of ["｜", " | ", " — ", " - ", "|", "—", ", ", "·"]) {
    const at = head.lastIndexOf(sep);
    if (at >= 10) return text.slice(0, at).trim();
  }
  const space = head.lastIndexOf(" ");
  const cut = (space >= 10 ? text.slice(0, space) : text.slice(0, max)).trim();
  // 여는 따옴표만 남으면 그 앞에서 끊는다
  for (const [open, close] of [["“", "”"], ["‘", "’"], ["[", "]"], ["(", ")"]]) {
    const at = cut.lastIndexOf(open);
    if (at > cut.lastIndexOf(close) && at >= 10) return cut.slice(0, at).trim();
  }
  return cut;
}

/**
 * 메타 타이틀 — 브랜드 접미사만 쓰고, 대표 검색어로 길이를 채우지 않는다.
 * 브랜드를 붙여 38자를 넘으면 브랜드를 뺀다(네이버는 사이트 이름을 검색 결과에 따로 보여 준다).
 * 그래도 40자를 넘으면 구분자·공백에서 자른다. 예전처럼 20자에서 자르고 "…"를 붙이면
 * 「전국 상속등기 법무사｜부산 방문 없이…」처럼 검색어가 잘린 제목이 나왔다(2026-11-08 색인 페이지 262개).
 */
export function buildMetaTitle(primary: string): string {
  const titled = buildSeoTitle(primary);
  if (titled.length <= TITLE_WITH_BRAND_MAX) {
    return titled;
  }
  return cutAtBoundary(primary.trim(), TITLE_MAX);
}

/** 120자 안에서 마지막 문장 끝(다. / . / ?)에서 자른다. 문장 끝이 너무 앞이면 공백에서 자르고 "…"를 붙인다. */
function cutAtSentence(text: string, max: number): string {
  const head = text.slice(0, max);
  const ends = [...head.matchAll(/[.?!。](?=\s|$)/g)].map((m) => (m.index ?? 0) + 1);
  const last = ends.length ? ends[ends.length - 1] : 0;
  if (last >= 70) return head.slice(0, last).trim();
  const space = head.lastIndexOf(" ", max - 1);
  return `${head.slice(0, space > 60 ? space : max - 1).trim()}…`;
}

/** 메타 디스크립션 80~120자 내외 */
export function buildMetaDescription(
  base: string,
  suffix = " 해운대·센텀 다옴법무사사무소에서 전화·카카오톡·방문(예약) 상담이 가능합니다.",
): string {
  const trimmed = base.trim().replace(/\s+/g, " ");
  if (trimmed.length >= 80 && trimmed.length <= 120) {
    return trimmed;
  }
  if (trimmed.length > 120) {
    return cutAtSentence(trimmed, 120);
  }
  const combined = `${trimmed}${suffix}`;
  if (combined.length <= 120) {
    return combined;
  }
  // 80자보다 짧은 설명에 사무소 문구를 붙이면 넘칠 때는 설명만 그대로 쓴다(예전에는 설명 끝을 잘라 "…"를 붙였다)
  return trimmed;
}
