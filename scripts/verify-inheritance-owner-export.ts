import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const OUT = path.join(ROOT, "out");
const ORIGIN = "https://xn--2j1br1na42lvxja38mk8r.kr";

const owners = [
  {
    path: "/부산상속법무사",
    bodySignals: [
      "상속 절차를 정하기 전에",
      "해운대 아파트 상속등기",
      "채무 불명확 한정승인 상담",
      "채무 과다 상속포기 상담",
    ],
  },
  {
    path: "/부산상속포기",
    bodySignals: [
      "상속포기 판단 전에 확인할 내용",
      "상속포기 3개월 기한 확인 도구",
      "부산가정법원 상속포기 관할·접수 안내",
      "익명 상담 사례",
    ],
  },
] as const;

const bridges = [
  { path: "/부산상속전문법무사", owner: "/부산상속법무사" },
  { path: "/부산상속포기전문법무사", owner: "/부산상속포기" },
] as const;

function fail(message: string): never {
  throw new Error(`[inheritance-owner-export] ${message}`);
}

function readExport(routePath: string): string {
  const filePath = path.join(OUT, `${routePath.slice(1)}.html`);
  if (!fs.existsSync(filePath)) fail(`export 없음: ${routePath}`);
  return fs.readFileSync(filePath, "utf8");
}

function absoluteUrl(routePath: string): string {
  return new URL(routePath, ORIGIN).href;
}

function canonicalOf(html: string): string | undefined {
  return html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
}

function robotsOf(html: string): string {
  return (
    html.match(/<meta name="robots" content="([^"]+)"/)?.[1]?.toLowerCase() ??
    ""
  );
}

function jsonLdObjects(html: string): unknown[] {
  return [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
    .map((match) => {
      try {
        return JSON.parse(match[1]);
      } catch {
        fail("JSON-LD 파싱 실패");
      }
    })
    .flatMap((value) => (Array.isArray(value) ? value : [value]));
}

function collectStrings(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(collectStrings);
  if (value && typeof value === "object") {
    return Object.values(value).flatMap(collectStrings);
  }
  return [];
}

for (const owner of owners) {
  const html = readExport(owner.path);
  const expectedUrl = absoluteUrl(owner.path);
  const robots = robotsOf(html);
  if (canonicalOf(html) !== expectedUrl) {
    fail(`${owner.path} self-canonical 불일치`);
  }
  if (!robots.includes("index") || robots.includes("noindex")) {
    fail(`${owner.path} index,follow 아님: ${robots || "(없음)"}`);
  }
  for (const signal of owner.bodySignals) {
    if (!html.includes(signal)) fail(`${owner.path} 본문 신호 누락: ${signal}`);
  }
  const schemaStrings = jsonLdObjects(html).flatMap(collectStrings);
  if (!schemaStrings.some((value) => value === `${expectedUrl}#webpage`)) {
    fail(`${owner.path} WebPage @id 누락`);
  }
}

for (const bridge of bridges) {
  const html = readExport(bridge.path);
  const ownerUrl = absoluteUrl(bridge.owner);
  const bridgeUrl = absoluteUrl(bridge.path);
  const robots = robotsOf(html);
  if (canonicalOf(html) !== ownerUrl) {
    fail(`${bridge.path} owner canonical 불일치`);
  }
  if (!robots.includes("noindex") || !robots.includes("follow")) {
    fail(`${bridge.path} noindex,follow 아님: ${robots || "(없음)"}`);
  }
  const schemaStrings = jsonLdObjects(html).flatMap(collectStrings);
  if (schemaStrings.some((value) => value === bridgeUrl || value.startsWith(`${bridgeUrl}#`))) {
    fail(`${bridge.path}가 JSON-LD owner를 자기 URL로 주장함`);
  }
}

const sitemapPath = path.join(OUT, "sitemap.xml");
const sitemap = fs.readFileSync(sitemapPath, "utf8");
for (const owner of owners) {
  if (!sitemap.includes(absoluteUrl(owner.path))) {
    fail(`sitemap owner 누락: ${owner.path}`);
  }
}
for (const bridge of bridges) {
  if (sitemap.includes(absoluteUrl(bridge.path))) {
    fail(`sitemap에 noindex bridge 포함: ${bridge.path}`);
  }
}

console.log("[inheritance-owner-export] OK — owner/bridge HTML 및 sitemap 신호 일치");
