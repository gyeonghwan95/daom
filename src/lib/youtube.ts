/** YouTube watch / youtu.be / embed URL → video ID */
export function extractYoutubeId(url: string): string | null {
  const trimmed = url.trim();
  if (!trimmed) return null;

  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;

  try {
    const parsed = new URL(trimmed);
    const host = parsed.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      const id = parsed.pathname.slice(1).split("/")[0];
      return id && id.length === 11 ? id : null;
    }

    if (host === "youtube.com" || host === "m.youtube.com") {
      const fromQuery = parsed.searchParams.get("v");
      if (fromQuery && fromQuery.length === 11) return fromQuery;

      const embedMatch = parsed.pathname.match(
        /^\/(?:embed|shorts|live)\/([a-zA-Z0-9_-]{11})/,
      );
      if (embedMatch?.[1]) return embedMatch[1];
    }
  } catch {
    return null;
  }

  return null;
}

function parseStartSeconds(value: string | null): number | undefined {
  if (!value) return undefined;
  const trimmed = value.trim();
  const secondsOnly = trimmed.match(/^(\d+)s?$/);
  if (secondsOnly) return Number(secondsOnly[1]);
  return undefined;
}

/** URL에서 video ID와 시작 시점(t=33s 등) 추출 */
export function parseYoutubeUrl(
  url: string,
): { videoId: string; startSeconds?: number; watchUrl: string } | null {
  const trimmed = url.trim();
  if (!trimmed) return null;

  const videoId = extractYoutubeId(trimmed);
  if (!videoId) return null;

  let startSeconds: number | undefined;
  try {
    const parsed = new URL(trimmed);
    startSeconds =
      parseStartSeconds(parsed.searchParams.get("t")) ??
      parseStartSeconds(parsed.searchParams.get("start"));
  } catch {
    /* plain video ID */
  }

  return {
    videoId,
    startSeconds,
    watchUrl: trimmed.startsWith("http") ? trimmed : getYoutubeWatchUrl(videoId),
  };
}

export function getYoutubeEmbedUrl(
  videoId: string,
  startSeconds?: number,
): string {
  const params = new URLSearchParams({
    rel: "0",
    modestbranding: "1",
  });
  if (startSeconds && startSeconds > 0) {
    params.set("start", String(startSeconds));
  }
  return `https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`;
}

export function getYoutubeWatchUrl(videoId: string): string {
  return `https://www.youtube.com/watch?v=${videoId}`;
}
