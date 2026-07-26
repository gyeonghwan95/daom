/**
 * public/image/썸네일-* — 카드·목록 썸네일
 *
 * 블로그 등은 slug 키워드로 연관 태그를 고르고,
 * 같은 태그 풀 안에서는 slug 해시로 분산해 항목 간 겹침을 줄입니다.
 */

import { encodePublicSrc } from "@/lib/encode-public-src";

export type ThumbnailTag =
  | "inheritance"
  | "renunciation"
  | "qualified"
  | "transfer"
  | "gift"
  | "mortgage"
  | "jeonse"
  | "real-estate"
  | "registry"
  | "document"
  | "corporate"
  | "corporate-setup"
  | "corporate-director"
  | "rehab"
  | "bankruptcy"
  | "litigation"
  | "court"
  | "consult"
  | "drafting"
  | "office"
  | "general"
  | "gijang"
  | "dongnae"
  | "suyeong"
  | "yeonje"
  | "jaesong"
  | "geumjeong"
  | "saha"
  | "haeundae";

type ThumbnailAsset = {
  path: string;
  tags: readonly ThumbnailTag[];
};

/** 카드용 풀 — 인물 사진(정면/아래)은 제외 */
export const THUMBNAIL_ASSETS: readonly ThumbnailAsset[] = [
  {
    path: "/image/썸네일-등기필증_상속.jpg",
    tags: ["inheritance"],
  },
  {
    path: "/image/썸네일-등기필증_매매증여.jpg",
    tags: ["transfer", "gift"],
  },
  {
    path: "/image/썸네일-등기필증_근저당.jpg",
    tags: ["mortgage", "jeonse"],
  },
  {
    path: "/image/썸네일-서류등기.jpg",
    tags: ["real-estate", "document", "registry"],
  },
  {
    path: "/image/썸네일-서류확인.jpg",
    tags: ["document", "qualified", "consult"],
  },
  {
    path: "/image/썸네일-등기소.jpg",
    tags: ["registry", "real-estate", "inheritance"],
  },
  {
    path: "/image/썸네일-등기운영과.jpg",
    tags: ["registry", "real-estate"],
  },
  {
    path: "/image/썸네일-서부지원.jpg",
    tags: ["bankruptcy", "court"],
  },
  {
    path: "/image/썸네일-동부지원.jpg",
    tags: ["rehab", "court"],
  },
  {
    path: "/image/썸네일-동부지원2.jpg",
    tags: ["rehab", "court"],
  },
  {
    path: "/image/썸네일-법원절차.jpg",
    tags: ["court", "renunciation", "qualified", "bankruptcy", "rehab"],
  },
  {
    path: "/image/썸네일-민사소송책.png",
    tags: ["litigation", "renunciation"],
  },
  {
    path: "/image/썸네일-법무사책.png",
    tags: ["general", "consult"],
  },
  {
    path: "/image/썸네일-전공책.jpg",
    tags: ["general"],
  },
  {
    path: "/image/썸네일-계약임원.jpg",
    tags: ["corporate", "corporate-director"],
  },
  {
    path: "/image/썸네일-상담협의.jpg",
    tags: ["consult"],
  },
  {
    path: "/image/썸네일-사무실.jpg",
    tags: ["office", "consult", "general"],
  },
  {
    path: "/image/썸네일-컴퓨터.png",
    tags: ["corporate", "drafting"],
  },
  {
    path: "/image/썸네일-작성중.png",
    tags: ["corporate-setup", "drafting", "document"],
  },
  {
    path: "/image/썸네일-오브제.jpg",
    tags: ["general"],
  },
  {
    path: "/image/썸네일-기장군청.jpg",
    tags: ["gijang"],
  },
  {
    path: "/image/썸네일-동래구청.jpg",
    tags: ["dongnae"],
  },
  {
    path: "/image/썸네일-수영구청.jpg",
    tags: ["suyeong"],
  },
  {
    path: "/image/썸네일-연제구청.jpg",
    tags: ["yeonje"],
  },
  {
    path: "/image/썸네일-재송동행정복지센터.jpg",
    tags: ["jaesong", "haeundae"],
  },
  {
    path: "/image/썸네일-금정구청.jpg",
    tags: ["geumjeong"],
  },
  {
    path: "/image/썸네일-사하구청.jpg",
    tags: ["saha"],
  },
] as const;

export const THUMBNAIL_IMAGE_PATHS = THUMBNAIL_ASSETS.map(
  (asset) => asset.path,
) as unknown as readonly [string, ...string[]];

export type ThumbnailImagePath = (typeof THUMBNAIL_ASSETS)[number]["path"];

const KEYWORD_RULES: readonly {
  pattern: RegExp;
  tags: readonly ThumbnailTag[];
  weight: number;
}[] = [
  { pattern: /gijang|기장/, tags: ["gijang"], weight: 20 },
  { pattern: /dongnae|동래/, tags: ["dongnae"], weight: 20 },
  { pattern: /suyeong|수영/, tags: ["suyeong"], weight: 20 },
  { pattern: /yeonje|연제/, tags: ["yeonje"], weight: 20 },
  { pattern: /jaesong|재송/, tags: ["jaesong"], weight: 20 },
  { pattern: /geumjeong|금정/, tags: ["geumjeong"], weight: 20 },
  { pattern: /saha|사하/, tags: ["saha"], weight: 20 },
  { pattern: /haeundae|해운대|centum|센텀|jaesong/, tags: ["haeundae"], weight: 12 },

  {
    pattern: /inheritance-renunciation|renunciation|포기/,
    tags: ["renunciation"],
    weight: 16,
  },
  {
    pattern: /qualified-acceptance|한정승인/,
    tags: ["qualified"],
    weight: 16,
  },
  {
    pattern: /mortgage|근저당/,
    tags: ["mortgage"],
    weight: 16,
  },
  {
    pattern: /jeonse|전세|lease-registration|임차권/,
    tags: ["jeonse", "mortgage"],
    weight: 15,
  },
  {
    pattern: /gift|증여/,
    tags: ["gift", "transfer"],
    weight: 15,
  },
  {
    pattern:
      /ownership-transfer|ownership|이전등기|매매|잔금|apartment|분양|공동명의|joint-ownership/,
    tags: ["transfer"],
    weight: 14,
  },
  {
    pattern: /inheritance|상속/,
    tags: ["inheritance"],
    weight: 14,
  },
  {
    pattern: /director|임원|ceo|대표이사|term-expiry/,
    tags: ["corporate-director"],
    weight: 15,
  },
  {
    pattern: /company-establishment|설립|startup|one-person|창업/,
    tags: ["corporate-setup"],
    weight: 15,
  },
  {
    pattern: /corporate|법인|head-office|본점|purpose|상호|name-change/,
    tags: ["corporate"],
    weight: 13,
  },
  {
    pattern: /rehabilitation|회생|salaried-worker|business-owner-rehab/,
    tags: ["rehab"],
    weight: 15,
  },
  {
    pattern: /bankruptcy|파산|discharge|면책/,
    tags: ["bankruptcy"],
    weight: 15,
  },
  {
    pattern:
      /payment-order|지급명령|debt|채권|complaint|고소|certified-mail|내용증명|loan|대여|추심/,
    tags: ["litigation"],
    weight: 14,
  },
  {
    pattern: /real-estate|부동산등기/,
    tags: ["real-estate", "registry"],
    weight: 12,
  },
  {
    pattern: /consult|상담|jurisdiction|관할|visit|서류|document|checklist|prep/,
    tags: ["consult", "document"],
    weight: 6,
  },
];

const FALLBACK_TAGS: readonly ThumbnailTag[] = [
  "general",
  "consult",
  "office",
];

function hashSlug(slug: string): number {
  let hash = 5381;
  for (let i = 0; i < slug.length; i++) {
    hash = (hash * 33) ^ slug.charCodeAt(i);
  }
  return hash >>> 0;
}

function matchingRules(slug: string) {
  const haystack = slug.toLowerCase();
  return KEYWORD_RULES.filter((rule) => rule.pattern.test(haystack));
}

/**
 * 가장 강한 키워드 규칙의 태그만 사용해 풀을 좁힙니다.
 * (약한 consult/document 규칙이 상속 필증 등을 가로채지 않도록)
 */
function primaryTags(slug: string): ThumbnailTag[] {
  const matched = matchingRules(slug);
  if (matched.length === 0) return [...FALLBACK_TAGS];

  const maxWeight = Math.max(...matched.map((rule) => rule.weight));
  const top = matched.filter((rule) => rule.weight >= maxWeight - 1);
  const tags = new Set<ThumbnailTag>();
  for (const rule of top) {
    for (const tag of rule.tags) tags.add(tag);
  }
  return [...tags];
}

function scoreAsset(asset: ThumbnailAsset, tags: ThumbnailTag[]): number {
  let score = 0;
  for (const tag of tags) {
    if (asset.tags.includes(tag)) score += 1;
  }
  return score;
}

/**
 * slug 기준으로 연관 썸네일을 고릅니다.
 * 최고 점수 그룹에서 해시로 분산해 같은 주제끼리도 겹침을 줄입니다.
 */
export function pickThumbnailImagePath(slug: string): string {
  const tags = primaryTags(slug);
  const scored = THUMBNAIL_ASSETS.map((asset) => ({
    asset,
    score: scoreAsset(asset, tags),
  })).sort(
    (a, b) => b.score - a.score || a.asset.path.localeCompare(b.asset.path),
  );

  const topScore = scored[0]?.score ?? 0;
  const pool =
    topScore > 0
      ? scored.filter((item) => item.score === topScore)
      : scored.filter((item) =>
          item.asset.tags.some((tag) => FALLBACK_TAGS.includes(tag)),
        );

  const safePool = pool.length > 0 ? pool : scored;
  const pick =
    safePool[hashSlug(slug) % safePool.length]?.asset ?? THUMBNAIL_ASSETS[0];
  return encodePublicSrc(pick.path);
}

/** 명시 매핑용 — 인코딩 전 원본 경로 */
export function thumbnailPath(
  name:
    | "등기필증_상속"
    | "등기필증_매매증여"
    | "등기필증_근저당"
    | "서류등기"
    | "서류확인"
    | "등기소"
    | "등기운영과"
    | "서부지원"
    | "동부지원"
    | "동부지원2"
    | "법원절차"
    | "민사소송책"
    | "법무사책"
    | "전공책"
    | "계약임원"
    | "상담협의"
    | "사무실"
    | "컴퓨터"
    | "작성중"
    | "오브제"
    | "기장군청"
    | "동래구청"
    | "수영구청"
    | "연제구청"
    | "재송동행정복지센터"
    | "금정구청"
    | "사하구청",
): string {
  const ext =
    name === "민사소송책" ||
    name === "법무사책" ||
    name === "컴퓨터" ||
    name === "작성중"
      ? "png"
      : "jpg";
  return `/image/썸네일-${name}.${ext}`;
}
