/**
 * 정적 export(out/)의 대표 이미지·캐러셀 계약 검증 (2026-10-10 현재 설계 기준).
 * 1) 대표 이미지: og:image·twitter:image·primaryImageOfPage가 resolveCarouselOgImage(SERP 1:1 우선, 없으면 승인 캐러셀) 결과와 같다.
 * 2) 캐러셀: data-related-content="carousel" 카드의 링크 순서가 ItemList(position·url)와 같고, 카드 이미지 파일이 public/에 있다.
 * 2026-09-23 이전 설계(캐러셀 1200×800을 OG로 사용, 고정 허브 카드 목록)는 더 이상 검사하지 않는다.
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import {
  CORPORATE_IMAGE_OWNER_URLS,
  REAL_ESTATE_IMAGE_OWNER_URLS,
} from "../src/data/seo/carousel-image-manifest";
import { resolveCarouselOgImage } from "../src/lib/seo/carousel-images";

const ORIGIN = "https://xn--2j1br1na42lvxja38mk8r.kr";
const OUT = path.join(process.cwd(), "out");
const PUBLIC = path.join(process.cwd(), "public");
const failures: string[] = [];
const decode = (s: string) => {
  try {
    return decodeURIComponent(s);
  } catch {
    return s;
  }
};

function htmlFor(pageUrl: string): string | null {
  const a = path.join(OUT, `${pageUrl.slice(1)}.html`);
  if (existsSync(a)) return readFileSync(a, "utf8");
  const b = path.join(OUT, pageUrl.slice(1), "index.html");
  return existsSync(b) ? readFileSync(b, "utf8") : null;
}

// 1) 대표 이미지
const owners = [...REAL_ESTATE_IMAGE_OWNER_URLS, ...CORPORATE_IMAGE_OWNER_URLS];
for (const pageUrl of owners) {
  const html = htmlFor(pageUrl);
  if (!html) {
    failures.push(`${pageUrl}: export HTML 없음`);
    continue;
  }
  const expected = resolveCarouselOgImage(pageUrl);
  if (!expected) {
    failures.push(`${pageUrl}: 대표 이미지 규칙 결과 없음`);
    continue;
  }
  const abs = `${ORIGIN}${expected.src}`;
  for (const fragment of [
    `<meta property="og:image" content="${abs}"/>`,
    `<meta name="twitter:image" content="${abs}"/>`,
    `"primaryImageOfPage":{"@type":"ImageObject","url":"${abs}"}`,
  ]) {
    if (!html.includes(fragment)) failures.push(`${pageUrl}: 대표 이미지 신호 불일치 (${fragment.slice(0, 40)}…)`);
  }
}

// 2) 캐러셀 ↔ ItemList
let carousels = 0;
const walk = (dir: string): string[] =>
  readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory()
      ? e.name.startsWith("_next")
        ? []
        : walk(path.join(dir, e.name))
      : e.name.endsWith(".html")
        ? [path.join(dir, e.name)]
        : [],
  );
for (const file of walk(OUT)) {
  const html = readFileSync(file, "utf8");
  const at = html.indexOf('data-related-content="carousel"');
  if (at < 0) continue;
  carousels++;
  const route = "/" + path.relative(OUT, file).split(path.sep).join("/").replace(/\.html$/, "");
  const seg = html.slice(at, html.indexOf("</section>", at));
  const cards = [...seg.matchAll(/<li\b[\s\S]*?<\/li>/g)].map((m) => ({
    href: decode((m[0].match(/href="([^"]+)"/) || [])[1] ?? ""),
    img: decode((m[0].match(/<img[^>]*?src="([^"]+)"/) || [])[1] ?? ""),
  }));
  // 한 페이지에 ItemList가 여러 개일 수 있어(예: 업무사례 글 목록) 첫 카드 링크와 맞는 목록을 고른다.
  type ItemList = { "@type"?: string; itemListElement?: Array<{ position: number; url: string }> };
  const lists = [...html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)]
    .map((m) => {
      try {
        return JSON.parse(m[1]) as ItemList;
      } catch {
        return null;
      }
    })
    .filter((o): o is ItemList => Boolean(o && o["@type"] === "ItemList"));
  const firstHref = cards[0]?.href.replace(/\/$/, "");
  const listJson =
    lists.find((l) => decode(l.itemListElement?.[0]?.url.replace(ORIGIN, "") ?? "").replace(/\/$/, "") === firstHref) ??
    lists[0];
  const elements = listJson?.itemListElement ?? [];
  if (elements.length !== cards.length) {
    failures.push(`${route}: 카드 ${cards.length}개 ↔ ItemList ${elements.length}개`);
    continue;
  }
  cards.forEach((card, i) => {
    const el = elements[i];
    const url = decode(el.url.replace(ORIGIN, "")) || "/";
    if (el.position !== i + 1 || url.replace(/\/$/, "") !== card.href.replace(/\/$/, "")) {
      failures.push(`${route}: ${i + 1}번 카드 링크 ↔ ItemList 불일치 (${card.href} vs ${url})`);
    }
    const imgPath = (card.img.match(/[?&]url=([^&]+)/)?.[1] ? decode(card.img.match(/[?&]url=([^&]+)/)![1]) : card.img).split("?")[0];
    if (!imgPath || !existsSync(path.join(PUBLIC, imgPath.replace(/^\//, "")))) {
      failures.push(`${route}: ${i + 1}번 카드 이미지 파일 없음 (${imgPath})`);
    }
  });
}

if (failures.length) {
  console.error(failures.slice(0, 30).join("\n"));
  console.error(`[verify-exported-carousel-images] FAIL ${failures.length}건 (대표 ${owners.length}쪽, 캐러셀 ${carousels}개)`);
  process.exit(1);
}
console.log(`[verify-exported-carousel-images] OK — 대표 이미지 ${owners.length}쪽, 캐러셀 ${carousels}개`);
