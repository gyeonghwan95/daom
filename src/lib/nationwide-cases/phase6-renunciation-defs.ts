import type { RegionLandingDef } from "./types";
import { RENUNCIATION_CITY_SPECS } from "@/lib/metro-remote/pages/renunciation-cities";

/**
 * 6차(2026-11-23) — 도시별 상속포기 페이지의 주소·이동 경로·사이트맵 등록용 정의.
 * 화면과 메타데이터는 metro-remote(RENUNCIATION_CITY_SPECS)가 그린다. 여기 값은 목록·사이트맵·품질 점수용.
 * + 성북구 상속등기(자동완성 "성북구 상속등기하는곳" 수요, 서울 페이지가 17위로 대신 노출).
 */
const PARENT: Record<string, string> = {
  서울: "서울",
  인천: "인천",
  부천: "경기",
  대전: "대전",
  천안: "충남",
  수원: "경기",
  안양: "경기",
  안산: "경기",
  평택: "경기",
  의정부: "경기",
  일산: "경기",
  남양주: "경기",
  청주: "충북",
  제주: "제주",
};

const renunciationDefs: RegionLandingDef[] = RENUNCIATION_CITY_SPECS.map((spec) => ({
  slug: spec.slug,
  regionName: spec.region,
  parentRegion: PARENT[spec.region] ?? spec.region,
  regionType: "시",
  priority: 2,
  primaryKeyword: `${spec.region} 상속포기 법무사`,
  secondaryKeywords: [`${spec.region} 상속포기`, `${spec.region} 한정승인`, `${spec.region} 상속포기 비용`],
  seoTitle: spec.metaTitle.replace(/ \| 다옴법무사사무소$/, ""),
  metaDescription: spec.description,
  h1: spec.h1,
  disclosure: `다옴법무사사무소는 부산 해운대구에 있으며 ${spec.region}에 별도 지점이 있는 것은 아닙니다. 상속포기·한정승인 신고서는 전자소송·우편으로 제출합니다.`,
  localIntro: spec.lead.join(" "),
  scenarioIds: ["heir-scattered", "overseas-heir"],
  propertyTypeIds: ["apt", "house"],
  uniqueFaqIds: ["deadline-3m", "visit-need"],
  relatedRegionSlugs: [`${spec.region}상속등기법무사`.replace(/^일산/, "일산"), "지역별상속등기법무사"],
  relatedServiceSlugs: ["전국상속등기법무사"],
  ctaTitle: `${spec.region} 상속포기 기한 확인`,
  ctaDescription: "돌아가신 날짜와 알고 있는 빚을 알려 주시면 남은 기한과 서류를 안내합니다.",
  published: true,
  kind: "region",
  noticeType: "remote-accept",
}));

const seongbukDef: RegionLandingDef = {
  slug: "성북구상속등기법무사",
  regionName: "성북구",
  parentRegion: "서울",
  regionType: "구",
  priority: 2,
  primaryKeyword: "성북구 상속등기 법무사",
  secondaryKeywords: ["성북구 상속등기", "성북구 상속 법무사", "길음 상속등기", "정릉 상속등기"],
  seoTitle: "성북구 상속등기 법무사｜정릉·길음·돈암 주택과 재개발 구역 상속",
  metaDescription:
    "성북구 상속등기 법무사 안내. 정릉·장위·길음 일대 단독·다가구와 재개발 구역 주택, 대단지 아파트 상속등기 서류와 순서를 정리했습니다. 부산 해운대 사무소에서 비대면으로 진행합니다.",
  h1: "성북구 부모님 집 상속등기, 단독주택과 재개발 구역이면 먼저 볼 것",
  disclosure:
    "다옴법무사사무소는 부산 해운대구에 있으며 성북구에 별도 지점이 있는 것은 아닙니다. 상속등기 관할 특례와 비대면 서류 전달 방식을 검토하여 성북구 소재 부동산도 진행 방법을 안내합니다.",
  localIntro:
    "성북구는 정릉·성북동의 오래된 단독주택, 장위·길음 일대 재개발로 바뀐 대단지 아파트, 돈암·안암의 다가구가 함께 있는 지역입니다. 오래된 단독주택은 토지와 건물 명의가 다르거나 건물이 미등기인 경우가 있어 토지대장·건축물대장과 등기부를 먼저 대조합니다. 재개발 구역 안의 주택이라면 상속등기와 별도로 조합에 조합원 변경을 신고해야 하고, 여러 상속인이 지분으로 받으면 대표조합원 한 명을 정해야 합니다. 다가구는 세입자 보증금이 상속채무로 함께 넘어오므로 임대차 현황을 먼저 정리합니다. 다옴법무사사무소는 부산 해운대구에 있으며 성북구에 별도 지점이 있는 것은 아닙니다. 서울·경기·부산에 흩어진 상속인의 서류를 우편으로 모아 관할 특례로 신청하는 방법을 먼저 검토하고, 공과금과 법무사 보수를 구분해 안내합니다.",
  scenarioIds: ["heir-scattered", "sell-first", "multi-gu"],
  propertyTypeIds: ["apt", "house"],
  uniqueFaqIds: ["seoul-search", "cost-split"],
  relatedRegionSlugs: ["서울상속등기법무사", "노원구상속등기법무사", "지역별상속등기법무사"],
  relatedServiceSlugs: ["전국상속등기법무사", "전국비대면법무사"],
  ctaTitle: "성북구 상속등기 가능 여부 확인",
  ctaDescription: "단독주택·다가구·재개발 구역 여부와 상속인 거주지를 알려주시면 서류 목록을 안내합니다.",
  published: true,
  kind: "region",
  noticeType: "jurisdiction-exception",
};

export const phase6RenunciationDefs: RegionLandingDef[] = [...renunciationDefs, seongbukDef];

/** 같은 도시 상속등기 페이지 → 상속포기 페이지 연결(관련 지역 첫 칸) */
export function withRenunciationLinks(defs: RegionLandingDef[]): RegionLandingDef[] {
  const targets = new Map(RENUNCIATION_CITY_SPECS.map((s) => [`${s.region}상속등기법무사`, s.slug]));
  return defs.map((d) => {
    const r = targets.get(d.slug);
    if (!r || d.relatedRegionSlugs.includes(r)) return d;
    return { ...d, relatedRegionSlugs: [r, ...d.relatedRegionSlugs] };
  });
}
