#!/usr/bin/env node
/**
 * SEO 유입용 칼럼 데이터 → blog MDX 생성
 * @see src/data/seo-intent-articles/
 */
import { createJiti } from "jiti";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const BLOG_DIR = path.join(ROOT, "src/content/blog");

function fail(message) {
  console.error(`[generate-seo-intent-blog] ${message}`);
  process.exit(1);
}

try {
  const jiti = createJiti(import.meta.url, {
    interopDefault: true,
    alias: {
      "@": path.join(ROOT, "src"),
    },
  });

  const dataMod = jiti(path.join(ROOT, "src/data/seo-intent-articles/index.ts"));
  const buildMod = jiti(path.join(ROOT, "src/lib/seo-intent-articles/build-mdx.ts"));

  const articles = dataMod.getSeoIntentArticlesForGeneration?.() ?? [];
  const buildMdx = buildMod.buildSeoIntentArticleMdx;

  if (!Array.isArray(articles) || typeof buildMdx !== "function") {
    fail("invalid module exports");
  }

  if (!fs.existsSync(BLOG_DIR)) {
    fs.mkdirSync(BLOG_DIR, { recursive: true });
  }

  let written = 0;
  let skipped = 0;

  for (const article of articles) {
    const filePath = path.join(BLOG_DIR, `${article.slug}.mdx`);

    if (fs.existsSync(filePath)) {
      const existing = fs.readFileSync(filePath, "utf8");
      if (!existing.includes("searchIntent:")) {
        console.warn(
          `[generate-seo-intent-blog] skip existing (manual): ${article.slug}.mdx`,
        );
        skipped += 1;
        continue;
      }
    }

    fs.writeFileSync(filePath, buildMdx(article), "utf8");
    written += 1;
  }

  const skippedData =
    (dataMod.allSeoIntentArticles?.length ?? articles.length) - articles.length;

  console.log(
    `[generate-seo-intent-blog] OK — wrote ${written}, skipped existing ${skipped}, skipGeneration ${skippedData}`,
  );
} catch (error) {
  fail(error instanceof Error ? error.message : String(error));
}
