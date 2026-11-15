/**
 * 받침에 맞는 조사를 붙인다 — 템플릿이 "상속등기을", "지급명령를"처럼 조사를 고정해 붙이던 문제(2026-11-15).
 *
 *   josa("상속등기", "을/를") → "상속등기를"
 *   josa("지급명령", "을/를") → "지급명령을"
 *   josa("부산(해운대)", "과/와") → "부산(해운대)와"  // 괄호·문장부호는 건너뛰고 마지막 글자를 본다
 *
 * 마지막 글자가 숫자면 읽는 소리(일·삼·육·칠·팔·십·백·천은 받침 있음)로, 영문이면 받침 없음으로 본다.
 * 검사: node scripts/check-korean-particles.mjs
 */
export type JosaPair = "을/를" | "이/가" | "은/는" | "과/와" | "으로/로";

const DIGIT_BATCHIM: Record<string, boolean> = {
  "0": true, "1": true, "2": false, "3": true, "4": false,
  "5": false, "6": true, "7": true, "8": true, "9": false,
};

function lastSound(word: string): { batchim: boolean; rieul: boolean } {
  const trimmed = word.replace(/[\s)\]}」』"'’”.,·…]+$/u, "");
  const ch = trimmed.slice(-1);
  if (!ch) return { batchim: false, rieul: false };
  const code = ch.charCodeAt(0) - 0xac00;
  if (code >= 0 && code <= 11171) {
    const jong = code % 28;
    return { batchim: jong !== 0, rieul: jong === 8 };
  }
  if (ch in DIGIT_BATCHIM) return { batchim: DIGIT_BATCHIM[ch], rieul: ch === "1" || ch === "7" || ch === "8" };
  return { batchim: false, rieul: false };
}

export function josa(word: string, pair: JosaPair): string {
  const { batchim, rieul } = lastSound(word);
  const [withBatchim, withoutBatchim] = pair.split("/") as [string, string];
  if (pair === "으로/로") return word + (batchim && !rieul ? "으로" : "로");
  return word + (batchim ? withBatchim : withoutBatchim);
}
