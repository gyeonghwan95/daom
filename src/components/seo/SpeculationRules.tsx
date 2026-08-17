import { PREFETCH_CHAMPION_PATHS } from "@/lib/seo/inflow-policy";

function encodePath(path: string): string {
  return path
    .split("/")
    .map((segment) => (segment ? encodeURIComponent(segment) : segment))
    .join("/");
}

/**
 * 대표 URL을 미리 가져옵니다. 검색 유입 후 다음 클릭이 빨라집니다.
 * 새 URL을 만들지 않습니다.
 */
export function SpeculationRules() {
  const encoded = PREFETCH_CHAMPION_PATHS.map(encodePath);
  const payload = {
    prefetch: [
      {
        source: "document",
        where: {
          and: [
            { href_matches: "/*" },
            { not: { href_matches: "/admin/*" } },
            { not: { href_matches: "/api/*" } },
          ],
        },
        eagerness: "moderate",
      },
    ],
    prerender: [
      {
        urls: encoded,
        eagerness: "conservative",
      },
    ],
  };

  return (
    <script
      type="speculationrules"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }}
    />
  );
}
