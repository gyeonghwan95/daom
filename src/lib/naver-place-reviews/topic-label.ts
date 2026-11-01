/** 후기 카드 위에 붙이는 업무 주제 — 본문에 나온 말로만 고른다(지어내지 않음). */
export function reviewTopicLabel(body: string): string {
  if (/상속/.test(body)) return "상속등기";
  if (/증여/.test(body)) return "증여등기";
  if (/매매/.test(body)) return "매매등기";
  if (/전세|보증금/.test(body)) return "전세·보증금";
  if (/부동산/.test(body)) return "부동산 상담";
  if (/비용/.test(body)) return "비용 설명";
  return "상담";
}

/** 정렬 키(YYYY-MM-DD…) → "YYYY.MM" */
export function reviewMonthLabel(sortKey: string): string {
  const [y, m] = sortKey.split("-");
  return y && m ? `${y}.${m}` : sortKey;
}
