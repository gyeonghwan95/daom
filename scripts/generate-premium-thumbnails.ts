/**
 * 프리미엄 썸네일 일괄 생성 — 로컬 사전 생성 전용.
 *
 * 대상(출력 경로는 기존과 같다 — URL 변경 없음):
 * - 본문 캐러셀(public/images/generated/carousel/**), 지역·키워드 훅(…/hooks)
 * - 대표 페이지 SERP·og(public/generated/serp/**), 사이트 캐러셀 카드(public/generated/thumbnails/**)
 * - 메인 갤러리(public/image/cards/gallery), 본문 텍스트 카드(public/image/cards/*.jpg)
 * - 페이지 공유용 og(public/image/og/*.jpg — 4:3 본문 기록 사진은 제외), 자료실 og(public/resources/og)
 * - --hero: 페이지별 4:3 대표 썸네일(public/image/og-pages, 대표 페이지는 public/image/hero) — 본문 시작·og:image·관련 카드
 * - 네이버 블로그 업로드용(reports/naver-15kw-2026-10-14/blog-editor-pack)
 *
 * - 원본 사진의 얼굴·몸은 변형하지 않는다(crop·톤 보정·타이포만).
 * - 사진별 얼굴 좌표(scripts/premium-thumbnails/faces.mjs)를 보고, 제목이 얼굴과 겹치지 않는 crop을 고른다.
 * - 제목은 가운데 높이에 크게, 서브타이틀 없음. 1:1·3:4·4:3·16:9 crop에서도 제목이 남도록 가운데 안전영역에만 둔다.
 * - 훅 연결 맵 src/data/seo/serp-hook-images.ts 와 검토용 reports/thumbnails/contact-sheet-*.jpg 를 함께 쓴다.
 *
 * Usage: npm run thumbnails:premium [-- --only=<출력경로 일부>] [-- --missing] [-- --dry] [-- --out-dir=<검토 폴더>] [-- --sheets]
 */
import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import sharp from "sharp";
import { CAROUSEL_IMAGE_MANIFEST } from "../src/data/seo/carousel-image-manifest";
import { SERP_OWNED_IMAGES } from "../src/data/seo/serp-carousel-images";
import { PAGE_VISUALS } from "../src/data/seo/page-visuals";
import { getAttorneyPhoto } from "../src/data/media/attorney-photo-inventory";
import { getThumbnailPortrait } from "../src/data/media/thumbnail-portraits";

const ROOT = process.cwd();
const PUBLIC = path.join(ROOT, "public");
const LIB = path.join(ROOT, "scripts", "premium-thumbnails");

type Job = {
  set: string;
  /** public 기준 경로("/…") 또는 저장소 기준 "reports/…" */
  out: string;
  src: string;
  title: string;
  /** COPY·PHOTO를 다른 출력과 같이 쓸 때(카드용 webp = SERP jpg와 같은 그림) */
  sameAs?: string;
  url?: string;
  width?: number;
  height?: number;
};

/** 글자가 이미 들어간 카드·축소본(og 4:3)을 원본 사진으로 되돌린다 */
const DERIVED_TO_ORIGINAL: Record<string, string> = {
  "/image/og/metro-daegu-4x3.jpg": "/image/썸네일-사무실_겨울 (3).jpg",
  "/image/og/metro-daejeon-4x3.jpg": "/image/썸네일-서류확인.jpg",
  "/image/og/priority-busan-consult.jpg": "/image/썸네일-사무실_전화중.jpg",
  "/image/og/priority-busan-recommend.jpg": "/image/썸네일-사무실_정면.jpg",
  "/image/og/regional-inheritance-geoje-4x3.jpg": "/image/썸네일-사무실_작업중.jpg",
  "/image/og/regional-inheritance-gumi-4x3.jpg": "/image/썸네일-사무실_가을 (3).jpg",
  "/image/og/regional-inheritance-gyeongju-4x3.jpg": "/image/썸네일-사무실_가을 (1).jpg",
  "/image/og/regional-inheritance-jinju-4x3.jpg": "/image/썸네일_사무실_서류검토_여름 (5).jpg",
  "/image/og/regional-inheritance-miryang-4x3.jpg": "/image/썸네일-사무실_겨울 (1).jpg",
  "/image/og/regional-inheritance-tongyeong-4x3.jpg": "/image/썸네일-사무실_겨울 (2).jpg",
  "/image/og/regional-inheritance-yangsan-4x3.jpg": "/image/썸네일-서류확인.jpg",
  "/image/og/ship-inheritance-4x3.jpg": "/image/썸네일-사무실_겨울 (3).jpg",
  "/image/상담-전화.png": "/image/썸네일-사무실_전화중.jpg",
  "/image/상담-대면.png": "/image/썸네일-상담협의.jpg",
};

async function buildJobs(): Promise<Job[]> {
  const gallery = await import(
    pathToFileURL(path.join(ROOT, "reports/naver-carousel-2026-10-15/gallery-data.mjs")).href
  );
  const cardsData = await import(
    pathToFileURL(path.join(ROOT, "reports/naver-15kw-2026-10-14/cards/cards-data.mjs")).href
  );
  const galleryPhoto: Record<string, string> = {};
  for (const g of gallery.GALLERY) {
    for (const c of g.cards) galleryPhoto[c.file] = `/image/${gallery.PHOTOS[c.photo].file}`;
  }
  const cardPhoto: Record<string, string> = {};
  for (const c of cardsData.CARDS) cardPhoto[c.id] = `/image/${c.photo}`;

  const serpSrc: Record<string, string> = {};
  for (const v of PAGE_VISUALS) {
    const p = getThumbnailPortrait(v.sourcePortrait as never) as { src?: string } | undefined;
    if (p?.src) serpSrc[v.representativeImage] = p.src;
  }

  function original(src: string): string {
    const s = decodeURIComponent(src);
    if (serpSrc[s]) return original(serpSrc[s]);
    let m = s.match(/^\/image\/cards\/gallery\/(.+)\.jpg$/);
    if (m && galleryPhoto[m[1]]) return galleryPhoto[m[1]];
    m = s.match(/^\/image\/cards\/([^/]+)\.jpg$/);
    if (m && cardPhoto[m[1]]) return cardPhoto[m[1]];
    return DERIVED_TO_ORIGINAL[s] ?? s;
  }

  const jobs: Job[] = [];
  for (const i of CAROUSEL_IMAGE_MANIFEST) {
    const src = (i.sourcePhotoId ? getAttorneyPhoto(i.sourcePhotoId)?.src : undefined) ?? i.sourcePhotoPath;
    if (!src) continue;
    jobs.push({ set: "carousel", out: i.outputPath, src: original(src), title: i.thumbnail?.title ?? i.headline });
  }
  for (const [url, o] of Object.entries(SERP_OWNED_IMAGES)) {
    const slug = url.replace(/^\//, "").replaceAll("/", "-") || "home";
    jobs.push({ set: "hook", url, out: `/images/generated/carousel/hooks/${slug}.webp`, src: original(o.src), title: o.headline });
  }
  for (const v of PAGE_VISUALS) {
    jobs.push({ set: "serp", url: v.url, out: v.representativeImage, src: original(v.representativeImage), title: v.cardHeadline });
    // 사이트 캐러셀 카드(SeoCarouselCard → resolvePageThumbnailSrc)용 — SERP 이미지와 같은 그림을 WebP로
    jobs.push({ set: "thumb", out: v.cardImage, src: original(v.representativeImage), title: v.cardHeadline, sameAs: v.representativeImage });
  }
  for (const g of gallery.GALLERY) {
    for (const c of g.cards) {
      jobs.push({ set: "gallery", out: `/image/cards/gallery/${c.file}.jpg`, src: galleryPhoto[c.file], title: c.title.join("\n") });
    }
  }
  const { EXTRA_JOBS } = await import(pathToFileURL(path.join(LIB, "extra-jobs.mjs")).href);
  for (const e of EXTRA_JOBS as { set: string; out: string; photo: string; title: string; width?: number; height?: number }[]) {
    jobs.push({ set: e.set, out: e.out, src: e.photo, title: e.title, width: e.width, height: e.height });
  }
  // 페이지별 og·본문 대표 이미지(같은 사진을 여러 페이지가 나눠 쓰던 곳을 페이지마다 다른 1:1 썸네일로)
  const pageOg = JSON.parse(readFileSync(path.join(LIB, "page-og.json"), "utf8")) as {
    url: string;
    out: string;
    photo: string;
    title: string;
  }[];
  for (const p of pageOg) jobs.push({ set: "page", url: p.url, out: p.out, src: p.photo, title: p.title });
  return jobs;
}

function diskPath(out: string): string {
  return out.startsWith("reports/") ? path.join(ROOT, out) : path.join(PUBLIC, out);
}

function formatOf(out: string): "jpg" | "png" | "webp" {
  if (/\.png$/i.test(out)) return "png";
  if (/\.jpe?g$/i.test(out)) return "jpg";
  return "webp";
}

/** Windows에서 에디터·백신이 파일을 잠깐 잡고 있으면 rename이 EPERM으로 실패한다 — 잠시 뒤 다시 시도 */
async function renameWithRetry(from: string, to: string) {
  for (let i = 0; ; i++) {
    try {
      renameSync(from, to);
      return;
    } catch (e) {
      if (i >= 8 || !/EPERM|EBUSY|EACCES/.test(String(e))) throw e;
      await new Promise((r) => setTimeout(r, 250 * (i + 1)));
    }
  }
}

/** 같은 사진을 여러 장에 나눠 쓸 때 출력 경로 기준으로 고정 배정 */
function hash(s: string): number {
  let h = 0;
  for (const ch of s) h = (h * 31 + ch.codePointAt(0)!) >>> 0;
  return h;
}

async function main() {
  const only = process.argv.find((a) => a.startsWith("--only="))?.slice(7);
  const dry = process.argv.includes("--dry");
  // 검토용: --out-dir=<폴더> 이면 public 대신 그 폴더에 평면 파일명으로 쓴다
  const outDir = process.argv.find((a) => a.startsWith("--out-dir="))?.slice(10);
  const { render } = await import(pathToFileURL(path.join(LIB, "render.mjs")).href);
  const { COPY, PHOTO, SUBST } = await import(pathToFileURL(path.join(LIB, "copy.mjs")).href);
  const { altFor } = await import(pathToFileURL(path.join(LIB, "photo-desc.mjs")).href);

  const allJobs = await buildJobs();
  // --sheets: 렌더링 없이 지금 파일들로 검토 시트만 다시 만든다
  if (process.argv.includes("--sheets")) {
    await writeContactSheets(allJobs.map((j) => ({ set: j.set, file: diskPath(j.out) })).filter((f) => existsSync(f.file)));
    console.log("contact sheets → reports/thumbnails");
    return;
  }
  const jobs = allJobs.filter((j) => !only || j.out.includes(only));
  const failed: string[] = [];
  const rendered: { set: string; file: string }[] = [];
  let done = 0;

  const resolve = (j: Job) => {
    const key = j.sameAs ?? j.out;
    let photo: string = PHOTO[key] ?? j.src;
    if (SUBST[photo]) photo = SUBST[photo][hash(key) % SUBST[photo].length];
    const title: string = COPY[key] ?? j.title;
    return { photo, title };
  };

  // --missing: 아직 없는 출력만 만든다(새 페이지를 추가했을 때)
  const onlyMissing = process.argv.includes("--missing");

  // --hero: 페이지 시작 4:3 대표 썸네일 — 같은 훅 문구, 지역·업무에 맞는 실제 사진
  if (process.argv.includes("--hero")) {
    await runHero(allJobs, resolve, { only, outDir, onlyMissing, dry, render });
    return;
  }
  for (const j of jobs) {
    // 페이지별 og(/image/og-pages)는 4:3 히어로가 같은 파일에 그린다(--hero) — 여기서 1:1로 덮어쓰지 않는다
    if (j.set === "page") continue;
    const { photo, title } = resolve(j);
    if (onlyMissing && !outDir && existsSync(diskPath(j.out))) continue;
    if (!existsSync(path.join(PUBLIC, photo))) {
      failed.push(`${j.out}: missing ${photo}`);
      continue;
    }
    try {
      const format = outDir ? "jpg" : formatOf(j.out);
      const { buf } = await render({ photo, title, format, width: j.width, height: j.height });
      if (outDir) {
        mkdirSync(outDir, { recursive: true });
        const name = j.out.split("/").pop()!.replace(/\.(webp|jpg|png)$/, "");
        writeFileSync(path.join(outDir, `${j.set}__${name}.jpg`), buf);
      } else if (!dry) {
        const disk = diskPath(j.out);
        mkdirSync(path.dirname(disk), { recursive: true });
        writeFileSync(`${disk}.tmp`, buf);
        await renameWithRetry(`${disk}.tmp`, disk);
        rendered.push({ set: j.set, file: disk });
      }
      done++;
    } catch (e) {
      failed.push(`${j.out}: ${String(e)}`);
    }
  }

  // 훅 연결 맵은 부분 실행(--only)에서도 항상 전체로 다시 쓴다
  const hookRows = allJobs
    .filter((j) => j.set === "hook")
    .map((j) => {
      const { photo, title } = resolve(j);
      return { url: j.url!, src: j.out, alt: altFor(title, photo) };
    });
  if (!outDir && !dry) {
    writeHookMap(hookRows);
    if (!only) await writeContactSheets(rendered);
  }
  console.log(JSON.stringify({ total: jobs.length, generated: done, hooks: hookRows.length, failed }, null, 2));
  if (failed.length) process.exitCode = 1;
}

// src/lib/seo/page-thumbnail-size.ts 와 같은 값
const HERO_W = 1280;
const HERO_H = 960;
const HERO_NO_CROP_FALLBACK = "/image/썸네일-사무실_정면.jpg";

/** og-pages가 없는 대표 페이지만 새 파일(/image/hero) — 배포 파일 수 한도(Cloudflare Pages 무료 20,000) 때문에 og-pages 파일을 그대로 다시 쓴다 */
function heroOut(url: string): string {
  let slug = url;
  try {
    slug = decodeURIComponent(url);
  } catch {
    // 이미 디코딩된 경로
  }
  slug = slug.replace(/^\//, "").replaceAll("/", "-") || "home";
  return `/image/hero/${slug}.jpg`;
}

type RenderFn = (o: {
  photo: string;
  title: string;
  format: string;
  width: number;
  height: number;
  hero: boolean;
  quality: number;
}) => Promise<{ buf: Buffer }>;

async function runHero(
  allJobs: Job[],
  resolve: (j: Job) => { photo: string; title: string },
  opts: { only?: string; outDir?: string; onlyMissing: boolean; dry: boolean; render: RenderFn },
) {
  const { pickHeroPhoto, heroPhotoDesc } = await import(pathToFileURL(path.join(LIB, "hero-sources.mjs")).href);
  const { photoDesc } = await import(pathToFileURL(path.join(LIB, "photo-desc.mjs")).href);
  const { photoDisk } = await import(pathToFileURL(path.join(LIB, "render.mjs")).href);

  // 대표 페이지(serp) 문구가 우선, 다음 지역·키워드 훅, 나머지는 페이지별 og 문구.
  // 출력: og-pages가 있는 페이지는 그 파일(og:image도 이 4:3), 없는 대표 페이지만 /image/hero(og:image는 기존 그대로)
  const ogOut = new Map(allJobs.filter((j) => j.set === "page" && j.url).map((j) => [j.url!, j.out]));
  const byUrl = new Map<string, { url: string; out: string; og: boolean; photo: string; title: string }>();
  for (const set of ["serp", "hook", "page"]) {
    for (const j of allJobs) {
      if (j.set !== set || !j.url || byUrl.has(j.url)) continue;
      const { photo, title } = resolve(j);
      const og = ogOut.get(j.url);
      byUrl.set(j.url, { url: j.url, out: og ?? heroOut(j.url), og: Boolean(og), photo: pickHeroPhoto(j.url, photo), title });
    }
  }
  const rows = [...byUrl.values()].sort((a, b) => a.url.localeCompare(b.url, "ko"));
  // --sample=N: 검토용으로 고르게 N장만(--out-dir와 함께)
  const sample = Number(process.argv.find((a) => a.startsWith("--sample="))?.slice(9) ?? 0);
  const filtered = rows.filter((r) => !opts.only || r.url.includes(opts.only) || r.out.includes(opts.only));
  const step = sample > 0 ? Math.max(1, Math.floor(filtered.length / sample)) : 1;
  const targets = filtered.filter((_, i) => i % step === 0);
  const failed: string[] = [];
  const rendered: { set: string; file: string }[] = [];
  let next = 0;
  const worker = async () => {
    while (next < targets.length) {
      const r = targets[next++];
      const disk = path.join(PUBLIC, r.out);
      if (opts.onlyMissing && !opts.outDir && existsSync(disk)) continue;
      if (!existsSync(photoDisk(r.photo))) {
        failed.push(`${r.url}: missing ${r.photo}`);
        continue;
      }
      try {
        const draw = (photo: string) =>
          opts.render({
            photo,
            title: r.title,
            format: "jpg",
            width: HERO_W,
            height: HERO_H,
            hero: true,
            quality: 82,
          });
        // 얼굴이 화면 대부분인 사진은 가운데 제목을 얹을 crop이 없다 — 얼굴을 가리지 않는 사무실 사진으로 바꾼다
        const { buf } = await draw(r.photo).catch((e) => {
          if (!/no crop/.test(String(e))) throw e;
          r.photo = HERO_NO_CROP_FALLBACK;
          return draw(r.photo);
        });
        if (opts.outDir) {
          mkdirSync(opts.outDir, { recursive: true });
          const file = path.join(opts.outDir, r.out.split("/").pop()!);
          writeFileSync(file, buf);
          rendered.push({ set: "hero-review", file });
        } else if (!opts.dry) {
          mkdirSync(path.dirname(disk), { recursive: true });
          writeFileSync(`${disk}.tmp`, buf);
          await renameWithRetry(`${disk}.tmp`, disk);
          rendered.push({ set: "hero", file: disk });
        }
      } catch (e) {
        failed.push(`${r.url}: ${String(e)}`);
      }
    }
  };
  await Promise.all(Array.from({ length: 4 }, worker));

  if (!opts.outDir && !opts.dry) {
    const line = (r: (typeof rows)[number]) => {
      const alt = `${r.title.replace(/\n/g, " ")} — ${heroPhotoDesc(r.photo) ?? photoDesc(r.photo)}`;
      return `  ${JSON.stringify(r.url)}: [${JSON.stringify(r.out)}, ${JSON.stringify(alt)}],`;
    };
    const ready = rows.filter((r) => existsSync(path.join(PUBLIC, r.out)));
    const body = [
      "/**",
      " * 생성물 — scripts/generate-premium-thumbnails.ts --hero (npm run thumbnails:hero)",
      " * 직접 수정하지 않는다. 문구는 scripts/premium-thumbnails/page-og.json·copy.mjs, 사진 고르기는 hero-sources.mjs 에서 고친다.",
      " * 경로 → [4:3 대표 썸네일(src/lib/seo/page-thumbnail-size.ts), alt]. 제목은 가운데 정사각 안(1:1로 잘려도 보임), 얼굴과 겹치지 않음.",
      " * PAGE_OG_THUMBNAILS: og:image·본문 시작 썸네일·관련 카드에 함께 쓴다.",
      " * PAGE_HERO_ONLY: 대표 페이지 — 본문 시작 썸네일에만 쓰고 og:image는 기존 SERP 이미지를 유지한다.",
      " */",
      "const PAGE_OG_THUMBNAILS: Record<string, readonly [src: string, alt: string]> = {",
      ...ready.filter((r) => r.og).map(line),
      "};",
      "",
      "const PAGE_HERO_ONLY: Record<string, readonly [src: string, alt: string]> = {",
      ...ready.filter((r) => !r.og).map(line),
      "};",
      "",
      "export function getPageOgThumbnail(path: string): { src: string; alt: string } | undefined {",
      "  const hit = PAGE_OG_THUMBNAILS[path];",
      "  return hit ? { src: hit[0], alt: hit[1] } : undefined;",
      "}",
      "",
      "/** 본문 시작 4:3 썸네일 */",
      "export function getPageHeroThumbnail(path: string): { src: string; alt: string } | undefined {",
      "  const hit = PAGE_OG_THUMBNAILS[path] ?? PAGE_HERO_ONLY[path];",
      "  return hit ? { src: hit[0], alt: hit[1] } : undefined;",
      "}",
      "",
    ].join("\n");
    const mapFile = path.join(ROOT, "src/data/seo/page-og-thumbnails.ts");
    writeFileSync(`${mapFile}.tmp`, body, "utf8");
    await renameWithRetry(`${mapFile}.tmp`, mapFile);
  }
  if (rendered.length && (opts.outDir || !opts.only)) await writeContactSheets(rendered);
  console.log(JSON.stringify({ pages: rows.length, rendered: rendered.length, failed }, null, 2));
  if (failed.length) process.exitCode = 1;
}

/** src/data/seo/serp-hook-images.ts — 지역·키워드 페이지 카드가 쓰는 1:1 훅 이미지 연결 */
function writeHookMap(rows: { url: string; src: string; alt: string }[]) {
  const lines = rows.map(
    (r) => `  ${JSON.stringify(r.url)}: { src: ${JSON.stringify(r.src)}, alt: ${JSON.stringify(r.alt)}, width: 1200, height: 1200 },`,
  );
  const body = [
    "/**",
    " * 생성물 — scripts/generate-premium-thumbnails.ts (npm run thumbnails:premium)",
    " * 직접 수정하지 않는다. 캐러셀 카드·ItemList 전용 1:1 훅 썸네일(가운데 제목, 얼굴과 겹치지 않음).",
    " */",
    "export type SerpHookImage = {",
    "  src: string;",
    "  alt: string;",
    "  width: 1200;",
    "  height: 1200;",
    "};",
    "",
    "export const SERP_HOOK_IMAGES: Record<string, SerpHookImage> = {",
    ...lines,
    "};",
    "",
    "export function getSerpHookImage(url: string): SerpHookImage | undefined {",
    "  return SERP_HOOK_IMAGES[url];",
    "}",
    "",
  ].join("\n");
  writeFileSync(path.join(ROOT, "src/data/seo/serp-hook-images.ts"), body, "utf8");
}

/** reports/thumbnails/contact-sheet-<set>.jpg — 묶음별 검토용 모아보기 */
async function writeContactSheets(files: { set: string; file: string }[]) {
  const dir = path.join(ROOT, "reports", "thumbnails");
  mkdirSync(dir, { recursive: true });
  const T = 300;
  const COLS = 8;
  const CHUNK = 160;
  for (const set of [...new Set(files.map((f) => f.set))]) {
    const all = files.filter((f) => f.set === set);
    for (let c = 0; c * CHUNK < all.length; c++) {
      const list = all.slice(c * CHUNK, (c + 1) * CHUNK);
      const suffix = all.length > CHUNK ? `-${String(c + 1).padStart(2, "0")}` : "";
      const rows = Math.ceil(list.length / COLS);
      const tiles = await Promise.all(
        list.map(async (f, i) => ({
          input: await sharp(f.file).resize(T, T, { fit: "contain", background: "#e9e4dc" }).toBuffer(),
          left: (i % COLS) * (T + 8) + 8,
          top: Math.floor(i / COLS) * (T + 8) + 8,
        })),
      );
      await sharp({
        create: { width: COLS * (T + 8) + 8, height: rows * (T + 8) + 8, channels: 3, background: "#f7f4ef" },
      })
        .composite(tiles)
        .jpeg({ quality: 80 })
        .toFile(path.join(dir, `contact-sheet-${set}${suffix}.jpg`));
    }
  }
}

main();
