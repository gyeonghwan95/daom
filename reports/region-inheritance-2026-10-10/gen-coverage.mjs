#!/usr/bin/env node
/**
 * 시·도 상속 페이지에 넣을 '시·군·구 커버리지' 데이터 생성.
 * - 행정구역 목록(2026-10 기준, 인천은 개편 대상 구 이름 대신 생활권 이름 사용)
 * - 같은 지역 전용 페이지가 있으면 링크, 없으면 이름만
 * 출력: src/data/seo/region-coverage.ts
 */
import fs from "node:fs";
import path from "node:path";

const DIR = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1"));
const ROOT = path.resolve(DIR, "../..");
const S = JSON.parse(fs.readFileSync(path.join(DIR, "../busan-lawyer-rank-2026-10-10/after11.json"), "utf8"));
const live = (r) => S[r] && !/noindex/.test(S[r].robots || "") && S[r].canonical === r;
const caseSlugs = Object.keys(S).filter((r) => r.startsWith("/업무사례/") && live(r)).map((r) => r.slice("/업무사례/".length));

const SIDO = {
  서울: { kind: "구", names: "종로구 중구 용산구 성동구 광진구 동대문구 중랑구 성북구 강북구 도봉구 노원구 은평구 서대문구 마포구 양천구 강서구 구로구 금천구 영등포구 동작구 관악구 서초구 강남구 송파구 강동구" },
  경기: { kind: "시·군", names: "수원 성남 의정부 안양 부천 광명 평택 동두천 안산 고양 과천 구리 남양주 오산 시흥 군포 의왕 하남 용인 파주 이천 안성 김포 화성 경기광주 양주 포천 여주 연천 가평 양평" },
  인천: { kind: "구·군·생활권", names: "미추홀구 연수구 남동구 부평구 계양구 서구 강화군 옹진군 송도 청라 영종 검단" },
  대전: { kind: "구", names: "동구 중구 서구 유성구 대덕구" },
  광주: { kind: "구", names: "동구 서구 남구 북구 광산구" },
  강원: { kind: "시·군", names: "춘천 원주 강릉 동해 태백 속초 삼척 홍천 횡성 영월 평창 정선 철원 화천 양구 인제 고성 양양" },
  충북: { kind: "시·군", names: "청주 충주 제천 보은 옥천 영동 증평 진천 괴산 음성 단양" },
  충남: { kind: "시·군", names: "천안 공주 보령 아산 서산 논산 계룡 당진 금산 부여 서천 청양 홍성 예산 태안" },
  전북: { kind: "시·군", names: "전주 군산 익산 정읍 남원 김제 완주 진안 무주 장수 임실 순창 고창 부안" },
  전남: { kind: "시·군", names: "목포 여수 순천 나주 광양 담양 곡성 구례 고흥 보성 화순 장흥 강진 해남 영암 무안 함평 영광 장성 완도 진도 신안" },
  경남: { kind: "시·군", names: "창원 진주 통영 사천 김해 밀양 거제 양산 의령 함안 창녕 고성 남해 하동 산청 함양 거창 합천" },
  울산: { kind: "구·군", names: "중구 남구 동구 북구 울주군" },
  제주: { kind: "행정시", names: "제주시 서귀포" },
  경북: { kind: "시·군", names: "포항 경주 김천 안동 구미 영주 영천 상주 문경 경산 의성 청송 영양 영덕 청도 고령 성주 칠곡 예천 봉화 울진 울릉" },
};
// 시·도 이름과 겹쳐 오연결되기 쉬운 짧은 구 이름은 시·도 접두가 붙은 페이지만 인정
const PREFIXED_ONLY = new Set(["중구", "동구", "서구", "남구", "북구", "강서구"]);

// 이름이 같은 다른 시·도 페이지 오연결 방지(확인한 예외): 강원 고성 ≠ 경남 고성군 페이지, 서울 강서구 = /업무사례/강서구상속등기법무사
const OVERRIDE = { "강원:고성": null, "서울:강서구": "강서구상속등기법무사", "경남:고성": "고성군상속등기법무사" };
const out = {};
const missingParents = [];
for (const [sido, { kind, names }] of Object.entries(SIDO)) {
  const parent = `/업무사례/${sido}상속등기법무사`;
  if (!live(parent)) { missingParents.push(parent); continue; }
  const areas = names.split(" ").map((name) => {
    const label = name === "경기광주" ? "광주시" : name;
    const candidates = PREFIXED_ONLY.has(name)
      ? [`${sido}${name}상속등기법무사`]
      : [`${name}상속등기법무사`, `${sido}${name}상속등기법무사`];
    const key = `${sido}:${name}`;
    if (key in OVERRIDE) return { name: label, href: OVERRIDE[key] && caseSlugs.includes(OVERRIDE[key]) ? `/업무사례/${OVERRIDE[key]}` : null };
    let slug = candidates.find((c) => caseSlugs.includes(c));
    if (!slug && !PREFIXED_ONLY.has(name) && name.length >= 2 && !/구$/.test(name)) {
      slug = caseSlugs.find((c) => c.endsWith("상속등기법무사") && c.replace("상속등기법무사", "").includes(name) && c.replace("상속등기법무사", "").length <= name.length * 2 + 1);
    }
    return { name: label, href: slug ? `/업무사례/${slug}` : null };
  });
  out[parent] = { sido, kind, areas };
}
const ts = `/**
 * 시·도 상속 페이지의 시·군·구 커버리지(전용 페이지가 없는 지역도 같은 시·도 페이지에서 안내).
 * 생성: reports/region-inheritance-2026-10-10/gen-coverage.mjs (2026-10-10). 행정구역 2026-10 기준,
 * 인천은 행정체제 개편 대상 구 이름 대신 생활권 이름(송도·청라·영종·검단)을 쓴다.
 */
export type RegionCoverage = { sido: string; kind: string; areas: readonly { name: string; href: string | null }[] };
export const REGION_COVERAGE: Record<string, RegionCoverage> = ${JSON.stringify(out, null, 2)};
`;
fs.writeFileSync(path.join(ROOT, "src/data/seo/region-coverage.ts"), ts);
for (const [p, v] of Object.entries(out)) console.log(p, `areas=${v.areas.length} linked=${v.areas.filter((a) => a.href).length}`, v.areas.filter((a) => a.href).map((a) => `${a.name}→${a.href.slice(6)}`).join(" "));
console.log("missing parents:", missingParents.join(" ") || "none");
