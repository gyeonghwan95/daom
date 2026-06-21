export function formatNaverBlogDate(pubDate: string): string {
  const parsed = new Date(pubDate);
  if (Number.isNaN(parsed.getTime())) return pubDate;

  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(parsed);
}

export function formatFeedFetchedAt(fetchedAt: string | null): string {
  if (!fetchedAt) return "";
  const parsed = new Date(fetchedAt);
  if (Number.isNaN(parsed.getTime())) return fetchedAt;
  return parsed.toLocaleString("ko-KR");
}
