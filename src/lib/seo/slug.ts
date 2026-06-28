/** URL·파일시스템 slug 정규화 (한글·퍼센트 인코딩 통일) */
export function normalizeRouteSlug(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return trimmed;

  let decoded = trimmed;
  try {
    if (/%[0-9A-Fa-f]{2}/.test(trimmed)) {
      decoded = decodeURIComponent(trimmed);
    }
  } catch {
    decoded = trimmed;
  }

  return decoded.normalize("NFC");
}
