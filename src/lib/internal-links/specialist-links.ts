import "server-only";

import inventory from "@/generated/page-inventory.json";

/**
 * 분야별 "전문 법무사" 담당 페이지로 가는 내부 링크.
 * 담당 페이지(예: /부산법인설립전문법무사)는 링크를 받는 페이지가 4~17개뿐이라, 링크가 훨씬 많은 일반 안내 페이지에 검색 자리를 내주고 있었다.
 * 같은 분야의 페이지에서만, 페이지당 2개 이내로 연결하고 앵커 문구는 몇 가지로 나눠 쓴다(같은 문구를 모든 페이지에 반복하지 않음).
 * 상속전문·상속포기 담당 페이지로는 잇지 않는다(상속포기 분야는 한정승인으로만 잇는다). 두 페이지에 600~700개 페이지가 같은 문구로 링크하자
 * 두 페이지가 해당 검색에서 사라졌다(실측: 부산 상속포기 법무사 11-02 5위 → 11-03 18위 → 11-08 순위 밖,
 * 부산 상속전문 법무사 14위 → 순위 밖). 링크가 조금만 늘어난 한정승인(5위→3위)·법인전문(3위 유지)은 그대로 둔다.
 * 경로·제목만으로 결정되는 순수 함수라 워커가 달라도 결과가 같다.
 */

type InventoryEntry = { url: string; title: string; isIndexed: boolean };

type SpecialistTarget = { href: string; labels: readonly string[] };

export type SpecialistLinkSet = {
  title: string;
  links: { href: string; label: string }[];
};

const TARGETS = {
  qualifiedAcceptance: {
    href: "/부산한정승인",
    labels: ["부산 한정승인 법무사, 상속채무가 걱정될 때", "부산 한정승인 신고 절차 안내", "한정승인 법무사 상담 기준"],
  },
  provisionalAttachment: {
    href: "/부산가압류신청",
    labels: ["부산 가압류 법무사, 부동산·채권 가압류 신청 전 확인", "부산 채권가압류·부동산 가압류 안내", "가압류 신청 법무사 상담 기준"],
  },
  claimSeizure: {
    href: "/부산채권압류추심명령",
    labels: ["부산 채권압류·추심명령 안내", "판결 후 채권압류·추심 순서", "채권압류 추심명령 법무사 안내"],
  },
  corporateSpecialist: {
    href: "/부산법인설립전문법무사",
    labels: ["부산 법인전문 법무사 선택 기준", "부산 법인전문 법무사, 설립 전 준비 안내", "법인전문 법무사 업무범위 안내"],
  },
  registryRecommend: {
    href: "/부산등기법무사추천",
    labels: ["부산 등기 법무사 추천 기준", "부산 등기 법무사, 고르기 전 확인사항", "등기 법무사 선택 기준 안내"],
  },
  registrySpecialist: {
    href: "/부산부동산등기전문법무사",
    labels: ["부산 등기전문 법무사 선택 기준", "부산 등기전문 법무사, 원인별 안내", "부동산 등기전문 법무사 업무범위"],
  },
  rehabilitation: {
    href: "/부산개인회생법무사",
    labels: ["부산 개인회생 법무사 선택 기준", "부산 개인회생 법무사 상담 안내", "개인회생 법무사 신청 가능성 점검"],
  },
} as const satisfies Record<string, SpecialistTarget>;

type FamilyId = "renunciation" | "qualified" | "inheritance" | "rehabilitation" | "preservation" | "corporate" | "registry";

const FAMILY_TEST: Record<FamilyId, RegExp> = {
  renunciation: /(상속포기|포기|renunciation|renouncing)/i,
  qualified: /(한정승인|qualified)/i,
  inheritance: /(상속|inherit)/i,
  rehabilitation: /(개인회생|파산|회생|면책|rehabilitation|bankruptcy|discharge)/i,
  corporate: /(법인|회사|설립|임원|본점|대표이사|정관|증자|주주|목적변경|상호변경|company|corporate|capital-increase|director|charter)/i,
  // 가압류는 "돈을 못 받았을 때"의 첫 단계라 지급명령·내용증명·미수금 같은 채권 회수 페이지도 같은 분야로 본다
  preservation: /(가압류|가처분|압류|추심|강제집행|지급명령|내용증명|미수금|채권추심|대여금|소액|용역비|물품대금|공사대금|못 받|돈을 받지|provisional-attachment|seizure|payment-order|certified-mail|unpaid)/i,
  registry: /(부동산|매매|증여|소유권|근저당|전세권|임차권|보존|집합건물|아파트|토지|ownership|gift|mortgage|jeonse|lease|preservation|real-estate)/i,
};

const FAMILY_LINKS: Record<FamilyId, readonly SpecialistTarget[]> = {
  // 상속전문·상속포기 담당 페이지로는 잇지 않는다(위 주석의 실측). 한정승인 링크는 순위가 오른 상태를 유지한다
  renunciation: [TARGETS.qualifiedAcceptance],
  qualified: [TARGETS.qualifiedAcceptance],
  inheritance: [],
  rehabilitation: [TARGETS.rehabilitation],
  corporate: [TARGETS.corporateSpecialist, TARGETS.registryRecommend],
  preservation: [TARGETS.provisionalAttachment, TARGETS.claimSeizure],
  // 등기 추천 페이지는 법인 분야에서 이미 충분히 받으므로 부동산 분야는 등기전문 페이지 하나에 모은다
  registry: [TARGETS.registrySpecialist],
};

/** 연결하지 않는 경로(홈·소개·도구·강의 등 분야 안내가 아닌 페이지) */
const SKIP = /^\/($|admin|about|contact|reviews|media|tools|resources|search|강의|법률강의|강사|부산법률|1분간편상담|공지사항|개인정보|이용약관|privacy|terms)/;

const titles = new Map<string, InventoryEntry>();
for (const entry of inventory as InventoryEntry[]) titles.set(entry.url.normalize("NFC"), entry);

function hash(value: string): number {
  let h = 0;
  for (let i = 0; i < value.length; i += 1) h = (h * 31 + value.charCodeAt(i)) >>> 0;
  return h;
}

function familyOf(path: string): FamilyId | null {
  const entry = titles.get(path);
  if (entry && !entry.isIndexed) return null;
  const text = `${path} ${entry?.title ?? ""}`;
  // 좁은 분야부터 먼저 맞는 하나만 쓴다(상속포기 → 한정승인 → 상속 → 회생 → 가압류·압류 → 법인 → 등기)
  for (const id of ["renunciation", "qualified", "inheritance", "rehabilitation", "preservation", "corporate", "registry"] as const) {
    if (FAMILY_TEST[id].test(text)) return id;
  }
  return null;
}

export function getSpecialistLinkSet(rawPath: string): SpecialistLinkSet | null {
  const path = rawPath.normalize("NFC");
  if (SKIP.test(path)) return null;
  const family = familyOf(path);
  if (!family) return null;
  const seed = hash(path);
  const links = FAMILY_LINKS[family]
    .filter((target) => target.href !== path)
    .map((target, i) => ({ href: target.href, label: target.labels[(seed + i) % target.labels.length] }));
  if (links.length === 0) return null;
  return { title: "분야별 전문 법무사 안내", links };
}
