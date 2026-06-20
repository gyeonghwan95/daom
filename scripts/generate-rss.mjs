#!/usr/bin/env node
/**
 * 블로그 RSS 피드 생성 (static export용)
 * npm run prebuild 시 public/rss.xml 생성
 */
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://daom-law.com";
const BLOG_DIR = path.join(process.cwd(), "src/content/blog");
const OUT = path.join(process.cwd(), "public/rss.xml");

function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function getPosts() {
  if (!fs.existsSync(BLOG_DIR)) return [];

  return fs
    .readdirSync(BLOG_DIR)
    .filter((file) => file.endsWith(".mdx") && !file.startsWith("_"))
    .map((file) => {
      const slug = file.replace(/\.mdx$/, "");
      const raw = fs.readFileSync(path.join(BLOG_DIR, file), "utf8");
      const { data, content } = matter(raw);
      return {
        slug: String(data.slug ?? slug),
        title: String(data.title ?? slug),
        description: String(data.description ?? ""),
        date: String(data.date ?? new Date().toISOString().slice(0, 10)),
        content,
      };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

const posts = getPosts();
const lastBuild = new Date().toUTCString();

const items = posts
  .map((post) => {
    const link = `${SITE_URL}/blog/${post.slug}`;
    return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <description>${escapeXml(post.description)}</description>
    </item>`;
  })
  .join("\n");

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>다옴법무사사무소 법률 블로그</title>
    <link>${SITE_URL}/blog</link>
    <description>부산 해운대·센텀 다옴법무사사무소 안윤정 법무사의 상속·등기·회생 법률 정보</description>
    <language>ko</language>
    <lastBuildDate>${lastBuild}</lastBuildDate>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>
`;

fs.writeFileSync(OUT, xml, "utf8");
console.log(`Generated ${OUT} (${posts.length} posts)`);
