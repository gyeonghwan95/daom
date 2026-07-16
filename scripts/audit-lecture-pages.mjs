/**
 * 강의 페이지·검색의도·이력·과장표현 점검
 * 실행: node scripts/audit-lecture-pages.mjs
 */
import { readdirSync, readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "scripts", "output");
mkdirSync(outDir, { recursive: true });

const bannedClaims = [
  "최고의 강사",
  "1위 강사",
  "만족도 100%",
  "전문강사 인증",
  "법정의무교육 인정",
  "반드시 만족",
  "무조건 섭외",
  "교육 효과 보장",
  "전국 최다 출강",
];

const issues = [];

const dirsToScan = [
  join(root, "src/lib/lectures"),
  join(root, "src/data/lectures"),
  join(root, "src/components/lectures"),
];

function collectFiles(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) return collectFiles(full);
    if (/\.(ts|tsx|mjs|js)$/.test(entry.name)) return [full];
    return [];
  });
}

for (const dir of dirsToScan) {
  for (const file of collectFiles(dir)) {
    const text = readFileSync(file, "utf8");
    for (const claim of bannedClaims) {
      if (text.includes(claim)) {
        issues.push(`${file.replace(root + "\\", "").replace(root + "/", "")}: banned claim "${claim}"`);
      }
    }
  }
}

const contentPath = join(root, "src/lib/lectures/content.ts");
const historyPath = join(root, "src/data/lectures/history.ts");
const intentsPath = join(root, "src/data/lectures/search-intents.ts");

const contentText = readFileSync(contentPath, "utf8");
const historyText = readFileSync(historyPath, "utf8");
const intentsText = readFileSync(intentsPath, "utf8");

const pageSlugs = [...contentText.matchAll(/slug:\s*"([^"]+)"/g)].map((m) => m[1]);
const uniqueSlugs = [...new Set(pageSlugs)];
if (uniqueSlugs.length < 12) {
  issues.push(`expected >=12 lecture slugs, found ${uniqueSlugs.length}`);
}

const faqCounts = [...contentText.matchAll(/faqs:\s*\[/g)].length;
if (faqCounts < 12) {
  issues.push(`expected faqs arrays for 12 pages, found ${faqCounts}`);
}

const historyIds = [...historyText.matchAll(/id:\s*"([^"]+)"/g)].map((m) => m[1]);
if (historyIds.length < 5) {
  issues.push(`expected sufficient history entries, found ${historyIds.length}`);
}

const createNewUrls = [
  ...intentsText.matchAll(/action:\s*"create-new"[\s\S]*?targetUrl:\s*"([^"]+)"/g),
  ...intentsText.matchAll(/targetUrl:\s*"([^"]+)"[\s\S]*?action:\s*"create-new"/g),
].map((m) => m[1]);

const report = {
  generatedAt: new Date().toISOString(),
  pageCount: uniqueSlugs.length,
  historyCount: historyIds.length,
  createNewUrls: [...new Set(createNewUrls)],
  issues,
  ok: issues.length === 0,
};

writeFileSync(
  join(outDir, "lecture-audit-report.json"),
  JSON.stringify(report, null, 2),
  "utf8",
);

console.log(JSON.stringify(report, null, 2));
if (!report.ok) process.exitCode = 1;
