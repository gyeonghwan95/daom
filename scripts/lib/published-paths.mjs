import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();

export const staticRoutes = [
  "/",
  "/about",
  "/office",
  "/services",
  "/situations",
  "/tools",
  "/busan-legal-map",
  "/glossary",
  "/blog",
  "/reviews",
  "/faq",
  "/media",
  "/contact",
  "/contact/inquiry",
  "/location",
  "/search-guides",
  "/search",
];

const toolSlugs = [
  "inheritance-registration-deadline",
  "inheritance-renunciation-deadline",
  "director-change-penalty-deadline",
  "head-office-move-deadline",
  "jeonse-deposit-timeline",
  "payment-order-fee-check",
  "real-estate-documents-check",
  "rehab-income-debt-check",
];

const glossarySlugs = [
  "inheritance-registration",
  "inheritance-renunciation",
  "qualified-acceptance",
  "special-qualified-acceptance",
  "inheritance-division-agreement",
  "statutory-reserve-share",
  "legal-inheritance-order",
  "subrogation-inheritance",
  "mortgage",
  "provisional-attachment",
  "attachment",
  "pledge",
  "jeonse-right",
  "lease-registration-order",
  "ownership-transfer-registration",
  "ownership-preservation-registration",
  "registration-license-tax",
  "acquisition-tax",
  "stamp-duty",
  "service-fee",
  "payment-order",
  "certified-mail",
  "complaint",
  "answer-brief",
  "personal-rehabilitation",
  "personal-bankruptcy",
  "discharge",
  "company-establishment-registration",
  "director-change-registration",
  "head-office-move-registration",
  "purpose-change-registration",
  "dissolution-registration",
  "liquidation-registration",
];

const situationSlugs = [
  "parent-passed-away",
  "siblings-not-cooperating",
  "inheritance-unknown-debt",
  "real-estate-sale-registration",
  "jeonse-deposit-unpaid",
  "corporate-officer-address-change",
  "payment-order-certified-mail",
  "personal-rehabilitation-bankruptcy",
  "상속재산-조회",
  "상속포기-한정승인-선택",
  "상속등기-지연-과태료",
  "해외-거주-상속인",
  "집주인-연락-두절",
  "임차권등기명령-필요할-때",
  "전세-경매-진행",
  "전입신고-확정일자-없음",
  "잔금-후-소유권이전-거부",
  "공동명의-정리",
  "근저당-말소-지연",
  "셀프등기-실수",
  "급여-압류-빚",
  "개인회생-가능-여부",
  "보증채무-부담",
  "빚-감당-어려울-때",
  "임원-임기-만료",
  "법인-설립-처음",
  "대표자-사망-법인",
  "본점-이전-등기",
  "대여금-못-받음",
  "채무자-재산-모름",
  "공사대금-못-받음",
  "판결-후-강제집행",
  "계약금-반환-분쟁",
  "중고거래-분쟁",
  "내용증명-받았을-때",
  "손해배상-청구",
];

const situationCategoryHubPaths = [
  "/situations/분류/가족-사망-상속",
  "/situations/분류/전세-임대차-보증금",
  "/situations/분류/부동산-매매-증여-등기",
  "/situations/분류/개인채무-회생-파산",
  "/situations/분류/법인-사업-운영",
  "/situations/분류/돈을-받지-못한-경우",
  "/situations/분류/계약-일상-분쟁",
];

const serviceSlugs = [
  "inheritance-registration",
  "inheritance-renunciation",
  "qualified-acceptance",
  "real-estate-registration",
  "ownership-transfer",
  "corporate-registration",
  "company-establishment",
  "director-change",
  "personal-rehabilitation",
  "bankruptcy",
];

const pressSlugs = [
  "busan-ilbo-bar-association-64th-general-assembly",
  "kukje-sinmun-bar-association-64th-general-assembly",
  "beopryul-sinmun-bar-association-64th-general-assembly",
];

export function normalizeRouteSlug(raw) {
  const trimmed = String(raw).trim();
  if (!trimmed) return trimmed;

  let decoded = trimmed;
  try {
    if (/%[0-9A-Fa-f]{2}/.test(trimmed)) {
      decoded = decodeURIComponent(trimmed);
    }
  } catch {
    decoded = trimmed;
  }

  return decoded.normalize("NFC");
}

function readSlugsFromDir(dir, exclude = ["_template"]) {
  const full = path.join(ROOT, dir);
  if (!fs.existsSync(full)) return [];
  return fs
    .readdirSync(full)
    .filter((f) => f.endsWith(".mdx") && !exclude.some((e) => f.startsWith(e)))
    .map((f) => f.replace(/\.mdx$/, ""));
}

function readLandingSlugs() {
  const config = fs.readFileSync(
    path.join(ROOT, "src/lib/local-landing/config.ts"),
    "utf8",
  );
  const expansion = fs.readFileSync(
    path.join(ROOT, "src/lib/local-landing/expansion/config-expansion.ts"),
    "utf8",
  );
  const keywordConfigPath = path.join(
    ROOT,
    "src/lib/local-landing/keyword-landing-config.ts",
  );
  const selectionConfigPath = path.join(
    ROOT,
    "src/lib/local-landing/selection-landing-config.ts",
  );
  const searchIntentConfigPath = path.join(
    ROOT,
    "src/lib/local-landing/search-intent-landing-config.ts",
  );
  const searchIntentSeedsPath = path.join(
    ROOT,
    "src/lib/local-landing/search-intent/seeds.ts",
  );
  const neighborhoodConfigPath = path.join(
    ROOT,
    "src/lib/local-landing/neighborhood-hub-config.ts",
  );
  const lectureLandingConfigPath = path.join(
    ROOT,
    "src/lib/lectures/landing-config.ts",
  );
  const lectureContentPath = path.join(
    ROOT,
    "src/lib/lectures/content.ts",
  );
  const lectureExpansionPath = path.join(
    ROOT,
    "src/lib/lectures/content-institution-expansion.ts",
  );
  const businessContentPath = path.join(
    ROOT,
    "src/lib/business/content.ts",
  );
  const businessLandingConfigPath = path.join(
    ROOT,
    "src/lib/business/landing-config.ts",
  );
  const b2bPagesDir = path.join(ROOT, "src/lib/b2b/pages");
  const keyword =
    fs.existsSync(keywordConfigPath)
      ? fs.readFileSync(keywordConfigPath, "utf8")
      : "";
  const selection =
    fs.existsSync(selectionConfigPath)
      ? fs.readFileSync(selectionConfigPath, "utf8")
      : "";
  const searchIntent =
    fs.existsSync(searchIntentConfigPath)
      ? fs.readFileSync(searchIntentConfigPath, "utf8")
      : "";
  const searchIntentSeeds =
    fs.existsSync(searchIntentSeedsPath)
      ? fs.readFileSync(searchIntentSeedsPath, "utf8")
      : "";
  const neighborhood =
    fs.existsSync(neighborhoodConfigPath)
      ? fs.readFileSync(neighborhoodConfigPath, "utf8")
      : "";
  const lectureLanding =
    fs.existsSync(lectureLandingConfigPath)
      ? fs.readFileSync(lectureLandingConfigPath, "utf8")
      : "";
  const lectureContent =
    fs.existsSync(lectureContentPath)
      ? fs.readFileSync(lectureContentPath, "utf8")
      : "";
  const lectureExpansion =
    fs.existsSync(lectureExpansionPath)
      ? fs.readFileSync(lectureExpansionPath, "utf8")
      : "";
  const businessContent =
    fs.existsSync(businessContentPath)
      ? fs.readFileSync(businessContentPath, "utf8")
      : "";
  const businessLanding =
    fs.existsSync(businessLandingConfigPath)
      ? fs.readFileSync(businessLandingConfigPath, "utf8")
      : "";
  let b2bPages = "";
  if (fs.existsSync(b2bPagesDir)) {
    b2bPages = fs
      .readdirSync(b2bPagesDir)
      .filter((f) => f.endsWith(".ts"))
      .map((f) => fs.readFileSync(path.join(b2bPagesDir, f), "utf8"))
      .join("\n");
  }
  const slugs = [
    ...(config.match(/slug:\s*"([^"]+)"/g) ?? []),
    ...(expansion.match(/slug:\s*"([^"]+)"/g) ?? []),
    ...(keyword.match(/slug:\s*"([^"]+)"/g) ?? []),
    ...(selection.match(/slug:\s*"([^"]+)"/g) ?? []),
    ...(searchIntent.match(/slug:\s*"([^"]+)"/g) ?? []),
    ...(searchIntentSeeds.match(/slug:\s*"([^"]+)"/g) ?? []),
    ...(neighborhood.match(/slug:\s*"([^"]+)"/g) ?? []),
    ...(lectureLanding.match(/slug:\s*"([^"]+)"/g) ?? []),
    ...(lectureContent.match(/slug:\s*"([^"]+)"/g) ?? []),
    ...(lectureExpansion.match(/slug:\s*"([^"]+)"/g) ?? []),
    ...(businessContent.match(/slug:\s*"([^"]+)"/g) ?? []),
    ...(businessLanding.match(/slug:\s*"([^"]+)"/g) ?? []),
    ...(b2bPages.match(/slug:\s*"([^"]+)"/g) ?? []),
  ].map((m) => m.replace(/slug:\s*"/, "").replace(/"$/, ""));
  return [...new Set(slugs.map((slug) => normalizeRouteSlug(slug)))];
}

function readTopicHubSlugs() {
  const hubFile = path.join(ROOT, "src/lib/topic-hubs/config.ts");
  if (!fs.existsSync(hubFile)) return [];
  const hubs = fs.readFileSync(hubFile, "utf8");
  return [
    ...new Set(
      (hubs.match(/slug:\s*"([^"]+)"/g) ?? []).map((m) =>
        normalizeRouteSlug(m.replace(/slug:\s*"/, "").replace(/"$/, "")),
      ),
    ),
  ];
}

function readNaverBlogExternalPaths() {
  const jsonPath = path.join(ROOT, "public/data/naver-blog-posts.json");
  if (!fs.existsSync(jsonPath)) return [];
  const data = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
  return (data.items ?? [])
    .map((item) => {
      const match = item.link?.match(/\/(\d+)(?:\?|$)/);
      return match ? `/blog/external/${match[1]}` : null;
    })
    .filter(Boolean);
}

function readLectureHistoryPaths() {
  const historyPath = path.join(ROOT, "src/data/lectures/history.ts");
  if (!fs.existsSync(historyPath)) return ["/강의이력"];
  const text = fs.readFileSync(historyPath, "utf8");
  const slugs = [
    ...text.matchAll(/slug:\s*"([^"]+)"/g),
  ].map((match) => normalizeRouteSlug(match[1]));
  return [
    "/강의이력",
    ...[...new Set(slugs)].map((slug) => `/강의이력/${slug}`),
  ];
}

function readSeoLandingPaths() {
  const manifest = path.join(ROOT, "scripts/output/seo-landing-manifest.json");
  if (!fs.existsSync(manifest)) return [];
  const data = JSON.parse(fs.readFileSync(manifest, "utf8"));
  return (data.paths ?? []).map((routePath) => normalizeRouteSlug(routePath));
}

function readDiagnosisSlugs() {
  const slugs = new Set();
  const dataDir = path.join(ROOT, "src/data");
  const mainFile = path.join(dataDir, "diagnosis.ts");
  const pagesDir = path.join(dataDir, "diagnosis-pages");

  if (fs.existsSync(mainFile)) {
    const text = fs.readFileSync(mainFile, "utf8");
    if (text.includes('slug: "자가진단"')) {
      slugs.add(normalizeRouteSlug("자가진단"));
    }
  }

  if (fs.existsSync(pagesDir)) {
    for (const file of fs.readdirSync(pagesDir)) {
      if (!file.endsWith(".ts")) continue;
      const text = fs.readFileSync(path.join(pagesDir, file), "utf8");

      for (const match of text.matchAll(/slug:\s*"([^"]+자가진단)"/g)) {
        slugs.add(normalizeRouteSlug(match[1]));
      }

      for (const match of text.matchAll(
        /simplifiedDiagnosis\(\s*[^,]+,\s*"([^"]+자가진단)"/g,
      )) {
        slugs.add(normalizeRouteSlug(match[1]));
      }

      for (const match of text.matchAll(
        /baseRealEstate\(\s*[^,]+,\s*"([^"]+자가진단)"/g,
      )) {
        slugs.add(normalizeRouteSlug(match[1]));
      }
    }
  }

  return [...slugs];
}

/** 색인·검증용 전체 공개 경로 (site-routes.ts와 동일 구성) */
export function getAllPublishedPaths() {
  const blogSlugs = readSlugsFromDir("src/content/blog");
  const caseSlugs = readSlugsFromDir("src/content/cases");
  const faqSlugs = readSlugsFromDir("src/content/faq");
  const landingSlugs = readLandingSlugs();
  const topicHubSlugs = readTopicHubSlugs();
  const diagnosisSlugs = readDiagnosisSlugs();
  const seoLandingPaths = readSeoLandingPaths();
  const naverBlogPaths = readNaverBlogExternalPaths();
  const lectureHistoryPaths = readLectureHistoryPaths();

  const caseRegionPaths = readCaseRegionPaths();
  const nationwidePaths = [
    "/전국업무",
    "/전국상속등기",
    "/전국유증등기",
    "/여러지역상속부동산등기",
    "/전국법인본점이전등기",
    "/전국공동담보등기",
  ];

  return [
    ...staticRoutes,
    ...diagnosisSlugs.map((slug) => `/${slug}`),
    ...landingSlugs.map((slug) => `/${slug}`),
    ...topicHubSlugs.map((slug) => `/${slug}`),
    ...seoLandingPaths,
    ...situationSlugs.map((slug) => `/situations/${slug}`),
    ...situationCategoryHubPaths,
    ...toolSlugs.map((slug) => `/tools/${slug}`),
    ...glossarySlugs.map((slug) => `/glossary/${slug}`),
    ...serviceSlugs.map((slug) => `/services/${slug}`),
    ...blogSlugs.map((slug) => `/blog/${slug}`),
    ...caseSlugs.map((slug) => `/services/cases/${slug}`),
    ...faqSlugs.map((slug) => `/faq/${slug}`),
    ...pressSlugs.map((slug) => `/media/${slug}`),
    ...naverBlogPaths,
    ...lectureHistoryPaths,
    "/cases",
    ...caseSlugs.map((slug) => `/cases/${slug}`),
    ...caseRegionPaths,
    ...nationwidePaths,
    "/press",
    ...pressSlugs.map((slug) => `/press/${slug}`),
  ];
}

/** /업무사례/* 지역 랜딩 경로 */
function readCaseRegionPaths() {
  const dir = path.join(ROOT, "src/lib/case-regions");
  if (!fs.existsSync(dir)) return [];

  const paths = new Set([
    "/업무사례",
    "/업무사례/지역별",
    "/업무사례/업무별",
    "/업무사례/부산법무사",
  ]);

  const districtsPath = path.join(dir, "districts.ts");
  if (fs.existsSync(districtsPath)) {
    const text = fs.readFileSync(districtsPath, "utf8");
    for (const match of text.matchAll(/slug:\s*"([^"]+법무사)"/g)) {
      paths.add(`/업무사례/${match[1]}`);
    }
    for (const block of text.matchAll(/dongs:\s*\[([\s\S]*?)\]/g)) {
      for (const name of block[1].matchAll(/"([^"]+)"/g)) {
        paths.add(`/업무사례/부산${name[1]}법무사`);
      }
    }
    for (const block of text.matchAll(/adminDongs:\s*\[([\s\S]*?)\]/g)) {
      for (const name of block[1].matchAll(/"([^"]+)"/g)) {
        paths.add(`/업무사례/부산${name[1]}법무사`);
      }
    }
  }

  for (const file of ["living-areas.ts", "industrial.ts", "courts.ts"]) {
    const filePath = path.join(dir, file);
    if (!fs.existsSync(filePath)) continue;
    const text = fs.readFileSync(filePath, "utf8");
    for (const match of text.matchAll(/slug:\s*"([^"]+법무사)"/g)) {
      paths.add(`/업무사례/${match[1]}`);
    }
  }

  // 전국·지역 상속등기 랜딩 (nationwide-cases)
  // city()/metro() 헬퍼는 published:true 고정. service-defs는 published:false면 제외.
  const nationwideDir = path.join(ROOT, "src/lib/nationwide-cases");
  if (fs.existsSync(nationwideDir)) {
    for (const file of [
      "service-defs.ts",
      "metro-defs.ts",
      "city-defs.ts",
    ]) {
      const filePath = path.join(nationwideDir, file);
      if (!fs.existsSync(filePath)) continue;
      const text = fs.readFileSync(filePath, "utf8");

      if (file === "service-defs.ts") {
        for (const chunk of text.split(/\},\s*\{/)) {
          const slugMatch = chunk.match(/slug:\s*"([^"]+)"/);
          if (!slugMatch) continue;
          if (/published:\s*false/.test(chunk)) continue;
          paths.add(`/업무사례/${slugMatch[1]}`);
        }
      } else {
        for (const match of text.matchAll(/^\s*slug:\s*"([^"]+)"/gm)) {
          paths.add(`/업무사례/${match[1]}`);
        }
      }
    }
  }

  // 경남 전용 랜딩 (gyeongnam-cases) — published:true 만
  const gyeongnamDir = path.join(ROOT, "src/lib/gyeongnam-cases");
  if (fs.existsSync(gyeongnamDir)) {
    for (const file of ["phase1-defs.ts", "phase2-defs.ts"]) {
      const filePath = path.join(gyeongnamDir, file);
      if (!fs.existsSync(filePath)) continue;
      const text = fs.readFileSync(filePath, "utf8");
      for (const chunk of text.split(/\},\s*(?:draft\()?\{/)) {
        const slugMatch = chunk.match(/slug:\s*"([^"]+)"/);
        if (!slugMatch) continue;
        if (/published:\s*false/.test(chunk)) continue;
        // phase2 draft() defaults published false — skip if file is phase2
        if (file === "phase2-defs.ts") continue;
        paths.add(`/업무사례/${slugMatch[1]}`);
      }
    }
    // phase1: all slugs (helper forces published true)
    const phase1 = path.join(gyeongnamDir, "phase1-defs.ts");
    if (fs.existsSync(phase1)) {
      const text = fs.readFileSync(phase1, "utf8");
      for (const match of text.matchAll(/^\s*slug:\s*"([^"]+)"/gm)) {
        paths.add(`/업무사례/${match[1]}`);
      }
    }
  }

  // 울산·대구·경북 전용 랜딩 (southeast-cases) — published:true 만
  const southeastDir = path.join(ROOT, "src/lib/southeast-cases");
  if (fs.existsSync(southeastDir)) {
    for (const file of [
      "ulsan-phase1.ts",
      "daegu-phase1.ts",
      "gyeongbuk-phase1.ts",
      "phase2-defs.ts",
    ]) {
      const filePath = path.join(southeastDir, file);
      if (!fs.existsSync(filePath)) continue;
      if (file === "phase2-defs.ts") continue;
      const text = fs.readFileSync(filePath, "utf8");
      for (const match of text.matchAll(/^\s*slug:\s*"([^"]+)"/gm)) {
        paths.add(`/업무사례/${match[1]}`);
      }
    }
  }

  return [...paths];
}

/** out/ 폴더에서 기대하는 상대 경로 */
export function pathToOutCandidates(routePath) {
  if (routePath === "/") {
    return ["index.html"];
  }

  const segments = routePath.split("/").filter(Boolean);
  const decodedSegments = segments.map((segment) => normalizeRouteSlug(segment));
  const encodedSegments = segments.map((segment) =>
    encodeURIComponent(normalizeRouteSlug(segment)),
  );

  const bases = [...new Set([decodedSegments.join("/"), encodedSegments.join("/")])];
  const candidates = [];

  for (const base of bases) {
    candidates.push(`${base}.html`);
    candidates.push(`${base}/index.html`);
  }

  return [...new Set(candidates)];
}
