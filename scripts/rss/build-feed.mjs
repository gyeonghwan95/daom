#!/usr/bin/env node
/**
 * SEO 최적화 RSS 2.0 피드 생성
 * - 사이트 칼럼·FAQ·업무사례·언론보도·네이버 블로그 최신 글 통합
 * - content:encoded, dc:creator, category, enclosure, channel image
 */
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { getSiteUrl } from "../lib/site-url.mjs";
import {
  extractNaverPostId,
  getNaverBlogExternalPath,
} from "../lib/naver-blog-url.mjs";

const ROOT = process.cwd();
const CONTENT_ROOT = path.join(ROOT, "src/content");
const OUT = path.join(ROOT, "public/rss.xml");

const SITE = {
  name: "다옴법무사사무소",
  representative: "안윤정 법무사",
  url: getSiteUrl(),
  description:
    "부산 해운대·센텀 다옴법무사사무소 안윤정 법무사의 상속등기, 부동산등기, 법인등기, 개인회생·파산 법률 정보, FAQ, 업무 사례, 언론 보도.",
  blogLink: "/blog",
  logo: "/image/logo.png",
  keywords: [
    "부산 법무사",
    "해운대 법무사",
    "센텀 법무사",
    "상속등기",
    "부동산등기",
    "법인등기",
    "개인회생",
    "파산",
  ],
};

const MAX_ITEMS = 50;

const MDX_SOURCES = [
  {
    type: "blog",
    dir: "blog",
    basePath: "/blog",
    feedLabel: "칼럼",
    imageCandidates: (slug) => [
      `/image/blog/posts/${slug}.jpg`,
      "/image/blog/default-thumb.jpg",
    ],
  },
  {
    type: "faq",
    dir: "faq",
    basePath: "/faq",
    feedLabel: "FAQ",
    imageCandidates: () => ["/image/faq/cover.jpg", "/image/blog/default-thumb.jpg"],
  },
  {
    type: "cases",
    dir: "cases",
    basePath: "/services/cases",
    feedLabel: "업무사례",
    imageCandidates: (slug) => [
      `/image/cases/items/${slug}.jpg`,
      "/image/cases/default-thumb.jpg",
    ],
  },
];

const PRESS_IMAGE_BY_KEY = {
  busanIlbo260608: "/image/press/부산일보260608.jpg",
  kukjeSinmun260603: "/image/press/국제신문260603.jpg",
  beopryulSinmun260602: "/image/press/법률신문260602.png",
};

function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function toRfc822(dateInput) {
  const date = new Date(dateInput);
  if (Number.isNaN(date.getTime())) {
    return new Date().toUTCString();
  }
  return date.toUTCString();
}

function absoluteUrl(pathname) {
  if (pathname.startsWith("http")) {
    const url = new URL(pathname);
    if (url.origin !== new URL(SITE.url).origin) {
      throw new Error(`External URL is not allowed in RSS: ${pathname}`);
    }
    return pathname;
  }
  return `${SITE.url}${pathname.startsWith("/") ? pathname : `/${pathname}`}`;
}

function getMimeType(imagePath) {
  const lower = imagePath.toLowerCase();
  if (lower.endsWith(".png")) return "image/png";
  if (lower.endsWith(".webp")) return "image/webp";
  if (lower.endsWith(".gif")) return "image/gif";
  return "image/jpeg";
}

function getEnclosureLength(relativePath) {
  try {
    const normalized = relativePath.replace(/^\//, "");
    const filePath = path.join(ROOT, "public", normalized);
    if (fs.existsSync(filePath)) {
      return fs.statSync(filePath).size;
    }
  } catch {
    // fall through
  }
  return 0;
}

function publicFileExists(relativePath) {
  const normalized = relativePath.replace(/^\//, "");
  return fs.existsSync(path.join(ROOT, "public", normalized));
}

function resolveImageUrl(candidates) {
  for (const candidate of candidates) {
    if (publicFileExists(candidate)) {
      return {
        url: absoluteUrl(candidate),
        length: getEnclosureLength(candidate),
        type: getMimeType(candidate),
      };
    }
  }
  return null;
}

function toStringArray(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value.map(String);
  return [String(value)];
}

function markdownToExcerpt(markdown, maxLength = 1200) {
  const text = String(markdown)
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/^#+\s+/gm, "")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trim()}…`;
}

function buildContentEncoded(item) {
  const paragraphs = [];

  if (item.description) {
    paragraphs.push(`<p>${escapeXml(item.description)}</p>`);
  }

  if (item.bodyExcerpt) {
    paragraphs.push(`<p>${escapeXml(item.bodyExcerpt)}</p>`);
  }

  if (item.extraParagraphs?.length) {
    for (const paragraph of item.extraParagraphs.slice(0, 3)) {
      paragraphs.push(`<p>${escapeXml(paragraph)}</p>`);
    }
  }

  paragraphs.push(
    `<p><a href="${escapeXml(item.link)}" rel="bookmark">전문 보기: ${escapeXml(item.title)}</a></p>`,
  );

  return paragraphs.join("\n");
}

function loadMdxItems(source) {
  const dir = path.join(CONTENT_ROOT, source.dir);
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".mdx") && !file.startsWith("_"))
    .map((file) => {
      const fileSlug = file.replace(/\.mdx$/, "");
      const raw = fs.readFileSync(path.join(dir, file), "utf8");
      const { data, content } = matter(raw);
      const slug = String(data.slug ?? fileSlug);
      const link = absoluteUrl(`${source.basePath}/${slug}`);

      return {
        id: `${source.type}:${slug}`,
        title: String(data.title ?? slug),
        description: String(
          data.seoDescription ?? data.description ?? "",
        ),
        link,
        guid: link,
        date: String(data.date ?? new Date().toISOString().slice(0, 10)),
        author: String(data.author ?? SITE.representative),
        feedLabel: source.feedLabel,
        categories: [
          source.feedLabel,
          String(data.category ?? ""),
          ...toStringArray(data.tags),
          data.area ? String(data.area) : "",
        ].filter(Boolean),
        bodyExcerpt: markdownToExcerpt(content),
        imageUrl: resolveImageUrl(source.imageCandidates(slug)),
      };
    });
}

function loadPressArticles() {
  const filePath = path.join(ROOT, "src/lib/press-articles.ts");
  if (!fs.existsSync(filePath)) return [];

  const content = fs.readFileSync(filePath, "utf8");
  const blocks = content.match(/\{\s*\n\s*slug:[\s\S]*?\n\s*\},?/g) ?? [];

  return blocks
    .map((block) => {
      const slug = block.match(/slug:\s*"([^"]+)"/)?.[1];
      const title = block.match(/title:\s*"([^"]+)"/)?.[1];
      const publishedAt = block.match(/publishedAt:\s*"([^"]+)"/)?.[1];
      const source = block.match(/source:\s*"([^"]+)"/)?.[1];
      const seoDescription =
        block.match(/seoDescription:\s*\n\s*"([^"]+)"/)?.[1] ??
        block.match(/seoDescription:\s*"([^"]+)"/)?.[1] ??
        "";
      const imageKey = block.match(/image:\s*siteImages\.press\.(\w+)/)?.[1];
      const imagePath = imageKey ? PRESS_IMAGE_BY_KEY[imageKey] : null;

      if (!slug || !title || !publishedAt) return null;

      const paragraphs = [...block.matchAll(/"([^"]{40,})"/g)]
        .map((match) => match[1])
        .filter((text) => !text.includes("slug") && !text.includes("http"))
        .slice(-4);

      const link = absoluteUrl(`/media/${slug}`);

      return {
        id: `press:${slug}`,
        title: `[${source ?? "언론보도"}] ${title}`,
        description: seoDescription,
        link,
        guid: link,
        date: publishedAt,
        author: SITE.representative,
        feedLabel: "언론보도",
        categories: ["언론보도", source ?? "언론", "부산 법무사"],
        extraParagraphs: paragraphs,
        imageUrl: imagePath ? resolveImageUrl([imagePath]) : null,
      };
    })
    .filter(Boolean);
}

function loadNaverBlogItems() {
  const filePath = path.join(ROOT, "public/data/naver-blog-posts.json");
  if (!fs.existsSync(filePath)) return [];

  try {
    const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
    const items = Array.isArray(data.items) ? data.items : [];

    return items
      .slice(0, 8)
      .map((post) => {
        const postId = extractNaverPostId(post.link);
        if (!postId) return null;

        const internalPath = getNaverBlogExternalPath(postId);
        const link = absoluteUrl(internalPath);

        return {
          id: `naver:${postId}`,
          title: `[네이버 블로그] ${post.title}`,
          description: post.description || "",
          link,
          guid: link,
          date: post.pubDate || new Date().toISOString(),
          author: SITE.representative,
          feedLabel: "네이버 블로그",
          categories: ["네이버 블로그", post.category].filter(Boolean),
          bodyExcerpt: post.description || "",
          imageUrl: resolveImageUrl(["/image/blog/default-thumb.jpg"]),
        };
      })
      .filter(Boolean);
  } catch {
    return [];
  }
}

function getSortScore(item) {
  const timestamp = new Date(item.date).getTime();
  if (Number.isNaN(timestamp)) return 0;

  // 자사 도메인 콘텐츠(칼럼·FAQ·사례·언론·네이버 블로그 랜딩)를 최신성 판단 시 우선
  const ownContentBoost = 1000 * 60 * 60 * 24 * 21;
  return timestamp + ownContentBoost;
}

function collectFeedItems() {
  const items = [
    ...MDX_SOURCES.flatMap(loadMdxItems),
    ...loadPressArticles(),
    ...loadNaverBlogItems(),
  ];

  return items
    .sort((a, b) => getSortScore(b) - getSortScore(a))
    .slice(0, MAX_ITEMS);
}

function renderCategories(categories) {
  const unique = [...new Set(categories.filter(Boolean))];
  return unique
    .map((category) => `      <category>${escapeXml(category)}</category>`)
    .join("\n");
}

function renderItem(item) {
  const enclosure = item.imageUrl
    ? `      <enclosure url="${escapeXml(item.imageUrl.url)}" length="${item.imageUrl.length}" type="${escapeXml(item.imageUrl.type)}" />\n`
    : "";

  return `    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${escapeXml(item.link)}</link>
      <guid isPermaLink="true">${escapeXml(item.guid)}</guid>
      <pubDate>${toRfc822(item.date)}</pubDate>
      <description>${escapeXml(item.description)}</description>
      <content:encoded><![CDATA[${buildContentEncoded(item)}]]></content:encoded>
      <dc:creator>${escapeXml(item.author)}</dc:creator>
${renderCategories(item.categories)}
${enclosure}    </item>`;
}

export function buildRssXml() {
  const items = collectFeedItems();
  const lastBuildDate = items[0]
    ? toRfc822(items[0].date)
    : new Date().toUTCString();
  const channelLink = absoluteUrl(SITE.blogLink);
  const feedUrl = absoluteUrl("/rss.xml");
  const logoUrl = absoluteUrl(SITE.logo);

  const channelCategories = SITE.keywords
    .map((keyword) => `    <category>${escapeXml(keyword)}</category>`)
    .join("\n");

  const itemsXml = items.map(renderItem).join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:dc="http://purl.org/dc/elements/1.1/"
>
  <channel>
    <title>${escapeXml(`${SITE.name} — 법률 정보·FAQ·업무 사례`)}</title>
    <link>${escapeXml(channelLink)}</link>
    <description>${escapeXml(SITE.description)}</description>
    <language>ko-KR</language>
    <copyright>Copyright ${new Date().getFullYear()} ${escapeXml(SITE.name)}</copyright>
    <managingEditor>${escapeXml(SITE.representative)} (${escapeXml(SITE.url)})</managingEditor>
    <webMaster>${escapeXml(SITE.representative)} (${escapeXml(SITE.url)})</webMaster>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <pubDate>${lastBuildDate}</pubDate>
    <ttl>1440</ttl>
    <generator>daom-rss/2.0</generator>
    <docs>https://www.rssboard.org/rss-specification</docs>
    <image>
      <url>${escapeXml(logoUrl)}</url>
      <title>${escapeXml(SITE.name)}</title>
      <link>${escapeXml(absoluteUrl("/"))}</link>
    </image>
    <atom:link href="${escapeXml(feedUrl)}" rel="self" type="application/rss+xml" />
${channelCategories}
${itemsXml}
  </channel>
</rss>
`;
}

export function writeRssFeed(outputPath = OUT) {
  const xml = buildRssXml();
  fs.writeFileSync(outputPath, xml, "utf8");
  const itemCount = (xml.match(/<item>/g) ?? []).length;
  return { outputPath, itemCount };
}

if (import.meta.url === `file://${process.argv[1]?.replace(/\\/g, "/")}`) {
  const { outputPath, itemCount } = writeRssFeed();
  console.log(`Generated ${outputPath} (${itemCount} items)`);
}
