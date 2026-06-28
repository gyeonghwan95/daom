import {
  getSeoEntitiesByType,
  getSeoEntityById,
  seoInstitutions,
  seoIntents,
  seoRegions,
  seoServices,
  seoSpecialKeywords,
} from "@/data/seo";
import type { SeoIntentEntity } from "@/data/seo";
import { getAllLocalLandingSlugs } from "@/lib/local-landing/config";
import { getAllTopicHubSlugs } from "@/lib/topic-hubs/config";
import { normalizeRouteSlug } from "@/lib/seo/slug";
import {
  INTENT_URL_SUFFIX,
  SPECIAL_KOREAN_SLUG,
  getInstitutionShortName,
  getLawyerSlugLabel,
  getRegionServicePrefix,
} from "./labels";
import type { SeoLandingPageType, SeoLandingSpec } from "./types";

const LAWYER_REGION_TYPES = new Set([
  "city",
  "district",
  "neighborhood",
  "living-area",
  "station-area",
]);

const SERVICE_REGION_TYPES = new Set([
  "city",
  "district",
  "neighborhood",
  "living-area",
  "station-area",
  "new-town",
  "industrial-zone",
]);

const CORE_SERVICE_IDS = [
  "inheritance-registration",
  "inheritance-renunciation",
  "qualified-acceptance",
  "corporate-registration",
  "company-establishment",
  "director-change",
  "real-estate-registration",
  "ownership-transfer",
  "personal-rehabilitation",
  "bankruptcy",
  "redevelopment-registration",
  "reconstruction-registration",
  "ship-registration",
];

function loadReservedSlugs(): Set<string> {
  const slugs = [...getAllLocalLandingSlugs(), ...getAllTopicHubSlugs()];
  return new Set(slugs.map((s) => normalizeRouteSlug(s)));
}

function specBase(
  slug: string,
  type: SeoLandingPageType,
  title: string,
  h1: string,
  priority: number,
  isHub: boolean,
  seed: string,
  keywords: string[],
  extra: Partial<SeoLandingSpec> = {},
): SeoLandingSpec {
  const normalized = normalizeRouteSlug(slug);
  return {
    slug: normalized,
    path: `/${normalized}`,
    type,
    title,
    h1,
    priority,
    isHub,
    category: extra.category ?? "local",
    keywords,
    seed,
    ...extra,
  };
}

function addSpec(
  specs: SeoLandingSpec[],
  slugOwners: Map<string, string>,
  reserved: Set<string>,
  spec: SeoLandingSpec,
): void {
  const key = normalizeRouteSlug(spec.slug);
  if (reserved.has(key)) return;
  if (slugOwners.has(key)) return;
  slugOwners.set(key, spec.seed);
  specs.push({ ...spec, slug: key });
}

function buildRegionLawyerSpecs(
  specs: SeoLandingSpec[],
  slugOwners: Map<string, string>,
  reserved: Set<string>,
): void {
  for (const region of seoRegions) {
    if (!LAWYER_REGION_TYPES.has(region.type)) continue;
    if (region.priority < 70 && region.type !== "city" && region.type !== "district") {
      continue;
    }

    const label = getLawyerSlugLabel(region);
    const slug = `${label}법무사`;
    const isHub = region.type === "city" || region.type === "district";

    addSpec(specs, slugOwners, reserved, specBase(
      slug,
      "region-lawyer",
      `${label} 법무사`,
      `${label} 법무사 상담`,
      region.priority + (isHub ? 8 : 0),
      isHub,
      `lawyer:${region.id}`,
      [`${label} 법무사`, `${label} 등기`, "부산 법무사"],
      {
        category: "local",
        regionId: region.id,
        regionLabel: label,
        regionKey: region.id,
        serviceId: region.relatedServices[0],
        serviceSiteSlug: region.relatedServices[0],
      },
    ));
  }
}

function buildRegionServiceSpecs(
  specs: SeoLandingSpec[],
  slugOwners: Map<string, string>,
  reserved: Set<string>,
): void {
  for (const region of seoRegions) {
    if (!SERVICE_REGION_TYPES.has(region.type)) continue;

    const prefix = getRegionServicePrefix(region);
    const serviceIds = new Set<string>([
      ...region.relatedServices,
      ...(region.type === "district" || region.type === "city"
        ? CORE_SERVICE_IDS.slice(0, 6)
        : []),
    ]);

    for (const serviceId of serviceIds) {
      const service = getSeoEntityById(serviceId);
      if (!service || service.type !== "service") continue;
      if (service.priority < 72 && !region.relatedServices.includes(serviceId)) {
        continue;
      }

      const slug = `${prefix}${service.name}`;
      addSpec(specs, slugOwners, reserved, specBase(
        slug,
        "region-service",
        `${prefix} ${service.name}`,
        `${prefix} ${service.name} 안내`,
        Math.round((region.priority + service.priority) / 2),
        false,
        `region-service:${region.id}:${service.id}`,
        [`${prefix}${service.name}`, `${prefix} 법무사`, service.name],
        {
          category: "local",
          regionId: region.id,
          regionLabel: prefix,
          regionKey: region.id,
          serviceId: service.id,
          serviceName: service.name,
          serviceSiteSlug: service.id,
        },
      ));
    }
  }
}

function buildServiceIntentSpecs(
  specs: SeoLandingSpec[],
  slugOwners: Map<string, string>,
  reserved: Set<string>,
): void {
  const intentEntities = seoIntents.filter((i) => INTENT_URL_SUFFIX[i.id]);

  for (const service of seoServices) {
    if (service.priority < 76) continue;

    for (const intent of intentEntities) {
      const suffix = INTENT_URL_SUFFIX[intent.id];
      if (!suffix) continue;

      const slug = `${service.name}${suffix}`;
      const title = `${service.name} ${intent.name}`;
      const isCost =
        intent.id === "intent-cost" ||
        intent.id === "intent-fee-table" ||
        intent.id === "intent-penalty";

      addSpec(specs, slugOwners, reserved, specBase(
        slug,
        "service-intent",
        title,
        `${service.name} ${intent.name} 안내`,
        Math.round((service.priority + intent.priority) / 2),
        false,
        `service-intent:${service.id}:${intent.id}`,
        [slug, `${service.name} ${intent.name}`, "부산 법무사"],
        {
          category: isCost ? "cost" : "local",
          serviceId: service.id,
          serviceName: service.name,
          serviceSiteSlug: service.id,
          intentId: intent.id,
          intentSuffix: suffix,
        },
      ));
    }
  }
}

function buildInstitutionLawyerSpecs(
  specs: SeoLandingSpec[],
  slugOwners: Map<string, string>,
  reserved: Set<string>,
): void {
  for (const institution of seoInstitutions) {
    const shortName = getInstitutionShortName(institution);
    const slug = `${shortName}법무사`;

    addSpec(specs, slugOwners, reserved, specBase(
      slug,
      "institution-lawyer",
      `${institution.name} 법무사`,
      `${institution.name} 인근 법무사`,
      institution.priority,
      false,
      `inst-lawyer:${institution.id}`,
      [`${shortName} 법무사`, institution.name, "부산 법무사"],
      {
        category: "court",
        institutionId: institution.id,
        institutionName: institution.name,
        institutionShortName: shortName,
        serviceId: institution.relatedServices[0],
        serviceSiteSlug: institution.relatedServices[0],
        regionId: institution.parentRegion ?? "busan",
        regionLabel: "부산",
        regionKey: "busan",
      },
    ));
  }
}

function buildInstitutionServiceSpecs(
  specs: SeoLandingSpec[],
  slugOwners: Map<string, string>,
  reserved: Set<string>,
): void {
  for (const institution of seoInstitutions) {
    const shortName = getInstitutionShortName(institution);

    for (const serviceId of institution.relatedServices) {
      const service = getSeoEntityById(serviceId);
      if (!service) continue;

      const slug = `${shortName}${service.name}`;
      addSpec(specs, slugOwners, reserved, specBase(
        slug,
        "institution-service",
        `${institution.name} ${service.name}`,
        `${shortName} ${service.name}`,
        Math.round((institution.priority + service.priority) / 2),
        false,
        `inst-service:${institution.id}:${service.id}`,
        [slug, institution.name, service.name],
        {
          category: "court",
          institutionId: institution.id,
          institutionName: institution.name,
          institutionShortName: shortName,
          serviceId: service.id,
          serviceName: service.name,
          serviceSiteSlug: service.id,
          regionId: institution.parentRegion ?? "busan",
          regionLabel: "부산",
          regionKey: "busan",
        },
      ));
    }
  }
}

function buildSpecialSpecs(
  specs: SeoLandingSpec[],
  slugOwners: Map<string, string>,
  reserved: Set<string>,
): void {
  for (const special of seoSpecialKeywords) {
    const slug = SPECIAL_KOREAN_SLUG[special.id];
    if (!slug) continue;

    const isHub = special.id.includes("female-lawyer");
    const isCost =
      special.searchIntent === "cost" || special.searchIntent === "fee-table";
    const isIndustry = special.searchIntent === "industry";
    const isRedev =
      special.name.includes("재개발") || special.name.includes("재건축");

    let category: SeoLandingSpec["category"] = "local";
    if (isCost) category = "cost";
    else if (isIndustry || isRedev) category = "realEstate";

    addSpec(specs, slugOwners, reserved, specBase(
      slug,
      "special",
      special.name,
      special.name,
      special.priority,
      isHub,
      `special:${special.id}`,
      special.keywords,
      {
        category,
        specialId: special.id,
        regionId: special.parentRegion ?? special.relatedRegions[0],
        regionLabel: special.name.includes("부산") ? "부산" : undefined,
        regionKey: special.parentRegion ?? "busan",
        serviceId: special.relatedServices[0],
        serviceName: getSeoEntityById(special.relatedServices[0] ?? "")?.name,
        serviceSiteSlug: special.relatedServices[0],
      },
    ));
  }

  const extraSpecials: Array<{ slug: string; title: string; serviceId: string; seed: string }> = [
    { slug: "부산재개발등기", title: "부산 재개발등기", serviceId: "redevelopment-registration", seed: "special:redev-busan" },
    { slug: "부산재건축등기", title: "부산 재건축등기", serviceId: "reconstruction-registration", seed: "special:recon-busan" },
    { slug: "명례산업단지법인등기", title: "명례산업단지 법인등기", serviceId: "corporate-registration", seed: "special:myeongrye-corp" },
    { slug: "녹산산업단지법인등기", title: "녹산산업단지 법인등기", serviceId: "corporate-registration", seed: "special:noksan-corp" },
    { slug: "동부지원상속등기", title: "동부지원 상속등기", serviceId: "inheritance-registration", seed: "special:east-inheritance" },
    { slug: "부산가정법원상속포기", title: "부산가정법원 상속포기", serviceId: "inheritance-renunciation", seed: "special:family-renunciation" },
    { slug: "부산회생법원개인회생", title: "부산회생법원 개인회생", serviceId: "personal-rehabilitation", seed: "special:rehab-court" },
  ];

  for (const item of extraSpecials) {
    const service = getSeoEntityById(item.serviceId);
    addSpec(specs, slugOwners, reserved, specBase(
      item.slug,
      "special",
      item.title,
      item.title,
      82,
      false,
      item.seed,
      [item.slug, item.title, "부산 법무사"],
      {
        category: item.slug.includes("산업단지") ? "businessDistrict" : item.slug.includes("재개발") || item.slug.includes("재건축") ? "realEstate" : "court",
        serviceId: item.serviceId,
        serviceName: service?.name,
        serviceSiteSlug: item.serviceId,
        regionId: "busan",
        regionLabel: "부산",
        regionKey: "busan",
      },
    ));
  }
}

let cachedSpecs: SeoLandingSpec[] | null = null;

export function buildSeoLandingSpecs(): SeoLandingSpec[] {
  if (cachedSpecs) return cachedSpecs;

  const reserved = loadReservedSlugs();
  const specs: SeoLandingSpec[] = [];
  const slugOwners = new Map<string, string>();

  buildRegionLawyerSpecs(specs, slugOwners, reserved);
  buildRegionServiceSpecs(specs, slugOwners, reserved);
  buildServiceIntentSpecs(specs, slugOwners, reserved);
  buildInstitutionLawyerSpecs(specs, slugOwners, reserved);
  buildInstitutionServiceSpecs(specs, slugOwners, reserved);
  buildSpecialSpecs(specs, slugOwners, reserved);

  specs.sort((a, b) => b.priority - a.priority);
  cachedSpecs = specs;
  return specs;
}

export function getSeoLandingSpecBySlug(slug: string): SeoLandingSpec | undefined {
  const key = normalizeRouteSlug(slug);
  return buildSeoLandingSpecs().find((s) => s.slug === key);
}

export function getAllSeoLandingSlugs(): string[] {
  return buildSeoLandingSpecs().map((s) => s.slug);
}

export function getAllSeoLandingPaths(): string[] {
  return buildSeoLandingSpecs().map((s) => s.path);
}

export function validateSeoLandingSpecs(): void {
  const specs = buildSeoLandingSpecs();
  const slugOwners = new Map<string, string>();
  const reserved = loadReservedSlugs();

  for (const spec of specs) {
    if (reserved.has(spec.slug)) {
      throw new Error(
        `[seo-landing] generated slug collides with existing page: ${spec.slug} (${spec.seed})`,
      );
    }
    if (slugOwners.has(spec.slug)) {
      throw new Error(
        `[seo-landing] duplicate generated slug: ${spec.slug} (${spec.seed} vs ${slugOwners.get(spec.slug)})`,
      );
    }
    slugOwners.set(spec.slug, spec.seed);
  }
}

export function getSeoLandingStats() {
  const specs = buildSeoLandingSpecs();
  const byType = specs.reduce<Record<string, number>>((acc, spec) => {
    acc[spec.type] = (acc[spec.type] ?? 0) + 1;
    return acc;
  }, {});
  return { total: specs.length, byType };
}
