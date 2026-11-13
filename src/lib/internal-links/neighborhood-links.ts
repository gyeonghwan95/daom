import "server-only";

import inventory from "@/generated/page-inventory.json";
import { DISTRICT_METAS } from "@/lib/case-regions/districts";

/**
 * 동·생활권 대표 페이지로 잇는 "가까운 생활권" 링크.
 * 동 단위 검색(예: 화명동 법무사)에서 대표 페이지 대신 구 허브나 업무 페이지가 잡히던 곳이 있었다(2026-11-03 실측).
 * 동 대표 페이지는 링크를 받는 페이지가 3~20개뿐이고, 같은 동의 업무 페이지(예: /화명동부동산등기)조차 대표 페이지를 가리키지 않았다.
 * 같은 동의 업무 페이지·같은 구의 업무 페이지·같은 구의 다른 동 대표 페이지·같은 구의 동 사례 페이지에서 대상 페이지로 잇는다.
 * 이미 1위인 동(재송동·대연동·연산동 등)은 대표로 잡히는 페이지가 바뀌지 않도록 대상에 넣지 않는다.
 * 동 페이지에서 구 허브로 가는 링크는 늘리지 않는다 — 구 허브가 동 검색까지 대표로 잡히는 원인이 된다.
 * 경로만으로 결정되는 순수 함수라 워커가 달라도 결과가 같다.
 */

type InventoryEntry = { url: string };

type NeighborhoodTarget = {
  href: string;
  /** 앵커에 쓰는 지역명(검색어와 같은 표기) */
  place: string;
  /** 같은 동 페이지를 찾는 경로 접두어(예: "명지" → /명지법인등기, /업무사례/부산명지국제신도시법무사) */
  prefix: string;
  /** 대표 페이지가 사례 페이지뿐인 동 */
  caseOnly?: boolean;
};

type NeighborhoodCluster = {
  /** DISTRICT_METAS의 구 이름이자 구 업무 페이지 경로 접두어 */
  gu: string;
  targets: NeighborhoodTarget[];
  /** 같은 구의 다른 동·생활권 대표 페이지 */
  siblings: string[];
  /** 구 허브 본문에 아직 링크가 없는 대상(구 허브에서도 잇는다) */
  fromGuHub?: string[];
};

export type NeighborhoodLinkSet = {
  title: string;
  links: { href: string; label: string }[];
};

const CLUSTERS: NeighborhoodCluster[] = [
  {
    gu: "해운대구",
    // 2026-11-13 실측: 중동 5위(받는 링크 7개), 송정동 3위(받는 링크 1개) — 해운대 허브 본문에도 링크가 없었다
    targets: [
      { href: "/좌동법무사", place: "좌동", prefix: "좌동" },
      { href: "/중동법무사", place: "해운대 중동", prefix: "중동" },
      { href: "/송정동법무사", place: "해운대 송정동", prefix: "송정" },
    ],
    siblings: ["/우동법무사", "/재송동법무사", "/반여동법무사"],
    fromGuHub: ["/중동법무사", "/송정동법무사"],
  },
  {
    gu: "연제구",
    targets: [{ href: "/거제동법무사", place: "거제동", prefix: "거제" }],
    siblings: ["/연산동법무사"],
  },
  {
    gu: "동래구",
    targets: [{ href: "/사직동법무사", place: "사직동", prefix: "사직" }],
    siblings: ["/안락동법무사", "/온천동법무사", "/동래역법무사"],
  },
  {
    gu: "북구",
    targets: [
      { href: "/화명동법무사", place: "화명동", prefix: "화명" },
      { href: "/구포동법무사", place: "구포동", prefix: "구포" },
    ],
    siblings: ["/덕천동법무사"],
  },
  {
    gu: "강서구",
    targets: [
      { href: "/명지법무사", place: "명지", prefix: "명지" },
      { href: "/명지동법무사", place: "명지동", prefix: "명지동" },
    ],
    siblings: [],
    fromGuHub: ["/명지동법무사"],
  },
  {
    gu: "부산진구",
    targets: [
      { href: "/부전동법무사", place: "부전동", prefix: "부전" },
      { href: "/업무사례/부산가야동법무사", place: "가야동", prefix: "가야", caseOnly: true },
    ],
    siblings: ["/서면법무사", "/전포동법무사", "/개금동법무사", "/연지동법무사", "/양정동법무사"],
    fromGuHub: ["/부전동법무사", "/업무사례/부산가야동법무사"],
  },
  {
    gu: "중구",
    targets: [{ href: "/남포동법무사", place: "남포동", prefix: "남포" }],
    siblings: [],
  },
  {
    gu: "서구",
    targets: [{ href: "/업무사례/부산부민동법무사", place: "부민동", prefix: "부민", caseOnly: true }],
    siblings: [],
    fromGuHub: ["/업무사례/부산부민동법무사"],
  },
  {
    gu: "사하구",
    // 2026-11-13 실측: 괴정동 3위(받는 링크 9개)
    targets: [
      { href: "/하단법무사", place: "하단동", prefix: "하단" },
      { href: "/괴정동법무사", place: "괴정동", prefix: "괴정" },
    ],
    siblings: ["/다대동법무사"],
  },
  {
    gu: "사상구",
    // 2026-11-13 실측: 「사상 법무사」 4위, 대표 페이지 대신 /사상구법무사가 잡힌다(사상법무사가 받는 링크 13개)
    targets: [{ href: "/사상법무사", place: "사상", prefix: "사상역" }],
    siblings: ["/주례동법무사"],
  },
  {
    gu: "기장군",
    targets: [{ href: "/정관법무사", place: "정관", prefix: "정관" }],
    siblings: ["/일광읍법무사", "/기장읍법무사", "/오시리아법무사", "/기장법무사"],
  },
];

const CASE_PREFIX = "/업무사례/부산";
const MAX_LINKS = 3;

const known = new Set((inventory as InventoryEntry[]).map((entry) => entry.url.normalize("NFC")));

const dongsByGu = new Map(DISTRICT_METAS.map((meta) => [meta.name, meta.dongs] as const));

function hash(value: string): number {
  let h = 0;
  for (let i = 0; i < value.length; i += 1) h = (h * 31 + value.charCodeAt(i)) >>> 0;
  return h;
}

function labelsOf(target: NeighborhoodTarget): string[] {
  const { place } = target;
  return target.caseOnly
    ? [`부산 ${place} 법무사`, `${place} 법무사 업무 사례`, `부산 ${place} 법무사 사례`]
    : [`${place} 법무사`, `${place} 법무사 상담 안내`, `부산 ${place} 법무사`];
}

/** 경로가 가리키는 지역 이름(루트 페이지는 슬러그, 사례 페이지는 "부산" 뒤 지역명) */
function placeSlug(path: string): { slug: string; isCase: boolean } | null {
  if (path.startsWith(CASE_PREFIX) && path.endsWith("법무사")) {
    return { slug: path.slice(CASE_PREFIX.length, -"법무사".length), isCase: true };
  }
  if (path.split("/").length === 2) return { slug: path.slice(1), isCase: false };
  return null;
}

/** 같은 동 페이지면 그 대상을 돌려준다(접두어가 긴 쪽 우선: 명지동 > 명지) */
function ownTarget(cluster: NeighborhoodCluster, slug: string): NeighborhoodTarget | null {
  let best: NeighborhoodTarget | null = null;
  for (const target of cluster.targets) {
    if (slug.startsWith(target.prefix) && (!best || target.prefix.length > best.prefix.length)) best = target;
  }
  return best;
}

function targetsFor(path: string): NeighborhoodTarget[] {
  const parsed = placeSlug(path);
  if (!parsed) return [];
  for (const cluster of CLUSTERS) {
    const guHub = cluster.gu === "해운대구" ? "/해운대법무사" : `/${cluster.gu}법무사`;
    if (path === guHub) {
      return cluster.targets.filter((target) => cluster.fromGuHub?.includes(target.href));
    }
    const own = ownTarget(cluster, parsed.slug);
    const isTarget = cluster.targets.some((target) => target.href === path);
    const inCluster =
      Boolean(own) ||
      isTarget ||
      cluster.siblings.includes(path) ||
      // 같은 구의 업무 페이지(예: /북구상속등기)
      (!parsed.isCase && parsed.slug.startsWith(cluster.gu)) ||
      // 같은 구의 동 사례 페이지(예: /업무사례/부산금곡동법무사)
      (parsed.isCase && (dongsByGu.get(cluster.gu) ?? []).includes(parsed.slug));
    if (!inCluster) continue;
    const ordered = own ? [own, ...cluster.targets.filter((target) => target !== own)] : cluster.targets;
    return ordered.filter((target) => target.href !== path);
  }
  return [];
}

export function getNeighborhoodLinkSet(rawPath: string): NeighborhoodLinkSet | null {
  const path = rawPath.normalize("NFC");
  if (!known.has(path)) return null;
  const seed = hash(path);
  const links = targetsFor(path)
    .filter((target) => known.has(target.href))
    .slice(0, MAX_LINKS)
    .map((target, i) => {
      const labels = labelsOf(target);
      return { href: target.href, label: labels[(seed + i) % labels.length] };
    });
  if (links.length === 0) return null;
  return { title: "가까운 생활권 법무사 안내", links };
}
