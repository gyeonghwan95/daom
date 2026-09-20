import fs from "node:fs";
import path from "node:path";
import { getAllPageData } from "../src/lib/pageData/registry";
import { isIndexablePagePath } from "../src/lib/pageData/sitemap";
import { isNoIndexPath } from "../src/lib/seo/index-policy";

const HOST = "https://다옴법무사사무소.kr";

function ok(path: string): boolean {
  return isIndexablePagePath(path) && !isNoIndexPath(path);
}

function abs(path: string): string {
  if (path === "/") return `${HOST}/`;
  return `${HOST}${path}`;
}

function main() {
  const all = getAllPageData();
  const byPath = new Map(all.map((p) => [p.path, p]));
  const exists = (p: string) => byPath.has(p) && ok(p);

  const priority1 = [
    "/부산상속포기",
    "/부산상속법무사",
    "/",
    "/busan-legal-map",
  ].filter(exists);

  const priority2 = [
    "/상속",
    "/상속포기비용",
    "/부산한정승인",
    "/특별한정승인",
    "/부산상속등기",
    "/blog/inheritance-renunciation-vs-qualified-acceptance",
    "/부산법무사상담",
    "/부산법무사추천",
    "/부산법무사비용",
    "/부산부동산등기",
    "/부산등기법무사",
    "/부산법인등기",
    "/부산법인법무사",
    "/부산개인회생법무사",
  ].filter(exists);

  const skip = new Set([...priority1, ...priority2]);
  const renun = all
    .filter((p) => /상속포기/.test(p.path) && ok(p.path) && !skip.has(p.path))
    .map((p) => p.path)
    .sort((a, b) => a.localeCompare(b, "ko"));
  const limited = all
    .filter(
      (p) =>
        /한정승인/.test(p.path) &&
        !/특별/.test(p.path) &&
        ok(p.path) &&
        !skip.has(p.path),
    )
    .map((p) => p.path)
    .sort((a, b) => a.localeCompare(b, "ko"));

  const exclude = [
    "/부산상속전문법무사",
    "/부산상속등기전문법무사",
    "/부산한정승인전문법무사",
    "/부산상속포기전문법무사",
  ];

  const lines = [
    "# 다옴법무사사무소.kr — 2026-09-20 재수집/색인 요청",
    "# 전제: 대상 키워드는 이미 최상위 자산으로 본다. title/H1 재작성 없음.",
    "# Search Advisor URL 검사·수집요청용. noindex URL은 넣지 않는다.",
    "",
    "# === 1. 최우선 (오늘 본문이 바뀐 대표 URL) ===",
    ...priority1.map(abs),
    "",
    "# === 2. 이어서 (지원 페이지·허브) ===",
    ...priority2.map(abs),
    "",
    "# === 3. 상속포기 지역/지원 (관할·템플릿 누출 수정, 대표는 /부산상속포기) ===",
    ...renun.map(abs),
    "",
    "# === 4. 한정승인 지역/지원 (관할 수정, 대표는 /부산한정승인) ===",
    ...limited.map(abs),
    "",
    "# === 제출하지 않음 (noindex + canonical 허브) ===",
    ...exclude.map((p) => `# SKIP ${abs(p)}`),
  ];

  const out = path.join(process.cwd(), "seo/naver-index-2026-09-20.txt");
  fs.writeFileSync(out, `${lines.join("\n")}\n`, "utf8");
  console.log(`wrote ${out}`);
  console.log(`p1=${priority1.length} p2=${priority2.length} renun=${renun.length} limited=${limited.length}`);
}

main();
