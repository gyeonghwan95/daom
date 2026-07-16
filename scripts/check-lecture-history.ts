/**
 * 강의 이력 데이터 검증
 * 실행: npm run check:lecture-history
 */
import fs from "node:fs";
import path from "node:path";
import {
  lectureHistory,
  getVerifiedLectureHistory,
} from "../src/data/lectures/history";
import { listLectureHistoryPaths } from "../src/lib/lectures/history-page-data";
import { getAllLectureSlugs } from "../src/lib/lectures/content";
import { LECTURE_CATEGORY_FILTERS } from "../src/lib/lectures/types";

const ROOT = process.cwd();
const errors: string[] = [];
const warnings: string[] = [];

function fail(message: string) {
  errors.push(message);
}

function warn(message: string) {
  warnings.push(message);
}

const ids = new Set<string>();
const slugs = new Set<string>();
const knownLecturePages = new Set(
  getAllLectureSlugs().map((slug) => `/${slug}`),
);
knownLecturePages.add("/법률강의");
knownLecturePages.add("/강의이력");

const today = new Date();
const todayIso = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

for (const entry of lectureHistory) {
  if (!entry.id) fail("id 누락");
  if (ids.has(entry.id)) fail(`id 중복: ${entry.id}`);
  ids.add(entry.id);

  if (!entry.slug) fail(`${entry.id}: slug 누락`);
  if (slugs.has(entry.slug)) fail(`slug 중복: ${entry.slug}`);
  slugs.add(entry.slug);

  if (!entry.title?.trim()) fail(`${entry.id}: title 누락`);
  if (!entry.institution?.trim()) fail(`${entry.id}: institution 누락`);

  if (entry.date) {
    if (/^\d{4}-\d{2}-\d{2}$/.test(entry.date) && entry.date > todayIso) {
      fail(`${entry.id}: 미래 날짜가 history에 포함됨 (${entry.date})`);
    }
  }

  if (entry.verified === false) {
    fail(`${entry.id}: verified false는 등록하지 마세요`);
  }

  if (entry.participantCount != null && entry.participantCount < 0) {
    fail(`${entry.id}: participantCount가 음수`);
  }
  if (entry.participantCount != null && entry.participantCount > 100000) {
    warn(`${entry.id}: participantCount가 비정상적으로 큼`);
  }

  if (entry.durationMinutes != null && entry.durationMinutes <= 0) {
    fail(`${entry.id}: durationMinutes 오류`);
  }

  for (const href of entry.relatedLecturePages ?? []) {
    if (!knownLecturePages.has(href.split("#")[0]!)) {
      fail(`${entry.id}: 존재하지 않는 relatedLecturePages ${href}`);
    }
  }

  if (entry.blogUrl) {
    try {
      const url = new URL(entry.blogUrl);
      if (!url.hostname.includes("blog.naver.com") && !url.hostname.includes("naver.com")) {
        warn(`${entry.id}: blogUrl이 네이버 블로그가 아닐 수 있음`);
      }
    } catch {
      fail(`${entry.id}: 잘못된 blogUrl`);
    }
  }

  const images = entry.images?.length
    ? entry.images
    : entry.imageSrc
      ? [{ src: entry.imageSrc, alt: entry.title }]
      : [];

  for (const image of images) {
    if (!image.alt?.trim()) fail(`${entry.id}: 이미지 alt 누락 (${image.src})`);
    const publicPath = path.join(ROOT, "public", image.src.replace(/^\//, ""));
    if (!fs.existsSync(publicPath)) {
      fail(`${entry.id}: 이미지 파일 누락 ${image.src}`);
    }
  }

  for (const category of entry.lectureCategory) {
    const known = LECTURE_CATEGORY_FILTERS.some(
      (item) => item.id === "all" || item.label === category || item.id === category,
    );
    if (!known) {
      warn(`${entry.id}: 알 수 없는 lectureCategory "${category}"`);
    }
  }
}

const titles = new Map<string, string>();
for (const entry of lectureHistory) {
  const key = `${entry.institution}::${entry.title}::${entry.date ?? entry.year ?? ""}`;
  if (titles.has(key)) {
    fail(`중복 강의 의심: ${entry.id} / ${titles.get(key)}`);
  }
  titles.set(key, entry.id);
}

const verified = getVerifiedLectureHistory();
const paths = listLectureHistoryPaths();
if (paths[0] !== "/강의이력") {
  fail("listLectureHistoryPaths 허브 경로 오류");
}
if (paths.length !== verified.length + 1) {
  fail(
    `sitemap 경로 수 불일치: paths=${paths.length}, verified+hub=${verified.length + 1}`,
  );
}

const metaTitles = new Map<string, string>();
for (const entry of verified) {
  const meta = `${entry.shortTitle ?? entry.title}｜안윤정 법무사 강의 이력`;
  if (metaTitles.has(meta)) {
    warn(`메타 title 유사 중복: ${entry.id} / ${metaTitles.get(meta)}`);
  }
  metaTitles.set(meta, entry.id);
}

if (warnings.length) {
  console.warn("Warnings:");
  for (const warning of warnings) console.warn(`- ${warning}`);
}

if (errors.length) {
  console.error("Errors:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(
  `OK: verified ${verified.length} lectures, ${paths.length} paths, ${warnings.length} warnings`,
);
