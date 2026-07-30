/**
 * 네이버 검색 의도 SEO 전수 진단 (1차).
 * 입력: page-manifest, sitemap-manifest, seo-pages-manifest
 * 출력: JSON/CSV + docs/seo 매핑·분류·승인 목록
 *
 * URL 삭제·redirect·canonical·noindex는 자동 적용하지 않음.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, "scripts/output");
const DOCS = path.join(ROOT, "docs/seo");

const KEYWORD_TO_URL = [
  {
    primaryKeyword: "부산 법무사",
    primaryUrl: "/부산법무사",
    intent: "부산에서 법무사 업무를 언제·어떻게 의뢰할지 안내하는 지역 종합 허브",
    competitors: ["/부산법무사추천", "/부산법무사무소", "/부산법무사상담"],
  },
  {
    primaryKeyword: "부산 한정승인 법무사",
    primaryUrl: "/부산한정승인",
    intent: "상속채무 우려 시 한정승인 판단·3개월 기한·절차",
    competitors: ["/한정승인자가진단", "/situations/inheritance-unknown-debt"],
  },
  {
    primaryKeyword: "부산 개인회생 법무사",
    primaryUrl: "/부산개인회생법무사",
    intent: "소득·채무·재산으로 개인회생 신청 가능성 판단",
    competitors: ["/부산개인회생", "/부산개인회생법무사추천", "/부산회생법무사"],
  },
  {
    primaryKeyword: "부산 상속 법무사",
    primaryUrl: "/부산상속법무사",
    intent: "상속등기·포기·한정승인 중 무엇부터 할지 선택 허브",
    competitors: ["/부산상속전문법무사", "/부산상속법무사추천"],
  },
  {
    primaryKeyword: "부산 상속등기 법무사",
    primaryUrl: "/부산상속등기",
    intent: "상속부동산 명의이전 등기 절차·서류",
    competitors: ["/부산상속등기전문"],
  },
  {
    primaryKeyword: "부산 법인등기 법무사",
    primaryUrl: "/부산법인등기",
    intent: "설립·임원·본점·목적·자본·해산 등 기업등기 허브",
    competitors: ["/부산법인법무사", "/부산법인등기전문"],
  },
  {
    primaryKeyword: "부산 법인 법무사",
    primaryUrl: "/부산법인법무사",
    intent: "법인 업무 상담·선택 기준(대표는 /부산법인등기)",
    competitors: ["/부산법인등기"],
  },
  {
    primaryKeyword: "부산 부동산등기 법무사",
    primaryUrl: "/부산부동산등기",
    intent: "매매·증여 등 부동산등기 실무",
    competitors: ["/부산부동산등기법무사", "/부산부동산등기전문", "/부산등기법무사"],
  },
  {
    primaryKeyword: "부산 회사등기",
    primaryUrl: "/부산법인등기",
    intent: "회사·상업등기 실무(법인등기와 동일 대표)",
    competitors: ["/부산법인설립등기"],
  },
  {
    primaryKeyword: "부산 기업등기",
    primaryUrl: "/부산법인등기",
    intent: "기업 변경등기 포함 법인등기",
    competitors: ["/부산임원변경등기", "/부산본점이전등기"],
  },
  {
    primaryKeyword: "부산 상업등기",
    primaryUrl: "/부산법인등기",
    intent: "상업등기(법인등기) 실무",
    competitors: [],
  },
  {
    primaryKeyword: "부산 등기 법무사",
    primaryUrl: "/부산등기법무사",
    intent: "부동산·상속·법인등기 비교 허브",
    competitors: ["/부산부동산등기", "/부산법인등기"],
  },
];

/** 핵심·잠식 클러스터 수동 분류 (전수 휴리스틱 + 우선 페이지) */
const MANUAL_CLASS = {
  "/부산법무사": "IMPROVE",
  "/부산한정승인": "IMPROVE",
  "/부산개인회생법무사": "IMPROVE",
  "/부산상속법무사": "IMPROVE",
  "/부산법인등기": "IMPROVE",
  "/부산상속등기": "IMPROVE",
  "/부산부동산등기": "IMPROVE",
  "/부산상속포기": "IMPROVE",
  "/부산임원변경등기": "KEEP",
  "/부산법인설립등기": "IMPROVE",
  "/부산본점이전등기": "IMPROVE",
  "/부산신축건물보존등기": "KEEP",
  "/부산건물멸실등기": "KEEP",
  "/부산임차권등기명령": "KEEP",
  "/부산지방법원지급명령": "IMPROVE",
  "/부산법인법무사": "REPOSITION",
  "/부산법인등기전문": "REPOSITION",
  "/부산상속전문법무사": "MERGE-CANDIDATE",
  "/부산상속등기전문": "REPOSITION",
  "/부산부동산등기법무사": "MERGE-CANDIDATE",
  "/부산부동산등기전문": "REPOSITION",
  "/부산등기법무사": "REPOSITION",
  "/부산개인회생": "REPOSITION",
  "/부산개인회생법무사추천": "REPOSITION",
  "/부산회생법무사": "MERGE-CANDIDATE",
  "/부산법무사추천": "KEEP",
  "/부산법무사무소": "KEEP",
};

const APPROVAL_PENDING = [
  {
    action: "MERGE-검토",
    urls: ["/부산상속전문법무사", "/부산상속법무사"],
    note: "검색 의도가 거의 동일. 대표는 /부산상속법무사. redirect·canonical 변경은 승인 후.",
  },
  {
    action: "MERGE-검토",
    urls: ["/부산부동산등기법무사", "/부산부동산등기"],
    note: "대표 /부산부동산등기. 등기법무사 URL은 부동산 실무로 재정의 가능 여부 검토.",
  },
  {
    action: "MERGE-검토",
    urls: ["/부산회생법무사", "/부산개인회생법무사"],
    note: "회생=개인회생 동의어 잠식 가능. 대표 /부산개인회생법무사.",
  },
  {
    action: "REPOSITION-유지",
    urls: ["/부산법인법무사"],
    note: "법인 업무 상담·선택 페이지로 유지. primary는 /부산법인등기.",
  },
  {
    action: "REPOSITION-유지",
    urls: ["/부산개인회생"],
    note: "개인회생 업무 허브. 가능성 판단은 /부산개인회생법무사.",
  },
  {
    action: "noindex-검토-금지자동적용",
    urls: [],
    note: "이번 차수에서 noindex 자동 적용 없음. thin·동의어 페이지는 2차 본문 차별화 후 재판단.",
  },
];

function readJson(rel) {
  const p = path.join(ROOT, rel);
  if (!fs.existsSync(p)) return null;
  if (!rel.endsWith(".json")) return null;
  const raw = fs.readFileSync(p, "utf8").trim();
  if (!raw.startsWith("{") && !raw.startsWith("[")) return null;
  return JSON.parse(raw);
}

function tokenize(s) {
  return new Set(
    String(s || "")
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s]/gu, " ")
      .split(/\s+/)
      .filter((t) => t.length > 1),
  );
}

function jaccard(a, b) {
  if (!a.size || !b.size) return 0;
  let inter = 0;
  for (const t of a) if (b.has(t)) inter += 1;
  return inter / (a.size + b.size - inter);
}

function classifyPath(p, page) {
  if (MANUAL_CLASS[p]) return MANUAL_CLASS[p];
  const title = page?.metaTitle || page?.h1 || "";
  if (/전문/.test(title) && /부산/.test(p)) return "REPOSITION";
  if (/법무사상담$|안내 \|/.test(title) && /부산/.test(p)) return "IMPROVE";
  if (/해운대구|연제구|수영구|동래구|기장군|북구|사상구|금정구/.test(p)) {
    return "KEEP"; // 구 단위는 허브 흡수 후보이나 즉시 MERGE 금지
  }
  return "KEEP";
}

function guessPrimaryKeyword(p, page) {
  const map = KEYWORD_TO_URL.find((k) => k.primaryUrl === p);
  if (map) return map.primaryKeyword;
  const h1 = page?.h1 || "";
  const m = h1.match(/부산[\s\S]{0,20}법무사|부산[\s\S]{0,20}등기/);
  return m ? m[0].replace(/\s+/g, " ").trim() : "";
}

function hubFor(p) {
  if (/상속|한정승인|포기/.test(p)) return "/부산상속법무사";
  if (/법인|임원|본점|설립|해산|증자/.test(p)) return "/부산법인등기";
  if (/회생|파산/.test(p)) return "/부산개인회생법무사";
  if (/부동산|매매|소유권|증여|임차권|전세/.test(p)) return "/부산부동산등기";
  if (/법무사/.test(p)) return "/부산법무사";
  return "/부산법무사";
}

function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.mkdirSync(DOCS, { recursive: true });

  const pageManifest = readJson("scripts/output/page-manifest.json");
  const sitemapManifest = readJson("scripts/output/sitemap-manifest.json");
  const seoManifest = readJson("scripts/output/seo-pages-manifest.json");
  const bodyAudit = readJson("scripts/output/body-length-audit.json");

  const paths = pageManifest?.paths || [];
  const sitemapSet = new Set();
  const addSitemapPath = (raw) => {
    if (!raw) return;
    let p = String(raw);
    try {
      if (p.startsWith("http")) p = new URL(p).pathname;
    } catch {
      /* keep */
    }
    try {
      p = decodeURIComponent(p);
    } catch {
      /* keep */
    }
    if (!p.startsWith("/")) p = `/${p}`;
    sitemapSet.add(p);
  };

  for (const u of sitemapManifest?.urls || sitemapManifest?.paths || []) {
    addSitemapPath(typeof u === "string" ? u : u.path || u.loc);
  }
  if (sitemapManifest?.tiers) {
    for (const tier of Object.values(sitemapManifest.tiers)) {
      for (const entry of tier.urls || tier.paths || []) {
        addSitemapPath(typeof entry === "string" ? entry : entry?.path);
      }
    }
  }
  for (const e of sitemapManifest?.entries || []) {
    addSitemapPath(e.path || e.loc);
  }
  // common shape: { items: [{ path }] }
  for (const e of sitemapManifest?.items || []) {
    addSitemapPath(e.path || e.loc || e.url);
  }
  // scrape any path-like fields from sitemap manifest recursively (shallow)
  if (sitemapSet.size === 0 && sitemapManifest) {
    const stack = [sitemapManifest];
    while (stack.length) {
      const cur = stack.pop();
      if (!cur || typeof cur !== "object") continue;
      if (typeof cur.path === "string" && cur.path.startsWith("/")) {
        addSitemapPath(cur.path);
      }
      if (Array.isArray(cur)) {
        for (const x of cur) stack.push(x);
      } else {
        for (const v of Object.values(cur)) {
          if (v && typeof v === "object") stack.push(v);
        }
      }
    }
  }

  const seoByPath = new Map();
  const seoPages = seoManifest?.pages || seoManifest?.items || [];
  if (Array.isArray(seoPages)) {
    for (const page of seoPages) {
      if (page.path) seoByPath.set(page.path, page);
    }
  } else if (seoManifest && typeof seoManifest === "object") {
    // maybe { paths: [...], pages keyed }
    for (const [k, v] of Object.entries(seoManifest)) {
      if (v && typeof v === "object" && v.path) seoByPath.set(v.path, v);
      else if (k.startsWith("/") && v && v.metaTitle) seoByPath.set(k, v);
    }
  }

  // Flatten if seo-pages-manifest stores array at root with path fields mixed
  if (seoByPath.size === 0 && Array.isArray(seoManifest?.paths) === false) {
    const raw = fs.readFileSync(
      path.join(ROOT, "scripts/output/seo-pages-manifest.json"),
      "utf8",
    );
    // extract objects with "path": "/..."
    const re =
      /"path":\s*"(\/[^"]+)"[\s\S]*?"metaTitle":\s*"([^"]*)"[\s\S]*?"metaDescription":\s*"([^"]*)"[\s\S]*?"h1":\s*"([^"]*)"[\s\S]*?"canonical":\s*"([^"]*)"[\s\S]*?"faqCount":\s*(\d+)[\s\S]*?"internalLinkCount":\s*(\d+)/g;
    let m;
    while ((m = re.exec(raw))) {
      seoByPath.set(m[1], {
        path: m[1],
        metaTitle: m[2],
        metaDescription: m[3],
        h1: m[4],
        canonical: m[5],
        faqCount: Number(m[6]),
        internalLinkCount: Number(m[7]),
      });
    }
  }

  const shortBodies = new Set(
    (bodyAudit?.short || bodyAudit?.shortPages || []).map((x) =>
      typeof x === "string" ? x : x.path,
    ),
  );

  const titleGroups = new Map();
  const descGroups = new Map();
  for (const page of seoByPath.values()) {
    const t = page.metaTitle || "";
    const d = page.metaDescription || "";
    if (t) {
      if (!titleGroups.has(t)) titleGroups.set(t, []);
      titleGroups.get(t).push(page.path);
    }
    if (d) {
      if (!descGroups.has(d)) descGroups.set(d, []);
      descGroups.get(d).push(page.path);
    }
  }

  const duplicateTitles = [...titleGroups.entries()].filter(([, v]) => v.length > 1);
  const duplicateDescs = [...descGroups.entries()].filter(([, v]) => v.length > 1);

  // Similarity among priority Busan cluster
  const clusterPaths = [
    "/부산법무사",
    "/부산한정승인",
    "/부산개인회생법무사",
    "/부산상속법무사",
    "/부산법인등기",
    "/부산상속등기",
    "/부산법인법무사",
    "/부산상속전문법무사",
    "/부산개인회생",
    "/부산부동산등기",
    "/부산등기법무사",
  ];
  const simPairs = [];
  for (let i = 0; i < clusterPaths.length; i++) {
    for (let j = i + 1; j < clusterPaths.length; j++) {
      const a = seoByPath.get(clusterPaths[i]);
      const b = seoByPath.get(clusterPaths[j]);
      if (!a || !b) continue;
      const titleSim = jaccard(tokenize(a.metaTitle), tokenize(b.metaTitle));
      const h1Sim = jaccard(tokenize(a.h1), tokenize(b.h1));
      const descSim = jaccard(tokenize(a.metaDescription), tokenize(b.metaDescription));
      if (titleSim >= 0.45 || h1Sim >= 0.5 || descSim >= 0.55) {
        simPairs.push({
          a: clusterPaths[i],
          b: clusterPaths[j],
          titleSim: Number(titleSim.toFixed(3)),
          h1Sim: Number(h1Sim.toFixed(3)),
          descSim: Number(descSim.toFixed(3)),
        });
      }
    }
  }

  const rows = paths.map((p) => {
    const page = seoByPath.get(p) || null;
    const inSitemap = sitemapSet.size === 0 ? null : sitemapSet.has(p);
    const classification = classifyPath(p, page);
    return {
      url: p,
      httpStatus: "static-export-assumed-200",
      indexable: true,
      title: page?.metaTitle || "",
      h1: page?.h1 || "",
      metaDescription: page?.metaDescription || "",
      canonical: page?.canonical || `self:${p}`,
      bodyChars: shortBodies.has(p) ? "<1500(short-audit)" : page ? "see-body-audit" : "n/a",
      bodyParagraphs: null,
      cardListHeavy: /허브|목록|추천|비교/.test(page?.h1 || "") ? "possible" : "unknown",
      primaryKeyword: guessPrimaryKeyword(p, page),
      secondaryKeywords: "",
      searchIntent: KEYWORD_TO_URL.find((k) => k.primaryUrl === p)?.intent || "",
      parentHub: hubFor(p),
      inboundLinks: null,
      outboundLinks: page?.internalLinkCount ?? null,
      inSitemap,
      structuredData: "WebPage/Article-via-template",
      heroImageAlt: "n/a-in-manifest",
      titleDupGroupSize: page?.metaTitle
        ? titleGroups.get(page.metaTitle)?.length || 1
        : 1,
      classification,
      notes: shortBodies.has(p) ? "short-body" : "",
    };
  });

  const byClass = {};
  for (const r of rows) {
    byClass[r.classification] = (byClass[r.classification] || 0) + 1;
  }

  const audit = {
    generatedAt: new Date().toISOString(),
    totals: {
      paths: paths.length,
      seoMetadataCoverage: seoByPath.size,
      sitemapEntriesDetected: sitemapSet.size,
      classificationCounts: byClass,
      duplicateTitleGroups: duplicateTitles.length,
      duplicateDescriptionGroups: duplicateDescs.length,
      clusterSimilarityPairs: simPairs.length,
    },
    keywordToUrlMap: KEYWORD_TO_URL,
    approvalPending: APPROVAL_PENDING,
    clusterSimilarity: simPairs,
    duplicateTitles: duplicateTitles.slice(0, 40).map(([title, urls]) => ({
      title,
      count: urls.length,
      urls: urls.slice(0, 12),
    })),
    duplicateDescriptions: duplicateDescs.slice(0, 40).map(([description, urls]) => ({
      description: description.slice(0, 120),
      count: urls.length,
      urls: urls.slice(0, 12),
    })),
    priorityPages: rows.filter((r) => MANUAL_CLASS[r.url]),
    pages: rows,
  };

  fs.writeFileSync(
    path.join(OUT_DIR, "naver-intent-seo-audit.json"),
    JSON.stringify(audit, null, 2),
    "utf8",
  );

  const csvHeader = [
    "url",
    "classification",
    "title",
    "h1",
    "primaryKeyword",
    "parentHub",
    "inSitemap",
    "outboundLinks",
    "titleDupGroupSize",
    "notes",
  ];
  const csvLines = [csvHeader.join(",")];
  for (const r of rows) {
    csvLines.push(
      csvHeader
        .map((h) => {
          const v = r[h] ?? "";
          const s = String(v).replace(/"/g, '""');
          return `"${s}"`;
        })
        .join(","),
    );
  }
  fs.writeFileSync(
    path.join(OUT_DIR, "naver-intent-seo-audit.csv"),
    csvLines.join("\n"),
    "utf8",
  );

  const mapMd = [
    "# keyword-to-url-map",
    "",
    `생성일: ${audit.generatedAt}`,
    "",
    "| 주 키워드 | 대표 URL | 검색 의도 | 경쟁·잠식 후보 |",
    "|-----------|----------|-----------|----------------|",
    ...KEYWORD_TO_URL.map(
      (k) =>
        `| ${k.primaryKeyword} | \`${k.primaryUrl}\` | ${k.intent} | ${k.competitors.map((c) => `\`${c}\``).join(", ") || "—"} |`,
    ),
    "",
    "## 규칙",
    "",
    "- 페이지당 primary keyword 1개",
    "- 동일 의도 경쟁 URL은 REPOSITION 또는 MERGE-CANDIDATE (승인 전 redirect/canonical/noindex 금지)",
    "- title/H1에 입증 어려운 ‘전문’ 표현 사용 금지",
    "",
  ].join("\n");
  fs.writeFileSync(path.join(DOCS, "keyword-to-url-map.md"), mapMd, "utf8");

  const classMd = [
    "# 페이지 분류 (KEEP / IMPROVE / REPOSITION / MERGE-CANDIDATE / CREATE / TECH-FIX)",
    "",
    `생성일: ${audit.generatedAt}`,
    "",
    "## 집계",
    "",
    ...Object.entries(byClass).map(([k, v]) => `- **${k}**: ${v}`),
    "",
    "## 1차 우선 페이지",
    "",
    "| URL | 분류 | title | H1 |",
    "|-----|------|-------|-----|",
    ...audit.priorityPages.map(
      (r) =>
        `| \`${r.url}\` | ${r.classification} | ${r.title.replace(/\|/g, "/")} | ${r.h1.replace(/\|/g, "/")} |`,
    ),
    "",
    "## CREATE (사이트에 없거나 허브 흡수 권고 — 신규 thin 페이지 금지)",
    "",
    "- 부모 빚 상속 확인 → 기존 `/situations/inheritance-unknown-debt`·허브 FAQ로 흡수 권고",
    "- 한정승인 기간 경과 → 상황 페이지 2차 IMPROVE (신규 URL 남발 금지)",
    "- 급여소득자/자영업자 개인회생 → `/부산개인회생법무사` 섹션 + 2차 상황 페이지",
    "",
    "## TECH-FIX",
    "",
    "- Cloudflare Yeti 실응답: 배포 URL 샘플 점검 필요 (이번 로컬 진단에서는 미실행)",
    "- service-region 템플릿 페이지의 동일 description 패턴: 1차에서 대표 5URL 해소, 나머지는 2차",
    "",
    "## 클러스터 메타 유사도",
    "",
    ...simPairs.map(
      (p) =>
        `- \`${p.a}\` ↔ \`${p.b}\` title=${p.titleSim} h1=${p.h1Sim} desc=${p.descSim}`,
    ),
    "",
  ].join("\n");
  fs.writeFileSync(path.join(DOCS, "page-classification.md"), classMd, "utf8");

  const approvalMd = [
    "# 승인 대기 URL 조치 목록",
    "",
    "> redirect / canonical 변경 / noindex 는 **자동 적용하지 않음**. 승인 후에만 적용.",
    "",
    `생성일: ${audit.generatedAt}`,
    "",
    ...APPROVAL_PENDING.map(
      (a) =>
        `## ${a.action}\n\n- URLs: ${a.urls.map((u) => `\`${u}\``).join(", ") || "(해당 없음)"}\n- ${a.note}\n`,
    ),
    "",
  ].join("\n");
  fs.writeFileSync(
    path.join(DOCS, "approval-pending-url-actions.md"),
    approvalMd,
    "utf8",
  );

  console.log(
    JSON.stringify(
      {
        ok: true,
        paths: paths.length,
        seoCoverage: seoByPath.size,
        sitemap: sitemapSet.size,
        byClass,
        out: [
          "scripts/output/naver-intent-seo-audit.json",
          "scripts/output/naver-intent-seo-audit.csv",
          "docs/seo/keyword-to-url-map.md",
          "docs/seo/page-classification.md",
          "docs/seo/approval-pending-url-actions.md",
        ],
      },
      null,
      2,
    ),
  );
}

main();
