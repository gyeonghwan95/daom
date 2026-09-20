/**
 * MAIN ARTICLE 유사도. 헤더/푸터/NAP 제외(페이지 레지스트리 본문만).
 * 실행: npx --yes tsx scripts/inheritance-content-similarity.ts
 */
import fs from "node:fs";
import path from "node:path";
import { getAllPageData } from "../src/lib/pageData/registry";

const TARGETS = [
  "/상속",
  "/부산상속법무사",
  "/부산상속포기",
  "/부산상속등기",
  "/부산한정승인",
  "/상속포기비용",
  "/services/inheritance-registration",
  "/전국상속등기",
];

const OUT = path.join(process.cwd(), "seo/inheritance-serp/content-similarity.csv");

function csvEscape(v: string | number): string {
  const text = String(v ?? "");
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function paragraphs(page: ReturnType<typeof getAllPageData>[number]): string[] {
  return [
    ...page.introParagraphs,
    ...page.sections.map((s) => s.body),
  ]
    .map((t) => t.replace(/\s+/g, " ").trim())
    .filter((t) => t.length > 40);
}

function tokens(text: string): Set<string> {
  return new Set(
    text
      .replace(/[^\p{L}\p{N}\s]/gu, " ")
      .split(/\s+/)
      .filter((w) => w.length >= 2),
  );
}

function jaccard(a: Set<string>, b: Set<string>): number {
  let inter = 0;
  for (const x of a) if (b.has(x)) inter += 1;
  const union = a.size + b.size - inter;
  return union === 0 ? 0 : Number((inter / union).toFixed(3));
}

function main() {
  const all = getAllPageData();
  const byPath = new Map(all.map((p) => [p.path, p]));
  const rows = ["page_a,page_b,shared_paragraphs,shared_headings,semantic_similarity,owner_overlap"];
  for (let i = 0; i < TARGETS.length; i += 1) {
    for (let j = i + 1; j < TARGETS.length; j += 1) {
      const a = byPath.get(TARGETS[i]);
      const b = byPath.get(TARGETS[j]);
      if (!a || !b) {
        rows.push([TARGETS[i], TARGETS[j], "MISSING", "", "", ""].map(csvEscape).join(","));
        continue;
      }
      const pa = paragraphs(a);
      const pb = paragraphs(b);
      const setB = new Set(pb);
      const sharedP = pa.filter((p) => setB.has(p)).length;
      const ha = new Set(a.sections.map((s) => s.title));
      const hb = new Set(b.sections.map((s) => s.title));
      let sharedH = 0;
      for (const t of ha) if (hb.has(t)) sharedH += 1;
      const sim = jaccard(tokens(pa.join(" ")), tokens(pb.join(" ")));
      const ownerOverlap =
        (a.path === "/부산상속포기" || b.path === "/부산상속포기") &&
        /부산 상속포기 법무사/.test(`${a.metaTitle}${a.h1}${b.metaTitle}${b.h1}`) &&
        a.path !== "/부산상속포기" &&
        b.path !== "/부산상속포기"
          ? "P0_TITLE_COLLISION"
          : sharedP > 0
            ? "SHARED_PARAGRAPH"
            : sim >= 0.22
              ? "SEMANTIC_CLOSE"
              : "LOW";
      rows.push(
        [a.path, b.path, sharedP, sharedH, sim, ownerOverlap].map(csvEscape).join(","),
      );
    }
  }
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, `${rows.join("\n")}\n`, "utf8");
  console.log(`Wrote ${rows.length - 1} pairs -> ${OUT}`);
}

main();
