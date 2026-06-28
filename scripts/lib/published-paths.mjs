import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();

export const staticRoutes = [
  "/",
  "/about",
  "/office",
  "/services",
  "/blog",
  "/reviews",
  "/faq",
  "/media",
  "/contact",
  "/location",
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
  const slugs = [
    ...(config.match(/slug:\s*"([^"]+)"/g) ?? []),
    ...(expansion.match(/slug:\s*"([^"]+)"/g) ?? []),
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

  return [
    ...staticRoutes,
    ...diagnosisSlugs.map((slug) => `/${slug}`),
    ...landingSlugs.map((slug) => `/${slug}`),
    ...topicHubSlugs.map((slug) => `/${slug}`),
    ...seoLandingPaths,
    ...serviceSlugs.map((slug) => `/services/${slug}`),
    ...blogSlugs.map((slug) => `/blog/${slug}`),
    ...caseSlugs.map((slug) => `/services/cases/${slug}`),
    ...faqSlugs.map((slug) => `/faq/${slug}`),
    ...pressSlugs.map((slug) => `/media/${slug}`),
    ...naverBlogPaths,
    "/cases",
    ...caseSlugs.map((slug) => `/cases/${slug}`),
    "/press",
    ...pressSlugs.map((slug) => `/press/${slug}`),
  ];
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
