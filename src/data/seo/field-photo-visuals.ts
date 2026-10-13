/**
 * 실제 현장·업무 사진을 페이지 대표 이미지로 연결하는 목록(2026-10-11).
 * page-visuals(초상 기반 SERP 이미지)가 없는 페이지에서만 쓰인다 — resolveSerpImage의 대체값.
 * 하나의 항목이 본문 대표 그림(<img>)·og:image·WebPage.primaryImageOfPage를 함께 정한다.
 *
 * 기준: 사진 속 기관·서류가 페이지 주제와 정확히 같을 때만 연결한다. 사진은 다옴법무사사무소가 직접 촬영한
 * 원본(public/image/외근_*, public/image/서류/*)에서 크기만 줄이고 EXIF를 뺀 파생본이며, 인물은 보정하지 않았다.
 * 서류 사진은 고객·회사·공증인 이름·주민번호·주소가 가려진 것만 쓴다.
 * PageDataTemplate으로 그려지는 페이지만 넣는다(다른 템플릿은 본문에 그림이 나오지 않아 OG에만 걸리게 되므로 제외:
 * /법인공증준비·/부산선박등기·/선박등기).
 */
export type FieldPhotoVisual = {
  url: string;
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
  /** 원본 파일(공개하지 않는 원본 위치) */
  source: string;
};

const REGISTRY_VISIT = {
  src: "/image/현장/현장-부산지방법원등기국-방문.jpg",
  alt: "부산지방법원 등기국 입구에 선 안윤정 법무사",
  caption: "부산지방법원 등기국 방문(다옴법무사사무소 촬영)",
  width: 1600,
  height: 1200,
  source: "public/image/외근_여름_부산지방등기국 (2).jpg",
};

const WEST_COURT_VISIT = {
  src: "/image/현장/현장-부산지방법원서부지원-방문.jpg",
  alt: "부산지방법원 서부지원 입구에서 서류를 든 안윤정 법무사",
  caption: "부산지방법원 서부지원 방문(다옴법무사사무소 촬영)",
  width: 1600,
  height: 1200,
  source: "public/image/외근_여름_서부지원 (2).jpg",
};

const BUSANJIN_OFFICE_VISIT = {
  src: "/image/현장/현장-부산진구청-방문.jpg",
  alt: "부산진구청 현판 앞에 선 안윤정 법무사",
  caption: "부산진구청 민원 업무 방문(다옴법무사사무소 촬영)",
  width: 1600,
  height: 1200,
  source: "public/image/외근_진구청 (2).jpg",
};

export const FIELD_PHOTO_VISUALS: FieldPhotoVisual[] = [
  { url: "/부산지방법원등기국", ...REGISTRY_VISIT },
  { url: "/부산지방법원등기국법무사", ...REGISTRY_VISIT },
  { url: "/부산지방법원등기국부동산등기", ...REGISTRY_VISIT },
  { url: "/부산지방법원등기국법인등기", ...REGISTRY_VISIT },
  { url: "/부산지방법원등기국상속등기", ...REGISTRY_VISIT },
  { url: "/업무사례/부산지방법원등기국법무사", ...REGISTRY_VISIT },
  { url: "/업무사례/부산서부지원법무사", ...WEST_COURT_VISIT },
  { url: "/부산진구법무사", ...BUSANJIN_OFFICE_VISIT },
  { url: "/업무사례/부산진구법무사", ...BUSANJIN_OFFICE_VISIT },
  {
    url: "/상속포기필요서류",
    src: "/image/업무서류/서류-상속재산포기심판청구-위임장.jpg",
    alt: "상속재산포기 심판청구 제출 위임장과 전자소송 동의 확약서(청구인 이름 가림)",
    caption: "부산가정법원에 낸 상속포기 심판청구 위임장·확약서 — 청구인 이름은 가렸습니다",
    width: 1600,
    height: 1200,
    source: "public/image/서류/서류_상속포기.jpg",
  },
  {
    // 법인 페이지 3곳이 같은 사진을 대표로 쓰던 것을 나눔(2026-10-13). 촬영 장소는 특정하지 않는다.
    url: "/법인등기",
    src: "/image/썸네일-등기운영과.jpg",
    alt: "법인·부동산 등기 민원을 받는 등기소 등기운영과 창구",
    caption: "법인등기는 본점 소재지 관할 등기소에 신청합니다",
    width: 3000,
    height: 2250,
    source: "public/image/썸네일-등기운영과.jpg",
  },
];

const BY_URL = new Map(FIELD_PHOTO_VISUALS.map((v) => [v.url, v]));

export function getFieldPhotoVisual(url: string): FieldPhotoVisual | undefined {
  let key = url;
  try {
    key = decodeURIComponent(url);
  } catch {
    key = url;
  }
  return BY_URL.get(key.normalize("NFC"));
}
