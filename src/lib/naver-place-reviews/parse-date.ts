/** 네이버 리뷰 날짜 (예: 25.12.19.금, 6.21.일) → YYYY-MM-DD */
export function parseNaverReviewDateLabel(label: string): string {
  const trimmed = label.trim();
  const parts = trimmed.split(".");
  if (parts.length < 2) return "";

  const first = Number.parseInt(parts[0], 10);
  const second = Number.parseInt(parts[1], 10);
  const thirdRaw = parts[2] ?? "";
  const third = Number.parseInt(thirdRaw, 10);

  let year: number;
  let month: number;
  let day: number;

  if (first > 12) {
    year = first < 100 ? 2000 + first : first;
    month = second;
    day = Number.isNaN(third) ? 1 : third;
  } else {
    year = new Date().getFullYear();
    month = first;
    day = second;
  }

  if (Number.isNaN(year) || Number.isNaN(month) || Number.isNaN(day)) return "";

  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}
