/**
 * 법인·기업 콘텐츠 클러스터 감사.
 * 실행: npx --yes tsx scripts/audit-corporate-content.ts
 */
import { corporateContentIntents } from "../src/data/seo/corporate-content-intents";
import { getAllCorporateSlugs } from "../src/lib/corporate-intent/content";
import { getAllKeywordTopicKeys } from "../src/lib/local-landing/keyword-topics";

type Issue = { level: "error" | "warn"; message: string };

function main() {
  const issues: Issue[] = [];
  const corporateSlugs = new Set(getAllCorporateSlugs());
  const keywordKeys = new Set(getAllKeywordTopicKeys());

  const createTargets = corporateContentIntents.filter(
    (i) => i.action === "create-new",
  );
  for (const intent of createTargets) {
    const slug = intent.targetUrl.replace(/^\//, "");
    if (!corporateSlugs.has(slug) && !keywordKeys.has(slug)) {
      issues.push({
        level: "error",
        message: `create-new 대상 페이지 미등록: ${intent.targetUrl} (${intent.id})`,
      });
    }
  }

  const primarySeen = new Map<string, string>();
  for (const intent of corporateContentIntents) {
    if (primarySeen.has(intent.primaryKeyword)) {
      issues.push({
        level: "warn",
        message: `primaryKeyword 중복: "${intent.primaryKeyword}" (${primarySeen.get(intent.primaryKeyword)} ↔ ${intent.id})`,
      });
    } else {
      primarySeen.set(intent.primaryKeyword, intent.id);
    }

    if (intent.action === "do-not-create") continue;

    if (!intent.targetUrl.startsWith("/")) {
      issues.push({
        level: "error",
        message: `${intent.id}: targetUrl 형식 오류`,
      });
    }
    if (
      (intent.action === "keep" ||
        intent.action === "strengthen-existing" ||
        intent.action === "merge-into-existing") &&
      intent.existingUrl
    ) {
      const slug = intent.existingUrl.replace(/^\//, "");
      // existing hubs may live outside corporate-intent module
      if (
        !corporateSlugs.has(slug) &&
        !keywordKeys.has(slug) &&
        ![
          "부산법인등기",
          "부산법인설립등기",
          "부산임원변경등기",
          "부산본점이전등기",
          "부산기업법률자문",
          "부산기업법무사",
          "부산기업채권관리",
          "부산기업부동산등기",
          "부산스타트업법무사",
          "부산지점설치등기",
          "부산지점폐지등기",
          "전국법인본점이전등기",
          "본점이전등기비용",
          "부산무상증자등기",
          "부산감자등기",
          "부산사업목적변경등기",
          "부산상호변경등기",
          "부산개인사업자법인전환",
          "부산법인해산전확인사항",
          "부산법인등기과태료",
          "지급명령자가진단",
          "민사소송",
          "창업법률교육",
        ].includes(slug)
      ) {
        issues.push({
          level: "warn",
          message: `${intent.id}: existingUrl 슬러그 미확인 ${intent.existingUrl}`,
        });
      }
    }
  }

  const doNotCreate = corporateContentIntents.filter(
    (i) => i.action === "do-not-create",
  );

  console.log("=== Corporate Content Cluster Audit ===");
  console.log(`intents: ${corporateContentIntents.length}`);
  console.log(`corporate-intent pages: ${corporateSlugs.size}`);
  console.log(`create-new: ${createTargets.length}`);
  console.log(`do-not-create: ${doNotCreate.length}`);
  console.log(
    `strengthen/merge/keep: ${
      corporateContentIntents.filter((i) =>
        ["keep", "strengthen-existing", "merge-into-existing"].includes(
          i.action,
        ),
      ).length
    }`,
  );

  const errors = issues.filter((i) => i.level === "error");
  const warns = issues.filter((i) => i.level === "warn");
  console.log(`errors: ${errors.length}, warnings: ${warns.length}`);
  for (const issue of issues) {
    console.log(`[${issue.level}] ${issue.message}`);
  }

  console.log("\n--- Intent → URL map ---");
  for (const intent of corporateContentIntents) {
    console.log(
      `${intent.action.padEnd(22)} ${intent.primaryKeyword} → ${intent.targetUrl}`,
    );
  }

  if (errors.length) process.exitCode = 1;
}

main();
