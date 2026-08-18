/**
 * 「부산 법무사」 잠식 완화가 다른 보호 URL의
 * title / H1 / description / canonical / robots 를 건드렸는지 검증.
 * 로컬(변경 후) vs 운영(현재 색인본) HTML을 한 줄씩 대조한다.
 */
import { getPageDataByPath } from "@/lib/pageData/registry";
import { createPageMetadata, getCanonicalUrl, HOME_METADATA_TITLE } from "@/lib/seo/metadata";
import {
  INFLOW_RAIL_ALLOWLIST,
  isBusanLawyerExactQuery,
  sanitizePageKeywords,
} from "@/lib/seo/champion-query";
import { getInflowItemsForPath } from "@/lib/seo/inflow-policy";
import {
  busanLawyerHubDescription,
  busanLawyerHubH1,
  busanLawyerHubMetaTitle,
} from "@/lib/local-landing/busan-lawyer-hub-content";
import { registryHubTopic } from "@/lib/local-landing/registry-hub-content";
import protectedPages from "../config/seo-protected-pages.json";
import queryChampions from "../config/seo-query-champions.json";

type Verdict = "safe" | "watch" | "risk";

type Probe = {
  path: string;
  query: string;
  role: string;
};

const KEEP_PHRASES = [
  "부산 등기 법무사",
  "부산 법무사 추천",
  "부산 법무사 상담",
  "부산 법무사 비교",
  "부산 법무사 비용",
  "해운대 법무사",
  "센텀 법무사",
  "부산 상속 법무사",
  "부산 상속등기",
  "부산 법인 법무사",
  "부산 법인등기",
  "부산 개인회생",
  "부산 부동산등기",
  "부산 상속포기",
  "부산 법률 상담",
];

const EXTRA_PATHS: Probe[] = [
  { path: "/", query: "(홈 브랜드)", role: "home" },
  { path: "/부산등기법무사추천", query: "부산 등기 법무사 추천", role: "registry-spoke" },
  { path: "/부산법률상담", query: "부산 법률 상담", role: "consultation-spoke" },
  { path: "/상담", query: "부산 법무사 상담", role: "consultation-alias" },
  { path: "/부산소유권이전등기", query: "부산 소유권이전등기", role: "registry-spoke" },
  { path: "/민락동법무사", query: "(동 랜딩 샘플)", role: "thin-dong" },
  { path: "/업무사례/부산법무사", query: "(사례 허브)", role: "case-hub" },
];

function collectProbes(): Probe[] {
  const out: Probe[] = [];
  const seen = new Set<string>();
  const add = (path: string, query: string, role: string) => {
    if (!path.startsWith("/")) return;
    const key = `${path}::${query}`;
    if (seen.has(key)) return;
    seen.add(key);
    out.push({ path, query, role });
  };

  for (const [key, champ] of Object.entries(protectedPages.champions)) {
    add(champ.path, champ.role, `protected-champion:${key}`);
  }
  for (const q of protectedPages.queries) {
    if (!q.protected) continue;
    for (const url of q.candidateUrls ?? []) add(url, q.query, "protected-candidate");
    if (q.targetChampion) add(q.targetChampion, q.query, "protected-target");
  }
  for (const [query, spec] of Object.entries(queryChampions.queries)) {
    add(spec.primary, query, "query-primary");
    for (const url of spec.supporting ?? []) add(url, query, "query-supporting");
  }
  for (const extra of EXTRA_PATHS) add(extra.path, extra.query, extra.role);
  return out;
}

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

function encodePath(path: string): string {
  if (path === "/") return "/";
  return `/${path
    .split("/")
    .filter(Boolean)
    .map((s) => encodeURIComponent(s))
    .join("/")}`;
}

async function fetchHtml(
  base: string,
  path: string,
): Promise<{ ok: boolean; status: number; html: string }> {
  const url = `${base}${encodePath(path)}`;
  try {
    const res = await fetch(url, { redirect: "manual" });
    const html = await res.text();
    return { ok: res.ok, status: res.status, html };
  } catch (e) {
    return { ok: false, status: 0, html: String(e) };
  }
}

function parseHtml(html: string) {
  const title = pick(html, /<title>([^<]*)<\/title>/i);
  const desc =
    pick(html, /<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i) ||
    pick(html, /<meta[^>]+content=["']([^"']*)["'][^>]+name=["']description["']/i);
  const canonical =
    pick(html, /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']*)["']/i) ||
    pick(html, /<link[^>]+href=["']([^"']*)["'][^>]+rel=["']canonical["']/i);
  const robots = pick(html, /<meta[^>]+name=["']robots["'][^>]+content=["']([^"']*)["']/i);
  const h1 = pick(html, /<h1[^>]*>([\s\S]*?)<\/h1>/i).replace(/<[^>]+>/g, "");
  const keywords = pick(html, /<meta[^>]+name=["']keywords["'][^>]+content=["']([^"']*)["']/i);
  const noindex = /noindex/i.test(robots);
  return {
    title,
    h1,
    desc,
    canonical,
    robots: robots || "(default index,follow)",
    keywords,
    noindex,
    railHeading: count(html, "이어서 확인하면 좋은 안내"),
    searchLabel: count(html, "이런 검색"),
    exactQueryHits: count(html, "부산 법무사"),
    footerExact: html.includes(">부산 법무사</") || html.includes(">부산 법무사<"),
  };
}

function ownQueryPresent(query: string, title: string, h1: string): boolean {
  if (query.startsWith("BUSAN_") || query.startsWith("INHERITANCE") || query.startsWith("RENUNCIATION")) {
    return true;
  }
  if (query.startsWith("(")) return true;
  const blob = `${title} ${h1}`;
  const compactQuery = query.replace(/\s+/g, "");
  const compactBlob = blob.replace(/\s+/g, "");
  if (query === "부산 법무사" || query === "부산법무사") {
    return title.startsWith("부산 법무사 |") || h1.startsWith("부산 법무사,");
  }
  return blob.includes(query) || compactBlob.includes(compactQuery);
}

async function probeBase(candidates: string[]): Promise<string | null> {
  for (const base of candidates) {
    const r = await fetchHtml(base, "/");
    if (r.ok && r.html.includes("<title>")) return base;
  }
  return null;
}

async function main() {
  const probes = collectProbes();
  const uniquePaths = [...new Set(probes.map((p) => p.path))];

  const sanitizer = KEEP_PHRASES.map((phrase) => ({
    phrase,
    kept: !isBusanLawyerExactQuery(phrase),
  }));
  const sanitizerFails = [
    ...sanitizer.filter((s) => !s.kept).map((s) => `오탐 제거: ${s.phrase}`),
    ...["부산 법무사", "부산법무사"]
      .filter((p) => !isBusanLawyerExactQuery(p))
      .map((p) => `미검출: ${p}`),
  ];

  const pageRows = uniquePaths.map((path) => {
    const page = path === "/" ? null : getPageDataByPath(path);
    const relatedQueries = probes.filter((p) => p.path === path).map((p) => p.query);
    const railOn = getInflowItemsForPath(path).length > 0;
    const allowlisted = INFLOW_RAIL_ALLOWLIST.has(path);
    const rawKw = page?.primaryKeywords ?? [];
    const sanitized = sanitizePageKeywords(path, rawKw) ?? [];
    const stillExact = sanitized.some((k) => isBusanLawyerExactQuery(k));
    const topicalKept = rawKw
      .filter((k) => !isBusanLawyerExactQuery(k))
      .every((k) => sanitized.includes(k));

    const title = path === "/" ? HOME_METADATA_TITLE : (page?.metaTitle ?? "(missing)");
    const h1 = path === "/" ? "(home)" : (page?.h1 ?? "(missing)");
    const desc = path === "/" ? "(home)" : (page?.metaDescription ?? "");
    const own = relatedQueries.every((q) => ownQueryPresent(q, title, h1) || q.startsWith("(") || q.includes("_"));

    let verdict: Verdict = "safe";
    const notes: string[] = [];
    if (!page && path !== "/") {
      verdict = "watch";
      notes.push("pageData 없음");
    }
    if (path === "/부산법무사") {
      if (title !== busanLawyerHubMetaTitle) {
        verdict = "risk";
        notes.push("챔피언 title 불일치");
      }
      if (h1 !== busanLawyerHubH1) {
        verdict = "risk";
        notes.push("챔피언 H1 불일치");
      }
      if (desc !== busanLawyerHubDescription) {
        verdict = "risk";
        notes.push("챔피언 description 불일치");
      }
      if (!stillExact) notes.push("챔피언 exact 키워드 유지");
    } else if (stillExact) {
      verdict = "risk";
      notes.push("비챔피언에 exact 「부산 법무사」 키워드 잔존");
    }
    if (path === "/부산등기법무사") {
      if (title !== registryHubTopic.metaTitle || h1 !== registryHubTopic.h1) {
        verdict = "risk";
        notes.push("등기 허브 title/H1 변경");
      }
    }
    if (allowlisted && !railOn) {
      verdict = "risk";
      notes.push("허용 목록인데 레일 없음");
    }
    if (!allowlisted && railOn) {
      verdict = "risk";
      notes.push("비허용인데 레일 남음");
    }
    if (!allowlisted && path !== "/") {
      notes.push("유입 레일 제거(8/17 신규 블록). title/H1은 데이터 불변");
    }
    if (!own && verdict === "safe") {
      notes.push("고유 검색어가 title/H1에 없음(원래부터일 수 있음)");
    }
    if (!topicalKept) {
      verdict = "risk";
      notes.push("고유 키워드가 정화에서 같이 삭제됨");
    }

    return {
      path,
      queries: relatedQueries,
      title,
      h1,
      robots: "index,follow",
      ownQueryInTitleOrH1: own,
      exactKwStripped: path === "/부산법무사" ? stillExact : !stillExact,
      topicalKeywordsKept: topicalKept,
      rail: allowlisted ? "kept" : path === "/" ? "never" : "removed",
      verdict,
      notes,
    };
  });

  const localBase = await probeBase(["http://localhost:3000", "http://localhost:3001"]);
  const liveBase = "https://xn--2j1br1na42lvxja38mk8r.kr";

  const comparePaths = uniquePaths.filter((p) => p !== "/상담");
  const htmlRows = [];
  if (localBase) {
    for (const path of comparePaths) {
      const [local, live] = await Promise.all([
        fetchHtml(localBase, path),
        fetchHtml(liveBase, path),
      ]);
      const localParsed = local.ok ? parseHtml(local.html) : null;
      const liveParsed = live.ok ? parseHtml(live.html) : null;
      const titleSame = Boolean(localParsed && liveParsed && localParsed.title === liveParsed.title);
      const h1Same = Boolean(localParsed && liveParsed && localParsed.h1 === liveParsed.h1);
      const descSame = Boolean(localParsed && liveParsed && localParsed.desc === liveParsed.desc);
      const canonicalSame = Boolean(
        localParsed && liveParsed && localParsed.canonical === liveParsed.canonical,
      );
      const robotsWorse = Boolean(localParsed?.noindex && !liveParsed?.noindex);
      const identityLocked = titleSame && h1Same && descSame && canonicalSame && !robotsWorse;

      let htmlVerdict: Verdict = "safe";
      const notes: string[] = [];
      if (!local.ok) {
        htmlVerdict = "watch";
        notes.push(`로컬 ${local.status}`);
      }
      if (!live.ok) {
        htmlVerdict = "watch";
        notes.push(`운영 ${live.status}`);
      }
      if (robotsWorse) {
        htmlVerdict = "risk";
        notes.push("로컬이 noindex로 바뀜");
      }
      if (localParsed && liveParsed && !identityLocked) {
        if (!titleSame) {
          htmlVerdict = path === "/부산법무사" ? "watch" : "risk";
          notes.push(`title 변경: 운영「${liveParsed.title}」→ 로컬「${localParsed.title}」`);
        }
        if (!h1Same) {
          htmlVerdict = path === "/부산법무사" ? "watch" : "risk";
          notes.push(`H1 변경`);
        }
        if (!descSame && path !== "/부산법무사") {
          htmlVerdict = "risk";
          notes.push("description 변경");
        }
        if (!canonicalSame) {
          htmlVerdict = "risk";
          notes.push("canonical 변경");
        }
      }
      if (localParsed && liveParsed) {
        if (liveParsed.railHeading > 0 && localParsed.railHeading === 0) {
          notes.push("운영에 있던 유입 레일 블록 제거");
        }
        const liveHasExactKw = /부산\s*법무사/.test(liveParsed.keywords) && isBusanLawyerExactQuery(
          liveParsed.keywords.split(/[,，]/).find((k) => isBusanLawyerExactQuery(k.trim())) ?? "",
        );
        const localHasExactKw = localParsed.keywords
          .split(/[,，]/)
          .some((k) => isBusanLawyerExactQuery(k.trim()));
        if (path !== "/부산법무사" && liveHasExactKw && !localHasExactKw) {
          notes.push("exact 키워드 메타만 제거");
        }
        if (path !== "/부산법무사" && localHasExactKw) {
          htmlVerdict = "risk";
          notes.push("로컬 keywords에 exact 「부산 법무사」 잔존");
        }
      }

      htmlRows.push({
        path,
        localStatus: local.status,
        liveStatus: live.status,
        titleSame,
        h1Same,
        descSame,
        canonicalSame,
        robotsWorse,
        identityLocked,
        localTitle: localParsed?.title ?? "",
        liveTitle: liveParsed?.title ?? "",
        localH1: localParsed?.h1 ?? "",
        liveRail: liveParsed?.railHeading ?? 0,
        localRail: localParsed?.railHeading ?? 0,
        liveExactHits: liveParsed?.exactQueryHits ?? 0,
        localExactHits: localParsed?.exactQueryHits ?? 0,
        verdict: htmlVerdict,
        notes,
      });
    }
  }

  const issues = [
    ...sanitizerFails,
    ...pageRows.filter((r) => r.verdict === "risk").map((r) => `${r.path}: ${r.notes.join("; ")}`),
    ...htmlRows.filter((r) => r.verdict === "risk").map((r) => `HTML ${r.path}: ${r.notes.join("; ")}`),
  ];

  const summary = {
    generatedAt: new Date().toISOString(),
    localBase,
    liveBase,
    sanitizer,
    sanitizerFails,
    counts: {
      uniquePaths: uniquePaths.length,
      pageSafe: pageRows.filter((r) => r.verdict === "safe").length,
      pageWatch: pageRows.filter((r) => r.verdict === "watch").length,
      pageRisk: pageRows.filter((r) => r.verdict === "risk").length,
      htmlSafe: htmlRows.filter((r) => r.verdict === "safe").length,
      htmlWatch: htmlRows.filter((r) => r.verdict === "watch").length,
      htmlRisk: htmlRows.filter((r) => r.verdict === "risk").length,
      identityLocked: htmlRows.filter((r) => r.identityLocked).length,
      identityDrift: htmlRows.filter((r) => r.localStatus === 200 && r.liveStatus === 200 && !r.identityLocked).length,
    },
    railAllowlist: [...INFLOW_RAIL_ALLOWLIST],
    protectedWithoutRail: pageRows
      .filter((r) => r.rail === "removed" && r.queries.some((q) => !q.startsWith("(")))
      .map((r) => r.path),
    issues,
    pageRows,
    htmlRows,
  };

  console.log(JSON.stringify(summary, null, 2));
  if (issues.length) process.exitCode = 1;
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
