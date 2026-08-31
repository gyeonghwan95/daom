/**
 * 지역 페이지 치환형 상용구 검사.
 * Usage: npx --yes tsx scripts/check-region-boilerplate.ts
 */
import { getAllPageData } from "../src/lib/pageData/registry";

const PATTERNS = [
  "등기·상속·법인·채무 문제로 법무사를 찾으시는 분들이 많습니다",
  "막연히 인터넷 정보만으로 진행하다 보면",
  "부동산 가액·가족 관계·채무 유무에 따라",
  "에서 상담한 사례입니다",
  "실제 상담 사례",
  "의뢰인 상황에 맞춰 필요 서류·예상 기간·비용을 단계별로 안내",
  "관할 등기소·법원을 사전에 확인하지 않으면",
  "상황은 생각보다 다양합니다",
  "막막한 경우가 많습니다",
  "전 지역 · 방문 없이 가능",
  "부산에 방문하지 않아도 업무를 끝까지 진행할 수 있습니다",
];

function main() {
  const hits: string[] = [];
  for (const page of getAllPageData()) {
    if (page.category !== "local") continue;
    const body = [
      page.intro,
      ...page.introParagraphs,
      ...page.sections.map((section) => `${section.title} ${section.body}`),
    ].join("\n");
    for (const pattern of PATTERNS) {
      if (body.includes(pattern)) {
        hits.push(`${page.path}: ${pattern}`);
      }
    }
  }

  console.log("=== Region boilerplate ===");
  console.log(`hits: ${hits.length}`);
  if (hits.length) {
    for (const hit of hits.slice(0, 30)) console.error(`[boilerplate] ${hit}`);
    process.exit(1);
  }
  console.log("OK — flagged region boilerplate sentences not found.");
}

main();
