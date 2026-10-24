import { BUSAN_DISTRICT_HUB_PATHS } from "@/lib/geo/busan-district-hubs";
import { normalizeRouteSlug } from "@/lib/seo/slug";

/** 「부산 법무사」 exact-match 메타·키워드는 홈(`/`)만 가져간다. */
export const BUSAN_LAWYER_CHAMPION_PATH = "/" as const;

/** 업무·비용·선택 기준 안내. 홈과 검색의도를 나누는 supporting 페이지. */
export const BUSAN_LAWYER_GUIDE_PATH = "/부산법무사" as const;

/** 「부산 법무사 추천」 exact-match는 `/부산법무사추천`만. */
export const BUSAN_RECOMMEND_CHAMPION_PATH = "/부산법무사추천" as const;

/** 「부산 법무사 상담」 exact-match 메타 키워드는 `/부산법무사상담`만 가져간다. */
export const BUSAN_CONSULT_CHAMPION_PATH = "/부산법무사상담" as const;

/** 「부산 상속포기 법무사」 exact-match는 `/부산상속포기` 한 곳만 가져간다. */
export const BUSAN_RENUNCIATION_CHAMPION_PATH = "/부산상속포기" as const;

export const BUSAN_LAWYER_EXACT_QUERIES = ["부산 법무사", "부산법무사"] as const;

export const BUSAN_RENUNCIATION_EXACT_QUERIES = [
  "부산 상속포기 법무사",
  "부산상속포기법무사",
] as const;

type ExactKeywordChampion = {
  path: string;
  compactQueries: readonly string[];
};

/** `{지역} 법무사` exact-match는 해당 구·군·동·역 허브만. HOME·타 업무 URL에 흘리지 않는다. */
function geoChampion(
  path: string,
  extraCompact: readonly string[] = [],
): ExactKeywordChampion {
  return {
    path,
    compactQueries: [path.replace(/^\//, ""), ...extraCompact],
  };
}

const GEO_LAWYER_CHAMPIONS: readonly ExactKeywordChampion[] = [
  {
    path: "/해운대법무사",
    compactQueries: [
      "해운대법무사",
      "해운대구법무사",
      "부산해운대법무사",
      "부산해운대구법무사",
    ],
  },
  {
    path: "/센텀법무사",
    compactQueries: ["센텀법무사", "센텀시티법무사"],
  },
  geoChampion("/중구법무사", ["부산중구법무사"]),
  geoChampion("/서구법무사", ["부산서구법무사"]),
  geoChampion("/동구법무사", ["부산동구법무사"]),
  geoChampion("/영도구법무사", ["부산영도구법무사", "영도법무사"]),
  geoChampion("/부산진구법무사", ["부산진법무사", "진구법무사"]),
  geoChampion("/동래구법무사", [
    "부산동래구법무사",
    "명륜동법무사",
    "복산동법무사",
    "동래법무사",
  ]),
  geoChampion("/남구법무사", ["부산남구법무사"]),
  geoChampion("/북구법무사", ["부산북구법무사"]),
  geoChampion("/사하구법무사", ["부산사하구법무사", "사하법무사"]),
  geoChampion("/금정구법무사", ["부산금정구법무사", "금정법무사"]),
  geoChampion("/강서구법무사", ["부산강서구법무사", "강서법무사"]),
  geoChampion("/연제구법무사", ["부산연제구법무사"]),
  geoChampion("/수영구법무사", ["부산수영구법무사", "수영법무사"]),
  geoChampion("/사상구법무사", ["부산사상구법무사"]),
  geoChampion("/기장군법무사", ["기장법무사", "부산기장군법무사"]),
  geoChampion("/재송동법무사"),
  geoChampion("/반여동법무사"),
  geoChampion("/연산동법무사", ["연산법무사"]),
  geoChampion("/거제동법무사"),
  geoChampion("/광안리법무사"),
  geoChampion("/광안동법무사", ["광안법무사"]),
  geoChampion("/민락동법무사", ["민락법무사", "민락역법무사"]),
  geoChampion("/망미동법무사"),
  geoChampion("/남천동법무사"),
  geoChampion("/사직동법무사"),
  geoChampion("/온천동법무사"),
  geoChampion("/서면법무사"),
  geoChampion("/부전동법무사", ["부전법무사"]),
  geoChampion("/전포동법무사", ["전포법무사", "전포역법무사"]),
  geoChampion("/대연동법무사", ["대연법무사"]),
  geoChampion("/용호동법무사"),
  geoChampion("/문현동법무사"),
  geoChampion("/화명동법무사", ["화명법무사"]),
  geoChampion("/덕천동법무사", ["덕천법무사"]),
  geoChampion("/우동법무사"),
  geoChampion("/좌동법무사", ["장산법무사", "장산역법무사"]),
  geoChampion("/중동법무사"),
  geoChampion("/사상법무사"),
  geoChampion("/하단법무사", ["하단동법무사"]),
  geoChampion("/명지법무사", ["에코델타시티법무사"]),
  geoChampion("/명지동법무사"),
  geoChampion("/정관법무사", ["정관읍법무사"]),
  geoChampion("/일광읍법무사"),
  geoChampion("/기장읍법무사"),
  geoChampion("/부산역법무사"),
  geoChampion("/동래역법무사"),
  geoChampion("/남포동법무사"),
  geoChampion("/초량동법무사"),
  geoChampion("/범일동법무사"),
  geoChampion("/구포동법무사"),
  geoChampion("/다대동법무사"),
  geoChampion("/괴정동법무사"),
  geoChampion("/개금동법무사"),
  geoChampion("/안락동법무사"),
  geoChampion("/구서동법무사"),
  geoChampion("/반송동법무사"),
  geoChampion("/주례동법무사"),
  geoChampion("/동삼동법무사"),
  geoChampion("/우암동법무사"),
  geoChampion("/연지동법무사"),
  geoChampion("/오시리아법무사"),
  geoChampion("/부곡동법무사"),
  geoChampion("/양정동법무사", ["양정법무사", "양정역법무사"]),
  geoChampion("/장전동법무사", ["장전법무사"]),
  geoChampion("/송정동법무사"),
  geoChampion("/센텀시티역법무사"),
  geoChampion("/서면역법무사"),
  geoChampion("/해운대역법무사"),
  geoChampion("/광안역법무사"),
  geoChampion("/사상역법무사"),
  geoChampion("/명지역법무사"),
  geoChampion("/연산역법무사"),
];

/**
 * `{타지역} 상속 법무사` / `{타지역} 상속등기 법무사` exact-match.
 * 기존 `/업무사례/{지역}상속등기법무사`만 소유. 부산·전국·지역별 허브는 넣지 않는다.
 */
function cityInheritanceChampion(
  slug: string,
  extraCompact: readonly string[] = [],
): ExactKeywordChampion {
  const stem = slug.replace(/상속등기법무사$/, "");
  return {
    path: `/업무사례/${slug}`,
    compactQueries: [
      `${stem}상속법무사`,
      `${stem}상속등기법무사`,
      ...extraCompact,
    ],
  };
}

const CITY_INHERITANCE_CHAMPIONS: readonly ExactKeywordChampion[] = [
  cityInheritanceChampion("서울상속등기법무사"),
  cityInheritanceChampion("경기상속등기법무사", [
    "경기도상속법무사",
    "경기도상속등기법무사",
  ]),
  cityInheritanceChampion("인천상속등기법무사"),
  cityInheritanceChampion("경남상속등기법무사", [
    "경상남도상속법무사",
    "경상남도상속등기법무사",
  ]),
  cityInheritanceChampion("울산상속등기법무사"),
  cityInheritanceChampion("대구상속등기법무사"),
  cityInheritanceChampion("대전상속등기법무사"),
  cityInheritanceChampion("세종상속등기법무사", [
    "세종시상속법무사",
    "세종시상속등기법무사",
  ]),
  cityInheritanceChampion("충남상속등기법무사", [
    "충청남도상속법무사",
    "충청남도상속등기법무사",
  ]),
  cityInheritanceChampion("충북상속등기법무사", [
    "충청북도상속법무사",
    "충청북도상속등기법무사",
  ]),
  cityInheritanceChampion("광주상속등기법무사", [
    "광주광역시상속법무사",
    "광주광역시상속등기법무사",
  ]),
  cityInheritanceChampion("전남상속등기법무사", [
    "전라남도상속법무사",
    "전라남도상속등기법무사",
  ]),
  cityInheritanceChampion("전북상속등기법무사", [
    "전라북도상속법무사",
    "전북특별자치도상속법무사",
    "전라북도상속등기법무사",
  ]),
  cityInheritanceChampion("경북상속등기법무사", [
    "경상북도상속법무사",
    "경상북도상속등기법무사",
  ]),
  cityInheritanceChampion("강원상속등기법무사", [
    "강원도상속법무사",
    "강원특별자치도상속법무사",
    "강원도상속등기법무사",
  ]),
  cityInheritanceChampion("제주상속등기법무사", [
    "제주도상속법무사",
    "제주특별자치도상속법무사",
    "제주도상속등기법무사",
  ]),
  cityInheritanceChampion("강남구상속등기법무사", ["강남상속법무사", "강남상속등기법무사"]),
  cityInheritanceChampion("서초구상속등기법무사"),
  cityInheritanceChampion("송파구상속등기법무사"),
  cityInheritanceChampion("마포구상속등기법무사"),
  cityInheritanceChampion("용산구상속등기법무사"),
  cityInheritanceChampion("영등포구상속등기법무사"),
  cityInheritanceChampion("성동구상속등기법무사"),
  cityInheritanceChampion("강서구상속등기법무사"),
  cityInheritanceChampion("노원구상속등기법무사"),
  cityInheritanceChampion("은평구상속등기법무사"),
  cityInheritanceChampion("강동구상속등기법무사"),
  cityInheritanceChampion("관악구상속등기법무사"),
  cityInheritanceChampion("구로구상속등기법무사"),
  cityInheritanceChampion("수원상속등기법무사"),
  cityInheritanceChampion("성남상속등기법무사"),
  cityInheritanceChampion("분당상속등기법무사"),
  cityInheritanceChampion("용인상속등기법무사"),
  cityInheritanceChampion("고양상속등기법무사"),
  cityInheritanceChampion("일산상속등기법무사"),
  cityInheritanceChampion("화성상속등기법무사"),
  cityInheritanceChampion("동탄상속등기법무사"),
  cityInheritanceChampion("부천상속등기법무사"),
  cityInheritanceChampion("안양상속등기법무사"),
  cityInheritanceChampion("안산상속등기법무사"),
  cityInheritanceChampion("평택상속등기법무사"),
  cityInheritanceChampion("김포상속등기법무사"),
  cityInheritanceChampion("남양주상속등기법무사"),
  cityInheritanceChampion("하남상속등기법무사"),
  cityInheritanceChampion("파주상속등기법무사"),
  cityInheritanceChampion("의정부상속등기법무사"),
  cityInheritanceChampion("광명상속등기법무사"),
  cityInheritanceChampion("시흥상속등기법무사"),
  cityInheritanceChampion("경기광주상속등기법무사", [
    "경기도광주상속법무사",
    "경기도광주시상속법무사",
    "경기광주시상속법무사",
    "경기도광주상속등기법무사",
    "경기도광주시상속등기법무사",
  ]),
  cityInheritanceChampion("판교상속등기법무사"),
  cityInheritanceChampion("광교상속등기법무사"),
  cityInheritanceChampion("이천상속등기법무사"),
  cityInheritanceChampion("구리상속등기법무사"),
  cityInheritanceChampion("양주상속등기법무사"),
  cityInheritanceChampion("군포상속등기법무사"),
  cityInheritanceChampion("의왕과천상속등기법무사", [
    "의왕상속법무사",
    "과천상속법무사",
    "의왕상속등기법무사",
    "과천상속등기법무사",
  ]),
  cityInheritanceChampion("오산안성상속등기법무사", [
    "오산상속법무사",
    "안성상속법무사",
    "오산상속등기법무사",
    "안성상속등기법무사",
  ]),
  cityInheritanceChampion("여주양평상속등기법무사", [
    "여주상속법무사",
    "양평상속법무사",
    "여주상속등기법무사",
    "양평상속등기법무사",
  ]),
  cityInheritanceChampion("포천동두천상속등기법무사", [
    "포천상속법무사",
    "동두천상속법무사",
    "포천상속등기법무사",
    "동두천상속등기법무사",
  ]),
  cityInheritanceChampion("가평상속등기법무사"),
  cityInheritanceChampion("송도상속등기법무사"),
  cityInheritanceChampion("청라상속등기법무사"),
  cityInheritanceChampion("부평구상속등기법무사"),
  cityInheritanceChampion("남동구상속등기법무사", [
    "인천남동구상속법무사",
    "인천남동구상속등기법무사",
  ]),
  cityInheritanceChampion("영종도상속등기법무사"),
  cityInheritanceChampion("강화도상속등기법무사", ["강화상속법무사", "강화상속등기법무사"]),
  cityInheritanceChampion("창원상속등기법무사", [
    "창원시상속법무사",
    "창원시상속등기법무사",
    "마산상속법무사",
    "마산상속등기법무사",
    "진해상속법무사",
    "진해상속등기법무사",
  ]),
  cityInheritanceChampion("김해상속등기법무사", [
    "김해시상속법무사",
    "김해시상속등기법무사",
  ]),
  cityInheritanceChampion("양산상속등기법무사", [
    "양산시상속법무사",
    "양산시상속등기법무사",
  ]),
  cityInheritanceChampion("진주상속등기법무사", [
    "진주시상속법무사",
    "진주시상속등기법무사",
  ]),
  cityInheritanceChampion("거제상속등기법무사", [
    "거제시상속법무사",
    "거제시상속등기법무사",
  ]),
  cityInheritanceChampion("장유상속등기법무사"),
  cityInheritanceChampion("율하상속등기법무사"),
  cityInheritanceChampion("물금상속등기법무사"),
  cityInheritanceChampion("증산상속등기법무사"),
  cityInheritanceChampion("사송상속등기법무사"),
  cityInheritanceChampion("주촌상속등기법무사"),
  cityInheritanceChampion("진영상속등기법무사"),
  cityInheritanceChampion("창원의창구상속등기법무사"),
  cityInheritanceChampion("창원성산구상속등기법무사"),
  cityInheritanceChampion("마산합포구상속등기법무사"),
  cityInheritanceChampion("마산회원구상속등기법무사"),
  cityInheritanceChampion("진해구상속등기법무사"),
  cityInheritanceChampion("사천상속등기법무사"),
  cityInheritanceChampion("고성군상속등기법무사"),
  cityInheritanceChampion("남해상속등기법무사"),
  cityInheritanceChampion("밀양상속등기법무사"),
  cityInheritanceChampion("하동상속등기법무사"),
  cityInheritanceChampion("통영상속등기법무사"),
  cityInheritanceChampion("창녕상속등기법무사"),
  cityInheritanceChampion("함안상속등기법무사"),
  cityInheritanceChampion("산청상속등기법무사"),
  cityInheritanceChampion("함양상속등기법무사"),
  cityInheritanceChampion("거창상속등기법무사"),
  cityInheritanceChampion("합천상속등기법무사"),
  cityInheritanceChampion("의령상속등기법무사"),
  cityInheritanceChampion("울산중구상속등기법무사"),
  cityInheritanceChampion("울산동구상속등기법무사"),
  cityInheritanceChampion("울산북구상속등기법무사"),
  cityInheritanceChampion("울산남구상속등기법무사"),
  cityInheritanceChampion("울주군상속등기법무사", [
    "울주상속법무사",
    "울주상속등기법무사",
  ]),
  cityInheritanceChampion("대구수성구상속등기법무사", [
    "수성구상속법무사",
    "수성구상속등기법무사",
  ]),
  cityInheritanceChampion("대구달서구상속등기법무사"),
  cityInheritanceChampion("대구중구상속등기법무사"),
  cityInheritanceChampion("대구동구상속등기법무사"),
  cityInheritanceChampion("대구서구상속등기법무사"),
  cityInheritanceChampion("대구남구상속등기법무사"),
  cityInheritanceChampion("대구북구상속등기법무사"),
  cityInheritanceChampion("대구달성군상속등기법무사"),
  cityInheritanceChampion("대구군위군상속등기법무사", [
    "군위상속법무사",
    "군위상속등기법무사",
  ]),
  cityInheritanceChampion("포항상속등기법무사"),
  cityInheritanceChampion("구미상속등기법무사"),
  cityInheritanceChampion("경산상속등기법무사"),
  cityInheritanceChampion("경주상속등기법무사"),
  cityInheritanceChampion("안동상속등기법무사"),
  cityInheritanceChampion("예천상속등기법무사"),
  cityInheritanceChampion("김천상속등기법무사"),
  cityInheritanceChampion("칠곡상속등기법무사"),
  cityInheritanceChampion("영천상속등기법무사"),
  cityInheritanceChampion("문경상속등기법무사"),
  cityInheritanceChampion("상주상속등기법무사"),
  cityInheritanceChampion("청도상속등기법무사"),
  cityInheritanceChampion("울진상속등기법무사"),
  cityInheritanceChampion("영주상속등기법무사"),
  cityInheritanceChampion("의성상속등기법무사"),
  cityInheritanceChampion("영덕봉화상속등기법무사", [
    "영덕상속법무사",
    "봉화상속법무사",
    "영덕상속등기법무사",
    "봉화상속등기법무사",
  ]),
  cityInheritanceChampion("청송영양상속등기법무사", [
    "청송상속법무사",
    "영양상속법무사",
    "청송상속등기법무사",
    "영양상속등기법무사",
  ]),
  cityInheritanceChampion("고령성주상속등기법무사", [
    "고령상속법무사",
    "성주상속법무사",
    "고령상속등기법무사",
    "성주상속등기법무사",
  ]),
  cityInheritanceChampion("대전유성구상속등기법무사"),
  cityInheritanceChampion("대전서구상속등기법무사"),
  cityInheritanceChampion("천안상속등기법무사"),
  cityInheritanceChampion("아산상속등기법무사"),
  cityInheritanceChampion("당진상속등기법무사"),
  cityInheritanceChampion("청주상속등기법무사"),
  cityInheritanceChampion("충주상속등기법무사"),
  cityInheritanceChampion("제천상속등기법무사"),
  cityInheritanceChampion("서산보령상속등기법무사", [
    "서산상속법무사",
    "보령상속법무사",
    "서산상속등기법무사",
    "보령상속등기법무사",
  ]),
  cityInheritanceChampion("공주상속등기법무사"),
  cityInheritanceChampion("전주상속등기법무사"),
  cityInheritanceChampion("익산상속등기법무사"),
  cityInheritanceChampion("군산상속등기법무사"),
  cityInheritanceChampion("순천상속등기법무사"),
  cityInheritanceChampion("여수상속등기법무사"),
  cityInheritanceChampion("목포상속등기법무사"),
  cityInheritanceChampion("광양상속등기법무사"),
  cityInheritanceChampion("나주정읍상속등기법무사", [
    "나주상속법무사",
    "정읍상속법무사",
    "나주상속등기법무사",
    "정읍상속등기법무사",
  ]),
  cityInheritanceChampion("남원상속등기법무사"),
  cityInheritanceChampion("원주상속등기법무사"),
  cityInheritanceChampion("춘천상속등기법무사"),
  cityInheritanceChampion("강릉상속등기법무사"),
  cityInheritanceChampion("속초상속등기법무사"),
  cityInheritanceChampion("동해삼척상속등기법무사", [
    "동해상속법무사",
    "삼척상속법무사",
    "동해상속등기법무사",
    "삼척상속등기법무사",
  ]),
  cityInheritanceChampion("홍천상속등기법무사"),
  cityInheritanceChampion("제주시상속등기법무사"),
  cityInheritanceChampion("서귀포상속등기법무사"),
  cityInheritanceChampion("울릉도상속등기법무사"),
];

const EXACT_KEYWORD_CHAMPIONS: readonly ExactKeywordChampion[] = [
  {
    path: BUSAN_LAWYER_CHAMPION_PATH,
    compactQueries: ["부산법무사", "부산법무사사무소", "부산법인법무사"],
  },
  {
    path: BUSAN_RECOMMEND_CHAMPION_PATH,
    compactQueries: ["부산법무사추천"],
  },
  {
    path: BUSAN_CONSULT_CHAMPION_PATH,
    compactQueries: ["부산법무사상담"],
  },
  {
    path: "/부산법률상담",
    compactQueries: ["부산법률상담"],
  },
  {
    path: "/부산법무사무소",
    compactQueries: ["부산법무사무소"],
  },
  {
    path: BUSAN_RENUNCIATION_CHAMPION_PATH,
    compactQueries: ["부산상속포기법무사", "상속포기법무사"],
  },
  {
    path: "/상속",
    compactQueries: ["상속법무사", "법무사상속", "상속법무사추천"],
  },
  {
    path: "/상속상담전준비서류와비용",
    compactQueries: ["상속법무사상담"],
  },
  {
    path: "/전국상속등기",
    compactQueries: ["상속등기법무사"],
  },
  {
    path: "/법무사진로특강",
    compactQueries: ["부산진로특강"],
  },
  {
    path: "/부산개인회생",
    compactQueries: ["부산개인회생"],
  },
  {
    path: "/부산개인회생법무사",
    compactQueries: ["부산개인회생법무사"],
  },
  {
    path: "/부산개인파산법무사",
    compactQueries: ["부산개인파산법무사"],
  },
  {
    path: "/개인회생파산",
    compactQueries: ["부산회생파산법무사", "부산회생파산"],
  },
  {
    path: "/부산등기법무사",
    compactQueries: ["부산등기법무사", "부산법무사등기"],
  },
  {
    path: "/부산부동산등기전문법무사",
    compactQueries: ["부산등기전문법무사"],
  },
  {
    path: "/부산법인설립전문법무사",
    compactQueries: ["부산법인전문법무사", "부산법인설립전문법무사"],
  },
  {
    path: "/부산법인설립등기",
    compactQueries: ["부산법인설립법무사"],
  },
  {
    path: "/부산상속법무사",
    compactQueries: ["부산상속법무사", "부산법무사상속", "부산상속"],
  },
  {
    path: "/부산상속전문법무사",
    compactQueries: ["부산상속전문법무사"],
  },
  {
    path: "/부산상속등기",
    compactQueries: ["부산상속등기법무사", "부산상속등기"],
  },
  ...GEO_LAWYER_CHAMPIONS,
  {
    path: "/부산법인법무사",
    compactQueries: ["부산회사법무사"],
  },
  {
    path: "/부산법인등기",
    compactQueries: ["부산법인등기법무사"],
  },
  {
    path: "/부산개인회생법무사",
    compactQueries: ["부산개인회생법무사"],
  },
  {
    path: "/부산한정승인",
    compactQueries: ["부산한정승인법무사"],
  },
  {
    path: "/부산부동산등기",
    compactQueries: ["부산부동산등기법무사"],
  },
  {
    path: "/부산법무사비용",
    compactQueries: [
      "부산법무사비용",
      "부산법무사수임료",
      "부산법무사수수료",
      "부산법무사보수",
      "부산법무사가격",
      "부산법무사견적",
    ],
  },
  {
    path: "/상속등기비용",
    compactQueries: [
      "상속등기비용",
      "상속등기수임료",
      "상속등기수수료",
      "상속등기법무사보수",
      "상속법무사비용",
      "상속법무사수수료",
      "상속법무사수임료",
      "상속법무사보수",
    ],
  },
  {
    path: "/개인회생비용",
    compactQueries: [
      "개인회생비용",
      "개인회생수임료",
      "개인회생수수료",
      "부산개인회생비용",
    ],
  },
  {
    path: "/상속포기비용",
    compactQueries: [
      "상속포기비용",
      "상속포기수임료",
      "상속포기수수료",
      "부산상속포기비용",
      "상속포기법무사비용",
      "상속포기법무사수수료",
      "상속포기법무사보수",
    ],
  },
  {
    path: "/한정승인비용",
    compactQueries: ["한정승인비용", "한정승인수임료", "부산한정승인비용"],
  },
  {
    path: "/소유권이전등기비용",
    compactQueries: [
      "소유권이전등기비용",
      "소유권이전비용",
      "매매등기수임료",
    ],
  },
  {
    path: "/법인설립등기비용",
    compactQueries: [
      "법인설립등기비용",
      "법인설립비용",
      "법인설립수임료",
      "법인설립수수료",
    ],
  },
  {
    path: "/법인등기비용",
    compactQueries: ["법인등기비용", "법인등기수임료", "부산법인등기비용"],
  },
  {
    path: "/개인파산비용",
    compactQueries: ["개인파산비용", "개인파산수임료", "부산개인파산비용"],
  },
  {
    path: "/증여등기비용",
    compactQueries: ["증여등기비용", "증여등기수임료"],
  },
  {
    path: "/근저당말소비용",
    compactQueries: ["근저당말소비용", "근저당말소수임료"],
  },
  {
    path: "/임차권등기명령비용",
    compactQueries: ["임차권등기명령비용", "임차권등기비용"],
  },
  {
    path: "/부동산등기비용",
    compactQueries: ["부동산등기비용", "등기비용"],
  },
  ...CITY_INHERITANCE_CHAMPIONS,
];

/** 유입 레일·significantLink를 둘 허브만. 동·사례 전 페이지에 동일 블록을 두지 않는다. */
export const INFLOW_RAIL_ALLOWLIST = new Set<string>([
  "/부산법무사",
  "/부산등기법무사",
  "/부산법무사추천",
  "/부산법무사비교",
  "/부산법무사상담",
  "/부산법무사비용",
  "/부산법무사무소",
  "/busan-legal-map",
  ...BUSAN_DISTRICT_HUB_PATHS,
  "/해운대법무사",
  "/센텀법무사",
  "/재송동법무사",
  "/부산상속법무사",
  "/부산상속등기",
  "/부산상속포기",
  "/부산한정승인",
  "/부산부동산등기",
  "/부산법인법무사",
  "/부산법인등기",
  "/부산개인회생",
  "/부산개인회생법무사",
  "/개인회생파산",
  "/부산개인파산법무사",
  "/about",
  "/office",
  "/services",
  "/contact",
  "/location",
]);

export function normalizeSeoPath(raw: string): string {
  const decoded = normalizeRouteSlug(raw.split("?")[0] ?? raw);
  if (!decoded || decoded === "/") return "/";
  return decoded.startsWith("/") ? decoded : `/${decoded}`;
}

function compactQuery(value: string): string {
  return value.replace(/\s+/g, "");
}

export function isBusanLawyerExactQuery(value: string): boolean {
  return compactQuery(value) === "부산법무사";
}

export function isBusanRenunciationExactQuery(value: string): boolean {
  return compactQuery(value) === "부산상속포기법무사";
}

export function allowsBusanLawyerExactKeywords(path: string): boolean {
  return normalizeSeoPath(path) === BUSAN_LAWYER_CHAMPION_PATH;
}

export function isInflowRailPath(path: string): boolean {
  return INFLOW_RAIL_ALLOWLIST.has(normalizeSeoPath(path));
}

export function getExactKeywordChampionPath(query: string): string | undefined {
  const compact = compactQuery(query);
  return EXACT_KEYWORD_CHAMPIONS.find((row) =>
    row.compactQueries.includes(compact),
  )?.path;
}

export function sanitizePageKeywords(
  path: string,
  keywords: readonly string[] | undefined,
): string[] | undefined {
  if (!keywords || keywords.length === 0) return undefined;
  const normalized = normalizeSeoPath(path);
  const filtered = keywords.filter((item) => {
    const compact = compactQuery(item);
    const rule = EXACT_KEYWORD_CHAMPIONS.find((row) =>
      row.compactQueries.includes(compact),
    );
    if (!rule) return true;
    return normalized === rule.path;
  });
  return filtered.length > 0 ? filtered : undefined;
}
