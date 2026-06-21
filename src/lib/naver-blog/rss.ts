import type { NaverBlogFeed, NaverBlogPost } from "@/lib/naver-blog/types";

function extractTag(block: string, tag: string): string {
  const cdata = new RegExp(
    `<${tag}><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>`,
  ).exec(block);
  if (cdata) return cdata[1].trim();

  const plain = new RegExp(`<${tag}>([^<]*)<\\/${tag}>`).exec(block);
  return plain?.[1]?.trim() ?? "";
}

function stripHtml(html: string): string {
  return html
    .replace(/<img[^>]*>/gi, "")
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function parseNaverBlogRss(xml: string, maxPosts = 8): NaverBlogPost[] {
  const items: NaverBlogPost[] = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match: RegExpExecArray | null;

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

export function extractNaverBlogId(blogUrl: string): string {
  const match = blogUrl.match(/blog\.naver\.com\/([^/?#]+)/i);
  return match?.[1] ?? "law-yoon-91";
}

export async function fetchNaverBlogRssXml(blogId: string): Promise<string> {
  const url = `https://rss.blog.naver.com/${blogId}.xml`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        Accept: "application/rss+xml, application/xml, text/xml, */*",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`네이버 RSS 요청 실패 (HTTP ${response.status})`);
    }

    return response.text();
  } finally {
    clearTimeout(timeout);
  }
}

export async function fetchNaverBlogFeed(options?: {
  blogUrl?: string;
  maxPosts?: number;
}): Promise<NaverBlogFeed> {
  const blogUrl =
    options?.blogUrl?.trim() ||
    process.env.NEXT_PUBLIC_NAVER_BLOG?.trim() ||
    "https://blog.naver.com/law-yoon-91";
  const maxPosts = options?.maxPosts ?? Number.parseInt(
    process.env.NAVER_BLOG_FETCH_LIMIT ?? "8",
    10,
  );
  const blogId = extractNaverBlogId(blogUrl);
  const xml = await fetchNaverBlogRssXml(blogId);
  const items = parseNaverBlogRss(xml, maxPosts);

  return {
    blogUrl,
    blogId,
    rssUrl: `https://rss.blog.naver.com/${blogId}.xml`,
    fetchedAt: new Date().toISOString(),
    items,
  };
}
