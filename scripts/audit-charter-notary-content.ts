/**
 * 정관·공증 클러스터 중복·cannibalization·canonical 감사.
 * 실행: npx --yes tsx scripts/audit-charter-notary-content.ts
 */
import { corporatePages } from "../src/lib/corporate-intent/content";
import { charterNotaryPhase1Pages } from "../src/lib/corporate-intent/content/charter-notary-phase1";

const PHASE1_SLUGS = new Set(charterNotaryPhase1Pages.map((p) => p.slug));

function normalize(text: string): string {
  return text.replace(/\s+/g, " ").trim().toLowerCase();
}

function tokenSet(text: string): Set<string> {
  return new Set(
    normalize(text)
      .replace(/[^\p{L}\p{N}\s]/gu, " ")
      .split(/\s+/)
      .filter((t) => t.length > 1),
  );
}

function jaccardTokens(a: string, b: string): number {
  const sa = tokenSet(a);
  const sb = tokenSet(b);
  let inter = 0;
  for (const t of sa) if (sb.has(t)) inter += 1;
  const union = sa.size + sb.size - inter;
  return union === 0 ? 0 : inter / union;
}

function pageBlob(page: (typeof corporatePages)[number]): string {
  return [
    page.title,
    page.metaTitle,
    page.metaDescription,
    page.h1,
    page.heroIntro,
    ...page.heroParagraphs,
    page.conclusion,
    page.searchIntent,
    ...page.faqs.flatMap((f) => [f.question, f.answer]),
    ...(page.infoTables ?? []).flatMap((t) => [
      t.title,
      ...t.headers,
      ...t.rows.flat(),
    ]),
  ].join(" ");
}

function main() {
  const issues: string[] = [];
  const titles = new Map<string, string>();
  const descriptions = new Map<string, string>();
  const h1s = new Map<string, string>();

  for (const page of corporatePages) {
    const t = normalize(page.metaTitle);
    const d = normalize(page.metaDescription);
    const h = normalize(page.h1);
    if (titles.has(t)) {
      issues.push(`동일 title: /${page.slug} ↔ /${titles.get(t)}`);
    } else titles.set(t, page.slug);
    if (descriptions.has(d)) {
      issues.push(`동일 description: /${page.slug} ↔ /${descriptions.get(d)}`);
    } else descriptions.set(d, page.slug);
    if (h1s.has(h)) {
      issues.push(`동일 H1: /${page.slug} ↔ /${h1s.get(h)}`);
    } else h1s.set(h, page.slug);
  }

  console.log("=== Charter/Notary Content Audit ===");
  console.log(`corporate pages: ${corporatePages.length}`);
  console.log(`phase1 pages: ${charterNotaryPhase1Pages.length}`);

  const reports: {
    slug: string;
    nearest: string;
    similarity: number;
    intent: string;
  }[] = [];

  for (const page of charterNotaryPhase1Pages) {
    let best = { slug: "", sim: 0 };
    const blob = pageBlob(page);
    for (const other of corporatePages) {
      if (other.slug === page.slug) continue;
      const sim = jaccardTokens(blob, pageBlob(other));
      if (sim > best.sim) best = { slug: other.slug, sim };
    }
    reports.push({
      slug: page.slug,
      nearest: best.slug,
      similarity: best.sim,
      intent: page.searchIntent,
    });

    if (best.sim >= 0.8) {
      issues.push(
        `유사도 ${(best.sim * 100).toFixed(0)}% — 신규 차단 후보: /${page.slug} ≈ /${best.slug}`,
      );
    } else if (best.sim >= 0.65) {
      issues.push(
        `유사도 ${(best.sim * 100).toFixed(0)}% — 수동 검토: /${page.slug} ≈ /${best.slug}`,
      );
    }

    if (!page.notaryBoundaryNote && /공증|인증/.test(page.slug + page.h1)) {
      issues.push(`공증 경계 문구 누락: /${page.slug}`);
    }
    if ((page.infoTables?.length ?? 0) < 1) {
      issues.push(`고유 표 모듈 부족: /${page.slug}`);
    }
    if (page.relatedLinks.length < 3) {
      issues.push(`내부링크 3개 미만: /${page.slug}`);
    }
    if (/공증\s*전문\s*법무사|공증\s*대행|공증\s*맡기|공증까지\s*원스톱/.test(pageBlob(page))) {
      // 부정문 예외: "하지 않습니다" 등이 같은 문장에 있으면 허용
      const blob = pageBlob(page);
      const bad = blob.match(
        /[^.。]*?(공증\s*전문\s*법무사|공증\s*대행|공증\s*맡기|공증까지\s*원스톱)[^.。]*/g,
      );
      for (const sentence of bad ?? []) {
        if (!/않|아니|금지|오인|구분/.test(sentence)) {
          issues.push(`금지 공증 표현: /${page.slug} — ${sentence.slice(0, 80)}`);
        }
      }
    }
  }

  // FAQ 교차 중복(질문 완전 일치)
  const faqQs = new Map<string, string>();
  for (const page of charterNotaryPhase1Pages) {
    for (const faq of page.faqs) {
      const q = normalize(faq.question);
      if (faqQs.has(q)) {
        issues.push(
          `FAQ 질문 중복: "${faq.question}" (/ ${page.slug} ↔ /${faqQs.get(q)})`,
        );
      } else faqQs.set(q, page.slug);
    }
  }

  // 지역명만 바뀐 정관/공증 클론 금지 신호
  for (const page of corporatePages) {
    if (
      !PHASE1_SLUGS.has(page.slug) &&
      /^(해운대|센텀|수영|동래|기장).*(정관|공증)/.test(page.slug)
    ) {
      issues.push(`지역 클론 의심 slug: /${page.slug}`);
    }
  }

  console.log("\n[Phase1 nearest similarity]");
  for (const r of reports) {
    console.log(
      `/${r.slug} → nearest /${r.nearest} (${(r.similarity * 100).toFixed(1)}%) | ${r.intent.slice(0, 60)}`,
    );
  }

  console.log(`\nissues: ${issues.length}`);
  for (const issue of issues) console.log(`[issue] ${issue}`);

  const blockers = issues.filter(
    (i) => i.includes("신규 차단") || i.includes("동일 title") || i.includes("금지 공증"),
  );
  if (blockers.length > 0) process.exitCode = 1;
}

main();
