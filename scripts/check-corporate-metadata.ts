/**
 * 법인 클러스터 metadata 중복 검사 (corporate-intent 페이지).
 * 실행: npx --yes tsx scripts/check-corporate-metadata.ts
 */
import { corporatePages } from "../src/lib/corporate-intent/content";

type Issue = { level: "error" | "warn"; message: string };

function main() {
  const issues: Issue[] = [];
  const titles = new Map<string, string>();
  const descriptions = new Map<string, string>();
  const h1s = new Map<string, string>();
  const primaries = new Map<string, string>();

  for (const page of corporatePages) {
    const path = `/${page.slug}`;
    if (titles.has(page.metaTitle)) {
      issues.push({
        level: "error",
        message: `중복 metaTitle: ${titles.get(page.metaTitle)} ↔ ${path}`,
      });
    } else titles.set(page.metaTitle, path);

    if (descriptions.has(page.metaDescription)) {
      issues.push({
        level: "error",
        message: `중복 description: ${descriptions.get(page.metaDescription)} ↔ ${path}`,
      });
    } else descriptions.set(page.metaDescription, path);

    if (h1s.has(page.h1)) {
      issues.push({
        level: "error",
        message: `중복 H1: ${h1s.get(page.h1)} ↔ ${path}`,
      });
    } else h1s.set(page.h1, path);

    if (primaries.has(page.primaryKeyword)) {
      issues.push({
        level: "warn",
        message: `동일 primaryKeyword: ${primaries.get(page.primaryKeyword)} ↔ ${path}`,
      });
    } else primaries.set(page.primaryKeyword, path);

    if (!page.officeLine?.includes("법무사")) {
      issues.push({
        level: "warn",
        message: `${path}: officeLine에 법무사 표시 확인`,
      });
    }
    if (!page.scopeNotice) {
      issues.push({ level: "warn", message: `${path}: scopeNotice 없음` });
    }
  }

  const errors = issues.filter((i) => i.level === "error");
  console.log("=== Corporate Metadata Check ===");
  console.log(`pages: ${corporatePages.length}`);
  console.log(`errors: ${errors.length}, warnings: ${issues.length - errors.length}`);
  for (const issue of issues) console.log(`[${issue.level}] ${issue.message}`);
  if (errors.length) process.exitCode = 1;
}

main();
