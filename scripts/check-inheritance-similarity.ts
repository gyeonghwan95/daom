/**
 * 상속 핵심 URL 간 유사도 검사
 * 실행: npx --yes tsx scripts/check-inheritance-similarity.ts
 */
import fs from "node:fs";
import path from "node:path";
import { getKeywordTopic } from "../src/lib/local-landing/keyword-topics";

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

function band(n: number): string {
  const p = n * 100;
  if (p < 40) return "낮음";
  if (p < 60) return "관찰";
  if (p < 75) return "주의";
  return "강한 중복 가능성";
}

const pages = [
  {
    path: "/부산상속법무사",
    text: () => {
      const t = getKeywordTopic("부산상속법무사")!;
      return {
        title: t.metaTitle,
        h1: t.h1,
        desc: t.metaDescription,
        body: [t.problemStatement, ...t.summaryParagraphs].join(" "),
        faq: t.faqs.map((f) => f.question).join(" "),
      };
    },
  },
  {
    path: "/부산상속전문법무사",
    text: () => ({
      title: "부산 상속전문 법무사｜등기·포기·한정승인 첫 분기",
      h1: "부산 상속전문 법무사 — 상속 절차 첫 분기 안내",
      desc: "첫 분기부터 가려야",
      body: "부산 상속전문 법무사로 들어오면 상속등기부터 떠올리기 쉽지만 실제로는 상속포기·한정승인",
      faq: "부산 상속전문 법무사와 부산 상속 법무사 차이는",
    }),
  },
  {
    path: "/부산상속등기",
    text: () => ({
      title: "부산 상속등기 법무사｜서류와 진행 순서",
      h1: "부산 상속등기 법무사, 명의이전 서류와 진행 순서",
      desc: "명의이전등기 서류",
      body: "부산 상속등기 법무사를 찾는 분들은 대개 부모님 명의 아파트·토지를 자녀·배우자 앞으로 옮기려 합니다",
      faq: "상속등기 전에 반드시 해야 할 일은",
    }),
  },
];

function main() {
  const rows = [];
  for (let i = 0; i < pages.length; i += 1) {
    for (let j = i + 1; j < pages.length; j += 1) {
      const A = pages[i]!.text();
      const B = pages[j]!.text();
      const title = jaccard(A.title, B.title);
      const h1 = jaccard(A.h1, B.h1);
      const body = jaccard(A.body, B.body);
      const faq = jaccard(A.faq, B.faq);
      const avg = (title + h1 + body) / 3;
      rows.push({
        urlA: pages[i]!.path,
        urlB: pages[j]!.path,
        titleSimilarity: Number((title * 100).toFixed(1)),
        h1Similarity: Number((h1 * 100).toFixed(1)),
        bodySimilarity: Number((body * 100).toFixed(1)),
        faqSimilarity: Number((faq * 100).toFixed(1)),
        intentSimilarity: Number((avg * 100).toFixed(1)),
        cannibalizationRisk: band(avg),
        recommendation:
          pages[i]!.path.includes("전문") || pages[j]!.path.includes("전문")
            ? "삭제/redirect 금지. Champion(/부산상속법무사)으로 내부링크·신호 집중. 전문 URL title 변경은 HIGH RISK 승인 후."
            : "역할 유지. 상호 링크·의도 분리 유지.",
      });
    }
  }
  const out = path.join(ROOT_OUT(), "inheritance-similarity.json");
  fs.writeFileSync(out, JSON.stringify(rows, null, 2), "utf8");
  console.log(JSON.stringify(rows, null, 2));
  console.log("Wrote", out);
}

function ROOT_OUT() {
  return path.join(process.cwd(), "scripts/output");
}

main();
