import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import {
  CAROUSEL_HUBS,
  CAROUSEL_IMAGE_MANIFEST,
  CORPORATE_IMAGE_OWNER_URLS,
  REAL_ESTATE_IMAGE_OWNER_URLS,
} from "../src/data/seo/carousel-image-manifest";

const ORIGIN = "https://xn--2j1br1na42lvxja38mk8r.kr";
const OUT = path.join(process.cwd(), "out");
const ownerUrls = [
  ...REAL_ESTATE_IMAGE_OWNER_URLS,
  ...CORPORATE_IMAGE_OWNER_URLS,
];

function fail(message: string): never {
  throw new Error(`[verify-exported-carousel-images] ${message}`);
}

function htmlFor(pageUrl: string): string {
  const file = path.join(OUT, `${pageUrl.slice(1)}.html`);
  if (!existsSync(file)) fail(`export HTML 없음: ${pageUrl}`);
  return readFileSync(file, "utf8");
}

function jsonLdObjects(html: string): Record<string, unknown>[] {
  const objects: Record<string, unknown>[] = [];
  for (const match of html.matchAll(
    /<script type="application\/ld\+json">([^<]+)<\/script>/g,
  )) {
    objects.push(JSON.parse(match[1]) as Record<string, unknown>);
  }
  return objects;
}

for (const pageUrl of ownerUrls) {
  const item = CAROUSEL_IMAGE_MANIFEST.find(
    (candidate) => candidate.pageUrl === pageUrl,
  );
  if (!item) fail(`manifest 항목 없음: ${pageUrl}`);

  const html = htmlFor(pageUrl);
  const absoluteImage = `${ORIGIN}${item.outputPath}`;
  const requiredFragments = [
    `<meta property="og:image" content="${absoluteImage}"/>`,
    '<meta property="og:image:width" content="1200"/>',
    '<meta property="og:image:height" content="800"/>',
    `<meta name="twitter:image" content="${absoluteImage}"/>`,
    `"primaryImageOfPage":{"@type":"ImageObject","url":"${absoluteImage}"}`,
    `src="${item.outputPath}"`,
  ];

  for (const fragment of requiredFragments) {
    if (!html.includes(fragment)) {
      fail(`${pageUrl}: 이미지 신호 누락 (${fragment.slice(0, 70)})`);
    }
  }
}

for (const hubUrl of ["/부산부동산등기", "/부산법인법무사"]) {
  const hub = CAROUSEL_HUBS.find((candidate) => candidate.hubUrl === hubUrl);
  if (!hub) fail(`허브 manifest 없음: ${hubUrl}`);

  const html = htmlFor(hubUrl);
  const itemList = jsonLdObjects(html).find(
    (object) => object["@type"] === "ItemList",
  );
  if (!itemList) fail(`${hubUrl}: ItemList 없음`);

  const elements = itemList.itemListElement as Array<Record<string, unknown>>;
  const items = hub.itemIds.map((id) => {
    const item = CAROUSEL_IMAGE_MANIFEST.find((candidate) => candidate.id === id);
    if (!item) fail(`${hubUrl}: 캐러셀 항목 없음 ${id}`);
    return item;
  });

  if (elements.length !== items.length) {
    fail(`${hubUrl}: 화면 카드와 ItemList 개수 불일치`);
  }
  items.forEach((item, index) => {
    const element = elements[index];
    if (
      element.position !== index + 1 ||
      element.name !== item.pageTitle ||
      element.url !== `${ORIGIN}${encodeURI(item.pageUrl)}` ||
      element.image !== `${ORIGIN}${item.outputPath}` ||
      !html.includes(`src="${item.outputPath}"`)
    ) {
      fail(
        `${hubUrl}: ${index + 1}번 카드와 ItemList 데이터 불일치 ` +
          `(actual=${JSON.stringify(element)})`,
      );
    }
  });
}

console.log(
  `[verify-exported-carousel-images] OK — owner ${ownerUrls.length}개, 허브 2개`,
);
