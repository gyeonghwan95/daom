import {
  LECTURE_100_TARGETS,
  LECTURE_CHAMPION_PATHS,
  LECTURE_EXTRA_INFLOW,
} from "@/data/seo/lecture-100-champions";
import {
  CITY_INHERITANCE_CHAMPION_COUNT,
  GEO_LAWYER_CHAMPION_COUNT,
} from "@/lib/seo/champion-query";

export const ADMIN_PRIORITY_CHAMPIONS: ReadonlyArray<{
  query: string;
  path: string;
}> = [
  { query: "부산 법무사", path: "/" },
  { query: "부산 법무사 사무소", path: "/" },
  { query: "부산 법인 법무사", path: "/" },
  { query: "부산 법무사 상담", path: "/부산법무사상담" },
  { query: "부산법률상담", path: "/부산법률상담" },
  { query: "부산 상속", path: "/부산상속법무사" },
  { query: "부산 상속 법무사", path: "/부산상속법무사" },
  { query: "부산 법무사 상속", path: "/부산상속법무사" },
  { query: "부산 상속포기 법무사", path: "/부산상속포기" },
  { query: "상속포기 법무사", path: "/부산상속포기" },
  { query: "부산 등기전문 법무사", path: "/부산부동산등기전문법무사" },
  { query: "부산 상속전문 법무사", path: "/부산상속전문법무사" },
  { query: "상속 법무사", path: "/상속" },
  { query: "법무사 상속", path: "/상속" },
  { query: "상속 법무사 추천", path: "/상속" },
  { query: "상속등기 법무사", path: "/전국상속등기" },
  { query: "상속포기 법무사 비용", path: "/상속포기비용" },
  { query: "부산 법인등기 법무사", path: "/부산법인등기" },
  { query: "부산 법인전문 법무사", path: "/부산법인설립전문법무사" },
];

export const ADMIN_EXTRA_INFLOW_CHAMPIONS: ReadonlyArray<{
  query: string;
  path: string;
}> = [
  { query: "부산 법무사 추천", path: "/부산법무사추천" },
  { query: "부산 등기 법무사", path: "/부산등기법무사" },
  { query: "부산 상속등기 법무사", path: "/부산상속등기" },
  { query: "부산 법인설립 법무사", path: "/부산법인설립등기" },
  { query: "부산 한정승인 법무사", path: "/부산한정승인" },
  { query: "부산 회사 법무사", path: "/부산법인법무사" },
];

export type LectureOwnerRow = {
  path: string;
  count: number;
  samples: string[];
};

export function lectureOwnerRows(): LectureOwnerRow[] {
  const map = new Map<string, string[]>();
  for (const row of [...LECTURE_100_TARGETS, ...LECTURE_EXTRA_INFLOW]) {
    const list = map.get(row.champion) || [];
    list.push(row.query);
    map.set(row.champion, list);
  }
  return [...map.entries()]
    .map(([path, queries]) => ({
      path,
      count: queries.length,
      samples: queries.slice(0, 3),
    }))
    .sort((a, b) => b.count - a.count);
}

export const ADMIN_SEO_PROGRAMS = [
  {
    id: "priority-19",
    label: "핵심 검색어",
    count: ADMIN_PRIORITY_CHAMPIONS.length,
    detail: "부산 법무사·상속·법인 핵심 쿼리. 홈은 「부산 법무사」만 가져갑니다.",
  },
  {
    id: "geo",
    label: "부산 지역 허브",
    count: GEO_LAWYER_CHAMPION_COUNT,
    detail: "구·군·동·역 법무사 페이지. 지역 검색어는 이 URL들에 매핑됩니다.",
  },
  {
    id: "remote-inheritance",
    label: "타지역 상속 허브",
    count: CITY_INHERITANCE_CHAMPION_COUNT,
    detail: "기존 /업무사례/{도시}상속등기법무사 URL만 사용합니다.",
  },
  {
    id: "lecture",
    label: "특강·강의",
    count: LECTURE_100_TARGETS.length + LECTURE_EXTRA_INFLOW.length,
    detail: `${LECTURE_CHAMPION_PATHS.length}개 기존 강의 URL. 수임 허브와 검색어를 나눕니다.`,
  },
] as const;
