/**
 * 상속 대표 URL MAIN BODY 유사도.
 * Header/Footer/Global CTA/Navigation/NAP를 제외한 PageData 본문만 비교.
 * 수치는 내부 QA 기준이며 네이버 공식 알고리즘이 아니다.
 *
 * 실행: npx --yes tsx scripts/inheritance-content-similarity.ts
 */
import fs from "node:fs";
import path from "node:path";
import { getAllPageData } from "../src/lib/pageData/registry";

const ROOT = process.cwd();
const OUT = path.join(ROOT, "seo/inheritance/content-similarity.csv");

const TARGETS = [
  "/상속",
  "/부산상속법무사",
  "/부산상속등기",
  "/부산상속포기",
  "/부산한정승인",
  "/services/inheritance-registration",
  "/전국상속등기",
];

const NAP_NOISE =
  /다옴법무사사무소|안윤정 법무사|해운대[구·,]?\s*센텀|센텀동로 200|전화·카카오톡|방문\(예약\)|1분만에 문의하기|상담 안내/g;

type BodyBlob = {
  path: string;
  body: string;
  headings: string[];
  paragraphs: string[];
};

function tokens(text: string): Set<string> {
  return new Set(
    text
      .toLowerCase()
      .replace(NAP_NOISE, " ")
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

function csvEscape(value: string | number): string {
  const text = String(value);
  if (/[",\n\r]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
  return text;
}

function main() {
  const all = getAllPageData();
  const byPath = new Map(all.map((p) => [p.path, p]));
  const blobs: BodyBlob[] = TARGETS.map((target) => {
    const page = byPath.get(target);
    if (!page) {
      return { path: target, body: "", headings: [], paragraphs: [] };
    }
    const paragraphs = [
      ...page.introParagraphs,
      ...page.sections.map((s) => s.body),
      ...page.faqs.map((f) => f.answer),
    ]
      .map((p) => p.replace(/\s+/g, " ").trim())
      .filter((p) => p.length > 40);
    const headings = page.sections.map((s) => s.title);
    return {
      path: target,
      body: [page.intro, ...paragraphs].join("\n").replace(NAP_NOISE, " "),
      headings,
      paragraphs,
    };
  });

  const rows = [
    "page_a,page_b,raw_similarity,normalized_similarity,repeated_paragraph_count,shared_heading_ratio",
  ];

  for (let i = 0; i < blobs.length; i += 1) {
    for (let j = i + 1; j < blobs.length; j += 1) {
      const a = blobs[i]!;
      const b = blobs[j]!;
      const raw = jaccard(a.body, b.body);
      const aCore = a.paragraphs.join(" ");
      const bCore = b.paragraphs.join(" ");
      const normalized = jaccard(aCore, bCore);
      let repeated = 0;
      const bSet = new Set(b.paragraphs.map((p) => p.slice(0, 80)));
      for (const p of a.paragraphs) {
        if (bSet.has(p.slice(0, 80))) repeated += 1;
      }
      const headingUnion = new Set([...a.headings, ...b.headings]);
      const headingInter = a.headings.filter((h) => b.headings.includes(h)).length;
      const sharedHeadingRatio =
        headingUnion.size === 0 ? 0 : headingInter / headingUnion.size;
      rows.push(
        [
          a.path,
          b.path,
          raw.toFixed(4),
          normalized.toFixed(4),
          repeated,
          sharedHeadingRatio.toFixed(4),
        ]
          .map(csvEscape)
          .join(","),
      );
    }
  }

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, `${rows.join("\n")}\n`, "utf8");
  console.log(`Wrote ${rows.length - 1} pairs to ${path.relative(ROOT, OUT)}`);
}

main();
