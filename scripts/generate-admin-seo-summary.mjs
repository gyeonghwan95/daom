/**
 * Build compact SEO summary for admin console from existing audit reports.
 * No estimated rankings. Missing reports → null fields.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const reportsDir = join(root, "reports/seo");
const protectedPath = join(root, "config/seo-protected-assets.json");
const out = join(root, "src/generated/admin-seo-summary.json");

function readJson(name) {
  const p = join(reportsDir, name);
  if (!existsSync(p)) return null;
  try {
    return JSON.parse(readFileSync(p, "utf8"));
  } catch {
    return null;
  }
}

const issues = [];
const regression = readJson("serp-regression-safety.json");
const meta = readJson("meta-descriptions.json");
const titles = readJson("title-patterns.json");
const cann = readJson("cannibalization-pairs.json");
const faq = readJson("faq-duplicates.json");
const localSim = readJson("local-content-similarity.json");
const searchCann = readJson("search-cannibalization-audit.json");
const indexability = readJson("indexability.json");

const reg = regression?.SEO_REGRESSION_SAFETY || regression;
if (reg) {
  if ((reg.removed || 0) > 0) {
    issues.push({
      id: "url-removed",
      severity: "critical",
      title: `공개 URL 삭제 ${reg.removed}건`,
      detail: "기존 URL이 snapshot에서 사라졌습니다.",
      count: reg.removed,
    });
  }
  if ((reg.protectedTitleChanges || 0) > 0) {
    issues.push({
      id: "protected-title",
      severity: "critical",
      title: `보호 페이지 Title 변경 ${reg.protectedTitleChanges}건`,
      detail: "SEO_PROTECTED title 변경이 감지되었습니다.",
      count: reg.protectedTitleChanges,
    });
  }
  if ((reg.protectedCanonicalChanges || 0) > 0) {
    issues.push({
      id: "protected-canonical",
      severity: "critical",
      title: `보호 페이지 Canonical 변경 ${reg.protectedCanonicalChanges}건`,
      detail: "SEO_PROTECTED canonical 변경이 감지되었습니다.",
      count: reg.protectedCanonicalChanges,
    });
  }
  if ((reg.noindexAdded || 0) > 0) {
    issues.push({
      id: "noindex",
      severity: "critical",
      title: `noindex 추가 ${reg.noindexAdded}건`,
      detail: "기존 공개 페이지에 noindex가 추가되었습니다.",
      count: reg.noindexAdded,
    });
  }
  if ((reg.sitemapUrlsRemoved || 0) > 0) {
    issues.push({
      id: "sitemap-removed",
      severity: "critical",
      title: `Sitemap URL 삭제 ${reg.sitemapUrlsRemoved}건`,
      detail: "sitemap에서 URL이 제거되었습니다.",
      count: reg.sitemapUrlsRemoved,
    });
  }
}

const dupDesc =
  meta?.duplicateExactDescriptions?.length ??
  (Array.isArray(meta?.duplicates) ? meta.duplicates.length : 0);
if (dupDesc > 0) {
  issues.push({
    id: "dup-description",
    severity: "warning",
    title: `중복 meta description ${dupDesc}건`,
    detail: "동일 description이 여러 페이지에 있습니다.",
    count: dupDesc,
    samples: (meta?.duplicates || meta?.duplicateExactDescriptions || [])
      .slice(0, 5)
      .map((d) =>
        typeof d === "string"
          ? d
          : d?.description || d?.path || JSON.stringify(d).slice(0, 80),
      ),
  });
}

const faqDup = faq?.exactQuestionDuplicates?.length || 0;
if (faqDup > 0) {
  issues.push({
    id: "faq-dup",
    severity: "warning",
    title: `FAQ 질문 중복 ${faqDup}건`,
    detail: "동일 FAQ 질문이 여러 페이지에 있습니다.",
    count: faqDup,
  });
}

const highRisk = localSim?.highRiskCount ?? localSim?.highRisk?.length ?? 0;
if (highRisk > 0) {
  issues.push({
    id: "local-similarity",
    severity: "warning",
    title: `지역 콘텐츠 유사도 고위험 ${highRisk}건`,
    detail: "지역 페이지 thin/clone 위험이 있습니다.",
    count: highRisk,
  });
}

const cannFlags =
  searchCann?.cannibalizationFlags?.length ||
  searchCann?.rows?.filter((r) => r.flag || r.risk)?.length ||
  0;
const curatedCann = cann?.curatedPairs?.length || 0;
if (cannFlags > 0 || curatedCann > 0) {
  issues.push({
    id: "cannibalization",
    severity: "info",
    title: `검색 카니발화 후보 ${Math.max(cannFlags, curatedCann)}건`,
    detail: "동일 의도 페이지 경쟁 가능성이 있습니다. 자동 삭제는 하지 않습니다.",
    count: Math.max(cannFlags, curatedCann),
  });
}

let protectedPages = [];
try {
  const cfg = JSON.parse(readFileSync(protectedPath, "utf8"));
  protectedPages = (cfg.pages || []).map((p) => ({
    path: p.url,
    level: p.protectionLevel || p.protection,
    role: p.role,
    risk: p.modificationRisk,
  }));
} catch {
  protectedPages = [];
}

const critical = issues.filter((i) => i.severity === "critical").length;
const warning = issues.filter((i) => i.severity === "warning").length;
const info = issues.filter((i) => i.severity === "info").length;

const summary = {
  generatedAt: new Date().toISOString(),
  source: "build-time reports/seo/* + config/seo-protected-assets.json",
  searchConsoleConnected: false,
  kpis: {
    publicUrls: reg?.existingUrls?.after ?? null,
    sitemapUrls: reg?.sitemapUrlsInFile ?? null,
    critical,
    warning,
    info,
    protectedPageCount: protectedPages.length,
    regressionOk: Boolean(reg ? (reg.removed || 0) === 0 && (reg.protectedTitleChanges || 0) === 0 : null),
  },
  issues,
  protectedPages: protectedPages.slice(0, 40),
  indexabilitySample: (indexability?.rows || []).slice(0, 10),
  notes: [
    "Search Console API 미연결 — impressions/clicks/순위는 표시하지 않습니다.",
    "이 요약은 빌드 시점 audit 보고서 기준입니다. 실시간 크롤 결과가 아닙니다.",
  ],
};

mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, JSON.stringify(summary, null, 0));
console.log(
  `admin-seo-summary: critical=${critical} warning=${warning} protected=${protectedPages.length} → ${out}`,
);
