/**
 * Station coverage / similarity / host checks
 * npm run seo:audit:stations
 */
import fs from "node:fs";
import path from "node:path";
import {
  allBusanRailStations,
  getPhase1Stations,
} from "../src/data/geo/busan-rail-stations";
import {
  EXISTING_THIN_STATION_URLS,
  getStationHostAssignments,
} from "../src/data/seo/station-host-map";
import { stationSectionContents } from "../src/data/seo/station-section-content";
import { getAllPublishedPaths } from "./lib/published-paths.mjs";

const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, "reports/seo");

function tokens(s: string): Set<string> {
  return new Set(
    s
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s]/gu, " ")
      .split(/\s+/)
      .filter((t) => t.length > 1),
  );
}

function jaccard(a: string, b: string): number {
  const ta = tokens(a);
  const tb = tokens(b);
  let inter = 0;
  for (const t of ta) if (tb.has(t)) inter += 1;
  const union = ta.size + tb.size - inter;
  return union === 0 ? 0 : inter / union;
}

function normalizeStationNames(text: string): string {
  let t = text;
  for (const st of allBusanRailStations) {
    for (const alias of [st.name, st.normalizedName, ...st.seoAliases]) {
      t = t.split(alias).join("");
    }
  }
  return t.replace(/\s+/g, " ").trim();
}

function main() {
  const published = new Set(getAllPublishedPaths());
  const assignments = getStationHostAssignments();
  const phase1 = getPhase1Stations();

  const coverage = phase1.map((st) => {
    const content = stationSectionContents[st.id];
    const hostOk = st.hostPage ? published.has(st.hostPage) : false;
    const status =
      content && hostOk
        ? "COVERED"
        : hostOk
          ? "PARTIAL"
          : content
            ? "MISSING"
            : "MISSING";
    return {
      station: st.name,
      lines: st.lines.join(","),
      district: st.district ?? "",
      primaryHost: st.hostPage ?? "",
      hostPublished: hostOk,
      section: Boolean(content),
      sectionId: st.stationSectionId,
      status,
    };
  });

  const contents = Object.values(stationSectionContents);
  const pairs: {
    a: string;
    b: string;
    raw: number;
    normalized: number;
    risk: string;
  }[] = [];
  for (let i = 0; i < contents.length; i++) {
    for (let j = i + 1; j < contents.length; j++) {
      const a = contents[i]!;
      const b = contents[j]!;
      const rawTextA = [a.heading, a.intro, a.localContext, a.nextStep].join(" ");
      const rawTextB = [b.heading, b.intro, b.localContext, b.nextStep].join(" ");
      const raw = jaccard(rawTextA, rawTextB);
      const normalized = jaccard(
        normalizeStationNames(rawTextA),
        normalizeStationNames(rawTextB),
      );
      const score = Math.round(normalized * 100);
      const risk =
        score < 40
          ? "GOOD"
          : score < 55
            ? "ACCEPTABLE"
            : score < 70
              ? "REVIEW"
              : "REWRITE REQUIRED";
      if (score >= 40) {
        pairs.push({
          a: a.stationId,
          b: b.stationId,
          raw: Math.round(raw * 100),
          normalized: score,
          risk,
        });
      }
    }
  }
  pairs.sort((x, y) => y.normalized - x.normalized);

  const hostCounts: Record<string, number> = {};
  for (const st of phase1) {
    if (!st.hostPage) continue;
    hostCounts[st.hostPage] = (hostCounts[st.hostPage] ?? 0) + 1;
  }

  const report = {
    generatedAt: new Date().toISOString(),
    totals: {
      entities: allBusanRailStations.length,
      verified: allBusanRailStations.filter((s) => s.verified).length,
      phase1Sections: phase1.length,
      publishedPaths: published.size,
    },
    existingThinStationUrls: EXISTING_THIN_STATION_URLS.map((u) => ({
      path: u,
      published: published.has(u),
      policy: "KEEP — 삭제 금지. 신규 확장·복제 금지. DOORWAY-RISK 관찰",
    })),
    hostAssignments: assignments,
    coverage,
    hostBloat: Object.entries(hostCounts)
      .map(([host, count]) => ({ host, count, risk: count > 8 ? "REBALANCE" : "OK" }))
      .sort((a, b) => b.count - a.count),
    similarityPairs: pairs.slice(0, 40),
    rewriteRequired: pairs.filter((p) => p.risk === "REWRITE REQUIRED"),
    policy: {
      noNewStationUrls: true,
      noUrlDelete: true,
      noTitleStationDump: true,
    },
  };

  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(
    path.join(OUT_DIR, "station-coverage.json"),
    JSON.stringify(report, null, 2),
    "utf8",
  );
  fs.writeFileSync(
    path.join(OUT_DIR, "station-similarity.json"),
    JSON.stringify(
      { generatedAt: report.generatedAt, pairs, rewriteRequired: report.rewriteRequired },
      null,
      2,
    ),
    "utf8",
  );

  console.log(
    "stations",
    report.totals.entities,
    "phase1",
    report.totals.phase1Sections,
    "rewriteRequired",
    report.rewriteRequired.length,
  );
  console.log("Wrote reports/seo/station-coverage.json");
  if (report.rewriteRequired.length) {
    console.warn("REWRITE REQUIRED pairs:", report.rewriteRequired);
    process.exitCode = 1;
  }
}

main();
