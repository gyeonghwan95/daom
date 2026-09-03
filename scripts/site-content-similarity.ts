/**
 * 클러스터 허브 MAIN BODY 유사도. 네이버 공식 임계값 아님.
 * 실행: npx --yes tsx scripts/site-content-similarity.ts
 */
import fs from "node:fs";
import path from "node:path";
import { getAllPageData } from "../src/lib/pageData/registry";

const GROUPS: Record<string, string[]> = {
  core: ["/", "/부산법무사", "/부산법무사상담", "/부산법무사추천", "/부산법무사비용"],
  inheritance: [
    "/상속",
    "/부산상속법무사",
    "/부산상속등기",
    "/부산상속포기",
    "/부산한정승인",
    "/services/inheritance-registration",
    "/전국상속등기",
  ],
  corporate: ["/부산법인법무사", "/부산법인등기", "/법인등기", "/services/corporate-registration"],
  rehab: ["/부산개인회생", "/부산개인회생법무사", "/개인회생파산", "/services/personal-rehabilitation"],
};

const NAP = /다옴법무사사무소|안윤정 법무사|해운대[구·,]?\s*센텀|1분만에 문의하기|상담 안내/g;

function tokens(text: string): Set<string> {
  return new Set(
    text
      .toLowerCase()
      .replace(NAP, " ")
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
function csvEscape(v: string | number): string {
  const s = String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function main() {
  const byPath = new Map(getAllPageData().map((p) => [p.path, p]));
  const rows = ["cluster,page_a,page_b,raw_similarity,normalized_similarity"];
  for (const [cluster, paths] of Object.entries(GROUPS)) {
    const blobs = paths.map((p) => {
      const page = byPath.get(p);
      const body = page
        ? [page.intro, ...page.introParagraphs, ...page.sections.map((s) => s.body)].join("\n")
        : "";
      const normalized = body.replace(/부산|해운대|연제구|동래구|상속|법인|등기|법무사/g, "X");
      return { path: p, body, normalized };
    });
    for (let i = 0; i < blobs.length; i += 1) {
      for (let j = i + 1; j < blobs.length; j += 1) {
        rows.push(
          [
            cluster,
            blobs[i]!.path,
            blobs[j]!.path,
            jaccard(blobs[i]!.body, blobs[j]!.body).toFixed(4),
            jaccard(blobs[i]!.normalized, blobs[j]!.normalized).toFixed(4),
          ]
            .map(csvEscape)
            .join(","),
        );
      }
    }
  }
  const out = path.join(process.cwd(), "seo/master/site-content-similarity.csv");
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, `${rows.join("\n")}\n`, "utf8");
  console.log(`pairs=${rows.length - 1} -> ${out}`);
}

main();
