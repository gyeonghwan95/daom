import { getIndexablePaths } from "../indexable-paths.mjs";
import { getAllPublishedPaths } from "../published-paths.mjs";
import { getExclusionReason } from "./exclusions.mjs";
import { tierOf } from "./tiers.mjs";
import { getLastmodForPath } from "./lastmod.mjs";
import { normalizeRoutePath, pathToAbsoluteUrl } from "./urls.mjs";

/** sitemap에 포함할 URL 목록 + Tier + lastmod + 제외 목록 */
export function collectSitemapEntries() {
  const excluded = [];
  const seen = new Set();
  const entries = [];

  const indexableList = getIndexablePaths();
  const indexableSet = new Set(indexableList.map((p) => normalizeRoutePath(p)));

  for (const rawPath of getAllPublishedPaths()) {
    const routePath = normalizeRoutePath(rawPath);
    if (indexableSet.has(routePath)) continue;

    const reason =
      getExclusionReason(routePath) ?? "non-indexable-registry";
    if (!excluded.some((e) => e.path === routePath)) {
      excluded.push({ path: routePath, reason });
    }
  }

  for (const rawPath of indexableList) {
    const routePath = normalizeRoutePath(rawPath);
    const exclusion = getExclusionReason(routePath);
    if (exclusion) {
      excluded.push({ path: routePath, reason: exclusion });
      continue;
    }

    if (seen.has(routePath)) {
      excluded.push({ path: routePath, reason: "duplicate" });
      continue;
    }
    seen.add(routePath);

    const tier = tierOf(routePath);
    const loc = pathToAbsoluteUrl(routePath);
    const lastmod = getLastmodForPath(routePath);

    entries.push({ path: routePath, tier, loc, lastmod });
  }

  entries.sort((a, b) => a.tier - b.tier || a.path.localeCompare(b.path, "ko"));
  excluded.sort((a, b) => a.path.localeCompare(b.path, "ko"));

  return { entries, excluded };
}

export function groupEntriesByTier(entries) {
  const byTier = {};
  for (const entry of entries) {
    (byTier[entry.tier] ??= []).push(entry);
  }
  return byTier;
}
