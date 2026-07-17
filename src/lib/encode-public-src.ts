/**
 * public 이미지 경로의 한글 파일명을 percent-encode합니다.
 * Next.js가 priority 이미지를 HTTP Link preload 헤더에 넣을 때
 * 한글이 포함되면 Edge Runtime ByteString 오류가 발생합니다.
 */
export function encodePublicSrc(src: string): string {
  if (!src || src.startsWith("data:") || src.startsWith("blob:")) {
    return src;
  }

  if (src.startsWith("http://") || src.startsWith("https://")) {
    try {
      const url = new URL(src);
      url.pathname = url.pathname
        .split("/")
        .map((segment) => encodePathSegment(segment))
        .join("/");
      return url.toString();
    } catch {
      return src;
    }
  }

  const queryIndex = src.indexOf("?");
  const path = queryIndex >= 0 ? src.slice(0, queryIndex) : src;
  const query = queryIndex >= 0 ? src.slice(queryIndex) : "";
  const encodedPath = path
    .split("/")
    .map((segment) => encodePathSegment(segment))
    .join("/");
  return `${encodedPath}${query}`;
}

function encodePathSegment(segment: string): string {
  if (!segment) return segment;
  try {
    return encodeURIComponent(decodeURIComponent(segment));
  } catch {
    return encodeURIComponent(segment);
  }
}
