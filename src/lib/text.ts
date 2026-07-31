/** 미리보기용 짧은 텍스트. maxLength 초과 시 말줄임표 추가. */
export function truncateWithEllipsis(text: string, maxLength: number): string {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (normalized.length <= maxLength) return normalized;
  return `${normalized.slice(0, maxLength)}...`;
}
