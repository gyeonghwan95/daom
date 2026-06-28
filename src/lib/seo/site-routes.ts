import { listAllPagePaths } from "@/lib/pageData/registry";
import { normalizeRouteSlug } from "@/lib/seo/slug";
import { getAllKoreanLandingSlugs as collectKoreanSlugs } from "@/lib/pageData/korean-slugs";

export { normalizeRouteSlug } from "@/lib/seo/slug";

export function getAllKoreanLandingSlugs(): string[] {
  return collectKoreanSlugs();
}

export function getKoreanSlugStaticParams(): { landingSlug: string }[] {
  return getAllKoreanLandingSlugs().map((landingSlug) => ({ landingSlug }));
}

/** sitemap·검증용 전체 공개 경로 (pageData 레지스트리 기준) */
export function getAllPublishedPaths(): string[] {
  return listAllPagePaths();
}

/** out/ 폴더에서 기대하는 상대 경로 (index.html 또는 .html) */
export function pathToOutCandidates(path: string): string[] {
  if (path === "/") {
    return ["index.html"];
  }

  const segments = path.split("/").filter(Boolean);
  const encodedSegments = segments.map((segment) =>
    encodeURIComponent(normalizeRouteSlug(segment)),
  );
  const decodedSegments = segments.map((segment) => normalizeRouteSlug(segment));

  const bases = [
    [...decodedSegments].join("/"),
    [...encodedSegments].join("/"),
  ];

  const uniqueBases = [...new Set(bases)];
  const candidates: string[] = [];

  for (const base of uniqueBases) {
    candidates.push(`${base}.html`);
    candidates.push(pathJoin(base, "index.html"));
  }

  return [...new Set(candidates)];
}

function pathJoin(...parts: string[]): string {
  return parts.join("/").replace(/\\/g, "/");
}
