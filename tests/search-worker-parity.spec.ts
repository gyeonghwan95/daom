import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function loadTs<T>(rel: string): Promise<T> {
  return import(pathToFileURL(path.join(ROOT, rel)).href) as Promise<T>;
}

test("title 90 then alias 85 stay in the shared scorer the worker imports", () => {
  const scorer = fs.readFileSync(
    path.join(ROOT, "src/lib/search/search-site.ts"),
    "utf8",
  );
  const worker = fs.readFileSync(
    path.join(ROOT, "src/lib/search/search-score.worker.ts"),
    "utf8",
  );
  const title90 = scorer.indexOf("score += 90");
  const alias85 = scorer.indexOf("score += 85");
  assert.ok(title90 > 0, "title startsWith 90");
  assert.ok(alias85 > title90, "alias exact 85 follows title 90");
  assert.match(worker, /from "\.\/run-search-query"/);
});

test("runSearchQuery href+score matches searchSite for the same queries", async () => {
  const [{ runSearchQuery, searchHitsMatch }, { searchSite, countSearchResults }] =
    await Promise.all([
      loadTs<typeof import("../src/lib/search/run-search-query.ts")>(
        "src/lib/search/run-search-query.ts",
      ),
      loadTs<typeof import("../src/lib/search/search-site.ts")>(
        "src/lib/search/search-site.ts",
      ),
    ]);

  const items = JSON.parse(
    fs.readFileSync(path.join(ROOT, "src/generated/search-index.json"), "utf8"),
  ) as never[];

  const queries = ["상속포기", "법인설립", "법무사", "상담", "해운대 상속"];
  for (const query of queries) {
    const viaShared = runSearchQuery(items, query, { limit: 50 });
    const hits = searchSite(items, query, { limit: 50 });
    const total = countSearchResults(items, query);
    assert.equal(viaShared.total, total, query);
    assert.equal(searchHitsMatch(viaShared.hits, hits), true, query);
    assert.equal(viaShared.query, query);
  }
});
