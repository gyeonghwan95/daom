/** Semantic keyword → preferred URL. Rank is not inferred. */

export type RegionType =
  | "BUSAN"
  | "DISTRICT"
  | "NEIGHBORHOOD"
  | "LIVING_AREA"
  | "NEARBY_CITY"
  | "NONE";

export type BusinessField =
  | "GENERAL"
  | "INHERITANCE"
  | "REAL_ESTATE"
  | "CORPORATE"
  | "REHABILITATION"
  | "LEASE"
  | "CIVIL"
  | "LOCAL";

export type KeywordMeta = {
  keyword: string;
  cluster: string;
  region: string | null;
  regionType: RegionType;
  intent: string;
  service: BusinessField;
  preferredUrl: string;
  parentHubUrl?: string;
};

function compact(s: string): string {
  return s.replace(/\s+/g, "");
}

const DISTRICT_LAWYER: Record<string, string> = {
  해운대: "/해운대법무사",
  해운대구: "/해운대법무사",
  수영구: "/수영구법무사",
  연제구: "/연제구법무사",
  동래구: "/동래구법무사",
  부산진구: "/부산진구법무사",
  남구: "/남구법무사",
  북구: "/북구법무사",
  금정구: "/금정구법무사",
  사상구: "/사상구법무사",
  사하구: "/사하구법무사",
  강서구: "/강서구법무사",
  기장군: "/기장군법무사",
  중구: "/중구법무사",
  서구: "/서구법무사",
  동구: "/동구법무사",
};

const DISTRICT_INH: Record<string, string> = {
  해운대: "/해운대구상속등기",
  해운대구: "/해운대구상속등기",
  센텀: "/해운대구상속등기",
  수영구: "/수영구상속등기",
  연제구: "/연제구상속등기",
  동래구: "/동래구상속등기",
  부산진구: "/부산진구상속등기",
  남구: "/남구상속등기",
  북구: "/북구상속등기",
  금정구: "/금정구상속등기",
  사상구: "/사상구상속등기",
  사하구: "/사하구상속등기",
  강서구: "/강서구상속등기",
  기장군: "/기장군상속등기",
};

const DISTRICT_RE: Record<string, string> = {
  해운대: "/해운대구부동산등기",
  해운대구: "/해운대구부동산등기",
  센텀: "/센텀부동산등기",
  수영구: "/수영구부동산등기",
  연제구: "/연제구부동산등기",
  동래구: "/동래구부동산등기",
  부산진구: "/부산진구부동산등기",
  남구: "/남구부동산등기",
  북구: "/북구부동산등기",
  금정구: "/금정구부동산등기",
  사상구: "/사상구부동산등기",
  사하구: "/사하구부동산등기",
  강서구: "/강서구부동산등기",
  기장군: "/기장군부동산등기",
};

const DISTRICT_CORP: Record<string, string> = {
  해운대: "/해운대구법인등기",
  해운대구: "/해운대구법인등기",
  센텀: "/센텀법인설립등기",
  수영구: "/수영구법인등기",
  연제구: "/연제구법인등기",
  동래구: "/동래구법인등기",
  부산진구: "/부산진구법무사",
  남구: "/남구법무사",
  북구: "/북구법무사",
  금정구: "/금정구법무사",
  사상구: "/사상법무사",
  사하구: "/사하구법무사",
  강서구: "/강서구법무사",
  기장군: "/기장군법인등기",
};

const DISTRICT_REHAB: Record<string, string> = {
  해운대구: "/부산개인회생법무사",
  수영구: "/수영구개인회생",
  연제구: "/부산개인회생법무사",
  동래구: "/부산개인회생법무사",
  부산진구: "/부산개인회생법무사",
  남구: "/부산개인회생법무사",
  북구: "/북구개인회생",
  사하구: "/부산개인회생법무사",
};

const NEIGHBOR_LAWYER: Record<string, { url: string; parent: string; type: RegionType }> =
  {
    센텀시티: { url: "/센텀법무사", parent: "/해운대법무사", type: "LIVING_AREA" },
    센텀: { url: "/센텀법무사", parent: "/해운대법무사", type: "LIVING_AREA" },
    재송동: { url: "/재송동법무사", parent: "/해운대법무사", type: "NEIGHBORHOOD" },
    반여동: { url: "/반여동법무사", parent: "/해운대법무사", type: "NEIGHBORHOOD" },
    우동: { url: "/우동법무사", parent: "/해운대법무사", type: "NEIGHBORHOOD" },
    좌동: { url: "/좌동법무사", parent: "/해운대법무사", type: "NEIGHBORHOOD" },
    중동: { url: "/중동법무사", parent: "/해운대법무사", type: "NEIGHBORHOOD" },
    송정동: { url: "/해운대법무사", parent: "/해운대법무사", type: "NEIGHBORHOOD" },
    장산: { url: "/좌동법무사", parent: "/해운대법무사", type: "LIVING_AREA" },
    마린시티: { url: "/해운대법무사", parent: "/해운대법무사", type: "LIVING_AREA" },
    광안동: { url: "/광안동법무사", parent: "/수영구법무사", type: "NEIGHBORHOOD" },
    광안리: { url: "/광안리법무사", parent: "/수영구법무사", type: "LIVING_AREA" },
    민락동: { url: "/민락동법무사", parent: "/수영구법무사", type: "NEIGHBORHOOD" },
    망미동: { url: "/망미동법무사", parent: "/수영구법무사", type: "NEIGHBORHOOD" },
    남천동: { url: "/남천동법무사", parent: "/수영구법무사", type: "NEIGHBORHOOD" },
    연산동: { url: "/연산동법무사", parent: "/연제구법무사", type: "NEIGHBORHOOD" },
    거제동: { url: "/거제동법무사", parent: "/연제구법무사", type: "NEIGHBORHOOD" },
    명륜동: { url: "/동래구법무사", parent: "/동래구법무사", type: "NEIGHBORHOOD" },
    온천동: { url: "/온천동법무사", parent: "/동래구법무사", type: "NEIGHBORHOOD" },
    사직동: { url: "/사직동법무사", parent: "/동래구법무사", type: "NEIGHBORHOOD" },
    낙민동: { url: "/동래구법무사", parent: "/동래구법무사", type: "NEIGHBORHOOD" },
    서면: { url: "/서면법무사", parent: "/부산진구법무사", type: "LIVING_AREA" },
    부전동: { url: "/부전동법무사", parent: "/부산진구법무사", type: "NEIGHBORHOOD" },
    전포동: { url: "/전포동법무사", parent: "/부산진구법무사", type: "NEIGHBORHOOD" },
    양정동: { url: "/부산진구법무사", parent: "/부산진구법무사", type: "NEIGHBORHOOD" },
    초읍동: { url: "/부산진구법무사", parent: "/부산진구법무사", type: "NEIGHBORHOOD" },
    대연동: { url: "/대연동법무사", parent: "/남구법무사", type: "NEIGHBORHOOD" },
    용호동: { url: "/용호동법무사", parent: "/남구법무사", type: "NEIGHBORHOOD" },
    용당동: { url: "/남구법무사", parent: "/남구법무사", type: "NEIGHBORHOOD" },
    문현동: { url: "/문현동법무사", parent: "/남구법무사", type: "NEIGHBORHOOD" },
    화명동: { url: "/화명동법무사", parent: "/북구법무사", type: "NEIGHBORHOOD" },
    덕천동: { url: "/덕천동법무사", parent: "/북구법무사", type: "NEIGHBORHOOD" },
    만덕동: { url: "/북구법무사", parent: "/북구법무사", type: "NEIGHBORHOOD" },
    장전동: { url: "/금정구법무사", parent: "/금정구법무사", type: "NEIGHBORHOOD" },
    구서동: { url: "/구서동법무사", parent: "/금정구법무사", type: "NEIGHBORHOOD" },
    부곡동: { url: "/부곡동법무사", parent: "/금정구법무사", type: "NEIGHBORHOOD" },
    주례동: { url: "/주례동법무사", parent: "/사상법무사", type: "NEIGHBORHOOD" },
    엄궁동: { url: "/사상법무사", parent: "/사상법무사", type: "NEIGHBORHOOD" },
    괘법동: { url: "/사상법무사", parent: "/사상법무사", type: "NEIGHBORHOOD" },
    하단동: { url: "/하단법무사", parent: "/사하구법무사", type: "NEIGHBORHOOD" },
    당리동: { url: "/사하구법무사", parent: "/사하구법무사", type: "NEIGHBORHOOD" },
    다대동: { url: "/다대동법무사", parent: "/사하구법무사", type: "NEIGHBORHOOD" },
    괴정동: { url: "/괴정동법무사", parent: "/사하구법무사", type: "NEIGHBORHOOD" },
    명지동: { url: "/명지법무사", parent: "/강서구법무사", type: "NEIGHBORHOOD" },
    명지: { url: "/명지법무사", parent: "/강서구법무사", type: "LIVING_AREA" },
    녹산: { url: "/강서구법무사", parent: "/강서구법무사", type: "LIVING_AREA" },
    정관읍: { url: "/정관법무사", parent: "/기장군법무사", type: "LIVING_AREA" },
    정관: { url: "/정관법무사", parent: "/기장군법무사", type: "LIVING_AREA" },
    일광읍: { url: "/일광읍법무사", parent: "/기장군법무사", type: "LIVING_AREA" },
    일광: { url: "/일광읍법무사", parent: "/기장군법무사", type: "LIVING_AREA" },
    기장읍: { url: "/기장읍법무사", parent: "/기장군법무사", type: "NEIGHBORHOOD" },
    남포동: { url: "/남포동법무사", parent: "/중구법무사", type: "NEIGHBORHOOD" },
    서대신동: { url: "/서구법무사", parent: "/서구법무사", type: "NEIGHBORHOOD" },
    동대신동: { url: "/서구법무사", parent: "/서구법무사", type: "NEIGHBORHOOD" },
  };

const EXACT: Record<string, Partial<KeywordMeta> & { preferredUrl: string }> = {
  "부산 법무사": { preferredUrl: "/", cluster: "busan-lawyer-home", service: "GENERAL", intent: "local-provider" },
  "부산 법무사 추천": { preferredUrl: "/부산법무사추천", cluster: "busan-lawyer-recommend", service: "GENERAL", intent: "provider-selection" },
  "부산 법무사 상담": { preferredUrl: "/부산법무사상담", cluster: "busan-lawyer-consult", service: "GENERAL", intent: "consultation" },
  "부산 법무사 비용": { preferredUrl: "/부산법무사비용", cluster: "busan-lawyer-cost", service: "GENERAL", intent: "cost" },
  "부산 법무사 수수료": { preferredUrl: "/부산법무사비용", cluster: "busan-lawyer-cost", service: "GENERAL", intent: "cost" },
  "부산 등기 법무사": { preferredUrl: "/부산등기법무사", cluster: "busan-registry-lawyer", service: "GENERAL", intent: "registry-provider" },
  "부산 법무사 사무소": { preferredUrl: "/부산법무사무소", cluster: "busan-office", service: "GENERAL", intent: "office" },
  "부산 무료법률상담": { preferredUrl: "/부산법률상담", cluster: "free-counsel-info", service: "GENERAL", intent: "public-vs-scrivener" },
  "부산 법무사 무료상담": { preferredUrl: "/부산법률상담", cluster: "free-counsel-info", service: "GENERAL", intent: "public-vs-scrivener" },
  "부산 여성 법무사": { preferredUrl: "/부산여성법무사", cluster: "female-lawyer", service: "GENERAL", intent: "provider-trait" },
  "부산 비대면 법무사": { preferredUrl: "/부산법무사비대면상담", cluster: "remote-lawyer", service: "GENERAL", intent: "remote" },
  "부산 온라인 법무사": { preferredUrl: "/부산법무사비대면상담", cluster: "remote-lawyer", service: "GENERAL", intent: "remote" },
  "부산 법무 업무": { preferredUrl: "/부산법무사", cluster: "busan-lawyer-hub", service: "GENERAL", intent: "scope" },
  "부산 등기 상담": { preferredUrl: "/부산등기법무사", cluster: "busan-registry-lawyer", service: "GENERAL", intent: "consultation" },
  "부산 법무사 전화상담": { preferredUrl: "/부산법무사상담", cluster: "busan-lawyer-consult", service: "GENERAL", intent: "phone-consult" },
  "부산 법무사 카카오톡 상담": { preferredUrl: "/부산법무사상담", cluster: "busan-lawyer-consult", service: "GENERAL", intent: "kakao-consult" },
  "부산 법무사 네이버 톡톡": { preferredUrl: "/부산법무사상담", cluster: "busan-lawyer-consult", service: "GENERAL", intent: "naver-talk" },
  "부산 법무사 견적": { preferredUrl: "/부산법무사비용", cluster: "busan-lawyer-cost", service: "GENERAL", intent: "quote" },
  "부산 법무사 업무": { preferredUrl: "/부산법무사", cluster: "busan-lawyer-hub", service: "GENERAL", intent: "scope" },
  "부산 전문 법무사": { preferredUrl: "/부산법무사", cluster: "busan-lawyer-hub", service: "GENERAL", intent: "expertise-without-title" },
  "시청 법무사 부산": { preferredUrl: "/연제구법무사", cluster: "yeonje-lawyer", service: "LOCAL", intent: "district-lawyer", region: "연제구", regionType: "DISTRICT" },
};

export function classifyKeyword(keyword: string): KeywordMeta {
  const exact = EXACT[keyword];
  if (exact) {
    return {
      keyword,
      cluster: exact.cluster ?? compact(keyword),
      region: exact.region ?? "부산",
      regionType: exact.regionType ?? "BUSAN",
      intent: exact.intent ?? "service",
      service: exact.service ?? "GENERAL",
      preferredUrl: exact.preferredUrl,
      parentHubUrl: exact.parentHubUrl,
    };
  }

  const c = compact(keyword);

  const nearby = nearbyMeta(keyword, c);
  if (nearby) return nearby;

  const localService = localServiceMeta(keyword, c);
  if (localService) return localService;

  const neighbor = neighborMeta(keyword, c);
  if (neighbor) return neighbor;

  const district = districtLawyerMeta(keyword, c);
  if (district) return district;

  return busanServiceMeta(keyword, c);
}

function nearbyMeta(keyword: string, c: string): KeywordMeta | null {
  const cities: { key: string; region: string; inh: string; ren?: string; corp?: string }[] = [
    { key: "양산", region: "양산", inh: "/양산상속등기법무사", ren: "/양산상속포기한정승인", corp: "/양산법인등기법무사" },
    { key: "김해", region: "김해", inh: "/김해상속등기법무사", ren: "/김해상속포기한정승인", corp: "/김해법인등기법무사" },
    { key: "울산", region: "울산", inh: "/울산상속등기법무사", ren: "/울산상속포기한정승인" },
    { key: "울주군", region: "울주군", inh: "/울주군상속등기법무사", ren: "/울주군상속포기한정승인" },
    { key: "창원", region: "창원", inh: "/창원상속등기법무사" },
    { key: "거제", region: "거제", inh: "/거제상속등기법무사", ren: "/거제상속포기법무사" },
    { key: "통영", region: "통영", inh: "/통영상속등기법무사" },
    { key: "경주", region: "경주", inh: "/경주상속등기법무사" },
    { key: "포항", region: "포항", inh: "/포항상속등기법무사", ren: "/포항상속포기한정승인" },
  ];
  for (const city of cities) {
    if (!c.includes(city.key)) continue;
    if (/법인/.test(c) && city.corp) {
      return row(keyword, `${city.region}-corporate`, city.region, "NEARBY_CITY", "corporate", "CORPORATE", city.corp);
    }
    if (/포기|한정/.test(c) && city.ren) {
      return row(keyword, `${city.region}-renunciation`, city.region, "NEARBY_CITY", "renunciation", "INHERITANCE", city.ren, city.inh);
    }
    return row(keyword, `${city.region}-inheritance`, city.region, "NEARBY_CITY", "inheritance-registration", "INHERITANCE", city.inh);
  }
  return null;
}

function localServiceMeta(keyword: string, c: string): KeywordMeta | null {
  const districtKeys = Object.keys(DISTRICT_LAWYER).sort((a, b) => b.length - a.length);
  const neighborKeys = Object.keys(NEIGHBOR_LAWYER).sort((a, b) => b.length - a.length);

  const hasInh = /상속/.test(c);
  const hasRe = /부동산등기|부동산법무/.test(c);
  const hasCorp = /법인등기|법인법무/.test(c);
  const hasRehab = /개인회생|회생법무/.test(c);

  if (!(hasInh || hasRe || hasCorp || hasRehab)) return null;

  for (const n of neighborKeys) {
    if (!c.includes(compact(n))) continue;
    const nb = NEIGHBOR_LAWYER[n];
    if (hasInh) {
      const url = DISTRICT_INH[parentDistrictName(nb.parent)] ?? nb.parent.replace("법무사", "상속등기");
      return row(keyword, `${n}-inheritance`, n, nb.type, "local-inheritance", "INHERITANCE", fallbackInh(n, nb), nb.parent);
    }
    if (hasRe) {
      return row(keyword, `${n}-real-estate`, n, nb.type, "local-real-estate", "REAL_ESTATE", fallbackRe(n, nb), nb.parent);
    }
    if (hasCorp) {
      return row(keyword, `${n}-corporate`, n, nb.type, "local-corporate", "CORPORATE", fallbackCorp(n, nb), nb.parent);
    }
  }

  for (const d of districtKeys) {
    if (!c.includes(compact(d))) continue;
    if (hasRehab && DISTRICT_REHAB[d]) {
      return row(keyword, `${d}-rehab`, d, "DISTRICT", "local-rehab", "REHABILITATION", DISTRICT_REHAB[d], DISTRICT_LAWYER[d]);
    }
    if (hasInh && DISTRICT_INH[d]) {
      return row(keyword, `${d}-inheritance`, d, "DISTRICT", "local-inheritance", "INHERITANCE", DISTRICT_INH[d], DISTRICT_LAWYER[d]);
    }
    if (hasRe && DISTRICT_RE[d]) {
      return row(keyword, `${d}-real-estate`, d, "DISTRICT", "local-real-estate", "REAL_ESTATE", DISTRICT_RE[d], DISTRICT_LAWYER[d]);
    }
    if (hasCorp && DISTRICT_CORP[d]) {
      return row(keyword, `${d}-corporate`, d, "DISTRICT", "local-corporate", "CORPORATE", DISTRICT_CORP[d], DISTRICT_LAWYER[d]);
    }
  }
  return null;
}

function parentDistrictName(parentUrl: string): string {
  return parentUrl.replace(/^\//, "").replace(/법무사$/, "");
}

function fallbackInh(n: string, nb: { url: string; parent: string }): string {
  const map: Record<string, string> = {
    센텀: "/해운대구상속등기",
    센텀시티: "/해운대구상속등기",
    재송동: "/해운대구상속등기",
    반여동: "/해운대구상속등기",
    광안동: "/수영구상속등기",
    남천동: "/수영구상속등기",
    연산동: "/연제구상속등기",
    사직동: "/동래구상속등기",
    서면: "/부산진구상속등기",
    대연동: "/남구상속등기",
    화명동: "/북구상속등기",
    만덕동: "/북구상속등기",
    장전동: "/금정구상속등기",
    하단동: "/사하구상속등기",
    명지: "/기장군상속등기",
    정관: "/기장군상속등기",
    일광: "/기장군상속등기",
  };
  return map[n] ?? DISTRICT_INH[parentDistrictName(nb.parent)] ?? nb.parent;
}

function fallbackRe(n: string, nb: { url: string; parent: string }): string {
  const map: Record<string, string> = {
    센텀: "/센텀부동산등기",
    센텀시티: "/센텀부동산등기",
    재송동: "/해운대구부동산등기",
    반여동: "/해운대구부동산등기",
    광안동: "/수영구부동산등기",
    남천동: "/남천동법무사",
    연산동: "/연제구부동산등기",
    서면: "/서면법무사",
    대연동: "/대연동법무사",
    화명동: "/화명동법무사",
    명지: "/명지법무사",
    정관: "/정관법무사",
    일광: "/일광읍법무사",
  };
  return map[n] ?? DISTRICT_RE[parentDistrictName(nb.parent)] ?? nb.url;
}

function fallbackCorp(n: string, nb: { url: string; parent: string }): string {
  const map: Record<string, string> = {
    센텀: "/센텀법인설립등기",
    재송동: "/해운대구법인등기",
    명지: "/강서구법무사",
  };
  return map[n] ?? DISTRICT_CORP[parentDistrictName(nb.parent)] ?? nb.parent;
}

function neighborMeta(keyword: string, c: string): KeywordMeta | null {
  if (!/법무사/.test(c)) return null;
  const keys = Object.keys(NEIGHBOR_LAWYER).sort((a, b) => b.length - a.length);
  for (const n of keys) {
    if (!c.includes(compact(n))) continue;
    const nb = NEIGHBOR_LAWYER[n];
    return row(keyword, `${n}-lawyer`, n, nb.type, "local-lawyer", "LOCAL", nb.url, nb.parent);
  }
  return null;
}

function districtLawyerMeta(keyword: string, c: string): KeywordMeta | null {
  const keys = Object.keys(DISTRICT_LAWYER).sort((a, b) => b.length - a.length);
  for (const d of keys) {
    if (!c.includes(compact(d))) continue;
    if (/상속|부동산|법인|회생/.test(c) && /등기|상속|법인|회생/.test(c)) continue;
    return row(keyword, `${d}-lawyer`, d, "DISTRICT", "district-lawyer", "LOCAL", DISTRICT_LAWYER[d]);
  }
  return null;
}

function busanServiceMeta(keyword: string, c: string): KeywordMeta {
  const rules: { test: RegExp; cluster: string; intent: string; service: BusinessField; url: string }[] = [
    { test: /특별한정/, cluster: "special-qa", intent: "special-qualified-acceptance", service: "INHERITANCE", url: "/특별한정승인" },
    { test: /한정승인/, cluster: "qualified-acceptance", intent: "qualified-acceptance", service: "INHERITANCE", url: "/부산한정승인" },
    { test: /상속포기/, cluster: "renunciation", intent: "renunciation", service: "INHERITANCE", url: "/부산상속포기" },
    { test: /상속포기한정승인차이/, cluster: "renunciation-vs-qa", intent: "compare", service: "INHERITANCE", url: "/부산한정승인" },
    { test: /부모님사망후해야할일|사망후해야할일/, cluster: "after-death-tasks", intent: "after-death", service: "INHERITANCE", url: "/부모님사망후해야할일" },
    { test: /장례후해야할일/, cluster: "after-funeral", intent: "after-funeral", service: "INHERITANCE", url: "/장례후재산채무정리" },
    { test: /사망신고/, cluster: "death-report", intent: "death-report", service: "INHERITANCE", url: "/사망신고와상속등기차이" },
    { test: /재산조회|채무조회|상속재산조회|상속채무/, cluster: "estate-inquiry", intent: "asset-debt-inquiry", service: "INHERITANCE", url: "/사망자재산채무조회" },
    { test: /빚상속/, cluster: "parent-debt", intent: "inherited-debt", service: "INHERITANCE", url: "/부모빚상속방법" },
    { test: /상속재산분할|협의분할/, cluster: "division-agreement", intent: "division", service: "INHERITANCE", url: "/부산상속재산분할법무사" },
    { test: /미성년/, cluster: "minor-heir", intent: "minor-heir", service: "INHERITANCE", url: "/미성년상속인" },
    { test: /특별대리인/, cluster: "special-agent", intent: "special-agent", service: "INHERITANCE", url: "/미성년상속인" },
    { test: /외국인상속/, cluster: "foreign-heir", intent: "foreign-heir", service: "INHERITANCE", url: "/부산외국인상속등기" },
    { test: /해외/, cluster: "overseas-heir", intent: "overseas-heir", service: "INHERITANCE", url: "/해외거주상속인" },
    { test: /연락두절/, cluster: "missing-heir", intent: "missing-heir", service: "INHERITANCE", url: "/연락두절상속인" },
    { test: /재혼가정/, cluster: "remarriage", intent: "remarriage-heir", service: "INHERITANCE", url: "/재혼가정상속" },
    { test: /대습/, cluster: "representation", intent: "representation", service: "INHERITANCE", url: "/대습상속등기" },
    { test: /재상속/, cluster: "re-inheritance", intent: "re-inheritance", service: "INHERITANCE", url: "/부산재상속등기" },
    { test: /연속상속|오래된상속|할아버지명의|조부모명의|오래된토지/, cluster: "old-estate", intent: "multi-generation", service: "INHERITANCE", url: "/오래된상속토지정리" },
    { test: /상속부동산매도|상속등기전매매|상속부동산처분/, cluster: "sell-before-after", intent: "sale-after-inheritance", service: "INHERITANCE", url: "/부산상속후매매등기" },
    { test: /전국상속|비대면상속/, cluster: "remote-inheritance", intent: "remote-inheritance", service: "INHERITANCE", url: "/방문없이준비하는상속등기" },
    { test: /상속인이여러/, cluster: "multiple-heirs", intent: "multiple-heirs", service: "INHERITANCE", url: "/상속인이여러지역에있는경우" },
    { test: /유언상속/, cluster: "will-inheritance", intent: "will", service: "INHERITANCE", url: "/부산상속등기" },
    { test: /유증/, cluster: "bequest", intent: "bequest", service: "INHERITANCE", url: "/전국유증등기" },
    { test: /법정상속분/, cluster: "statutory-share", intent: "statutory-share", service: "INHERITANCE", url: "/부산상속등기" },
    { test: /가족관계상속|상속인조회/, cluster: "heir-confirm", intent: "heir-confirm", service: "INHERITANCE", url: "/부산상속등기" },
    { test: /상속등기준비|상속등기필요서류/, cluster: "inheritance-docs", intent: "documents", service: "INHERITANCE", url: "/상속등기준비서류" },
    { test: /상속포기준비/, cluster: "renunciation-docs", intent: "documents", service: "INHERITANCE", url: "/부산상속포기" },
    { test: /한정승인준비/, cluster: "qa-docs", intent: "documents", service: "INHERITANCE", url: "/부산한정승인" },
    { test: /상속등기비용|상속등기수수료/, cluster: "inheritance-cost", intent: "cost", service: "INHERITANCE", url: "/상속등기비용" },
    { test: /상속상담/, cluster: "inheritance-consult", intent: "consultation", service: "INHERITANCE", url: "/부산상속법무사" },
    { test: /상속등기/, cluster: "inheritance-registration", intent: "inheritance-registration", service: "INHERITANCE", url: "/부산상속등기" },
    { test: /상속법무|상속전문/, cluster: "inheritance-hub", intent: "inheritance-hub", service: "INHERITANCE", url: "/부산상속법무사" },
    { test: /부담부증여/, cluster: "onerous-gift", intent: "onerous-gift", service: "REAL_ESTATE", url: "/부산부담부증여등기" },
    { test: /증여등기비용|증여등기준비/, cluster: "gift-cost-docs", intent: "gift-docs", service: "REAL_ESTATE", url: "/부산증여등기" },
    { test: /부모.?자녀.?증여|아파트증여/, cluster: "parent-child-gift", intent: "parent-child-gift", service: "REAL_ESTATE", url: "/부산부모자녀아파트증여등기" },
    { test: /부부간증여/, cluster: "spouse-gift", intent: "spouse-gift", service: "REAL_ESTATE", url: "/부산부부간증여등기" },
    { test: /지분증여/, cluster: "share-gift", intent: "share-gift", service: "REAL_ESTATE", url: "/부산공동명의지분증여등기" },
    { test: /증여/, cluster: "gift", intent: "gift-registration", service: "REAL_ESTATE", url: "/부산증여등기" },
    { test: /근저당권변경/, cluster: "mortgage-change", intent: "mortgage-change", service: "REAL_ESTATE", url: "/부산부동산등기" },
    { test: /근저당.?말소|대출상환근저당/, cluster: "mortgage-cancel", intent: "mortgage-cancel", service: "REAL_ESTATE", url: "/방문없이준비하는근저당말소" },
    { test: /근저당/, cluster: "mortgage-set", intent: "mortgage-set", service: "REAL_ESTATE", url: "/부산잔금대출근저당" },
    { test: /전세권말소/, cluster: "leasehold-cancel", intent: "leasehold-cancel", service: "REAL_ESTATE", url: "/방문없이준비하는전세권말소" },
    { test: /전세권/, cluster: "leasehold-set", intent: "leasehold-set", service: "REAL_ESTATE", url: "/부산부동산등기" },
    { test: /가등기/, cluster: "provisional", intent: "provisional-registration", service: "REAL_ESTATE", url: "/부산가등기" },
    { test: /일부철거/, cluster: "partial-demolition", intent: "partial-demolition", service: "REAL_ESTATE", url: "/건물일부철거표시변경" },
    { test: /표시변경/, cluster: "building-change", intent: "indication-change", service: "REAL_ESTATE", url: "/부산건물표시변경등기" },
    { test: /멸실|철거후등기/, cluster: "building-loss", intent: "loss-registration", service: "REAL_ESTATE", url: "/부산건물멸실등기" },
    { test: /보존등기|신축/, cluster: "preservation", intent: "preservation", service: "REAL_ESTATE", url: "/부산신축건물보존등기" },
    { test: /등기권리증/, cluster: "deed-lost", intent: "lost-deed", service: "REAL_ESTATE", url: "/부산등기권리증분실" },
    { test: /법인.?명의.?부동산|법인.?부동산.?취득/, cluster: "corp-property", intent: "corp-property", service: "REAL_ESTATE", url: "/부산소유권이전등기" },
    { test: /타지역부동산/, cluster: "other-region-property", intent: "remote-property", service: "REAL_ESTATE", url: "/방문없이준비하는법무사업무" },
    { test: /공유물분할/, cluster: "partition", intent: "partition", service: "REAL_ESTATE", url: "/공유물분할등기서류준비" },
    { test: /공동명의|지분이전/, cluster: "co-ownership", intent: "share-transfer", service: "REAL_ESTATE", url: "/부산지분이전등기" },
    { test: /소유권이전|매매등기|잔금법무|아파트등기|주택소유|상가소유|토지소유|공장소유|창고소유/, cluster: "ownership-transfer", intent: "ownership-transfer", service: "REAL_ESTATE", url: "/부산소유권이전등기" },
    { test: /아파트등기비용|등기비용|소유권이전등기비용/, cluster: "re-cost", intent: "cost", service: "REAL_ESTATE", url: "/부산소유권이전등기" },
    { test: /농지등기|토지등기|상가등기|공장등기|창고등기/, cluster: "property-type", intent: "property-type", service: "REAL_ESTATE", url: "/부산토지매매등기" },
    { test: /부동산/, cluster: "real-estate-hub", intent: "real-estate-hub", service: "REAL_ESTATE", url: "/부산부동산등기" },
    { test: /1인법인|1인회사/, cluster: "one-person-company", intent: "one-person-company", service: "CORPORATE", url: "/부산1인법인설립" },
    { test: /유한회사/, cluster: "llc", intent: "llc-formation", service: "CORPORATE", url: "/부산유한회사설립등기" },
    { test: /제3자배정/, cluster: "third-party-increase", intent: "third-party-allotment", service: "CORPORATE", url: "/부산제3자배정유상증자" },
    { test: /주주배정/, cluster: "shareholder-increase", intent: "shareholder-allotment", service: "CORPORATE", url: "/부산주주배정유상증자" },
    { test: /가수금/, cluster: "debt-equity", intent: "debt-equity-swap", service: "CORPORATE", url: "/부산가수금출자전환" },
    { test: /현물출자/, cluster: "in-kind", intent: "in-kind-increase", service: "CORPORATE", url: "/부산현물출자증자" },
    { test: /유상증자|증자등기|자본금증자/, cluster: "paid-in-increase", intent: "capital-increase", service: "CORPORATE", url: "/부산유상증자등기" },
    { test: /감자/, cluster: "capital-reduction", intent: "capital-reduction", service: "CORPORATE", url: "/부산감자등기" },
    { test: /관외본점/, cluster: "hq-out", intent: "hq-outside-jurisdiction", service: "CORPORATE", url: "/부산본점이전등기" },
    { test: /관내본점/, cluster: "hq-in", intent: "hq-inside-jurisdiction", service: "CORPORATE", url: "/부산본점이전등기" },
    { test: /본점이전|법인주소변경|법인본점이전/, cluster: "hq-move", intent: "head-office-move", service: "CORPORATE", url: "/부산본점이전등기" },
    { test: /대표이사변경|대표이사중임/, cluster: "ceo-change", intent: "ceo-change", service: "CORPORATE", url: "/부산대표이사변경등기" },
    { test: /임원중임|이사중임|감사중임|임원임기|임기만료과태료/, cluster: "officer-term", intent: "officer-term", service: "CORPORATE", url: "/부산임원임기만료등기" },
    { test: /임원변경/, cluster: "officer-change", intent: "officer-change", service: "CORPORATE", url: "/부산임원변경등기" },
    { test: /사업목적|목적변경/, cluster: "purpose-change", intent: "purpose-change", service: "CORPORATE", url: "/부산사업목적변경등기" },
    { test: /상호변경/, cluster: "name-change", intent: "trade-name-change", service: "CORPORATE", url: "/부산상호변경등기" },
    { test: /지점폐지/, cluster: "branch-close", intent: "branch-close", service: "CORPORATE", url: "/부산지점폐지등기" },
    { test: /지점설치/, cluster: "branch-open", intent: "branch-open", service: "CORPORATE", url: "/부산지점설치등기" },
    { test: /해산|청산/, cluster: "dissolution", intent: "dissolution", service: "CORPORATE", url: "/부산법인해산청산등기" },
    { test: /휴면법인/, cluster: "dormant", intent: "dormant-resume", service: "CORPORATE", url: "/부산휴면법인계속등기" },
    { test: /협동조합|사단법인/, cluster: "special-entity", intent: "special-entity", service: "CORPORATE", url: "/부산법인법무사" },
    { test: /외국인법인|외국인투자/, cluster: "foreign-corp", intent: "foreign-investment", service: "CORPORATE", url: "/해외대표이사주주법인등기" },
    { test: /법인설립/, cluster: "incorporation", intent: "incorporation", service: "CORPORATE", url: "/부산법인설립등기" },
    { test: /주식회사설립/, cluster: "stock-company", intent: "stock-company", service: "CORPORATE", url: "/부산법인설립등기" },
    { test: /회사등기|기업등기|상업등기|법인전문|법인법무|법인등기/, cluster: "corporate-hub", intent: "corporate-hub", service: "CORPORATE", url: "/부산법인법무사" },
    { test: /코인빚|주식빚/, cluster: "asset-debt-rehab", intent: "crypto-stock-debt", service: "REHABILITATION", url: "/부산개인회생법무사" },
    { test: /배우자모르게/, cluster: "rehab-spouse", intent: "confidential-rehab", service: "REHABILITATION", url: "/부산개인회생법무사" },
    { test: /급여압류개인회생/, cluster: "rehab-garnish", intent: "wage-garnishment", service: "REHABILITATION", url: "/부산개인회생법무사" },
    { test: /자영업자개인회생|직장인개인회생/, cluster: "rehab-income-type", intent: "income-type", service: "REHABILITATION", url: "/부산개인회생법무사" },
    { test: /개인회생조건|개인회생신청자격/, cluster: "rehab-eligibility", intent: "eligibility", service: "REHABILITATION", url: "/부산개인회생법무사" },
    { test: /개인회생준비|개인회생신청방법/, cluster: "rehab-howto", intent: "howto", service: "REHABILITATION", url: "/개인회생준비서류" },
    { test: /개인회생비용/, cluster: "rehab-cost", intent: "cost", service: "REHABILITATION", url: "/개인회생비용" },
    { test: /부산회생법원/, cluster: "rehab-court", intent: "court", service: "REHABILITATION", url: "/부산개인회생" },
    { test: /개인회생/, cluster: "rehab-hub", intent: "rehab-hub", service: "REHABILITATION", url: "/부산개인회생" },
    { test: /회생파산|회생법무/, cluster: "rehab-bankruptcy-hub", intent: "insolvency-hub", service: "REHABILITATION", url: "/개인회생파산" },
    { test: /개인파산준비|개인파산신청방법/, cluster: "bankruptcy-howto", intent: "howto", service: "REHABILITATION", url: "/개인파산준비서류" },
    { test: /개인파산비용/, cluster: "bankruptcy-cost", intent: "cost", service: "REHABILITATION", url: "/개인파산비용" },
    { test: /파산면책|개인파산|파산법무/, cluster: "bankruptcy", intent: "bankruptcy", service: "REHABILITATION", url: "/부산개인파산" },
    { test: /전세사기/, cluster: "jeonse-fraud", intent: "jeonse-fraud", service: "LEASE", url: "/전세사기피해대응절차" },
    { test: /임차권/, cluster: "lease-reg-order", intent: "lease-registration-order", service: "LEASE", url: "/부산임차권등기명령" },
    { test: /전세보증금반환|전세금반환|보증금못받을|임대인사망전세/, cluster: "deposit-return", intent: "deposit-return", service: "LEASE", url: "/부산전세보증금반환법무사" },
    { test: /공사대금|대여금|물품대금|미수금지급명령|보증금반환지급|전세보증금지급/, cluster: "payment-order-type", intent: "payment-order-cause", service: "CIVIL", url: "/민사소송" },
    { test: /지급명령|돈안갚/, cluster: "payment-order", intent: "payment-order", service: "CIVIL", url: "/민사소송" },
    { test: /미수금/, cluster: "receivables", intent: "receivables", service: "CIVIL", url: "/부산기업채권관리" },
    { test: /내용증명/, cluster: "content-certified", intent: "content-certified-mail", service: "CIVIL", url: "/내용증명작성준비" },
    { test: /가압류/, cluster: "provisional-seizure", intent: "provisional-attachment", service: "CIVIL", url: "/가압류신청서류준비" },
    { test: /채권추심/, cluster: "collection", intent: "collection", service: "CIVIL", url: "/채권압류추심서류준비" },
    { test: /공탁/, cluster: "deposit-court", intent: "consignation", service: "CIVIL", url: "/변제공탁서류준비" },
  ];

  for (const rule of rules) {
    if (rule.test.test(c)) {
      return row(keyword, rule.cluster, /부산/.test(c) ? "부산" : null, /부산/.test(c) ? "BUSAN" : "NONE", rule.intent, rule.service, rule.url);
    }
  }

  return row(keyword, "unclassified", "부산", "BUSAN", "general", "GENERAL", "/부산법무사");
}

function row(
  keyword: string,
  cluster: string,
  region: string | null,
  regionType: RegionType,
  intent: string,
  service: BusinessField,
  preferredUrl: string,
  parentHubUrl?: string,
): KeywordMeta {
  return { keyword, cluster, region, regionType, intent, service, preferredUrl, parentHubUrl };
}
