import { getSeoEntityById } from "@/data/seo";
import { BUSAN_REGISTRY_OFFICES, type BusanRegistryOffice } from "@/lib/geo/busan-registry";
import { getRegionHubIdentity } from "@/lib/local-landing/region-hub-identity";
import type { PageSection } from "@/lib/pageData/types";
import type { SeoLandingSpec } from "./types";

/**
 * 지역×업무 랜딩마다 그 지역의 실제 접수처를 적는다(지역명만 바꾼 문서가 되지 않도록).
 * 관할: src/lib/geo/busan-registry.ts(등기정보광장·법원 등기과 안내 기준).
 * 법령: 부동산등기법 제7조·제7조의3, 가사소송법 제44조 제1항 제6호, 민법 제1019조 제1항, 상법 제183조·제317조 제4항.
 * 가정법원 이름은 공식 관할구역을 확인하지 못해 단정하지 않고 상속개시지 원칙만 적는다.
 */

const REGISTRY_SERVICES = new Set(["inheritance-registration", "real-estate-registration"]);
const FAMILY_SERVICES = new Set(["inheritance-renunciation", "qualified-acceptance"]);
const COMMERCIAL_SERVICES = new Set(["company-establishment", "corporate-registration", "director-change"]);

const INSTITUTION_OFFICE: Record<string, BusanRegistryOffice> = {
  "inst-buk-busan-registry": BUSAN_REGISTRY_OFFICES.bukbusan,
  "inst-nam-busan-registry": BUSAN_REGISTRY_OFFICES.nambusan,
  "inst-busan-east-registry": BUSAN_REGISTRY_OFFICES.dongbu,
  "inst-busan-registry-office": BUSAN_REGISTRY_OFFICES.deunggiguk,
};

/** 지역 엔티티 → 소속 구·군 이름 (동·역·신도시는 상위 구로 올라간다) */
function districtNameFor(regionKey: string | undefined): string | null {
  let entity = regionKey ? getSeoEntityById(regionKey) : undefined;
  for (let i = 0; entity && i < 3; i += 1) {
    if (entity.type === "district") return entity.name;
    entity = entity.parentRegion ? getSeoEntityById(entity.parentRegion) : undefined;
  }
  return null;
}

function officeForDistrict(name: string | null): BusanRegistryOffice | null {
  if (!name) return null;
  return Object.values(BUSAN_REGISTRY_OFFICES).find((o) => o.districts.includes(name)) ?? null;
}

function identityFor(district: string | null) {
  if (!district) return null;
  const hubSlug = district === "해운대구" ? "해운대법무사" : `${district}법무사`;
  return getRegionHubIdentity(hubSlug);
}

function localSituation(district: string | null, pattern: RegExp): string | null {
  const identity = identityFor(district);
  const hit = identity?.typicalSituations.find((s) => pattern.test(`${s.title} ${s.summary}`));
  return hit ? `${district}에서 자주 있는 상황 — ${hit.title}: ${hit.summary}` : null;
}

/** 구·군 허브에 따로 쓴 '먼저 확인할 사항'(동·생활권 기준) — 지역마다 다른 확인 항목 */
function localCheckFirst(district: string | null): string[] {
  const identity = identityFor(district);
  return (identity?.checkFirst ?? []).slice(0, 2).map((item) => `${district} 상담에서 먼저 확인: ${item}`);
}

export function buildRegionJurisdictionSection(spec: SeoLandingSpec): PageSection | null {
  const service = spec.serviceId ?? "";
  if (!REGISTRY_SERVICES.has(service) && !FAMILY_SERVICES.has(service) && !COMMERCIAL_SERVICES.has(service)) {
    return null;
  }
  const label = spec.regionLabel ?? spec.institutionShortName ?? spec.title;
  const serviceName = spec.serviceName ?? spec.title.replace(label, "").trim();
  const district = districtNameFor(spec.regionKey);
  const office =
    (spec.institutionId ? INSTITUTION_OFFICE[spec.institutionId] : null) ??
    (spec.slug.startsWith("동부지원") ? BUSAN_REGISTRY_OFFICES.dongbu : null) ??
    officeForDistrict(district);
  if (!office && !COMMERCIAL_SERVICES.has(service)) return null;
  const where = district && district !== label ? `${label}(${district})` : label;

  if (REGISTRY_SERVICES.has(service) && office) {
    const isInheritance = service === "inheritance-registration";
    return {
      id: "region-jurisdiction",
      title: `${label} ${serviceName}, 실제 접수처`,
      body: `${where} 소재 부동산의 등기는 ${office.name}(${office.address}) 관할입니다. ${office.note}`,
      items: [
        isInheritance
          ? "상속·유증 등기는 2025년 1월 31일부터 관할이 아닌 등기소에서도 처리할 수 있습니다(부동산등기법 제7조의3). 여러 지역 부동산을 함께 정리할 때 접수처를 모을 수 있는지 먼저 확인합니다."
          : "매매·증여 같은 부동산등기는 부동산 소재지를 관할하는 등기소에 신청합니다(부동산등기법 제7조).",
        `의뢰인이 ${label}에 살아도 부동산이 다른 구에 있으면 그 부동산 소재지 관할을 따릅니다.`,
        `${office.name}은 ${office.districts.join("·")} 부동산등기를 함께 맡습니다.`,
        localSituation(district, isInheritance ? /상속/ : /매매|증여|등기|임대/),
        ...localCheckFirst(district),
      ].filter((x): x is string => Boolean(x)),
    };
  }

  if (FAMILY_SERVICES.has(service)) {
    return {
      id: "region-jurisdiction",
      title: `${label} ${serviceName}, 어디에 신고하나요?`,
      body: `${serviceName}은 등기소가 아니라 가정법원에 신고합니다. 관할은 고인의 마지막 주소지(상속개시지)를 관할하는 가정법원이며(가사소송법 제44조 제1항 제6호), 상속인이 ${label}에 산다는 이유만으로 정해지지 않습니다.`,
      items: [
        `고인의 마지막 주소가 ${where}였다면 그 주소를 기준으로 관할 가정법원을 확인합니다.`,
        office
          ? `상속재산에 ${label} 부동산이 있으면 이후 상속등기는 ${office.name}(${office.address}) 관할입니다. 상속등기는 관할이 아닌 등기소에서도 처리할 수 있습니다(부동산등기법 제7조의3).`
          : null,
        "신고 기한은 상속개시 있음을 안 날부터 3개월입니다(민법 제1019조 제1항). 등기·취득세 일정과는 따로 봅니다.",
        localSituation(district, /상속|한정|포기|채무/),
        ...localCheckFirst(district),
      ].filter((x): x is string => Boolean(x)),
    };
  }

  const hq = BUSAN_REGISTRY_OFFICES.deunggiguk;
  return {
    id: "region-jurisdiction",
    title: `${label} ${serviceName}, 실제 접수처`,
    body: `${where}에 본점을 두는 회사의 상업등기는 부산 전역과 같이 ${hq.name}(${hq.address}) 관할입니다.`,
    items: [
      service === "director-change"
        ? "주식회사의 임원 변경등기는 변경이 생긴 날부터 본점 소재지에서 2주 안에 신청합니다(상법 제317조 제4항, 제183조). 취임일·퇴임일을 의사록과 대조합니다."
        : service === "company-establishment"
          ? "설립등기도 본점 소재지 관할인 등기국에 신청합니다. 본점 주소는 정관과 같은 표기로 맞춥니다."
          : "임원·본점·목적 변경처럼 등기사항이 바뀌면 본점 소재지 관할 등기국에 변경등기를 신청합니다.",
      "본점을 부산 안의 다른 구로 옮기는 경우와 부산 밖으로 옮기는 경우는 신청 방법이 다르니 옮길 주소를 먼저 확인합니다.",
      office
        ? `법인 명의 부동산이 ${label}에 있다면 그 부동산등기는 ${office.name} 관할입니다.`
        : null,
      localSituation(district, /법인|회사|임원|본점|설립/),
      ...localCheckFirst(district),
    ].filter((x): x is string => Boolean(x)),
  };
}
