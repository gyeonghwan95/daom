/**
 * 긴 문단을 문장 경계에서 나눈다(내용은 그대로, 문단만 나눔).
 * 모바일에서 300자 넘는 한 덩어리는 읽기 어려워 2~3문장 단위로 끊는다.
 */
export function splitLongParagraph(text: string, max = 280): string[] {
  const trimmed = text.trim();
  if (trimmed.length <= max) return [trimmed];
  const sentences = trimmed.split(/(?<=[.?!])\s+/).filter(Boolean);
  if (sentences.length < 2) return [trimmed];
  const chunks: string[] = [];
  let current = "";
  for (const sentence of sentences) {
    if (current && current.length + sentence.length + 1 > max) {
      chunks.push(current);
      current = sentence;
    } else {
      current = current ? `${current} ${sentence}` : sentence;
    }
  }
  if (current) chunks.push(current);
  // 마지막 조각이 너무 짧으면 앞 문단에 붙인다
  if (chunks.length > 1 && chunks[chunks.length - 1].length < 60) {
    const last = chunks.pop()!;
    chunks[chunks.length - 1] = `${chunks[chunks.length - 1]} ${last}`;
  }
  return chunks;
}
