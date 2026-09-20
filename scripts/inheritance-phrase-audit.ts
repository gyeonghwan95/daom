/**
 * Exact-phrase collision audit. 네이버 순위가 아님.
 * 실행: npx --yes tsx scripts/inheritance-phrase-audit.ts
 */
import fs from "node:fs";
import path from "node:path";
import { getAllPageData } from "../src/lib/pageData/registry";

const OWNERS: Record<string, string> = {
  "부산 상속포기 법무사": "/부산상속포기",
  "부산 상속 법무사": "/부산상속법무사",
  "부산 상속전문 법무사": "/부산상속법무사",
  "부산상속전문법무사": "/부산상속법무사",
};

function csvEscape(v: string | number): string {
  const text = String(v ?? "");
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function main() {
  const all = getAllPageData();
  const rows = [
    "phrase,url,location,collision",
  ];
  for (const page of all) {
    const fields: [string, string][] = [
      ["TITLE", page.metaTitle || page.title],
      ["H1", page.h1],
      ["INTRO", [page.intro, ...page.introParagraphs].join(" ")],
      ["H2", page.sections.map((s) => s.title).join(" | ")],
      ["BODY", page.sections.map((s) => s.body).join(" ")],
      ["FAQ", page.faqs.map((f) => `${f.question} ${f.answer}`).join(" ")],
    ];
    for (const [phrase, owner] of Object.entries(OWNERS)) {
      for (const [location, text] of fields) {
        if (!text.includes(phrase)) continue;
        const collision =
          page.path === owner
            ? "OWNER"
            : location === "TITLE" || location === "H1"
              ? "COLLISION_CANDIDATE"
              : "SECONDARY_MENTION";
        rows.push(
          [phrase, page.path, location, collision].map(csvEscape).join(","),
        );
      }
    }
  }
  const out = path.join(process.cwd(), "seo/inheritance-serp/phrase-audit.csv");
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, `${rows.join("\n")}\n`, "utf8");
  console.log(`Wrote ${rows.length - 1} phrase hits -> ${out}`);
}

main();
