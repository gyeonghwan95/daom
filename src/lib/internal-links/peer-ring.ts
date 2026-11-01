import "server-only";

import inventory from "@/generated/page-inventory.json";
import { getAllContent } from "@/lib/content/loader";

/**
 * 같은 유형 페이지끼리 서로를 가리키는 "순환 이웃" 링크.
 * 앞쪽 몇 곳만 반복해서 고르면 나머지가 링크를 못 받으므로, 정렬된 목록에서 자기 다음 N개를 고른다.
 * 경로만으로 결정되는 순수 함수라 워커가 달라도 결과가 같고, 모든 페이지가 같은 수의 링크를 받는다.
 */

type InventoryEntry = { url: string; title: string; pageType: string; isIndexed: boolean };

export type PeerLinkSet = {
  title: string;
  description: string;
  links: { href: string; label: string }[];
};

const entries = inventory as InventoryEntry[];

const REGION_SERVICE_SUFFIXES = [
  "법인설립등기",
  "임원변경등기",
  "소유권이전등기",
  "부동산등기",
  "상속등기",
  "상속포기",
  "한정승인",
  "전세권설정",
  "개인회생",
  "법인등기",
];

function ring<T>(sorted: T[], index: number, count: number): T[] {
  const n = sorted.length;
  if (n <= 1) return [];
  const take = Math.min(count, n - 1);
  return Array.from({ length: take }, (_, k) => sorted[(index + 1 + k) % n]);
}

const byKo = (a: string, b: string) => a.localeCompare(b, "ko");

function splitRegionService(slug: string): { region: string; suffix: string } | null {
  for (const suffix of REGION_SERVICE_SUFFIXES) {
    if (slug.endsWith(suffix) && slug.length - suffix.length >= 2) {
      return { region: slug.slice(0, slug.length - suffix.length), suffix };
    }
  }
  return null;
}

let regionGroups: Map<string, InventoryEntry[]> | null = null;
function getRegionGroups(): Map<string, InventoryEntry[]> {
  if (regionGroups) return regionGroups;
  const groups = new Map<string, InventoryEntry[]>();
  for (const entry of entries) {
    if (!entry.isIndexed || entry.pageType !== "region-detail") continue;
    if (entry.url.split("/").length !== 2) continue;
    const parts = splitRegionService(entry.url.slice(1));
    if (!parts) continue;
    // 제목이 "OO동 상속등기 안내" 형태인 지역 페이지만 순환 대상으로 삼는다(주제형·허브 페이지 제외).
    const titled = entry.title.match(/^(\S{2,8}) (\S+) 안내$/);
    if (!titled || titled[2] !== parts.suffix) continue;
    const list = groups.get(parts.suffix) ?? [];
    list.push(entry);
    groups.set(parts.suffix, list);
  }
  for (const list of groups.values()) list.sort((a, b) => byKo(a.url, b.url));
  regionGroups = groups;
  return groups;
}

function regionPeers(path: string): PeerLinkSet | null {
  const slug = path.slice(1);
  const parts = splitRegionService(slug);
  if (!parts) return null;
  const list = getRegionGroups().get(parts.suffix);
  const index = list?.findIndex((e) => e.url === path) ?? -1;
  if (!list || index < 0) return null;
  const links = ring(list, index, 4).map((e) => ({ href: e.url, label: e.title }));
  if (links.length === 0) return null;
  return {
    title: `다른 지역 ${parts.suffix} 안내`,
    description: `같은 업무(${parts.suffix})를 다른 지역 기준으로 정리한 안내입니다.`,
    links,
  };
}

function lecturePeers(path: string): PeerLinkSet | null {
  const list = entries
    .filter((e) => e.isIndexed && e.url.startsWith("/강의이력/"))
    .sort((a, b) => byKo(a.url, b.url));
  const index = list.findIndex((e) => e.url === path);
  if (index < 0) return null;
  const links = ring(list, index, 3).map((e) => ({ href: e.url, label: e.title }));
  if (links.length === 0) return null;
  return {
    title: "다른 강의·특강 이력",
    description: "그동안 진행한 다른 기관 강의와 특강입니다.",
    links,
  };
}

function blogPeers(path: string): PeerLinkSet | null {
  const posts = getAllContent("blog");
  const self = posts.find((p) => p.href === path);
  if (!self) return null;
  const sameCategory = posts
    .filter((p) => p.category === self.category)
    .sort((a, b) => byKo(a.slug, b.slug));
  // 같은 분류가 너무 적으면 전체 글에서 순환해 최소 개수를 채운다.
  const pool = sameCategory.length >= 4 ? sameCategory : [...posts].sort((a, b) => byKo(a.slug, b.slug));
  const index = pool.findIndex((p) => p.slug === self.slug);
  if (index < 0) return null;
  const links = ring(pool, index, 3).map((p) => ({ href: p.href, label: p.title }));
  if (links.length === 0) return null;
  return {
    title: "이어서 읽으면 좋은 글",
    description: "같은 주제의 다른 안내 글입니다.",
    links,
  };
}

export function getPeerLinkSet(rawPath: string): PeerLinkSet | null {
  const path = rawPath.normalize("NFC");
  if (path.startsWith("/blog/")) return blogPeers(path);
  if (path.startsWith("/강의이력/")) return lecturePeers(path);
  if (path.split("/").length === 2) return regionPeers(path);
  return null;
}
