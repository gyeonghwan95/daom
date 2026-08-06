/**
 * 강사·강의 SEO 중복·품질 감사.
 * 실행: npx --yes tsx scripts/audit-lecture-speaker-seo.ts
 */
import { lecturePages } from "../src/lib/lectures/content";
import { lectureKeywordToUrlMap } from "../src/data/lectures/lecture-keyword-to-url-map";
import { lectureIntentToUrlMap } from "../src/data/lectures/lecture-intent-to-url-map";

type Issue = { level: "error" | "warn"; message: string };

function charCount(page: (typeof lecturePages)[number]): number {
  const parts = [
    page.heroIntro,
    ...page.heroParagraphs,
    ...(page.bodySections ?? []).flatMap((s) => s.paragraphs),
    ...page.modules,
    ...page.faqs.flatMap((f) => [f.question, f.answer]),
  ];
  return parts.join("").replace(/\s+/g, "").length;
}

function first700(page: (typeof lecturePages)[number]): string {
  return [page.heroIntro, ...page.heroParagraphs].join(" ").slice(0, 700);
}

function jaccard(a: string, b: string): number {
  const ta = new Set(a.replace(/\s+/g, "").split(""));
  const tb = new Set(b.replace(/\s+/g, "").split(""));
  let inter = 0;
  for (const ch of ta) if (tb.has(ch)) inter += 1;
  const union = ta.size + tb.size - inter;
  return union === 0 ? 0 : inter / union;
}

function main() {
  const issues: Issue[] = [];
  const titles = new Map<string, string>();
  const descriptions = new Map<string, string>();
  const h1s = new Map<string, string>();
  const primaries = new Map<string, string>();

  for (const page of lecturePages) {
    const path = `/${page.slug}`;
    const chars = charCount(page);

    if (!page.metaTitle?.trim()) {
      issues.push({ level: "error", message: `${path}: metaTitle 없음` });
    }
    if (!page.metaDescription?.trim()) {
      issues.push({ level: "error", message: `${path}: metaDescription 없음` });
    }
    if (!page.h1?.trim()) {
      issues.push({ level: "error", message: `${path}: H1 없음` });
    }
    if (!(page.primaryKeywords?.[0])) {
      issues.push({ level: "warn", message: `${path}: primaryKeyword 없음` });
    }
    if (chars < 800) {
      issues.push({
        level: "warn",
        message: `${path}: 본문 글자수 ${chars} (얇을 수 있음)`,
      });
    }

    const mt = page.metaTitle;
    if (titles.has(mt)) {
      issues.push({
        level: "error",
        message: `중복 title: "${mt}" (${titles.get(mt)} ↔ ${path})`,
      });
    } else titles.set(mt, path);

    const md = page.metaDescription;
    if (descriptions.has(md)) {
      issues.push({
        level: "error",
        message: `중복 description: ${descriptions.get(md)} ↔ ${path}`,
      });
    } else descriptions.set(md, path);

    if (h1s.has(page.h1)) {
      issues.push({
        level: "error",
        message: `중복 H1: "${page.h1}" (${h1s.get(page.h1)} ↔ ${path})`,
      });
    } else h1s.set(page.h1, path);

    const pk = page.primaryKeywords?.[0];
    if (pk) {
      if (primaries.has(pk)) {
        issues.push({
          level: "warn",
          message: `동일 primary keyword "${pk}": ${primaries.get(pk)} ↔ ${path}`,
        });
      } else primaries.set(pk, path);
    }

    if (!page.relatedLectureLinks.some((l) => l.href === "/부산법률강사")) {
      if (page.slug !== "부산법률강사") {
        issues.push({
          level: "warn",
          message: `${path}: 강사 허브(/부산법률강사) 내부링크 누락`,
        });
      }
    }
  }

  for (let i = 0; i < lecturePages.length; i++) {
    for (let j = i + 1; j < lecturePages.length; j++) {
      const a = lecturePages[i];
      const b = lecturePages[j];
      const sim = jaccard(first700(a), first700(b));
      if (sim >= 0.92) {
        issues.push({
          level: "warn",
          message: `첫 700자 유사도 ${sim.toFixed(2)}: /${a.slug} ↔ /${b.slug}`,
        });
      }
      const modA = a.modules.join("|");
      const modB = b.modules.join("|");
      if (modA && modA === modB && a.modules.length >= 3) {
        issues.push({
          level: "warn",
          message: `동일 커리큘럼 모듈: /${a.slug} ↔ /${b.slug}`,
        });
      }
    }
  }

  const mapTargets = new Set(Object.values(lectureKeywordToUrlMap));
  for (const target of mapTargets) {
    const slug = target.replace(/^\//, "").split("#")[0];
    if (
      ![
        "법률강의",
        "부산법률강사",
        "강사소개",
        "강의문의",
        "강의이력",
        "about",
        "media",
      ].includes(slug) &&
      !lecturePages.some((p) => p.slug === slug) &&
      !slug.includes("/")
    ) {
      // media and about are ok; history detail paths may exist
      if (!slug.startsWith("강의이력")) {
        const known = lecturePages.some((p) => `/${p.slug}` === target);
        if (!known && !target.includes("#") && target !== "/about") {
          issues.push({
            level: "warn",
            message: `키워드맵 대상 URL 페이지 미확인: ${target}`,
          });
        }
      }
    }
  }

  const createIntents = lectureIntentToUrlMap.filter((i) => i.action === "create");
  for (const intent of createIntents) {
    const slug = intent.targetUrl.replace(/^\//, "");
    if (!lecturePages.some((p) => p.slug === slug)) {
      issues.push({
        level: "error",
        message: `create intent 대상 페이지 없음: ${intent.targetUrl} (${intent.id})`,
      });
    }
  }

  const errors = issues.filter((i) => i.level === "error");
  const warns = issues.filter((i) => i.level === "warn");

  console.log("=== Lecture Speaker SEO Audit ===");
  console.log(`pages: ${lecturePages.length}`);
  console.log(`keyword map entries: ${Object.keys(lectureKeywordToUrlMap).length}`);
  console.log(`intent map entries: ${lectureIntentToUrlMap.length}`);
  console.log(`errors: ${errors.length}, warnings: ${warns.length}`);
  for (const issue of issues) {
    console.log(`[${issue.level}] ${issue.message}`);
  }

  console.log("\n--- Page body char counts ---");
  for (const page of lecturePages) {
    console.log(`/${page.slug}\t${charCount(page)}\t${page.metaTitle}`);
  }

  if (errors.length) process.exitCode = 1;
}

main();
