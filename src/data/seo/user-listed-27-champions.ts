/**
 * 2026-10-29 고객 제시 27검색어 + 놓친 수임 검색어.
 *
 * 3관점 머지
 * 1) 의도·소유: 검색어마다 이미 있는 대표 URL 하나. 신규 랜딩·thin geo 복제 금지.
 *    TITLE_FROZEN(`/`, `/부산상속포기`, `/부산상속법무사`, `/부산법인설립등기`) 제목 불변.
 *    `{구}법무사` geo 허브·타지역 업무사례·블로그 `/blog/external`에 수임 검색어를 주지 않는다.
 * 2) 경쟁 SERP: 「부산 법무사」유기 상위는 법원앞 블로그·플레이스·법원/법무사회·타사무소.
 *    사무소는 센텀이므로 ‘법원 앞’을 허위 NAP로 쓰지 않고 `/부산법원근처법무사`에서
 *    연제구 법원로 밀집 vs 센텀 접수의 차이를 설명한다. 사이트 > blog.naver.com/law-yoon-91.
 * 3) 잠식 방지: compact 문자열은 대표 URL만. 부동산가압류≠채권압류추심, 가처분≠가처분말소,
 *    전화상담≠온라인상담, 임대차분쟁≠전세사기, 기장상속≠기장법무사, 진구상속≠진구법무사.
 *
 * 성공 정의는 의도 일치 대표 URL이 통합검색 1위 자리에 서는 것이다.
 * 이 모듈은 순위를 추정·보장하지 않는다.
 */

export type UserListed27Champion = {
  query: string;
  champion: string;
  family: UserListed27Family;
};

export type UserListed27Family =
  | "home-brand"
  | "consult-channel"
  | "inheritance-hub"
  | "district-inheritance"
  | "corporate"
  | "registry"
  | "auction"
  | "will"
  | "preservation"
  | "execution"
  | "lease"
  | "location"
  | "document";

/** 고객 제시 27개. 대표 URL은 이미 있는 페이지다. */
export const USER_LISTED_27_TARGETS: readonly UserListed27Champion[] = [
  { query: "부산 법무사", champion: "/", family: "home-brand" },
  { query: "부산법무사", champion: "/", family: "home-brand" },
  { query: "부산 법무사 사무소", champion: "/", family: "home-brand" },
  { query: "부산 법무사 상담", champion: "/부산법무사상담", family: "consult-channel" },
  { query: "부산 법무사 전화상담", champion: "/부산법무사상담", family: "consult-channel" },
  { query: "부산 법무사 온라인상담", champion: "/부산법무사비대면상담", family: "consult-channel" },
  { query: "부산 상속 법무사", champion: "/부산상속법무사", family: "inheritance-hub" },
  { query: "부산 법무사 상속", champion: "/부산상속법무사", family: "inheritance-hub" },
  { query: "부산 상속전문 법무사", champion: "/부산상속전문법무사", family: "inheritance-hub" },
  { query: "부산 상속포기 법무사", champion: "/부산상속포기", family: "inheritance-hub" },
  { query: "부산 상속포기 상담", champion: "/부산상속포기", family: "inheritance-hub" },
  { query: "부산진구 상속 법무사", champion: "/부산진구상속등기", family: "district-inheritance" },
  { query: "부산 남구 상속 법무사", champion: "/남구상속등기", family: "district-inheritance" },
  { query: "기장 상속 법무사", champion: "/기장상속등기", family: "district-inheritance" },
  { query: "부산 법인전문 법무사", champion: "/부산법인설립전문법무사", family: "corporate" },
  { query: "부산 법인설립", champion: "/부산법인설립등기", family: "corporate" },
  { query: "부산 등기전문 법무사", champion: "/부산부동산등기전문법무사", family: "registry" },
  { query: "부산 경매 법무사", champion: "/부산경매낙찰등기", family: "auction" },
  { query: "부산 유언 법무사", champion: "/부산유언검인", family: "will" },
  { query: "부산 부동산 가압류 법무사", champion: "/부산가압류신청", family: "preservation" },
  { query: "부산 가압류 법무사", champion: "/부산가압류신청", family: "preservation" },
  { query: "부산 채권가압류 법무사", champion: "/부산가압류신청", family: "preservation" },
  { query: "부산 부동산 가처분 법무사", champion: "/가처분신청서류준비", family: "preservation" },
  { query: "부산 채권추심 법무사", champion: "/부산채권압류추심명령", family: "execution" },
  { query: "부산 강제집행 법무사", champion: "/situations/판결-후-강제집행", family: "execution" },
  { query: "부산 임대차 분쟁 법무사", champion: "/부산전세보증금반환법무사", family: "lease" },
  { query: "부산 법원 앞 법무사", champion: "/부산법원근처법무사", family: "location" },
];

/** 제시 목록에 없었지만 수임 유입에 필요한 인접 검색어. 기존 URL만. */
export const USER_LISTED_27_EXTRA: readonly UserListed27Champion[] = [
  { query: "부산 내용증명 법무사", champion: "/내용증명작성준비", family: "document" },
  { query: "부산 가처분 법무사", champion: "/가처분신청서류준비", family: "preservation" },
  { query: "부산 비대면 법무사", champion: "/부산법무사비대면상담", family: "consult-channel" },
  { query: "부산 온라인 법무사", champion: "/부산법무사비대면상담", family: "consult-channel" },
  { query: "부산 법원 근처 법무사", champion: "/부산법원근처법무사", family: "location" },
  { query: "기장군 상속 법무사", champion: "/기장군상속등기", family: "district-inheritance" },
];

function compactQuery(value: string): string {
  return value.replace(/\s+/g, "");
}

/**
 * 이미 EXACT_KEYWORD_CHAMPIONS에 있는 compact는 넣지 않는다.
 * (부산법무사, 부산법무사상담, 부산상속법무사, 부산상속포기법무사, 부산법인전문법무사 등)
 * 전화상담·포기상담 compact는 champion-query 기존 row에 붙인다.
 */
export function userListed27ExactKeywordChampions(): {
  path: string;
  compactQueries: readonly string[];
}[] {
  const skip = new Set([
    "부산법무사",
    "부산법무사사무소",
    "부산법무사상담",
    "부산상속법무사",
    "부산법무사상속",
    "부산상속전문법무사",
    "부산상속포기법무사",
    "부산상속포기",
    "부산법인전문법무사",
    "부산법인설립",
    "부산법인설립법무사",
    "부산법인설립등기",
    "부산등기전문법무사",
    "부산유언검인",
    "부산유언검인법무사",
    "부산전세보증금반환법무사",
  ]);
  const byPath = new Map<string, string[]>();
  for (const row of [...USER_LISTED_27_TARGETS, ...USER_LISTED_27_EXTRA]) {
    const compact = compactQuery(row.query);
    if (skip.has(compact)) continue;
    const list = byPath.get(row.champion) ?? [];
    if (!list.includes(compact)) list.push(compact);
    byPath.set(row.champion, list);
  }
  return [...byPath.entries()].map(([path, compactQueries]) => ({
    path,
    compactQueries,
  }));
}

const DISTRICT_INH_CARDS = [
  "/부산상속법무사",
  "/부산상속등기",
  "/부산상속포기",
  "/부산법무사상담",
  "/상속등기비용",
] as const;

const PRESERVATION_CARDS = [
  "/가압류신청서류준비",
  "/부산채권압류추심명령",
  "/부산지방법원지급명령",
  "/민사소송",
  "/부산법무사상담",
] as const;

const EXECUTION_CARDS = [
  "/부산채권압류추심명령",
  "/부산집행문부여신청",
  "/부산재산명시",
  "/부산가압류신청",
  "/부산법무사상담",
] as const;

const CONSULT_REMOTE_CARDS = [
  "/부산법무사상담",
  "/부산법무사방문상담",
  "/부산법무사무소",
  "/방문없이준비하는법무사업무",
  "/사진전자파일우편으로서류전달",
] as const;

const COURT_NEAR_CARDS = [
  "/부산법무사무소",
  "/연제구법무사",
  "/office",
  "/location",
  "/부산법무사상담",
] as const;

const AUCTION_CARDS = [
  "/부산경매권리분석",
  "/부산공매낙찰등기",
  "/부산소유권이전등기",
  "/부산근저당설정등기",
  "/부산법무사상담",
] as const;

const WILL_CARDS = [
  "/유언공증준비",
  "/부산상속등기",
  "/유언집행자와상속등기",
  "/부산상속법무사",
  "/부산법무사상담",
] as const;

const LEASE_DISPUTE_CARDS = [
  "/부산임차권등기명령",
  "/내용증명작성준비",
  "/부산지방법원지급명령",
  "/전세보증금상담",
  "/부산법무사상담",
] as const;

const DOCUMENT_CARDS = [
  "/부산지방법원지급명령",
  "/부산가압류신청",
  "/가처분신청서류준비",
  "/부산전세보증금반환법무사",
  "/부산법무사상담",
] as const;

const GACHEOBUN_CARDS = [
  "/부산가압류신청",
  "/가압류신청서류준비",
  "/내용증명작성준비",
  "/민사소송",
  "/부산법무사상담",
] as const;

const PACK_BY_PATH: Record<string, { heading: string; urls: readonly string[] }> = {
  "/부산진구상속등기": {
    heading: "부산진구 상속 다음에 볼 안내",
    urls: DISTRICT_INH_CARDS,
  },
  "/남구상속등기": {
    heading: "남구 상속 다음에 볼 안내",
    urls: DISTRICT_INH_CARDS,
  },
  "/기장상속등기": {
    heading: "기장 상속 다음에 볼 안내",
    urls: DISTRICT_INH_CARDS,
  },
  "/기장군상속등기": {
    heading: "기장군 상속 다음에 볼 안내",
    urls: DISTRICT_INH_CARDS,
  },
  "/부산가압류신청": {
    heading: "가압류와 이어지는 절차",
    urls: PRESERVATION_CARDS,
  },
  "/가처분신청서류준비": {
    heading: "가처분과 구분되는 안내",
    urls: GACHEOBUN_CARDS,
  },
  "/부산채권압류추심명령": {
    heading: "판결 뒤 회수 순서",
    urls: EXECUTION_CARDS,
  },
  "/situations/판결-후-강제집행": {
    heading: "강제집행과 이어지는 안내",
    urls: EXECUTION_CARDS,
  },
  "/부산법무사비대면상담": {
    heading: "온라인·방문 상담 나누기",
    urls: CONSULT_REMOTE_CARDS,
  },
  "/부산법원근처법무사": {
    heading: "위치·관할을 함께 보기",
    urls: COURT_NEAR_CARDS,
  },
  "/부산경매낙찰등기": {
    heading: "낙찰 이후 등기 안내",
    urls: AUCTION_CARDS,
  },
  "/부산유언검인": {
    heading: "유언 다음 상속 절차",
    urls: WILL_CARDS,
  },
  "/부산전세보증금반환법무사": {
    heading: "임대차 분쟁에서 이어볼 안내",
    urls: LEASE_DISPUTE_CARDS,
  },
  "/내용증명작성준비": {
    heading: "내용증명 다음 절차",
    urls: DOCUMENT_CARDS,
  },
};

export function getUserListed27CarouselPack(
  path: string,
): { heading: string; urls: string[] } | undefined {
  const pack = PACK_BY_PATH[path];
  if (!pack) return undefined;
  const urls = pack.urls.filter((href) => href !== path);
  if (urls.length < 4) return undefined;
  return { heading: pack.heading, urls };
}
