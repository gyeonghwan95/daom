import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const CONTENT = path.join(ROOT, "src/content");

/** YYYY-MM-DD — 알 수 없으면 null (lastmod 생략) */
export function formatLastmod(dateInput) {
  const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString().slice(0, 10);
}

function fileMtime(filePath) {
  try {
    if (!fs.existsSync(filePath)) return null;
    return formatLastmod(fs.statSync(filePath).mtime);
  } catch {
    return null;
  }
}

function isContentMdxFile(filename) {
  return filename.endsWith(".mdx") && !filename.startsWith("_");
}

function safeMatter(raw, filePath) {
  try {
    return matter(raw);
  } catch (err) {
    console.warn(
      `[sitemap:lastmod] skip invalid frontmatter in ${filePath}: ${err instanceof Error ? err.message : err}`,
    );
    return null;
  }
}

function mdxDate(dir, slug) {
  const dirPath = path.join(CONTENT, dir);
  if (!fs.existsSync(dirPath)) return null;
  for (const file of fs.readdirSync(dirPath)) {
    if (!isContentMdxFile(file)) continue;
    const filePath = path.join(dirPath, file);
    const raw = fs.readFileSync(filePath, "utf8");
    const parsed = safeMatter(raw, filePath);
    if (!parsed) continue;
    const { data } = parsed;
    const fileSlug = String(data.slug ?? file.replace(/\.mdx$/, ""));
    if (fileSlug === slug) {
      const date = data.date ?? data.updated ?? data.modified;
      if (date) return formatLastmod(String(date));
      return fileMtime(filePath);
    }
  }
  return null;
}

function pressDate(slug) {
  const filePath = path.join(ROOT, "src/lib/press-articles.ts");
  if (!fs.existsSync(filePath)) return null;
  const text = fs.readFileSync(filePath, "utf8");
  const blockRe = new RegExp(
    `slug:\\s*"${slug.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"[\\s\\S]*?publishedAt:\\s*"([^"]+)"`,
  );
  const match = text.match(blockRe);
  if (match?.[1]) return formatLastmod(match[1]);
  return fileMtime(filePath);
}

function slugFileMtime(relativeGlobDirs, slug) {
  let best = null;
  for (const relDir of relativeGlobDirs) {
    const dirPath = path.join(ROOT, relDir);
    if (!fs.existsSync(dirPath)) continue;
    for (const file of fs.readdirSync(dirPath)) {
      if (!file.endsWith(".ts")) continue;
      const filePath = path.join(dirPath, file);
      const text = fs.readFileSync(filePath, "utf8");
      if (text.includes(`slug: "${slug}"`) || text.includes(`slug:"${slug}"`)) {
        const m = fileMtime(filePath);
        if (m && (!best || m > best)) best = m;
      }
    }
  }
  return best;
}

const STATIC_PAGE_FILES = {
  "/": ["src/app/page.tsx", "src/content/blog"],
  "/about": ["src/app/about/page.tsx"],
  "/office": ["src/app/office/page.tsx"],
  "/location": ["src/app/location/page.tsx"],
  "/contact": ["src/app/contact/page.tsx"],
  "/contact/inquiry": ["src/app/contact/inquiry/page.tsx"],
  "/services": ["src/app/services/page.tsx"],
  "/faq": ["src/app/faq/page.tsx"],
  "/blog": ["src/app/blog/page.tsx"],
  "/media": ["src/lib/press-articles.ts"],
  "/업무사례": ["src/app/[landingSlug]/page.tsx", "src/lib/case-regions"],
};

/**
 * route path → lastmod (YYYY-MM-DD) | null
 * 빌드 시각을 쓰지 않고 콘텐츠·소스 파일 기준만 사용
 */
export function getLastmodForPath(routePath) {
  const blogMatch = routePath.match(/^\/blog\/([^/]+)$/);
  if (blogMatch) return mdxDate("blog", blogMatch[1]);

  const faqMatch = routePath.match(/^\/faq\/([^/]+)$/);
  if (faqMatch) return mdxDate("faq", faqMatch[1]);

  const caseMatch = routePath.match(/^\/services\/cases\/([^/]+)$/);
  if (caseMatch) return mdxDate("cases", caseMatch[1]);

  const mediaMatch = routePath.match(/^\/media\/([^/]+)$/);
  if (mediaMatch) return pressDate(mediaMatch[1]);

  const lectureMatch = routePath.match(/^\/강의이력\/([^/]+)$/);
  if (lectureMatch) {
    return slugFileMtime(["src/data/lectures", "src/lib/lectures"], lectureMatch[1]);
  }

  if (routePath.startsWith("/업무사례/")) {
    const slug = routePath.slice("/업무사례/".length);
    return slugFileMtime(
      [
        "src/lib/case-regions",
        "src/lib/nationwide-cases",
        "src/lib/gyeongnam-cases",
        "src/lib/southeast-cases",
      ],
      slug,
    );
  }

  if (routePath.startsWith("/situations/")) {
    return fileMtime(path.join(ROOT, "src/app/situations/[slug]/page.tsx"));
  }
  if (routePath.startsWith("/tools/")) {
    return fileMtime(path.join(ROOT, "src/app/tools/[slug]/page.tsx"));
  }
  if (routePath.startsWith("/glossary/")) {
    return fileMtime(path.join(ROOT, "src/app/glossary/[slug]/page.tsx"));
  }
  if (routePath.startsWith("/services/")) {
    return fileMtime(path.join(ROOT, "src/app/services/[slug]/page.tsx"));
  }

  if (routePath.includes("자가진단")) {
    const slug = routePath.slice(1);
    return slugFileMtime(["src/data/diagnosis-pages", "src/data"], slug);
  }

  const landingSlug = routePath.startsWith("/") ? routePath.slice(1) : routePath;
  if (landingSlug && !landingSlug.includes("/")) {
    const fromLanding = slugFileMtime(
      [
        "src/lib/local-landing",
        "src/lib/topic-hubs",
        "src/lib/nationwide",
        "src/lib/business",
        "src/lib/lectures",
        "src/lib/b2b/pages",
      ],
      landingSlug,
    );
    if (fromLanding) return fromLanding;
  }

  const staticFiles = STATIC_PAGE_FILES[routePath];
  if (staticFiles) {
    let best = null;
    for (const rel of staticFiles) {
      const full = path.join(ROOT, rel);
      if (fs.existsSync(full) && fs.statSync(full).isDirectory()) {
        for (const f of fs.readdirSync(full)) {
          if (f.endsWith(".mdx") && f.startsWith("_")) continue;
          const m = fileMtime(path.join(full, f));
          if (m && (!best || m > best)) best = m;
        }
      } else {
        const m = fileMtime(full);
        if (m && (!best || m > best)) best = m;
      }
    }
    if (best) return best;
  }

  return null;
}
