/**
 * Homepage hero layout + stage image checks.
 * Usage: npx --yes tsx scripts/check-home-hero.ts
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();

function read(rel: string) {
  return readFileSync(join(ROOT, rel), "utf8");
}

const EXPECTED_STAGE = [
  "썸네일-상담협의.jpg",
  "위촉장.jpg",
  "썸네일-사무실_정면.jpg",
  "강의-전세사기피하는법률교육특강.jpg",
  "썸네일-부산지방등기국.jpg",
  "썸네일-사무실_전화중.jpg",
  "사무소-내부.jpg",
  "사무소-전경.jpg",
  "사무소-명패.png",
] as const;

function extractStageOrder(source: string): string[] {
  const block = source.match(
    /heroStageSlides:\s*\[([\s\S]*?)\],\s*trust:/,
  );
  if (!block) return [];
  return [...block[1].matchAll(/imagePaths\.(\w+)/g)].map((m) => m[1]);
}

function pathForKey(source: string, key: string): string | null {
  const m = source.match(new RegExp(`${key}:\\s*"(/image/[^"]+)"`));
  return m?.[1] ?? null;
}

function fail(message: string): never {
  console.error(`check-home-hero FAIL: ${message}`);
  process.exit(1);
}

function main() {
  const images = read("src/lib/site-images.ts");
  const hero = read("src/components/home/HomeHero.tsx");
  const contact = read("src/components/home/HeroContactBlock.tsx");
  const css = read("src/app/globals.css");

  const keys = extractStageOrder(images);
  if (keys.length !== EXPECTED_STAGE.length) {
    fail(`heroStageSlides count ${keys.length}, expected ${EXPECTED_STAGE.length}`);
  }

  const files: string[] = [];
  for (const key of keys) {
    const p = pathForKey(images, key);
    if (!p) fail(`imagePaths.${key} missing`);
    files.push(decodeURIComponent(p.replace("/image/", "")));
    const abs = join(ROOT, "public", p.replace(/^\//, ""));
    if (!existsSync(abs)) fail(`missing file ${p}`);
  }

  for (let i = 0; i < EXPECTED_STAGE.length; i += 1) {
    if (files[i] !== EXPECTED_STAGE[i]) {
      fail(`slide ${i + 1} is ${files[i]}, expected ${EXPECTED_STAGE[i]}`);
    }
  }

  if (!css.includes(".home-hero__copy") || !css.includes("position: absolute")) {
    fail("info panel is not absolutely positioned");
  }
  if (!css.includes("height: 100%") || !css.includes("top: 0")) {
    fail("info panel is not full height on desktop");
  }
  if (!css.includes(".home-hero__copy-actions") || !css.includes("display: none")) {
    fail("mobile contact actions are not hidden");
  }
  if (!hero.includes("home-hero__fade") || !hero.includes("home-hero__photo")) {
    fail("mobile photo band / fade layer is missing");
  }
  if (!css.includes(".home-hero__photo") || !css.includes("flex: 1 1 auto")) {
    fail("mobile photos must fill from the fade to the bottom CTA");
  }
  if (!hero.includes("home-hero__title-ornament") || !hero.includes("home-hero__rule")) {
    fail("hero panel ornament/rule missing");
  }
  if (!contact.includes("hero-contact__chip--inquiry")) {
    fail("inquiry chip class missing");
  }
  if (!contact.includes("hero-contact__chip--guide")) {
    fail("guide chip class missing");
  }
  if (!css.includes(".hero-contact__chip--inquiry") || !css.includes("background: #f0ebe3")) {
    fail("inquiry chip is not filled");
  }
  if (!css.includes(".hero-contact__chip--guide") || !css.includes("background: #c4b7a3")) {
    fail("guide chip is not filled");
  }
  if (!hero.includes("home-hero__office") || !hero.includes("home-hero__subtitle")) {
    fail("hero identity hierarchy missing");
  }
  if (!hero.includes("{homeHero.officeName}") || !hero.includes("{homeHero.subtitle}")) {
    fail("hero copy is not using officeName/subtitle");
  }
  if (hero.includes("siteImages.logo") || hero.includes("home-hero__logo")) {
    fail("hero title should not include the logo image");
  }
  if (hero.includes("home-hero__kicker") || hero.includes("home-hero__title-rule")) {
    fail("hero title still has decorative kicker/rule");
  }

  const swiper = read("src/components/home/HomeFullpageSwiper.tsx");
  if (
    !swiper.includes("HomeContinueScrollHint") ||
    !swiper.includes("activeIndex < slides.length - 1") ||
    swiper.includes("activeIndex > 0 && activeIndex < slides.length - 1")
  ) {
    fail("continue-scroll hint must show from the first slide");
  }

  const page = read("src/app/page.tsx");
  const scroll = read("src/lib/home-scroll.ts");
  const expectedOrder = [
    "HomeHero",
    "HomeTrust",
    "HomePressMarquee",
    "HomeActivitiesMarquee",
    "HomeLawyerEeat",
    "HomeServices",
  ];
  let last = -1;
  for (const name of expectedOrder) {
    const i = page.indexOf(`<${name} `) >= 0 ? page.indexOf(`<${name} `) : page.indexOf(`<${name} />`);
    if (i < 0) fail(`homepage missing ${name}`);
    if (i < last) fail(`homepage order: ${name} appears too early`);
    last = i;
  }
  if (!scroll.includes('"home-trust"') || scroll.indexOf('"home-trust"') > scroll.indexOf('"home-services"')) {
    fail("HOME_SECTION_IDS does not put trust before services");
  }

  console.log("check-home-hero PASS");
  console.log(files.map((f, i) => `${i + 1}. ${f}`).join("\n"));
}

main();
