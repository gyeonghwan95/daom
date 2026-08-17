/**
 * 「부산 법무사」 상위 후보 URL의 랭킹 신호 대조 (읽기 전용)
 */
import { getInflowItemsForPath } from "../src/lib/seo/inflow-policy";
import { getCanonicalUrl, HOME_METADATA_TITLE, HOME_METADATA_DESCRIPTION } from "../src/lib/seo/metadata";
import { resolveKoreanLandingPageData } from "../src/lib/pageData/resolvers";
import {
  busanLawyerHubDescription,
  busanLawyerHubH1,
  busanLawyerHubMetaTitle,
} from "../src/lib/local-landing/busan-lawyer-hub-content";

const PATHS = [
  "/",
  "/부산법무사",
  "/부산법무사추천",
  "/부산법무사비교",
  "/부산법무사상담",
  "/부산법무사비용",
  "/부산법무사무소",
  "/해운대법무사",
  "/센텀법무사",
] as const;

function pick(html: string, re: RegExp): string {
  return html.match(re)?.[1]?.replace(/\s+/g, " ").trim() ?? "";
}

function count(html: string, needle: string): number {
  let n = 0;
  let i = 0;
  while (true) {
    const f = html.indexOf(needle, i);
    if (f === -1) break;
    n += 1;
    i = f + needle.length;
  }
  return n;
}

async function fetchHtml(base: string, path: string): Promise<{ ok: boolean; status: number; html: string }> {
  const url =
    path === "/"
      ? `${base}/`
      : `${base}/${path
          .split("/")
          .filter(Boolean)
          .map((s) => encodeURIComponent(s))
          .join("/")}`;
  try {
    const res = await fetch(url, { redirect: "manual" });
    const html = await res.text();
    return { ok: res.ok, status: res.status, html };
  } catch (e) {
    return { ok: false, status: 0, html: String(e) };
  }
}

function analyze(path: string, html: string) {
  const title = pick(html, /<title>([^<]*)<\/title>/i);
  const desc = pick(html, /<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i)
    || pick(html, /<meta[^>]+content=["']([^"']*)["'][^>]+name=["']description["']/i);
  const canonical = pick(html, /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']*)["']/i)
    || pick(html, /<link[^>]+href=["']([^"']*)["'][^>]+rel=["']canonical["']/i);
  const robots = pick(html, /<meta[^>]+name=["']robots["'][^>]+content=["']([^"']*)["']/i);
  const h1 = pick(html, /<h1[^>]*>([\s\S]*?)<\/h1>/i).replace(/<[^>]+>/g, "");
  const keywords = pick(html, /<meta[^>]+name=["']keywords["'][^>]+content=["']([^"']*)["']/i);
  return {
    path,
    statusSignals: {
      title,
      h1,
      description: desc,
      canonical,
      robots: robots || "(default index,follow)",
      keywordsMeta: keywords ? "present" : "absent",
    },
    phraseHits: {
      queryInHtml: count(html, "부산 법무사"),
      searchLabel: count(html, "이런 검색"),
      railHeading: count(html, "이어서 확인하면 좋은 안내"),
    },
    inflow: getInflowItemsForPath(path).map((i) => ({
      href: i.href,
      label: i.label,
      searchPhraseInData: i.searchPhrase ?? null,
    })),
  };
}

async function probeBase(candidates: string[]): Promise<string | null> {
  for (const base of candidates) {
    const r = await fetchHtml(base, "/");
    if (r.ok && r.html.includes("<title>")) return base;
  }
  return null;
}

async function main() {
  const localBase = await probeBase([
    "http://localhost:3001",
    "http://localhost:3000",
  ]);
  const liveBase = "https://xn--2j1br1na42lvxja38mk8r.kr";

  const hub = resolveKoreanLandingPageData("부산법무사");
  const lock = {
    path: "/부산법무사",
    title: busanLawyerHubMetaTitle,
    h1: busanLawyerHubH1,
    description: busanLawyerHubDescription,
    pageDataMatch:
      hub?.metaTitle === busanLawyerHubMetaTitle &&
      hub?.h1 === busanLawyerHubH1 &&
      hub?.metaDescription === busanLawyerHubDescription,
    homeTitle: HOME_METADATA_TITLE,
    homeDescription: HOME_METADATA_DESCRIPTION,
    homeCanonical: getCanonicalUrl("/"),
    hubCanonical: getCanonicalUrl("/부산법무사"),
  };

  const local: Record<string, unknown> = {};
  if (localBase) {
    for (const path of PATHS) {
      const r = await fetchHtml(localBase, path);
      local[path] = r.ok ? analyze(path, r.html) : { path, error: r.status };
    }
  }

  const live: Record<string, unknown> = {};
  for (const path of ["/", "/부산법무사"] as const) {
    const r = await fetchHtml(liveBase, path);
    live[path] = r.ok ? analyze(path, r.html) : { path, error: r.status, hint: r.html.slice(0, 120) };
  }

  const report = {
    generatedAt: new Date().toISOString(),
    localBase,
    liveBase,
    lock,
    local,
    live,
  };
  console.log(JSON.stringify(report, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
