/**
 * 부산 부동산등기 관할 — 2021년 등기국 통합 이후 공식 기준.
 * 출처: 등기정보광장(data.iros.go.kr), 부산지방법원 동부·서부지원 등기과/소 안내.
 * 상업등기·선박등기·동산·채권담보등기는 부산 전역이 등기국 관할.
 * 개별 사건의 접수 창구는 상담 시 소재지로 다시 확인한다.
 */

export type BusanRegistryOfficeId =
  | "deunggiguk"
  | "dongbu"
  | "nambusan"
  | "seobu"
  | "bukbusan";

export type BusanRegistryOffice = {
  id: BusanRegistryOfficeId;
  name: string;
  address: string;
  districts: string[];
  note: string;
};

export const BUSAN_REGISTRY_OFFICES: Record<
  BusanRegistryOfficeId,
  BusanRegistryOffice
> = {
  deunggiguk: {
    id: "deunggiguk",
    name: "부산지방법원 등기국",
    address: "부산광역시 연제구 법원로 8",
    districts: [
      "중구",
      "서구",
      "동구",
      "영도구",
      "부산진구",
      "동래구",
      "연제구",
      "금정구",
    ],
    note: "2021년 기존 부산진등기소·중부산등기소·금정등기소 사무가 등기국으로 통합되었습니다.",
  },
  dongbu: {
    id: "dongbu",
    name: "부산지방법원 동부지원 등기과",
    address: "부산광역시 해운대구 재반로112번길 20",
    districts: ["해운대구", "기장군"],
    note: "해운대구·기장군 부동산등기 관할입니다.",
  },
  nambusan: {
    id: "nambusan",
    name: "남부산등기소",
    address: "부산광역시 남구 수영로 312",
    districts: ["남구", "수영구"],
    note: "남구·수영구 부동산등기 관할입니다.",
  },
  seobu: {
    id: "seobu",
    name: "부산지방법원 서부지원 등기과",
    address: "부산광역시 강서구 명지국제7로 77",
    districts: ["사하구", "강서구"],
    note: "사하구·강서구 부동산등기 관할입니다. 서부지원 청사 내 등기과입니다.",
  },
  bukbusan: {
    id: "bukbusan",
    name: "북부산등기소",
    address: "부산광역시 북구 사상로583번길 14",
    districts: ["북구", "사상구"],
    note: "북구·사상구 부동산등기 관할입니다.",
  },
};

/** districtProfiles.regionKey → 부동산등기 관할 */
const REGION_KEY_TO_OFFICE: Record<string, BusanRegistryOfficeId> = {
  yeonje: "deunggiguk",
  dongnae: "deunggiguk",
  busanjin: "deunggiguk",
  junggu: "deunggiguk",
  jung: "deunggiguk",
  seogu: "deunggiguk",
  seo: "deunggiguk",
  donggu: "deunggiguk",
  dong: "deunggiguk",
  yeongdo: "deunggiguk",
  geumjeong: "deunggiguk",
  haeundae: "dongbu",
  centum: "dongbu",
  jaesong: "dongbu",
  banyeo: "dongbu",
  gijang: "dongbu",
  jeonggwan: "dongbu",
  suyeong: "nambusan",
  gwanganri: "nambusan",
  namgu: "nambusan",
  nam: "nambusan",
  munhyeon: "nambusan",
  buk: "bukbusan",
  sasang: "bukbusan",
  saha: "seobu",
  gangseo: "seobu",
  myeongji: "seobu",
  ecodelta: "seobu",
};

const MERGED_OFFICE_NOTE =
  "중부산등기소·부산진등기소는 2021년부터 부산지방법원 등기국으로 통합되어 별도 접수 창구로 운영되지 않습니다.";

export function getRegistryOfficeForRegionKey(
  regionKey: string,
): BusanRegistryOffice | null {
  const id = REGION_KEY_TO_OFFICE[regionKey];
  return id ? BUSAN_REGISTRY_OFFICES[id] : null;
}

export function buildJurisdictionGuideForRegionKey(regionKey: string): {
  title: string;
  address: string;
  accessNote: string;
  jurisdictionNote: string;
  practicalNotes: string[];
} {
  const office = getRegistryOfficeForRegionKey(regionKey);
  const commercial =
    "법인 본점(상업등기)은 부산 전역이 부산지방법원 등기국 관할인 경우가 많습니다.";

  if (!office) {
    return {
      title: "부산 관할 등기소 안내",
      address: BUSAN_REGISTRY_OFFICES.deunggiguk.address,
      accessNote:
        "부동산 소재지 또는 법인 본점에 따라 관할이 달라지므로 상담 시 확인합니다.",
      jurisdictionNote: `${commercial} 부동산등기는 구·군별로 등기국·동부지원 등기과·남부산등기소·서부지원 등기과·북부산등기소로 나뉩니다.`,
      practicalNotes: [
        MERGED_OFFICE_NOTE,
        "관할을 잘못 접수하면 반려·이송될 수 있어 소재지를 먼저 확인합니다.",
        "인터넷등기소(전자등기) 가능 여부는 사건 유형별로 다릅니다.",
      ],
    };
  }

  return {
    title: `${office.name} 관할 안내`,
    address: office.address,
    accessNote: `${office.districts.join("·")} 부동산등기는 ${office.name} 관할입니다. 방문 창구·전자등기 가능 여부는 사건별로 확인합니다.`,
    jurisdictionNote: `${office.districts.join("·")} 소재 부동산등기는 ${office.name}(${office.address}) 관할입니다. ${office.note} ${commercial} 정확한 접수처는 등기부와 주소를 확인한 뒤 안내합니다.`,
    practicalNotes: [
      MERGED_OFFICE_NOTE,
      "관할 오접수는 반려·이송 사유가 될 수 있습니다.",
      "등록면허세·취득세 신고 기한과 등기 접수 순서를 맞춥니다.",
    ],
  };
}

export function mergedRegistryDisclaimer(): string {
  return MERGED_OFFICE_NOTE;
}
