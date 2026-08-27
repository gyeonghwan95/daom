/** 부산 16개 구·군 법무사 허브 — 기존 URL만. 「부산 법무사」 exact는 HOME. */
export const BUSAN_DISTRICT_HUBS = [
  { href: "/중구법무사", label: "중구 법무사", hint: "남포·원도심 상가·주택" },
  { href: "/서구법무사", label: "서구 법무사", hint: "충무·동대신·송도 생활권" },
  { href: "/동구법무사", label: "동구 법무사", hint: "부산역·초량·범일" },
  { href: "/영도구법무사", label: "영도구 법무사", hint: "남항·동삼·봉래" },
  { href: "/부산진구법무사", label: "부산진구 법무사", hint: "서면·부전·전포" },
  { href: "/동래구법무사", label: "동래구 법무사", hint: "온천·사직·명륜" },
  { href: "/남구법무사", label: "남구 법무사", hint: "대연·용호·문현" },
  { href: "/북구법무사", label: "북구 법무사", hint: "덕천·화명·구포" },
  { href: "/해운대법무사", label: "해운대 법무사", hint: "센텀·재송·우동·좌동" },
  { href: "/사하구법무사", label: "사하구 법무사", hint: "하단·괴정·다대" },
  { href: "/금정구법무사", label: "금정구 법무사", hint: "부곡·장전·구서" },
  { href: "/강서구법무사", label: "강서구 법무사", hint: "명지·녹산·대저" },
  { href: "/연제구법무사", label: "연제구 법무사", hint: "연산·거제" },
  { href: "/수영구법무사", label: "수영구 법무사", hint: "광안·민락·남천" },
  { href: "/사상구법무사", label: "사상구 법무사", hint: "주례·감전·엄궁" },
  { href: "/기장군법무사", label: "기장군 법무사", hint: "정관·일광·기장읍" },
] as const;

export const BUSAN_DISTRICT_HUB_PATHS = BUSAN_DISTRICT_HUBS.map(
  (hub) => hub.href,
);

export function isBusanDistrictHubPath(path: string): boolean {
  return (BUSAN_DISTRICT_HUB_PATHS as readonly string[]).includes(path);
}
