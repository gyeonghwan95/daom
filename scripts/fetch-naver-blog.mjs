#!/usr/bin/env node
/**
 * 네이버 블로그 RSS → public/data/naver-blog-posts.json
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const PUBLIC_DATA_PATH = path.join(ROOT, "public/data/naver-blog-posts.json");
const LEGACY_DATA_PATH = path.join(ROOT, "src/data/naver-blog-posts.json");
const DEFAULT_BLOG_URL =
  process.env.NEXT_PUBLIC_NAVER_BLOG?.trim() ||
  "https://blog.naver.com/law-yoon-91";
const MAX_POSTS = Number.parseInt(process.env.NAVER_BLOG_FETCH_LIMIT ?? "8", 10);

function extractNaverBlogId(blogUrl) {
  const match = blogUrl.match(/blog\.naver\.com\/([^/?#]+)/i);
  return match?.[1] ?? "law-yoon-91";
}

function extractTag(block, tag) {
  const cdata = new RegExp(
    `<${tag}><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>`,
  ).exec(block);
  if (cdata) return cdata[1].trim();

  const plain = new RegExp(`<${tag}>([^<]*)<\\/${tag}>`).exec(block);
  return plain?.[1]?.trim() ?? "";
}

function stripHtml(html) {
  return html
    .replace(/<img[^>]*>/gi, "")
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function parseNaverBlogRss(xml, maxPosts = 8) {
  const items = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;

  while ((match = itemRegex.exec(xml)) !== null) {
    const block = match[1];
    const title = extractTag(block, "title");
    const link = extractTag(block, "link");
    if (!title || !link) continue;

    const category = extractTag(block, "category");
    items.push({
      title,
      link,
      description: stripHtml(extractTag(block, "description")).slice(0, 200),
      pubDate: extractTag(block, "pubDate"),
      category: category || undefined,
    });
  }

  return items.slice(0, maxPosts);
}

function readExistingFeed() {
  for (const filePath of [PUBLIC_DATA_PATH, LEGACY_DATA_PATH]) {
    if (!fs.existsSync(filePath)) continue;
    try {
      return JSON.parse(fs.readFileSync(filePath, "utf8"));
    } catch {
      continue;
    }
  }

  const blogId = extractNaverBlogId(DEFAULT_BLOG_URL);
  return {
    blogUrl: DEFAULT_BLOG_URL,
    blogId,
    rssUrl: `https://rss.blog.naver.com/${blogId}.xml`,
    fetchedAt: null,
    items: [],
  };
}

function writeFeed(feed) {
  const payload = `${JSON.stringify(feed, null, 2)}\n`;
  fs.mkdirSync(path.dirname(PUBLIC_DATA_PATH), { recursive: true });
  fs.writeFileSync(PUBLIC_DATA_PATH, payload, "utf8");

  fs.mkdirSync(path.dirname(LEGACY_DATA_PATH), { recursive: true });
  fs.writeFileSync(LEGACY_DATA_PATH, payload, "utf8");

  return PUBLIC_DATA_PATH;
}

async function fetchNaverBlogFeed() {
  const blogId = extractNaverBlogId(DEFAULT_BLOG_URL);
  const rssUrl = `https://rss.blog.naver.com/${blogId}.xml`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(rssUrl, {
      signal: controller.signal,
      headers: {
        Accept: "application/rss+xml, application/xml, text/xml, */*",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const xml = await response.text();
    const items = parseNaverBlogRss(xml, MAX_POSTS);

    return {
      blogUrl: DEFAULT_BLOG_URL,
      blogId,
      rssUrl,
      fetchedAt: new Date().toISOString(),
      items,
    };
  } finally {
    clearTimeout(timeout);
  }
}

async function main() {
  const fallback = readExistingFeed();

  try {
    const feed = await fetchNaverBlogFeed();
    const outputPath = writeFeed(feed);
    console.log(`Fetched ${feed.items.length} Naver blog posts → ${outputPath}`);
  } catch (error) {
    console.warn(
      `Naver blog RSS fetch failed (${error instanceof Error ? error.message : error}). Keeping previous data.`,
    );
    if (fallback.items.length === 0) {
      writeFeed(fallback);
    }
    process.exitCode = 1;
  }
}

main();
