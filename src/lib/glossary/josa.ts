/** 한국어 조사 선택. 받침 있으면 은/이/과/을, 없으면 는/가/와/를. */

function lastHangulCode(text: string): number | null {
  const chars = [...text.replace(/\s+/g, "")];
  for (let i = chars.length - 1; i >= 0; i -= 1) {
    const code = chars[i].codePointAt(0);
    if (code && code >= 0xac00 && code <= 0xd7a3) return code;
  }
  return null;
}

function hasBatchim(text: string): boolean {
  const code = lastHangulCode(text);
  if (code == null) return false;
  return (code - 0xac00) % 28 !== 0;
}

export function josa(word: string, pair: "은/는" | "이/가" | "과/와" | "을/를" | "으로/로"): string {
  const [withBatchim, without] = pair.split("/") as [string, string];
  if (pair === "으로/로") {
    const code = lastHangulCode(word);
    if (code == null) return `${word}${without}`;
    const jong = (code - 0xac00) % 28;
    // 받침 없음 또는 ㄹ 받침 → 로
    if (jong === 0 || jong === 8) return `${word}${without}`;
    return `${word}${withBatchim}`;
  }
  return `${word}${hasBatchim(word) ? withBatchim : without}`;
}
