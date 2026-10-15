#!/usr/bin/env node
/** gallery-data.mjs → src/data/seo/page-gallery-cards.ts (이미지 속 문구와 alt·figcaption을 같은 데이터에서 만든다) */
import fs from "node:fs";
import path from "node:path";
import { GALLERY } from "./gallery-data.mjs";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1")), "../..");
const q = (s) => JSON.stringify(s);
const body = GALLERY.map((g) => {
  const items = g.cards
    .map((c) => `    { file: ${q(c.file)}, title: ${q(c.title.join(" "))}, sub: ${q(c.sub)} },`)
    .join("\n");
  return `  ${q(g.path)}: {\n  topic: ${q(g.cards[0].kicker)},\n  items: [\n${items}\n  ]},`;
}).join("\n");
const ts = `/**
 * 대표 페이지 본문 갤러리(1:1, 1200×1200) — 실제 사무소·법무사 사진 + 가운데 제목.
 * 생성: reports/naver-carousel-2026-10-15/build-gallery.mjs, 이 파일은 export-ts.mjs가 만든다(직접 수정 금지).
 * 이미지 속 문구(title·sub)는 alt와 figcaption에도 그대로 넣는다.
 */
export type PageGalleryItem = { file: string; title: string; sub: string };
export type PageGallery = { topic: string; items: PageGalleryItem[] };

export const PAGE_GALLERIES: Record<string, PageGallery> = {
${body}
};

export const galleryImageSrc = (file: string) => \`/image/cards/gallery/\${file}.jpg\`;

export function getPageGallery(path: string): PageGallery | undefined {
  return PAGE_GALLERIES[path];
}
`;
fs.writeFileSync(path.join(ROOT, "src/data/seo/page-gallery-cards.ts"), ts);
console.log("written", GALLERY.length);
