import fs from "node:fs";
import path from "node:path";
import {
  EMPTY_NAVER_BLOG_FEED,
  type NaverBlogFeed,
} from "@/lib/naver-blog/types";

const PUBLIC_DATA_PATH = path.join(
  process.cwd(),
  "public/data/naver-blog-posts.json",
);
const LEGACY_DATA_PATH = path.join(
  process.cwd(),
  "src/data/naver-blog-posts.json",
);

function normalizeFeed(raw: unknown): NaverBlogFeed {
  if (!raw || typeof raw !== "object") return EMPTY_NAVER_BLOG_FEED;
  const data = raw as Partial<NaverBlogFeed>;
  return {
    blogUrl: data.blogUrl ?? EMPTY_NAVER_BLOG_FEED.blogUrl,
    blogId: data.blogId ?? EMPTY_NAVER_BLOG_FEED.blogId,
    rssUrl: data.rssUrl,
    fetchedAt: data.fetchedAt ?? null,
    items: Array.isArray(data.items) ? data.items : [],
  };
}

export function getNaverBlogDataPaths() {
  return { publicPath: PUBLIC_DATA_PATH, legacyPath: LEGACY_DATA_PATH };
}

export function readNaverBlogFeedFromDisk(): NaverBlogFeed {
  for (const filePath of [PUBLIC_DATA_PATH, LEGACY_DATA_PATH]) {
    if (!fs.existsSync(filePath)) continue;
    try {
      return normalizeFeed(JSON.parse(fs.readFileSync(filePath, "utf8")));
    } catch {
      continue;
    }
  }
  return EMPTY_NAVER_BLOG_FEED;
}

export function writeNaverBlogFeedToDisk(feed: NaverBlogFeed): {
  persisted: boolean;
  path: string;
} {
  const payload = `${JSON.stringify(feed, null, 2)}\n`;
  fs.mkdirSync(path.dirname(PUBLIC_DATA_PATH), { recursive: true });
  fs.writeFileSync(PUBLIC_DATA_PATH, payload, "utf8");

  try {
    fs.mkdirSync(path.dirname(LEGACY_DATA_PATH), { recursive: true });
    fs.writeFileSync(LEGACY_DATA_PATH, payload, "utf8");
  } catch {
    // legacy mirror is best-effort
  }

  return { persisted: true, path: PUBLIC_DATA_PATH };
}
