/**
 * 카드에 보여 줄 짧은 요약을 만든다.
 *
 * 왜: 사례·글 카드가 검색용 설명문(description)을 CSS line-clamp로 잘라 보여 줘서
 * "사업 채무를 남기고 돌아가신 부친의 상속을 배우자·자녀…"처럼 문장 중간에서 끊기고,
 * 끝에는 "다옴법무사사무소 안윤정 법무사 실무 사례." 같은 검색용 꼬리 문장이 붙어 있었다(2026-11-15 화면 점검).
 *
 * 규칙
 * 1. 사무소 이름이 들어간 홍보·꼬리 문장은 뺀다(카드 안에서는 정보가 없다). 그 문장밖에 없으면 남긴다.
 * 2. maxChars 안에 들어가는 앞 문장들만 통째로 쓴다 — 문장 중간에서 자르지 않는다.
 * 3. 첫 문장 하나가 maxChars보다 길 때만 낱말 경계에서 자르고 "…"를 붙인다.
 */
const BRAND_RE = /다옴법무사사무소|다옴 법무사/u;

export function cardSummary(text: string | undefined | null, maxChars: number): string {
  const source = (text ?? "").replace(/\s+/g, " ").trim();
  if (!source) return "";

  // 마침표·물음표·느낌표 뒤에 공백이 올 때만 문장 끝으로 본다("3.5%" 같은 숫자는 나누지 않는다)
  const all = source.split(/(?<=[.!?])\s+/u).map((s) => s.trim()).filter(Boolean);
  const content = all.filter((s) => !BRAND_RE.test(s));
  const sentences = content.length ? content : all;

  let out = "";
  for (const sentence of sentences) {
    const next = out ? `${out} ${sentence}` : sentence;
    if (next.length > maxChars) break;
    out = next;
  }
  if (out) return out;

  // 첫 문장부터 너무 길다 — 낱말 경계에서 자르고 말줄임
  const first = sentences[0] ?? source;
  const cut = first.slice(0, maxChars - 1);
  const boundary = cut.lastIndexOf(" ");
  const trimmed = (boundary >= maxChars * 0.6 ? cut.slice(0, boundary) : cut).replace(/[\s,·(—-]+$/u, "");
  return `${trimmed}…`;
}
