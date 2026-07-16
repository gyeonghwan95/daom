/** 검색어·인덱스 필드 정규화 (공백·대소문자 무시) */
export function normalizeSearchText(text: string): string {
  return text
    .normalize("NFC")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** 띄어쓰기 제거 비교값 */
export function compactSearchText(text: string): string {
  return normalizeSearchText(text).replace(/\s+/g, "");
}

/** 토큰 분리 (빈 토큰 제거) */
export function tokenizeSearchQuery(query: string): string[] {
  const normalized = normalizeSearchText(query);
  if (!normalized) return [];
  return normalized.split(" ").filter(Boolean);
}

export function normalizeQueryInput(raw: string): string {
  return raw.replace(/\s+/g, " ").trim();
}
